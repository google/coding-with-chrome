/**
 * @fileoverview Runner framework for safe cross communication.
 * Allows communication between the Coding with Chrome Editor <> Webview Object.
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

goog.provide('cwc.framework.Runner');

goog.require('goog.events');
goog.require('goog.events.BrowserEvent');



/**
 * @param {function=} opt_callback
 * @constructor
 * @struct
 * @final
 * @export
 */
cwc.framework.Runner = function(opt_callback) {
  /** @type {string} */
  this.name = 'Runner Framework';

  /** @type {Object} */
  this.appWindow = null;

  /** @type {string} */
  this.appOrigin = '';

  /** @type {Object} */
  this.commands = {};

  /** @type {?Function} */
  this.callback = opt_callback || null;

  /** @type {!boolean} */
  this.init_ = false;

  this.init();
};


/**
 * Adds the command to the listener.
 * @private
 */
cwc.framework.Runner.prototype.init = function() {
  if (!this.init_) {
    goog.events.listen(window, 'message', this.handleMessage_, false, this);
    this.addCommand('__handshake__', this.handleHandshake_.bind(this));
    this.addCommand('__start__', this.handleStart_.bind(this));
    this.addCommand('__ping__', this.handlePing_.bind(this));
    this.init_ = true;
  }
};


/**
 * Adds the command to the listener.
 * @param {string} name
 * @param {!function(?)} func
 * @param {?} opt_scope
 * @export
 */
cwc.framework.Runner.prototype.addCommand = function(name, func, opt_scope) {
  if (opt_scope) {
    this.commands[name] = func.bind(opt_scope);
  } else {
    this.commands[name] = func;
  }
};


/**
 * Sends the defined data to the runner.
 * @param {!string} name
 * @param {!string} value
 * @export
 */
cwc.framework.Runner.prototype.send = function(name, value) {
  if (!this.appWindow || !this.appOrigin) {
    console.error('Communication channel has not yet been opened');
    return;
  }
  this.appWindow.postMessage({'command': name, 'value': value}, this.appOrigin);
};


/**
 * Sets the callback function event.
 * @param {Function=} opt_callback
 * @export
 */
cwc.framework.Runner.prototype.setCallback = function(opt_callback) {
  if (goog.isFunction(opt_callback)) {
    this.callback = opt_callback;
  }
};


/**
 * Handles the received messages and executes the predefined actions.
 * @param {goog.events.BrowserEvent} event
 * @private
 */
cwc.framework.Runner.prototype.handleMessage_ = function(event) {
  var browserEvent = event.getBrowserEvent();
  if (!browserEvent) {
    throw 'Was not able to get browser event!';
  }
  if (!this.appWindow) {
    this.appWindow = browserEvent['source'];
  }
  if (!this.appOrigin) {
    this.appOrigin = browserEvent['origin'];
  }
  var command = browserEvent['data']['command'];
  var value = browserEvent['data']['value'];
  if (command in this.commands) {
    this.commands[command](value);
  } else {
    console.error('Command ' + command + ' is not defined yet');
  }
};


/**
 * Handles the received handshake message.
 * @param {!Object} data
 * @private
 */
cwc.framework.Runner.prototype.handleHandshake_ = function(data) {
  if (this.appWindow && this.appOrigin) {
    this.send('__handshake__', data);
  }
};


/**
 * Handles the received start message.
 * @private
 */
cwc.framework.Runner.prototype.handleStart_ = function() {
  console.log('Starting programm...');
  if (this.callback) {
    this.callback();
  }
};


/**
 * Handles the received "ping" command.
 * @param {!number} ping_id
 */
cwc.framework.Runner.prototype.handlePing_ = function(ping_id) {
  this.send('__pong__', {id: ping_id, time: new Date().getTime()});
};


/**
 * Sends the direct update confirmation to the runner..
 * @param {string=} opt_data
 * @export
 */
cwc.framework.Runner.prototype.enableDirectUpdate = function(opt_data) {
  console.log('Recieved request to enable direct update.');
  this.send('__direct_update__', opt_data);
};
