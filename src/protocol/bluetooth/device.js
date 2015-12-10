/**
 * @fileoverview Handles the pairing and communication with Bluetooth devices.
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
goog.provide('cwc.protocol.bluetooth.Device');

goog.require('cwc.protocol.bluetooth.supportedDevices');
goog.require('cwc.utils.StackQueue');



/**
 * @param {!string} address
 * @param {!boolean} connected
 * @param {!number} device_class
 * @param {!string} name
 * @param {!boolean} paired
 * @param {!array} uuids
 * @param {!cwc.protocol.bluetooth.supportedDevices} profile
 * @param {string=} opt_type
 * @param {chrome_bluetooth=} opt_bluetooth
 * @constructor
 */
cwc.protocol.bluetooth.Device = function(address, connected, device_class,
    name, paired, uuids, profile, opt_type, opt_bluetooth) {

  /** @type {!string} */
  this.address = address;

  /** @type {!boolean} */
  this.connected = connected;

  /** @type {!string} */
  this.device_class = device_class;

  /** @type {!string} */
  this.name = name;

  /** @type {!boolean} */
  this.paired = paired;

  /** @type {!array} */
  this.uuids = uuids;

  /** @type {!cwc.protocol.bluetooth.supportedDevices2} */
  this.profile = profile;

  /** @type {!string} */
  this.type = opt_type || '';

  /** @type {!chrome.bluetooth} */
  this.bluetooth = opt_bluetooth || chrome.bluetooth;

  /** @type {!chrome.bluetoothSocket} */
  this.bluetoothSocket = chrome.bluetoothSocket;

  /** @type {boolean} */
  this.paused = false;

  /** @type {number} */
  this.socketId = null;

  /** @type {string} */
  this.rssi = '';

  /** @type {!Object} */
  this.connectionInfos = {};

  /** @type {!Function} */
  this.connectEvent = null;

  /** @type {!Function} */
  this.connectCallback = null;

  /** @type {!Function} */
  this.disconnectEvent = null;

  /** @type {!Function} */
  this.dataHandler = null;

  /** @type {number} */
  this.senderStackInterval = 90;

  /** @type {!cwc.utils.StackQueue} */
  this.senderStack = new cwc.utils.StackQueue(
      this.senderStackInterval);
};


/**
 * @param {!Function} callback
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.setConnectEvent = function(
    callback) {
  this.connectEvent = callback;
};


/**
 * @param {!Function} callback
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.setDisconnectEvent = function(
    callback) {
  this.disconnectEvent = callback;
};


/**
 * @param {!Function} callback
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.setDataHandler = function(
    callback) {
  this.dataHandler = callback;
};


/**
 * @return {!boolean}
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.isConnected = function() {
  return this.connected;
};


/**
 * @return {!string}
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.getAddress = function() {
  return (this.address || '');
};


/**
 * @return {!string}
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.getName = function() {
  return (this.name || '');
};


/**
 * @return {!string}
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.getRSSI = function() {
  return (this.rssi || '');
};


/**
 * @return {!string}
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.getIndicator = function() {
  if (this.profile) {
    if ('indicator' in this.profile) {
      return this.profile.indicator || '';
    }
  }
  return '';
};


/**
 * @param {function=} opt_callback Will be only called  after an connection.
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.connect = function(opt_callback) {
  console.log('Connecting bluetooth device', this.address, '…');

  if (this.connected) {
    console.warn('Bluetooth socket is already connected!');
    return;
  }

  var createSocketEvent = function(create_info) {
    if (chrome.runtime.lastError) {
      console.log('Error creating socket:', chrome.runtime.lastError);
      return;
    }
    if (!create_info) {
      console.log('Error creating socket, no socket info:', create_info);
      return;
    }
    if (opt_callback) {
      this.connectCallback = opt_callback;
    }
    this.socketId = create_info.socketId;
    this.bluetoothSocket.connect(this.socketId, this.address,
        this.profile.uuid, this.handleConnect_.bind(this));
  };
  this.bluetoothSocket.create(createSocketEvent.bind(this));
};


/**
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.disconnect = function() {
  if (this.socketId == null) {
    return;
  }
  this.bluetoothSocket.disconnect(this.socketId,
      this.handleDisconnect_.bind(this));
};


/**
 * @export
 * @param {boolean=} opt_delay
 */
