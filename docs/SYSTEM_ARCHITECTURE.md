# 🏛️ AgriFarmAssistant: System Architecture & Technical Design

> **Document Version**: 2.5.0  
> **Status**: Production Architecture & File Alignment  
> **Applicable Tech Stack**: Next.js 15 (PWA) + Spring Boot 3.3 (Java 21) + PostgreSQL 16 (pgvector) + Redis 7 + MinIO / Cloudflare R2

---

## 1. Architectural Philosophy & Principles

AgriFarmAssistant is designed as a **Resilient, Modular Monolith Backend** paired with an **Edge-Rendered, Offline-Capable Progressive Web Application (PWA)**. The architectural choices address the unique challenges of rural agricultural environments:

1. **Deterministic Scientific Safety First**: AI advice must never be delivered directly from an LLM without passing through deterministic scientific verification (`Stage2VerificationLayer`).
2. **Zero-Underflow Stock Integrity**: Biological counts (poultry flock birds, pond fish biomass) must be mathematically immutable against race conditions and underflow errors.
3. **Bandwidth & Connectivity Tolerance**: High-latency 2G/3G rural networks demand aggressive client-side caching (Service Worker), lightweight payloads, and resilient SSE streams over fragile WebSockets.
4. **Zero-SMS Dependency**: Traditional SMS OTPs suffer from high telecom failure rates and per-message operational costs. AgriFarmAssistant utilizes instantaneous cryptographically signed **Email OTP** and 30-day JWT sessions.

---

## 2. High-Level System Architecture Diagram

```mermaid
flowchart TB
    subgraph ClientLayer["Frontend Client Layer (Vercel Edge)"]
        PWA["Next.js 15 PWA Client"]
        SW["Service Worker (Cache Storage)"]
        WebSpeech["Web Speech API (STT / TTS)"]
        CamAPI["MediaDevices Camera API"]
    end

    subgraph GatewayLayer["Security & Gateway Filter Chain"]
        JWTFilter["JwtAuthenticationFilter"]
        TenantFilter["TenantContextFilter (ThreadLocal user_id)"]
        RateLimiter["Redis Sliding Window Rate Limiter"]
    end

    subgraph ServiceLayer["Spring Boot 3.3 Application Core"]
        FarmMod["Farm & Livestock Module"]
        ProdEng["Production Engines (FCR, DWG, Biomass)"]
        SafeMort["Safe Mortality Decrement Engine"]
        TeleEng["Water Telemetry & Sensor Pipeline"]
        SchedEng["Scheduled Jobs (Digest, Weather, Aerator)"]
    end

    subgraph AICore["4-Agent ICAR AI Core"]
        AgentRouter["AgentRouter (Intent Dispatcher)"]
        FishSpec["Fisheries Specialist (ICAR-CIFA)"]
        PoultSpec["Poultry Specialist (ICAR-CARI)"]
        FarmSpec["Farm Management Specialist"]
        Stage2["Stage-2 Verification Layer (Hard Matrix)"]
    end

    subgraph DataLayer["Storage & Cache Layer (Railway)"]
        PG[("PostgreSQL 16\n- Relational Data\n- Multi-Tenant RLS\n- chk_positive_stock")]
        PGV[("pgvector\n- HNSW 1536 Index\n- ICAR Research Chunks")]
        RedisCache[("Redis 7 Alpine\n- 30-min Weather Cache\n- OTP Store (10m TTL)\n- Rate Limit Tokens")]
        BlobStore[("MinIO / Cloudflare R2\n- Lesion Photos\n- PDF Farm Reports")]
    end

    PWA -->|HTTPS / SSE| GatewayLayer
    GatewayLayer --> ServiceLayer
    ServiceLayer <--> AICore
    ServiceLayer <--> PG
    ServiceLayer <--> RedisCache
    ServiceLayer <--> BlobStore
    AICore <--> PGV
    AICore --> Stage2
    Stage2 -->|Safe Response| PWA
```

---

## 3. Multi-Tenant Data Isolation Strategy

AgriFarmAssistant operates as a multi-tenant platform where each farmer is an isolated tenant. Tenant isolation is enforced at three distinct defense-in-depth levels:

### Level 1: HTTP Request Interception (`TenantContextFilter`)
Every incoming HTTP request with a Bearer JWT is parsed. The user identity (`user_id`) is extracted and injected into a thread-safe `TenantContextHolder`:

```java
public class TenantContextHolder {
    private static final ThreadLocal<UUID> CURRENT_TENANT = new ThreadLocal<>();

    public static void setTenantId(UUID tenantId) { CURRENT_TENANT.set(tenantId); }
    public static UUID getTenantId() { return CURRENT_TENANT.get(); }
    public static void clear() { CURRENT_TENANT.remove(); }
}
```

### Level 2: Repository-Level Filtering
All entity repositories extend queries with the tenant predicate:
```sql
SELECT f FROM Farm f WHERE f.user.id = :tenantId AND f.deletedAt IS NULL;
```

### Level 3: Database Integrity Constraints
Foreign keys cascade down the hierarchy:
$$\text{User} \longrightarrow \text{Farm} \longrightarrow \{\text{Pond}, \text{PoultryShed}\} \longrightarrow \{\text{FishBatch}, \text{FlockBatch}\}$$

Any attempt to perform an operation on a resource belonging to another tenant throws a `TenantViolationException` (HTTP 403 Forbidden).

---

## 4. Safe Mortality & Stock Concurrency Engine

