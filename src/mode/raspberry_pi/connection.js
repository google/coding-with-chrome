/**
 * @fileoverview Connection for the Raspberry Pi modification.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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
goog.provide('cwc.mode.raspberryPi.Connection');

goog.require('cwc.utils.Events');

goog.require('goog.Timer');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.raspberryPi.Connection = function(helper) {
  /** @type {string} */
  this.name = 'Raspberry Pi Connection';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.protocol.raspberryPi.Api} */
  this.api = helper.getInstance('raspberryPi', true);

  /** @type {!number} */
  this.connectMonitorInterval = 5000;

  /** @type {goog.Timer} */
  this.connectMonitor = new goog.Timer(this.connectMonitorInterval);

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);
};


/**
 * Connects the Raspberry Pi unit.
 * @export
 */
cwc.mode.raspberryPi.Connection.prototype.init = function() {
  this.events_.listen(this.connectMonitor, goog.Timer.TICK,
    this.connect.bind(this));
  this.connectMonitor.start();
  this.connect();
};


/**
 * Connects the Raspberry Pi.
 * @param {Event=} opt_event
 * @export
 */
cwc.mode.raspberryPi.Connection.prototype.connect = function(opt_event) {
  if (!this.isConnected()) {
    let serialInstance = this.helper.getInstance('serial', true);
    let device = serialInstance.getConnectedDevice();
    if (device) {
      this.api.connect(device);
    }
  }
};


/**
 * Stops the current executions.
 */
cwc.mode.raspberryPi.Connection.prototype.stop = function() {
  let runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.terminate();
  }
  this.reset();
};


/**
 * Resets the connection.
 * @param {Event=} opt_event
 * @export
 */
cwc.mode.raspberryPi.Connection.prototype.reset = function(opt_event) {
  if (this.isConnected()) {
    this.api.reset();
  }
};


/**
 * @return {!boolean}
 * @export
 */
cwc.mode.raspberryPi.Connection.prototype.isConnected = function() {
  return this.api.isConnected();
};


/**
 * @return {!cwc.protocol.raspberryPi.Api}
 * @export
 */
cwc.mode.raspberryPi.Connection.prototype.getApi = function() {
  return this.api;
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.mode.raspberryPi.Connection.prototype.getEventHandler = function() {
  return this.api.getEventHandler();
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.raspberryPi.Connection.prototype.cleanUp = function() {
  console.log('Clean up Raspberry Pi connection ...');
  if (this.connectMonitor) {
    this.connectMonitor.stop();
  }
  this.stop();
  this.events_.clear();
};
