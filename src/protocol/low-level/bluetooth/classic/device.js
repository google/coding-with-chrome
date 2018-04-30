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
goog.provide('cwc.protocol.bluetooth.classic.Device');

goog.require('cwc.protocol.bluetooth.classic.supportedDevices');
goog.require('cwc.protocol.default.Device');
goog.require('cwc.utils.ByteTools');


/**
 * @constructor
 * @extends {cwc.protocol.default.Device}
 */
cwc.protocol.bluetooth.classic.Device = function() {
  /** @type {!boolean} */
  this.connecting = false;

  /** @type {number|null} */
  this.socketId = null;

  /** @type {!Object} */
  this.connectionInfos = {};

  /** @type {!Function|null} */
  this.connectEvent = null;

  /** @type {!Function|null} */
  this.connectCallback = null;

  /** @type {!Function|null} */
  this.disconnectEvent = null;

  /** @type {!Function|null} */
  this.disconnectCallback = null;

  /** @type {Object} */
  this.socketProperties = {
    'persistent': false,
    'name': 'CwC Bluetooth Device',
    'bufferSize': 4096,
  };

  /** @private {!boolean} */
  this.paused_ = false;
};
goog.inherits(
  cwc.protocol.bluetooth.classic.Device, cwc.protocol.default.Device);


/**
 * @param {!Function} callback
 * @return {THIS}
 * @template THIS
 */
cwc.protocol.bluetooth.classic.Device.prototype.setConnectEvent = function(
    callback) {
  this.connectEvent = callback;
  return this;
};


/**
 * @param {!Function} callback
 * @return {THIS}
 * @template THIS
 */
cwc.protocol.bluetooth.classic.Device.prototype.setDisconnectEvent = function(
    callback) {
  this.disconnectEvent = callback;
  return this;
};


/**
 * @return {!boolean}
 */
cwc.protocol.bluetooth.classic.Device.prototype.hasSocket = function() {
  return this.socketId === null ? false : true;
};


/**
 * @return {!string}
 */
cwc.protocol.bluetooth.classic.Device.prototype.getNamePrefix = function() {
  if (this.profile) {
    if (typeof this.profile.namePrefix !== 'undefined') {
      return this.profile.namePrefix || '';
    }
  }
  return '';
};


cwc.protocol.bluetooth.classic.Device.prototype.getSocket = function() {
  chrome.bluetoothSocket.getSockets(this.handleSockets_.bind(this));
};


/**
 * @param {Function=} callback Will be only called  after an connection.
 */
cwc.protocol.bluetooth.classic.Device.prototype.connect = function(callback) {
  if (this.connecting) {
    return;
  }

  if (this.connected && this.socketId) {
    this.log.warn('Already connected to socket', this.socketId);
    return;
  }

  this.log.info('Connecting ...');
  this.connecting = true;
  let createSocketEvent = function(create_info) {
    if (chrome.runtime.lastError) {
      this.log.info('Error creating socket:', chrome.runtime.lastError);
      this.connecting = false;
      return;
    }
    if (!create_info) {
      this.log.info('Error creating socket, no socket info:', create_info);
      this.connecting = false;
      return;
    }
    if (callback) {
      this.connectCallback = callback;
    }
    this.socketId = create_info['socketId'];
    this.log.info('Connecting socket', this.socketId, 'with uuid',
      this.profile.uuid, '...');
    chrome.bluetoothSocket.connect(this.socketId, this.address,
        this.profile.uuid, this.handleConnect_.bind(this));
  };
  chrome.bluetoothSocket.create(this.socketProperties,
    createSocketEvent.bind(this));
};


/**
 * @param {boolean=} force
 * @param {Function=} callback
 */
cwc.protocol.bluetooth.classic.Device.prototype.disconnect = function(force,
    callback) {
  if (this.socketId == null) {
    if (force) {
      this.connecting = false;
    }
    if (callback) {
      callback();
    }
    return;
  }
  if (callback) {
    this.disconnectCallback = callback;
  }
  chrome.bluetoothSocket.disconnect(this.socketId,
      this.handleDisconnect_.bind(this));
};


/**
 * Dummy reset function.
 */
cwc.protocol.bluetooth.classic.Device.prototype.reset = function() {
  if (this.socketId == null) {
    return;
  }
};


/**
 * Updates the socket informations.
 */
cwc.protocol.bluetooth.classic.Device.prototype.updateInfo = function() {
  if (this.socketId == null) {
    return;
  }
  chrome.bluetoothSocket.getInfo(this.socketId,
    this.handleSocketInfo_.bind(this));
};


/**
 * Sends the buffer to the socket.
 * @param {!Array<ArrayBuffer>|ArrayBuffer} buffer
 */
cwc.protocol.bluetooth.classic.Device.prototype.send = function(buffer) {
  if (this.socketId == null) {
    return;
  }
  if (Array.isArray(buffer)) {
    for (let i = 0, len = buffer.length; i < len; ++i) {
      chrome.bluetoothSocket.send(this.socketId, buffer[i],
        this.handleSend_.bind(this));
    }
  } else {
    chrome.bluetoothSocket.send(this.socketId, buffer,
      this.handleSend_.bind(this));
  }
};


/**
 * Close the socket.
 */
cwc.protocol.bluetooth.classic.Device.prototype.close = function() {
  if (this.socketId == null || !this.socketId) {
    return;
  }
  chrome.bluetoothSocket.close(this.socketId, this.handleClose_.bind(this));
};


