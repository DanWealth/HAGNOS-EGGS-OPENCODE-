import { useEffect, useState } from "react";

export default function Admin() {
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState("");
  const [stats, setStats] = useState(null);
  const [session, setSession] = useState("checking");
  const load = () => {
    fetch("/api/orders-list").then((r) => r.json()).then(setData);
    fetch("/api/metrics").then((r) => r.json()).then(setStats).catch(() => {});
  };
  useEffect(() => {
    fetch("/api/auth/get-session").then((r) => r.json()).then((j) => setSession(j.session ? "in" : "out")).catch(() => setSession("out"));
    load();
  }, []);

  async function post(path, body) {
    setMsg("Working…");
    const r = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) });
    const j = await r.json();
    setMsg(r.ok ? JSON.stringify(j) : `Failed: ${j.error}`);
    load();
  }

  if (session === "checking") return <p style={{ padding: 20 }}>Checking sign-in…</p>;
  if (session === "out") return (<div style={{ maxWidth: 480, margin: "40px auto", padding: 20, fontFamily: "Inter, system-ui" }}><h1>Admin only</h1><p>Sign in first.</p><a href="/login">Go to sign in →</a></div>);
  if (!data) return <p style={{ padding: 20 }}>Loading holds…</p>;
  return (
    <div style={{ fontFamily: "Inter, system-ui", padding: 20, maxWidth: 720, margin: "0 auto" }}>
      <h1>Admin — Monday holds: ₦{Number(data.totalHeld).toLocaleString()}</h1>
      {stats && <p><b>{stats.orders} orders</b> • fulfillment {stats.fulfillmentPct}% (target {stats.targetFulfillmentPct}%) • breakage {stats.breakagePct}% (target &lt;{stats.targetBreakagePct}%) • wallet liability ₦{Number(stats.walletLiability).toLocaleString()}</p>}
      {stats && stats.farmDemand && <p><b>Farm demand:</b> {stats.farmDemand.length ? stats.farmDemand.map((d) => `${d.crates}× ${d.size} (${d.orders} orders)`).join(" • ") : "none open"}</p>}
      {stats && stats.bySize && <p><b>By size:</b> {stats.bySize.map((d) => `${d.size} ${d.crates} crates`).join(" • ")}</p>}
      {stats && stats.byRole && <p><b>By buyer:</b> {stats.byRole.map((d) => `${d.role} ${d.crates} crates`).join(" • ")}</p>}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => post("/api/routes")} style={b}>Build routes</button>
        <button onClick={() => post("/api/fulfill", { action: "validate-all" })} style={b}>Validate all</button>
        <button onClick={() => post("/api/fulfill", { action: "dispatch-all" })} style={b}>Dispatch all</button>
        <button onClick={() => post("/api/cutoff")} style={b}>Close week (Mon 23:59)</button>
        <button onClick={() => post("/api/settle")} style={b}>Settle Tuesday night</button>
      </div>
      {msg && <p><b>{msg}</b></p>}
      {data.orders.map((o) => (
        <div key={o.id} style={{ border: "2px solid #0A0A0A", borderRadius: 8, padding: 10, marginBottom: 8 }}>
          <b>{o.crates}× {o.size_ordered}</b> — ₦{Number(o.total_held).toLocaleString()} — {o.status} — {o.zone} — pay: {o.pay_status || "—"}
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            <button onClick={() => post("/api/adjust", { order_id: o.id, new_size: "Medium" })} style={s}>↓ Medium</button>
            <button onClick={() => post("/api/adjust", { order_id: o.id, new_size: "Pullet" })} style={s}>↓ Pullet</button>
            <button onClick={() => post("/api/deliver", { order_id: o.id, cracked_eggs: 0, empty_crates: o.crates })} style={s}>✓ Delivered</button>
          </div>
        </div>
      ))}
      {data.orders.length === 0 && <p>No orders yet.</p>}
    </div>
  );
}
const b = { padding: "10px 14px", fontWeight: 800, borderRadius: 8, border: "2px solid #0A0A0A", background: "#FFD600" };
const s = { padding: "6px 10px", fontWeight: 700, borderRadius: 8, border: "2px solid #0A0A0A", background: "#fff" };
