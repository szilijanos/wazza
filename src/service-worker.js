/* eslint-disable no-console */
// Actually we DO want to log from the sw

/* eslint-disable no-restricted-globals */
// 'self' is a global, that should be accessed, as it reference to the sw instance

const staticFilesToCache = [
    'app.js',
    'index.html',
    'global.css',
    'assets/css/scheduleItemStyles.css',
    'assets/icons/icon-bus.svg',
    'assets/icons/icon-ship.svg',
    'assets/icons/icon-train.svg',
    'components/footer.js',
    'components/header.js',
    'components/resultsHeader.js',
    'components/scheduleItem.js',
    'components/schedules.js',
    'components/pages/searchPage.js',
    'services/dataMapperService.js',
    'mockData/Tihany_Dombovar.js', // this is not static, and shall be removed, once dínamic caching works
];

const staticCacheVersion = 'v1.0';
const staticCacheName = `pages-cache-${staticCacheVersion}`;

self.addEventListener('install', event => {
    event.waitUntil(caches.open(staticCacheName).then(cache => cache.addAll(staticFilesToCache)));
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [staticCacheName];

    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                    return caches;
                }),
            ),
        ),
    );
});

self.addEventListener('fetch', event => {
    console.log('Fetch event for ', event.request.url);

    event.respondWith(
        caches
            .match(event.request.url)
            .then(response => {
                if (response) {
                    console.log('Found ', event.request.url, ' in cache');
                    return response;
                }
                console.log('Network request for ', event.request.url);
                return fetch(event.request);
            })
            .catch(error => {
                console.log(error);
                // Respond with custom offline page
            }),
    );
});