Accurate mortality tracking is essential for calculating Feed Conversion Ratio (FCR) and Daily Weight Gain (DWG). A common bug in agricultural software is race conditions resulting in negative flock populations.

### Concurrency Protection Mechanism
1. **Pessimistic / Row-Level Lock**: When a mortality log is recorded, the parent batch row is locked:
   ```sql
   SELECT * FROM flock_batches WHERE id = :flockId FOR UPDATE;
   ```
2. **Pre-flight Stock Underflow Check**:
   ```java
   if (batch.getCurrentQuantity() < mortalityDto.getDeadCount()) {
       throw new StockUnderflowException(
           "Dead count (" + mortalityDto.getDeadCount() + 
           ") exceeds available stock (" + batch.getCurrentQuantity() + ")"
       );
   }
   ```
3. **Database Check Constraint**:
   ```sql
   ALTER TABLE flock_batches 
   ADD CONSTRAINT chk_positive_flock_stock CHECK (current_quantity >= 0);

   ALTER TABLE polyculture_stocks 
   ADD CONSTRAINT chk_positive_fish_stock CHECK (current_quantity >= 0);
   ```

---

## 5. The 4-Agent ICAR Multi-AI Core

The AI Advisory Engine does not treat queries with a generic prompt. Instead, queries are analyzed and delegated to specialized domain specialists backed by authentic **ICAR-CIFA** and **ICAR-CARI** knowledge embeddings.

```mermaid
sequenceDiagram
    autonumber
    actor Farmer as 👨‍🌾 Farmer (PWA Voice/Text)
    participant Gateway as 🚪 Spring Boot API
    participant Router as 🧭 AgentRouter
    participant RAG as 📚 pgvector (HNSW)
    participant LLM as ✨ Gemini 1.5 Pro
    participant Stage2 as 🛡️ Stage-2 Verifier
    participant Matrix as 📊 Scientific Limits Table

    Farmer->>Gateway: POST /api/v1/ai/chat/stream {query, pondId}
    Gateway->>Router: routeQuery(query, farmContext)
    Router->>RAG: Cosine Similarity Search (k=4, domain=AQUACULTURE)
    RAG-->>Router: ICAR-CIFA Protocol Chunks
    Router->>LLM: Specialized Prompt + Farm Context + RAG Chunks
    LLM-->>Router: Candidate Clinical Advice / Dosage
    Router->>Stage2: verifyAdvice(candidateText, pondWaterTelemetry)
    Stage2->>Matrix: Check DO, Ammonia & chemical thresholds
    alt Breach Detected (e.g. advice recommends feeding during DO < 3.0 mg/L)
        Stage2-->>Router: Override with Critical Safety Warning
    else Scientifically Valid
        Stage2-->>Router: Approved Candidate
    end
    Router-->>Farmer: Server-Sent Events (SSE) Streamed Response with ICAR Citation
```

### Specialized Agents

| Agent Name | Scientific Origin | Domain Responsibility |
| :--- | :--- | :--- |
| **Fisheries Specialist** | ICAR-CIFA (Bhubaneswar) | Rohu, Catla, Mrigal, Pangasius, Tilapia polyculture, stocking density, feed rations, gill rot, EUS remedies. |
| **Poultry Specialist** | ICAR-CARI (Izatnagar) | Broiler (Cobb/Ross), Layer (BV300), Kadaknath, Desi fowl, FCR curves, Ranikhet/IBD vaccination schedules. |
| **Farm Management Specialist** | Agricultural Economics | Cost of Production (COP/kg), break-even harvesting windows, feed budgeting, mandi price arbitrage. |
| **General Agri Router** | Dual-Classification Model | Analyzes intent, detects emergency indicators (e.g. mass mortality, gasping at surface), routes to specialist. |

---

## 6. Stage-2 Scientific Verification Layer

Large Language Models (LLMs) are prone to hallucinations regarding chemical dosages and threshold limits. AgriFarmAssistant incorporates a **Stage-2 Verification Layer** implemented in Java that programmatically validates all generated advice against hard scientific bounds:

```java
public class Stage2VerificationLayer {
    public VerificationResult verify(String responseText, WaterTelemetry currentWater) {
        // Rule 1: No feeding recommendation if DO < 3.0 mg/L
        if (currentWater.getDissolvedOxygen() < 3.0 && 
            responseText.toLowerCase().contains("feed")) {
            return VerificationResult.override(
                "CRITICAL OVERRIDE: Dissolved Oxygen is below 3.0 mg/L. " +
                "Feeding must be suspended immediately to prevent mass mortality. " +
                "Turn on aerators immediately."
            );
        }
        
        // Rule 2: Chemical dosage cap verification
        // CIFA CIFAX dosage must never exceed 1.0 Litre per hectare-meter
        if (responseText.contains("CIFAX") && extractDose(responseText) > 1.0) {
            return VerificationResult.remedy(
                "Dosage adjusted to maximum safe CIFA threshold: 1.0 L/ha-m."
            );
        }
        
        return VerificationResult.approved(responseText);
    }
}
```

---

## 7. Vision Disease Scanner Pipeline

For optical disease diagnosis (e.g., Red Spot Disease / EUS in carp, Fowl Pox lesions, or Coccidiosis bloody droppings):

```mermaid
flowchart LR
    Cam["📱 Mobile Camera Capture"] --> Compress["Client Image Compression (< 1MB)"]
    Compress --> Upload["MinIO / Cloudflare R2 Bucket"]
    Upload --> PreProc["ImagePreProcessor (Aspect & Contrast)"]
    PreProc --> VisionLLM["Gemini 1.5 Flash Vision Multimodal"]
    VisionLLM --> Match["ICAR Clinical Disease Symptom Matcher"]
    Match --> UI["Diagnosis Card (Confidence %, Remedy, Drug Withdrawal Days)"]
```

