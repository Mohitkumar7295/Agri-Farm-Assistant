-- V3: Finance, Daily Tasks, In-App Alerts & pgvector Store (Phase 3 / Stage 3.1 + 3.2)

-- ============================================================================
-- 1. Financials, Daily Tasks & In-App Alerts
-- ============================================================================
CREATE TABLE IF NOT EXISTS expense_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    domain VARCHAR(50) NOT NULL, -- FISHERIES, POULTRY, GENERAL
    category VARCHAR(100) NOT NULL, -- FEED, SEED, MEDICINE, ELECTRICITY, LABOR, OTHER
    amount_inr NUMERIC(12, 2) NOT NULL CHECK (amount_inr >= 0),
    description TEXT,
    incurred_on DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expense_records_farm_date ON expense_records (farm_id, incurred_on DESC);
CREATE INDEX IF NOT EXISTS idx_expense_records_user_created ON expense_records (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS daily_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    domain VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
    priority VARCHAR(30) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    due_date DATE NOT NULL DEFAULT CURRENT_DATE,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_due ON daily_tasks (user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_created ON daily_tasks (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS in_app_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    alert_type VARCHAR(80) NOT NULL, -- HYPOXIA_RISK, VACCINE_DUE, HEAT_STRESS, WATER_AMMONIA
    severity VARCHAR(30) NOT NULL DEFAULT 'WARNING', -- INFO, WARNING, CRITICAL
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_in_app_alerts_user_read ON in_app_alerts (user_id, is_read, created_at DESC);

-- ============================================================================
-- 2. pgvector Extension & HNSW Vector Store (768-dim Gemini embeddings)
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS vector_store (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    metadata JSONB NOT NULL,
    embedding vector(768)
);

CREATE INDEX IF NOT EXISTS idx_vector_store_hnsw
    ON vector_store USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS idx_vector_store_metadata_gin
    ON vector_store USING gin (metadata);
