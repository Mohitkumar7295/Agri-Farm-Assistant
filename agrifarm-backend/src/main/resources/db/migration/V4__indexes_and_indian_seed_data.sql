-- V4: Multi-Tenant Composite Indexes & Realistic Indian Aquaculture/Poultry Seed Data (Phase 3 / Stage 3.3)

-- ============================================================================
-- 1. Multi-Tenant & Time-Series Composite Indexes (V1/V2 Tables)
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_farms_user_created ON farms (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sampling_logs_user_created ON sampling_logs (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_feed_logs_user_logged ON daily_feed_logs (user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_mortality_records_user_created ON mortality_records (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_water_telemetry_user_logged ON water_telemetry_logs (user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_clinical_logs_user_observed ON clinical_logs (user_id, observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_treatment_records_user_admin ON treatment_records (user_id, administered_at DESC);

-- ============================================================================
-- 2. Idempotent Realistic Indian Aquaculture & Poultry Seed Data
-- ============================================================================
INSERT INTO users (
    full_name, email, mobile_number, street_address, country, state, district,
    village_or_city, pincode, latitude, longitude, role, preferred_language,
    terms_agreed, email_verified
)
VALUES (
    'R. Gupta',
    'rgupta69450@gmail.com',
    '9876543210',
    'Malwa Farm Road, Plot 14',
    'India',
    'Madhya Pradesh',
    'Indore',
    'Sanwer',
    '452010',
    22.9747,
    75.8022,
    'FARMER',
    'hi',
    TRUE,
    TRUE
)
ON CONFLICT (email) DO NOTHING;

DO $$
DECLARE
    v_user_id UUID;
    v_farm_id UUID := '11111111-1111-4111-8111-111111111101';
    v_pond_id UUID := '22222222-2222-4222-8222-222222222201';
    v_fish_batch_id UUID := '33333333-3333-4333-8333-333333333301';
    v_shed_id UUID := '44444444-4444-4444-8444-444444444401';
    v_poultry_batch_id UUID := '55555555-5555-4555-8555-555555555501';
BEGIN
    SELECT id INTO v_user_id FROM users WHERE email = 'rgupta69450@gmail.com' LIMIT 1;
    IF v_user_id IS NULL THEN
        RETURN;
    END IF;

    INSERT INTO farms (id, user_id, name, domain, latitude, longitude, address, total_area_acres)
    VALUES (
        v_farm_id, v_user_id,
        'Malwa Integrated Aqua & Poultry Farm', 'INTEGRATED',
        22.9747, 75.8022, 'Sanwer, Indore, Madhya Pradesh', 5.0
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO ponds (id, farm_id, name, water_area_acres, depth_feet, has_aerator, aerator_hp)
    VALUES (v_pond_id, v_farm_id, 'Pond-1 (Indian Major Carps)', 1.5, 6.0, TRUE, 2.0)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO fish_batches (id, pond_id, batch_code, stocking_date, status)
    VALUES (v_fish_batch_id, v_pond_id, 'IMC-2026-01', CURRENT_DATE - INTERVAL '45 days', 'ACTIVE')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO polyculture_stocks (id, fish_batch_id, specie, initial_quantity, current_quantity, initial_avg_weight_grams, current_avg_weight_grams)
    VALUES
        ('66666666-6666-4666-8666-666666666601', v_fish_batch_id, 'Catla', 1200, 1185, 18.0, 240.0),
        ('66666666-6666-4666-8666-666666666602', v_fish_batch_id, 'Rohu', 1500, 1480, 15.0, 195.0),
        ('66666666-6666-4666-8666-666666666603', v_fish_batch_id, 'Mrigal', 800, 790, 14.0, 175.0)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO poultry_sheds (id, farm_id, shed_name, shed_type, length_feet, width_feet, capacity_birds, has_foggers)
    VALUES (v_shed_id, v_farm_id, 'Shed-1 (Deep Litter Broiler)', 'OPEN_SIDED', 80.0, 30.0, 2000, TRUE)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO poultry_batches (id, shed_id, batch_code, breed, category, initial_quantity, current_quantity, hatch_date, initial_avg_weight_grams, current_avg_weight_grams, status)
    VALUES (v_poultry_batch_id, v_shed_id, 'COBB-2026-01', 'Cobb 400', 'BROILER', 1500, 1482, CURRENT_DATE - INTERVAL '18 days', 42.0, 720.0, 'ACTIVE')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO vaccine_schedules (id, poultry_batch_id, vaccine_name, disease_prevented, scheduled_date, administered, administered_date, withdrawal_days)
    VALUES
        ('77777777-7777-4777-8777-777777777701', v_poultry_batch_id, 'Lasota (F1)', 'Newcastle Disease (Ranikhet)', CURRENT_DATE - INTERVAL '11 days', TRUE, CURRENT_DATE - INTERVAL '11 days', 0),
        ('77777777-7777-4777-8777-777777777702', v_poultry_batch_id, 'Gumboro (IBD)', 'Infectious Bursal Disease', CURRENT_DATE + INTERVAL '3 days', FALSE, NULL, 0)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO water_telemetry_logs (id, user_id, pond_id, dissolved_oxygen, ph, temperature_celsius, ammonia_tan, nitrite, transparency_cm, alert_level)
    VALUES ('88888888-8888-4888-8888-888888888801', v_user_id, v_pond_id, 6.2, 7.6, 27.8, 0.02, 0.01, 32.0, 'OPTIMAL')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO daily_feed_logs (id, user_id, entity_type, entity_id, feed_type, quantity_kg, feeding_session, cost_per_kg)
    VALUES
        ('99999999-9999-4999-8999-999999999901', v_user_id, 'FISHERIES', v_fish_batch_id, 'Floating Carp Pellet 28% CP', 18.5, 'MORNING', 48.0),
        ('99999999-9999-4999-8999-999999999902', v_user_id, 'POULTRY', v_poultry_batch_id, 'Broiler Grower Crumble', 110.0, 'MORNING', 42.0)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO sampling_logs (id, user_id, entity_type, batch_id, specie, sample_size_count, average_weight_grams, sampling_date, dwg_grams_per_day, sgr_percentage, estimated_biomass_kg)
    VALUES ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa01', v_user_id, 'FISHERIES', v_fish_batch_id, 'Rohu', 25, 195.0, CURRENT_DATE, 4.0, 5.7, 288.6)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO expense_records (id, farm_id, user_id, domain, category, amount_inr, description, incurred_on)
    VALUES
        ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb01', v_farm_id, v_user_id, 'FISHERIES', 'FEED', 24000.00, '500 kg Floating Carp Pellet 28% CP', CURRENT_DATE - INTERVAL '5 days'),
        ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbb02', v_farm_id, v_user_id, 'POULTRY', 'FEED', 42000.00, '1000 kg Broiler Grower Feed', CURRENT_DATE - INTERVAL '3 days')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO daily_tasks (id, farm_id, user_id, title, description, domain, priority, due_date, completed)
    VALUES
        ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', v_farm_id, v_user_id, 'Check morning dissolved oxygen in Pond-1', 'Verify DO >= 5.0 mg/L before morning feeding', 'FISHERIES', 'HIGH', CURRENT_DATE, FALSE),
        ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', v_farm_id, v_user_id, 'Prepare Gumboro booster vaccine for Shed-1', 'Administer via drinking water in early morning', 'POULTRY', 'HIGH', CURRENT_DATE + INTERVAL '3 days', FALSE)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO in_app_alerts (id, user_id, farm_id, alert_type, severity, title, message, is_read)
    VALUES ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', v_user_id, v_farm_id, 'VACCINE_DUE', 'WARNING', 'Gumboro Vaccine Due in 3 Days', 'Shed-1 batch COBB-2026-01 has Gumboro (IBD) scheduled in 3 days.', FALSE)
    ON CONFLICT (id) DO NOTHING;
END $$;
