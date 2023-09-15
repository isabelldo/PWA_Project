importScripts('./src/js/db.js');
importScripts('/src/js/idb.js');

const CACHE_VERSION = 1;
const CURRENT_STATIC_CACHE = 'static-v'+CACHE_VERSION;
const CURRENT_DYNAMIC_CACHE = 'dynamic-v'+CACHE_VERSION;
const STATIC_FILES = [
    "/",
    "/index.html",
    "/src/js/app.js",
    "/src/js/feed.js",
    "/src/js/idb.js",
    "/src/css/app.css",
    "/src/css/feed.css",
    "/src/images/Panorama_2.jpg",
    "/src/images/Icon.jpg",
    "/src/images/Hamburgermenü.png",
    "/src/images/vergrößern_icon.png",
    "/src/images/exit_icon.png",
    "/src/images/camera_icon.png",
    "/src/images/32360.png",
    "/src/images/image_icon.png",
];
self.addEventListener('activate', event => {
    console.log('service worker --> activating ...', event);
    event.waitUntil(
        caches.keys()
            .then( keyList => {
                return Promise.all(keyList.map( key => {
                    if(key !== CURRENT_STATIC_CACHE && key !== CURRENT_DYNAMIC_CACHE) {
                        console.log('service worker --> old cache removed :', key);
                        return caches.delete(key);
                    }
                }))
            })
    );
    return self.clients.claim();
})

self.addEventListener('fetch', event => {
    // check if request is made by chrome extensions or web page
    // if request is made for web page url must contains http.
    if (!event.request.url.includes('http')) return;        // skip the request. if request is not made with http protocol
    if (event.request.url.includes('myFile.jpg')) return;   // skip the request. see feed.js fetch(imageURI)

    const url = 'http://localhost:3000/posts';
    if(event.request.url.indexOf(url) >= 0) {
        console.log('event.request', event.request)
        event.respondWith(
            fetch(event.request)
                .then ( res => {
                    if(event.request.method === 'GET') {
                        const clonedResponse = res.clone();
                        clearAllData('posts')
                            .then( () => {
                                clonedResponse.json()
                                    .then( data => {
                                        for(let key in data)
                                        {
                                            writeData('posts', data[key]);
                                        }
                                    })
                            })
                    }
                    return res;
                })
        )
    } else {
        event.respondWith(
            caches.match(event.request)
                .then( response => {
                    if(response) {
                        return response;
                    } else {
                        console.log('event.request', event.request)
                        return fetch(event.request)
                            .then( res => {     // nicht erneut response nehmen, haben wir schon
                                return caches.open(CURRENT_DYNAMIC_CACHE)      // neuer, weiterer Cache namens dynamic
                                    .then( cache => {
                                        cache.put(event.request.url, res.clone());
                                        return res;
                                    })
                            });
                    }
                })
        )
    }
})

self.addEventListener('sync', event => {
    console.log('service worker --> background syncing ...', event);
    if(event.tag === 'sync-new-post') {
        console.log('service worker --> syncing new posts ...');
        event.waitUntil(
            readAllData('sync-posts')
                .then( dataArray => {
                    for(let data of dataArray) {
                        console.log('data from IndexedDB', data);
                        const formData = new FormData();
                        formData.append('title', data.title);
                        formData.append('location', data.location);
                        formData.append('file', data.image_id);

                        console.log('formData', formData)

                        fetch('http://localhost:3000/posts', {
                            method: 'POST',
                            body: formData
                        })
                            .then( response => {
                                console.log('Data sent to backend ...', response);
                                if(response.ok) {
                                    deleteOneData('sync-posts', data.id)
                                }
                            })
                            .catch( err => {
                                console.log('Error while sending data to backend ...', err);
                            })
                    }
                })
        );
    }
})