1. Images are captured directly via the HTML5 `MediaDevices.getUserMedia()` API or file input.
2. Compressed client-side to under 1.5MB to save farmer mobile data.
3. Uploaded to S3-compatible storage with a short-lived presigned URL.
4. Processed alongside recent pond/flock telemetry (e.g. water temperature, mortality spikes) for multimodal analysis.

---

## 8. Telemetry, Risk Sentinel & Nocturnal Hypoxia Predictor

Dissolved Oxygen (DO) in freshwater ponds follows a diurnal sinusoidal curve driven by photosynthesis:
- **Peak DO**: 03:00 PM – 05:00 PM (algal photosynthesis)
- **Minimum DO (Hypoxia Zone)**: 02:00 AM – 06:00 AM (algal & fish respiration consuming oxygen)

### The Nocturnal Hypoxia Formula
The `NocturnalHypoxiaPredictor` calculates the risk index $R_{\text{hypoxia}}$ daily at 06:00 PM using live Open-Meteo forecasts:

$$R_{\text{hypoxia}} = f(T_{\text{water}}, \text{CloudCover}_{\text{day}}, \text{WindSpeed}_{\text{night}}, \text{BiomassDensity})$$

- If $R_{\text{hypoxia}} > 0.75$, the system triggers:
  1. Instant High-Priority Alert to the Mobile PWA.
  2. Emergency Email Alert via Resend.
  3. Pre-programmed Aerator Schedule: **02:00 AM to 06:00 AM**.

---

## 9. Frontend PWA Architecture & Caching Strategy

The frontend is built on **Next.js 15 App Router** packaged as a **Progressive Web Application (PWA)**.

```mermaid
flowchart TD
    subgraph Browser["Farmer's Device (Mobile / Laptop)"]
        Req["HTTP / Resource Request"]
        SW{"Service Worker (sw.js)"}
        Cache[("CacheStorage\n- App Shell\n- Offline Icons\n- ICAR Guide PDFs")]
        Network["Railway Backend API"]
    end

    Req --> SW
    SW -->|Static Assets / Offline Guides| Cache
    SW -->|Telemetry / Dynamic Data| Network
    Network --o|Network Failure| Cache
```

---

## 10. Complete Project File Alignment Map

Below is the complete, production-grade file arrangement mapping across all tiers of the platform:

