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

  /** @type {!number} */
  this.connectErrors = 0;

  /** @type {!Function} */
  this.connectCallback = null;

  /** @type {!Function} */
  this.disconnectEvent = null;

  /** @type {!Object} */
  this.dataHandler = {};

  /** @type {!Function} */
  this.dataHandlerAll = null;

  /** @type {number} */
  this.senderStackInterval = 50;

  /** @type {!cwc.utils.StackQueue} */
  this.senderStack = new cwc.utils.StackQueue(
      this.senderStackInterval);

  /** @type {object} */
  this.socketProperties = {
    persistent: false,
    name: 'CwC bluetooth device',
    bufferSize: 8192
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
    this.dataHandler[id]['callback'] = callback;
    this.dataHandler[id]['headers'] = opt_packet_header;
    this.dataHandler[id]['size'] = opt_min_packet_size || 4;
    this.dataHandler[id]['buffer'] = null;
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
    if ('indicator' in this.profile) {
      return this.profile.indicator || '';
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
    console.log('Connecting socket', create_info.socketId, 'for',
      this.address, '...');
    this.socketId = create_info.socketId;
    this.bluetoothSocket.connect(this.socketId, this.address,
        this.profile.uuid, this.handleConnect_.bind(this));
  };
  this.bluetoothSocket.create(this.socketProperties,
    createSocketEvent.bind(this));
};


/**
 * @param {boolean=} opt_force
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.disconnect = function(opt_force) {
  if (this.socketId == null) {
    if (opt_force) {
      this.connecting = false;
    }
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
    this.senderStack.clear();
  }.bind(this);
  if (opt_delay) {
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
  this.senderStack.addCommand(stackCall.bind(this));
  this.senderStack.addDelay(delay);
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
  if (!data) {
    return;
  }
  if (this.dataHandlerAll) {
    this.dataHandlerAll(data);
  }
  if (!this.dataHandler) {
    return;
  }
  var dataView = new Uint8Array(data);
  for (var handler in this.dataHandler) {
    var buffer = this.dataHandler[handler]['buffer'];
    var foundHeader = false;
    var packetHeaders = this.dataHandler[handler]['headers'];
    var headerPosition = 0;
    if (packetHeaders instanceof Array) {
      if (dataView.indexOf(packetHeaders[0]) + 1 ===
          dataView.indexOf(packetHeaders[1],
              dataView.indexOf(packetHeaders[0]) + 1)) {
        foundHeader = true;
        headerPosition = dataView.indexOf(packetHeaders[0]);
      }
    } else if (dataView.indexOf(packetHeaders) !== -1) {
      foundHeader = true;
      headerPosition = dataView.indexOf(packetHeaders);
    }

    if (foundHeader) {
      if (headerPosition !== 0) {
        dataView = dataView.slice(headerPosition);
      }
      this.dataHandler[handler]['buffer'] = dataView;
    } else if (buffer) {
      var dataFragments = new Uint8Array(buffer.length + dataView.length);
      dataFragments.set(buffer, 0);
      dataFragments.set(dataView, buffer.length);
      this.dataHandler[handler]['buffer'] = dataView;
      dataView = dataFragments;
    }
    var packetSize = this.dataHandler[handler]['size'];
    if (dataView.length >= packetSize) {
      this.dataHandler[handler]['callback'](dataView);
    }
  }
};


/**
 * @param {string} error
 * @export
 */
cwc.protocol.bluetooth.Device.prototype.handleError = function(error) {
  console.log('handleError', error);
  if (error.indexOf('disconnected') != -1) {
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
    if ((errorMessage.toLowerCase().indexOf('socket') !== -1 &&
         errorMessage.toLowerCase().indexOf('not') !== -1 &&
         errorMessage.toLowerCase().indexOf('connected') !== -1) ||
        (errorMessage.toLowerCase().indexOf('connection') !== -1 &&
         errorMessage.toLowerCase().indexOf('aborted') !== -1)) {
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
  this.connected = socket_info.connected;
  this.paused = socket_info.paused;
  this.persistent = socket_info.persistent;
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
  for (var i in socket_info) {
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
    if (errorMessage.message.toLowerCase().indexOf('connection') !== -1 &&
        errorMessage.message.toLowerCase().indexOf('failed') !== -1 ||
        errorMessage.message.toLowerCase().indexOf('0x2743')) {
      this.connectErrors++;
      this.close();
    }
    this.connecting = false;
    return;
  }

  console.log('Connected to socket', this.socketId);
  this.connected = true;
  this.connecting = false;
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
  console.warn('Disconnected from socket', this.socketId);
  this.connected = false;
  this.connecting = false;
  this.connectCallback = null;
  this.updateInfo();
  this.reset();
  if (goog.isFunction(this.disconnectEvent)) {
    this.disconnectEvent(this.socketId, this.address);
  }
};
