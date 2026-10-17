/* Prosty service worker: zapamiętuje powłokę aplikacji, żeby startowała od razu.
   Dane (Firestore) i wyszukiwarka książek zawsze idą przez sieć. Zmień VERSION, gdy wypuszczasz nową wersję. */
const VERSION = "trzy-strony-v4";
const SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
  "fonts/nunito.woff2",
  "fonts/caveat.woff2",
  "fonts/pacifico.woff2",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // Firebase, Open Library i fonty: bez ingerencji

  // Strona: najpierw sieć (zawsze świeża wersja), a offline z pamięci podręcznej
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put("index.html", copy)); return res; })
        .catch(() => caches.match("index.html"))
    );
    return;
  }

  // Ikony i manifest: najpierw pamięć podręczna
  event.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
});
