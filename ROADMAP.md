# 🗺️ AgriFarmAssistant — 5-Phase Execution Roadmap

> **Team Size:** 3 Engineers | **Architecture:** Next.js 15 PWA + Single Spring Boot 3.3 (Java 21) Container + Supabase (PostgreSQL 16 + `pgvector` + Storage) + Upstash Redis + Resend  
> **Guardrails:** See [`AGENTS.md`](AGENTS.md) before starting any stage.

---

## 👥 Team Ownership Matrix

| Role | Owner | Primary Domains & Responsibilities |
| :--- | :--- | :--- |
| **Member 1 (Lead)** | Full-Stack Lead | `agrifarm-frontend/` (Next.js 15 PWA, i18n, themes, UI) + Core Backend (`modules/auth/`, `modules/weather/`, `modules/email/`, REST API integration & deployment) |
| **Member 2 (Database Engineer)** | Data & Schema Lead | Supabase PostgreSQL 16 + `pgvector` schema design, Flyway migrations (`V1__init_schema.sql`+), `media_history`, HNSW & time-series indexing, HikariCP tuning, and seed data |
| **Member 3 (RAG / AI Engineer)** | AI & Spring AI Lead | 100% Java Spring AI ETL ingestion (`modules/ai/rag/ingestion/`), ICAR-CIFA & ICAR-CARI PDF/CSV chunking, 768-dim `PgVectorStore` upsert & retrieval, 4-Agent Core, and `Stage2VerificationLayer` |

---

## 📅 5-Phase, Multi-Stage Execution Plan

### Phase 1: Frontend (`agrifarm-frontend/`)
*Primary Owner: Member 1 (Lead)*

- **Stage 1.1 — Core Shell, Auth & Multi-Farm UI**
  - Responsive layout (`DesktopNavbar`, `DesktopSidebar`, `MobileBottomBar`), domain themes (`FisheriesThemeWrapper`, `PoultryThemeWrapper`, `AgriThemeWrapper`), 100% Hindi/English i18n (`hi.json`, `en.json`), Email OTP login (`/login`), and Multi-Farm GPS onboarding (`/dashboard`).
- **Stage 1.2 — Core Operations Dashboards**
  - Fisheries Pond & Polyculture Hub (`/fisheries`, `/fisheries/[pondId]`), Poultry Shed & Vaccination Calendar (`/poultry`, `/poultry/[poultryId]`, `/poultry/vaccines`), Water Quality Telemetry gauges (`/water-telemetry`), Daily Feeding & FCR charts (`/fisheries/feeding`), and Safe Mortality & Health treatment dialogs.
- **Stage 1.3 — Intelligence, Financials & API Contracts**
  - Weather & Nocturnal Hypoxia Sentinel (`/weather-sentinel`), Financials & COP/kg (`/financials`), PDF Reports & Subsidies (`/reports`), Tasks & In-App Alerts, Voice/Vision UI (`/advisory`, `/disease-doctor`), and typed mock API contracts aligned with [`docs/API_SPECIFICATION.md`](docs/API_SPECIFICATION.md).

---

### Phase 2: Backend (`agrifarm-backend/`)
*Primary Owner: Member 1 (Lead) + Member 2 (Schema alignment)*

- **Stage 2.1 — Security, Legacy Cleanup & Auth**
  - Remove legacy MongoDB config (`spring-boot-starter-data-mongodb` in `pom.xml`, legacy `.env.example` / `application*.yml` properties) and MinIO dependencies.
  - Configure Spring Security (stateless 30-day JWT + `TenantContextFilter`), Resend Email OTP (`/auth/email/send-otp`, `/auth/email/verify-otp`), and Upstash Redis (OTP TTL + sliding-window rate limiting).
- **Stage 2.2 — Core Domain CRUD & Media Storage**
  - Implement REST APIs with `ApiResponse<T>` for Farms (`modules/farm/`), Fisheries (`modules/fisheries/`), Poultry & Vaccines (`modules/poultry/`), Growth (`modules/growth/`), Feeding & FCR (`modules/feeding/`), Water Quality (`modules/waterquality/`), Health (`modules/health/`), Safe Mortality (`modules/mortality/` with `FOR UPDATE` underflow protection), and **Supabase Storage** (`agrifarm-media` bucket) presigned/signed uploads recorded in `media_history`.
