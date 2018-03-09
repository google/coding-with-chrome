/**
 * @fileoverview Connection for the Sphero SPRK+ modification.
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
goog.provide('cwc.mode.sphero.sprkPlus.Connection');

goog.require('cwc.protocol.bluetooth.lowEnergy.supportedDevices');
goog.require('cwc.protocol.sphero.v1.Api');
goog.require('cwc.utils.Events');

goog.require('goog.Timer');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.sphero.sprkPlus.Connection = function(helper) {
  /** @type {string} */
  this.name = 'Sphero SPRK+ Connection';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {goog.Timer} */
  this.connectMonitor = null;

  /** @type {!number} */
  this.connectMonitorInterval = 5000;

  /** @private {!cwc.protocol.sphero.v1.Api} */
  this.api_ = new cwc.protocol.sphero.v1.Api();

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);
};


/**
 * Connects the Sphero unit.
 * @export
 */
cwc.mode.sphero.sprkPlus.Connection.prototype.init = function() {
  if (!this.connectMonitor) {
    this.connectMonitor = new goog.Timer(this.connectMonitorInterval);
    this.events_.listen(this.connectMonitor, goog.Timer.TICK,
      this.connect.bind(this));
  }
  let connectScreenInstance = this.helper.getInstance('connectScreen');
  connectScreenInstance.requestBluetoothDevice(
    cwc.protocol.bluetooth.lowEnergy.supportedDevices.SPHERO_SPRK_PLUS
  ).then((bluetoothDevice) => {
    bluetoothDevice.connect().then((device) => {
      this.api_.connect(device);
    });
  }).catch(() => {
    this.connectMonitor.start();
  });
/*
  let bluetoothInstance = this.helper.getInstance('bluetoothLE', true);
  let devices = bluetoothInstance.getDevicesByName(
    cwc.protocol.bluetooth.lowEnergy.supportedDevices.SPHERO_SPRK_PLUS.name);
  if (!devices || !devices[0]) {
    console.log('Unable to find',
      cwc.protocol.bluetooth.lowEnergy.supportedDevices.SPHERO_SPRK_PLUS.name,
      'please connect...');
    let connectScreenInstance = this.helper.getInstance('connectScreen');
    connectScreenInstance.showBluetoothDevices();
  }
  this.connect();*/
};


/**
 * Connects the Sphero SPRK+.
 * @param {Event=} opt_event
 * @export
 */
cwc.mode.sphero.sprkPlus.Connection.prototype.connect = function(opt_event) {
  if (!this.isConnected()) {
    let bluetoothInstance = this.helper.getInstance('bluetoothLE', true);
    let devices = bluetoothInstance.getDevicesByName(
      cwc.protocol.bluetooth.lowEnergy.supportedDevices.SPHERO_SPRK_PLUS.name);
    if (devices) {
      devices[0].connect().then((device) => {
        this.api_.connect(device);
      });
    }
  }
  this.api_.monitor(true);
};


/**
 * Stops the current executions.
 */
cwc.mode.sphero.sprkPlus.Connection.prototype.stop = function() {
  let runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.terminate();
  }
  this.api_.stop();
};


/**
 * Resets the connection.
 * @param {Event=} opt_event
 * @export
 */
cwc.mode.sphero.sprkPlus.Connection.prototype.reset = function(opt_event) {
  if (this.isConnected()) {
    this.api_.reset();
  }
};


/**
 * @return {!boolean}
 * @export
 */
cwc.mode.sphero.sprkPlus.Connection.prototype.isConnected = function() {
  return this.api_.isConnected();
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.mode.sphero.sprkPlus.Connection.prototype.getEventHandler = function() {
  return this.api_.getEventHandler();
};


/**
 * @return {!cwc.protocol.sphero.v1.Api}
 * @export
 */
cwc.mode.sphero.sprkPlus.Connection.prototype.getApi = function() {
  return this.api_;
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.sphero.sprkPlus.Connection.prototype.cleanUp = function() {
  console.log('Clean up Sphero connection ...');
  if (this.connectMonitor) {
    this.connectMonitor.stop();
  }
  this.stop();
  this.events_.clear();
};
