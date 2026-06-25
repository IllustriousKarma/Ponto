const CACHE = "ponto-v2";
const BASE  = "/ponto/";
const FILES = [
  BASE,
  BASE + "index.html",
  BASE + "manifest.json",
  BASE + "icon-192.png",
  BASE + "icon-512.png"
];

self.addEventListener("install", ev => {
  ev.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", ev => {
  ev.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", ev => {
  ev.respondWith(
    caches.match(ev.request).then(cached => cached || fetch(ev.request).then(res => {
      // cacheia dinamicamente qualquer recurso do nosso escopo
      if(ev.request.url.includes(BASE)){
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(ev.request, clone));
      }
      return res;
    }))
  );
});
