/**
 * @fileoverview Handels the pairing and communication with Bluetooth devices.
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
goog.provide('cwc.protocol.bluetooth.Api');

goog.require('cwc.protocol.bluetooth.Adapter');
goog.require('cwc.protocol.bluetooth.Device');
goog.require('cwc.protocol.bluetooth.supportedDevices');

goog.require('cwc.utils.Helper');
goog.require('cwc.utils.StackQueue');
goog.require('goog.Timer');
goog.require('goog.async.Throttle');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.bluetooth.Api = function(helper) {
  /** @type {string} */
  this.name = 'Bluetooth';

  /** @type {Object} */
  this.checksum = {};

  /** @type {boolean} */
  this.enabled = false;

  /** @type {Object} */
  this.supportedDevice = {};

  /** @type {Object} */
  this.sockets = {};

  /** @type {Object} */
  this.profiles = {};

  /** @type {boolean} */
  this.prepared = false;

  /** @type {chrome.bluetooth} */
  this.bluetooth = chrome.bluetooth;

  /** @type {chrome.bluetoothSocket} */
  this.bluetoothSocket = chrome.bluetoothSocket;

  /** @type {!cwc.utils.StackQueue} */
  this.receiverStack = new cwc.utils.StackQueue();

  /** @type {Object} */
  this.receiverHandler = {};

  /** @type {number} */
  this.senderStackInterval = 100;

  /** @type {!cwc.utils.StackQueue} */
  this.senderStack = new cwc.utils.StackQueue(
      this.senderStackInterval);

  /** @type {goog.Timer} */
  this.timerDevice = null;

  /** @type {!number} */
  this.timerDeviceInterval = 9000;

  /** @type {goog.async.Throttle} */
  this.throttledCheckDevices = null;

  /** @type {!number} */
  this.checkDevicesInterval = 1000;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;
};


/**
 * Prepares the bluetooth api and monitors Bluetooth adapter.
 */
cwc.protocol.bluetooth.Api.prototype.prepare = function() {
  if (this.bluetooth && !this.prepared) {
    console.log('Prepare Bluetooth support ...');
    this.closeSockets();
    this.throttledCheckDevices = new goog.async.Throttle(
        this.checkDevices.bind(this), this.checkDevicesInterval);
    this.addEventListener();
    this.senderStack.setTimer();
    this.senderStack.startTimer();
    this.prepared = true;
    chrome.bluetooth.getAdapterState(this.checkBluetooth.bind(this));
  }
};


/**
 * Checks if Bluetooth is available and ready to use.
 * @param {cwc.protocol.bluetooth.Adapter} adapter
 */
cwc.protocol.bluetooth.Api.prototype.checkBluetooth = function(
    adapter) {
  if (!this.enabled && adapter && adapter.available && adapter.powered) {
    console.log('Enable Bluetooth support ...');
    if (!this.timerDevice) {
      this.timerDevice = new goog.Timer(this.timerDeviceInterval);
      goog.events.listen(this.timerDevice, goog.Timer.TICK,
          this.checkDevices.bind(this));
    }
    this.enabled = true;
    this.timerDevice.start();
    this.throttledCheckDevices.fire();
  } else if (!adapter || !adapter.available || !adapter.powered) {
    console.log('Disable Bluetooth support!');
    if (this.timerDevice) {
      this.timerDevice.stop();
    }
    this.enabled = false;
  }
  var menubarInstance = this.helper.getInstance('menubar');
  if (menubarInstance) {
    menubarInstance.setBluetoothEnabled(this.enabled);
  }
};


/**
 * Gets the list of available devices and checks if they are supported.
 */
cwc.protocol.bluetooth.Api.prototype.checkDevices = function() {
  this.bluetooth.getDevices(this.getDevices.bind(this));
};


/**
 * Connects the provided device with the selected profile.
 * @param {cwc.protocol.bluetooth.Device} device
 * @param {Object} profile
 * @export
 */
cwc.protocol.bluetooth.Api.prototype.connectDevice = function(device,
    profile) {
  this.connectSocket(device.name, device, profile, function(event) {
    if (chrome.runtime.lastError) {
      console.log('Connection error: ' + chrome.runtime.lastError.message);
    }
  });
};


/**
 * Closes all existing sockets.
 */
