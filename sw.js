// ============================================================
//  sw.js — Service Worker · DosisPed v1
//  Estrategia network-first con fallback a caché para uso offline.
// ============================================================

const CACHE_NAME = "dosisped-v16";

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
  // NO llamamos a skipWaiting() aquí: el SW queda en espera hasta que
  // el usuario confirme la actualización desde el banner de la app.
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
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

// Mensaje desde la app: el usuario pulsó "Actualizar" en el banner
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
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
