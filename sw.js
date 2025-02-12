'use strict';

const appCaches = [
  {
    name: 'core-20250211.03',
    urls: [
      '/',
      '/bundle.js',
      '/favicon.png',
      '/help/about.html',
      '/icons.svg',
      '/index.html',
      '/js/load.js',
      '/js/progress.js',
      '/manifest.json',
      '/robots.txt',
    ]
  },
  {
    name: 'css-20240515.01',
    urls: [
      '/css/font.css',
      '/css/kja.css',
    ]
  },
  {
    name: 'font-20240515.01',
    urls: [
      '/font/courgette-v17-latin-regular.woff2',
      '/font/inconsolata-v32-latin-regular.woff2',
      '/font/merienda-v19-latin-regular.woff2',
      '/font/merriweather-v30-latin-regular.woff2',
      '/font/noto-serif-hebrew-v25-latin-regular.woff2',
      '/font/open-sans-v40-latin-regular.woff2',
      '/font/roboto-mono-v23-latin-regular.woff2',
      '/font/roboto-slab-v34-latin-regular.woff2',
      '/font/roboto-v30-latin-regular.woff2',
    ]
  },
  {
    name: 'help-20240516.01',
    urls: [
      '/help/bookmark.html',
      '/help/clipboard-mode.html',
      '/help/help.html',
      '/help/navigator.html',
      '/help/overview.html',
      '/help/read.html',
      '/help/search.html',
      '/help/setting.html',
      '/help/thats-my-king.html',
      '/help/the-acts-of-peter.html',
    ]
  },
  {
    name: 'json-20240515.01',
    urls: [
      '/json/kja_lists.json',
      '/json/kja.json',
    ]
  },
  {
    name: 'png-20240515.01',
    urls: [
      '/png/icon-032.png',
      '/png/icon-192.png',
      '/png/icon-512.png',
      '/png/maskable-icon-192.png',
      '/png/maskable-icon-512.png',
    ],
  },
  {
    name: 'webp-20240515.01',
    urls: [
      '/webp/android.webp',
      '/webp/desktop.webp',
    ],
  },
];

const cacheNames = appCaches.map((cache) => cache.name);

self.addEventListener('install', (event) => {
  event.waitUntil(caches.keys().then((keys) => {
    return Promise.all(appCaches.map(async (appCache) => {
      if (keys.indexOf(appCache.name) === -1) {
        const cache = await caches.open(appCache.name);
        console.log(`Caching: ${appCache.name}`);
        return await cache.addAll(appCache.urls);
      } else {
        console.log(`Found: ${appCache.name}`);
        return Promise.resolve(true);
      }
    }));
  }));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (cacheNames.indexOf(key) === -1) {
          console.log(`Deleting: ${key}`);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response ||
      fetch(event.request).then((response) => response)).catch((error) => {
      console.log('Fetch failed:', error);
    })
  );
});
