// Uygulama dosyalarını telefona kaydeder; internet olmadan da açılır.
const CACHE = "antrenman-v2";
const FILES = ["./", "index.html", "manifest.webmanifest", "uyanik.mp4",  "apple-touch-icon.png",  "carsamba_0.png",  "carsamba_1.png",  "carsamba_2.png",  "carsamba_3.png",  "ch_climber.png",  "ch_cross.png",  "ch_forearm.png",  "ch_highknee.png",  "ch_plank.png",  "ch_seated.png",  "cuma_0.png",  "cuma_1.png",  "cuma_2.png",  "cuma_3.png",  "cuma_4.png",  "icon-192.png",  "icon-512.png",  "pazartesi_0.png",  "pazartesi_1.png",  "pazartesi_2.png",  "pazartesi_3.png",  "pazartesi_4.png",  "persembe_0.png",  "persembe_1.png",  "persembe_2.png",  "persembe_3.png",  "persembe_4.png",  "sali_0.png",  "sali_1.png",  "sali_2.png",  "sali_3.png",  "sali_4.png",  "wallsit_deep.png",  "wallsit_half.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  // Sayfanın kendisi: önce internetten en yenisini dene (3 sn), olmazsa kayıtlı olanı aç
  if (req.mode === "navigate") {
    e.respondWith((async () => {
      const cached = await caches.match("index.html");
      try {
        const net = await Promise.race([fetch(req), new Promise((_, rej) => setTimeout(() => rej(), 3000))]);
        if (net && net.ok) return net;
      } catch (err) {}
      return cached || fetch(req);
    })());
    return;
  }
  if (req.headers.has("range")) return; // video: tarayıcı halletsin
  e.respondWith(caches.match(req, {ignoreSearch: true}).then(r => r || fetch(req)));
});
