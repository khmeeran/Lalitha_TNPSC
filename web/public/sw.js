// TNPSC Wizard PWA - Service Worker (Beta RC v1.0.1)
// Offline caching for high-fantasy educational RPG assets, question banks, and audio

const CACHE_NAME = "tnpsc-wizard-v1.0.4";

const PRECACHE_RESOURCES = [
  "/",
  "/manifest.json",
  "/favicon.png",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/data/syllabus_mapping.json",
  "/data/tnpsc_questions.json",
  "/data/ui_strings_ta.json",
  "/assets/lalitha_wizard_hero.webp",
  "/assets/velan_wizard_companion.webp",
  "/assets/comfyui_wizard_bg.webp",
];

// 1. INSTALL EVENT: Precache core shell & critical game data
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_RESOURCES);
      })
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.warn("[SW] Precache partial error (continuing):", err);
        return self.skipWaiting();
      })
  );
});

// 2. ACTIVATE EVENT: Clean up stale caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 3. FETCH EVENT: Stale-While-Revalidate with Robust Offline Fallback
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only handle GET requests and http/https schemes
  if (request.method !== "GET" || !request.url.startsWith("http")) {
    return;
  }

  // Next.js development HMR or WebSocket bypass
  if (request.url.includes("/_next/webpack-hmr") || request.url.includes("turbopack")) {
    return;
  }

  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        // Stale-while-revalidate: Serve from cache, revalidate in background if online
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      // Not in cache: fetch from network
      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          // If offline and navigating, return cached root shell
          if (request.mode === "navigate") {
            const rootCached = await caches.match("/");
            if (rootCached) return rootCached;
          }
          const url = new URL(request.url);
          return caches.match(url.pathname);
        });
    })
  );
});
