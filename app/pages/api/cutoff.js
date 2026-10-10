import { query } from "../../lib/db";
import { requireAdmin } from "../../lib/requireAdmin";
import { randomUUID } from "crypto";

// Monday 23:59 job (run manually or cron): lock week, open next with same prices.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (!(await requireAdmin(req, res))) return;
  const cur = await query("SELECT * FROM price_weeks ORDER BY week_start DESC LIMIT 1");
  if (!cur.rows.length) return res.status(400).json({ error: "no-price-week" });
  const c = cur.rows[0];
  await query("UPDATE price_weeks SET locked_at=NOW() WHERE id=$1", [c.id]);
  const next = new Date(c.week_start); next.setDate(next.getDate() + 7);
  const id = randomUUID();
  await query(
    "INSERT INTO price_weeks (id, week_start, large_price, medium_price, pullet_price, hub_discount_pct, mainland_fee, island_fee, crate_fee) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (week_start) DO NOTHING",
    [id, next.toISOString().slice(0, 10), c.large_price, c.medium_price, c.pullet_price, c.hub_discount_pct, c.mainland_fee, c.island_fee, c.crate_fee]
  );
  await query("UPDATE payment_holds SET status='released' WHERE status='held' AND order_id IN (SELECT id FROM orders WHERE status='Cancelled')");
  res.status(200).json({ locked: c.week_start, next: next.toISOString().slice(0, 10) });
}
