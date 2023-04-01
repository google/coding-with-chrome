/**
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
 */

/**
 * @author mbordihn@google.com (Markus Bordihn)
 *
 * @fileoverview Service Worker Cache.
 */

import { EventHandler } from '../utils/event/EventHandler';
import { EventType } from '../utils/event/EventType';

/**
 * Service Worker Cache class
 */
export class CacheService {
  static cacheName = 'CacheV1';

  /**
   * @constructor
   */
  constructor() {
    this.events = new EventHandler('Service Worker: Cache', '', this);
    this.registered = false;
    this.denyList =
      /^(http|https):\/\/([^/]+)\/(upload|preview|framework)\/[^/]+\/?/;
    this.register();
  }

  /**
   * Register relevant events.
   */
  register() {
    if (this.registered) {
      return;
    }
    console.log(
      `Register Cache Service Worker with cache ${CacheService.cacheName} ...`
    );
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
   */
  install() {
    console.log('Install Cache Service Worker ...');
  }

  /**
   * Fetch event with offline first strategic.
   * @param {*} event
   */
  fetch(event) {
    if (
      event.request == null ||
      event.request.url.startsWith('chrome-extension://') ||
      event.request.url.startsWith('ws://') ||
      this.denyList.test(event.request.url)
    ) {
      return;
    }
    console.log('Cache fetch request', event);
    event.respondWith(
      caches.open(CacheService.cacheName).then(function (cache) {
        return cache.match(event.request).then(function (response) {
          return (
            response ||
            fetch(event.request).then(function (response) {
              cache.put(event.request, response.clone());
              return response;
            })
          );
        });
      })
    );
  }
}

// Initialize Service Worker
new CacheService();
