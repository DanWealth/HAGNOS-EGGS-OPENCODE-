import { query } from "../../lib/db";
import { randomUUID } from "crypto";

const UNIT = { Large: 4500, Medium: 4000, Pullet: 3200 };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { size_ordered, crates, zone } = req.body || {};
  if (!UNIT[size_ordered]) return res.status(400).json({ error: "bad-size" });
  if (!crates || crates < 10) return res.status(400).json({ error: "mov-min-10" });

  const pw = await query("SELECT * FROM price_weeks ORDER BY week_start DESC LIMIT 1");
  if (!pw.rows.length) return res.status(400).json({ error: "no-price-week" });

  const unit = UNIT[size_ordered];
  const total = unit * crates;
  const id = randomUUID();
  // demo user: first user or create one
  let u = await query("SELECT id FROM users LIMIT 1");
  let userId = u.rows[0]?.id;
  if (!userId) {
    userId = randomUUID();
    await query("INSERT INTO users (id, phone, role) VALUES ($1, $2, $3)", [userId, "08030000000", "buyer_commercial"]);
    await query("INSERT INTO wallet_accounts (user_id, balance) VALUES ($1, 0) ON CONFLICT DO NOTHING", [userId]);
  }
  await query(
    "INSERT INTO orders (id, user_id, price_week_id, size_ordered, crates, unit_price, total_held, status, zone) VALUES ($1,$2,$3,$4,$5,$6,$7,'FundsHeld',$8)",
    [id, userId, pw.rows[0].id, size_ordered, crates, unit, total, zone || "mainland"]
  );
  await query("INSERT INTO payment_holds (id, order_id, amount, status) VALUES ($1,$2,$3,'held')", [randomUUID(), id, total]);
  res.status(201).json({ id, total_held: total, status: "FundsHeld" });
}
