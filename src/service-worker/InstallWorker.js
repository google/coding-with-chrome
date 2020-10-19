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
 * @fileoverview Service Worker installer.
 */

/**
 * Install Worker class
 */
export class InstallWorker {
  /**
   * @constructor
   */
  constructor() {
    /** @type{Array} */
    this.assets = window ? window.APP_ASSETS : [] || [];
    console.log('Install Service Worker ...');
  }

  /**
   * Register Service Worker and Application Cache.
   */
  register() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js', { scope: './' })
        .then(
          function (registration) {
            console.log(
              'ServiceWorker registration successful with scope: ',
              registration.scope
            );
          },
          function (error) {
            console.error('ServiceWorker registration failed: ', error);
          }
        );
    }

    if ('caches' in window) {
      console.log('Adding assets to local browser cache...');
      caches.open('v1').then((cache) => {
        console.log(cache.matchAll(''));
        cache.addAll(this.assets).then(
          () => {
            console.log(
              'Added the following assets to the cache service:',
              this.assets
            );
          },
          () => {
            console.error(
              'Unable to add the following assets to the cache service:',
              this.assets
            );
          }
        );
      });
    }
  }
}
