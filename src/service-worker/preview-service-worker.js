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
 * @fileoverview Preview Service Worker.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import { EventHandler } from '../utils/event/EventHandler';
import { EventType } from '../utils/event/EventType';
import {
  APP_BASE_PATH,
  PREVIEW_SERVICE_WORKER_CACHE_NAME,
} from '../constants/';

/**
 * Service Worker Preview class
 */
export class PreviewService {
  /**
   * @constructor
   */
  constructor() {
    this.prefix = '[Preview Service]';
    this.events = new EventHandler('Service Worker: Preview', '', this);
    this.registered = false;
    this.allowList = location.host.endsWith('.github.io')
      ? /^(http|https):\/\/([^/]+)\/([^/]+)\/preview\/[^/]+\/?/
      : /^(http|https):\/\/([^/]+)\/preview\/[^/]+\/?/;
    this.counter = 0;
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
      `${this.prefix} Registered Service Worker with cache ${PREVIEW_SERVICE_WORKER_CACHE_NAME} ...`
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
    if (event.request == null || !this.allowList.test(event.request.url)) {
      return;
    }
    if (event.request.method === 'POST') {
      event.respondWith(
        caches.open(PREVIEW_SERVICE_WORKER_CACHE_NAME).then((cache) => {
          return event.request.text().then((text) => {
            const response = new Response(text);
            cache.put(event.request, response.clone());
            return response;
          });
        })
      );
    } else if (event.request.method === 'GET') {
      // Status URLs for easier testing.
      if (event.request.url.endsWith(APP_BASE_PATH + 'healthz')) {
        event.respondWith(new Response('OK'));
        return;
      } else if (
        event.request.url.endsWith(APP_BASE_PATH + 'preview/test123')
      ) {
        event.respondWith(new Response('Hello World! ' + this.counter++));
        return;
      }
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

  /**
   * @param {String} filename
   * @param {String} content
   * @return {Promise}
   * @static
   */
  static async saveHTMLFile(filename, content) {
    return PreviewService.saveFile(
      filename,
      content,
      'text/html; charset=utf-8'
    );
  }

  /**
   * @param {String} path
   * @param {String} filename
   * @param {String} dataURL
   * @return {Promise}
   * @static
   */
  static async addAssetFile(path, filename, dataURL) {
    try {
      const assetsType = dataURL.split(':')[1].split(';')[0];
      fetch(dataURL)
        .then((response) => response.blob())
        .then((blob) => {
          PreviewService.saveFile(path + '/' + filename, blob, assetsType);
        });
    } catch (error) {
      console.error('Could not add asset: ', error);
    }
  }

  /**
   * @param {String} filename
   * @param {String} content
   * @param {String} contentType
   * @return {Promise}
   * @static
   */
  static async saveFile(
    filename,
    content,
    contentType = 'text/plain; charset=utf-8'
  ) {
    // Normalize filename to preview path.
    if (!filename.startsWith(APP_BASE_PATH + 'preview/')) {
      if (filename.startsWith(APP_BASE_PATH)) {
        filename =
          filename.slice(APP_BASE_PATH.length) +
          APP_BASE_PATH +
          'preview' +
          filename;
      } else {
        filename = APP_BASE_PATH + 'preview/' + filename;
      }
    }
    const cache = await caches.open(PREVIEW_SERVICE_WORKER_CACHE_NAME);
    const url = filename;
    const response = new Response(content, {
      headers: { 'Content-Type': contentType },
    });
    console.log('[Preview Service] Save preview file', url, response);
    await cache.put(url, response);
  }
}

// Initialize Service Worker
new PreviewService().register();
