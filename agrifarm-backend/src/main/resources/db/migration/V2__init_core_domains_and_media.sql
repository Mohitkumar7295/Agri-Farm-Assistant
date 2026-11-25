-- V2: Core Domain Tables (Fisheries, Poultry, Growth, Feeding, Mortality, Water Quality, Health, Media History)

CREATE TABLE IF NOT EXISTS ponds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    water_area_acres DOUBLE PRECISION NOT NULL,
    depth_feet DOUBLE PRECISION NOT NULL,
    has_aerator BOOLEAN NOT NULL DEFAULT FALSE,
    aerator_hp DOUBLE PRECISION DEFAULT 0.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ponds_farm_id ON ponds (farm_id);

CREATE TABLE IF NOT EXISTS fish_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pond_id UUID NOT NULL REFERENCES ponds(id) ON DELETE CASCADE,
    batch_code VARCHAR(100) NOT NULL,
    stocking_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_fish_batches_pond_id ON fish_batches (pond_id);

CREATE TABLE IF NOT EXISTS polyculture_stocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fish_batch_id UUID NOT NULL REFERENCES fish_batches(id) ON DELETE CASCADE,
    specie VARCHAR(100) NOT NULL,
    initial_quantity INTEGER NOT NULL,
    current_quantity INTEGER NOT NULL,
    initial_avg_weight_grams DOUBLE PRECISION NOT NULL,
    current_avg_weight_grams DOUBLE PRECISION NOT NULL,
    CONSTRAINT chk_positive_fish_stock CHECK (current_quantity >= 0)
);
CREATE INDEX IF NOT EXISTS idx_polyculture_stocks_batch_id ON polyculture_stocks (fish_batch_id);

CREATE TABLE IF NOT EXISTS poultry_sheds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    shed_name VARCHAR(255) NOT NULL,
    shed_type VARCHAR(50) NOT NULL DEFAULT 'OPEN_SIDED',
    length_feet DOUBLE PRECISION NOT NULL,
    width_feet DOUBLE PRECISION NOT NULL,
    capacity_birds INTEGER NOT NULL,
    has_foggers BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_poultry_sheds_farm_id ON poultry_sheds (farm_id);

CREATE TABLE IF NOT EXISTS poultry_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shed_id UUID NOT NULL REFERENCES poultry_sheds(id) ON DELETE CASCADE,
    batch_code VARCHAR(100) NOT NULL,
    breed VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'BROILER',
    initial_quantity INTEGER NOT NULL,
    current_quantity INTEGER NOT NULL,
    hatch_date DATE NOT NULL,
    initial_avg_weight_grams DOUBLE PRECISION NOT NULL,
    current_avg_weight_grams DOUBLE PRECISION NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_positive_poultry_stock CHECK (current_quantity >= 0)
);
CREATE INDEX IF NOT EXISTS idx_poultry_batches_shed_id ON poultry_batches (shed_id);

CREATE TABLE IF NOT EXISTS vaccine_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poultry_batch_id UUID NOT NULL REFERENCES poultry_batches(id) ON DELETE CASCADE,
    vaccine_name VARCHAR(150) NOT NULL,
    disease_prevented VARCHAR(150) NOT NULL,
    scheduled_date DATE NOT NULL,
    administered BOOLEAN NOT NULL DEFAULT FALSE,
    administered_date DATE,
    withdrawal_days INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_vaccine_schedules_batch_id ON vaccine_schedules (poultry_batch_id);

CREATE TABLE IF NOT EXISTS sampling_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    batch_id UUID NOT NULL,
    specie VARCHAR(100),
    sample_size_count INTEGER NOT NULL,
    average_weight_grams DOUBLE PRECISION NOT NULL,
    sampling_date DATE NOT NULL,
    dwg_grams_per_day DOUBLE PRECISION,
    sgr_percentage DOUBLE PRECISION,
    estimated_biomass_kg DOUBLE PRECISION,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sampling_logs_batch ON sampling_logs (batch_id, sampling_date DESC);

CREATE TABLE IF NOT EXISTS daily_feed_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    feed_type VARCHAR(150) NOT NULL,
    quantity_kg DOUBLE PRECISION NOT NULL,
    feeding_session VARCHAR(30) NOT NULL DEFAULT 'MORNING',
    cost_per_kg DOUBLE PRECISION,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_daily_feed_logs_entity ON daily_feed_logs (entity_id, logged_at DESC);

CREATE TABLE IF NOT EXISTS mortality_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    dead_count INTEGER NOT NULL,
    suspected_cause VARCHAR(100),
    observation_notes TEXT,
    log_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_mortality_records_entity ON mortality_records (entity_id, log_date DESC);

CREATE TABLE IF NOT EXISTS water_telemetry_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pond_id UUID NOT NULL REFERENCES ponds(id) ON DELETE CASCADE,
    dissolved_oxygen DOUBLE PRECISION NOT NULL,
    ph DOUBLE PRECISION NOT NULL,
    temperature_celsius DOUBLE PRECISION NOT NULL,
    ammonia_tan DOUBLE PRECISION,
    nitrite DOUBLE PRECISION,
    transparency_cm DOUBLE PRECISION,
    alert_level VARCHAR(30) NOT NULL DEFAULT 'OPTIMAL',
    logged_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_water_telemetry_pond ON water_telemetry_logs (pond_id, logged_at DESC);

CREATE TABLE IF NOT EXISTS clinical_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    symptoms TEXT NOT NULL,
    diagnosis VARCHAR(255),
    severity VARCHAR(30) NOT NULL DEFAULT 'INFO',
    observed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS treatment_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    medication_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(150) NOT NULL,
    withdrawal_days INTEGER NOT NULL DEFAULT 0,
    safe_harvest_date DATE,
    administered_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS media_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    bucket_name VARCHAR(100) NOT NULL DEFAULT 'agrifarm-media',
    object_path TEXT NOT NULL,
    signed_url TEXT,
    content_type VARCHAR(100),
    file_size_bytes BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_media_history_entity ON media_history (user_id, entity_type, entity_id);
