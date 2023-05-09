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
 * @fileoverview Service Worker installer.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import {
  APP_BASE_PATH,
  ASSETS_SERVICE_WORKER_CACHE_NAME,
  CACHE_SERVICE_WORKER_CACHE_NAME,
  PREVIEW_SERVICE_WORKER_CACHE_NAME,
} from '../constants/';

/**
 * Service Worker class
 */
export class ServiceWorker {
  /**
   * @constructor
   */
  constructor() {
    this.prefix = '[Service Worker]';
    this.assets = globalThis.APP_ASSETS || [];
    this.scopePath = location.host.endsWith('.github.io')
      ? location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1)
      : './';
    this.registered = false;
    console.log(
      `${this.prefix} Installing Service Workers for ${APP_BASE_PATH} and scope ${this.scopePath}`
    );

    // Reload protection for cache service worker.
    const reloads = parseInt(window.name || 0);
    if (reloads > 3 && navigator.onLine) {
      console.warn('Reloading more than 3 times, clearing cache ...');
      caches.open(CACHE_SERVICE_WORKER_CACHE_NAME).then((cache) => {
        cache.keys().then(function (names) {
          for (const name of names) {
            cache.delete(name);
          }
        });
      });
    } else {
      window.name = reloads + 1;
    }
    window.setTimeout(() => {
      window.name = 0;
    }, 1000);
  }

  /**
   * Register Service Worker and Application Cache.
   */
  register() {
    if (this.registered) {
      console.warn(`${this.prefix} Service Workers are already registered !`);
      return;
    }
    if ('serviceWorker' in navigator) {
      /**
       * Register Cache Service Worker.
       */
      navigator.serviceWorker
        .register(APP_BASE_PATH + 'cache-service-worker.js', {
          scope: this.scopePath,
        })
        .then(
          (registration) => {
            console.log(
              `${this.prefix} Register Cache Service Worker successful with scope: ${registration.scope}`
            );
            window.setTimeout(() => {
              this.prepareCache();
            }, 20000);
          },
          (error) => {
            console.error(
              `${this.prefix} Cache Service Worker registration failed: `,
              error
            );
          }
        );

      /**
       * Register Assets and Preview Service Worker after onload event.
       */
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register(APP_BASE_PATH + 'assets-service-worker.js', {
            scope: this.scopePath + 'assets/',
          })
          .then(
            (registration) => {
              console.log(
                `${this.prefix} Register Assets Service Worker successful with scope: ${registration.scope}`
              );
              window.setTimeout(() => {
                this.prepareAssetsCache();
              }, 100);
            },
            (error) => {
              console.log(
                `${this.prefix}
              Assets Service Worker registration failed: `,
                error
              );
            }
          );

        navigator.serviceWorker
          .register(APP_BASE_PATH + 'preview-service-worker.js', {
            scope: this.scopePath + 'preview/',
          })
          .then(
            (registration) => {
              console.log(
                `${this.prefix} Register Preview Service Worker successful with scope: ${registration.scope}`
              );
              window.setTimeout(() => {
                this.preparePreviewCache();
              }, 100);
            },
            (error) => {
              console.log(
                `${this.prefix}
              Preview Service Worker registration failed: `,
                error
              );
            }
          );
      });
    } else {
      console.warn(`${this.prefix} Unable to setup Service Worker!`);
      return;
    }
    this.registered = true;
  }

  /**
   * Prepare local offline cache.
   */
  prepareCache() {
    if ('caches' in window) {
      if (this.assets) {
        console.log(
          `${this.prefix} Adding ${this.assets.length} assets to local browser cache...`
        );
        // Add base path to cache assets, if needed.
        if (APP_BASE_PATH !== '/') {
          console.log('Add base path to cache assets: ', APP_BASE_PATH);
          this.assets.push(APP_BASE_PATH);
        }

        // Add assets to cache.
        caches.open(CACHE_SERVICE_WORKER_CACHE_NAME).then((cache) => {
          for (const asset of this.assets) {
            cache.add(asset).then(
              () => {
                console.debug(`${this.prefix} Added asset: ${asset}`);
              },
              (error) => {
                console.error(
                  `${this.prefix} Unable to add asset: ${asset}`,
                  error
                );
              }
            );
          }
        });
      }
    } else {
      console.log(`${this.prefix} Unable to setup Cache Service cache!`);
    }
  }

  /**
   * Prepare local assets cache.
   */
  prepareAssetsCache() {
    console.log(`${this.prefix} Prepare local assets cache...`);
    caches.open(ASSETS_SERVICE_WORKER_CACHE_NAME).then((cache) => {
      console.log(`${this.prefix} Assets Cache is ready!`, cache);
    });
  }

  /**
   * Prepare local preview cache.
   */
  preparePreviewCache() {
    console.log(`${this.prefix} Prepare local preview cache...`);
    caches.open(PREVIEW_SERVICE_WORKER_CACHE_NAME).then((cache) => {
      console.log(`${this.prefix} Preview Cache is ready!`, cache);
    });
  }
}

// Register Service Workers for Cache and Preview.
new ServiceWorker().register();
