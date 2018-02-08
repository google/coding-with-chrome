/**
 * @fileoverview Listener helper.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
goog.provide('cwc.utils.Listener');

goog.require('goog.events');


/**
 * @param {string=} name
 * @param {number=} logLevel
 * @constructor
 * @final
 */
cwc.utils.Listener = function(name = 'Listener') {
  /** @type {!string} */
  this.name = name;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {!Array} */
  this.listener_ = [];
};


/**
 * Adds an event listener for a specific event on a native event
 * target (such as a DOM element) or an object that has implemented
 * {@link goog.events.Listenable}.
 *
 * @param {EventTarget|goog.events.Listenable|string} src
 * @param {string} type
 * @param {function(?)} listener
 * @param {boolean=} capture
 * @param {Object=} scope
 */
cwc.utils.Listener.prototype.add = function(src, type,
    listener, capture = false, scope = undefined) {
  let eventTarget = src;
  if (typeof src === 'string' || src instanceof String) {
    eventTarget = document.getElementById(src);
  }
  this.listener_.push(
    goog.events.listen(eventTarget, type, listener, capture, scope)
  );
};


/**
 * Removes all defined event listeners in the provided list.
 */
cwc.utils.Listener.prototype.clear = function() {
  this.log_.debug('Clearing', this.listener_.length, 'events listener');
  this.listener_.forEach(function(listener) {
    goog.events.unlistenByKey(listener);
  });
};
