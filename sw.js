/**
 * Tiag Kitchen — Service Worker
 * Version: tiag-kitchen-v2
 * Offline-first precache engine. Zero-network survivability for live event kitchen service.
 */

const CACHE_NAME = 'tiag-kitchen-v2';

const CORE_ASSETS = [
  '/',
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

// Install: Precache all core shell assets & skip waiting for instant upgrade
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    })
  );
});

// Activate: Prune stale caches & claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-First for navigation (HTML documents) with offline cache fallback, Cache-First for static assets
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // 1. Navigation requests (HTML document loads): Network-First, fallback to cached index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
              cache.put('./index.html', responseToCache.clone());
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match('./index.html').then((cached) => cached || caches.match('/'));
        })
    );
    return;
  }

  // 2. Static assets: Cache-First, fallback to network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return null;
        });
    })
  );
});

// Listen for explicit update/skip-waiting command from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CHECK_CACHE_STATUS') {
    caches.open(CACHE_NAME).then(async (cache) => {
      const keys = await cache.keys();
      const urls = keys.map((k) => new URL(k.url).pathname);
      const allCached = CORE_ASSETS.every((asset) => {
        const clean = asset.replace('./', '/');
        return urls.some((u) => u.endsWith(clean) || (clean === '/' && u.endsWith('/')));
      });
      event.ports[0]?.postMessage({ ready: allCached, count: urls.length });
    });
  }
});
