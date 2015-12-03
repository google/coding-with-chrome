/**
 * @fileoverview Handles the serial communication.
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
goog.provide('cwc.protocol.Serial.api');

goog.require('cwc.protocol.Serial.Devices');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.Serial.api = function(helper) {
  /** @type {string} */
  this.name = 'Serial';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {boolean} */
  this.enabled = false;

  /** @type {boolean} */
  this.prepared = false;

  /** @type {cwc.protocol.Serial.Devices} */
  this.devices = null;

  /** @type {Object} */
  this.connectionIds = {};

  /** @type {chrome.serial} */
  this.serial = chrome.serial;

  this.prepare();
};


/**
 * Prepares the serial communication.
 * @export
 */
cwc.protocol.Serial.api.prototype.prepare = function() {
  if (this.serial && !this.prepared) {
    console.log('Prepare serial support ...');
    this.devices = new cwc.protocol.Serial.Devices(this.helper,
        this.serial);
    this.updateDevices();
    this.addEventListener_();
    this.prepared = true;
  }
};


/**
 * @export
 */
cwc.protocol.Serial.api.prototype.updateDevices = function() {
  this.devices.updateDevices();
};


/**
 * @param {!string} device_id
 * @return {cwc.protocol.Serial.Device}
 * @export
 */
cwc.protocol.Serial.api.prototype.getDevice = function(device_id) {
  return this.devices.getDevice(device_id);
};


/**
 * Adds the different types of event listener to device.
 * @private
 */
cwc.protocol.Serial.api.prototype.addEventListener_ = function() {
  chrome.serial.onReceive.addListener(
      this.handleOnReceive_.bind(this));
  chrome.serial.onReceiveError.addListener(
      this.handleOnReceiveError_.bind(this));
};


/**
 * @param {Object} info
 * @private
 */
cwc.protocol.Serial.api.prototype.handleOnReceive_ = function(info) {
  this.devices.receiveData(info['connectionId'], info['data']);
};


/**
 * @param {Object} info
 * @private
 */
cwc.protocol.Serial.api.prototype.handleOnReceiveError_ = function(
    info) {
  this.devices.receiveError(info['connectionId'], info['error']);
};
