// Service Worker for AI One-File Arcade
// Network-first for HTML/manifest to avoid stale app shells, cache-first for static assets.
const CACHE_VERSION = 'v3-20250302';
const CACHE_NAME = `ai-arcade-${CACHE_VERSION}`;
const CORE_ASSETS = ['/', '/index.html', '/games-manifest.json', '/manifest.json'];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch((error) => {
        console.log('Cache failed:', error);
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const sameOrigin = url.origin === self.location.origin;
  const isDocument = event.request.mode === 'navigate' || event.request.destination === 'document';
  const isManifest = url.pathname === '/games-manifest.json';

  // Always try network first for app shell/manifest to avoid stale versions.
  if (isDocument || isManifest) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Cache-first for same-origin assets; fall back to network.
  if (sameOrigin) {
    event.respondWith(cacheFirst(event.request));
  }
});

// Activate event - clean up old caches
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
  self.clients.claim();
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const clone = response.clone();
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, clone);
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      return caches.match('/index.html');
    }
    throw error;
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.status === 200 && response.type === 'basic') {
    const clone = response.clone();
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, clone);
  }
  return response;
}