```text
agrifarm-assistant/
│
├── .github/
│   └── workflows/
│       ├── backend-ci.yml                   # Spring Boot 3 test & jar build
│       ├── frontend-ci.yml                  # Next.js 15 lint, typecheck & build
│       └── docker-publish.yml               # Containerize & push to registry
│
├── docker/
│   ├── docker-compose.yml                   # Postgres (pgvector), Redis, MinIO
│   ├── Dockerfile.backend                   # JDK 21 Temurin Alpine multi-stage
│   ├── Dockerfile.frontend                  # Node 20 Alpine Next.js multi-stage
│   ├── Dockerfile.pipeline                  # Python 3.11 ETL Worker
│   └── postgres/
│       ├── init-extensions.sql              # CREATE EXTENSION IF NOT EXISTS vector;
│       └── init-roles.sql                   # Multi-tenant user schema grants
│
├── .env.example                             # Master environment template (DB, Gemini, Resend, S3)
├── Makefile                                 # Commands: make dev, make build, make ingest, make seed
├── README.md                                # Master project documentation
│
│
├── agrifarm-backend/                        # 🍃 Spring Boot 3.3 (Java 21) Backend
│   ├── pom.xml                              # Spring AI, Security, Batch, Mail, Pgvector, Redis
│   ├── mvnw
│   ├── mvnw.cmd
│   └── src/
│       ├── main/
│       │   ├── java/com/agrifarm/
│       │   │   ├── AgriFarmApplication.java
│       │   │   │
│       │   │   ├── config/                  # Infrastructure & Security Beans
│       │   │   │   ├── SecurityConfig.java         # Stateless JWT filter + Email OTP endpoints
│       │   │   │   ├── TenantContextFilter.java    # Strict Multi-Tenant user_id isolation
│       │   │   │   ├── CorsConfig.java             # Responsive Laptop & Mobile Web origins
│       │   │   │   ├── SpringAiConfig.java         # Gemini 1.5 Pro/Flash + ChatClient configuration
│       │   │   │   ├── VectorStoreConfig.java      # PgVectorStore with HNSW index config
│       │   │   │   ├── RedisCacheConfig.java       # Cache manager for 30-min weather TTL
│       │   │   │   ├── MinioConfig.java            # MinIO client for disease photos & PDFs
│       │   │   │   └── MailConfig.java             # Resend API / JavaMailSender config
│       │   │   │
│       │   │   ├── common/                  # Cross-Cutting Shared Layer
│       │   │   │   ├── exception/
│       │   │   │   │   ├── GlobalExceptionHandler.java
│       │   │   │   │   ├── TenantViolationException.java
│       │   │   │   │   ├── StockUnderflowException.java   # Prevents negative mortality count
│       │   │   │   │   └── ThresholdBreachException.java
│       │   │   │   ├── response/
│       │   │   │   │   ├── ApiResponse.java        # Standard { success, message, data, timestamp }
│       │   │   │   │   └── PageResponse.java       # Pagination metadata
│       │   │   │   └── util/
│       │   │   │       ├── GeoLocationUtil.java    # Lat/Long distance & agro-climatic zone
│       │   │   │       ├── GrowthCalculator.java   # SGR, DWG, and Biomass formula utilities
│       │   │   │       └── AudioConverterUtil.java # Audio format conversion for speech processing
│       │   │   │
│       │   │   ├── modules/                 # 📦 Feature-Driven Domain Architecture
│       │   │   │   │
│       │   │   │   ├── auth/                # 🔐 Feature 1: Email OTP Login & Security
│       │   │   │   │   ├── controller/AuthController.java
│       │   │   │   │   ├── dto/
│       │   │   │   │   │   ├── SendEmailOtpRequest.java
│       │   │   │   │   │   ├── VerifyEmailOtpRequest.java
│       │   │   │   │   │   └── AuthTokenResponse.java
│       │   │   │   │   ├── model/User.java, EmailOtpToken.java, Role.java
│       │   │   │   │   ├── repository/UserRepository.java, EmailOtpRepository.java
│       │   │   │   │   └── service/
│       │   │   │   │       ├── AuthService.java
│       │   │   │   │       ├── EmailOtpService.java     # Zero-SMS dependency, 6-digit OTP
│       │   │   │   │       └── JwtTokenProvider.java    # 30-day cryptographically signed JWT
│       │   │   │   │
│       │   │   │   ├── farm/                # 🏡 Feature 2: Multi-Farm & GPS Management
│       │   │   │   │   ├── controller/FarmController.java
│       │   │   │   │   ├── dto/FarmCreateDto.java, FarmSummaryDto.java
│       │   │   │   │   ├── model/Farm.java, FarmDomain.java (AQUACULTURE, POULTRY, INTEGRATED)
│       │   │   │   │   ├── repository/FarmRepository.java
│       │   │   │   │   └── service/FarmService.java     # Auto GPS lat/long capture, soft delete
│       │   │   │   │
│       │   │   │   ├── aquaculture/         # 🐟 Feature 3: Fisheries Batch Management
│       │   │   │   │   ├── controller/PondController.java, FisheriesBatchController.java
│       │   │   │   │   ├── dto/PondCreateDto.java, StockingSpecieDto.java, BatchSummaryDto.java
│       │   │   │   │   ├── model/
│       │   │   │   │   │   ├── Pond.java           # Area (acres), depth (feet)
│       │   │   │   │   │   ├── FishBatch.java
│       │   │   │   │   │   └── PolycultureStock.java # Rohu, Catla, Mrigal, Pangasius, Tilapia, Prawn
│       │   │   │   │   ├── repository/PondRepository.java, FishBatchRepository.java
│       │   │   │   │   └── service/AquacultureService.java
│       │   │   │   │
│       │   │   │   ├── poultry/             # 🐔 Feature 4: Poultry Batch Management
│       │   │   │   │   ├── controller/PoultryShedController.java, FlockController.java
│       │   │   │   │   ├── dto/ShedCreateDto.java, FlockCreateDto.java, VaccineRecordDto.java
│       │   │   │   │   ├── model/
│       │   │   │   │   │   ├── PoultryShed.java    # Area (sq. ft.), density
│       │   │   │   │   │   ├── FlockBatch.java     # Broiler, Layer, Desi, Kadaknath, Quail
│       │   │   │   │   │   └── VaccineSchedule.java # Feature 10: Marek, Ranikhet, IBD, Fowl Pox
│       │   │   │   │   ├── repository/FlockBatchRepository.java, VaccineScheduleRepository.java
│       │   │   │   │   └── service/PoultryService.java, VaccinationService.java
│       │   │   │   │
│       │   │   │   ├── growth/              # ⚖️ Feature 5: Biological Growth & Target Weights
│       │   │   │   │   ├── controller/GrowthSamplingController.java
│       │   │   │   │   ├── dto/WeightSamplingDto.java, GrowthAnalyticsDto.java
│       │   │   │   │   ├── model/SamplingLog.java
│       │   │   │   │   ├── repository/SamplingLogRepository.java
│       │   │   │   │   └── service/GrowthCalculationService.java # DWG (g/day), SGR %, Biomass
│       │   │   │   │
│       │   │   │   ├── feeding/             # 🥣 Feature 6: Predictive Feeding & FCR Engine
│       │   │   │   │   ├── controller/FeedingController.java
│       │   │   │   │   ├── dto/FeedLogDto.java, FeedForecastDto.java, PelletRecommendationDto.java
│       │   │   │   │   ├── model/DailyFeedLog.java, FeedType.java
│       │   │   │   │   ├── repository/DailyFeedLogRepository.java
│       │   │   │   │   └── service/
│       │   │   │   │       ├── FeedingEngineService.java       # FCR calculation & 14-day history
│       │   │   │   │       └── PredictiveFeedScheduler.java    # 10-day forward feed demand model
│       │   │   │   │
│       │   │   │   ├── mortality/           # 💀 Feature 7: Safe Mortality Tracking Engine
│       │   │   │   │   ├── controller/MortalityController.java
│       │   │   │   │   ├── dto/MortalityLogDto.java, SurvivalRateDto.java
│       │   │   │   │   ├── model/MortalityRecord.java, MortalityCause.java
│       │   │   │   │   ├── repository/MortalityRepository.java
│       │   │   │   │   └── service/SafeMortalityService.java   # Safe decrement, underflow protection
│       │   │   │   │
│       │   │   │   ├── waterquality/        # 💧 Feature 8: Water Quality Telemetry
│       │   │   │   │   ├── controller/WaterQualityController.java
│       │   │   │   │   ├── dto/WaterTelemetryDto.java, QualityAlertDto.java
│       │   │   │   │   ├── model/WaterTelemetryLog.java       # pH, DO, Temp, NH3, NO2-, Transparency
│       │   │   │   │   ├── repository/WaterTelemetryRepository.java
│       │   │   │   │   └── service/WaterQualityService.java
│       │   │   │   │
│       │   │   │   ├── health/              # 🩺 Feature 9: Clinical Observations & Treatments
│       │   │   │   │   ├── controller/HealthTreatmentController.java
│       │   │   │   │   ├── dto/ClinicalObservationDto.java, TreatmentScheduleDto.java
│       │   │   │   │   ├── model/ClinicalLog.java, TreatmentRecord.java
│       │   │   │   │   ├── repository/TreatmentRecordRepository.java
│       │   │   │   │   └── service/HealthTreatmentService.java # Withdrawal period tracking
│       │   │   │   │
│       │   │   │   ├── finance/             # 💰 Feature 11: Farm Financials & Expenses
│       │   │   │   │   ├── controller/FinanceController.java
│       │   │   │   │   ├── dto/ExpenseLogDto.java, CostOfProductionDto.java
│       │   │   │   │   ├── model/ExpenseRecord.java, ExpenseCategory.java
│       │   │   │   │   ├── repository/ExpenseRepository.java
│       │   │   │   │   └── service/FinanceService.java         # COP per kg harvested biomass
│       │   │   │   │
│       │   │   │   ├── ai/                  # 🤖 Feature 12, 13, 14: 4-Agent Multi-AI Core
│       │   │   │   │   ├── controller/AiAdvisoryChatController.java  # SSE streaming endpoint
│       │   │   │   │   ├── dto/ChatQueryDto.java, StreamChunkDto.java, DiagnosisResultDto.java
│       │   │   │   │   ├── model/AiConversationHistory.java, AiMessage.java
│       │   │   │   │   ├── agents/          # Specialized Domain Agents
│       │   │   │   │   │   ├── AgentRouter.java                # Routes query by intent
│       │   │   │   │   │   ├── FisheriesAiSpecialist.java      # ICAR-CIFA certified protocols
│       │   │   │   │   │   ├── PoultryAiSpecialist.java        # ICAR-CARI standards
│       │   │   │   │   │   └── FarmManagementAiSpecialist.java # Economics & harvest schedules
│       │   │   │   │   ├── verification/
│       │   │   │   │   │   ├── Stage2VerificationLayer.java    # Validates vs scientific tables
│       │   │   │   │   │   └── ScientificThresholdMatrix.java  # Hard water/feed limits
│       │   │   │   │   ├── rag/
│       │   │   │   │   │   ├── PgVectorKnowledgeRetriever.java # Similarity + Hybrid search
│       │   │   │   │   │   └── PromptTemplateManager.java      # Merges farm context + protocol
│       │   │   │   │   ├── vision/          # Feature 13: Photo Disease Analysis
│       │   │   │   │   │   ├── DiseaseVisionService.java       # Gemini Multimodal / Leaf / Fin
│       │   │   │   │   │   └── ImagePreProcessor.java
│       │   │   │   │   └── voice/           # Feature 14: Voice Assistant
│       │   │   │   │   │   ├── VoiceTranscriptionService.java  # Hindi/English STT
│       │   │   │   │   │   └── VoiceSynthesisService.java      # TTS Native playback
│       │   │   │   │
│       │   │   │   ├── weather/             # 🌦️ Feature 15: Weather Risk Sentinel
│       │   │   │   │   ├── controller/WeatherRiskController.java
│       │   │   │   │   ├── client/OpenMeteoClient.java          # Live GPS weather client
│       │   │   │   │   ├── dto/WeatherRiskDto.java, HypoxiaForecastDto.java
│       │   │   │   │   ├── service/
│       │   │   │   │   │   ├── WeatherSentinelService.java      # 30-min Redis cached provider
│       │   │   │   │   │   ├── NocturnalHypoxiaPredictor.java   # Humidity/cloud overnight DO drop
│       │   │   │   │   │   ├── AeratorSchedulerService.java     # 02:00 AM - 06:00 AM aerator plan
│       │   │   │   │   │   └── PoultryThermalIndexService.java  # Heat stress curtain/sprinkler alert
│       │   │   │   │
│       │   │   │   ├── email/               # 📧 Feature 16: Resend Email Sentinel
│       │   │   │   │   ├── client/ResendEmailClient.java
│       │   │   │   │   ├── template/
│       │   │   │   │   │   ├── MorningDigestTemplate.java       # Bilingual (Hindi/English)
│       │   │   │   │   │   └── EmergencyAlertTemplate.java
│       │   │   │   │   └── service/
│       │   │   │   │       ├── MorningDigestScheduler.java      # 07:00 AM cron trigger
│       │   │   │   │       └── EmergencyEmailAlertService.java  # Instant storm/hypoxia alert
│       │   │   │   │
│       │   │   │   ├── reports/             # 📊 Feature 17: Reports & Export Engine
│       │   │   │   │   ├── controller/ReportsController.java
│       │   │   │   │   ├── service/FarmReportExportService.java # Bank loan & subsidy PDF generation
│       │   │   │   │
│       │   │   │   └── tasks/               # ✅ Feature 18: Checklist & In-App Alerts
│       │   │   │       ├── controller/TaskAlertController.java
│       │   │   │       ├── model/DailyTask.java, InAppAlert.java (CRITICAL, WARNING, INFO)
│       │   │   │       ├── repository/TaskRepository.java, AlertRepository.java
│       │   │   │       └── service/TaskAlertService.java        # Unread counters & checklists
│       │   │   │
│       │   │   └── pipeline/                # ⚙️ Internal Spring Batch ETL Jobs
│       │   │       ├── mandi/MandiBatchSyncJob.java         # Daily APMC commodity price sync
│       │   │       └── telemetry/TelemetryPurgeBatch.java
│       │   │
│       │   └── resources/
│       │       ├── application.yml              # Base settings
│       │       ├── application-dev.yml          # Local Postgres + pgvector + Redis
│       │       ├── application-prod.yml         # Cloud credentials, Resend API key
│       │       ├── prompts/                     # Spring AI StringTemplates (.st)
│       │       │   ├── fisheries-cifa-agent.st
│       │       │   ├── poultry-cari-agent.st
│       │       │   ├── stage2-verification.st
│       │       │   └── vision-diagnostic.st
│       │       └── db/migration/                # Flyway Migrations
│       │           ├── V1__init_auth_and_farms.sql
│       │           ├── V2__init_aquaculture_and_poultry.sql
│       │           ├── V3__init_telemetry_growth_feeding.sql
│       │           ├── V4__init_pgvector_and_knowledge_tables.sql
│       │           └── V5__init_hnsw_vector_indexes.sql
│       │
│       └── test/
│           ├── java/com/agrifarm/
│           │   ├── auth/EmailOtpAuthTest.java
│           │   ├── feeding/FeedingEngineTest.java
│           │   ├── growth/GrowthCalculationTest.java
│           │   ├── ai/Stage2VerificationTest.java
│           │   └── mortality/SafeMortalityDecrementTest.java
│           └── resources/application-test.yml
│
│
├── agrifarm-rag-pipeline/                   # 🐍 Python Knowledge Ingestion & ETL
│   ├── requirements.txt                     # langchain, unstructured, pypdf, psycopg2, pgvector
│   ├── config.py                            # Database credentials & embedding model keys
│   ├── data/
│   │   ├── raw_protocols/                   # Authentic scientific research documents
│   │   │   ├── icar_cifa_aquaculture_manual.pdf
│   │   │   ├── icar_cari_poultry_management.pdf
│   │   │   ├── fish_disease_treatment_matrix.pdf
│   │   │   └── water_quality_critical_thresholds.csv
│   │   └── reference_tables/
│   │       ├── feeding_rate_by_body_weight.json
│   │       └── poultry_vaccine_schedule_india.json
│   │
│   ├── parsers/
│   │   ├── protocol_pdf_parser.py           # Extracts text, tables, and disease remedy charts
│   │   └── threshold_matrix_parser.py       # Converts safety limits to structured embeddings
│   │
│   ├── processors/
│   │   ├── semantic_chunker.py              # Chunks by species (Rohu/Broiler), disease, stage
│   │   └── metadata_enricher.py             # Tags: { domain: "aquaculture", species: "Rohu" }
│   │
│   ├── embedder/
│   │   └── pgvector_upserter.py             # Computes embeddings & performs batch insert
│   │
│   └── main_ingest.py                       # CLI Runner: python main_ingest.py --domain all
│
│
├── agrifarm-frontend/                       # 🌐 Next.js 15 Responsive PWA (Mobile + Laptop)
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts                   # Theme palettes: Cyan (Aqua), Crimson (Poultry), Green (Agri)
│   ├── postcss.config.mjs
│   ├── next.config.ts                       # PWA headers, camera permissions, MinIO domains
│   │
│   ├── public/                              # PWA Assets
│   │   ├── manifest.json                    # PWA Manifest (standalone display, theme colors)
│   │   ├── sw.js                            # Service Worker for offline crop/fish guide caching
│   │   ├── icons/                           # 192x192, 512x512 maskable app icons
│   │   └── audio/                           # Audio notifications for emergency alerts
│   │
│   └── src/
│       ├── app/                             # Next.js 15 App Router
│       │   ├── layout.tsx                   # Top Navbar (Desktop), Bottom Bar (Mobile), Providers
│       │   ├── page.tsx                     # Landing / Quick Overview
│       │   │
│       │   ├── login/                       # 🔐 Email OTP Login
│       │   │   └── page.tsx                 # Instant Email OTP form (No password/SMS delay)
│       │   │
│       │   ├── dashboard/                   # 🏡 Unified Dashboard
│       │   │   └── page.tsx                 # Adaptive: Multi-column on Laptop, Stacked on Mobile
│       │   │
│       │   ├── aquaculture/                 # 🐟 Fisheries Hub
│       │   │   ├── page.tsx                 # Pond overview, standing biomass, water state
│       │   │   ├── [pondId]/page.tsx        # Species sampling, DWG, SGR, 10-day feeding forecast
│       │   │   └── feeding/page.tsx         # Daily feeding log & FCR comparison graph
│       │   │
│       │   ├── poultry/                     # 🐔 Poultry Hub
│       │   │   ├── page.tsx                 # Shed overview, flock counts, age in weeks
│       │   │   ├── [flockId]/page.tsx       # Breed metrics, thermal comfort index
│       │   │   └── vaccines/page.tsx        # Feature 10: Vaccine calendar & overdue alerts
│       │   │
│       │   ├── water-telemetry/             # 💧 Water Quality Dashboard
│       │   │   └── page.tsx                 # Color-coded gauges: pH, DO, Temp, NH3, NO2-
│       │   │
│       │   ├── advisory/                    # 🤖 4-Agent AI Chat (Voice + Text)
│       │   │   └── page.tsx                 # Streaming SSE chat, ICAR citations, waveform mic
│       │   │
│       │   ├── disease-doctor/              # 📸 Vision AI Disease Scanner
│       │   │   └── page.tsx                 # Mobile camera capture, fin/scale/comb symptom check
│       │   │
│       │   ├── weather-sentinel/            # 🌦️ Weather & Aerator Planner
│       │   │   └── page.tsx                 # Nocturnal hypoxia warning, 02:00-06:00 AM aerator plan
│       │   │
│       │   ├── financials/                  # 💰 Cost & Expense Manager
│       │   │   └── page.tsx                 # Operating expense breakdown & COP/kg calculator
│       │   │
│       │   ├── reports/                     # 📊 Farm Reports & Subsidies
│       │   │   └── page.tsx                 # One-click exportable PDF generator
│       │   │
│       │   └── settings/                    # 🌐 Settings & Language
│       │       └── page.tsx                 # 100% Hindi / English toggle, Morning email config
│       │
│       ├── components/                      # UI Components
│       │   ├── layout/                      # Responsive Shells
│       │   │   ├── DesktopNavbar.tsx        # Top status header for laptops (Unread counter)
│       │   │   ├── DesktopSidebar.tsx       # Collapsible navigation for widescreen
│       │   │   └── MobileBottomBar.tsx      # Feature 20: 5-tab thumb-friendly mobile bottom nav
│       │   │
│       │   ├── ui/                          # shadcn/ui Design System
│       │   │   ├── button.tsx, card.tsx, input.tsx, badge.tsx, skeleton.tsx
│       │   │   ├── dialog.tsx               # Modals for Laptop
│       │   │   └── drawer.tsx               # Slide-up bottom sheets for Mobile
│       │   │
│       │   ├── domain-themes/               # Feature 20: Theme Providers
│       │   │   ├── AquacultureThemeWrapper.tsx # Cyan / Blue accent theme
│       │   │   ├── PoultryThemeWrapper.tsx     # Crimson / Amber barn theme
│       │   │   └── AgriThemeWrapper.tsx        # Emerald green theme
│       │   │
│       │   ├── ai/                          # AI Chat & Voice
│       │   │   ├── StreamingMessage.tsx     # Character-by-character typewriter effect
│       │   │   ├── IcarCitationFootnote.tsx # Displays verified scientific manual source
│       │   │   ├── VoiceWaveform.tsx        # Feature 14: Dynamic microphone audio wave
│       │   │   └── AgentSelectorBadge.tsx   # Displays active agent (Fisheries, Poultry, etc.)
│       │   │
│       │   ├── camera/                      # Feature 13: Vision Disease Scanner
│       │   │   ├── CameraCaptureModal.tsx   # Accesses mobile back camera / laptop webcam
│       │   │   └── LesionPreviewCard.tsx
│       │   │
│       │   ├── gauges/                      # Feature 8: Visual Gauges
│       │   │   ├── WaterQualityGauge.tsx    # Green/Yellow/Red dial for DO, pH, Ammonia
│       │   │   └── GrowthProgressRing.tsx   # % to Target Harvest Weight
│       │   │
│       │   ├── tasks/                       # Feature 18: Checklist & Alerts
│       │   │   ├── DailyChecklistWidget.tsx # Morning DO check, feeding, aerator test
│       │   │   └── SeverityAlertBanner.tsx  # CRITICAL / WARNING / INFO alerts
│       │   │
│       │   └── charts/                      # Feature 5 & 6: Analytical Charts
│       │       ├── FcrComparisonChart.tsx   # Recommended vs actual feed disbursed
│       │       ├── BiomassGrowthChart.tsx   # SGR & DWG curve
│       │       └── WeatherHypoxiaChart.tsx  # 12-hour nighttime DO risk curve
│       │
│       ├── hooks/                           # Custom Business Logic Hooks
│       │   ├── useResponsive.ts             # Detects isMobile / isLaptop viewport
│       │   ├── useStreamingChat.ts          # Consumes Spring Boot SSE text stream
│       │   ├── useVoiceAssistant.ts         # Web Speech Recognition + Synthesis
│       │   ├── useCameraScanner.ts          # MediaDevices API wrapper
│       │   ├── useGeolocation.ts            # Auto GPS coordinates capture
│       │   └── useLanguage.ts               # Feature 19: 100% Hindi/English switch hook
│       │
│       ├── i18n/                            # Feature 19: Pure Localization Dictionaries
│       │   ├── en.json                      # 100% Clean English translations
│       │   └── hi.json                      # 100% Authentic Devanagari Hindi translations
│       │
│       ├── lib/                             # Core Utilities
│       │   ├── api-client.ts                # Axios instance with 30-day JWT headers
│       │   ├── calculations.ts              # Client-side mirror of SGR, FCR, Biomass
│       │   └── pwa-register.ts              # Service worker registration
│       │
│       └── types/                           # TypeScript Domain Models
│           ├── auth.types.ts
│           ├── aquaculture.types.ts
│           ├── poultry.types.ts
│           ├── telemetry.types.ts
│           └── ai.types.ts
│
└── docs/                                    # Documentation & Specifications
    ├── SYSTEM_ARCHITECTURE.md               # Flow diagrams, multi-agent protocol, file mapping
    ├── SCIENTIFIC_THRESHOLDS.md             # ICAR-CIFA and ICAR-CARI threshold specs
    ├── API_SPECIFICATION.md                 # Full OpenAPI 3.0 / Swagger schema
    └── DEPLOYMENT_GUIDE.md                  # Docker Compose, Vercel & Railway setup
```

