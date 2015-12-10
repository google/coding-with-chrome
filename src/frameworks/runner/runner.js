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
 * @constructor
 * @struct
 * @final
 * @export
 */
cwc.framework.Runner = function() {
  /** @type {string} */
  this.name = 'Runner Framework';

  /** @type {Object} */
  this.appWindow = null;

  /** @type {string} */
  this.appOrigin = '';

  /** @type {Object} */
  this.commands = {};

  /** @type {?Function} */
  this.callback = null;

  this.addSampleCommands();
};


/**
 * Adds the command to the listener.
 * @param {string} name
 * @param {!function(?)} func
 * @export
 */
cwc.framework.Runner.prototype.addCommand = function(name, func) {
  this.commands[name] = func;
};


/**
 * Adds sample commands like "ping".
 */
cwc.framework.Runner.prototype.addSampleCommands = function() {
  var pingEvent = function(opt_data) {
    console.log('Recieved ping, send pong …');
    this.sendData('pong', Math.random());
  };
  this.addCommand('ping', pingEvent.bind(this));
};


/**
 * Handles the received messages and executes the predefined actions.
 * @param {goog.events.BrowserEvent} event
 */
cwc.framework.Runner.prototype.handleMessage = function(event) {
  var browserEvent = event.getBrowserEvent();
  if (!browserEvent) {
    throw 'Was not able to get browser event!';
  }

  var command = browserEvent['data']['command'];
  var value = browserEvent['data']['value'];
  if (command == '__handshake__') {
    console.log('Received Handshake');
    this.appWindow = browserEvent['source'];
    this.appOrigin = browserEvent['origin'];
    if (this.appWindow && this.appOrigin) {
      this.sendData('__handshake__', 'ack');
    }
  } else if (command == '__start__') {
    if (goog.isFunction(this.callback)) {
      this.callback();
    }
  } else if (command in this.commands) {
    this.commands[command](value);
  } else {
    console.error('Command ' + command + ' is not defined yet');
  }
};


/**
 * Sends the defined data to the runner.
 * @param {Object} data
 * @export
 */
cwc.framework.Runner.prototype.send = function(data) {
  if (!this.appWindow || !this.appOrigin) {
    console.error('Communication channel has not yet been opened');
    return;
  }
  this.appWindow.postMessage(data, this.appOrigin);
};


/**
 * Sends the defined value under the defined name to the runner.
 * @param {!string} name
 * @param {!string} value
 * @export
 */
cwc.framework.Runner.prototype.sendData = function(name, value) {
  this.send({'command': name, 'value': value});
};


/**
 * Adds the event listener for the "message" event.
 * @param {Function=} opt_callback
 * @export
 */
cwc.framework.Runner.prototype.listen = function(opt_callback) {
  goog.events.listen(window, 'message', this.handleMessage, false, this);
  if (goog.isFunction(opt_callback)) {
    this.callback = opt_callback;
  }
};


goog.exportSymbol('cwc.framework.Runner', cwc.framework.Runner);
goog.exportSymbol('cwc.framework.Runner.prototype.listen',
    cwc.framework.Runner.prototype.listen);
goog.exportSymbol('cwc.framework.Runner.prototype.send',
    cwc.framework.Runner.prototype.send);
goog.exportSymbol('cwc.framework.Runner.prototype.addCommand',
    cwc.framework.Runner.prototype.addCommand);
