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
 * @fileoverview Cache Service Worker.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import { EventHandler } from '../utils/event/EventHandler';
import { EventType } from '../utils/event/EventType';
import { CACHE_SERVICE_WORKER_CACHE_NAME } from '../constants/';

/**
 * Service Worker Cache class
 */
export class CacheService {
  /**
   * @constructor
   */
  constructor() {
    this.prefix = '[Cache Service]';
    this.events = new EventHandler('Service Worker: Cache', '', this);
    this.registered = false;
    this.denyList = location.host.endsWith('.github.io')
      ? /^(http|https):\/\/([^/]+)\/([^/]+)\/(upload|preview)\/[^/]+\/?/
      : /^(http|https):\/\/([^/]+)\/(upload|preview)\/[^/]+\/?/;
  }

  /**
   * Register relevant events.
   */
  register() {
    if (this.registered) {
      console.warn(`${this.prefix} Service Worker is already registered !`);
      return;
    }
    console.log(`${this.prefix} Add event listener ...`);
    this.events.listen(self, EventType.ACTIVATE, this.activate);
    this.events.listen(self, EventType.INSTALL, this.install);
    this.events.listen(self, EventType.FETCH, this.fetch);
    this.registered = true;
    console.log(
      `${this.prefix} Registered Service Worker with cache ${CACHE_SERVICE_WORKER_CACHE_NAME} ...`
    );
  }

  /**
   * Activated event.
   * @param {*} event
   */
  activate(event) {
    console.log(`${this.prefix} Activate Service Worker ...`, event);
  }

  /**
   * Install event.
   */
  install() {
    console.log(`${this.prefix} Install Service Worker ...`);
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
      event.request.url.endsWith('.hot-update.json') ||
      event.request.url.endsWith('.hot-update.js') ||
      this.denyList.test(event.request.url)
    ) {
      return;
    }
    event.respondWith(
      caches.open(CACHE_SERVICE_WORKER_CACHE_NAME).then(function (cache) {
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
new CacheService().register();
