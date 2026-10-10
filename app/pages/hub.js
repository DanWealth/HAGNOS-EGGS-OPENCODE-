import { useState } from "react";
import { theme as C } from "../lib/theme";

// Hub onboarding: terms + shop details -> hub_operator account -> studio.
export default function Hub() {
  const [f, setF] = useState({ email: "", name: "", phone: "", shop_address: "", zone: "mainland", weekly_volume: "30" });
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const input = { width: "100%", padding: 12, borderRadius: 8, border: `2px solid ${C.ink}`, fontSize: 15, marginTop: 6 };

  async function register() {
    if (!f.email || !f.name || !f.shop_address) { setMsg("Email, business name and shop address are required."); return; }
    setMsg("Creating your hub account…");
    const r = await fetch("/api/account", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, role: "hub_operator" }) });
    const j = await r.json();
    if (r.ok) { setDone(true); setMsg(`Welcome, ${f.name}! Your hub account is open.`); }
    else setMsg(`Failed: ${j.error}`);
  }

  return (
    <div style={{ fontFamily: "Inter, system-ui", background: C.mist, minHeight: "100vh", color: C.ink }}>
      <div style={{ background: C.grape, color: "#fff", padding: 24, borderBottom: `6px solid ${C.ink}` }}>
        <h1 style={{ margin: 0 }}>Become a Hagnos hub</h1>
        <p>Buy 5% below commercial price • sell to Indomie joints and walk-ins • keep the margin</p>
      </div>
      <div style={{ maxWidth: 640, margin: "20px auto", padding: 12, display: "grid", gap: 14 }}>
        <div style={{ background: "#fff", border: `2px solid ${C.ink}`, borderRadius: 12, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>How hubs work</h3>
          <p>1. Order Wed–Mon, min 10 crates, Tuesday truck drops at your shop.<br />2. Swap empties on delivery; breakage and downgrades roll into your wallet.<br />3. We list your depot so nearby retailers find you.</p>
        </div>
        {!done ? (
          <div style={{ background: "#fff", border: `2px solid ${C.ink}`, borderRadius: 12, padding: 16, display: "grid", gap: 8 }}>
            <h3 style={{ marginTop: 0 }}>Your depot details</h3>
            <label>Business name<input style={input} value={f.name} onChange={set("name")} placeholder="Mama Put Depot, Ikeja" /></label>
            <label>Email (your login)<input style={input} value={f.email} onChange={set("email")} placeholder="you@depot.com" /></label>
            <label>Phone<input style={input} value={f.phone} onChange={set("phone")} placeholder="0803 000 0000" /></label>
            <label>Shop address<input style={input} value={f.shop_address} onChange={set("shop_address")} placeholder="14 Allen Ave, Ikeja" /></label>
            <label>Zone<select style={input} value={f.zone} onChange={set("zone")}><option value="mainland">Mainland</option><option value="island">Island</option></select></label>
            <label>Crates per week (estimate)<input style={input} type="number" min="10" value={f.weekly_volume} onChange={set("weekly_volume")} placeholder="30" /></label>
            <button onClick={register} style={{ padding: "14px 20px", fontWeight: 900, borderRadius: 8, border: `2px solid ${C.ink}`, background: C.volt }}>Open hub account →</button>
            {msg && <p><b>{msg}</b></p>}
          </div>
        ) : (
          <div style={{ background: C.ink, color: "#fff", borderRadius: 12, padding: 20, textAlign: "center" }}>
            <p>{msg}</p>
            <a href="/order" style={{ display: "inline-block", background: C.sun, color: C.ink, fontWeight: 900, padding: "14px 28px", borderRadius: 10, textDecoration: "none" }}>Enter studio + place first order →</a>
          </div>
        )}
      </div>
    </div>
  );
}
