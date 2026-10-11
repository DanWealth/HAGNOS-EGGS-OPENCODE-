-- Crate-fee audit column for databases created before the opt-out.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS crate_fee INTEGER DEFAULT 0;
