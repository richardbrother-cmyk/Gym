/* Service worker: cache-first app shell + media so the app works offline. */
const VERSION = 'gym-tracker-v2';
const SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/icon-180.png',
  './icons/icon.svg',
];
const MEDIA = [
  'press-pecho-plano', 'jalon-al-pecho', 'press-pecho-inclinado', 'remo-sentado-al-pecho',
  'press-pecho-declinado', 'peck-deck-invertido', 'jalon-a-la-barbilla', 'espalda-baja',
  'press-militar-mancuernas-sentado', 'laterales-mancuernas-de-pie', 'posterior-unilateral-polea-alta',
  'curl-biceps-barra-z', 'extension-polea-alta-barra', 'curl-martillo-unilateral-sentado', 'extension-polea-alta-cuerda',
].flatMap((n) => [`./media/${n}.mp4`, `./media/thumbs/${n}.jpg`]).concat(
  ['peck-deck-cristo', 'pull-over-polea-alta', 'frontal-unilateral-mancuernas', 'predicador', 'extension-trasnuca-polea-cuerda'].flatMap((n) => [`./media/${n}.jpg`, `./media/thumbs/${n}.jpg`])
);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then(async (cache) => {
      await cache.addAll(SHELL);
      // Media is cached best-effort so a single failure never blocks install.
      await Promise.allSettled(MEDIA.map((url) => cache.add(url)));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Range requests (video seeking) are answered from the cache manually.
  if (request.headers.has('range')) {
    event.respondWith(rangeFromCache(request));
    return;
  }

  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cached) => {
      const network = fetch(request).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(request, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});

async function rangeFromCache(request) {
  const cached = await caches.match(request.url, { ignoreSearch: true });
  if (!cached) return fetch(request);
  const buf = await cached.arrayBuffer();
  const total = buf.byteLength;
  const m = /bytes=(\d+)-(\d*)/.exec(request.headers.get('range') || '');
  const start = m ? Number(m[1]) : 0;
  const end = m && m[2] ? Math.min(Number(m[2]), total - 1) : total - 1;
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': cached.headers.get('Content-Type') || 'video/mp4',
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes',
    },
  });
}