cwc.protocol.bluetooth.Api.prototype.closeSockets = function() {
  console.log('Close all existing sockets from the application ...');
  var handleSockets = function(sockets) {
    for (var i = 0; i < sockets.length; i++) {
      var socket = sockets[i];
      this.closeSocket(socket.socketId);
    }
  };
  this.bluetoothSocket.getSockets(handleSockets.bind(this));
};


/**
 * @param {!number} socket_id
 */
cwc.protocol.bluetooth.Api.prototype.closeSocket = function(
    socket_id) {
  var closedSocket = function() {
    console.log('Closed socket with id ', socket_id, '!');
  };
  this.bluetoothSocket.close(socket_id, closedSocket.bind(this));
};


/**
 * @param {Object.<cwc.protocol.bluetooth.Device>} devices
 */
cwc.protocol.bluetooth.Api.prototype.getDevices = function(devices) {
  var supportedDevices = cwc.protocol.bluetooth.supportedDevices;
  var menubarInstance = this.helper.getInstance('menubar');
  var deviceConnected = false;
  for (var i = 0; i < devices.length; i++) {
    var device = devices[i];
    var name = device.name;
    var checksum = JSON.stringify(device);
    if (this.checksum[name] != checksum) {
      var paired = device.paired;
      var address = device.address;
      var deviceClass = device.deviceClass;
      var connected = device.connected;
      if (paired &&
          deviceClass in supportedDevices &&
          name in supportedDevices[deviceClass]) {
        console.log('Found supported Bluetooth device', device);
        var socket = 0;
        var profile = supportedDevices[deviceClass][name]['profile'];
        if (connected && paired) {
          socket = this.getConnection(name);
          this.supportedDevice[name] = {
            'device': device,
            'profile': profile
          };
          deviceConnected = true;
        }
        if (menubarInstance) {
          menubarInstance.updateDeviceList(device, profile, socket);
        }
      } else {
        console.log('Unsupported Bluetooth device', device);
      }
      this.checksum[name] = checksum;
    }
  }
  if (menubarInstance) {
    menubarInstance.setBluetoothConnected(deviceConnected);
  }
};


/**
 * Gets a supported device by name.
 * @param {string} name
 * @return {cwc.protocol.bluetooth.Device}
 * @export
 */
cwc.protocol.bluetooth.Api.prototype.getSupportedDevice = function(
    name) {
  if (name in this.supportedDevice) {
    return this.supportedDevice[name];
  }
  return null;
};


/**
 * Creates an new Socket for the given name, device and profile.
 * @param {!string} name
 * @param {cwc.protocol.bluetooth.Device} device
 * @param {Object} profile
 * @param {function(string, string)=} opt_callback
 * @export
 */
cwc.protocol.bluetooth.Api.prototype.connectSocket = function(name,
    device, profile, opt_callback) {
  console.log('Trying to connect to ', name, device, profile, ' ...');
  if (name in this.sockets) {
    if (this.sockets[name].connected) {
      console.warn('Bluetooth socket with name', name, 'is already connected!');
      if (goog.isFunction(opt_callback)) {
        opt_callback(this.sockets[name].socketId, name);
      }
      return;
    }
  }
  var socketConnected = function(socket_id, socket_name) {
    if (chrome.runtime.lastError) {
      console.log('Error connecting to socket', socket_id, ':',
          chrome.runtime.lastError);
    } else {
      this.helper.showInfo('Connected to Bluetooth device ' +
          socket_name || socket_id);
      chrome.bluetoothSocket.setPaused(socket_id, false);
      if (goog.isFunction(opt_callback)) {
        opt_callback(socket_id, socket_name);
      }
    }
    this.updateSocketInfo(socket_name);
  };
  var socketConnectedEvent = socketConnected.bind(this);
  var connectingSocket = function(socket_id, socket_name) {
    var address = device['address'];
    var uuid = profile['uuid'];
    console.log('Connecting to socket', socket_id, '(', socket_name,
        ') with address', address, ' and uuid', uuid, '...');
    this.bluetoothSocket.connect(socket_id, address, uuid, function() {
      socketConnectedEvent(socket_id, socket_name);
    });
  };
  this.createSocket(name, connectingSocket.bind(this));
};


/**
 * Creates an new Socket for the given name, device and profile.
 * @param {!string} socket_name
 * @export
 */
cwc.protocol.bluetooth.Api.prototype.disconnectSocket = function(
    socket_name) {
  var socketId = this.getConnection(socket_name);
  if (!socketId) {
    return;
  }
  var socketDisconnected = function() {
    console.log('Socket', socket_name, 'with id', socketId,
        ' is disconnected!');
    this.updateSocketInfo(socket_name);
  };
  if (socketId) {
    this.bluetoothSocket.disconnect(socketId, socketDisconnected.bind(this));
  }
};


