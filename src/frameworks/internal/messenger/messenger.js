/**
 * @fileoverview Messenger framework for safe cross communication.
 * Allows communication between the Coding with Chrome Editor and Webview or
 * Iframe Object over postMessage.
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
goog.provide('cwc.framework.Messenger');

goog.require('cwc.utils.StackQueue');


/**
 * @param {boolean=} liteMode
 * @constructor
 * @struct
 * @final
 * @export
 */
cwc.framework.Messenger = function(liteMode = false) {
  /** @type {string} */
  this.name = 'Message Framework';

  /** @type {string} */
  this.appOrigin = '';

  /** @type {Object} */
  this.appWindow = null;

  /** @type {boolean} */
  this.liteMode = liteMode;

  /** @private {boolean} */
  this.ready_ = false;

  /** @private {Object} */
  this.listener_ = {};

  /** @private {Object} */
  this.listenerScope_ = this;

  /** @private {!cwc.utils.StackQueue} */
  this.senderStack_ = new cwc.utils.StackQueue();

  // Message handler
  window.addEventListener('message', this.handleMessage_.bind(this), false);

  // External listener
  this.addListener('__exec__', this.executeCode_);
  this.addListener('__handshake__', this.handleHandshake_);

  if (this.liteMode) {
    console.log('Adding cwc messenger lite ...');
  } else {
    this.addListener('__gamepad__', this.handleGamepad_);
    this.addListener('__start__', this.handleStart_);
  }

  this.senderStack_.addDelay(50);
};


/**
 * Adds the named listener.
 * @param {string} name
 * @param {!Function} func
 * @param {?=} scope
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.framework.Messenger.prototype.addListener = function(name, func,
    scope = this.listenerScope_) {
  if (!name) {
    console.error('Listener name is undefined!');
    return;
  } else if (!func || typeof func !== 'function') {
    console.error('Listener function ' + name + ' is undefined!');
    return;
  } else if (typeof this.listener_[name] !== 'undefined') {
    console.error('Listener ' + name + ' is already defined!');
    return;
  }
  this.listener_[name] = scope ? func.bind(scope) : func;
  if (!this.liteMode) {
    console.log('Added message listener ' + name);
  }
  return this;
};


/**
 * @param {string} appOrigin
 * @export
 */
cwc.framework.Messenger.prototype.setAppOrigin = function(appOrigin) {
  if (appOrigin) {
    this.appOrigin = appOrigin;
  }
};


/**
 * @param {!Object} appWindow
 * @export
 */
cwc.framework.Messenger.prototype.setAppWindow = function(appWindow) {
  if (appWindow) {
    this.appWindow = appWindow;
  }
};


/**
 * Sets the listener scope.
 * @param {!Function} scope
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.framework.Messenger.prototype.setListenerScope = function(scope) {
  if (scope && typeof scope !== 'function' && typeof scope !== 'object') {
    throw new Error('Invalid scope!', scope);
  } else if (scope) {
    this.listenerScope_ = scope;
  }
  return this;
};


/**
 * Sends the defined data to the target window.
 * @param {string} name
 * @param {Object|string=} value
 * @param {number=} delay in msec
 * @export
 */
cwc.framework.Messenger.prototype.send = function(name, value = {}, delay = 0) {
  if (!name) {
    throw Error('Unable so send data!');
  }
  let sendCommand = function() {
    this.postMessage(name, value);
  }.bind(this);
  if (!this.ready_ && !delay && name !== '__handshake__') {
    this.senderStack_.addCommand(sendCommand);
  } else if (delay) {
    this.senderStack_.addCommand(sendCommand);
    this.senderStack_.addDelay(delay);
  } else {
    sendCommand();
  }
};


/**
 * @param {string} name
 * @param {Object|string=} value
 */
cwc.framework.Messenger.prototype.postMessage = function(name, value) {
  if (!this.appWindow) {
    console.error('App window is not ready, for ' + name);
    return;
  }
  this.appWindow.postMessage({
    'name': name,
    'value': value,
  }, this.appOrigin);
};


/**
 * @param {string} code
 * @private
 */
cwc.framework.Messenger.prototype.executeCode_ = function(code) {
  if (!code || typeof code !== 'string') {
    return;
  }
  // Remove trailing ";"" to avoid syntax errors for simple one liner
  if (code.endsWith(';')) {
    code = code.slice(0, -1);
  }
  // Skip the return parameter for more complex code
  if ((code.includes(';') && !code.includes('let')) || code.includes('{')) {
    console.log('>>' + Function(code)());
  } else {
    console.log('>>' + Function('return (' + code + ');')());
  }
};


/**
 * Handles the received messages and executes the predefined actions.
 * @param {Event} event
 * @private
 */
cwc.framework.Messenger.prototype.handleMessage_ = function(event) {
  if (!event) {
    throw new Error('Was not able to get browser event!');
  }

  // Setting appWindow and appOrigin within the handshake
  if (!this.appWindow && 'source' in event &&
      event['data']['name'] === '__handshake__') {
    this.setAppWindow(event['source']);
  } else if (this.appWindow !== event['source']) {
    return;
  }
  if (!this.appOrigin && 'origin' in event &&
      event['data']['name'] === '__handshake__') {
    this.setAppOrigin(event['origin']);
  } else if (this.appOrigin !== event['origin']) {
    return;
  }
  if (typeof this.listener_[event['data']['name']] === 'undefined') {
    throw new Error('Name ' + event['data']['name'] + ' is not defined!');
  }
  this.listener_[event['data']['name']](event['data']['value']);
};


/**
 * @param {!Object} data
 * @private
 */
cwc.framework.Messenger.prototype.handleHandshake_ = function(data) {
  console.log('Received handshake for token ' + data['token']);
  this.send('__handshake__', {
    'token': data['token'],
    'start_time': data['start_time'],
    'ping_time': new Date().getTime(),
  });
  this.ready_ = this.appWindow && this.appOrigin;
};


/**
 * @param {!Object} data
 * @private
 */
cwc.framework.Messenger.prototype.handleGamepad_ = function(data) {
  console.log('__gamepad__', data);
};


/**
 * Handles the received start message.
 * @private
 */
cwc.framework.Messenger.prototype.handleStart_ = function() {
  if (this.monitor_) {
    console.log('Initialize monitor ...');
    this.monitor_();
  }
  if (this.callback_) {
    console.log('Starting program ...');
    this.callback_(this.scope_);
  }
};
