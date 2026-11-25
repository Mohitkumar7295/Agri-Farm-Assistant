# 🌾 AgriFarmAssistant (कृषि-फार्म सहायक)

> **Next-Generation Autonomous Precision Agriculture, Fisheries & Poultry Operating System**  
> Powered by Next.js 15 PWA, Spring Boot 3.3 (Java 21) + Spring AI, Supabase (PostgreSQL 16 + `pgvector` + Storage), Upstash Redis, and Resend.

---

## 🌟 Executive Summary

**AgriFarmAssistant** is an enterprise-grade, mobile-first Progressive Web Application (PWA) and backend platform built for small-to-large-scale farmers across India and global developing agricultural economies. It unifies **Fisheries**, **Poultry Management**, and **Integrated Crop-Livestock Farming** into a single platform backed by authentic scientific protocols from **ICAR-CIFA** (Central Institute of Freshwater Aquaculture) and **ICAR-CARI** (Central Avian Research Institute).

The platform features:
- **Zero-Password Authentication**: Instant, reliable 6-digit Email OTP login via Resend (no SMS gateway failures or costs).
- **Safe Mortality & Biological Engines**: Guaranteed mathematical constraints preventing negative poultry/fish counts, with automated Daily Weight Gain (DWG), Specific Growth Rate (SGR), and Feed Conversion Ratio (FCR) analytics.
- **100% Java 4-Agent Multi-AI Core**: Cascading Gemini LLM architecture powered by **Spring AI** and **Supabase `pgvector`**, verified against hard scientific threshold tables (`Stage2VerificationLayer`) before any advice reaches the farmer.
- **Nocturnal Hypoxia & Weather Sentinel**: Predicts midnight dissolved oxygen crashes in fish ponds and extreme poultry heat stress using live GPS weather telemetry.
- **Bilingual Accessibility**: 100% native Devanagari Hindi and English localization with real-time speech input/output.

---

## 🏗️ Target Production Tech Stack

| Layer | Technology | Deployment Platform | Notes |
| :--- | :--- | :--- | :--- |
| **Frontend PWA** | Next.js 15 (App Router), React 19, Tailwind CSS, shadcn/ui | **Vercel** | Edge Network, Service Worker offline caching, mobile bottom bar |
| **Backend + Java RAG** | Spring Boot 3.3, Java 21 LTS, Spring Security, **Spring AI** | **Railway / Render** | Single containerized Eclipse Temurin 21 Alpine service, stateless JWT |
| **Database & Vector Store** | PostgreSQL 16 + `pgvector` (768-dim HNSW) | **Supabase** | Relational schema, Flyway migrations, HNSW vector store, multi-tenant isolation |
| **Media / Object Storage** | Supabase Storage (`agrifarm-media` bucket) | **Supabase Storage** | Lesion photos, lab reports, generated loan PDFs (optional Cloudflare R2 upgrade later) |
| **Cache, OTP & Rate Limit** | Serverless Redis | **Upstash Redis** | 30-min weather TTL, Mandi cache, sliding-window rate limiting, 10-min OTP tokens |
| **Email Sentinel** | Resend API / JavaMailSender | **Resend** | Email OTP, 07:00 AM daily digest & instant hypoxia/storm alerts |

> [!NOTE]
> **Legacy Scaffolding Notice:** Any existing MongoDB configuration in `.env.example` or `agrifarm-backend/pom.xml` (`spring-boot-starter-data-mongodb`) is legacy scaffolding and will be removed/migrated to **Supabase (PostgreSQL 16 + `pgvector`)** in Phase 2/3. See [`AGENTS.md`](AGENTS.md) and [`ROADMAP.md`](ROADMAP.md).

---

## 🎯 20 Core Feature Alignment Matrix