cwc.protocol.bluetooth.Device.prototype.reset = function(opt_delay) {
  if (this.socketId == null) {
    return;
  }
  var stackCall = function() {
    if (this.senderStack) {
      this.senderStack.clear();
    }
  }.bind(this);
  if (opt_delay) {
    this.senderStack.startTimer();
    this.senderStack.addDelay(opt_delay);
    this.senderStack.addCommand(stackCall);
  } else {
    stackCall();
  }
};


/**
 * Updates the socket informations.
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.updateInfo = function() {
  if (this.socketId == null) {
    return;
  }
  this.bluetoothSocket.getInfo(this.socketId,
      this.handleSocketInfo_.bind(this));
};


/**
 * Sends the buffer to the socket.
 * @param {!Array|ArrayBuffer|Uint8Array} buffer
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.send = function(buffer) {
  if (this.socketId == null) {
    console.error('Socket', this.socketId, 'is not ready!');
    return;
  }
  chrome.bluetoothSocket.send(this.socketId, buffer,
      this.handleSend_.bind(this));
};


/**
 * Sends the buffer delayed to the socket.
 * @param {!Array|ArrayBuffer|Uint8Array} buffer
 * @param {!number} delay
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.sendDelayed = function(buffer, delay) {
  var stackCall = function() {
    this.send(buffer);
  };
  this.senderStack.startTimer();
  this.senderStack.addCommand(stackCall.bind(this));
  this.senderStack.addDelay(delay);
};


/**
 * Close the socket.
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.close = function() {
  if (this.socketId == null) {
    return;
  }
  this.bluetoothSocket.close(this.socketId, this.handleClose.bind(this));
  this.senderStack.stopTimer();
  this.senderStack.clear();
};


/**
 * Pause the socket.
 */
cwc.protocol.bluetooth.Device.prototype.paused = function() {
  if (this.connected && !this.paused) {
    chrome.bluetoothSocket.setPaused(this.socketId, true);
    this.updateInfo();
  }
  this.stopSenderStack();
};


/**
 * Unpause the socket.
 */
cwc.protocol.bluetooth.Device.prototype.unpaused = function() {
  if (this.connected && this.paused) {
    chrome.bluetoothSocket.setPaused(this.socketId, false);
    this.updateInfo();
  }
  this.startSenderStack();
};


/**
 * @param {ArrayBuffer} data
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.handleData = function(data) {
  if (data && this.dataHandler) {
    this.dataHandler(data);
  }
};


/**
 * @param {string} error
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.handleError = function(error) {
  console.log('handleError', error);
  if (error.indexOf('disconnected') != -1) {
    this.disconnect();
  }
};


/**
 * @param {number} socket_id
 * @private
 */
cwc.protocol.bluetooth.Device.prototype.handleClose_ = function(socket_id) {
  console.log('Closed socket', socket_id, '!');
  this.connected = false;
  this.socketId = null;
};


/**
 * @param {number=} opt_bytes_sent
 * @private
 */
cwc.protocol.bluetooth.Device.prototype.handleSend_ = function(
    opt_bytes_sent) {
  if (chrome.runtime.lastError) {
    if (chrome.runtime.lastError.message == 'The socket is not connected') {
      this.connected = false;
    } else {
      console.error('Socket error:', chrome.runtime.lastError);
      this.updateInfo();
    }
  }
};


/**
 * @param {object} socket_info
 * @private
 */
cwc.protocol.bluetooth.Device.prototype.handleSocketInfo_ = function(
    socket_info) {
  this.connected = socket_info.connected;
  this.paused = socket_info.paused;
  this.persistent = socket_info.persistent;
};


/**
 * @param {Object=} opt_connection_info
 * @private
 */
cwc.protocol.bluetooth.Device.prototype.handleConnect_ = function(
    opt_connection_info) {
  if (chrome.runtime.lastError) {
    console.log('Socket connection failed:', chrome.runtime.lastError);
    return;
  }

  console.log('Connected to socket', this.socketId);
  this.connected = true;
  this.updateInfo();
  this.senderStack.setTimer();
  if (goog.isFunction(this.connectEvent)) {
    this.connectEvent(this.socketId, this.address);
  }
  if (goog.isFunction(this.connectCallback)) {
    this.connectCallback(this.socketId, this.address);
    this.connectCallback = null;
  }
};


/**
 * @private
 */
cwc.protocol.bluetooth.Device.prototype.handleDisconnect_ = function() {
  console.log('Disconnect from socket', this.socketId);
  this.connected = false;
  this.connectCallback = null;
  this.updateInfo();
  this.senderStack.stopTimer();
  this.senderStack.clear();
  if (goog.isFunction(this.disconnectEvent)) {
    this.disconnectEvent(this.socketId, this.address);
  }
};
