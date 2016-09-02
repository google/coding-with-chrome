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
goog.provide('cwc.protocol.bluetooth.Device');

goog.require('cwc.protocol.bluetooth.supportedDevices');
goog.require('cwc.utils.ByteTools');



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

  /** @type {!boolean} */
  this.connecting = false;

  /** @type {!string} */
  this.device_class = device_class;

  /** @type {!string} */
  this.name = name;

  /** @type {!boolean} */
  this.paired = paired;

  /** @type {!array} */
  this.uuids = uuids;

  /** @type {!cwc.protocol.bluetooth.supportedDevices} */
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

  /** @type {!number} */
  this.connectErrors = 0;

  /** @type {!Function} */
  this.connectCallback = null;

  /** @type {!Function} */
  this.disconnectEvent = null;

  /** @type {!Function} */
  this.disconnectCallback = null;

  /** @type {!Object} */
  this.dataHandler = {};

  /** @type {!Function} */
  this.dataHandlerAll = null;

  /** @type {object} */
  this.socketProperties = {
    'persistent': false,
    'name': 'CwC Bluetooth Device',
    'bufferSize': 4096
  };
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
 * @param {Array=} opt_packet_header
 * @param {number=} opt_min_packet_size
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.setDataHandler = function(
    callback, opt_packet_header, opt_min_packet_size) {
  if (opt_packet_header) {
    var id = opt_packet_header.join('_');
    this.dataHandler[id] = {};
    this.dataHandler[id]['buffer'] = null;
    this.dataHandler[id]['callback'] = callback;
    this.dataHandler[id]['headers'] = opt_packet_header;
    this.dataHandler[id]['size'] = opt_min_packet_size || 4;
  } else {
    this.dataHandlerAll = callback;
  }
};


/**
 * @return {!boolean}
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.isConnected = function() {
  return this.connected;
};


/**
 * @return {!boolean}
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.hasSocket = function() {
  return this.socketId;
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
    if (typeof this.profile.indicator !== 'undefined') {
      return this.profile.indicator || '';
    }
  }
  return '';
};


/**
 * @return {!string}
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.getIcon = function() {
  if (this.profile) {
    if (typeof this.profile.icon !== 'undefined') {
      return this.profile.icon || '';
    }
  }
  return '';
};


/**
 * @return {!string}
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.getType = function() {
  if (this.profile) {
    if (typeof this.profile.name !== 'undefined') {
      return this.profile.name|| '';
    }
  }
  return '';
};


/**
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.getSocket = function() {
  this.bluetoothSocket.getSockets(this.handleSockets_.bind(this));
};


/**
 * @param {Function} opt_callback Will be only called  after an connection.
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.connect = function(opt_callback) {
  if (this.connecting) {
    return;
  }

  if (this.connected && this.socketId) {
    console.warn('Bluetooth device', this.address, 'is already connected',
      'to socket', this.socketId, '!');
    return;
  }

  console.log('Connecting Bluetooth device', this.address, '...');
  this.connecting = true;
  var createSocketEvent = function(create_info) {
    if (chrome.runtime.lastError) {
      console.log('Error creating socket:', chrome.runtime.lastError);
      this.connecting = false;
      return;
    }
    if (!create_info) {
      console.log('Error creating socket, no socket info:', create_info);
      this.connecting = false;
      return;
    }
    if (opt_callback) {
      this.connectCallback = opt_callback;
    }
    this.socketId = create_info['socketId'];
    console.log('Connecting socket', this.socketId, 'for', this.address,
      'with uuid', this.profile.uuid, '...');
    this.bluetoothSocket.connect(this.socketId, this.address,
        this.profile.uuid, this.handleConnect_.bind(this));
  };
  this.bluetoothSocket.create(this.socketProperties,
    createSocketEvent.bind(this));
};


/**
 * @param {boolean=} opt_force
 * @param {Function=} opt_callback
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.disconnect = function(opt_force,
    opt_callback) {
  if (this.socketId == null) {
    if (opt_force) {
      this.connecting = false;
    }
    if (opt_callback) {
      opt_callback();
    }
    return;
  }
  if (opt_callback) {
    this.disconnectCallback = opt_callback;
  }
  this.bluetoothSocket.disconnect(this.socketId,
      this.handleDisconnect_.bind(this));
};


/**
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.reset = function() {
  if (this.socketId == null) {
    return;
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
    return;
  }
  chrome.bluetoothSocket.send(this.socketId, buffer,
      this.handleSend_.bind(this));
};


/**
 * Close the socket.
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.close = function() {
  if (this.socketId == null || !this.socketId) {
    return;
  }
  this.bluetoothSocket.close(this.socketId, this.handleClose_.bind(this));
};


/**
 * Pause the socket.
 */
