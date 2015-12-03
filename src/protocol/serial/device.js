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
goog.provide('cwc.protocol.Serial.Device');



/**
 * @param {!string} device_id
 * @param {!string} path
 * @param {!number} vendor_id
 * @param {!number} product_id
 * @param {string=} opt_name
 * @param {chrome_serial=} opt_serial
 * @constructor
 */
cwc.protocol.Serial.Device = function(device_id, path, vendor_id,
    product_id, opt_name, opt_serial) {

  /** @type {!string} */
  this.deviceId = device_id || '';

  /** @type {!chrome.serial} */
  this.serial = opt_serial || chrome.serial;

  /** @type {!string} */
  this.path = path || '';

  /** @type {!boolean} */
  this.connected = false;

  /** @type {!number} */
  this.vendorId = vendor_id || 0;

  /** @type {!number} */
  this.productId = product_id || 0;

  /** @type {!string} */
  this.displayName = opt_name || '';

  /** @type {!boolean} */
  this.supportedDevice = false;

  /** @type {!Object} */
  this.connectionOptions = {};

  /** @type {!Object} */
  this.connectionInfos = {};

  /** @type {!number} */
  this.connectionId = 0;

  /** @type {!Function} */
  this.connectEvent = null;

  /** @type {!Function} */
  this.disconnectEvent = null;

  /** @type {!Function} */
  this.dataHandler = null;
};


/**
 * @param {!boolean} supported
 * @export
 */
cwc.protocol.Serial.Device.prototype.setSupported = function(
    supported) {
  this.supportedDevice = supported;
};


/**
 * @return {!boolean}
 * @export
 */
cwc.protocol.Serial.Device.prototype.isSupported = function() {
  return this.supportedDevice;
};


/**
 * @return {!string}
 * @export
 */
cwc.protocol.Serial.Device.prototype.getDisplayName = function() {
  return this.displayName;
};


/**
 * @param {!string} name
 * @export
 */
cwc.protocol.Serial.Device.prototype.setDisplayName = function(name) {
  this.displayName = name;
};


/**
 * @return {!string}
 * @export
 */
cwc.protocol.Serial.Device.prototype.getPath = function() {
  return this.path;
};


/**
 * @param {!Function} callback
 * @export
 */
cwc.protocol.Serial.Device.prototype.setConnectEvent = function(
    callback) {
  this.connectEvent = callback;
};


/**
 * @param {!Function} callback
 * @export
 */
cwc.protocol.Serial.Device.prototype.setDisconnectEvent = function(
    callback) {
  this.disconnectEvent = callback;
};


/**
 * @param {!Function} callback
 * @export
 */
cwc.protocol.Serial.Device.prototype.setDataHandler = function(
    callback) {
  this.dataHandler = callback;
};


/**
 * @export
 */
cwc.protocol.Serial.Device.prototype.connect = function() {
  console.log('Connect serial device', this.path, '...');
  this.serial.connect(this.path, this.connectionOptions,
      this.handleConnect_.bind(this));
};


/**
 * @param {Object} connection_info
 * @private
 */
cwc.protocol.Serial.Device.prototype.handleConnect_ = function(
    connection_info) {
  this.connectionInfos = connection_info;
  this.connectionId = connection_info['connectionId'];
  this.connected = true;
  if (goog.isFunction(this.connectEvent)) {
    this.connectEvent(this.deviceId, this.connectionId);
  }
  console.log(connection_info);
};


/**
 * @export
 */
cwc.protocol.Serial.Device.prototype.disconnect = function() {
  if (this.connected && this.connectionId) {
    console.log('Disconnect serial device', this.path, '...');
    this.serial.disconnect(this.connectionId,
        this.handleDisconnect_.bind(this));
  } else {
    console.warn('Device was not connected ...');
  }
};


/**
 * @param {Object} result
 * @private
 */
cwc.protocol.Serial.Device.prototype.handleDisconnect_ = function(
    result) {
  if (result) {
    if (goog.isFunction(this.disconnectEvent)) {
      this.disconnectEvent(this.deviceId, this.connectionId);
    }
    this.connected = false;
    this.connectionId = 0;
    this.connectionInfos = {};
  } else {
    console.warn('Disconnect with connectionId', this.connectionId, 'failed!');
  }
};


/**
 * @param {ByteArray} data
 * @export
 */
cwc.protocol.Serial.Device.prototype.send = function(data) {
  if (this.connectionId && data) {
    this.serial.send(this.connectionId, data, this.handleSend_.bind(this));
  }
};


/**
 * @param {Object} send_info
 * @private
 */
cwc.protocol.Serial.Device.prototype.handleSend_ = function(
    send_info) {
  console.log(send_info);
};


/**
 * @param {ArrayBuffer} data
 * @export
 */
cwc.protocol.Serial.Device.prototype.handleData = function(data) {
  if (data && this.dataHandler) {
    this.dataHandler(data);
  }
};


/**
 * @param {string} error
 * @export
 */
cwc.protocol.Serial.Device.prototype.handleError = function(error) {
  console.log('handleError', error);
  if (error == 'device_lost') {
    this.disconnect();
  }
};