/**
 * @param {!string} name
 * @param {function(string, string)=} opt_callback
 * @export
 */
cwc.protocol.bluetooth.Api.prototype.createSocket = function(name,
    opt_callback) {
  console.log('Try to create socket', name);
  if (name in this.sockets) {
    console.info('Bluetooth socket with name', name, 'already exists.');
    if (goog.isFunction(opt_callback)) {
      opt_callback(this.sockets[name].socketId, name);
    }
    return;
  }
  var handleSocketCreation = function(create_info) {
    if (chrome.runtime.lastError) {
      console.log('Error creating socket', name, ':',
          chrome.runtime.lastError);
    }
    if (!create_info) {
      console.log('Error creating socket, no socket info for ', name, ':',
          create_info);
    }
    console.info('Created Bluetooth socket', create_info.socketId,
        ' with name', name);
    this.sockets[name] = create_info;
    var socketId = create_info.socketId;
    if (goog.isFunction(opt_callback)) {
      opt_callback(this.sockets[name].socketId, name);
    }
  };
  var socketProperties = {
    'name': name,
    'persistent': false
  };
  this.bluetoothSocket.create(socketProperties,
      handleSocketCreation.bind(this));
};


/**
 * Updates the socket information for the specific socket name.
 * @param {!string} name
 * @export
 */
cwc.protocol.bluetooth.Api.prototype.updateSocketInfo = function(
    name) {
  if (!(name in this.sockets)) {
    console.error('Socket name', name, 'is unknown!');
    return;
  }
  var socketId = this.sockets[name].socketId;
  var updateSocketInformation = function(socket_info) {
    console.log('Socket Information for', name, ':', socket_info);
    this.sockets[name] = socket_info;
  };

  this.bluetoothSocket.getInfo(socketId, updateSocketInformation.bind(this));
};


/**
 * @param {!string} name
 * @param {boolean=} opt_quiet
 * @return {number}
 * @export
 */
cwc.protocol.bluetooth.Api.prototype.getConnection = function(name,
    opt_quiet) {
  if (!(name in this.sockets)) {
    if (!opt_quiet) {
      console.error('Connection name', name, 'is unknown!');
    }
    return 0;
  }

  if (!this.sockets[name].connected) {
    if (!opt_quiet) {
      console.error('Bluetooth socket with name', name, 'is not connected!');
    }
    return 0;
  }

  return this.sockets[name].socketId;
};


/**
 * @return {cwc.utils.StackQueue}
 * @export
 */
cwc.protocol.bluetooth.Api.prototype.getReceiverStack = function() {
  console.log('getReceiverStack');
  return this.receiverStack;
};


/**
 * Clears Sender Stack.
 * @param {!string} name
 */
cwc.protocol.bluetooth.Api.prototype.clearSenderStack = function(
    name) {
  this.senderStack.clear();
};


/**
 * Sends the buffer to the named connection.
 * @param {!string} name
 * @param {!ArrayBuffer} buffer
 * @param {function(?)=} opt_callback The callback will be used to receive data,
 *     it will not get called when no data are received.
 * @export
 */
cwc.protocol.bluetooth.Api.prototype.send = function(name, buffer,
    opt_callback) {
  var socketId = this.getConnection(name);
  if (!socketId) {
    console.error('Connection', name, 'with socket', socketId, 'is not ready!');
    return;
  }
  var sendBuffer = function() {
    if (chrome.runtime.lastError) {
      if (chrome.runtime.lastError.message == 'The socket is not connected') {
        this.sockets[name].connected = false;
      } else {
        console.error('Socket', name, ':', chrome.runtime.lastError);
        this.updateSocketInfo(name);
      }
      return;
    }
  };
  if (goog.isFunction(opt_callback)) {
    this.receiverStack.addCommand(opt_callback, socketId);
  }
  chrome.bluetoothSocket.send(socketId, buffer, sendBuffer.bind(this));
};


/**
 * Sends the buffer to the named connection.
 * @param {!string} name
 * @param {!Array|ArrayBuffer|Uint8Array} buffer
 * @param {!number} delay
 * @param {function(?)=} opt_callback The callback will be used to receive data,
 *     it will not get called when no data are received.
 * @export
 */