cwc.protocol.bluetooth.Device.prototype.paused = function() {
  if (this.connected && !this.paused) {
    chrome.bluetoothSocket.setPaused(this.socketId, true);
    this.updateInfo();
  }
};


/**
 * Unpause the socket.
 */
cwc.protocol.bluetooth.Device.prototype.unpaused = function() {
  if (this.connected && this.paused) {
    chrome.bluetoothSocket.setPaused(this.socketId, false);
    this.updateInfo();
  }
};


/**
 * Handles incomming data packets.
 * @param {ArrayBuffer} data
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.handleData = function(data) {
  if (!data) {
    return;
  }
  if (this.dataHandlerAll) {
    this.dataHandlerAll(data);
  }
  if (!this.dataHandler) {
    return;
  }

  for (let handler in this.dataHandler) {
    var dataView = cwc.utils.ByteTools.getUint8Data(data,
      this.dataHandler[handler]['headers'],
      this.dataHandler[handler]['size'],
      this.dataHandler[handler]['buffer']);
    dataView['data'].map(this.dataHandler[handler]['callback']);
    this.dataHandler[handler]['buffer'] = dataView['buffer'] || null;
  }

};


/**
 * @param {string} error
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.handleError = function(error) {
  console.log('handleError', error);
  if (error.includes('disconnected')) {
    this.close();
  }
  this.connecting = false;
};


/**
 * @param {number} socket_id
 * @private
 */
cwc.protocol.bluetooth.Device.prototype.handleClose_ = function(socket_id) {
  if (socket_id) {
    console.log('Closed socket', socket_id, '!');
  }
  this.connected = false;
  this.connecting = false;
  this.socketId = null;
};


/**
 * @param {number=} opt_bytes_sent
 * @private
 */
cwc.protocol.bluetooth.Device.prototype.handleSend_ = function(
    opt_bytes_sent) {
  if (chrome.runtime.lastError) {
    var errorMessage = chrome.runtime.lastError.message;
    if ((errorMessage.toLowerCase().includes('socket') &&
         errorMessage.toLowerCase().includes('not') &&
         errorMessage.toLowerCase().includes('connected')) ||
        (errorMessage.toLowerCase().includes('connection') &&
         errorMessage.toLowerCase().includes('aborted'))) {
      this.connected = false;
    } else {
      console.error('Socket error:', errorMessage);
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
  if (!socket_info) {
    return;
  }
  this.connected = socket_info['connected'];
  this.paused = socket_info['paused'];
  this.persistent = socket_info['persistent'];
};


/**
 * @param {object} socket_info
 * @private
 */
cwc.protocol.bluetooth.Device.prototype.handleSockets_ = function(socket_info) {
  if (!socket_info) {
    this.socketId = null;
    this.connected = false;
    return;
  }
  for (let i in socket_info) {
    var socket = socket_info[i];
    if (socket.connected && socket.address == this.address &&
        this.socketId != socket.socketId) {
      console.log('Reconnecting bluetooth device', this.address, 'to socket',
        socket.socketId);
      this.socketId = socket.socketId;
      this.paused = socket.paused;
      return;
    }
  }
};


/**
 * @param {Object=} opt_connection_info
 * @private
 */
cwc.protocol.bluetooth.Device.prototype.handleConnect_ = function(
    opt_connection_info) {
  if (chrome.runtime.lastError) {
    var errorMessage = chrome.runtime.lastError;
    console.warn('Socket connection failed:', errorMessage);
    if (errorMessage['message'].toLowerCase().includes('connection') &&
        errorMessage['message'].toLowerCase().includes('failed') ||
        errorMessage['message'].toLowerCase().includes('0x2743')) {
      this.connectErrors++;
      this.close();
    }
    this.connecting = false;
    return;
  }

  console.log('Connected to socket', this.socketId);
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
};


/**
 * @private
 */
cwc.protocol.bluetooth.Device.prototype.handleDisconnect_ = function() {
  console.warn('Disconnected from socket', this.socketId);
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
};