- **Stage 2.3 — Weather Sentinel, Financials, Reports & Tasks**
  - Implement Open-Meteo client with 30-min Upstash Redis TTL, `NocturnalHypoxiaPredictor`, `AeratorSchedulerService`, `PoultryThermalIndexService`, `FinanceService` (COP/kg), `FarmReportExportService` (PDF), `TaskAlertService`, and `MorningDigestScheduler` (07:00 AM Resend email). Align all DTOs and endpoints with Frontend.

---

### Phase 3: Database (Supabase PostgreSQL 16 + `pgvector`)
*Primary Owner: Member 2 (Database Engineer)*

- **Stage 3.1 — Relational Schema & Flyway Migrations**
  - Provision Supabase PostgreSQL 16 project, configure Flyway migrations (`V1__init_schema.sql` through `V5+`), and normalize all 20-module tables (`users`, `farms`, `ponds`, `fish_batches`, `polyculture_stocks`, `poultry_sheds`, `poultry_batches`, `vaccine_schedules`, `sampling_logs`, `daily_feed_logs`, `mortality_records`, `water_telemetry_logs`, `clinical_logs`, `treatment_records`, `expense_records`, `daily_tasks`, `in_app_alerts`, `media_history`).
- **Stage 3.2 — `pgvector` Extension & HNSW Vector Store**
  - Enable `CREATE EXTENSION IF NOT EXISTS vector;` in Supabase, create Spring AI `vector_store` table (`embedding vector(768)` + `metadata JSONB`), and create the HNSW cosine similarity index (`m = 16, ef_construction = 64`).
- **Stage 3.3 — Multi-Tenant Isolation, Pooling & Seed Data**
  - Enforce `chk_positive_poultry_stock` and `chk_positive_fish_stock` constraints, add composite time-series indexes (`(pond_id, logged_at DESC)`, `(user_id, created_at DESC)`), tune HikariCP pool sizing for single-container Railway/Render + Supabase Transaction Pooler, and author realistic Indian aquaculture/poultry seed data.

---

### Phase 4: RAG & AI Core (100% Java / Spring AI)
*Primary Owner: Member 3 (RAG / AI Engineer)*

- **Stage 4.1 — Java Spring AI ETL Pipeline (`modules/ai/rag/ingestion/`)**
  - Build native Spring AI ETL pipeline inside `agrifarm-backend`:
    - **Extract:** `PagePdfDocumentReader` / `TikaDocumentReader` for ICAR-CIFA & ICAR-CARI PDFs and CSVs.
    - **Transform:** `TokenTextSplitter` + custom `MetadataEnricher` tagging `{ domain, species, stage }`.
    - **Trigger:** Admin-protected `POST /api/v1/admin/rag/ingest` and `--spring.profiles.active=ingest`.
- **Stage 4.2 — Embedding & `PgVectorStore` Upsert**
  - Generate 768-dimensional embeddings via Spring AI Gemini embedding model and upsert chunks into Supabase `pgvector` using `PgVectorStore` (`vectorStore.accept(chunks)`).
- **Stage 4.3 — 4-Agent AI Core, Stage-2 Verification, Vision & Voice**
  - Implement `AgentRouter`, `FisheriesAiSpecialist`, `PoultryAiSpecialist`, `FarmManagementAiSpecialist`, and `PgVectorKnowledgeRetriever` (metadata-filtered cosine similarity).
  - Implement SSE streaming (`/api/v1/ai/advisory/stream`), `Stage2VerificationLayer` (enforcing [`docs/SCIENTIFIC_THRESHOLDS.md`](docs/SCIENTIFIC_THRESHOLDS.md)), `DiseaseVisionService` (using `agrifarm-media` URLs), and Hindi/English voice support.

---

### Phase 5: Polishing & Production
*Owners: All Members (1, 2, 3)*

- **Stage 5.1 — End-to-End Integration Testing**
  - Verify full flows across Next.js 15 PWA, Spring Boot 3.3 API, Supabase PostgreSQL + `pgvector` + Storage, Upstash Redis, and Resend Email.
- **Stage 5.2 — Performance, Offline PWA & Security Audit**
  - Load test for 50 concurrent users, verify Service Worker offline caching (`sw.js`), verify sliding-window rate limiting, audit multi-tenant isolation (`TenantContextFilter`), and run JVM memory profiling (`-XX:MaxRAMPercentage=75`).
- **Stage 5.3 — Production Deployment**
  - Deploy Frontend to **Vercel**, single Backend + Java RAG container to **Railway** or **Render**, Database & Storage on **Supabase**, Cache/OTP on **Upstash Redis**, and Emails on **Resend** per [`docs/DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md).
