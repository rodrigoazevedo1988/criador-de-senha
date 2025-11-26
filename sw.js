// Service Worker for Password Generator PWA
// Version: 2.0

const CACHE_NAME = 'password-generator-v2.0';
const CACHE_VERSION = '2.0.0';

// Files to cache for offline functionality
const CORE_FILES = [
    './',
    './index.html',
    './style.css', 
    './script.js',
    './manifest.json'
];

// Optional resources (won't block installation if unavailable)
const OPTIONAL_FILES = [
    './icons/icon-192x192.png',
    './icons/icon-512x512.png',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// === SERVICE WORKER EVENTS ===

// Install Event - Cache essential resources
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker v' + CACHE_VERSION);
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching core files...');
                
                // Cache core files (essential)
                const corePromise = cache.addAll(CORE_FILES);
                
                // Cache optional files (non-blocking)
                const optionalPromise = Promise.allSettled(
                    OPTIONAL_FILES.map(url => 
                        fetch(url)
                            .then(response => response.ok ? cache.put(url, response) : null)
                            .catch(err => console.log(`[SW] Optional file failed: ${url}`))
                    )
                );
                
                return Promise.all([corePromise, optionalPromise]);
            })
            .then(() => {
                console.log('[SW] Core files cached successfully');
                // Force activation of new service worker
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] Cache installation failed:', error);
            })
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker v' + CACHE_VERSION);
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[SW] Service Worker activated and ready');
                // Take control of all pages immediately
                return self.clients.claim();
            })
    );
});

// Fetch Event - Serve cached content with network fallback
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip cross-origin requests (except fonts)
    const url = new URL(event.request.url);
    const isOriginRequest = url.origin === location.origin;
    const isFontRequest = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
    
    if (!isOriginRequest && !isFontRequest) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    console.log('[SW] Serving from cache:', event.request.url);
                    return cachedResponse;
                }
                
                // Not in cache, fetch from network
                return fetch(event.request)
                    .then((response) => {
                        // Only cache successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone response for caching
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                console.log('[SW] Caching new resource:', event.request.url);
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch((error) => {
                        console.log('[SW] Fetch failed, serving offline fallback:', error);
                        
                        // Serve offline fallback for HTML requests
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('./index.html');
                        }
                        
                        // For other requests, return a basic offline response
                        return new Response('Offline - Content not available', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: {
                                'Content-Type': 'text/plain'
                            }
                        });
                    });
            })
    );
});

// Background Sync Event (for future features)
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync triggered:', event.tag);
    
    if (event.tag === 'background-sync-passwords') {
        event.waitUntil(
            // Future: Sync password data with cloud service
            console.log('[SW] Background sync completed')
        );
    }
});

// Push Event (for future notifications)
self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New notification from Password Generator',
        icon: './icons/icon-192x192.png',
        badge: './icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        tag: 'password-generator-notification',
        actions: [
            {
                action: 'open',
                title: 'Open App',
                icon: './icons/action-open.png'
            },
            {
                action: 'dismiss',
                title: 'Dismiss',
                icon: './icons/action-dismiss.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Password Generator', options)
    );
});

// Notification Click Event
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message Event (communication with main app)
self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);
    
    if (event.data && event.data.type) {
        switch (event.data.type) {
            case 'SKIP_WAITING':
                self.skipWaiting();
                break;
            case 'GET_VERSION':
                event.ports[0].postMessage({ version: CACHE_VERSION });
                break;
            case 'CLEAR_CACHE':
                event.waitUntil(
                    caches.delete(CACHE_NAME).then(() => {
                        event.ports[0].postMessage({ success: true });
                    })
                );
                break;
        }
    }
});

// === UTILITY FUNCTIONS ===

// Cache management utilities
const CacheManager = {
    // Get cache size
    async getCacheSize() {
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();
        return keys.length;
    },
    
    // Clear specific cache entry
    async clearCacheEntry(url) {
        const cache = await caches.open(CACHE_NAME);
        return cache.delete(url);
    },
    
    // Update cache entry
    async updateCacheEntry(request) {
        try {
            const response = await fetch(request);
            if (response.ok) {
                const cache = await caches.open(CACHE_NAME);
                await cache.put(request, response.clone());
                return response;
            }
        } catch (error) {
            console.error('[SW] Cache update failed:', error);
        }
        return null;
    }
};

console.log('[SW] Service Worker script loaded successfully v' + CACHE_VERSION);