/* كشوفي — عامل الخدمة: يحفظ ملفات البرنامج ليعمل دون إنترنت.
   غيّر رقم الإصدار V مع كل تحديث للبرنامج حتى يصل التحديث للمعلمين. */
var V='kashufi-2026-10-21e';
var FILES=[
    './',
    'index.html',
    'manifest.webmanifest',
    'fonts/fonts.css',
    'fonts/plex-400-arabic.woff2',
    'fonts/plex-400-latin.woff2',
    'fonts/plex-500-arabic.woff2',
    'fonts/plex-500-latin.woff2',
    'fonts/plex-600-arabic.woff2',
    'fonts/plex-600-latin.woff2',
    'fonts/plex-700-arabic.woff2',
    'fonts/plex-700-latin.woff2',
    'fonts/reem-500-arabic.woff2',
    'fonts/reem-500-latin.woff2',
    'fonts/reem-700-arabic.woff2',
    'fonts/reem-700-latin.woff2',
    'icons/apple-touch-icon.png',
    'icons/icon-192.png',
    'icons/icon-512.png'
];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(V).then(function(c){return c.addAll(FILES);}).then(function(){
    /* النسخة الجديدة تعمل فوراً دون انتظار إغلاق البرنامج */
    return self.skipWaiting();
  }));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k.indexOf('kashufi-')===0&&k!==V;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('message',function(e){if(e.data==='skip')self.skipWaiting();});
self.addEventListener('fetch',function(e){
  var req=e.request,url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==location.origin)return;
  /* الإصدار الأول يبقى كما هو من الشبكة */
  if(url.pathname.indexOf('/v1/')>=0)return;
  if(req.mode==='navigate'){
    e.respondWith(caches.match('index.html').then(function(r){return r||fetch(req);}));
    return;
  }
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(function(r){return r||fetch(req);}));
});
