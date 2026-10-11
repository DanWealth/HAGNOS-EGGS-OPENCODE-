import { useEffect, useState } from "react";

export default function Prices() {
  const [weeks, setWeeks] = useState([]);
  const [f, setF] = useState({ week_start: "", large_price: 4500, medium_price: 4000, pullet_price: 3200 });
  const [msg, setMsg] = useState("");
  const [session, setSession] = useState("checking");
  const load = () => fetch("/api/price-weeks").then((r) => r.json()).then((j) => setWeeks(j.weeks || []));
  useEffect(() => {
    fetch("/api/auth/get-session").then((r) => r.json()).then((j) => setSession(j.session ? "in" : "out")).catch(() => setSession("out"));
    load();
  }, []);
  if (session === "checking") return <p style={{ padding: 20 }}>Checking sign-in…</p>;
  if (session === "out") return (<div style={{ maxWidth: 480, margin: "40px auto", padding: 20, fontFamily: "Inter, system-ui" }}><h1>Admin only</h1><p>Sign in first.</p><a href="/login">Go to sign in →</a></div>);
  const inp = { padding: 10, border: "2px solid #0A0A0A", borderRadius: 8, fontSize: 15, width: "100%", marginTop: 4 };

  async function save() {
    setMsg("Saving…");
    const r = await fetch("/api/price-weeks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, large_price: +f.large_price, medium_price: +f.medium_price, pullet_price: +f.pullet_price }) });
    setMsg(r.ok ? "Saved." : "Failed.");
    load();
  }

  return (
    <div style={{ maxWidth: 640, margin: "20px auto", padding: 20, fontFamily: "Inter, system-ui" }}>
      <h1>Weekly prices (Admin)</h1>
      <div style={{ background: "#fff", border: "2px solid #0A0A0A", borderRadius: 12, padding: 16, display: "grid", gap: 8 }}>
        <label>Week start (Wednesday)<input style={inp} type="date" value={f.week_start} onChange={(e) => setF({ ...f, week_start: e.target.value })} /></label>
        <label>Large ₦<input style={inp} type="number" value={f.large_price} onChange={(e) => setF({ ...f, large_price: e.target.value })} /></label>
        <label>Medium ₦<input style={inp} type="number" value={f.medium_price} onChange={(e) => setF({ ...f, medium_price: e.target.value })} /></label>
        <label>Pullet ₦<input style={inp} type="number" value={f.pullet_price} onChange={(e) => setF({ ...f, pullet_price: e.target.value })} /></label>
        <button onClick={save} style={{ padding: 12, fontWeight: 800, borderRadius: 8, border: "2px solid #0A0A0A", background: "#00E676" }}>Set prices</button>
        {msg && <b>{msg}</b>}
      </div>
      <h2>Recent weeks</h2>
      {weeks.map((w) => (
        <div key={w.id} style={{ border: "2px solid #0A0A0A", borderRadius: 8, padding: 10, marginBottom: 8 }}>
          <b>{w.week_start.slice(0, 10)}</b> — L ₦{w.large_price} / M ₦{w.medium_price} / P ₦{w.pullet_price} {w.locked_at ? "🔒 locked" : "open"}
        </div>
      ))}
    </div>
  );
}
