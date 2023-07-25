importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

workbox.routing.registerRoute(
    ({request}) => request.destination === 'image',
    new workbox.strategies.NetworkFirst()     // NetworkFirst() vs CacheFirst()
);

self.addEventListener('install', function(event) {
    console.log('service worker --> installing ...', event);
})

self.addEventListener('activate', function(event) {
    console.log('service worker --> activating ...', event);
    return self.clients.claim();
})

self.addEventListener('fetch', event => {
    event.respondWith(fetch(event.request));
})
