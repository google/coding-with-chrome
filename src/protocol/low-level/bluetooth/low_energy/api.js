/**
 * @fileoverview Handels the pairing and communication with Bluetooth devices.
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
goog.provide('cwc.protocol.bluetooth.lowEnergy.Api');

goog.require('cwc.protocol.bluetooth.lowEnergy.Adapter');
goog.require('cwc.protocol.bluetooth.lowEnergy.Devices');
goog.require('cwc.utils.Logger');

goog.require('goog.events.EventTarget');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.bluetooth.lowEnergy.Api = function(helper) {
  /** @type {string} */
  this.name = 'Bluetooth LE';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {boolean} */
  this.enabled = false;

  /** @type {boolean} */
  this.prepared = false;

  /** @private {!goog.events.EventTarget} */
  this.eventHandler_ = new goog.events.EventTarget();

  /** @private {cwc.protocol.bluetooth.lowEnergy.Adapter} */
  this.adapter_ = new cwc.protocol.bluetooth.lowEnergy.Adapter(
    this.eventHandler_);

  /** @private {cwc.protocol.bluetooth.lowEnergy.Devices} */
  this.devices_ = new cwc.protocol.bluetooth.lowEnergy.Devices(
    this.eventHandler_);

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Prepares the bluetooth le api and monitors Bluetooth adapter.
 */
cwc.protocol.bluetooth.lowEnergy.Api.prototype.prepare = function() {
  if (this.prepared) {
    return;
  }

  this.log_.debug('Preparing Bluetooth LowEnergy support...');
  this.adapter_.prepare();
  this.devices_.prepare();

  this.prepared = true;
};


/**
 * @param {!cwc.protocol.bluetooth.lowEnergy.supportedDevices} device
 * @return {Promise}
 */
cwc.protocol.bluetooth.lowEnergy.Api.prototype.requestDevice = function(
    device) {
  return this.devices_.requestDevice(device);
};


/**
 * @param {Function=} callback Will be only called  after an connection.
 */
cwc.protocol.bluetooth.lowEnergy.Api.prototype.requestDevices = function(
    callback) {
  this.devices_.requestDevices(callback);
};


/**
 * @param {string} id
 * @return {cwc.protocol.bluetooth.lowEnergy.Device}
 */
cwc.protocol.bluetooth.lowEnergy.Api.prototype.getDevice = function(id) {
  return this.devices_.getDevice(id);
};


/**
 * @return {Object}
 */
cwc.protocol.bluetooth.lowEnergy.Api.prototype.getDevices = function() {
  return this.devices_.getDevices();
};


/**
 * @param {string} name
 * @return {Object}
 */
cwc.protocol.bluetooth.lowEnergy.Api.prototype.getDevicesByName = function(
    name) {
  return this.devices_.getDevicesByName(name);
};
