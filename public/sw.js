/*
 * El panel guardado en el celular.
 *
 * Sirve para dos cosas: que abra al toque y que ande sin señal.
 * Los datos ya viven en el aparato (localStorage), así que sin
 * internet el panel funciona completo, no a medias.
 *
 * Solo se mete con /panel y con los archivos que genera Astro.
 * El sitio público sigue yendo a la red siempre, para que un
 * cambio de precio se vea al instante.
 */
const CACHE = 'panel-v1';
const BASE = ['/panel/', '/manifest.webmanifest', '/icono-192.png', '/icono-512.png'];

self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(BASE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches
      .keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function nosCorresponde(url) {
  return url.pathname === '/panel/' || url.pathname.startsWith('/_astro/');
}

self.addEventListener('fetch', (ev) => {
  if (ev.request.method !== 'GET') return;

  const url = new URL(ev.request.url);
  if (url.origin !== location.origin || !nosCorresponde(url)) return;

  // Los archivos de Astro llevan el hash en el nombre: si están
  // guardados, son los correctos. Se sirven de la caché sin preguntar.
  if (url.pathname.startsWith('/_astro/')) {
    ev.respondWith(
      caches.match(ev.request).then(
        (guardado) =>
          guardado ||
          fetch(ev.request).then((resp) => {
            const copia = resp.clone();
            caches.open(CACHE).then((c) => c.put(ev.request, copia));
            return resp;
          })
      )
    );
    return;
  }

  // La página: primero la red, para tomar las mejoras que subamos.
  // Si no hay señal, la copia guardada.
  ev.respondWith(
    fetch(ev.request)
      .then((resp) => {
        const copia = resp.clone();
        caches.open(CACHE).then((c) => c.put('/panel/', copia));
        return resp;
      })
      .catch(() => caches.match('/panel/'))
  );
});
