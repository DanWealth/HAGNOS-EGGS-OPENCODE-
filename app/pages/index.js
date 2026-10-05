import { theme as C } from "../lib/theme";

export default function Landing() {
  const card = { background: "#fff", border: `2px solid ${C.ink}`, borderRadius: 12, padding: 18, boxShadow: `4px 4px 0 ${C.ink}` };
  return (
    <div style={{ fontFamily: "Inter, system-ui", background: C.mist, minHeight: "100vh", color: C.ink }}>
      <div style={{ background: C.ink, color: "#fff", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `6px solid ${C.volt}` }}>
        <b style={{ fontSize: 20 }}>Hagnos <span style={{ color: C.sun }}>Eggs</span></b>
        <a href="/order" style={{ background: C.sun, color: C.ink, fontWeight: 800, padding: "10px 18px", borderRadius: 8, textDecoration: "none", border: `2px solid #fff` }}>Place your order</a>
      </div>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "48px 20px", display: "grid", gap: 28 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ display: "inline-block", background: C.volt, border: `2px solid ${C.ink}`, borderRadius: 20, padding: "6px 16px", fontWeight: 800, margin: 0 }}>Ibadan–Ogun farms → Lagos • Every Tuesday</p>
          <h1 style={{ fontSize: 44, margin: "16px 0 8px" }}>Fresh eggs for your business.<br />Locked prices. <span style={{ background: C.sun, padding: "0 10px", border: `2px solid ${C.ink}`, borderRadius: 8 }}>Tuesday delivery.</span></h1>
          <p style={{ fontSize: 19, maxWidth: 620, margin: "0 auto" }}>Bakeries, supermarkets, hotels and neighborhood hubs order on Monday — we aggregate demand, buy straight from the farm, and roll any savings into your wallet.</p>
          <a href="/order" style={{ display: "inline-block", marginTop: 20, background: C.volt, color: C.ink, fontWeight: 900, fontSize: 20, padding: "16px 36px", borderRadius: 12, textDecoration: "none", border: `2px solid ${C.ink}`, boxShadow: `4px 4px 0 ${C.ink}` }}>Place your order →</a>
          <p><small>Minimum 10 crates • Closes Monday 11:59 PM</small></p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
          <div style={card}><h3>🔒 Locked Monday prices</h3><p>Large, Medium, Pullet — set Sunday night, honored all week.</p></div>
          <div style={card}><h3>💰 Wallet rollover</h3><p>Downgrades and breakage come back as credit on your next order.</p></div>
          <div style={card}><h3>🚚 Tuesday drops + crate swap</h3><p>Full crates in, empties out. First order includes crates.</p></div>
        </div>

        <div style={{ background: C.ink, color: "#fff", borderRadius: 12, padding: 24 }}>
          <h2 style={{ color: C.sun, marginTop: 0 }}>How a week runs</h2>
          <p><b>Sunday night</b> — Admin sets prices &nbsp;→&nbsp; <b>Monday</b> — you order, funds held &nbsp;→&nbsp; <b>Tuesday AM</b> — farm paid, truck rolls &nbsp;→&nbsp; <b>Tuesday PM</b> — delivery + crate swap &nbsp;→&nbsp; <b>Night</b> — funds released, credits to wallet.</p>
          <a href="/order" style={{ display: "inline-block", background: C.sun, color: C.ink, fontWeight: 800, padding: "12px 24px", borderRadius: 8, textDecoration: "none" }}>Start Monday's order</a>
        </div>
      </div>
    </div>
  );
}
