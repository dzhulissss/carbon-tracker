const CACHE = 'carbon-tracker-pro-v1';
const ASSETS = ['./','./index.html','./manifest.webmanifest'];
self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (e)=>{
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(req).then(res=>{
      const copy = res.clone(); caches.open(CACHE).then(c=>c.put(req, copy)); return res;
    }).catch(()=>caches.match(req))
  );
});
