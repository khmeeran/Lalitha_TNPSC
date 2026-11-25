// TNPSC Wizard PWA - Service Worker (Beta RC v1.0.1)
// Offline caching for high-fantasy educational RPG assets, question banks, and audio

const CACHE_NAME = "tnpsc-wizard-v1.0.2";

const PRECACHE_RESOURCES = [
  "/",
  "/realms",
  "/lesson/node_hist_3",
  "/quiz",
  "/revision",
  "/pyq",
  "/progress",
  "/exam",
  "/manifest.json",
  "/favicon.png",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/icon-512x512.webp",
  "/data/syllabus_mapping.json",
  "/data/tnpsc_questions.json",
  "/data/ui_strings_ta.json",
  "/data/indian_history.json",
  "/data/indian_polity.json",
  "/data/general_science.json",
  "/data/geography.json",
  "/data/indian_economy.json",
  "/data/indian_national_movement.json",
  "/data/tamil_nadu_heritage.json",
  "/data/aptitude_mental_ability.json",
  "/assets/lalitha_character.webp",
  "/assets/lalitha_character.png",
  "/assets/lalitha_wizard_hero.webp",
  "/assets/lalitha_wizard_hero.png",
  "/assets/velan_wizard_companion.webp",
  "/assets/velan_wizard_companion.png",
  "/assets/prop_relic_urn.webp",
  "/assets/prop_relic_urn.png",
  "/assets/wizard_temple_bg.webp",
  "/assets/wizard_temple_bg.png",
  "/assets/comfyui_wizard_bg.webp",
  "/assets/comfyui_wizard_bg.png",
  "/assets/mandapam_campfire_bg.webp",
  "/assets/mandapam_campfire_bg.png",
  "/assets/chola_battle_arena_bg.webp",
  "/assets/chola_battle_arena_bg.png",
  "/assets/ui_gold_coin.webp",
  "/assets/ui_gold_coin.png",
  "/assets/ui_study_scroll.webp",
  "/assets/ui_study_scroll.png",
  "/assets/ui_victory_star.webp",
  "/assets/ui_victory_star.png",
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
