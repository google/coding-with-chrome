/**
 * @fileoverview Handles the serial communication.
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
goog.provide('cwc.protocol.serial.Api');

goog.require('cwc.protocol.serial.Devices');
goog.require('cwc.utils.Logger');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.serial.Api = function(helper) {
  /** @type {string} */
  this.name = 'Serial';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {boolean} */
  this.enabled = false;

  /** @type {boolean} */
  this.prepared = false;

  /** @type {cwc.protocol.serial.Devices} */
  this.devices = null;

  /** @type {Object} */
  this.connectionIds = {};

  /** @private {!boolean} */
  this.isChromeApp_ = this.helper.checkChromeFeature('app');

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  this.prepare();
};


/**
 * Prepares the serial communication.
 * @export
 */
cwc.protocol.serial.Api.prototype.prepare = function() {
  if (!this.isChromeApp_ || !chrome.serial) {
    this.log_.warn('Serial support is not available!');
    return;
  }
  if (this.prepared) {
    return;
  }
  this.log_.info('Preparing serial support...');

  // Monitor serial devices
  this.devices = new cwc.protocol.serial.Devices(this.helper);
  this.devices.prepare();

  // Monitor serial data
  chrome.serial.onReceive.addListener(
    this.handleOnReceive_.bind(this));
  chrome.serial.onReceiveError.addListener(
    this.handleOnReceiveError_.bind(this));

  this.prepared = true;
};


/**
 * @export
 */
cwc.protocol.serial.Api.prototype.updateDevices = function() {
  if (this.devices) {
    this.devices.updateDevices();
  }
};


/**
 * @param {!string} device_id
 * @return {cwc.protocol.serial.Device}
 * @export
 */
cwc.protocol.serial.Api.prototype.getDevice = function(device_id) {
  return this.devices.getDevice(device_id);
};


/**
 * @return {Object}
 * @export
 */
cwc.protocol.serial.Api.prototype.getDevices = function() {
  if (this.devices) {
    return this.devices.getDevices();
  }
  return null;
};


/**
 * @return {cwc.protocol.serial.Device}
 * @export
 */
cwc.protocol.serial.Api.prototype.getConnectedDevice = function() {
  if (this.devices) {
    return this.devices.getConnectedDevice();
  }
  return null;
};


/**
 * @param {Object} info
 * @private
 */
cwc.protocol.serial.Api.prototype.handleOnReceive_ = function(info) {
  this.devices.receiveData(info['connectionId'], info['data']);
};


/**
 * @param {Object} info
 * @private
 */
cwc.protocol.serial.Api.prototype.handleOnReceiveError_ = function(
    info) {
  this.devices.receiveError(info['connectionId'], info['error']);
};
