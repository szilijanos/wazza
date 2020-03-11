/* eslint-disable no-console */
// Actually we DO want to log from the sw

/* eslint-disable no-restricted-globals */
// 'self' is a global, that should be accessed, as it reference to the sw instance

const staticFilesToCache = [
    /*     'app.js',
    'index.html',
    'global.css',
    'assets/css/scheduleItemStyles.css',
    'assets/css/scheduleItemDetailsStyles.css',
    'assets/css/routeItemStyles.css',
    'assets/icons/favicon.ico',
    'assets/icons/icon-bus.svg',
    'assets/icons/icon-ship.svg',
    'assets/icons/icon-train.svg',
    'components/common/footer.js',
    'components/common/header.js',
    'components/pages/schedules/resultsHeader.js',
    'components/pages/schedules/scheduleItem.js',
    'components/pages/schedules/scheduleItemDetails.js',
    'components/pages/schedules/schedulesPage.js',
    'components/pages/search/searchPage.js',
    'components/pages/routes/routesPage.js',
    'components/pages/routes/routeItem.js',
    'services/dataConversionService.js',
    'services/searchFormService.js',
    'services/idbService.js',
    'state/pageState.js' */
];

const staticCacheVersion = 'v1.0';
const staticCacheName = `pages-cache-${staticCacheVersion}`;

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(staticCacheName)
            .then(
                (cache) => cache.addAll(staticFilesToCache)
            )
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [staticCacheName];

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                    return caches;
                }),
            ))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches
            .match(event.request.url)
            .then((response) => {
                if (response) {
                    return response;
                }

                // console.log('Network request for ', event.request.url);
                return fetch(event.request);
            })
            .catch((error) => {
                console.log(error);
                // Respond with custom offline page
            }),
    );
});
