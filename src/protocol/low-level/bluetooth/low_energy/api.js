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

  /** @type {cwc.protocol.bluetooth.lowEnergy.Devices} */
  this.devices = null;

  /** @type {boolean} */
  this.prepared = false;

  /** @private {cwc.protocol.bluetooth.lowEnergy.Adapter} */
  this.adapter_ = null;

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

  this.adapter_ = new cwc.protocol.bluetooth.lowEnergy.Adapter(
    this.eventHandler_);
  this.adapter_.prepare();

  this.devices = new cwc.protocol.bluetooth.lowEnergy.Devices(
    this.eventHandler_);
  this.devices.prepare();

  this.prepared = true;
};


/**
 * @param {Function=} optCallback Will be only called  after an connection.
 */
cwc.protocol.bluetooth.lowEnergy.Api.prototype.requestDevice = function(
    optCallback) {
  if (this.devices) {
    this.devices.requestDevice(optCallback);
  }
};


/**
 * @param {!string} id
 * @return {cwc.protocol.bluetooth.lowEnergy.Device}
 */
cwc.protocol.bluetooth.lowEnergy.Api.prototype.getDevice = function(id) {
  if (this.devices) {
    return this.devices.getDevice(id);
  }
  return null;
};


/**
 * @return {Object}
 */
cwc.protocol.bluetooth.lowEnergy.Api.prototype.getDevices = function() {
  if (this.devices) {
    return this.devices.getDevices();
  }
  return null;
};


/**
 * @param {!string} name
 * @return {Object}
 */
cwc.protocol.bluetooth.lowEnergy.Api.prototype.getDevicesByName = function(
    name) {
  if (this.devices) {
    return this.devices.getDevicesByName(name);
  }
  return null;
};
