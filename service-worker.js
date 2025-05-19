const CACHE_NAME = 'rubix-c-v4';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/timer.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-180.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching assets');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request)
      .then(cached => {
        if (cached) return cached;
        return fetch(e.request)
          .then(response => {
            // Cache new requests
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
            return response;
          })
          .catch(() => caches.match('/index.html')); // Fallback
      })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => key !== CACHE_NAME && caches.delete(key))
    )).then(() => self.clients.claim())
  );
});
