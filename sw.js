// ============================================================
//  sw.js — Service Worker · DosisPed v1
//  Estrategia network-first con fallback a caché para uso offline.
// ============================================================

const CACHE_NAME = "dosisped-v3";

const ASSETS = [
  "./index.html",
  "./styles.css",
  "./app.js",
  "./farmacos.js",
  "./manifest.json",
  "./icon-192.svg",
  "./icon-512.svg",
  "./icon-180.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200 && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
