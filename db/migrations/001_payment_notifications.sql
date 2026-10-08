-- Bring an existing local pilot database up to the schema required by the app.
CREATE SEQUENCE IF NOT EXISTS order_no_seq START WITH 100;

ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_no TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE wallet_tx ADD COLUMN IF NOT EXISTS order_id TEXT REFERENCES orders(id);
ALTER TABLE payment_holds ADD COLUMN IF NOT EXISTS gateway_ref TEXT;

SELECT setval(
  'order_no_seq',
  GREATEST(99, COALESCE(MAX(NULLIF(regexp_replace(order_no, '[^0-9]', '', 'g'), '')::BIGINT), 99)),
  true
)
FROM orders;

UPDATE orders
SET order_no = 'HG-' || LPAD(nextval('order_no_seq')::TEXT, 6, '0')
WHERE order_no IS NULL;

SELECT setval(
  'order_no_seq',
  GREATEST(99, COALESCE(MAX(NULLIF(regexp_replace(order_no, '[^0-9]', '', 'g'), '')::BIGINT), 99)),
  true
)
FROM orders;

CREATE UNIQUE INDEX IF NOT EXISTS orders_order_no_unique ON orders(order_no);
CREATE UNIQUE INDEX IF NOT EXISTS payment_holds_gateway_ref_unique
  ON payment_holds(gateway_ref) WHERE gateway_ref IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS payment_holds_order_id_unique ON payment_holds(order_id);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  kind TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
