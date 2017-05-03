/**
 * @fileoverview Handles the pairing and communication with USB devices.
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
goog.provide('cwc.protocol.serial.Device');


/**
 * @param {!string} path
 * @param {!number} vendor_id
 * @param {!number} product_id
 * @param {string=} optName
 * @param {chrome_serial=} opt_serial
 * @constructor
 */
cwc.protocol.serial.Device = function(path, vendor_id, product_id,
    optName, opt_serial) {
  /** @type {!chrome.serial} */
  this.serial = opt_serial || chrome.serial;

  /** @type {!string} */
  this.path = path || '';

  /** @type {!boolean} */
  this.connected = false;

  /** @type {!boolean} */
  this.connecting = false;

  /** @type {!number} */
  this.vendorId = vendor_id || 0;

  /** @type {!number} */
  this.productId = product_id || 0;

  /** @type {!string} */
  this.name = optName || '';

  /** @type {!boolean} */
  this.supportedDevice = false;

  /** @type {!Object} */
  this.connectionOptions = {};

  /** @type {!Object} */
  this.connectionInfos = {};

  /** @type {!number} */
  this.connectionId = 0;

  /** @type {!Function} */
  this.connectCallback = null;

  /** @type {!number} */
  this.connectErrors = 0;

  /** @type {!Function} */
  this.connectEvent = null;

  /** @type {!Function} */
  this.disconnectCallback = null;

  /** @type {!Function} */
  this.disconnectEvent = null;

  /** @type {!Function} */
  this.dataHandler = null;
};


/**
 * @return {!boolean}
 * @export
 */
cwc.protocol.serial.Device.prototype.isConnected = function() {
  return this.connected;
};


/**
 * @param {!boolean} supported
 * @export
 */
cwc.protocol.serial.Device.prototype.setSupported = function(supported) {
  this.supportedDevice = supported;
};


/**
 * @return {!boolean}
 * @export
 */
cwc.protocol.serial.Device.prototype.isSupported = function() {
  return this.supportedDevice;
};


/**
 * @return {!string}
 * @export
 */
cwc.protocol.serial.Device.prototype.getName = function() {
  return this.name;
};


/**
 * @param {!string} name
 * @export
 */
cwc.protocol.serial.Device.prototype.setName = function(name) {
  this.name = name;
};


/**
 * @return {!string}
 * @export
 */
cwc.protocol.serial.Device.prototype.getPath = function() {
  return this.path;
};


/**
 * @param {!Function} callback
 * @export
 */
cwc.protocol.serial.Device.prototype.setConnectEvent = function(callback) {
  this.connectEvent = callback;
};


/**
 * @param {!Function} callback
 * @export
 */
cwc.protocol.serial.Device.prototype.setDisconnectEvent = function(callback) {
  this.disconnectEvent = callback;
};


/**
 * @param {!Function} callback
 * @export
 */
cwc.protocol.serial.Device.prototype.setDataHandler = function(callback) {
  this.dataHandler = callback;
};


/**
 * @param {Function=} optCallback
 * @export
 */
cwc.protocol.serial.Device.prototype.connect = function(optCallback) {
  if (this.connected && this.connectionId) {
    console.warn('Serial device at', this.path, 'is already connected',
      'with connection id', this.connectionId, '!');
    return;
  }

  console.log('Connect serial device', this.path, '…');
  this.connectCallback = optCallback;
  this.serial.connect(this.path, this.connectionOptions,
      this.handleConnect_.bind(this));
};


/**
 * @param {boolean=} opt_force
 * @param {Function=} optCallback
 * @export
 */
cwc.protocol.serial.Device.prototype.disconnect = function(opt_force,
    optCallback) {
  if (this.connectionId == null) {
    if (opt_force) {
      this.connecting = false;
    }
    if (optCallback) {
      optCallback();
    }
    return;
  }
  if (optCallback) {
    this.disconnectCallback = optCallback;
  }
  this.serial.disconnect(this.connectionId, this.handleDisconnect_.bind(this));
};


