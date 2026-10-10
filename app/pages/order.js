import { useEffect, useState } from "react";
import { theme as C, prices as fallbackPrices } from "../lib/theme";

// Studio: email gate -> known buyers enter, new buyers register, then order.
function windowOpen() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" })).getDay() !== 2;
}
export default function Order() {
  const [contact, setContact] = useState("");
  const [buyer, setBuyer] = useState(null);
  const [reg, setReg] = useState({ name: "", phone: "", email: "", role: "buyer_commercial" });
  const [payEmail, setPayEmail] = useState("");
  const contactIsEmail = contact.includes("@");
  const whoQuery = () => contactIsEmail ? `email=${encodeURIComponent(contact)}` : `phone=${encodeURIComponent(contact)}`;
  const whoBody = () => buyer.email ? { email: buyer.email } : { phone: buyer.phone };
  const [msg, setMsg] = useState("");
  const [size, setSize] = useState("Large");
  const [crates, setCrates] = useState(10);
  const [zone, setZone] = useState("mainland");
  const [address, setAddress] = useState("");
  const [hist, setHist] = useState([]);
  const [paymentOrder, setPaymentOrder] = useState(null);
  const [paying, setPaying] = useState(false);
  const [prices, setPrices] = useState(fallbackPrices);
  useEffect(() => {
    fetch("/api/prices").then((r) => r.json()).then((w) => {
      if (w.large_price) setPrices({ Large: +w.large_price, Medium: +w.medium_price, Pullet: +w.pullet_price });
    }).catch(() => {});
  }, []);
  const ok = crates >= 10;
  const [quote, setQuote] = useState(null);
  useEffect(() => {
    const q = `/api/quote?size=${size}&crates=${crates}&zone=${zone}` + (buyer ? (buyer.email ? `&email=${encodeURIComponent(buyer.email)}` : buyer.phone ? `&phone=${encodeURIComponent(buyer.phone)}` : "") : "");
    fetch(q).then((r) => r.json()).then((j) => setQuote(j.total != null ? j : null)).catch(() => {});
  }, [size, crates, zone, buyer]);
  const input = { width: "100%", padding: 12, borderRadius: 8, border: `2px solid ${C.ink}`, fontSize: 15, marginTop: 6 };

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (!ref) return;
    setMsg("Confirming your payment…");
    fetch(`/api/pay?ref=${encodeURIComponent(ref)}`)
      .then(async (r) => ({ ok: r.ok, body: await r.json() }))
      .then(({ ok, body }) => setMsg(ok ? `Payment confirmed for ${body.order_no || "your order"}.` : `Payment not confirmed: ${body.error || body.status || "please contact support"}.`))
      .catch(() => setMsg("We could not confirm payment just now. Refresh this page to try again."));
  }, []);

  async function startPayment(orderId) {
    setPaying(true);
    try {
      const r = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, ...(buyer.email ? { email: buyer.email } : { phone: buyer.phone }) }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "payment-setup-failed");
      if (j.authorization_url && j.authorization_url.startsWith("https://checkout.paystack.com/")) {
        window.location.assign(j.authorization_url);
        return;
      }
      if (j.mode === "local-hold") {
        setPaymentOrder(null);
        setMsg("Order saved locally. No payment was taken. Add Paystack credentials to enable checkout. Amount due ₦" + Number(j.total_held).toLocaleString("en-NG") + ".");
        return;
      }
      if (j.mode === "wallet" || j.status === "paid") setPaymentOrder(null);
      setMsg(j.status === "paid" ? "This order is already paid." : "Order placed.");
    } catch (error) {
      setMsg(`Order placed, but payment could not start (${error.message}). Use Retry payment below.`);
    } finally {
      setPaying(false);
    }
  }

  async function findBuyer() {
    setMsg("Checking…");
    const r = await fetch(`/api/account?${whoQuery()}`);
    const j = await r.json();
    if (j.exists) {
      setBuyer({ ...j.user, wallet: j.wallet });
      if (j.user.zone === "island" || j.user.zone === "mainland") setZone(j.user.zone);
      if (j.user.shop_address) setAddress(j.user.shop_address);
      setMsg(`Welcome back, ${j.user.name || j.user.email || j.user.phone}!`);
      const h = await fetch("/api/orders-list?" + whoQuery()).then((x) => x.json());
      setHist((h.orders || []).slice(0, 10));
    } else {
      setBuyer(null);
      setReg({ name: "", phone: contactIsEmail ? "" : contact, email: contactIsEmail ? contact : "", role: "buyer_commercial" });
      setMsg("New here — tell us about your business.");
    }
  }

  async function register() {
    setMsg("Creating your account…");
    const r = await fetch("/api/account", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(reg) });
    const j = await r.json();
    if (r.ok) {
      const g = await fetch(`/api/account?${reg.email ? `email=${encodeURIComponent(reg.email)}` : `phone=${encodeURIComponent(reg.phone)}`}`).then((x) => x.json());
      if (g.exists) {
        setBuyer({ ...g.user, wallet: g.wallet || 0 });
        if (g.user?.zone === "island" || g.user?.zone === "mainland") setZone(g.user.zone);
        if (g.user?.shop_address) setAddress(g.user.shop_address);
        setMsg(`Studio open — welcome, ${reg.name}!`);
      } else setMsg("Account created — press Continue again to enter.");
    } else setMsg(`Failed: ${j.error}`);
  }

  async function attachEmail() {
    if (!payEmail.includes("@")) { setMsg("Enter a valid email to pay online."); return; }
    const r = await fetch("/api/account", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: payEmail, phone: buyer.phone, name: buyer.name || "buyer" }) });
    const j = await r.json();
    if (r.ok) {
      setBuyer({ ...buyer, email: payEmail });
      setPayEmail("");
      setMsg("Email saved — continue to payment.");
    } else setMsg(`Failed: ${j.error}`);
  }

  async function cancelOrder(orderId) {
    setMsg("Cancelling…");
    const r = await fetch("/api/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order_id: orderId, ...whoBody() }) });
    const j = await r.json();
    setMsg(r.ok ? "Order cancelled. Hold released." : `Failed: ${j.error || j.message}`);
    fetch("/api/orders-list?" + (buyer.email ? `email=${encodeURIComponent(buyer.email)}` : `phone=${encodeURIComponent(buyer.phone)}`)).then((x) => x.json()).then((h) => setHist((h.orders || []).slice(0, 10))).catch(() => {});
  }

  async function lockOrder() {
    setPaying(true);
    setMsg("Locking…");
    try {
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size_ordered: size, crates, zone, address, ...whoBody() }),
      });
      const j = await r.json();
      if (!r.ok) {
        setMsg(`Failed: ${j.error || j.message}`);
        return;
      }
      setPaymentOrder({ id: j.id, orderNo: j.order_no, amount: Number(j.total_held) });
      setMsg(`Order ${j.order_no || ""} placed. Review the final amount, then continue to payment.`);
      fetch("/api/orders-list?" + (buyer.email ? `email=${encodeURIComponent(buyer.email)}` : `phone=${encodeURIComponent(buyer.phone)}`)).then((x) => x.json()).then((h) => setHist((h.orders || []).slice(0, 10))).catch(() => {});
    } catch {
      setMsg("We could not place the order. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div style={{ fontFamily: "Inter, system-ui", background: C.mist, minHeight: "100vh", color: C.ink }}>
      <div style={{ background: C.ink, color: "#fff", padding: 20, borderBottom: `6px solid ${C.volt}` }}>
        <h1 style={{ margin: 0 }}>Your <span style={{ color: C.sun }}>Studio</span></h1>
        <p>{windowOpen() ? "Ordering open — closes Mon 11:59 PM" : "Delivery day — window reopens Wednesday"} • Wallet applies first • Prices locked all week</p>
      </div>
      <div style={{ maxWidth: 640, margin: "20px auto", display: "grid", gap: 16, padding: 12 }}>
        {!buyer && (
          <div style={{ background: "#fff", border: `2px solid ${C.ink}`, borderRadius: 12, padding: 16 }}>
            <h3>1. Your email or phone number</h3>
            <input style={input} value={contact} onChange={(e) => setContact(e.target.value)} placeholder="you@bakery.com or 0803 000 0000" />
            <button onClick={findBuyer} style={{ marginTop: 10, padding: "12px 20px", fontWeight: 800, borderRadius: 8, border: `2px solid ${C.ink}`, background: C.sun }}>Continue →</button>
            {msg && !buyer && regShown(msg) && (
              <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                <label>Business name<input style={input} value={reg.name} onChange={(e) => setReg({ ...reg, name: e.target.value })} placeholder="Sweet Crust Bakery" /></label>
                <label>Email address<input style={input} value={reg.email} onChange={(e) => setReg({ ...reg, email: e.target.value })} placeholder="you@bakery.com (needed for online payment)" /></label>
                <label>Phone number<input style={input} value={reg.phone} onChange={(e) => setReg({ ...reg, phone: e.target.value })} placeholder="0803 000 0000" /></label>
                <label>I am a<select style={input} value={reg.role} onChange={(e) => setReg({ ...reg, role: e.target.value })}><option value="buyer_commercial">Bakery / Hotel / Supermarket</option><option value="hub_operator">Hub Operator (neighborhood depot)</option></select></label>
                <button onClick={register} style={{ padding: "12px 20px", fontWeight: 800, borderRadius: 8, border: `2px solid ${C.ink}`, background: C.volt }}>Create account + open studio</button>
              </div>
            )}
            {msg && <p><b>{msg}</b></p>}
          </div>
        )}
        {buyer && (
          <>
            <div style={{ background: C.ink, color: "#fff", borderRadius: 12, padding: 16 }}>
              <b>{buyer.name || buyer.email || buyer.phone}</b> • Wallet ₦{Number(buyer.wallet || 0).toLocaleString()} • {buyer.role === "hub_operator" ? "Hub (5% off)" : "Commercial"}
            </div>
            <div style={{ background: "#fff", border: `2px solid ${C.ink}`, borderRadius: 12, padding: 16 }}>
              <h3>Pick size</h3>
              {["Large", "Medium", "Pullet"].map((s) => (
                <button key={s} onClick={() => setSize(s)} style={{ marginRight: 8, padding: "10px 16px", fontWeight: 800, borderRadius: 8, border: `2px solid ${C.ink}`, background: size === s ? C.sun : "#fff" }}>{s} ₦{prices[s].toLocaleString()}</button>
              ))}
            </div>
            <div style={{ background: "#fff", border: `2px solid ${C.ink}`, borderRadius: 12, padding: 16 }}>
              <h3>Delivery zone</h3>
              {(["mainland", "island"]).map((zz) => (
                <button key={zz} onClick={() => setZone(zz)} style={{ marginRight: 8, padding: "10px 16px", fontWeight: 800, borderRadius: 8, border: `2px solid ${C.ink}`, background: zone === zz ? C.sky : "#fff" }}>{zz === "mainland" ? "Mainland ₦2,500" : "Island ₦4,000"}</button>
              ))}
            </div>
            <div style={{ background: "#fff", border: `2px solid ${C.ink}`, borderRadius: 12, padding: 16 }}>
              <h3>Crates (min 10)</h3>
              <button onClick={() => setCrates(Math.max(0, crates - 1))} style={btn}>−</button>
              <b style={{ margin: "0 12px", fontSize: 22 }}>{crates}</b>
              <button onClick={() => setCrates(crates + 1)} style={btn}>+</button>
              <p style={{ fontWeight: 800, background: ok ? C.volt : C.rose, display: "inline-block", padding: "4px 12px", borderRadius: 20, border: `2px solid ${C.ink}` }}>{ok ? "✓ MOV met" : "Need at least 10 crates"}</p>
            </div>
            <div style={{ background: C.ink, color: "#fff", borderRadius: 12, padding: 16 }}>
              <h3 style={{ color: C.sun }}>Total: ₦{(quote ? quote.total : crates * prices[size]).toLocaleString()}</h3>
              <p>{quote ? `Eggs ₦${quote.gross.toLocaleString()}${quote.discount ? ` − hub ₦${quote.discount.toLocaleString()}` : ""} + delivery ₦${quote.fee.toLocaleString()}${quote.crateFee ? ` + first crates ₦${quote.crateFee.toLocaleString()}` : ""}${quote.walletApplied ? ` − wallet ₦${quote.walletApplied.toLocaleString()}` : ""}.` : "Wallet applies first. First order adds crate fee ₦1,500/crate."}</p>
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Delivery address (e.g. 12 Allen Ave, Ikeja)" style={{ width: "100%", padding: 12, borderRadius: 8, border: `2px solid ${C.sun}`, fontSize: 15, marginBottom: 8 }} />
              <button disabled={!ok || paying || !!paymentOrder} onClick={lockOrder} style={{ padding: "12px 20px", fontWeight: 800, borderRadius: 8, border: `2px solid ${C.ink}`, background: ok ? C.volt : "#999" }}>{paying ? "Saving order…" : "Place order"}</button>
              {paymentOrder && <div style={{ marginTop: 12, padding: 12, background: "#fff", color: C.ink, borderRadius: 8 }}>
                <b>Order {paymentOrder.orderNo}: ₦{paymentOrder.amount.toLocaleString("en-NG")} due</b>
                <p>Paystack checkout charges this amount immediately when you authorize payment.</p>
                {!buyer.email && (<div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input value={payEmail} onChange={(e) => setPayEmail(e.target.value)} placeholder="Email for your Paystack receipt (optional)" style={{ flex: 1, padding: 10, borderRadius: 8, border: `2px solid ${C.ink}`, fontSize: 14 }} />
                  <button onClick={attachEmail} style={{ padding: "10px 14px", fontWeight: 800, borderRadius: 8, border: `2px solid ${C.ink}`, background: C.sun }}>Save</button>
                </div>)}
                <button disabled={paying} onClick={() => startPayment(paymentOrder.id)} style={{ padding: "12px 20px", fontWeight: 800, borderRadius: 8, border: `2px solid ${C.ink}`, background: C.sun }}>{paying ? "Opening checkout…" : "Continue to payment"}</button>
              </div>}
              {msg && <p style={{ color: C.sun }}>{msg}</p>}
            </div>
            <div style={{ background: "#FFF6BF", border: `2px solid ${C.ink}`, borderLeft: `8px solid ${C.tang}`, borderRadius: 8, padding: 12 }}>
              Have <b>{crates} clean, empty crates</b> ready for swap on Tuesday.
            </div>
            {hist.length > 0 && (
              <div style={{ background: "#fff", border: `2px solid ${C.ink}`, borderRadius: 12, padding: 16 }}>
                <h3>Recent orders</h3>
                {hist.map((o) => (<p key={o.id}><b>{o.order_no || o.id.slice(0, 8)}</b> — {o.crates}× {o.size_ordered} — {o.status} <button onClick={() => { setSize(o.size_ordered); setCrates(o.crates); if (o.zone) setZone(o.zone); if (o.address) setAddress(o.address); setMsg(`Refilled from ${o.order_no || "past order"} — review and lock.`); window.scrollTo(0, 0); }} style={{ marginLeft: 8, padding: "4px 10px", fontWeight: 800, borderRadius: 8, border: `2px solid ${C.ink}`, background: C.sun }}>Again</button> {o.status === "FundsHeld" && <button onClick={() => cancelOrder(o.id)} style={{ marginLeft: 8, padding: "4px 10px", fontWeight: 800, borderRadius: 8, border: `2px solid ${C.ink}`, background: C.rose, color: "#fff" }}>Cancel</button>}</p>))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
function regShown(m) { return m.startsWith("New here"); }
const btn = { width: 44, height: 44, borderRadius: "50%", border: "2px solid #0A0A0A", background: "#00E676", fontSize: 22, fontWeight: 900 };
