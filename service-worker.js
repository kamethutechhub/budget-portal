// Budget Tracker Portal — Service Worker
// Strategy:
//   Same-origin: cache-first (HTML, manifest, icons)
//   CDN (chart.js, xlsx, tesseract, fonts): stale-while-revalidate
//   Everything else: network-only
// Bump CACHE_NAME to force all clients to refresh the shell.
const CACHE_NAME = "budget-portal-v1";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.svg",
  "./icon-maskable.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Same-origin: cache-first, fall back to network, final fallback to index for nav requests
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(resp => {
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone));
        }
        return resp;
      }).catch(() => req.mode === "navigate" ? caches.match("./index.html") : null))
    );
    return;
  }

  // CDN: stale-while-revalidate
  const cdnHosts = ["cdn.jsdelivr.net", "fonts.googleapis.com", "fonts.gstatic.com"];
  if (cdnHosts.some(h => url.hostname.endsWith(h))) {
    event.respondWith(
      caches.match(req).then(cached => {
        const networkFetch = fetch(req).then(resp => {
          if (resp.ok) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then(c => c.put(req, clone));
          }
          return resp;
        }).catch(() => cached);
        return cached || networkFetch;
      })
    );
  }
  // Otherwise default network
});
