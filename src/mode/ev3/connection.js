/**
 * @fileoverview Connection for the EV3 modification.
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
goog.provide('cwc.mode.ev3.Connection');

goog.require('cwc.protocol.ev3.Api');

goog.require('goog.Timer');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.ev3.Connection = function(helper) {
  /** @type {string} */
  this.name = 'EV3 Connection';

  /** @type {string} */
  this.autoConnectName = 'EV3';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.protocol.ev3.Api} */
  this.api = helper.getInstance('ev3', true);

  /** @type {goog.Timer} */
  this.connectMonitor = null;

  /** @type {!number} */
  this.connectMonitorInterval = 5000;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);
};


/**
 * Connects the EV3 unit.
 */
cwc.mode.ev3.Connection.prototype.init = function() {
  if (!this.connectMonitor) {
    this.connectMonitor = new goog.Timer(this.connectMonitorInterval);
    this.events_.listen(this.connectMonitor, goog.Timer.TICK,
        this.connect.bind(this));
  }
  this.connectMonitor.start();
  this.connect();
};


/**
 * Connects the EV3 unit.
 */
cwc.mode.ev3.Connection.prototype.connect = function() {
  if (!this.isConnected()) {
    let bluetoothInstance = this.helper.getInstance('bluetooth', true);
    bluetoothInstance.autoConnectDevice(this.autoConnectName, function(device) {
      if (device) {
        this.api.connect(device);
      }
    }.bind(this));
  }
  this.api.monitor(true);
};


/**
 * Connects the EV3 unit.
 */
cwc.mode.ev3.Connection.prototype.disconnect = function() {
  console.log('Disconnect the EV3 unit...');
  this.api.disconnect();
};


/**
 * @return {!boolean}
 */
cwc.mode.ev3.Connection.prototype.isConnected = function() {
  return this.api.isConnected();
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.mode.ev3.Connection.prototype.getEventHandler = function() {
  return this.api.getEventHandler();
};


/**
 * @return {Object}
 */
cwc.mode.ev3.Connection.prototype.getDeviceData = function() {
  return this.api.getDeviceData();
};


cwc.mode.ev3.Connection.prototype.getDevices = function() {
  this.api.getDevices();
};


/**
 * @return {!cwc.protocol.ev3.Api}
 * @export
 */
cwc.mode.ev3.Connection.prototype.getApi = function() {
  return this.api;
};


/**
 * Stops the EV3 unit.
 */
cwc.mode.ev3.Connection.prototype.stop = function() {
  let runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.terminate();
  }
  this.api.stop();
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.ev3.Connection.prototype.cleanUp = function() {
  console.log('Clean up EV3 connection ...');
  if (this.connectMonitor) {
    this.connectMonitor.stop();
  }
  this.api.monitor(false);
  this.stop();
  this.events_.clear();
};
