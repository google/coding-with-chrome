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
goog.provide('cwc.protocol.bluetooth.Devices');

goog.require('cwc.protocol.bluetooth.Device');
goog.require('cwc.protocol.bluetooth.supportedDevices');

goog.require('goog.Timer');
goog.require('goog.async.Throttle');



/**
 * @param {!cwc.ui.helper} helper
 * @param {!chrome.bluetooth} bluetooth
 * @constructor
 */
cwc.protocol.bluetooth.Devices = function(helper, bluetooth) {

  /** @type {cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.utils.Logger} */
  this.log_ = helper.getLogger();

  /** @type {!chrome.bluetooth} */
  this.bluetooth = bluetooth;

  /** @type {!chrome.bluetoothSocket} */
  this.bluetoothSocket = chrome.bluetoothSocket;

  /** @type {Object} */
  this.devices = {};

  /** @type {Object} */
  this.socketIds = {};

  /** @type {boolean} */
  this.prepared = false;

  /** @type {goog.async.Throttle} */
  this.throttledUpdateDevices = null;

  /** @type {!number} */
  this.updateDevicesInterval = 5000;

  /** @type {!goog.Timer} */
  this.deviceMonitor = new goog.Timer(this.updateDevicesInterval);

  /** @type {!Array} */
  this.listener = [];
};


/**
 * @export
 */
cwc.protocol.bluetooth.Devices.prototype.prepare = function() {
  if (this.prepared) {
    return;
  }

  this.log_.debug('Preparing Bluetooth devices ...');
  this.closeSockets();
  this.throttledUpdateDevices = new goog.async.Throttle(
      this.updateDevices.bind(this), this.updateDevicesInterval);
  this.bluetooth.onDeviceAdded.addListener(this.handleDeviceAdded_.bind(this));
  this.bluetooth.onDeviceChanged.addListener(
      this.handleDeviceChanged_.bind(this));
  this.bluetooth.onDeviceRemoved.addListener(
      this.handleDeviceRemoved_.bind(this));
  this.addEventListener_(this.deviceMonitor, goog.Timer.TICK,
      this.updateDevices.bind(this));
  this.deviceMonitor.start();
  this.updateDevices();
  this.preapred = true;
};


/**
 * @export
 */
cwc.protocol.bluetooth.Devices.prototype.updateDevices = function() {
  this.bluetooth.getDevices(this.handleGetDevices_.bind(this));
};


/**
 * Closes all existing sockets.
 * @export
 */
cwc.protocol.bluetooth.Devices.prototype.closeSockets = function() {
  this.log_.debug('Closing all existing sockets ...');
  var handleSockets = function(sockets) {
    for (var i = 0; i < sockets.length; i++) {
      this.bluetoothSocket.close(sockets[i].socketId,
          this.handleCloseSocket_.bind(this));
    }
  };
  this.bluetoothSocket.getSockets(handleSockets.bind(this));
};


/**
 * @param {!string} socket_id
 * @param {ByteArray} data
 * @export
 */
cwc.protocol.bluetooth.Devices.prototype.receiveData = function(
    socket_id, data) {
  if (socket_id in this.socketIds) {
    this.socketIds[socket_id].handleData(data);
  }
};


/**
 * @param {!string} socket_id
 * @param {!string} error
 * @export
 */
cwc.protocol.bluetooth.Devices.prototype.receiveError = function(
    socket_id, error) {
  if (socket_id in this.socketIds) {
    this.socketIds[socket_id].handleError(error);
  }
};


/**
 * @param {?} device
 * @return {?object}
 */
cwc.protocol.bluetooth.Devices.prototype.getDeviceProfile = function(device) {
  var supportedDevices = cwc.protocol.bluetooth.supportedDevices;
  for (var entry in supportedDevices) {
    if (supportedDevices.hasOwnProperty(entry)) {
      var profile = supportedDevices[entry];
      if (device.deviceClass == profile.deviceClass &&
          device.uuids.indexOf(profile.uuid) != -1 &&
          device.name.indexOf(profile.indicator) != -1) {
        this.log_.debug('Found device profile', profile.name, 'for', device);
        return profile;
      }
    }
  }
  return null;
};


/**
 * @param {!string} address
 * @return {cwc.protocol.bluetooth.Device}
 * @export
 */
cwc.protocol.bluetooth.Devices.prototype.getDevice = function(address) {
  if (address in this.devices) {
    return this.devices[address];
  }
  this.log_.error('Bluetooth device address', address, 'is unknown!');
  return null;
};


/**
 * @param {!string} name
 * @param {boolean=} opt_multisearch
 * @return {cwc.protocol.bluetooth.Device}
 * @export
 */
cwc.protocol.bluetooth.Devices.prototype.getDeviceByName = function(name,
    opt_multisearch) {
  var connectedDevice = [];
  var disconnectedDevice = [];
  for (var entry in this.devices) {
    if (this.devices.hasOwnProperty(entry)) {
      var device = this.devices[entry];
      if (device.getIndicator().indexOf(name) !== -1) {
        if (device.isConnected()) {
          connectedDevice.push(device);
        } else {
          disconnectedDevice.push(device);
        }
      }
    }
  }
  var numConnected = connectedDevice.length;
  var numDisconnected = disconnectedDevice.length;
  if (numConnected) {
    this.log_.debug('Found', numConnected, 'connected device for', name, ':',
      connectedDevice);
    if (opt_multisearch && numConnected > 1) {
      return connectedDevice[Math.floor(Math.random() * numConnected)];
    }
    return connectedDevice[0];
  } else if (numDisconnected) {
    this.log_.debug('Found', numDisconnected, 'disconnected device for', name,
      ':', disconnectedDevice);
    if (opt_multisearch && numDisconnected > 1) {
      return disconnectedDevice[Math.floor(Math.random() * numDisconnected)];
    }
    return disconnectedDevice[0];
  } else {
    this.log_.error('Bluetooth device with name', name, 'is unknown!');
    return null;
  }
};


