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
 * @constructor
 * @struct
 * @final
 * @export
 */
cwc.framework.Runner = function() {
  /** @type {string} */
  this.name = 'Runner Framework';

  /** @type {string} */
  this.appOrigin = '';

  /** @type {Object} */
  this.appWindow = null;

  /** @type {Object} */
  this.commands = {'Runner Framework': null};

  /** @private {?Function} */
  this.callback_ = null;

  /** @private {Object} */
  this.scope_ = null;

  /** @private {?Function} */
  this.monitor_ = null;

  /** @private {!cwc.utils.StackQueue} */
  this.senderStack_ = new cwc.utils.StackQueue();

  // Message handler
  window.addEventListener('message', this.handleMessage_.bind(this), false);

  // External commands
  this.addCommand('__handshake__', this.handleHandshake_.bind(this));
  this.addCommand('__ping__', this.handlePing_.bind(this));
  this.addCommand('__start__', this.handleStart_.bind(this));
};


/**
 * Adds the command to the listener.
 * @param {!string} name
 * @param {!Function} func
 * @param {?=} scope
 * @export
 */
cwc.framework.Runner.prototype.addCommand = function(name, func,
    scope = this.scope_) {
  if (!name) {
    console.error('Runner command is undefined!');
    return;
  } else if (!func || typeof func !== 'function') {
    console.error('Runner function ' + name + ' is undefined!');
    return;
  }
  this.commands[name] = scope ? func.bind(scope) : func;
};


/**
 * Enables/disable monitoring depending on used code.
 * @param {!Function} code
 * @param {!string} command
 * @param {string=} monitorCommand
 * @return {!boolean}
 * @export
 */
cwc.framework.Runner.prototype.enableMonitor = function(code, command,
    monitorCommand) {
  let status = code.toString().includes(command);
  if (monitorCommand) {
    console.log((status ? 'Enable ' : 'Disable ') + monitorCommand + ' ...');
    this.send(monitorCommand, {'enable': status});
  }
  return status;
};


/**
 * Sends the defined data to the runner.
 * @param {!string} name
 * @param {Object|string=} value
 * @param {number=} delay in msec
 * @export
 */
cwc.framework.Runner.prototype.send = function(name, value = {}, delay = 0) {
  if (!name || !this.isReady_()) {
    throw Error('Unable so send data!');
  }
  let sendCommand = function() {
    this.appWindow.postMessage({
      'command': name,
      'value': value,
    }, this.appOrigin);
  }.bind(this);
  if (delay) {
    this.senderStack_.addCommand(sendCommand);
    this.senderStack_.addDelay(delay);
  } else {
    sendCommand();
  }
};


/**
 * Sets the callback function event.
 * @param {!Function} callback
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.framework.Runner.prototype.setCallback = function(callback) {
  if (callback && typeof callback === 'function') {
    this.callback_ = this.scope_ ? callback.bind(this.scope_) : callback;
  }
  return this;
};


/**
 * Sets the runner scope.
 * @param {!Function} scope
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.framework.Runner.prototype.setScope = function(scope) {
  if (this.callback_ || this.monitor_) {
    throw new Error('Scope should be set before callback/monitor!');
  }
  if (scope && typeof scope !== 'function' && typeof scope !== 'object') {
    throw new Error('Invalid runner scope!', scope);
  } else if (scope) {
    this.scope_ = scope;
  }
  return this;
};


/**
 * Sets the monitor function event.
 * @param {!Function} monitor
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.framework.Runner.prototype.setMonitor = function(monitor) {
  if (monitor && typeof monitor === 'function') {
    this.monitor_ = this.scope_ ? monitor.bind(this.scope_) : monitor;
  }
  return this;
};


/**
 * @param {!string} appOrigin
 */
cwc.framework.Runner.prototype.setAppOrigin = function(appOrigin) {
  if (appOrigin) {
    this.appOrigin = appOrigin;
  }
};


/**
 * @param {!Object} appWindow
 */
cwc.framework.Runner.prototype.setAppWindow = function(appWindow) {
  if (appWindow) {
    this.appWindow = appWindow;
  }
};


/**
 * Handles the received messages and executes the predefined actions.
 * @param {Event} event
 * @private
 */
cwc.framework.Runner.prototype.handleMessage_ = function(event) {
  if (!event) {
    throw new Error('Was not able to get browser event!');
  }
  if (!(event['data']['command'] in this.commands)) {
    throw new Error('Command ' + event['data']['command'] + ' is not defined!');
  }
  if (!this.appWindow && 'source' in event) {
    this.setAppWindow(event['source']);
  }
  if (!this.appOrigin && 'origin' in event) {
    this.setAppOrigin(event['origin']);
  }
  this.commands[event['data']['command']](event['data']['value']);
};


/**
 * Handles the received handshake message.
 * @param {!Object} data
 * @private
 */
cwc.framework.Runner.prototype.handleHandshake_ = function(data) {
  if (this.isReady_()) {
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
    this.callback_(this.scope_);
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
 * @return {boolean}
 * @private
 */
cwc.framework.Runner.prototype.isReady_ = function() {
  if (!this.appWindow || !this.appOrigin) {
    console.error('Communication channel has not yet been opened');
    return false;
  }
  return true;
};
