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
  this.gatt_ = {};
};
goog.inherits(cwc.protocol.bluetoothLE.Device, cwc.protocol.default.Device);


/**
 * @param {!Object} gatt
 * @return {THIS}
 */
cwc.protocol.bluetoothLE.Device.prototype.setGATT = function(gatt) {
  this.gatt_ = gatt;
  return this;
};


/**
 * @param {Function=} optCallback Will be only called  after an connection.
 */
cwc.protocol.bluetoothLE.Device.prototype.connect = function(optCallback) {
  this.log_.info('Connecting...');
  this.gatt_['connect']().then((server) => {
    this.server_ = server;
    this.handleConnect_();
    if (optCallback) {
      optCallback();
    }
  });
};


/**
 * Sends the buffer to the socket.
 * @param {!Array|ArrayBuffer|Uint8Array} buffer
 */
cwc.protocol.bluetoothLE.Device.prototype.send = function(buffer) {
  console.log('Send buffer', buffer);
};


/**
 * @param {!Object} server
 * @private
 */
cwc.protocol.bluetoothLE.Device.prototype.handleConnect_ = function() {
  for (let entry in this.profile.services) {
    if (this.profile.services.hasOwnProperty(entry)) {
      let serviceEntry = this.profile.services[entry];
      this.connectService_(serviceEntry, entry);
    }
  }
};


/**
 * @param {!string} serviceId
 * @param {string=} test
 * @private
 */
cwc.protocol.bluetoothLE.Device.prototype.connectService_ = function(
    serviceId, test) {
  this.log_.info('Connecting service', serviceId);
  this.server_['getPrimaryService'](serviceId).then((service) => {
    this.services_[service['uuid']] = service;

    if (test) {
      // Preconnecting Characteristic
      for (let entry in this.profile.characteristic[test]) {
        if (this.profile.characteristic[test].hasOwnProperty(entry)) {
          let characteristicEntry = this.profile.characteristic[test][entry];
          this.connectCharacteristic_(characteristicEntry, serviceId);
        }
      }
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
  this.services_[serviceId]['getCharacteristic'](characteristicId).then(
    (characteristicId) => {
      this.characteristic_[characteristicId] = characteristicId;
  });
};
