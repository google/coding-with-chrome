/**
 * @fileoverview Handles the pairing and communication with Bluetooth devices.
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
goog.provide('cwc.protocol.bluetoothLE.Devices');

goog.require('cwc.protocol.bluetoothLE.Device');
goog.require('cwc.protocol.bluetoothLE.supportedDevices');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');

goog.require('goog.Timer');
goog.require('goog.async.Throttle');


/**
 * @param {!goog.events.EventTarget} eventHandler
 * @constructor
 */
cwc.protocol.bluetoothLE.Devices = function(eventHandler) {
  /** @type {!string} */
  this.name = 'Bluetooth LE Devices';

  /** @type {Object} */
  this.devices = {};

  /** @type {boolean} */
  this.prepared = false;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

  /** @private {!goog.events.EventTarget} */
  this.eventHandler_ = eventHandler;

  /** @type {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


cwc.protocol.bluetoothLE.Devices.prototype.prepare = function() {
  if (this.prepared) {
    return;
  }

  this.log_.debug('Preparing Bluetooth LE devices ...');
  this.preapred = true;
};


cwc.protocol.bluetoothLE.Devices.prototype.requestDevice = function() {
  navigator.bluetooth.requestDevice(
    this.getDeviceFilter_()
  ).then(
    this.handleRequestDevice_.bind(this)
  );
};


/**
 * @return {Object}
 * @private
 */
cwc.protocol.bluetoothLE.Devices.prototype.getDeviceFilter_ = function() {
  let filters = [];
  for (let entry in cwc.protocol.bluetoothLE.supportedDevices) {
    if (cwc.protocol.bluetoothLE.supportedDevices.hasOwnProperty(entry)) {
      let device = cwc.protocol.bluetoothLE.supportedDevices[entry];
      filters.push({'namePrefix': device.namePrefix});
    }
  }
  return {
    'filters': filters,
  };
};


/**
 * @param {?} device
 * @private
 */
cwc.protocol.bluetoothLE.Devices.prototype.handleRequestDevice_ = function(
    device) {
  console.log('handleRequestDevice_', device);
  let id = device['id'];
  this.devices[id] = new cwc.protocol.bluetoothLE.Device();
  this.devices[id].setId(device['id']);
  this.devices[id].setName(device['name']);
  this.devices[id].setConnected(device['gatt']['connected']);
  console.log(this.devices);
};


/**
 * @return {Object}
 */
cwc.protocol.bluetoothLE.Devices.prototype.getDevices = function() {
  return this.devices;
};