---

## 11. Feature-to-File Alignment Mapping

To guarantee 100% architectural coverage, the table below maps each of the 20 functionalities to their primary backend and frontend files:

| # | Required Functionality | Primary Backend Files | Primary Frontend Files |
| :-: | :--- | :--- | :--- |
| **1** | **Email OTP Auth & Multi-Tenant** | `modules/auth/EmailOtpService.java`, `TenantContextFilter.java` | `app/login/page.tsx` |
| **2** | **Farm Management (Live GPS)** | `modules/farm/FarmService.java` | `hooks/useGeolocation.ts`, `app/dashboard/` |
| **3** | **Aquaculture & Species Management** | `modules/aquaculture/AquacultureService.java` | `app/aquaculture/`, `app/aquaculture/[pondId]/` |
| **4** | **Poultry Batch Management** | `modules/poultry/PoultryService.java` | `app/poultry/`, `app/poultry/[flockId]/` |
| **5** | **Biological Growth, DWG, SGR** | `modules/growth/GrowthCalculationService.java` | `components/gauges/GrowthProgressRing.tsx` |
| **6** | **Feed Engine, FCR & Forecast** | `modules/feeding/FeedingEngineService.java` | `components/charts/FcrComparisonChart.tsx` |
| **7** | **Safe Mortality Tracking** | `modules/mortality/SafeMortalityService.java` | `app/aquaculture/[pondId]/`, `app/poultry/[flockId]/` |
| **8** | **Water Quality Telemetry** | `modules/waterquality/WaterQualityService.java` | `components/gauges/WaterQualityGauge.tsx` |
| **9** | **Health & Treatment Log** | `modules/health/HealthTreatmentService.java` | `app/aquaculture/[pondId]/`, `app/poultry/[flockId]/` |
| **10** | **Poultry Vaccination Calendar** | `modules/poultry/VaccinationService.java` | `app/poultry/vaccines/page.tsx` |
| **11** | **Financials & COP/kg** | `modules/finance/FinanceService.java` | `app/financials/page.tsx` |
| **12** | **4-Agent ICAR Multi-AI Core** | `modules/ai/agents/*`, `Stage2VerificationLayer.java` | `components/ai/IcarCitationFootnote.tsx` |
| **13** | **Vision Disease Scanner** | `modules/ai/vision/DiseaseVisionService.java` | `app/disease-doctor/page.tsx`, `CameraCaptureModal.tsx` |
| **14** | **Voice Recognition (Hindi/Eng)** | `modules/ai/voice/VoiceTranscriptionService.java` | `components/ai/VoiceWaveform.tsx`, `useVoiceAssistant.ts` |
| **15** | **Weather & Hypoxia Sentinel** | `modules/weather/NocturnalHypoxiaPredictor.java` | `app/weather-sentinel/page.tsx` |
| **16** | **07:00 AM Email Digest & Alerts** | `modules/email/MorningDigestScheduler.java` | `app/settings/page.tsx` |
| **17** | **Reports & Subsidy Exports** | `modules/reports/FarmReportExportService.java` | `app/reports/page.tsx` |
| **18** | **Tasks Checklist & In-App Alerts** | `modules/tasks/TaskAlertService.java` | `components/tasks/DailyChecklistWidget.tsx` |
| **19** | **100% Hindi/English Localization** | Backend supports bilingual email templates & prompt templates | `i18n/hi.json`, `i18n/en.json`, `useLanguage.ts` |
| **20** | **UI/UX Themes & Mobile Nav** | Domain metadata served via REST APIs | `components/layout/MobileBottomBar.tsx`, `domain-themes/` |

