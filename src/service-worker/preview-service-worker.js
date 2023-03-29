/**
 * @license Copyright 2023 The Coding with Chrome Authors.
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
 * @fileoverview Service Worker Preview.
 */

import { EventHandler } from '../utils/event/EventHandler';
import { EventType } from '../utils/event/EventType';

/**
 * Service Worker Preview class
 */
export class PreviewWorker {
  /**
   * @constructor
   */
  constructor() {
    this.events = new EventHandler('Service Worker: Preview', '', this);
    this.registered = false;
    this.cacheName = 'PreviewV1';
    this.register();
  }

  /**
   * Register relevant events.
   */
  register() {
    if (this.registered) {
      return;
    }
    console.log('Register Preview Service Worker ...');
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
    console.log('Install Preview Service Worker ...');
  }

  /**
   * Fetch event with offline first strategic.
   * @param {*} event
   */
  fetch(event) {
    if (
      event.request &&
      (event.request.url.startsWith('chrome-extension://') ||
        !event.request.url.includes('/preview'))
    ) {
      return;
    }
    console.log('Preview fetch request', event);
    if (event.request.method === 'POST') {
      event.respondWith(
        caches.open(this.cacheName).then((cache) => {
          return event.request.text().then((text) => {
            const response = new Response(text);
            cache.put(event.request, response.clone());
            return response;
          });
        })
      );
    } else if (event.request.method === 'GET') {
      event.respondWith(
        caches.match(event.request).then((response) => {
          if (response) {
            return response;
          } else {
            return new Response('Not found');
          }
        })
      );
    }
  }
}

// Initialize Service Worker
new PreviewWorker();
