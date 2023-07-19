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
 * @fileoverview Constants for the Coding with Chrome suite.
 * @author mbordihn@google.com (Markus Bordihn)
 */

export const APP_NAME = 'Coding with Chrome';
export const APP_BASE_PATH =
  location && location.host.endsWith('.github.io')
    ? location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1)
    : '/';
export const APP_ASSETS_BASE_PATH = APP_BASE_PATH + 'assets/';
export const APP_VERSION = VERSION || 'M.B.?';
export const PREVIEW_BASE_PATH = location
  ? location.origin + APP_BASE_PATH
  : APP_BASE_PATH;

export const ASSETS_SERVICE_WORKER_CACHE_NAME = 'Assets';
export const CACHE_SERVICE_WORKER_CACHE_NAME = 'Cache';
export const PREVIEW_SERVICE_WORKER_CACHE_NAME = 'PreviewCache';

export default {
  APP_ASSETS_BASE_PATH,
  APP_BASE_PATH,
  APP_NAME,
  APP_VERSION,
  CACHE_SERVICE_WORKER_CACHE_NAME,
  PREVIEW_SERVICE_WORKER_CACHE_NAME,
};
