/**
 * @fileoverview Handels the pairing and communication with Bluetooth devices.
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
goog.provide('cwc.protocol.bluetooth.Api');

goog.require('cwc.protocol.bluetooth.Adapter');
goog.require('cwc.protocol.bluetooth.Devices');

goog.require('cwc.utils.Helper');
goog.require('goog.Timer');
goog.require('goog.async.Throttle');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.bluetooth.Api = function(helper) {
  /** @type {string} */
  this.name = 'Bluetooth';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {boolean} */
  this.enabled = false;

  /** @type {boolean} */
  this.prepared = false;

  /** @type {cwc.protocol.bluetooth.Adapter} */
  this.adapter = null;

  /** @type {cwc.protocol.bluetooth.Devices} */
  this.devices = null;

  /** @type {Object} */
  this.connectionIds = {};

  /** @type {chrome.bluetooth} */
  this.bluetooth = chrome.bluetooth;

  /** @type {!chrome.bluetoothSocket} */
  this.bluetoothSocket = chrome.bluetoothSocket;
};


/**
 * Prepares the bluetooth api and monitors Bluetooth adapter.
 */
cwc.protocol.bluetooth.Api.prototype.prepare = function() {
  if (this.bluetooth && !this.prepared) {
    console.log('Prepare Bluetooth support ...');

    // Monitor Bluetooth adapter
    this.adapter = new cwc.protocol.bluetooth.Adapter(this.helper,
        this.bluetooth);
    this.adapter.prepare();

    // Monitor Bluetooth devices
    this.devices = new cwc.protocol.bluetooth.Devices(this.helper,
        this.bluetooth);
    this.devices.prepare();

    // Monitor Bluetooth sockets
    this.addEventListener_();
    this.prepared = true;
  }
};


/**
 * @export
 */
cwc.protocol.bluetooth.Api.prototype.updateDevices = function() {
  if (this.devices) {
    this.devices.updateDevices();
  }
};


/**
 * @param {!string} address
 * @return {cwc.protocol.bluetooth.Device}
 * @export
 */
cwc.protocol.bluetooth.Api.prototype.getDevice = function(address) {
  if (this.devices) {
    return this.devices.getDevice(address);
  }
  return null;
};


/**
 * @param {!string} name
 * @return {cwc.protocol.bluetooth.Device}
 * @export
 */
cwc.protocol.bluetooth.Api.prototype.getDeviceByName = function(name) {
  if (this.devices) {
    return this.devices.getDeviceByName(name);
  }
  return null;
};


/**
 * Adds the different types of event listener to device.
 * @private
 */
cwc.protocol.bluetooth.Api.prototype.addEventListener_ = function() {
  this.bluetoothSocket.onReceive.addListener(
      this.handleOnReceive_.bind(this));
  this.bluetoothSocket.onReceiveError.addListener(
      this.handleOnReceiveError_.bind(this));
};


/**
 * @param {Object} info
 * @private
 */
cwc.protocol.bluetooth.Api.prototype.handleOnReceive_ = function(info) {
  this.devices.receiveData(info['socketId'], info['data']);
};


/**
 * @param {Object} info
 * @private
 */
cwc.protocol.bluetooth.Api.prototype.handleOnReceiveError_ = function(
    info) {
  this.devices.receiveError(info['socketId'], info['error']);
};
