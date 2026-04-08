const cacheName = "MyCache";
const precachedPaths = [
  "/",
  "/index.html",
  "/style.css",
  "/index.js",
]

async function precache() {
  console.log("precache called")
  const cache = await caches.open(cacheName);
  cache.addAll(precachedPaths);
}

self.addEventListener("install", (e) => {
  console.log("install event triggered");
  e.waitUntil(precache());
});


async function cacheFirst(request) {
  console.log("Cache first")
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  if (cachedResponse) return cachedResponse;
  console.log("response not in cache")
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response)
    }
    return response;
  } catch (error) {
    return Response.error();
  }
}


self.addEventListener("fetch", (e) => {
  e.respondWith(cacheFirst(e.request))
});
