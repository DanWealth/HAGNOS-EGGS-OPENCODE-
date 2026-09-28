-- Hagnos Eggs — database tables (simple version)

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  phone TEXT UNIQUE,
  email TEXT UNIQUE,
  role TEXT NOT NULL, -- buyer_commercial | hub_operator | admin | driver
  first_order_done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE price_weeks (
  id TEXT PRIMARY KEY,
  week_start DATE UNIQUE NOT NULL,
  large_price INTEGER NOT NULL,
  medium_price INTEGER NOT NULL,
  pullet_price INTEGER NOT NULL,
  hub_discount_pct INTEGER DEFAULT 5,
  mainland_fee INTEGER DEFAULT 2500,
  island_fee INTEGER DEFAULT 4000,
  crate_fee INTEGER DEFAULT 1500,
  locked_at TIMESTAMP
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  price_week_id TEXT REFERENCES price_weeks(id),
  size_ordered TEXT NOT NULL, -- Large | Medium | Pullet
  size_delivered TEXT,
  crates INTEGER NOT NULL CHECK (crates >= 10),
  unit_price INTEGER NOT NULL,
  total_held INTEGER NOT NULL,
  wallet_applied INTEGER DEFAULT 0,
  status TEXT DEFAULT 'FundsHeld', -- FundsHeld | Validated | Dispatched | Delivered | Settled | Adjusted | Failed | Cancelled
  zone TEXT, -- mainland | island
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_adjustments (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id),
  old_total INTEGER NOT NULL,
  new_total INTEGER NOT NULL,
  wallet_credit INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE wallet_accounts (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  balance INTEGER DEFAULT 0
);

CREATE TABLE wallet_tx (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  amount INTEGER NOT NULL, -- +credit | -debit
  reason TEXT NOT NULL, -- downgrade | breakage | order_apply
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE crate_ledger (
  user_id TEXT REFERENCES users(id),
  issued INTEGER DEFAULT 0,
  returned INTEGER DEFAULT 0,
  PRIMARY KEY (user_id)
);

CREATE TABLE routes (
  id TEXT PRIMARY KEY,
  price_week_id TEXT REFERENCES price_weeks(id),
  zone TEXT NOT NULL,
  stop_order INTEGER NOT NULL
);

CREATE TABLE delivery_stops (
  id TEXT PRIMARY KEY,
  route_id TEXT REFERENCES routes(id),
  order_id TEXT REFERENCES orders(id),
  empty_crates_collected INTEGER DEFAULT 0,
  cracked_eggs INTEGER DEFAULT 0,
  photo_url TEXT,
  delivered_at TIMESTAMP
);

CREATE TABLE payment_holds (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id),
  gateway_ref TEXT,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'held' -- held | captured | released | failed
);
