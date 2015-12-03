/**
 * @fileoverview Handles the pairing and communication with USB devices.
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
goog.provide('cwc.protocol.Serial.Devices');

goog.require('cwc.protocol.Serial.Device');
goog.require('cwc.protocol.Serial.supportedDevicePaths');
goog.require('cwc.protocol.Serial.supportedDevices');
goog.require('cwc.protocol.Serial.unsupportedDevicePaths');



/**
 * @param {!cwc.ui.helper} helper
 * @param {!chrome.serial} serial
 * @constructor
 */
cwc.protocol.Serial.Devices = function(helper, serial) {

  /** @type {cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!chrome.serial} */
  this.serial = serial;

  /** @type {Object} */
  this.devices = {};

  /** @type {Object} */
  this.connectionIds = {};
};


/**
 * @export
 */
cwc.protocol.Serial.Devices.prototype.updateDevices = function() {
  if (this.devices) {
    this.devices = {};
  }
  this.serial.getDevices(this.handleGetDevices_.bind(this));
};


/**
 * @param {!string} device_id
 * @return {cwc.protocol.Serial.Device}
 * @export
 */
cwc.protocol.Serial.Devices.prototype.getDevice = function(device_id) {
  if (device_id in this.devices) {
    return this.devices[device_id];
  }
  console.error('The following device id is unknown:', device_id);
};


/**
 * @param {!string} connection_id
 * @param {ByteArray} data
 * @export
 */
cwc.protocol.Serial.Devices.prototype.receiveData = function(
    connection_id, data) {
  if (connection_id in this.connectionIds) {
    this.connectionIds[connection_id].handleData(data);
  }
};


/**
 * @param {!string} connection_id
 * @param {!string} error
 * @export
 */
cwc.protocol.Serial.Devices.prototype.receiveError = function(
    connection_id, error) {
  if (connection_id in this.connectionIds) {
    this.connectionIds[connection_id].handleError(error);
  }
};


/**
 * @param {!string} device_id
 * @param {!number} connection_id
 * @private
 */
cwc.protocol.Serial.Devices.prototype.handleConnect_ = function(
    device_id, connection_id) {
  console.log('Connect', device_id, connection_id);
  this.connectionIds[connection_id] = this.devices[device_id];
};


/**
 * @param {!string} device_id
 * @param {!number} connection_id
 * @private
 */
cwc.protocol.Serial.Devices.prototype.handleDisconnect_ = function(
    device_id, connection_id) {
  console.log('Disconnect', device_id, connection_id);
  this.connectionIds[connection_id] = null;
};


/**
 * @param {?} devices
 * @private
 */
cwc.protocol.Serial.Devices.prototype.handleGetDevices_ = function(
    devices) {
  var filteredDevices = [];

  if (!devices || devices.length == 0) {
    console.warn('Did not find any serial devices!');
  } else {
    var unsupportedPaths = cwc.protocol.Serial.unsupportedDevicePaths;
    for (var i = 0; i < devices.length; i++) {
      if (devices[i].path in unsupportedPaths) {
        console.log('Ignored serial device:', devices[i]);
      } else {
        console.log('Found serial device:', devices[i]);
        filteredDevices.push(devices[i]);
      }
    }
  }

  if (!filteredDevices) {
    console.warn('Did not find any supported serial device!');
  } else {
    var supportedDevices = cwc.protocol.Serial.supportedDevices;
    var supportedPaths = cwc.protocol.Serial.supportedDevicePaths;
    console.info('Found', filteredDevices.length, 'serial devices ...');
    for (var i2 = 0; i2 < filteredDevices.length; i2++) {
      var deviceEntry = filteredDevices[i2];
      var devicePath = deviceEntry.path;
      var vendorId = deviceEntry.vendorId;
      var productId = deviceEntry.productId;
      var deviceId = btoa(devicePath);
      var displayName = '';
      var device = new cwc.protocol.Serial.Device(
          deviceId, devicePath, vendorId, productId, displayName, this.serial);

      if (vendorId in supportedDevices &&
          productId in supportedDevices[vendorId]) {
        device.setDisplayName(supportedDevices[vendorId][productId]['name']);
        device.setSupported(true);
      } else if (devicePath in supportedPaths) {
        device.setDisplayName(supportedPaths[devicePath]['name']);
        device.setSupported(true);
      }

      device.setConnectEvent(this.handleConnect_.bind(this));
      device.setDisconnectEvent(this.handleDisconnect_.bind(this));
      this.devices[deviceId] = device;
    }
  }

  var connectionManagerInstance = this.helper.getInstance('connectionManager');
  if (connectionManagerInstance) {
    connectionManagerInstance.setSerialDevices(this.devices);
  }
};
