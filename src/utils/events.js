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
goog.provide('cwc.utils.Events');
goog.provide('cwc.utils.EventData');

goog.require('cwc.utils.Logger');

goog.require('goog.events');


/**
 * @param {string=} name
 * @param {string=} prefix
 * @param {Object=} scope
 * @constructor
 * @final
 */
cwc.utils.Events = function(name = 'Events', prefix = '', scope = undefined) {
  /** @type {!string} */
  this.name = name || '';

  /** @type {!string} */
  this.prefix = prefix || '';


  this.scope = scope;

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
cwc.utils.Events.prototype.listen = function(src, type, listener,
    capture = false, scope = undefined) {
  let eventTarget = null;
  if (typeof src === 'string' || src instanceof String) {
    eventTarget = document.getElementById(this.prefix + src);
    if (!eventTarget) {
      this.log_.error('Unable to find element', this.prefix + src);
    }
  } else {
    eventTarget = src;
  }
  if (!eventTarget) {
    this.log_.error('Undefined event target!', eventTarget);
  }
  this.listener_.push(
    goog.events.listen(eventTarget, type, listener, capture,
      scope || this.scope)
  );
};


/**
 * Removes all defined event listeners in the provided list.
 */
cwc.utils.Events.prototype.clear = function() {
  this.log_.debug('Clearing', this.listener_.length, 'events listener');
  for (let i = 0, len = this.listener_.length; i < len; i++) {
    goog.events.unlistenByKey(this.listener_[i]);
  }
  this.listener_ = [];
};


/**
 * @param {!string} type
 * @param {Object|string|number=} data
 * @param {string|number=} source
 * @constructor
 * @final
 */
cwc.utils.EventData = function(type, data, source) {
  /** @type {!string} */
  this.type = type;

  /** @type {!Object|string|number} */
  this.data = data || {};

  /** @type {!string|number} */
  this.source = source || '';
};
