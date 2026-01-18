// Service Worker for Mental Health Resources PWA
// Enables offline access, caching, and background features

const CACHE_NAME = 'mental-health-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/Global_Resources.html',
  '/Research_Science.html',
  '/Sources_References.html',
  '/Assessments.html',
  '/Crisis_Support.html',
  '/Bibliotherapy.html',
  '/Canada_Mental_Health_Resources.md',
  '/Free_Multimedia_Resources.md',
  '/Healthy_Habits_Depression_Recovery.md',
  '/Panic_Attack_Self_Help_Guide.md',
  '/README.md',
  '/GITHUB_SETUP.md'
];

// Install event: cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('Cache addAll error:', err);
        // Continue even if some resources fail to cache
        return Promise.resolve();
      })
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache the fetched response for future use
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Return offline page or cached page if available
        return caches.match('/index.html');
      })
  );
});

// Background Sync for crisis resources
self.addEventListener('sync', event => {
  if (event.tag === 'sync-crisis-resources') {
    event.waitUntil(
      fetch('/crisis-resources.json')
        .then(response => response.json())
        .then(data => {
          // Store crisis resources in cache
          return caches.open('crisis-data-v1').then(cache => {
            return cache.put('/crisis-resources.json', new Response(JSON.stringify(data)));
          });
        })
    );
  }
});

// Push notifications for wellness reminders
self.addEventListener('push', event => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%233b82f6" width="192" height="192"/><text x="96" y="120" font-size="80" font-weight="bold" fill="%23ffffff" text-anchor="middle">🌟</text></svg>',
      badge: '/data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect fill="%233b82f6" width="96" height="96"/><text x="48" y="70" font-size="50" fill="%23ffffff" text-anchor="middle">🌟</text></svg>',
      tag: 'mental-health-notification',
      requireInteraction: false,
      actions: [
        {
          action: 'open',
          title: 'Open App'
        },
        {
          action: 'close',
          title: 'Dismiss'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification('Mental Health Resources', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // If not, open a new window/tab with the target URL
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});
