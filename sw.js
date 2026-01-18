const CACHE_NAME = 'mh-resources-cache-v1';
const OFFLINE_URLS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './Canada_Mental_Health_Resources.md',
  './Panic_Attack_Self_Help_Guide.md',
  './Healthy_Habits_Depression_Recovery.md',
  './Free_Multimedia_Resources.md'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'refreshCache') {
    caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_URLS));
  }
});
