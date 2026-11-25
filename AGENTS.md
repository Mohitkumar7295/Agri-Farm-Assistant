# 🤖 AGENTS.md — Mandatory Guardrails for AI Coding Agents

> **READ THIS FILE FIRST.** Every AI coding agent, copilot, or contributor working in this repository MUST follow these rules strictly to prevent architectural drift, hallucinated dependencies, and cross-module conflicts.

---

## 1. Source of Truth

Before writing, editing, or scaffolding any code, you MUST read:
1. [`AGENTS.md`](AGENTS.md) (this file — hard constraints & verification checklist)
2. [`ARCHITECTURE.md`](ARCHITECTURE.md) (system overview, module map, file tree)
3. [`ROADMAP.md`](ROADMAP.md) (3-person team ownership & current Phase/Stage)
4. Relevant spec in `docs/`:
   - [`docs/SYSTEM_ARCHITECTURE.md`](docs/SYSTEM_ARCHITECTURE.md)
   - [`docs/API_SPECIFICATION.md`](docs/API_SPECIFICATION.md)
   - [`docs/SCIENTIFIC_THRESHOLDS.md`](docs/SCIENTIFIC_THRESHOLDS.md)
   - [`docs/DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md)

---

## 2. Hard Technology Constraints

### 2.1 Database — Supabase PostgreSQL 16 + `pgvector` ONLY
- **USE:** **Supabase (PostgreSQL 16 + `pgvector`)** via **Spring Data JPA** + **Flyway** migrations (`agrifarm-backend/src/main/resources/db/migration/`).
- **NEVER** generate MongoDB `@Document` annotations, `MongoRepository`, `MongoTemplate`, `spring-boot-starter-data-mongodb`, or any NoSQL schema/code.
- **Legacy Note:** Any existing MongoDB configuration in `.env.example` or `agrifarm-backend/pom.xml` is legacy scaffolding and is scheduled for removal/migration to Supabase in Phase 2/3. Do **not** build new features on top of it.

### 2.2 RAG & AI Core — 100% Java with Spring AI ONLY
- **USE:** **100% Java** using **Spring AI** inside `agrifarm-backend/src/main/java/com/agrifarm/modules/ai/`.
  - **ETL Ingestion (`modules/ai/rag/ingestion/`):** `PagePdfDocumentReader` / `TikaDocumentReader` $\rightarrow$ `TokenTextSplitter` + custom `MetadataEnricher` (`{ domain, species, stage }`) $\rightarrow$ Spring AI `PgVectorStore` (`vectorStore.accept(chunks)`) with **768-dimensional embeddings** and an **HNSW** index in Supabase `pgvector`.
  - **Trigger:** Admin-protected REST endpoint (`POST /api/v1/admin/rag/ingest`) and/or Spring Boot profile (`--spring.profiles.active=ingest`).
- **NEVER** create Python scripts, `requirements.txt`, LangChain code, `PyPDF`, `Psycopg2`, `agrifarm-rag-pipeline/`, `main_ingest.py`, or separate Python Dockerfiles (`Dockerfile.pipeline`).

### 2.3 Backend — Spring Boot 3.3 / Java 21
- **USE:** Spring Boot 3.3, Java 21 LTS, Spring Security (stateless 30-day JWT + Resend Email OTP), Upstash Redis (cache, OTP TTL, sliding-window rate limiting).
- All REST endpoints MUST return the unified `ApiResponse<T>` (or `PageResponse<T>`) wrapper defined in [`docs/API_SPECIFICATION.md`](docs/API_SPECIFICATION.md).
- All AI clinical/dosage responses MUST pass through `Stage2VerificationLayer` before reaching the client.
- All mortality decrements MUST use row-level locking (`FOR UPDATE`) and `chk_positive_*_stock` constraints to prevent stock underflow.

### 2.4 Frontend — Next.js 15 PWA
- **USE:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, `shadcn/ui`.
- Maintain 100% bilingual support (**Hindi** `hi.json` and **English** `en.json`) and PWA offline shell compatibility (`public/sw.js`, `public/manifest.json`).

### 2.5 Media & Object Storage — Supabase Storage
- **USE:** **Supabase Storage** (`agrifarm-media` bucket) for disease lesion photos, lab reports, and generated PDFs. Store only object keys / signed URLs in the PostgreSQL `media_history` table.
- **NEVER** store raw images, audio, or PDFs as `BYTEA` / BLOBs inside PostgreSQL.
- **Optional Upgrade:** Cloudflare R2 (S3-compatible) may be used later; do **not** introduce self-hosted MinIO into production configs (`docker-compose.yml` is for local development only).

---

## 3. Phase & Scope Discipline

- **Stay in your Phase/Stage:** Never implement features outside the explicitly requested Phase and Stage in [`ROADMAP.md`](ROADMAP.md).
- **Respect Team Ownership:** Do not modify another team member's domain files without explicit permission:
  - **Member 1 (Lead):** `agrifarm-frontend/`, `modules/auth/`, `modules/weather/`, `modules/email/`, API integration
  - **Member 2 (Database Engineer):** `db/migration/` (Flyway SQL), JPA entities/indexes, `pgvector` DDL, seed data
  - **Member 3 (RAG / AI Engineer):** `modules/ai/` (4-Agent Core, Spring AI ETL `rag/ingestion/`, `Stage2VerificationLayer`, Vision, Voice)

---

## 4. Code Hygiene

- Do **not** add unused dependencies to `agrifarm-backend/pom.xml` or `agrifarm-frontend/package.json`.
- Whenever an environment variable or API endpoint changes, update `.env.example` and the corresponding `.md` files (`docs/API_SPECIFICATION.md`, `docs/DEPLOYMENT_GUIDE.md`) in the same task.
- Keep `docker/docker-compose.yml` strictly for **local development** (never reference it for production hosting).

---

## 5. Final Verification Checklist (Mandatory Before Finishing Any Task)

Before concluding any implementation or documentation task, verify ALL of the following:
- [ ] **Zero MongoDB:** Confirm zero new MongoDB references (`@Document`, `MongoRepository`, `spring-boot-starter-data-mongodb`, MongoDB Atlas) were introduced.
- [ ] **Zero Python / LangChain:** Confirm zero Python scripts, `requirements.txt`, `LangChain`, `main_ingest.py`, or `Dockerfile.pipeline` references were introduced.
- [ ] **Imports & Build:** Verify all imports resolve cleanly and the project compiles/builds (`./mvnw test-compile` or `npm run typecheck` / `npm run build`) when modifying code.
- [ ] **Spec Alignment:** Confirm changes match `AGENTS.md`, `ARCHITECTURE.md`, `ROADMAP.md`, and `docs/API_SPECIFICATION.md`.
