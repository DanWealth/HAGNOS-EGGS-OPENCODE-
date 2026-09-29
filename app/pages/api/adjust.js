import { query } from "../../lib/db";
import { notify } from "../../lib/notify";
import { randomUUID } from "crypto";

const UNIT = { Large: 4500, Medium: 4000, Pullet: 3200 };

// Admin downgrade only (MVP): e.g. Large -> Medium
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { order_id, new_size } = req.body || {};
  if (!UNIT[new_size]) return res.status(400).json({ error: "bad-size" });
  const o = await query("SELECT * FROM orders WHERE id=$1", [order_id]);
  if (!o.rows.length) return res.status(404).json({ error: "no-order" });
  const order = o.rows[0];
  const oldUnit = order.unit_price;
  const newUnit = UNIT[new_size];
  if (newUnit > oldUnit) return res.status(400).json({ error: "downgrade-only" });
  const newTotal = newUnit * order.crates;
  const credit = order.total_held - newTotal;
  await query("UPDATE orders SET size_delivered=$1, status='Adjusted' WHERE id=$2", [new_size, order_id]);
  await query("INSERT INTO order_adjustments (id, order_id, old_total, new_total, wallet_credit) VALUES ($1,$2,$3,$4,$5)",
    [randomUUID(), order_id, order.total_held, newTotal, credit]);
  if (credit > 0) {
    await query("INSERT INTO wallet_tx (id, user_id, amount, reason) VALUES ($1,$2,$3,'downgrade')", [randomUUID(), order.user_id, credit]);
    await query("UPDATE wallet_accounts SET balance = balance + $1 WHERE user_id=$2", [credit, order.user_id]);
  }
  await notify(order.user_id, "downgraded", `Size now ${new_size}. Wallet +N${credit}.`);
  res.status(200).json({ new_total: newTotal, wallet_credit: credit });
}
