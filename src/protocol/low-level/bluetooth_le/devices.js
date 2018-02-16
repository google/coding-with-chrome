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


/**
 * @param {Function=} optCallback Will be only called  after an connection.
 */
cwc.protocol.bluetoothLE.Devices.prototype.requestDevice = function(
    optCallback) {
  navigator.bluetooth.requestDevice(this.getDeviceFilter_()).then(
    (bluetoothDevice) => {
      this.handleRequestDevice_(bluetoothDevice);
      if (optCallback) {
        optCallback();
      }
    }
  );
};


/**
 * @return {Object}
 * @private
 */
cwc.protocol.bluetoothLE.Devices.prototype.getDeviceFilter_ = function() {
  let filters = [];
  let services = [];
  for (let entry in cwc.protocol.bluetoothLE.supportedDevices) {
    if (cwc.protocol.bluetoothLE.supportedDevices.hasOwnProperty(entry)) {
      let device = cwc.protocol.bluetoothLE.supportedDevices[entry];
      filters.push({'namePrefix': device.namePrefix});
      services = [...new Set([...services, ...Object.keys(device.services).map(
        (service) => device.services[service]
      )])];
    }
  }
  return {
    'filters': filters,
    'optionalServices': services,
  };
};


/**
 * @param {!string} id
 * @return {cwc.protocol.bluetoothLE.Device}
 */
cwc.protocol.bluetoothLE.Devices.prototype.getDevice = function(id) {
  if (id in this.devices) {
    return this.devices[id];
  }
  this.log_.error('Bluetooth device id', id, 'is unknown!');
  return null;
};


/**
 * @param {?} device
 * @return {!cwc.protocol.bluetoothLE.supportedDevices|null}
 */
cwc.protocol.bluetoothLE.Devices.prototype.getDeviceProfile = function(device) {
  for (let entry in cwc.protocol.bluetoothLE.supportedDevices) {
    if (cwc.protocol.bluetoothLE.supportedDevices.hasOwnProperty(entry)) {
      let profile = cwc.protocol.bluetoothLE.supportedDevices[entry];
      if (device['name'] == profile.name ||
          device['name'].includes(profile.namePrefix)) {
        this.log_.debug('Found device profile', profile.name, 'for', device);
        return profile;
      }
    }
  }
  return null;
};


/**
 * @return {Object}
 */
cwc.protocol.bluetoothLE.Devices.prototype.getDevices = function() {
  return this.devices;
};


/**
 * @param {?} bluetoothDevice
 * @private
 */
cwc.protocol.bluetoothLE.Devices.prototype.handleRequestDevice_ = function(
    bluetoothDevice) {
  console.log('handleRequestDevice_', bluetoothDevice);
  let profile = this.getDeviceProfile(bluetoothDevice);
  let device = new cwc.protocol.bluetoothLE.Device()
    .setConnected(bluetoothDevice['gatt']['connected'])
    .setGATT(bluetoothDevice['gatt'])
    .setId(bluetoothDevice['id'])
    .setLogName('Bluetooth LE Device ' + bluetoothDevice['id'])
    .setName(bluetoothDevice['name'])
    .setProfile(profile);
  this.devices[bluetoothDevice['id']] = device;
  console.log(this.devices);
};
