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
goog.provide('cwc.protocol.bluetoothLE.Device');

goog.require('cwc.protocol.bluetoothLE.supportedDevices');
goog.require('cwc.protocol.default.Device');
goog.require('cwc.utils.ByteTools');


/**
 * @constructor
 * @extends {cwc.protocol.default.Device}
 */
cwc.protocol.bluetoothLE.Device = function() {
  /** @private {Object} */
  this.server_ = {};

  /** @private {Object} */
  this.services_ = {};

  /** @private {Object} */
  this.characteristic_ = {};

  /** @private {Object} */
  this.device_ = {};
};
goog.inherits(cwc.protocol.bluetoothLE.Device, cwc.protocol.default.Device);


cwc.protocol.bluetoothLE.Device.prototype.addEventHandler = function() {
  this.device_.addEventListener('gattserverdisconnected',
    this.handleDisconnect_.bind(this));
};


/**
 * @param {!Object} gatt
 * @return {THIS}
 * @template THIS
 */
cwc.protocol.bluetoothLE.Device.prototype.setDevice = function(device) {
  this.device_ = device;
  return this;
};


/**
 * @return {Promise}
 */
cwc.protocol.bluetoothLE.Device.prototype.connect = function() {
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
 * Sends the buffer to the socket.
 * @param {!Array|ArrayBuffer|Uint8Array} buffer
 */
cwc.protocol.bluetoothLE.Device.prototype.send = function(buffer) {
  console.log('Send buffer', buffer);
  //this.characteristic_['22bb746f-2ba1-7554-2d6f-726568705327']['writeValue'](buffer);
};


/**
 * Sends the buffer to the socket.
 * @param {!Array|ArrayBuffer|Uint8Array} buffer
 * @param {!string} characteristicId
 */
cwc.protocol.bluetoothLE.Device.prototype.sendRaw = function(buffer,
    characteristicId) {
  console.log('Send raw buffer', buffer);
  return this.characteristic_[characteristicId]['writeValue'](buffer);
};


/**
 * @param {!Object} server
 * @private
 */
cwc.protocol.bluetoothLE.Device.prototype.handleConnect_ = function() {
  let promises = [];
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
cwc.protocol.bluetoothLE.Device.prototype.handleDisconnect_ = function(event) {
  console.log('Disconnected!', event);
  this.connected = false;
};


/**
 * @param {!string} serviceId
 * @param {string=} characteristic
 * @private
 */
cwc.protocol.bluetoothLE.Device.prototype.connectService_ = function(
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
 * @private
 */
cwc.protocol.bluetoothLE.Device.prototype.connectCharacteristic_ = function(
    characteristicId, serviceId) {
  this.log_.info('Connecting characteristic', characteristicId, 'on service',
    serviceId);
  return this.services_[serviceId]['getCharacteristic'](characteristicId).then(
    (characteristic) => {
      this.characteristic_[characteristicId] = characteristic;
  });
};
