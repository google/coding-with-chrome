/**
 * @fileoverview Handles the pairing and communication with Bluetooth devices.
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
goog.provide('cwc.protocol.bluetooth.lowEnergy.Device');

goog.require('cwc.protocol.bluetooth.lowEnergy.supportedDevices');
goog.require('cwc.protocol.default.Device');
goog.require('cwc.utils.ByteTools');
goog.require('cwc.utils.StackQueue');


/**
 * @constructor
 * @extends {cwc.protocol.default.Device}
 */
cwc.protocol.bluetooth.lowEnergy.Device = function() {
  /** @private {Object} */
  this.server_ = {};

  /** @private {Object} */
  this.services_ = {};

  /** @private {string} */
  this.defaultCharacteristic_ = '';

  /** @private {Object} */
  this.characteristic_ = {};

  /** @private {Object} */
  this.device_ = {};

  /** @private {!cwc.utils.StackQueue} */
  this.stack_ = new cwc.utils.StackQueue();
};
goog.inherits(
  cwc.protocol.bluetooth.lowEnergy.Device, cwc.protocol.default.Device);


cwc.protocol.bluetooth.lowEnergy.Device.prototype.addEventHandler = function() {
  this.device_.addEventListener('gattserverdisconnected',
    this.handleDisconnect_.bind(this));
};


/**
 * @param {!Object} device
 * @return {THIS}
 * @template THIS
 */
cwc.protocol.bluetooth.lowEnergy.Device.prototype.setDevice = function(device) {
  this.device_ = device;
  return this;
};


/**
 * @return {Promise}
 */
cwc.protocol.bluetooth.lowEnergy.Device.prototype.connect = function() {
  return new Promise((resolve) => {
    this.connected = this.device_['gatt']['connected'];
    if (this.connected) {
      return resolve(this);
    }
    this.log_.info('Connecting...');
    this.device_['gatt']['connect']().then((server) => {
      this.server_ = server;
      this.connected = this.device_['gatt']['connected'];
      this.handleConnect_().then(() => {
        this.log_.info('Connected!');
        this.connected = true;
        resolve(this);
      });
    });
  });
};


/**
 * @param {!string} characteristicId
 * @param {!Function} func
 */
cwc.protocol.bluetooth.lowEnergy.Device.prototype.listen = function(
  characteristicId, func) {
  if (!this.characteristic_[characteristicId]) {
    this.log_.error('Unknown characteristic', characteristicId);
    return;
  }
  this.characteristic_[characteristicId]['startNotifications']().then(() => {
    this.log_.info('Adding event listener for', characteristicId);
    this.characteristic_[characteristicId]['addEventListener'](
      'characteristicvaluechanged', function(e) {
        func(e.target.value.buffer)
      });
  });
};


/**
 * Sends the buffer to the socket.
 * @param {!Array|ArrayBuffer|Uint8Array} buffer
 */
cwc.protocol.bluetooth.lowEnergy.Device.prototype.send = function(buffer) {
  this.stack_.addPromise(() => {
    return this.characteristic_[this.defaultCharacteristic_]['writeValue'](
      buffer
    );
  });
};


/**
 * Sends the buffer to the socket.
 * @param {!Array|ArrayBuffer|Uint8Array} buffer
 * @param {!string} characteristicId
 * @param {Function=} callback
 */
cwc.protocol.bluetooth.lowEnergy.Device.prototype.sendRaw = function(buffer,
    characteristicId, callback) {
  this.stack_.addPromise(() => {
    return this.characteristic_[characteristicId]['writeValue'](buffer);
  }, callback);
};


cwc.protocol.bluetooth.lowEnergy.Device.prototype.reset = function() {
  this.stack_.clear();
};


/**
 * @param {!Object} server
 * @return {Promise}
 * @private
 */
cwc.protocol.bluetooth.lowEnergy.Device.prototype.handleConnect_ = function() {
  let promises = [];
  // Set default characteristic for send command.
  this.defaultCharacteristic_ = this.profile.characteristic.default;

  // Pre-connect available services.
  for (let entry in this.profile.services) {
    if (this.profile.services.hasOwnProperty(entry)) {
      let serviceEntry = this.profile.services[entry];
      promises.push(this.connectService_(serviceEntry, entry));
    }
  }
  return Promise.all(promises);
};


/**
 * @param {!Object} event
 * @private
 */
cwc.protocol.bluetooth.lowEnergy.Device.prototype.handleDisconnect_ = function(
    event) {
  console.log('Disconnected!', event);
  this.connected = false;
};


/**
 * @param {!string} serviceId
 * @param {string=} characteristic
 * @return {Promise}
 * @private
 */
cwc.protocol.bluetooth.lowEnergy.Device.prototype.connectService_ = function(
    serviceId, characteristic) {
  this.log_.info('Connect service', serviceId);
  return this.server_['getPrimaryService'](serviceId).then((service) => {
    this.services_[service['uuid']] = service;
    // Preconnecting Characteristic.
    if (characteristic) {
      let promises = [];
      for (let entry in this.profile.characteristic[characteristic]) {
        if (this.profile.characteristic[characteristic].hasOwnProperty(entry)) {
          let characteristicEntry =
            this.profile.characteristic[characteristic][entry];
          promises.push(
            this.connectCharacteristic_(characteristicEntry, serviceId));
        }
      }
      return Promise.all(promises);
    }
  });
};


/**
 * @param {!string} characteristicId
 * @param {!string} serviceId
 * @return {Promise}
 * @private
 */
cwc.protocol.bluetooth.lowEnergy.Device.prototype.connectCharacteristic_ =
    function(characteristicId, serviceId) {
  this.log_.info('Connecting characteristic', characteristicId, 'on service',
    serviceId);
  return this.services_[serviceId]['getCharacteristic'](characteristicId).then(
    (characteristic) => {
      this.characteristic_[characteristicId] = characteristic;
  });
};


cwc.protocol.bluetooth.lowEnergy.Device.prototype.handleData_ = function(e) {
  console.log('Data', e.target, e.target.value);
};