---

## 12. Database Schema Alignment (pgvector & Multi-Tenant)

In Flyway migrations `V1` through `V5`:

### 12.1 Multi-Tenant Relational Hierarchy
$$\text{users} \longrightarrow \text{farms (lat, long, domain)} \longrightarrow \{\text{ponds}, \text{poultry\_sheds}\} \longrightarrow \{\text{fish\_batches}, \text{flock\_batches}\}$$

### 12.2 Safe Decrement Validation
```sql
-- Ensure stock counts can never underflow
ALTER TABLE flock_batches 
ADD CONSTRAINT chk_positive_flock_stock CHECK (current_quantity >= 0);

ALTER TABLE polyculture_stocks 
ADD CONSTRAINT chk_positive_fish_stock CHECK (current_quantity >= 0);
```

### 12.3 Vector Embeddings Table with HNSW Index
```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE knowledge_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain VARCHAR(50) NOT NULL,            -- AQUACULTURE, POULTRY, GENERAL
    species VARCHAR(100),                   -- Rohu, Catla, Broiler, Layer
    category VARCHAR(100),                  -- DISEASE, FEEDING, WATER_QUALITY
    content TEXT NOT NULL,
    metadata JSONB NOT NULL,
    embedding vector(1536)                  -- pgvector column for Gemini embeddings
);

-- Approximate Nearest Neighbor (ANN) index using Hierarchical Navigable Small World (HNSW)
CREATE INDEX idx_knowledge_embeddings_hnsw 
ON knowledge_embeddings USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```
