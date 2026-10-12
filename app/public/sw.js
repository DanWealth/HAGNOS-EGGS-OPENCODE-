// Hagnos Eggs offline shell: app pages work offline, orders queue when back.
const CACHE = "hagnos-v2";
const SHELL = ["/", "/order", "/track", "/manifest.json", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.pathname.startsWith("/api/")) return; // API always live
  e.respondWith(caches.match(e.request).then(async (hit) => {
    if (hit) return hit;
    try {
      const res = await fetch(e.request);
      if (res.ok && url.origin === self.location.origin) {
        await caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
      }
      return res;
    } catch {
      if (url.origin === self.location.origin && e.request.mode === "navigate") return caches.match("/");
      return Response.error();
    }
  }));
});
