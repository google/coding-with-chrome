/**
 * @fileoverview Event Listener.
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

import { EventListenerEntry } from './EventListenerEntry';

/**
 * Simplified Event Handler
 */
export class EventHandler {
  /**
   * @param {string=} name
   * @param {string=} prefix
   * @param {?Object=} scope
   */
  constructor(name = 'Events', prefix = '', scope = undefined) {
    /** @type {string} */
    this.name = name || '';

    /** @type {string} */
    this.prefix = prefix || '';

    /** @type {?Object|undefined} */
    this.scope = scope;

    /** @private {!Array} */
    this.listener_ = [];
  }

  /**
   * Adds an event listener for a specific event on a native event
   * target (such as a DOM element) or an object that has implemented.
   *
   * @param {!EventTarget|string} src
   * @param {string} type Event type or array of event types.
   * @param {function(?):?|{handleEvent:function(?):?}|null} listener
   * @param {boolean=} capture
   * @param {boolean} once Remove listener after first call.
   * @param {boolean} passive Disable preventDefault().
   * @return {number|null} Unique key
   */
  listen(src, type, listener, capture = false, once = false, passive = false) {
    const eventData = new EventListenerEntry(
      src,
      type,
      this.scope ? listener.bind(this.scope) : listener,
      {
        capture: capture,
        once: once,
        passive: passive
      },
      this.prefix
    );
    eventData.target.addEventListener(
      eventData.type,
      eventData.listener,
      eventData.options
    );
    return this.listener_.push(eventData) - 1;
  }

  /**
   * Adds an event listener only once for a specific event on a native event
   * target (such as a DOM element) or an object that has implemented.
   *
   * @param {!EventTarget|string} src
   * @param {string} type Event type or array of event types.
   * @param {function(?):?|{handleEvent:function(?):?}|null} listener
   * @param {boolean=} capture
   * @param {boolean} once Remove listener after first call.
   * @param {boolean} passive Disable preventDefault().
   * @return {number|null} Unique key
   */
  listenOnce(
    src,
    type,
    listener,
    capture = false,
    once = true,
    passive = false
  ) {
    return this.listen(src, type, listener, capture, once, passive);
  }

  /**
   * @param {number} listener_key Unique key
   */
  unlisten(listener_key) {
    const listenerData = this.listener_[listener_key];
    if (!listenerData) {
      throw new Error(`Unknown listener key: ${listener_key}!`);
    }
    const { target, type, listener, options } = listenerData;
    target.removeEventListener(type, listener, options);
    delete this.listener_[listener_key];
  }

  /**
   * @return {number}
   */
  getLength() {
    return this.listener_.length - 1;
  }
}
