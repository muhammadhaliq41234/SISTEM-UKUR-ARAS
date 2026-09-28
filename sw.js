const CACHE_NAME = 'ukur-aras-pwa-v1';

// Senarai fail tempatan dan pustaka luaran (CDN) untuk disimpan offline
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap'
];

// Peringkat Install: Simpan semua fail ke dalam Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Menyimpan fail ke dalam Cache untuk kegunaan offline...');
      return cache.addAll(urlsToCache);
    })
  );
});

// Peringkat Fetch: Ambil fail dari Cache jika tiada sambungan internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Jika gagal fetch & tiada dalam cache
        return caches.match('./index.html');
      });
    })
  );
});

// Peringkat Activate: Padam cache lama jika ada kemas kini
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Merapikan cache lama:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});