/**
 * Pause the socket.
 */
cwc.protocol.bluetooth.classic.Device.prototype.paused = function() {
  if (this.connected && !this.paused_) {
    chrome.bluetoothSocket.setPaused(this.socketId, true);
    this.updateInfo();
  }
};


/**
 * Unpause the socket.
 */
cwc.protocol.bluetooth.classic.Device.prototype.unpaused = function() {
  if (this.connected && this.paused_) {
    chrome.bluetoothSocket.setPaused(this.socketId, false);
    this.updateInfo();
  }
};


/**
 * Handles incoming data packets.
 * @param {ArrayBuffer} data
 */
cwc.protocol.bluetooth.classic.Device.prototype.handleData = function(data) {
  if (!data) {
    return;
  }
  this.eventHandler.dispatchEvent(
    cwc.protocol.bluetooth.classic.Events.onReceive(data));
};


/**
 * @param {string} error
 */
cwc.protocol.bluetooth.classic.Device.prototype.handleError = function(error) {
  this.log.info('handleError', error);
  if (error.includes('disconnected') || error.includes('system_error')) {
    this.close();
    this.handleDisconnect_();
  }
  this.connecting = false;
};


/**
 * @param {number=} socket_id
 * @private
 */
cwc.protocol.bluetooth.classic.Device.prototype.handleClose_ = function(
    socket_id) {
  if (socket_id) {
    this.log.info('Closed socket', socket_id, '!');
  }
  this.connected = false;
  this.connecting = false;
  this.socketId = null;
};


/**
 * @param {number=} opt_bytes_sent
 * @private
 */
cwc.protocol.bluetooth.classic.Device.prototype.handleSend_ = function(
    opt_bytes_sent) {
  if (chrome.runtime.lastError) {
    let errorMessage = chrome.runtime.lastError.message;
    if ((errorMessage.toLowerCase().includes('socket') &&
         errorMessage.toLowerCase().includes('not') &&
         errorMessage.toLowerCase().includes('connected')) ||
        (errorMessage.toLowerCase().includes('connection') &&
         errorMessage.toLowerCase().includes('aborted'))) {
      this.connected = false;
    } else {
      this.log.error('Socket error:', errorMessage);
      this.updateInfo();
    }
  }
};


/**
 * @param {Object} socket_info
 * @private
 */
cwc.protocol.bluetooth.classic.Device.prototype.handleSocketInfo_ = function(
    socket_info) {
  if (chrome.runtime.lastError) {
    let errorMessage = chrome.runtime.lastError;
    if (errorMessage['message'].toLowerCase().includes('socket not found')) {
      this.handleClose_();
    } else {
      this.log.error('Socket Info error', errorMessage);
    }
    return;
  }
  if (!socket_info) {
    return;
  }
  this.connected = socket_info['connected'];
  this.paused_ = socket_info['paused'];
};


/**
 * @param {Object} socket_info
 * @private
 */
cwc.protocol.bluetooth.classic.Device.prototype.handleSockets_ = function(
    socket_info) {
  if (!socket_info) {
    this.socketId = null;
    this.connected = false;
    return;
  }
  for (let i in socket_info) {
    if (Object.prototype.hasOwnProperty.call(socket_info, i)) {
      let socket = socket_info[i];
      if (socket.connected && socket.address == this.address &&
          this.socketId != socket.socketId) {
        this.log.info('Reconnecting to socket', socket.socketId);
        this.socketId = socket.socketId;
        this.paused_ = socket.paused;
        return;
      }
    }
  }
};


/**
 * @param {Object=} opt_connection_info
 * @private
 */
cwc.protocol.bluetooth.classic.Device.prototype.handleConnect_ = function(
    opt_connection_info) {
  if (chrome.runtime.lastError) {
    let errorMessage = chrome.runtime.lastError;
    this.log.warn('Socket connection failed:', errorMessage);
    if (errorMessage['message'].toLowerCase().includes('connection') &&
        errorMessage['message'].toLowerCase().includes('failed') ||
        errorMessage['message'].toLowerCase().includes('0x2743')) {
      this.close();
    }
    this.connecting = false;
    return;
  }

  this.log.info('Connected to socket', this.socketId);
  this.connected = true;
  this.updateInfo();
  if (goog.isFunction(this.connectEvent)) {
    this.connectEvent(this.socketId, this.address);
  }
  if (goog.isFunction(this.connectCallback)) {
    this.connectCallback(this.socketId, this.address);
    this.connectCallback = null;
  }
  this.connecting = false;
  this.eventHandler.dispatchEvent(
    cwc.protocol.bluetooth.classic.Events.deviceState({connected: true}));
};


/**
 * @private
 */
cwc.protocol.bluetooth.classic.Device.prototype.handleDisconnect_ = function() {
  this.log.warn('Disconnected from socket', this.socketId);
  this.connected = false;
  this.updateInfo();
  this.reset();
  if (goog.isFunction(this.disconnectEvent)) {
    this.disconnectEvent(this.socketId, this.address);
  }
  if (goog.isFunction(this.disconnectCallback)) {
    this.disconnectCallback(this.socketId, this.address);
    this.disconnectCallback = null;
  }
  this.connecting = false;
  this.eventHandler.dispatchEvent(
    cwc.protocol.bluetooth.classic.Events.deviceState({connected: false}));
};
