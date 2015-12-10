/**
 * @fileoverview Runner for the Coding with Chrome editor.
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
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
goog.provide('cwc.runner.Connector');

goog.require('goog.events');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventType');



/**
 * @constructor
 * @struct
 * @final
 */
cwc.runner.Connector = function() {
  /** @type {!string} */
  this.name = 'Runner';

  /** @type {!Object} */
  this.commands = {};

  /** @type {Object} */
  this.target = null;

  /** @type {!boolean} */
  this.target = false;

  /** @type {!string} */
  this.targetOrigin = '*';

  /** @type {!Array} */
  this.listener = [];
};


/**
 * Inits the runner instance.
 * @param {Object} content
 */
cwc.runner.Connector.prototype.init = function() {
  this.addEventListener_(window, 'message', this.handleMessage_, false, this);
};


/**
 * Inits the runner instance.
 * @param {Object} content
 */
cwc.runner.Connector.prototype.setTarget = function(target) {
  if (!target) {
    console.error('Was not able to init runner with', target);
    return;
  }
  this.targetLoaded = false;
  this.target = target;
  this.target.addEventListener('contentload',
      this.handleContentLoad_.bind(this), false);
};


/**
 * @param {string!} command
 * @param {object|number|string|array=} opt_value
 */
cwc.runner.Connector.prototype.send = function(command, opt_value) {
  if (!this.target || !this.target.contentWindow || !this.targetLoaded) {
    return;
  }

  this.target.contentWindow.postMessage({
    'command': command, 'value': opt_value },
    this.targetOrigin);
};


/**
 * @param {string} name
 * @param {function(?)} func
 * @param {?} opt_scope
 * @export
 */
cwc.runner.Connector.prototype.addCommand = function(name, func, opt_scope) {
  if (opt_scope) {
    this.commands[name] = func.bind(opt_scope);
  } else {
    this.commands[name] = func;
  }
};


/**
 * @param {!string} name
 * @param {?} value
 * @param {boolean=} opt_ignore_unknown
 * @export
 */
cwc.runner.Connector.prototype.executeCommand = function(name, value,
    opt_ignore_unknown) {
  if (name in this.commands) {
    this.commands[name](value);
  } else if (!opt_ignore_unknown) {
    console.log('Received unknow command', name, 'with value', value);
  }
};


/**
 * @param {goog.events.BrowserEvent=} opt_event
 * @private
 */
cwc.runner.Connector.prototype.handleContentLoad_ = function(opt_event) {
  this.targetLoaded = true;
};


/**
 * @param {goog.events.BrowserEvent} event
 * @private
 */
cwc.runner.Connector.prototype.handleMessage_ = function(event) {
  var browserEvent = event.getBrowserEvent();
  if (!browserEvent) {
    console.error('Was not able to get browser event!');
    return;
  }

  this.executeCommand(browserEvent['data']['command'],
      browserEvent['data']['value']);
};


/**
 * Adds an event listener for a specific event on a native event
 * target (such as a DOM element) or an object that has implemented
 * {@link goog.events.Listenable}.
 *
 * @param {EventTarget|goog.events.Listenable} src
 * @param {string} type
 * @param {function()} listener
 * @param {boolean=} opt_useCapture
 * @param {Object=} opt_listenerScope
 * @private
 */
cwc.runner.Connector.prototype.addEventListener_ = function(src, type,
    listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};


/**
 * Clears all object based events.
 */
cwc.runner.Connector.prototype.cleanUp = function() {
  this.listener = this.helper.removeEventListeners(this.listener);
};
