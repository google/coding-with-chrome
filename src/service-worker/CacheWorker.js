/**
 * @fileoverview Service Worker Cache.
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

import { EventHandler } from '../utils/event/EventHandler';
import { EventType } from '../utils/event/EventType';

/**
 * Service Worker Cache class
 */
export class CacheWorker {
  /**
   * @constructor
   */
  constructor() {
    this.assetsCache = [];
    this.events = new EventHandler('Service Worker: Cache', '', this);
    this.registered = false;
    this.version = 'v1';

    this.checkForChangedAssets();
    setInterval(this.checkForChangedAssets.bind(this), 1000);
  }

  /**
   * Register relevant events.
   */
  register() {
    if (this.registered) {
      return;
    }
    this.events.listen(self, EventType.ACTIVATE, this.activate);
    this.events.listen(self, EventType.INSTALL, this.install);
    this.events.listen(self, EventType.FETCH, this.fetch);
    this.registered = true;
  }

  /**
   * Activated event.
   * @param {*} event
   */
  activate(event) {
    console.log('Activate request', event);
  }

  /**
   * Install event.
   * @param {*} event
   */
  install(event) {
    console.log('Install Cache Service Worker ...');
    event.waitUntil(
      caches.open(this.version).then(cache => {
        return cache.addAll(this.getAssets());
      })
    );
  }

  /**
   * Fetch event with offline first strategic.
   * @param {*} event
   */
  fetch(event) {
    if (event.request && event.request.url.startsWith('chrome-extension://')) {
      return;
    }
    console.log('Fetch request', event);
    event.respondWith(
      caches.open(this.version).then(function(cache) {
        return cache.match(event.request).then(function(response) {
          return (
            response ||
            fetch(event.request).then(function(response) {
              cache.put(event.request, response.clone());
              return response;
            })
          );
        });
      })
    );
  }

  /**
   * @return {Array}
   */
  getAssets() {
    return ['/', ...this.assetsCache];
  }

  /**
   *
   */
  checkForChangedAssets() {
    if (this.assetsCache !== serviceWorkerOption.assets) {
      this.assetsCache = serviceWorkerOption.assets;
      console.log('Update assets to', this.assetsCache);
    }
  }
}
