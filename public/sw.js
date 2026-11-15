/* NEW: offline support.
   Anything a visitor has already loaded (pages, images, stories, Supabase lists) is kept
   in the browser, so the site keeps showing it when the internet drops instead of
   the "No internet" dinosaur page. Bump VERSION to force everyone to refresh the cache. */
const VERSION = 'v1';
const SHELL = `gz-shell-${VERSION}`;
const STATIC = `gz-static-${VERSION}`;
const IMAGES = `gz-images-${VERSION}`;
const DATA = `gz-data-${VERSION}`;
const KEEP = [SHELL, STATIC, IMAGES, DATA];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL).then((c) => c.add('/')).catch(() => {}).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !KEEP.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function save(cacheName, key, response) {
  // Opaque = cross-origin image (e.g. a storage redirect). It can't be inspected but can be shown.
  if (response && (response.ok || response.type === 'opaque')) {
    try {
      const cache = await caches.open(cacheName);
      await cache.put(key, response.clone());
    } catch (e) {
      /* storage full: ignore */
    }
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Never cache the admin area
  if (sameOrigin && (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/admin'))) return;
  // Audio/video stream with partial requests: let the browser handle them
  if (req.destination === 'audio' || req.destination === 'video') return;

  // 1) Pages: network first, fall back to the last copy
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => save(SHELL, req, res))
        .catch(async () => (await caches.match(req)) || (await caches.match('/')) || Response.error())
    );
    return;
  }

  // 2) Built JS / CSS / fonts: cache first (file names change with every build)
  if (sameOrigin && url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => save(STATIC, req, res)))
    );
    return;
  }

  // 3) Images: cache first. Signed storage links change, so key by address without the query.
  if (req.destination === 'image') {
    const key = url.origin + url.pathname;
    event.respondWith(
      caches.match(key).then(
        (hit) => hit || fetch(req).then((res) => save(IMAGES, key, res)).catch(() => Response.error())
      )
    );
    return;
  }

  // 4) Page data + Supabase lists: show the saved copy instantly, refresh it in the background
  if (sameOrigin || url.hostname.endsWith('.supabase.co')) {
    event.respondWith(
      caches.open(DATA).then(async (cache) => {
        const hit = await cache.match(req);
        const network = fetch(req)
          .then((res) => {
            if (res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => hit || Response.error());
        return hit || network;
      })
    );
  }
});
