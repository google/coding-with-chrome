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

import { CacheService } from './cache-service-worker';
import { PreviewService } from './preview-service-worker';

/**
 * Install Worker class
 */
export class InstallWorker {
  /**
   * @constructor
   */
  constructor() {
    /** @type{Array} */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.assets = globalThis.APP_ASSETS || [];
    this.basePath = location.host.endsWith('.github.io')
      ? location.pathname
      : '/';
    this.scopePath = location.host.endsWith('.github.io')
      ? location.pathname
      : './';
    console.log('Install Service Worker ...');
  }

  /**
   * Register Service Worker and Application Cache.
   */
  register() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register(this.basePath + 'cache-service-worker.js', {
          scope: this.scopePath,
        })
        .then(
          function (registration) {
            console.log(
              'Register Cache Service Worker successful with scope: ',
              registration.scope
            );
          },
          function (error) {
            console.error('Cache Service Worker registration failed: ', error);
          }
        );
      navigator.serviceWorker
        .register(this.basePath + 'preview-service-worker.js', {
          scope: this.scopePath + 'preview/',
        })
        .then(
          function (registration) {
            console.log(
              'Register Preview Service Worker successful with scope: ',
              registration.scope
            );
          },
          function (error) {
            console.error(
              'Preview Service Worker registration failed: ',
              error
            );
          }
        );
    } else {
      console.warn('Unable to setup Service Worker!');
      return;
    }

    if ('caches' in window) {
      if (this.assets) {
        console.log(
          `Adding ${this.assets.length} assets to local browser cache...`
        );
        // Add base path to cache assets, if needed.
        if (this.basePath !== '/') {
          console.log('Add base path to cache assets: ', this.basePath);
          this.assets.push(this.basePath);
        }

        // Add assets to cache.
        caches.open(CacheService.cacheName).then((cache) => {
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
    } else {
      console.warn('Unable to setup Cache Service cache!');
    }

    console.log('Prepare local preview cache...');
    caches.open(PreviewService.cacheName).then((cache) => {
      console.log('Preview Cache is ready!', cache);
    });
  }
}
