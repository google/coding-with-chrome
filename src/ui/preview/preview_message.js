/**
 * @fileoverview Preview Message for the Coding with Chrome editor.
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
goog.provide('cwc.ui.PreviewMessage');

goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');


/**
 * @constructor
 * @struct
 * @final
 */
cwc.ui.PreviewMessage = function() {
  /** @type {string} */
  this.name = 'Preview Message Handler';

  /** @type {string} */
  this.appOrigin = '';

  /** @type {Object} */
  this.appWindow = null;

  /** @type {Object} */
  this.target = null;

  /** @type {!string} */
  this.targetOrigin = '*';

  /** @type {!string} */
  this.token = String(new Date().getTime());

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, '', this);

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {Object} */
  this.listener_ = {};

  /** @private {Object} */
  this.listenerScope_ = this;

  /** @type {!string} */
  this.token_ = String(new Date().getTime());

  /** @private {!number} */
  this.pingTime_ = 0;

  // External listener
  this.addListener('__handshake__', this.handleHandshake_);
  this.addListener('__pong__', this.handlePong_);
};


/**
 * Adds the command to the listener.
 * @param {!string} name
 * @param {!Function} func
 * @param {?=} scope
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.ui.PreviewMessage.prototype.addListener = function(name, func,
    scope = this.listenerScope_) {
  if (!name) {
    this.log_.error('Listener name is undefined!');
    return;
  } else if (!func || typeof func !== 'function') {
    this.log_.error('Listener function ' + name + ' is undefined!');
    return;
  } else if (typeof this.listener_[name] !== 'undefined') {
    this.log_.error('Listener ' + name + ' is already defined!');
    return;
  }
  this.listener_[name] = scope ? func.bind(scope) : func;
  this.log_.info('Added message listener ' + name);
  return this;
};


/**
 * @param {string!} command
 * @param {Object|number|string|Array=} value
 */
cwc.ui.PreviewMessage.prototype.send = function(command, value = {}) {
  if (!this.target || !this.target.contentWindow) {
    return;
  }
  this.target.contentWindow.postMessage({
    'command': command,
    'value': value,
  }, this.targetOrigin);
};


/**
 * @param {!string} appOrigin
 * @export
 */
cwc.ui.PreviewMessage.prototype.setAppOrigin = function(appOrigin) {
  if (appOrigin) {
    this.appOrigin = appOrigin;
  }
};


/**
 * @param {!Object} appWindow
 * @export
 */
cwc.ui.PreviewMessage.prototype.setAppWindow = function(appWindow) {
  if (appWindow) {
    this.appWindow = appWindow;
  }
};


/**
 * @param {Object} target
 */
cwc.ui.PreviewMessage.prototype.setTarget = function(target) {
  if (!target) {
    this.log_.error('Was not able to init target', target);
    return;
  }
  this.target = target;
  window.addEventListener('message', this.handleMessage_.bind(this), false);
  this.target.addEventListener('contentload',
      this.handleContentLoad_.bind(this), false);
};


/**
 * Sets the runner scope.
 * @param {!Function} scope
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.ui.PreviewMessage.prototype.setListenerScope = function(scope) {
  if (scope && typeof scope !== 'function' && typeof scope !== 'object') {
    throw new Error('Invalid scope!', scope);
  } else if (scope) {
    this.listenerScope_ = scope;
  }
  return this;
};


/**
 * @private
 */
cwc.ui.PreviewMessage.prototype.handleContentLoad_ = function() {
  this.log_.info('Sending handshake with token', this.token);
  this.send('__handshake__', this.token);
};


/**
 * Handles the received messages and executes the predefined actions.
 * @param {Event} event
 * @private
 */
cwc.ui.PreviewMessage.prototype.handleMessage_ = function(event) {
  if (!event) {
    throw new Error('Was not able to get browser event!');
  }
  if (!this.appWindow && 'source' in event) {
    this.setAppWindow(event['source']);
  } else if (this.appWindow !== event['source']) {
    return;
  }
  if (!this.appOrigin && 'origin' in event) {
    this.setAppOrigin(event['origin']);
  } else if (this.appOrigin !== event['origin']) {
    return;
  }
  if (typeof this.listener_[event['data']['command']] === 'undefined') {
    throw new Error('Command ' + event['data']['command'] + ' is not defined!');
  }
  this.listener_[event['data']['command']](event['data']['value']);
};


/**
 * @param {!string} token
 * @private
 */
cwc.ui.PreviewMessage.prototype.handleHandshake_ = function(token) {
  if (!token || this.token !== token) {
    this.log_.error('Received wrong handshake token:', token);
    return;
  }
  this.log_.info('Received handshake with token:', token);
  this.pingTime_ = new Date().getTime();
  this.send('__ping__');
};


/**
 * @param {!number} data
 * @private
 */
cwc.ui.PreviewMessage.prototype.handlePong_ = function(data) {
  let sendTime = data - this.pingTime_;
  let responseTime = new Date().getTime() - data;
  let delay = new Date().getTime() - this.pingTime_;
  this.log_.info('PONG send=', sendTime + 'ms',
      'response=', responseTime + 'ms', 'delay=', delay + 'ms');
};
