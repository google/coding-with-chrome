/**
 * @fileoverview Service Worker for the Coding with Chrome suite.
 *
 * @license Copyright 2020 The Coding with Chrome Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author mbordihn@google.com (Markus Bordihn)
 */

let assetsCache = {};

setInterval(() => {
  if (assetsCache !== serviceWorkerOption.assets) {
    assetsCache = serviceWorkerOption.assets;
    console.log('New assets', assetsCache);
  }
}, 1000);

self.addEventListener('install', function(event) {
  console.log('Install service worker ...');
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll(serviceWorkerOption.assets);
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('Fetch request', event);
  event.respondWith(caches.match(event.request));
});
