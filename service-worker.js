const CACHE_NAME = 'LawPortal-v1.1'; // cambia la versión cuando actualices
const urlsToCache = [
  './',
  './index.html',
  './assets/css/styles.css',
  './assets/js/script.js',
  './assets/js/test.js',
  './assets/img/logo.png',
  './assets/img/Logo.ico',
];

// Instalar y cachear
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // fuerza a usar el nuevo SW sin esperar
});

// Fetch: primero cache, luego red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) =>
      response || fetch(event.request)
    )
  );
});

// Activar y limpiar versiones viejas
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim(); // toma control inmediato de las páginas
});
