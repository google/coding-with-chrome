/**
 * @fileoverview provides an abstraction layer to mbot's robot connection.
 *
 * (not finished)
 * Mbot can connect via bluetooth, serial port, and USB HID.
 *
 * @license Copyright 2016 Shenzhen Maker Works Co, Ltd. All Rights Reserved.
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
 * @author wangyu@makeblock.cc (Yu Wang)
 */
goog.provide('cwc.protocol.mbot.RobotConnection');

goog.require('goog.events.EventTarget');

/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.mbot.RobotConnection = function(helper) {
  /** @type {string} */
  this.name = 'mBot';

  /** @type {boolean} */
  this.prepared = false;

  /** @type {string} */
  this.autoConnectName = 'Makeblock';

  /** @private {!number} */
  this.headerMinSize_ = 5;

  /** @private {!array} */
  this.headerAsync_ = [0xff, 0x55];

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {goog.events.EventTarget} */
  this.eventHandler = new goog.events.EventTarget();
};

/**
 * Handles async packets from the Bluetooth socket.
 * @param {ArrayBuffer} buffer
 * @private
 */
cwc.protocol.mbot.RobotConnection.prototype.handleAsyncBluetooth_ = function(buffer) {
  if (!buffer || buffer.length < 7) {
    return;
  }
  console.log('Async:', buffer);
};

/**
 * @return {goog.events.EventTarget}
 */
cwc.protocol.mbot.RobotConnection.prototype.getEventHandler = function() {
  return this.eventHandler;
};


/**
 * AutoConnects the mbot through bluetooth.
 * @export
 */
cwc.protocol.mbot.RobotConnection.prototype.autoConnect = function() {
  var bluetoothInstance = this.helper.getInstance('bluetooth', true);
  bluetoothInstance.autoConnectDevice(this.autoConnectName,
      this.connect.bind(this));
};


/**
 * Connects the mbot.
 * @param {!string} address
 * @return {boolean} Was able to prepare and connect to the mbot.
 * @export
 */
cwc.protocol.mbot.RobotConnection.prototype.connect = function(address) {
  var bluetoothInstance = this.helper.getInstance('bluetooth', true);
  var device = bluetoothInstance.getDevice(address);
  if (!device) {
    console.error('mBot is not ready yet …');
    return false;
  }

  if (!this.prepared && device.isConnected()) {
    console.log('Preparing bluetooth api for', device.getAddress());
    this.device = device;
    this.prepare();
    // this.runTest();
  }

  return true;
};


/**
 * @return {boolean}
 */
cwc.protocol.mbot.RobotConnection.prototype.isConnected = function() {
  return (this.device && this.device.isConnected());
};


/**
 * @export
 */
cwc.protocol.mbot.RobotConnection.prototype.prepare = function() {
  this.device.setDataHandler(this.handleAsyncBluetooth_.bind(this),
      this.headerAsync_, this.headerMinSize_);
  // this.monitoring.init();
  // this.monitoring.start();

  this.prepared = true;
};


/**
 * Disconnects the mbot.
 */
cwc.protocol.mbot.RobotConnection.prototype.disconnect = function() {
  if (this.device) {
    this.device.disconnect();
  }
  this.cleanUp();
};

/**
 * Basic cleanup for the mbot.
 */
cwc.protocol.mbot.RobotConnection.prototype.cleanUp = function() {
  console.log('Clean up Mbot …');
  this.reset();
};

/**
 * Resets the mbot connection.
 */
cwc.protocol.mbot.RobotConnection.prototype.reset = function() {
  if (this.device) {
    this.device.reset();
  }
};


/**
 * Resets the mbot connection.
 */
cwc.protocol.mbot.RobotConnection.prototype.reset = function() {
  if (this.device) {
    this.device.reset();
  }
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.protocol.mbot.RobotConnection.prototype.getEventHandler = function() {
  return this.eventHandler;
};
