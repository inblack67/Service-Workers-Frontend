const cacheName = 'v1';
const cacheAssets = [
  'index.html',
  'about.html',
  '/css/style.css',
  'js/main.js',
];

// Install
self.addEventListener('install', (e) => {
  console.log(`SW installed`);
  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log(`SW caching files`);
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate
self.addEventListener('activate', (e) => {
  console.log(`SW activated`);
  // cleanup
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log(`Unwanted cache cleansed`);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// fetch
self.addEventListener('fetch', (e) => {
  console.log(`SW fetching`);
  // no connection, load it from the cache
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
