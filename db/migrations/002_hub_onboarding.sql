-- Hub onboarding + approval columns (already present on pilot DB; safe to re-run).
ALTER TABLE users ADD COLUMN IF NOT EXISTS shop_address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS zone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS weekly_volume INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT TRUE;
