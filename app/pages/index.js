import { useState } from "react";
import { theme as C, prices } from "../lib/theme";

export default function Home() {
  const [size, setSize] = useState("Large");
  const [crates, setCrates] = useState(10);
  const ok = crates >= 10;
  const total = crates * prices[size];
  const [msg, setMsg] = useState("");

  async function lockOrder() {
    setMsg("Locking…");
    const r = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ size_ordered: size, crates, zone: "mainland" }),
    });
    const j = await r.json();
    setMsg(r.ok ? `Locked! Held ₦${Number(j.total_held).toLocaleString()} (${j.status})` : `Failed: ${j.error}`);
  }

  return (
    <div style={{ fontFamily: "Inter, system-ui", background: C.mist, minHeight: "100vh", color: C.ink }}>
      <div style={{ background: C.ink, color: "#fff", padding: 20, borderBottom: `6px solid ${C.volt}` }}>
        <h1 style={{ margin: 0 }}>Hagnos Eggs <span style={{ color: C.sun }}>— Monday Order</span></h1>
        <p>Prices locked • Closes Mon 11:59 PM</p>
      </div>
      <div style={{ maxWidth: 640, margin: "20px auto", display: "grid", gap: 16, padding: 12 }}>
        <div style={{ background: "#fff", border: `2px solid ${C.ink}`, borderRadius: 12, padding: 16 }}>
          <h3>1. Pick size</h3>
          {["Large", "Medium", "Pullet"].map((s) => (
            <button key={s} onClick={() => setSize(s)}
              style={{ marginRight: 8, padding: "10px 16px", fontWeight: 800, borderRadius: 8,
                border: `2px solid ${C.ink}`, background: size === s ? C.sun : "#fff" }}>
              {s} ₦{prices[s].toLocaleString()}
            </button>
          ))}
        </div>
        <div style={{ background: "#fff", border: `2px solid ${C.ink}`, borderRadius: 12, padding: 16 }}>
          <h3>2. Crates (min 10)</h3>
          <button onClick={() => setCrates(Math.max(0, crates - 1))} style={btn}>−</button>
          <b style={{ margin: "0 12px", fontSize: 22 }}>{crates}</b>
          <button onClick={() => setCrates(crates + 1)} style={btn}>+</button>
          <p style={{ fontWeight: 800, background: ok ? C.volt : C.rose, display: "inline-block", padding: "4px 12px", borderRadius: 20, border: `2px solid ${C.ink}` }}>
            {ok ? "✓ MOV met" : "Need at least 10 crates"}
          </p>
        </div>
        <div style={{ background: C.ink, color: "#fff", borderRadius: 12, padding: 16 }}>
          <h3 style={{ color: C.sun }}>Total held: ₦{total.toLocaleString()}</h3>
          <p>Wallet applies first on checkout. First order adds crate fee ₦1,500/crate.</p>
          <button disabled={!ok} onClick={lockOrder} style={{ padding: "12px 20px", fontWeight: 800, borderRadius: 8, border: `2px solid ${C.ink}`, background: ok ? C.volt : "#999" }}>
            Lock order
          </button>
          {msg && <p style={{ color: C.sun }}>{msg}</p>}
        </div>
        <div style={{ background: "#FFF6BF", border: `2px solid ${C.ink}`, borderLeft: `8px solid ${C.tang}`, borderRadius: 8, padding: 12 }}>
          Have <b>{crates} clean, empty crates</b> ready for swap on Tuesday.
        </div>
      </div>
    </div>
  );
}
const btn = { width: 44, height: 44, borderRadius: "50%", border: "2px solid #0A0A0A", background: "#00E676", fontSize: 22, fontWeight: 900 };
