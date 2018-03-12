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
goog.provide('cwc.protocol.bluetooth.lowEnergy.Devices');

goog.require('cwc.protocol.bluetooth.lowEnergy.Device');
goog.require('cwc.protocol.bluetooth.lowEnergy.supportedDevices');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');

goog.require('goog.Timer');
goog.require('goog.async.Throttle');


/**
 * @param {!goog.events.EventTarget} eventHandler
 * @constructor
 */
cwc.protocol.bluetooth.lowEnergy.Devices = function(eventHandler) {
  /** @type {!string} */
  this.name = 'Bluetooth LE Devices';

  /** @type {Object} */
  this.devices = {};

  /** @type {boolean} */
  this.prepared = false;

  /** @private {Object} */
  this.deviceTypeMap_ = {};

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

  /** @private {!goog.events.EventTarget} */
  this.eventHandler_ = eventHandler;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


cwc.protocol.bluetooth.lowEnergy.Devices.prototype.prepare = function() {
  if (this.prepared) {
    return;
  }

  this.log_.debug('Preparing Bluetooth LE devices ...');
  this.preapred = true;
};


/**
 * @param {!cwc.protocol.bluetooth.lowEnergy.supportedDevices} device
 * @return {Promise}
 */
cwc.protocol.bluetooth.lowEnergy.Devices.prototype.requestDevice = function(
    device) {
  let services = Object.keys(device.services).map(
    (service) => device.services[service]
  );
  return new Promise((resolve, reject) => {
    navigator.bluetooth.requestDevice({
      'filters': [
        {'namePrefix': device.namePrefix},
      ],
      'optionalServices': services,
    }).then((bluetoothDevice) => {
      resolve(this.handleRequestDevice_(bluetoothDevice));
    }).catch(() => reject);
  });
};


/**
 * @param {Function=} callback Will be only called  after an connection.
 */
cwc.protocol.bluetooth.lowEnergy.Devices.prototype.requestDevices = function(
    callback) {
  let filter = this.getDeviceFilter_();
  this.log_.info('Searching for devices with filter', filter);
  navigator.bluetooth.requestDevice(filter).then((bluetoothDevice) => {
    this.handleRequestDevice_(bluetoothDevice);
    if (callback) {
      callback();
    }
  });
};


/**
 * @return {Object}
 * @private
 */
cwc.protocol.bluetooth.lowEnergy.Devices.prototype.getDeviceFilter_ =
    function() {
  let filters = [];
  let services = [];
  for (let entry in cwc.protocol.bluetooth.lowEnergy.supportedDevices) {
    if (
      cwc.protocol.bluetooth.lowEnergy.supportedDevices.hasOwnProperty(entry)) {
      let device = cwc.protocol.bluetooth.lowEnergy.supportedDevices[entry];
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
 * @return {cwc.protocol.bluetooth.lowEnergy.Device}
 */
cwc.protocol.bluetooth.lowEnergy.Devices.prototype.getDevice = function(id) {
  if (id in this.devices) {
    return this.devices[id];
  }
  this.log_.error('Bluetooth device id', id, 'is unknown!');
  return null;
};


/**
 * @param {?} device
 * @return {!cwc.protocol.bluetooth.lowEnergy.supportedDevices|null}
 */
cwc.protocol.bluetooth.lowEnergy.Devices.prototype.getDeviceProfile = function(
    device) {
  for (let entry in cwc.protocol.bluetooth.lowEnergy.supportedDevices) {
    if (
      cwc.protocol.bluetooth.lowEnergy.supportedDevices.hasOwnProperty(entry)) {
      let profile = cwc.protocol.bluetooth.lowEnergy.supportedDevices[entry];
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
cwc.protocol.bluetooth.lowEnergy.Devices.prototype.getDevices = function() {
  return this.devices;
};


/**
 * @param {!string} name
 * @return {Array.<cwc.protocol.bluetooth.lowEnergy.Device>}
 */
cwc.protocol.bluetooth.lowEnergy.Devices.prototype.getDevicesByName = function(
    name) {
  if (name in this.deviceTypeMap_) {
    return this.deviceTypeMap_[name];
  }
  return null;
};


/**
 * @param {?} bluetoothDevice
 * @return {cwc.protocol.bluetooth.lowEnergy.Device}
 * @private
 */
cwc.protocol.bluetooth.lowEnergy.Devices.prototype.handleRequestDevice_ =
    function(bluetoothDevice) {
  console.log('handleRequestDevice_', bluetoothDevice);
  let profile = this.getDeviceProfile(bluetoothDevice);
  if (!profile) {
    this.log_.warn('Unknown device', bluetoothDevice);
  }

  // Creating device entry.
  let device = new cwc.protocol.bluetooth.lowEnergy.Device()
    .setConnected(bluetoothDevice['gatt']['connected'])
    .setDevice(bluetoothDevice)
    .setId(bluetoothDevice['id'])
    .setLogName('Bluetooth LE Device ' + bluetoothDevice['id'])
    .setName(bluetoothDevice['name'])
    .setProfile(profile);
  device.addEventHandler();
  this.devices[bluetoothDevice['id']] = device;

  // Storing device in type map for easy access.
  if (!(profile.name in this.deviceTypeMap_)) {
    this.deviceTypeMap_[profile.name] = [];
  }
  this.deviceTypeMap_[profile.name].push(device);

  return this.devices[bluetoothDevice['id']];
};
