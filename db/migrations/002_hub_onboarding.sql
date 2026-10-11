-- Hub onboarding columns for databases created before the hub page.
-- Fresh installs already include these via db/schema.sql.
ALTER TABLE users ADD COLUMN IF NOT EXISTS shop_address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS zone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS weekly_volume INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT TRUE;
