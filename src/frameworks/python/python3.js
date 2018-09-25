/**
 * @fileoverview Python 3.x framework for the messenger instance.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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
goog.provide('cwc.framework.Python3');


/**
 * @constructor
 * @struct
 * @final
 * @export
 */
cwc.framework.Python3 = function() {
  /** @type {string} */
  this.name = 'Python 3.x Framework';

  /** @type {boolean} */
  this.indexedDBSupport = window.indexedDB && window.location &&
    window.location.protocol !== 'data:';
};


/**
 * @export
 */
cwc.framework.Python3.prototype.run = function() {
  brython({
    'indexedDB': this.indexedDBSupport,
    'debug': false,
  });
};
