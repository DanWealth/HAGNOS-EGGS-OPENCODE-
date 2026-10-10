import { useState } from "react";
import { theme as C } from "../lib/theme";

export default function Track() {
  const [no, setNo] = useState("");
  const [t, setT] = useState(null);
  const [msg, setMsg] = useState("");

  async function lookup() {
    setMsg("Looking up…");
    setT(null);
    const r = await fetch(`/api/track?no=${encodeURIComponent(no.trim())}`);
    const j = await r.json();
    if (r.ok) { setT(j); setMsg(""); } else setMsg(j.error === "no-order" ? "No order with that number. Check HG-000116 style." : j.error);
  }

  const input = { flex: 1, padding: 14, borderRadius: 10, border: `2px solid ${C.ink}`, fontSize: 16 };
  return (
    <div style={{ fontFamily: "Inter, system-ui", background: C.mist, minHeight: "100vh", color: C.ink }}>
      <div style={{ background: C.ink, color: "#fff", padding: 20, borderBottom: `6px solid ${C.volt}` }}>
        <h1 style={{ margin: 0 }}>Track <span style={{ color: C.sun }}>your eggs</span></h1>
        <p>Enter your HG number • <a style={{ color: C.sun }} href="/order">Place your order →</a></p>
      </div>
      <div style={{ maxWidth: 640, margin: "20px auto", padding: 12, display: "grid", gap: 14 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input style={input} value={no} onChange={(e) => setNo(e.target.value)} placeholder="HG-000116" />
          <button onClick={lookup} style={{ padding: "14px 20px", fontWeight: 900, borderRadius: 10, border: `2px solid ${C.ink}`, background: C.sun }}>Track</button>
        </div>
        {msg && <p><b>{msg}</b></p>}
        {t && (
          <>
            <div style={{ background: "#fff", border: `2px solid ${C.ink}`, borderRadius: 12, padding: 16 }}>
              <h2 style={{ marginTop: 0 }}>{t.order.no} — {t.order.crates}× {t.order.size}{t.order.delivered_size ? ` → ${t.order.delivered_size}` : ""}</h2>
              <p>Held ₦{t.order.total.toLocaleString()} • Wallet −₦{t.order.wallet.toLocaleString()} • {t.order.zone}{t.order.address ? ` • ${t.order.address}` : ""}</p>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {t.timeline.map((s) => (
                  <span key={s.step} style={{ padding: "6px 10px", borderRadius: 20, fontWeight: 800, fontSize: 12, border: `2px solid ${C.ink}`, background: s.done ? C.volt : "#fff" }}>{s.done ? "✓ " : ""}{s.step}</span>
                ))}
                {t.adjusted && <span style={{ padding: "6px 10px", borderRadius: 20, fontWeight: 800, fontSize: 12, border: `2px solid ${C.ink}`, background: C.sun }}>⇄ Adjusted</span>}
              </div>
            </div>
            {t.holds.map((h, i) => (<p key={i}>💳 Payment: {h.status} ₦{Number(h.amount).toLocaleString()}</p>))}
            {t.adjustments.map((a, i) => (<p key={i}>⇄ Size change: ₦{Number(a.old_total).toLocaleString()} → ₦{Number(a.new_total).toLocaleString()}, wallet +₦{Number(a.wallet_credit).toLocaleString()}</p>))}
            {t.wallet.map((w, i) => (<p key={i}>👛 Wallet {w.amount > 0 ? "+" : ""}₦{Number(w.amount).toLocaleString()} ({w.reason})</p>))}
            {t.delivery && <p>🚚 Delivered: {t.delivery.empty_crates_collected} empties back{t.delivery.cracked_eggs ? `, ${t.delivery.cracked_eggs} cracked` : ""}</p>}
          </>
        )}
      </div>
    </div>
  );
}
