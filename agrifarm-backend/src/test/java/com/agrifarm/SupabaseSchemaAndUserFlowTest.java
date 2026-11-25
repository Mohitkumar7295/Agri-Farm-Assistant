package com.agrifarm;

import com.agrifarm.modules.auth.model.Role;
import com.agrifarm.modules.auth.model.User;
import com.agrifarm.modules.auth.repository.UserRepository;
import com.agrifarm.modules.auth.service.EmailOtpService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class SupabaseSchemaAndUserFlowTest {

    private static final String TEST_USER_EMAIL = "rgupta69450@gmail.com";

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailOtpService emailOtpService;

    @Test
    void verifyAllTablesAndPgvectorExistInSupabase() {
        List<String> expectedTables = List.of(
                "users",
                "email_otp_tokens",
                "farms",
                "ponds",
                "fish_batches",
                "polyculture_stocks",
                "poultry_sheds",
                "poultry_batches",
                "vaccine_schedules",
                "sampling_logs",
                "daily_feed_logs",
                "mortality_records",
                "water_telemetry_logs",
                "clinical_logs",
                "treatment_records",
                "expense_records",
                "daily_tasks",
                "in_app_alerts",
                "media_history",
                "vector_store",
                "flyway_schema_history"
        );

        List<String> actualTables = jdbcTemplate.queryForList(
                "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
                String.class
        );

        for (String table : expectedTables) {
            assertTrue(actualTables.contains(table), "Missing expected table in Supabase public schema: " + table);
        }

        Integer vectorExtCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM pg_extension WHERE extname = 'vector'",
                Integer.class
        );
        assertEquals(1, vectorExtCount, "pgvector extension must be enabled");

        Integer hnswIndexCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'vector_store' AND indexname = 'idx_vector_store_hnsw'",
                Integer.class
        );
        assertEquals(1, hnswIndexCount, "HNSW index idx_vector_store_hnsw must exist on vector_store");
    }

    @Test
    void verifyFullRelationalFlowAndConstraintsForUserEmail() {
        User user = userRepository.findByEmail(TEST_USER_EMAIL).orElseGet(() -> {
            User created = User.builder()
                    .fullName("R. Gupta")
                    .email(TEST_USER_EMAIL)
                    .mobileNumber("9876543210")
                    .country("India")
                    .state("Madhya Pradesh")
                    .district("Indore")
                    .villageOrCity("Sanwer")
                    .pincode("452010")
                    .latitude(22.9747)
                    .longitude(75.8022)
                    .role(Role.FARMER)
                    .preferredLanguage("hi")
                    .termsAgreed(true)
                    .emailVerified(true)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();
            return userRepository.save(created);
        });

        UUID userId = user.getId();
        assertNotNull(userId);

        UUID farmId = jdbcTemplate.queryForObject(
                "INSERT INTO farms (user_id, name, domain, latitude, longitude, total_area_acres) VALUES (?, 'Test Integrated Farm', 'INTEGRATED', 22.97, 75.80, 4.5) RETURNING id",
                UUID.class, userId
        );
        assertNotNull(farmId);

        UUID vectorId = null;
        try {
            UUID pondId = jdbcTemplate.queryForObject(
                    "INSERT INTO ponds (farm_id, name, water_area_acres, depth_feet, has_aerator) VALUES (?, 'Pond-A1', 1.2, 6.0, true) RETURNING id",
                    UUID.class, farmId
            );
            UUID fishBatchId = jdbcTemplate.queryForObject(
                    "INSERT INTO fish_batches (pond_id, batch_code, stocking_date) VALUES (?, 'FISH-TEST-01', CURRENT_DATE) RETURNING id",
                    UUID.class, pondId
            );
            UUID stockId = jdbcTemplate.queryForObject(
                    "INSERT INTO polyculture_stocks (fish_batch_id, specie, initial_quantity, current_quantity, initial_avg_weight_grams, current_avg_weight_grams) VALUES (?, 'Rohu', 1000, 990, 50.0, 250.0) RETURNING id",
                    UUID.class, fishBatchId
            );

            UUID shedId = jdbcTemplate.queryForObject(
                    "INSERT INTO poultry_sheds (farm_id, shed_name, length_feet, width_feet, capacity_birds) VALUES (?, 'Shed-1', 60.0, 30.0, 2000) RETURNING id",
                    UUID.class, farmId
            );
            UUID poultryBatchId = jdbcTemplate.queryForObject(
                    "INSERT INTO poultry_batches (shed_id, batch_code, breed, category, initial_quantity, current_quantity, hatch_date, initial_avg_weight_grams, current_avg_weight_grams) VALUES (?, 'POULTRY-TEST-01', 'Cobb 400', 'BROILER', 1000, 995, CURRENT_DATE, 42.0, 120.0) RETURNING id",
                    UUID.class, shedId
            );

            // Verify positive stock check constraints reject negative values
            assertThrows(DataIntegrityViolationException.class, () ->
                    jdbcTemplate.update("UPDATE polyculture_stocks SET current_quantity = -1 WHERE id = ?", stockId)
            );
            assertThrows(DataIntegrityViolationException.class, () ->
                    jdbcTemplate.update("UPDATE poultry_batches SET current_quantity = -1 WHERE id = ?", poultryBatchId)
            );

            // Insert into remaining operational, health, finance, task, alert, media & vector tables
            jdbcTemplate.update(
                    "INSERT INTO vaccine_schedules (poultry_batch_id, vaccine_name, disease_prevented, scheduled_date) VALUES (?, 'Lasota', 'Newcastle Disease', CURRENT_DATE)",
                    poultryBatchId
            );
            jdbcTemplate.update(
                    "INSERT INTO sampling_logs (user_id, entity_type, batch_id, specie, sample_size_count, average_weight_grams, sampling_date) VALUES (?, 'FISHERIES', ?, 'Rohu', 20, 260.0, CURRENT_DATE)",
                    userId, fishBatchId
            );
            jdbcTemplate.update(
                    "INSERT INTO daily_feed_logs (user_id, entity_type, entity_id, feed_type, quantity_kg) VALUES (?, 'FISHERIES', ?, 'Floating Pellet 28%', 12.5)",
                    userId, fishBatchId
            );
            jdbcTemplate.update(
                    "INSERT INTO mortality_records (user_id, entity_type, entity_id, dead_count, suspected_cause, log_date) VALUES (?, 'FISHERIES', ?, 2, 'Handling stress', CURRENT_DATE)",
                    userId, fishBatchId
            );
            jdbcTemplate.update(
                    "INSERT INTO water_telemetry_logs (user_id, pond_id, dissolved_oxygen, ph, temperature_celsius, ammonia_tan) VALUES (?, ?, 5.8, 7.6, 27.5, 0.02)",
                    userId, pondId
            );
            jdbcTemplate.update(
                    "INSERT INTO clinical_logs (user_id, entity_type, entity_id, symptoms, severity) VALUES (?, 'POULTRY', ?, 'Mild respiratory rattle', 'LOW')",
                    userId, poultryBatchId
            );
            jdbcTemplate.update(
                    "INSERT INTO treatment_records (user_id, entity_type, entity_id, medication_name, dosage, withdrawal_days) VALUES (?, 'POULTRY', ?, 'Electrolyte + Vitamin C', '1g/L water', 0)",
                    userId, poultryBatchId
            );
            jdbcTemplate.update(
                    "INSERT INTO expense_records (farm_id, user_id, domain, category, amount_inr, description) VALUES (?, ?, 'FISHERIES', 'FEED', 2400.00, 'Starter fish feed bag')",
                    farmId, userId
            );
            jdbcTemplate.update(
                    "INSERT INTO daily_tasks (farm_id, user_id, title, domain, priority) VALUES (?, ?, 'Check morning DO levels', 'FISHERIES', 'HIGH')",
                    farmId, userId
            );
            jdbcTemplate.update(
                    "INSERT INTO in_app_alerts (user_id, farm_id, alert_type, severity, title, message) VALUES (?, ?, 'VACCINE_DUE', 'WARNING', 'Lasota Vaccine Due', 'Day 7 Lasota due for Shed-1')",
                    userId, farmId
            );
            jdbcTemplate.update(
                    "INSERT INTO media_history (user_id, entity_type, entity_id, object_path) VALUES (?, 'FISHERIES', ?, 'tests/sample-lesion.jpg')",
                    userId, fishBatchId
            );

            vectorId = jdbcTemplate.queryForObject(
                    "INSERT INTO vector_store (content, metadata) VALUES ('ICAR-CIFA Rohu stocking guideline', '{\"domain\":\"FISHERIES\",\"species\":\"Rohu\"}'::jsonb) RETURNING id",
                    UUID.class
            );
            assertNotNull(vectorId);

            // Verify OTP generation & verification flow for rgupta69450@gmail.com
            EmailOtpService.OtpDispatchResult otpResult = emailOtpService.generateAndSendOtp(TEST_USER_EMAIL);
            assertNotNull(otpResult);
            assertNotNull(otpResult.otp());
            assertTrue(emailOtpService.verifyOtp(TEST_USER_EMAIL, otpResult.otp()));
        } finally {
            if (vectorId != null) {
                jdbcTemplate.update("DELETE FROM vector_store WHERE id = ?", vectorId);
            }
            jdbcTemplate.update("DELETE FROM farms WHERE id = ?", farmId);
            jdbcTemplate.update("DELETE FROM sampling_logs WHERE user_id = ?", userId);
            jdbcTemplate.update("DELETE FROM daily_feed_logs WHERE user_id = ?", userId);
            jdbcTemplate.update("DELETE FROM mortality_records WHERE user_id = ?", userId);
            jdbcTemplate.update("DELETE FROM treatment_records WHERE user_id = ?", userId);
            jdbcTemplate.update("DELETE FROM clinical_logs WHERE user_id = ?", userId);
            jdbcTemplate.update("DELETE FROM media_history WHERE user_id = ?", userId);
            jdbcTemplate.update("DELETE FROM email_otp_tokens WHERE email = ?", TEST_USER_EMAIL);
        }
    }
}
