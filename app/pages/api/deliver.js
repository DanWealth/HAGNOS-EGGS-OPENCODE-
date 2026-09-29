import { query } from "../../lib/db";
import { notify } from "../../lib/notify";
import { randomUUID } from "crypto";

// Delivery confirm + breakage credit. cracked_eggs * (unit/30).
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { order_id, cracked_eggs = 0, empty_crates = 0, photo_url = null } = req.body || {};
  const o = await query("SELECT * FROM orders WHERE id=$1", [order_id]);
  if (!o.rows.length) return res.status(404).json({ error: "no-order" });
  const order = o.rows[0];
  const unit = order.unit_price;
  const credit = Math.round((Number(cracked_eggs) * unit) / 30);
  await query("UPDATE orders SET status='Delivered' WHERE id=$1", [order_id]);
  await query(
    "INSERT INTO delivery_stops (id, order_id, empty_crates_collected, cracked_eggs, photo_url) VALUES ($1,$2,$3,$4,$5)",
    [randomUUID(), order_id, empty_crates, cracked_eggs, photo_url]
  );
  if (credit > 0) {
    await query("INSERT INTO wallet_tx (id, user_id, amount, reason, order_id) VALUES ($1,$2,$3,'breakage',$4)", [randomUUID(), order.user_id, credit, order_id]);
    await query("UPDATE wallet_accounts SET balance = balance + $1 WHERE user_id=$2", [credit, order.user_id]);
  }
  await query(
    "INSERT INTO crate_ledger (user_id, issued, returned) VALUES ($1,0,$2) ON CONFLICT (user_id) DO UPDATE SET returned = crate_ledger.returned + $2",
    [order.user_id, empty_crates]
  );
  await notify(order.user_id, "delivered", `Delivered. Breakage credit N${credit}. Empties back: ${empty_crates}.`);
  res.status(200).json({ status: "Delivered", breakage_credit: credit });
}
