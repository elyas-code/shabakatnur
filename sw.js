const CACHE_NAME = 'shabakat-nur-v1';
const urlsToCache = [
  './',
  './index.html',
  './logo.png',
  './manifest.json',
  './f0rzNHe.png',
  './Digital-CD-Disk-Vector-Transparent-PNG.png',
  './banner.jpeg',
  './pdf/fiqh/research-in-islamic-jurisprudence.pdf',
  './pdf/poetry/bayan-fi-shi3r-hussaini.pdf'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Network first with fallback to cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response
        const clonedResponse = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clonedResponse);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then(response => response || new Response('Network error and no cache available', { status: 404 }));
      })
  );
});
