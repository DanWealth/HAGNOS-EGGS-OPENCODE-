import { useEffect, useState } from "react";

// Visible install button: Chrome/Edge get one-tap install,
// iPhone gets Add-to-Home-Screen steps.
export default function InstallButton({ style }) {
  const [ready, setReady] = useState(null);
  const [ios, setIos] = useState(false);
  const [showIos, setShowIos] = useState(false);

  useEffect(() => {
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent) && !window.navigator.standalone);
    const onPrompt = (e) => { e.preventDefault(); setReady(e); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (ready) {
    return (
      <button onClick={() => ready.prompt()} style={style || btn}>
        ⬇ Install app
      </button>
    );
  }
  if (ios) {
    return (
      <span>
        <button onClick={() => setShowIos(!showIos)} style={style || btn}>⬇ Install app</button>
        {showIos && <span style={{ display: "block", marginTop: 6, fontSize: 13 }}>Tap <b>Share ⬆</b> → <b>Add to Home Screen</b>.</span>}
      </span>
    );
  }
  return null;
}
const btn = { background: "#0A0A0A", color: "#FFD600", fontWeight: 800, padding: "10px 18px", borderRadius: 8, border: "2px solid #0A0A0A", cursor: "pointer" };
