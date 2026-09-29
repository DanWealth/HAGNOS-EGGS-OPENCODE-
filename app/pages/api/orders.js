import { query } from "../../lib/db";
import { notify } from "../../lib/notify";
import { randomUUID } from "crypto";

const UNIT = { Large: 4500, Medium: 4000, Pullet: 3200 };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  // PRD §6.2 / criterion 2: orders only on Monday (Africa/Lagos). Override for tests.
  if (process.env.ORDER_WINDOW_OVERRIDE !== "true") {
    const lagosDay = new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" })).getDay();
    if (lagosDay !== 1) return res.status(403).json({ error: "window-closed", message: "Orders open Monday only." });
  }
  const { size_ordered, crates, zone } = req.body || {};
  if (!UNIT[size_ordered]) return res.status(400).json({ error: "bad-size" });
  if (!crates || crates < 10) return res.status(400).json({ error: "mov-min-10" });
  const z = zone === "island" ? "island" : "mainland";

  const pw = await query("SELECT * FROM price_weeks ORDER BY week_start DESC LIMIT 1");
  if (!pw.rows.length) return res.status(400).json({ error: "no-price-week" });
  const P = pw.rows[0];

  let u = await query("SELECT * FROM users LIMIT 1");
  let user = u.rows[0];
  if (!user) {
    const id = randomUUID();
    await query("INSERT INTO users (id, phone, role) VALUES ($1,$2,$3)", [id, "08030000000", "buyer_commercial"]);
    await query("INSERT INTO wallet_accounts (user_id, balance) VALUES ($1,0) ON CONFLICT DO NOTHING", [id]);
    user = { id, role: "buyer_commercial", first_order_done: false };
  }

  const unit = UNIT[size_ordered];
  const gross = unit * crates;
  const discount = user.role === "hub_operator" ? Math.round((gross * (P.hub_discount_pct || 5)) / 100) : 0;
  const fee = z === "island" ? P.island_fee : P.mainland_fee;
  const crateFee = !user.first_order_done ? P.crate_fee * crates : 0;
  const subtotal = gross - discount + fee + crateFee;

  const w = await query("SELECT balance FROM wallet_accounts WHERE user_id=$1", [user.id]);
  const balance = Number(w.rows[0]?.balance || 0);
  const walletApplied = Math.min(balance, subtotal);
  const total = subtotal - walletApplied;

  const id = randomUUID();
  const no = await query("SELECT nextval('order_no_seq') AS n");
  const orderNo = "HG-" + String(no.rows[0].n).padStart(6, "0");
  await query(
    "INSERT INTO orders (id, order_no, user_id, price_week_id, size_ordered, crates, unit_price, total_held, wallet_applied, status, zone) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'FundsHeld',$10)",
    [id, orderNo, user.id, P.id, size_ordered, crates, unit, total, walletApplied, z]
  );
  await query("INSERT INTO payment_holds (id, order_id, amount, status) VALUES ($1,$2,$3,'held')", [randomUUID(), id, total]);
  if (walletApplied > 0) {
    await query("INSERT INTO wallet_tx (id, user_id, amount, reason, order_id) VALUES ($1,$2,$3,'order_apply',$4)", [randomUUID(), user.id, -walletApplied, id]);
    await query("UPDATE wallet_accounts SET balance = balance - $1 WHERE user_id=$2", [walletApplied, user.id]);
  }
  await query("UPDATE users SET first_order_done=TRUE WHERE id=$1", [user.id]);
  await query(
    "INSERT INTO crate_ledger (user_id, issued, returned) VALUES ($1,$2,0) ON CONFLICT (user_id) DO UPDATE SET issued = crate_ledger.issued + $2",
    [user.id, crates]
  );
  await notify(user.id, "order_locked", `Locked ${crates}x ${size_ordered} (${z}). Held N${total}, wallet -N${walletApplied}.`);
  res.status(201).json({ id, order_no: orderNo, total_held: total, wallet_applied: walletApplied, status: "FundsHeld", breakdown: { gross, discount, fee, crateFee } });
}
