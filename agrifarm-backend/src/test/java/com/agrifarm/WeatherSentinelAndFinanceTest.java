package com.agrifarm;

import com.agrifarm.config.TenantContextHolder;
import com.agrifarm.modules.auth.model.User;
import com.agrifarm.modules.auth.repository.UserRepository;
import com.agrifarm.modules.finance.controller.FinanceController;
import com.agrifarm.modules.finance.dto.CopSummaryResponse;
import com.agrifarm.modules.finance.dto.ExpenseCreateDto;
import com.agrifarm.modules.finance.model.ExpenseRecord;
import com.agrifarm.modules.finance.service.FinanceService;
import com.agrifarm.modules.weather.controller.WeatherController;
import com.agrifarm.modules.weather.dto.WeatherSentinelRiskResponse.MandatoryAeratorSchedule;
import com.agrifarm.modules.weather.dto.WeatherSentinelRiskResponse.PoultryThermalAssessment;
import com.agrifarm.modules.weather.service.AeratorSchedulerService;
import com.agrifarm.modules.weather.service.NocturnalHypoxiaPredictor;
import com.agrifarm.modules.weather.service.PoultryThermalIndexService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
class WeatherSentinelAndFinanceTest {

    private static final UUID SEEDED_FARM_ID = UUID.fromString("11111111-1111-4111-8111-111111111101");

    @Autowired
    private NocturnalHypoxiaPredictor hypoxiaPredictor;

    @Autowired
    private AeratorSchedulerService aeratorSchedulerService;

    @Autowired
    private PoultryThermalIndexService poultryThermalIndexService;

    @Autowired
    private WeatherController weatherController;

    @Autowired
    private FinanceService financeService;

    @Autowired
    private FinanceController financeController;

    @Autowired
    private UserRepository userRepository;

    @AfterEach
    void clearTenant() {
        TenantContextHolder.clear();
    }

    @Test
    void verifyHypoxiaPredictorAndAeratorSchedulerThresholds() {
        var critical = hypoxiaPredictor.computeRisk(34.5, 85, 95, 3.0, 2.6);
        assertEquals("CRITICAL", critical.riskLevel());
        assertTrue(critical.riskIndex() >= 0.75);

        MandatoryAeratorSchedule criticalSchedule = aeratorSchedulerService.buildSchedule(critical);
        assertTrue(criticalSchedule.isAeratorRunRequired());
        assertEquals("12:00 AM", criticalSchedule.getStartTime());
        assertEquals(6, criticalSchedule.getRecommendedHours());

        var low = hypoxiaPredictor.computeRisk(24.0, 55, 10, 12.0, 6.8);
        assertEquals("LOW", low.riskLevel());
        MandatoryAeratorSchedule lowSchedule = aeratorSchedulerService.buildSchedule(low);
        assertFalse(lowSchedule.isAeratorRunRequired());
        assertEquals(0, lowSchedule.getRecommendedHours());
    }

    @Test
    void verifyPoultryThermalIndexMatrix() {
        PoultryThermalAssessment comfort = poultryThermalIndexService.assess(20.0, 50);
        assertEquals("COMFORT", comfort.getStatus());
        assertTrue(comfort.getThiValue() < 70.0);

        PoultryThermalAssessment alert = poultryThermalIndexService.assess(24.0, 65);
        assertEquals("ALERT", alert.getStatus());
        assertTrue(alert.getThiValue() >= 70.0 && alert.getThiValue() < 76.0);

        PoultryThermalAssessment danger = poultryThermalIndexService.assess(29.0, 75);
        assertEquals("DANGER", danger.getStatus());
        assertTrue(danger.getThiValue() >= 76.0 && danger.getThiValue() < 82.0);

        PoultryThermalAssessment emergency = poultryThermalIndexService.assess(36.0, 80);
        assertEquals("EMERGENCY", emergency.getStatus());
        assertTrue(emergency.getThiValue() >= 82.0);
    }

    @Test
    void verifyWeatherRiskAndFinanceCopEndpointsForSeededFarm() throws Exception {
        User user = userRepository.findByEmail("rgupta69450@gmail.com").orElseThrow();
        TenantContextHolder.setTenantId(user.getId());

        MockMvc weatherMvc = MockMvcBuilders.standaloneSetup(weatherController).build();
        weatherMvc.perform(get("/api/v1/weather/risk/" + SEEDED_FARM_ID)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.nocturnalHypoxiaRiskIndex").isNumber())
                .andExpect(jsonPath("$.data.hypoxiaRiskLevel").isString())
                .andExpect(jsonPath("$.data.mandatoryAeratorSchedule.startTime").isString())
                .andExpect(jsonPath("$.data.poultryThermalIndex.status").isString());

        ExpenseCreateDto dto = new ExpenseCreateDto();
        dto.setFarmId(SEEDED_FARM_ID);
        dto.setDomain("FISHERIES");
        dto.setCategory("MEDICINE");
        dto.setAmountInr(new BigDecimal("1500.00"));
        dto.setDescription("Probiotics & lime test expense");

        ExpenseRecord saved = financeService.recordExpense(dto);
        assertNotNull(saved.getId());
        try {
            MockMvc financeMvc = MockMvcBuilders.standaloneSetup(financeController).build();
            financeMvc.perform(get("/api/v1/finance/cop/" + SEEDED_FARM_ID)
                            .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.totalExpenseInr").isNumber())
                    .andExpect(jsonPath("$.data.overallCostPerKgInr").isNumber());

            CopSummaryResponse cop = financeService.calculateCostOfProduction(SEEDED_FARM_ID);
            assertTrue(cop.getTotalExpenseInr().compareTo(new BigDecimal("67500.00")) >= 0);
            assertTrue(cop.getTotalBiomassKg() > 0.0);
            assertTrue(cop.getOverallCostPerKgInr().compareTo(BigDecimal.ZERO) > 0);
        } finally {
            financeService.deleteExpense(saved.getId());
        }
    }
}