/**
 * @export
 */
cwc.protocol.serial.Device.prototype.reset = function() {
  if (this.connectionId) {
    this.serial.flush(this.connectionId);
  }
};


/**
 * @param {!ArrayBuffer|Uint8Array} data
 * @export
 */
cwc.protocol.serial.Device.prototype.send = function(data) {
  if (this.connectionId && data) {
    this.serial.send(this.connectionId, data, this.handleSend_.bind(this));
  }
};


/**
 * @param {!string} text
 * @export
 */
cwc.protocol.serial.Device.prototype.sendText = function(text) {
  let buffer = new ArrayBuffer(text.length);
  let bufferView = new Uint8Array(buffer);
  for (let i = 0; i < text.length; i++) {
    bufferView[i] = text.charCodeAt(i);
  }
  console.log(buffer);
  this.send(buffer);
};


/**
 * @param {Object} connection_info
 * @private
 */
cwc.protocol.serial.Device.prototype.handleConnect_ = function(
    connection_info) {
  if (chrome.runtime.lastError) {
    let errorMessage = chrome.runtime.lastError;
    console.warn('Serial connection failed:', errorMessage);
    if (errorMessage['message'].toLowerCase().includes('failed')) {
      this.connectErrors++;
      this.disconnect();
    }
    this.connecting = false;
    return;
  }

  this.connectionInfos = connection_info;
  this.connectionId = connection_info['connectionId'];
  console.log('Connected to serial connection id', this.connectionId);
  this.connected = true;
  if (goog.isFunction(this.connectEvent)) {
    this.connectEvent(this.path, this.connectionId);
  }
  if (goog.isFunction(this.connectCallback)) {
    this.connectCallback(this.path, this.connectionId);
    this.connectCallback = null;
  }
  console.log(connection_info);
};


/**
 * @param {Object} result
 * @private
 */
cwc.protocol.serial.Device.prototype.handleDisconnect_ = function(result) {
  if (result) {
    if (goog.isFunction(this.disconnectEvent)) {
      this.disconnectEvent(this.path, this.connectionId);
    }
    if (goog.isFunction(this.disconnectCallback)) {
      this.disconnectCallback(this.path, this.connectionId);
      this.disconnectCallback = null;
    }
    console.log('Disconnected from serial connection id', this.connectionId);
    this.connected = false;
    this.connectionId = 0;
    this.connectionInfos = {};
  } else {
    console.warn('Disconnect from connectionId', this.connectionId, 'failed!');
  }
};


/**
 * @param {Object} send_info
 * @private
 */
cwc.protocol.serial.Device.prototype.handleSend_ = function(send_info) {
  if (chrome.runtime.lastError) {
    let errorMessage = chrome.runtime.lastError.message;
    if ((errorMessage.toLowerCase().includes('socket') &&
         errorMessage.toLowerCase().includes('not') &&
         errorMessage.toLowerCase().includes('connected')) ||
        (errorMessage.toLowerCase().includes('connection') &&
         errorMessage.toLowerCase().includes('aborted'))) {
      this.connected = false;
    } else {
      console.error('Serial error:', errorMessage);
    }
  } else if (send_info && send_info['error']) {
    if (send_info['error'] == 'pending') {
      console.warn('Serial connection pending data ...');
    } else {
      console.error('Serial error:', send_info['error']);
    }
  }
};


/**
 * @param {ArrayBuffer} data
 * @export
 */
cwc.protocol.serial.Device.prototype.handleData = function(data) {
  if (!data) {
    return;
  }
  if (!this.dataHandler) {
    return;
  }

  this.dataHandler(data);
};


/**
 * @param {string} error
 * @export
 */
cwc.protocol.serial.Device.prototype.handleError = function(error) {
  console.log('handleError', error);
  if (error == 'device_lost') {
    this.disconnect();
  }
};
