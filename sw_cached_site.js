const cacheName = 'v2';

// Install
self.addEventListener('install', (e) => {
  console.log(`SW installed`);
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
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // cloning res
        const clone = res.clone();
        // open cache
        caches.open(cacheName).then((cache) => {
          // add res to cache
          cache.put(e.request, clone);
        });
        return res;
      })
      .catch((err) => caches.match(e.request).then((res) => res))
  );
});

// push notis from server to client
self.addEventListener('push', (e) => {
  const data = e.data.json();
  console.log(`Push received to client`);
  self.registration.showNotification(data.title, {
    body: 'Node.js sends her love',
  });
});
