/* eslint-disable no-restricted-globals */
self.addEventListener('install', event => {
    console.log('SW installed!', { event });

    event.waitUntil(
        caches.open('staticAssets').then(cache => cache.addAll(['/index.html', '/app.mjs'])),
    );
});

self.addEventListener('activate', event => {
    console.log('SW activated!', { event });
});

self.addEventListener('fetch', event => {
    console.log('Fetching:', event.request.url);
});
