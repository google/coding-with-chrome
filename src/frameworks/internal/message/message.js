/**
 * @fileoverview Message framework for safe cross communication.
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
goog.provide('cwc.framework.Message');


/**
 * @constructor
 * @struct
 * @final
 * @export
 */
cwc.framework.Message = function() {
  /** @type {string} */
  this.name = 'Message Framework';

  /** @type {string} */
  this.appOrigin = '';

  /** @type {Object} */
  this.appWindow = null;

  // Message handler
  window.addEventListener('message', this.handleMessage_.bind(this), false);
};


/**
 * Handles the received messages and executes the predefined actions.
 * @param {Event} event
 * @private
 */
cwc.framework.Message.prototype.handleMessage_ = function(event) {
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
  this.handleCommand_(event['data']['command'], event['data']['value']);
};


/**
 * @param {!string} appOrigin
 * @export
 */
cwc.framework.Message.prototype.setAppOrigin = function(appOrigin) {
  if (appOrigin) {
    this.appOrigin = appOrigin;
  }
};


/**
 * @param {!Object} appWindow
 * @export
 */
cwc.framework.Message.prototype.setAppWindow = function(appWindow) {
  if (appWindow) {
    this.appWindow = appWindow;
  }
};


/**
 * @param {!string} code
 * @private
 */
cwc.framework.Message.prototype.executeCode_ = function(code) {
  if (!code) {
    return;
  }
  // Remove trailing ";"" to avoid syntax errors for one liner
  if (code.endsWith(';')) {
    code = code.slice(0, -1);
  }
  // Skip the return parameter for more complex code
  if (code.includes(';') || code.includes('{')) {
    console.log('>>' + Function(code)());
  } else {
    console.log('>>' + Function('return (' + code + ');')());
  }
};


/**
 * @param {!string} command
 * @param {string|Object} value
 * @private
 */
cwc.framework.Message.prototype.handleCommand_ = function(command, value) {
  if (!command) {
    return;
  }
  if (command === '__exec__' && value && typeof value === 'string') {
    this.executeCode_(value);
  }
};
