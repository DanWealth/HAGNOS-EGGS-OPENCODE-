import { theme as C } from "../lib/theme";

export function windowStatus() {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" }));
  if (now.getDay() === 2) return { open: false, text: "Delivery day — window reopens Wednesday" };
  if (now.getDay() === 1) return { open: true, text: "Ordering open now — closes tonight 11:59 PM" };
  return { open: true, text: "Ordering open — prices locked all week" };
}

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
          <p style={{ fontSize: 19, maxWidth: 620, margin: "0 auto" }}>Bakeries, supermarkets, hotels and neighborhood hubs order Wednesday to Monday — we aggregate demand, buy straight from the farm, and roll any savings into your wallet. Prices locked all week, Tuesday is delivery day.</p>
          <a href="/order" style={{ display: "inline-block", marginTop: 20, background: C.volt, color: C.ink, fontWeight: 900, fontSize: 20, padding: "16px 36px", borderRadius: 12, textDecoration: "none", border: `2px solid ${C.ink}`, boxShadow: `4px 4px 0 ${C.ink}` }}>Place your order →</a>
                  <p><small>Minimum 10 crates • {windowStatus().text} • Prices locked all week • <a href="/visuals">See it fresh</a> • <a href="/track">Track order</a></small></p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
          <div style={card}><h3>🔒 Locked all-week prices</h3><p>Large, Medium, Pullet — set Wednesday, honored till Monday night.</p></div>
          <div style={card}><h3>💰 Wallet rollover</h3><p>Downgrades and breakage come back as credit on your next order.</p></div>
          <div style={card}><h3>🚚 Tuesday drops + crate swap</h3><p>Full crates in, empties out. First order includes crates.</p></div>
        </div>

        <div style={{ background: C.grape, color: "#fff", borderRadius: 12, padding: 24, border: `2px solid ${C.ink}` }}>
          <h2 style={{ marginTop: 0 }}>Run a neighborhood hub?</h2>
          <p>Depot partners buy 5% below commercial price, sell to Indomie joints and walk-ins, and keep the margin. Same Tuesday truck, same wallet rollover.</p>
          <a href="/hub" style={{ display: "inline-block", background: "#fff", color: C.ink, fontWeight: 800, padding: "12px 24px", borderRadius: 8, textDecoration: "none" }}>Register as a hub</a>
        </div>

        <div style={{ background: C.ink, color: "#fff", borderRadius: 12, padding: 24 }}>
          <h2 style={{ color: C.sun, marginTop: 0 }}>How a week runs</h2>
          <p><b>Wednesday morning</b> — Admin sets prices (locked all week) &nbsp;→&nbsp; <b>Wed–Mon</b> — you order, funds held &nbsp;→&nbsp; <b>Sunday</b> — Admin reviews prices &nbsp;→&nbsp; <b>Tuesday AM</b> — farm paid, truck rolls &nbsp;→&nbsp; <b>Tuesday PM</b> — delivery + crate swap &nbsp;→&nbsp; <b>Night</b> — funds released, credits to wallet.</p>
          <a href="/order" style={{ display: "inline-block", background: C.sun, color: C.ink, fontWeight: 800, padding: "12px 24px", borderRadius: 8, textDecoration: "none" }}>Start your order</a>
        </div>
      </div>
    </div>
  );
}
