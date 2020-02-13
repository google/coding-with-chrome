/**
 * @fileoverview Event Listener Entry.
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

/**
 * Represents a single listener for a specific target.
 */
export class EventListenerEntry {
  /**
   * @param {!EventTarget|string} target
   * @param {string} type
   * @param {function} listener
   * @param {Object} options
   * @param {string} prefix
   */
  constructor(target, type, listener, options, prefix = '') {
    /**  @type {!EventTarget} */
    this.target = undefined;
    /** @type {string} */
    this.type = type;
    /** @type {function} */
    this.listener = listener;
    /** @type {Object} */
    this.options = options;
    if (typeof target === 'string' || target instanceof String) {
      this.target = document.getElementById(prefix + target);
      if (!this.target) {
        throw new Error(`Unable to find element ${prefix}${target}!`);
      }
    } else {
      this.target = target;
    }
    if (!this.target) {
      throw new Error(`Undefined event target: ${this.target}!`);
    }
    if (typeof listener !== 'function') {
      throw new Error(`Listener is not a function: ${listener}!`);
    }
  }
}
