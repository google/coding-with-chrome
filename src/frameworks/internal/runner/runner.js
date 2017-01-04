/**
 * @fileoverview Runner framework for safe cross communication.
 * Allows communication between the Coding with Chrome Editor <> Webview Object.
 *
 * @license Copyright 2015 The Coding with Chrome Authors.
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

goog.require('cwc.utils.StackQueue');



/**
 * @param {Function=} opt_callback
 * @param {Object=} opt_scope
 * @param {Function=} opt_monitor
 * @constructor
 * @struct
 * @final
 * @export
 */
cwc.framework.Runner = function(opt_callback, opt_scope, opt_monitor) {
  /** @type {string} */
  this.name = 'Runner Framework';

  /** @type {Object} */
  this.appWindow = null;

  /** @type {string} */
  this.appOrigin = '';

  /** @type {Object} */
  this.commands = {};

  /** @type {Object} */
  this.scope = opt_scope || null;

  /** @private {?Function} */
  this.callback_ = opt_callback || null;

  /** @private {?Function} */
  this.monitor_ = opt_monitor || null;

  /** @private {!cwc.utils.StackQueue} */
  this.senderStack_ = new cwc.utils.StackQueue();

  // Message handler
  window.addEventListener('message', this.handleMessage_.bind(this), false);

  // External commands
  this.addCommand('__handshake__', this.handleHandshake_.bind(this));
  this.addCommand('__start__', this.handleStart_.bind(this));
  this.addCommand('__ping__', this.handlePing_.bind(this));
};


/**
 * Adds the command to the listener.
 * @param {string} name
 * @param {!Function} func
 * @param {?=} opt_scope
 * @export
 */
cwc.framework.Runner.prototype.addCommand = function(name, func, opt_scope) {
  if (!name) {
    console.error('Runner command is undefined!');
    return;
  } else if (!func) {
    console.error('Runner function ' + name + ' is undefined!');
    return;
  }
  if (opt_scope || this.scope) {
    this.commands[name] = func.bind(opt_scope || this.scope);
  } else {
    this.commands[name] = func;
  }
};


/**
 * @param {!string} code
 * @param {!string} command
 * @param {!string} monitor_command
 * @export
 */
cwc.framework.Runner.prototype.enableMonitor = function(code, command,
  monitor_command) {
  var status = code.includes(command);
  console.log((status ? 'Enable ' : 'Disable ') + monitor_command + ' ...');
  this.send(monitor_command, {'enable': status});
};


/**
 * Sends the defined data to the runner.
 * @param {!string} name
 * @param {Object|string=} opt_value
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Runner.prototype.send = function(name, opt_value, opt_delay) {
  if (!this.appWindow || !this.appOrigin) {
    console.error('Communication channel has not yet been opened');
    return;
  }
  var value = opt_value || {};
  if (opt_delay) {
    var stackCall = function() {
      this.appWindow.postMessage({'command': name, 'value': value},
        this.appOrigin);
    }.bind(this);
    this.senderStack_.addCommand(stackCall);
    this.senderStack_.addDelay(opt_delay);
  } else {
    this.appWindow.postMessage({'command': name, 'value': value},
      this.appOrigin);
  }
};


/**
 * Sets the callback function event.
 * @param {!Function} callback
 * @export
 */
cwc.framework.Runner.prototype.setCallback = function(callback) {
  if (callback && typeof callback === 'function') {
    this.callback_ = callback;
  }
};


/**
 * Sets the monitor function event.
 * @param {!Function} monitor
 * @export
 */
cwc.framework.Runner.prototype.setMonitor = function(monitor) {
  if (monitor && typeof monitor === 'function') {
    this.monitor_ = monitor;
  }
};


/**
 * Sends the direct update confirmation to the runner..
 * @param {string=} opt_data
 * @export
 */
cwc.framework.Runner.prototype.enableDirectUpdate = function(opt_data) {
  console.log('Enable direct update.');
  this.send('__direct_update__', opt_data);
};


/**
 * Handles the received messages and executes the predefined actions.
 * @param {Event} event
 * @private
 */
cwc.framework.Runner.prototype.handleMessage_ = function(event) {
  if (!event) {
    throw 'Was not able to get browser event!';
  }
  if (!this.appWindow && 'source' in event) {
    this.appWindow = event['source'];
  }
  if (!this.appOrigin && 'origin' in event) {
    this.appOrigin = event['origin'];
  }
  var command = event['data']['command'];
  var value = event['data']['value'];
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
  if (this.monitor_) {
    console.log('Initialize monitor ...');
    this.monitor_();
  }
  if (this.callback_) {
    console.log('Starting program ...');
    this.callback_();
  }
};


/**
 * Handles the received "ping" command.
 * @param {!number} ping_id
 */
cwc.framework.Runner.prototype.handlePing_ = function(ping_id) {
  this.send('__pong__', {id: ping_id, time: new Date().getTime()});
};
