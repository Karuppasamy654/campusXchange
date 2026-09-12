-- Temporal Database History Schema for CampusXchange

CREATE TABLE IF NOT EXISTS resource_history (
    history_id SERIAL PRIMARY KEY,
    resource_id VARCHAR(64) NOT NULL,
    owner_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    condition VARCHAR(50) NOT NULL DEFAULT 'good',
    status VARCHAR(50) NOT NULL DEFAULT 'available',
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valid_to TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'infinity'
);

CREATE INDEX IF NOT EXISTS idx_temporal_resource_range 
ON resource_history (resource_id, valid_from, valid_to);

CREATE TABLE IF NOT EXISTS ownership_history (
    history_id SERIAL PRIMARY KEY,
    resource_id VARCHAR(64) NOT NULL,
    owner_id VARCHAR(64) NOT NULL,
    transfer_type VARCHAR(50) NOT NULL DEFAULT 'initial', -- initial, sold, donated, returned
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valid_to TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'infinity'
);
