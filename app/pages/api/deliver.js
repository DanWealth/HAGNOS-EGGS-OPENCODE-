import { query } from "../../lib/db";
import { randomUUID } from "crypto";

// Delivery confirm + breakage credit. cracked_eggs * (unit/30).
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { order_id, cracked_eggs = 0, empty_crates = 0 } = req.body || {};
  const o = await query("SELECT * FROM orders WHERE id=$1", [order_id]);
  if (!o.rows.length) return res.status(404).json({ error: "no-order" });
  const order = o.rows[0];
  const unit = order.unit_price;
  const credit = Math.round((Number(cracked_eggs) * unit) / 30);
  await query("UPDATE orders SET status='Delivered' WHERE id=$1", [order_id]);
  await query(
    "INSERT INTO delivery_stops (id, order_id, empty_crates_collected, cracked_eggs) VALUES ($1,$2,$3,$4)",
    [randomUUID(), order_id, empty_crates, cracked_eggs]
  );
  if (credit > 0) {
    await query("INSERT INTO wallet_tx (id, user_id, amount, reason) VALUES ($1,$2,$3,'breakage')", [randomUUID(), order.user_id, credit]);
    await query("UPDATE wallet_accounts SET balance = balance + $1 WHERE user_id=$2", [credit, order.user_id]);
  }
  await query("UPDATE crate_ledger SET returned = returned + $1 WHERE user_id=$2", [empty_crates, order.user_id]);
  res.status(200).json({ status: "Delivered", breakage_credit: credit });
}
