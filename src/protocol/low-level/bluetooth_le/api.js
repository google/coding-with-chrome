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
goog.provide('cwc.protocol.bluetoothLE.Api');

goog.require('cwc.protocol.bluetoothLE.Adapter');
goog.require('cwc.protocol.bluetoothLE.Devices');
goog.require('cwc.utils.Logger');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.bluetoothLE.Api = function(helper) {
  /** @type {string} */
  this.name = 'Bluetooth LE';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {boolean} */
  this.enabled = false;

  /** @type {cwc.protocol.bluetoothLE.Devices} */
  this.devices = null;

  /** @type {boolean} */
  this.prepared = false;

  /** @private {cwc.protocol.bluetoothLE.Adapter} */
  this.adapter_ = null;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Prepares the bluetooth le api and monitors Bluetooth adapter.
 */
cwc.protocol.bluetoothLE.Api.prototype.prepare = function() {
  if (this.prepared) {
    return;
  }

  this.log_.debug('Preparing Bluetooth LowEnergy support...');

  this.adapter_ = new cwc.protocol.bluetoothLE.Adapter(this.eventHandler_);
  this.adapter_.prepare();

  this.devices = new cwc.protocol.bluetoothLE.Devices(this.eventHandler_);
  this.devices.prepare();

  this.prepared = true;
};


cwc.protocol.bluetoothLE.Api.prototype.requestDevice = function() {
  if (this.devices) {
    this.devices.requestDevice();
  }
};


/**
 * @return {Object}
 */
cwc.protocol.bluetoothLE.Api.prototype.getDevices = function() {
  if (this.devices) {
    return this.devices.getDevices();
  }
  return null;
};