| # | Feature Name | Backend Module | Frontend Route / Component | Documentation |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Email OTP Auth & Multi-Tenant** | `modules/auth/`, `TenantContextFilter.java` | `/login`, `app/login/page.tsx` | [`API_SPECIFICATION.md`](docs/API_SPECIFICATION.md#2-authentication--identity-endpoints-auth) |
| **2** | **Multi-Farm GPS Management** | `modules/farm/FarmService.java` | `/dashboard`, `hooks/useGeolocation.ts` | [`SYSTEM_ARCHITECTURE.md`](docs/SYSTEM_ARCHITECTURE.md#3-multi-tenant-data-isolation-strategy) |
| **3** | **Fisheries & Species Hub** | `modules/fisheries/FisheriesService.java` | `/fisheries`, `[pondId]/page.tsx` | [`SCIENTIFIC_THRESHOLDS.md`](docs/SCIENTIFIC_THRESHOLDS.md#1-icar-cifa-fisheries-standards) |
| **4** | **Poultry Batch Management** | `modules/poultry/PoultryService.java` | `/poultry`, `[poultryId]/page.tsx` | [`SCIENTIFIC_THRESHOLDS.md`](docs/SCIENTIFIC_THRESHOLDS.md#3-icar-cari-poultry-standards) |
| **5** | **Biological Growth, DWG, SGR** | `modules/growth/GrowthCalculationService.java` | `components/gauges/GrowthProgressRing.tsx` | [`SCIENTIFIC_THRESHOLDS.md`](docs/SCIENTIFIC_THRESHOLDS.md#6-growth--feed-mathematical-formulas) |
| **6** | **Feed Engine, FCR & Forecast** | `modules/feeding/FeedingEngineService.java` | `/fisheries/feeding`, `FcrComparisonChart.tsx` | [`SCIENTIFIC_THRESHOLDS.md`](docs/SCIENTIFIC_THRESHOLDS.md#6-growth--feed-mathematical-formulas) |
| **7** | **Safe Mortality Engine** | `modules/mortality/SafeMortalityService.java` | `/fisheries/[pondId]`, `/poultry/[poultryId]` | [`SYSTEM_ARCHITECTURE.md`](docs/SYSTEM_ARCHITECTURE.md#4-safe-mortality--stock-concurrency-engine) |
| **8** | **Water Quality Telemetry** | `modules/waterquality/WaterQualityService.java` | `/water-telemetry`, `WaterQualityGauge.tsx` | [`SCIENTIFIC_THRESHOLDS.md`](docs/SCIENTIFIC_THRESHOLDS.md#2-water-quality-critical-threshold-matrix) |
| **9** | **Health & Treatment Log** | `modules/health/HealthTreatmentService.java` | Clinical observation dialogs & withdrawal alerts | [`API_SPECIFICATION.md`](docs/API_SPECIFICATION.md#9-water-quality-telemetry-water-quality) |
| **10** | **Poultry Vaccination Calendar** | `modules/poultry/VaccinationService.java` | `/poultry/vaccines`, Vaccine reminders | [`SCIENTIFIC_THRESHOLDS.md`](docs/SCIENTIFIC_THRESHOLDS.md#5-national-poultry-vaccination-protocol-india-standard) |
| **11** | **Farm Financials & COP/kg** | `modules/finance/FinanceService.java` | `/financials`, Cost per kg harvested biomass | [`SYSTEM_ARCHITECTURE.md`](docs/SYSTEM_ARCHITECTURE.md#11-feature-to-file-alignment-mapping) |
| **12** | **4-Agent ICAR Multi-AI Core (Java)** | `modules/ai/agents/`, `modules/ai/rag/ingestion/`, `Stage2VerificationLayer.java` | `/advisory`, `IcarCitationFootnote.tsx` | [`SYSTEM_ARCHITECTURE.md`](docs/SYSTEM_ARCHITECTURE.md#5-the-4-agent-icar-multi-ai-core) |
| **13** | **Vision Disease Scanner** | `modules/ai/vision/DiseaseVisionService.java` | `/disease-doctor`, `CameraCaptureModal.tsx` | [`SYSTEM_ARCHITECTURE.md`](docs/SYSTEM_ARCHITECTURE.md#7-vision-disease-scanner-pipeline) |
| **14** | **Voice Assistant (Hindi/Eng)** | `modules/ai/voice/VoiceTranscriptionService.java` | `VoiceWaveform.tsx`, `useVoiceAssistant.ts` | [`API_SPECIFICATION.md`](docs/API_SPECIFICATION.md#10-ai-advisory-streaming-multi-agent-core-aiadvisory) |
| **15** | **Weather & Hypoxia Sentinel** | `modules/weather/NocturnalHypoxiaPredictor.java` | `/weather-sentinel`, `WeatherHypoxiaChart.tsx` | [`SYSTEM_ARCHITECTURE.md`](docs/SYSTEM_ARCHITECTURE.md#8-telemetry-risk-sentinel--nocturnal-hypoxia-predictor) |
| **16** | **07:00 AM Email Sentinel** | `modules/email/MorningDigestScheduler.java` | `/settings`, Bilingual email notification engine | [`DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md#part-4-upstash-redis--resend-email-sentinel) |
| **17** | **Reports & Subsidy Exports** | `modules/reports/FarmReportExportService.java` | `/reports`, PDF Bank Loan & Subsidy generator | [`SYSTEM_ARCHITECTURE.md`](docs/SYSTEM_ARCHITECTURE.md#11-feature-to-file-alignment-mapping) |
| **18** | **Tasks Checklist & In-App Alerts**| `modules/tasks/TaskAlertService.java` | `DailyChecklistWidget.tsx`, `SeverityAlertBanner.tsx` | [`SYSTEM_ARCHITECTURE.md`](docs/SYSTEM_ARCHITECTURE.md#11-feature-to-file-alignment-mapping) |
| **19** | **100% Hindi/English i18n** | Bilingual DB/Email Templates & STT/TTS | `i18n/hi.json`, `i18n/en.json`, `useLanguage.ts` | [`SYSTEM_ARCHITECTURE.md`](docs/SYSTEM_ARCHITECTURE.md#9-frontend-pwa-architecture--caching-strategy) |
| **20** | **UI/UX Themes & Mobile Nav** | Domain metadata served via REST APIs | `MobileBottomBar.tsx`, `domain-themes/` | [`SYSTEM_ARCHITECTURE.md`](docs/SYSTEM_ARCHITECTURE.md#9-frontend-pwa-architecture--caching-strategy) |

---

## 🏛️ High-Level System Architecture

```mermaid
flowchart TD
    subgraph Client["📱 Frontend PWA (Vercel)"]
        Browser["Next.js 15 PWA Client"]
        SW["Service Worker (sw.js - Offline Cache)"]
        Voice["Web Speech API (Hindi/Eng STT & TTS)"]
        Cam["MediaDevices Camera API"]
    end

    subgraph Cloud["☁️ Railway / Render (Single Backend Container)"]
        subgraph Backend["🍃 Spring Boot 3.3 + Spring AI (Temurin 21 Alpine)"]
            Sec["Security & Tenant Filter (JWT + TenantContext)"]
            Router["4-Agent Router & AI Core"]
            ETL["Spring AI Java ETL (modules/ai/rag/ingestion/)"]
            Stage2["Stage-2 Scientific Threshold Verifier"]
            ProdEng["Production Engines (FCR, DWG, Mortality)"]
            Cron["Schedulers (07:00 AM Digest, Weather Sentinel)"]
        end
    end

    subgraph Supabase["🟢 Supabase Cloud"]
        PG[("🐘 PostgreSQL 16 + pgvector (768-dim HNSW)")]
        SupaStore[("🪣 Supabase Storage (agrifarm-media)")]
    end

    subgraph External["🌐 Serverless & External Services"]
        Redis[("⚡ Upstash Redis (OTP, Weather TTL, Rate Limit)")]
        Gemini["✨ Google Gemini API"]
        OpenMeteo["🌦️ Open-Meteo GPS Weather API"]
        Resend["📧 Resend Email API"]
    end

    Browser <-->|HTTPS REST & SSE Streams| Sec
    Sec --> Router
    Sec --> ProdEng
    ETL -->|PgVectorStore Upsert| PG
    Router -->|RAG Cosine Sim| PG
    Router -->|Prompt + Context| Gemini
    Gemini --> Stage2
    Stage2 -->|Validated Advice| Browser
    ProdEng <--> PG
    Cron --> OpenMeteo
    Cron --> Redis
    Cron --> Resend
    Cam -->|Upload Image| SupaStore
    SupaStore --> Stage2
```

---

## 🚀 Quick Start Guide (Local Development)

### 1. Prerequisites
- **Node.js**: v20.x or v22.x LTS
- **JDK**: Eclipse Temurin 21 LTS
- **Docker & Docker Compose**: (For local PostgreSQL + `pgvector` and Redis development only)
- **Git**: Latest version

### 2. Clone and Setup Environment
```bash
git clone https://github.com/Mohitkumar7295/Agri-Farm-Assistant.git
cd Agri-Farm-Assistant

# Copy example environment configuration
cp .env.example .env
```

### 3. Start Local Dev Infrastructure via Docker Compose
> `docker-compose.yml` is strictly for **local development** (production uses Supabase + Upstash Redis).
```bash
docker compose -f docker/docker-compose.yml up -d
```
This boots up local development containers:
- PostgreSQL 16 on port `5432` with `vector` (`pgvector`) extension pre-loaded
- Redis 7 on port `6379`

### 4. Run Spring Boot Backend (Includes Java Spring AI RAG)
```bash
cd agrifarm-backend
./mvnw clean spring-boot:run -Dspring-boot.run.profiles=dev
```
Backend will start on `http://localhost:8080`. Flyway migrations will execute automatically.

To run the Java Spring AI ICAR manual ingestion pipeline locally:
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev,ingest
# Or trigger via Admin REST endpoint: POST /api/v1/admin/rag/ingest
```

### 5. Run Next.js 15 PWA Frontend
```bash
cd ../agrifarm-frontend
npm install
npm run dev
```
Frontend will be accessible at `http://localhost:3000`.

---

## ☁️ Deployment Summary (Free-Tier Friendly Cloud Stack)

- **Frontend (Next.js 15)**: Deployed to **Vercel** with zero-configuration Edge deployment, Next.js App Router streaming support, and PWA capabilities. See [`DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md#part-2-vercel-frontend-deployment-nextjs-15-pwa).
- **Backend + Java RAG (Spring Boot 3.3)**: Deployed as a **single container** to **Railway** or **Render** using a multi-stage Temurin 21 Alpine Dockerfile optimized for low memory (`-XX:MaxRAMPercentage=75`).
- **Database & Vector Store**: Provisioned on **Supabase** (PostgreSQL 16 + `pgvector` 768-dim HNSW index).
- **Media / Object Storage**: **Supabase Storage** (`agrifarm-media` bucket) for disease diagnosis photos, lab reports, and exportable PDFs (with optional Cloudflare R2 upgrade later).
- **Cache, OTP & Rate Limiting**: **Upstash Redis** (serverless).
- **Email OTP & Digests**: **Resend**.

---

## 📚 Documentation & Planning Deep Dives

1. **[AI Agent Guardrails (`AGENTS.md`)](AGENTS.md)**: Mandatory constraints, source-of-truth rules, and verification checklist for all contributors and AI agents.
2. **[5-Phase Team Roadmap (`ROADMAP.md`)](ROADMAP.md)**: 3-person team ownership matrix and 5-phase, multi-stage execution plan.
3. **[Architecture Overview (`ARCHITECTURE.md`)](ARCHITECTURE.md)**: High-level diagrams, file tree, and 20-module feature mapping.
4. **[System Architecture & Data Flows (`docs/SYSTEM_ARCHITECTURE.md`)](docs/SYSTEM_ARCHITECTURE.md)**: Multi-Agent design, Java Spring AI ETL pipeline, Stage-2 Verification, Safe Decrement Engine, and PWA Service Worker caching.
5. **[Scientific Thresholds & ICAR Protocols (`docs/SCIENTIFIC_THRESHOLDS.md`)](docs/SCIENTIFIC_THRESHOLDS.md)**: ICAR-CIFA carp fisheries standards, ICAR-CARI poultry standards, water quality matrices, and disease formulas.
6. **[API Specification & OpenAPI Documentation (`docs/API_SPECIFICATION.md`)](docs/API_SPECIFICATION.md)**: Full REST, SSE, and Java RAG Admin Ingestion API contracts across all 20 modules.
7. **[Deployment Guide (`docs/DEPLOYMENT_GUIDE.md`)](docs/DEPLOYMENT_GUIDE.md)**: Complete guide to provisioning on Vercel, Railway/Render, Supabase, Upstash Redis, and Resend.

---

## 🛡️ License & Acknowledgements

- **Scientific Backing**: Derived from open research published by the **Indian Council of Agricultural Research (ICAR)**, **CIFA Bhubaneswar**, and **CARI Izatnagar**.
- **License**: MIT Open Source License.