cwc.protocol.bluetooth.Api.prototype.sendDelayed = function(name,
    buffer, delay, opt_callback) {
  var socketId = this.getConnection(name);
  var stackCall = function() {
    this.send(name, buffer, opt_callback);
  };
  this.senderStack.addCommand(stackCall.bind(this));
  this.senderStack.addDelay(delay);
};


/**
 * @param {!number} socket_id
 * @param {function(?)} event_handler
 * @param {Object=} opt_scope
 */
cwc.protocol.bluetooth.Api.prototype.addEventHandler = function(
    socket_id, event_handler, opt_scope) {
  if (opt_scope) {
    this.receiverHandler[socket_id] = event_handler.bind(opt_scope);
  } else {
    this.receiverHandler[socket_id] = event_handler;
  }
};


/**
 * Adds the different types of event listener to the Bluetooth interface.
 */
cwc.protocol.bluetooth.Api.prototype.addEventListener = function() {
  if (this.bluetooth) {
    this.bluetooth.onAdapterStateChanged.addListener(
        this.handleOnAdapterStateChange.bind(this));
    this.bluetooth.onDeviceAdded.addListener(
        this.handleOnDeviceAdded.bind(this));
    this.bluetooth.onDeviceChanged.addListener(
        this.handleOnDeviceChanged.bind(this));
    this.bluetooth.onDeviceRemoved.addListener(
        this.handleOnDeviceRemoved.bind(this));
  }

  if (this.bluetoothSocket) {
    this.bluetoothSocket.onAccept.addListener(
        this.handleOnAccept.bind(this));
    this.bluetoothSocket.onAcceptError.addListener(
        this.handleOnAcceptError.bind(this));
    this.bluetoothSocket.onReceive.addListener(
        this.handleOnReceive.bind(this));
    this.bluetoothSocket.onReceiveError.addListener(
        this.handleOnReceiveError.bind(this));
  }
};


/**
 * @param {!number} socket_id
 * @param {Object} data
 */
cwc.protocol.bluetooth.Api.prototype.handleCallback = function(
    socket_id, data) {
  if (socket_id in this.receiverHandler) {
    this.receiverHandler[socket_id](data);
    return;
  }

  var callback = this.receiverStack.getNextCommand(socket_id);
  if (callback) {
    callback(data);
    return;
  }

  console.warn('Found no callback for socket', socket_id, 'with data:', data);
};


/**
 * Handles changes from the Bluetooth adapter.
 * @param {cwc.protocol.bluetooth.Adapter} adapter
 */
cwc.protocol.bluetooth.Api.prototype.handleOnAdapterStateChange =
    function(adapter) {
  console.log('onAdapterStateChange', adapter);
  this.checkBluetooth(adapter);
};


/**
 * @param {Object} device
 */
cwc.protocol.bluetooth.Api.prototype.handleOnDeviceAdded = function(
    device) {
  this.throttledCheckDevices.fire();
};


/**
 * @param {Object} device
 */
cwc.protocol.bluetooth.Api.prototype.handleOnDeviceChanged = function(
    device) {
  this.throttledCheckDevices.fire();
};


/**
 * @param {Object} device
 */
cwc.protocol.bluetooth.Api.prototype.handleOnDeviceRemoved = function(
    device) {
  this.throttledCheckDevices.fire();
};


/**
 * @param {Event} event
 */
cwc.protocol.bluetooth.Api.prototype.handleOnAccept = function(event) {
  console.log('onAccept', event);
};


/**
 * Handles on accpect error of the Bluetooth device.
 * @param {Event} event
 */
cwc.protocol.bluetooth.Api.prototype.handleOnAcceptError = function(
    event) {
  console.log('onAcceptError', event);
  if (chrome.runtime.lastError) {
    console.log('Connection error: ' + chrome.runtime.lastError.message);
  }
};


/**
 * Handles received data from the Bluetooth socket.
 * @param {Object} buffer
 */
cwc.protocol.bluetooth.Api.prototype.handleOnReceive = function(
    buffer) {
  this.handleCallback(buffer.socketId, buffer.data);
};


/**
 * Handles receive errors from the Bluetooth socket.
 * @param {Object} info
 */
cwc.protocol.bluetooth.Api.prototype.handleOnReceiveError = function(
    info) {
  console.error('Error receiving data for socket', info.socketId, ':',
      info.errorMessage);
  this.handleCallback(info.socketId, null);
};