/**
 * @param {!string} device_name
 * @param {Function} callback
 * @param {boolean=} opt_multisearch
 * @export
 */
cwc.protocol.bluetooth.Devices.prototype.autoConnectDevice = function(
    device_name, callback, opt_multisearch) {
  var device = this.getDeviceByName(device_name, opt_multisearch);
  if (device) {
    if (device.isConnected() && device.hasSocket()) {
      callback(device.getAddress());
    } else {
      var connectEvent = function(socket_id, address) {
        callback(address);
      };
      device.connect(connectEvent.bind(this));
    }
  } else {
    this.log_.error('Was unable to start auto connect for', device_name);
  }
};


/**
 * @param {Object=} opt_device
 * @private
 */
cwc.protocol.bluetooth.Devices.prototype.handleDeviceAdded_ = function(
    opt_device) {
  this.throttledUpdateDevices.fire();
};


/**
 * @param {Object=} opt_device
 * @private
 */
cwc.protocol.bluetooth.Devices.prototype.handleDeviceChanged_ = function(
    opt_device) {
  this.throttledUpdateDevices.fire();
};


/**
 * @param {Object} device
 * @private
 */
cwc.protocol.bluetooth.Devices.prototype.handleDeviceRemoved_ = function(
    device) {
  this.log_.debug('Bluetooth device removed:', device);
  this.throttledUpdateDevices.fire();
};


/**
 * @param {number} socket_id
 * @private
 */
cwc.protocol.bluetooth.Devices.prototype.handleCloseSocket_ = function(
    socket_id) {
  this.log_.debug('Closed socket', socket_id, '!');
};


/**
 * @param {?} devices
 * @private
 */
cwc.protocol.bluetooth.Devices.prototype.handleGetDevices_ = function(
    devices) {

  if (!devices || devices.length == 0) {
    this.log_.warn('Did not find any Bluetooth devices!');
  }
  var connectionManagerInstance = this.helper.getInstance('connectionManager');
  var menubarInstance = this.helper.getInstance('menubar');
  var deviceConnected = false;
  for (var i = 0; i < devices.length; i++) {
    var deviceEntry = devices[i];
    var profile = this.getDeviceProfile(deviceEntry);
    if (profile) {
      var address = deviceEntry.address;
      var connected = deviceEntry.connected;
      if (address in this.devices) {
        this.devices[address].updateInfo();
      } else {
        var deviceClass = deviceEntry.deviceClass;
        var name = deviceEntry.name;
        var paired = deviceEntry.paired;
        var type = profile.name;
        var uuids = deviceEntry.uuids;
        var device = new cwc.protocol.bluetooth.Device(
            address, connected, deviceClass, name, paired, uuids, profile,
            type, this.bluetooth);
        device.setConnectEvent(this.handleConnect_.bind(this));
        device.setDisconnectEvent(this.handleDisconnect_.bind(this));
        this.devices[address] = device;
      }
      if (connected) {
        this.devices[address].getSocket();
        deviceConnected = true;
      }
      if (menubarInstance) {
        menubarInstance.updateDeviceList(this.devices[address]);
      }
    } else {
      this.log_.debug('Found no device profile for:', deviceEntry);
    }
  }

  if (menubarInstance) {
    menubarInstance.setBluetoothConnected(deviceConnected);
  }

  if (connectionManagerInstance) {
    connectionManagerInstance.setBluetoothDevices(this.devices);
  }
};


/**
 * @param {!number} socket_id
 * @param {!string} address
 * @private
 */
cwc.protocol.bluetooth.Devices.prototype.handleConnect_ = function(socket_id,
    address) {
  var device = this.devices[address];
  if (!device) {
    this.log_.debug('Connected socket', socket_id, 'to', address);
  } else {
    this.log_.debug('Connected device', device);
  }
  this.socketIds[socket_id] = this.devices[address];
  var menubarInstance = this.helper.getInstance('menubar');
  if (menubarInstance && device) {
    menubarInstance.updateDeviceList(device);
    menubarInstance.setBluetoothConnected(true);
  }
};


/**
 * @param {!number} socket_id
 * @param {!string} address
 * @private
 */
cwc.protocol.bluetooth.Devices.prototype.handleDisconnect_ = function(socket_id,
    address) {
  this.log_.debug('Disconnected socket', socket_id, 'from', address);
  delete this.socketIds[socket_id];
  var device = this.devices[address];
  var menubarInstance = this.helper.getInstance('menubar');
  if (menubarInstance && device) {
    menubarInstance.updateDeviceList(device);
    menubarInstance.setBluetoothConnected(false);
  }
};


/**
 * Adds an event listener for a specific event on a native event
 * target (such as a DOM element) or an object that has implemented
 * {@link goog.events.Listenable}.
 *
 * @param {EventTarget|goog.events.Listenable} src
 * @param {string} type
 * @param {function(?)} listener
 * @param {boolean=} opt_useCapture
 * @param {Object=} opt_listenerScope
 * @private
 */
cwc.protocol.bluetooth.Devices.prototype.addEventListener_ = function(src, type,
    listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};
