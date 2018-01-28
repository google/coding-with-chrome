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
goog.provide('cwc.protocol.bluetooth.Devices');

goog.require('cwc.protocol.bluetooth.Device');
goog.require('cwc.protocol.bluetooth.supportedDevices');
goog.require('cwc.utils.Logger');

goog.require('goog.Timer');
goog.require('goog.async.Throttle');


/**
 * @param {!goog.events.EventTarget} eventHandler
 * @constructor
 */
cwc.protocol.bluetooth.Devices = function(eventHandler) {
  /** @type {!string} */
  this.name = 'Bluetooth Devices';

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

  /** @private {!Array} */
  this.listener_ = [];

  /** @private {!goog.events.EventTarget} */
  this.eventHandler_ = eventHandler;

  /** @private {string} */
  this.deviceCache_ = '';

  /** @private {!Array} */
  this.autoConnectDeviceCache_ = [];

  /** @type {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


cwc.protocol.bluetooth.Devices.prototype.prepare = function() {
  if (this.prepared) {
    return;
  }

  this.log_.debug('Preparing Bluetooth devices ...');
  this.closeSockets();
  this.throttledUpdateDevices = new goog.async.Throttle(
      this.updateDevices.bind(this), this.updateDevicesInterval);
  chrome.bluetooth.onDeviceAdded.addListener(
      this.handleDeviceAdded_.bind(this));
  chrome.bluetooth.onDeviceChanged.addListener(
      this.handleDeviceChanged_.bind(this));
  chrome.bluetooth.onDeviceRemoved.addListener(
      this.handleDeviceRemoved_.bind(this));
  this.addEventListener_(this.deviceMonitor, goog.Timer.TICK,
      this.updateDevices.bind(this));
  this.deviceMonitor.start();
  this.updateDevices();
  this.preapred = true;
};


cwc.protocol.bluetooth.Devices.prototype.updateDevices = function() {
  chrome.bluetooth.getDevices(this.handleGetDevices_.bind(this));
};


/**
 * Closes all existing sockets.
 */
cwc.protocol.bluetooth.Devices.prototype.closeSockets = function() {
  this.log_.debug('Closing all existing sockets ...');
  let handleSockets = function(sockets) {
    for (let i = 0; i < sockets.length; i++) {
      chrome.bluetoothSocket.close(sockets[i].socketId,
          this.handleCloseSocket_.bind(this));
    }
  };
  chrome.bluetoothSocket.getSockets(handleSockets.bind(this));
};


/**
 * @param {!string} socket_id
 * @param {ArrayBuffer} data
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
 */
cwc.protocol.bluetooth.Devices.prototype.receiveError = function(
    socket_id, error) {
  if (socket_id in this.socketIds) {
    this.socketIds[socket_id].handleError(error);
  }
};


/**
 * @param {?} device
 * @return {!cwc.protocol.bluetooth.supportedDevices|null}
 */
cwc.protocol.bluetooth.Devices.prototype.getDeviceProfile = function(device) {
  let supportedDevices = cwc.protocol.bluetooth.supportedDevices;
  for (let entry in supportedDevices) {
    if (supportedDevices.hasOwnProperty(entry)) {
      let profile = supportedDevices[entry];
      if (device['deviceClass'] == profile.deviceClass &&
          device['uuids'].includes(profile.uuid) &&
          device['name'].includes(profile.indicator)) {
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
 * @param {boolean=} multisearch
 * @return {cwc.protocol.bluetooth.Device}
 */
cwc.protocol.bluetooth.Devices.prototype.getDeviceByName = function(name,
    multisearch = false) {
  let connectedDevice = [];
  let disconnectedDevice = [];
  for (let entry in this.devices) {
    if (this.devices.hasOwnProperty(entry)) {
      let device = this.devices[entry];
      if (device.getIndicator().includes(name)) {
        if (device.isConnected()) {
          connectedDevice.push(device);
        } else {
          disconnectedDevice.push(device);
        }
      }
    }
  }
  let numConnected = connectedDevice.length;
  let numDisconnected = disconnectedDevice.length;
  if (numConnected) {
    this.log_.debug('Found', numConnected, 'connected device for', name, ':',
      connectedDevice);
    this.autoConnectDeviceCache_ = [];
    if (multisearch && numConnected > 1) {
      return connectedDevice[Math.floor(Math.random() * numConnected)];
    }
    return connectedDevice[0];
  } else if (numDisconnected) {
    this.log_.debug('Found', numDisconnected, 'disconnected device for', name,
      ':', disconnectedDevice);
    if (multisearch && numDisconnected > 1) {
      return disconnectedDevice[Math.floor(Math.random() * numDisconnected)];
    }
    return disconnectedDevice[0];
  } else if (!this.autoConnectDeviceCache_.includes(name)) {
    this.log_.error('Bluetooth device with name', name, 'is unknown!');
    this.autoConnectDeviceCache_.push(name);
  }
  return null;
};


/**
 * @return {Object}
 */
cwc.protocol.bluetooth.Devices.prototype.getDevices = function() {
  return this.devices;
};


/**
 * @param {!string} name
 * @param {Function} callback
 * @param {boolean=} multisearch
 */
cwc.protocol.bluetooth.Devices.prototype.autoConnectDevice = function(name,
    callback, multisearch = false) {
  let device = this.getDeviceByName(name, multisearch);
  if (device) {
    if (device.isConnected() && device.hasSocket()) {
      callback(device, device.getAddress());
    } else {
      let connectEvent = function(socket_id, address) {
        callback(device, address);
      };
      device.connect(connectEvent.bind(this));
    }
  }
};


/**
 * @private
 */
cwc.protocol.bluetooth.Devices.prototype.handleDeviceAdded_ = function() {
  this.throttledUpdateDevices.fire();
};


/**
 * @private
 */
cwc.protocol.bluetooth.Devices.prototype.handleDeviceChanged_ = function() {
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
cwc.protocol.bluetooth.Devices.prototype.handleGetDevices_ = function(devices) {
  if (devices && this.deviceCache_ &&
      this.deviceCache_ === JSON.stringify(devices.sort())) {
    return;
  }
  if (!devices || devices.length == 0) {
    this.log_.warn('Did not find any Bluetooth devices!');
  }
  for (let i = 0; i < devices.length; i++) {
    let deviceEntry = devices[i];
    let profile = this.getDeviceProfile(deviceEntry);
    if (profile) {
      let address = deviceEntry['address'];
      let connected = deviceEntry['connected'];
      let connectable = deviceEntry['connectable'];
      if (address in this.devices) {
        this.devices[address].updateInfo();
        this.devices[address].setConnectable(connectable);
      } else {
        let deviceClass = deviceEntry['deviceClass'];
        let name = deviceEntry['name'];
        let paired = deviceEntry['paired'];
        let type = profile.name;
        let uuids = deviceEntry['uuids'];
        let device = new cwc.protocol.bluetooth.Device(
            address, connected, connectable, deviceClass, name, paired, uuids,
            profile, this.eventHandler_, type);
        device.setConnectEvent(this.handleConnect_.bind(this));
        device.setDisconnectEvent(this.handleDisconnect_.bind(this));
        this.devices[address] = device;
      }
      if (connected) {
        this.devices[address].getSocket();
      }
    } else {
      this.log_.debug('Found no device profile for:', deviceEntry);
    }
  }
  this.deviceCache_ = JSON.stringify(devices.sort());
};


/**
 * @param {!number} socket_id
 * @param {!string} address
 * @private
 */
cwc.protocol.bluetooth.Devices.prototype.handleConnect_ = function(socket_id,
    address) {
  let device = this.devices[address];
  if (device) {
    this.log_.debug('Connected device', device);
  } else {
    this.log_.debug('Connected socket', socket_id, 'to', address);
  }
  this.socketIds[socket_id] = this.devices[address];
};


/**
 * @param {!number} socket_id
 * @param {!string} address
 * @private
 */
cwc.protocol.bluetooth.Devices.prototype.handleDisconnect_ = function(socket_id,
    address) {
  let device = this.devices[address];
  if (device) {
    this.log_.debug('Disconnected device', device);
  } else {
    this.log_.debug('Disconnected socket', socket_id, 'from', address);
  }
  delete this.socketIds[socket_id];
};


/**
 * Adds an event listener for a specific event on a native event
 * target (such as a DOM element) or an object that has implemented
 * {@link goog.events.Listenable}.
 *
 * @param {EventTarget|goog.events.Listenable} src
 * @param {string} type
 * @param {function(?)} listener
 * @param {boolean=} capture
 * @param {Object=} scope
 * @private
 */
cwc.protocol.bluetooth.Devices.prototype.addEventListener_ = function(src, type,
    listener, capture = false, scope = undefined) {
  let eventListener = goog.events.listen(src, type, listener, capture, scope);
  goog.array.insert(this.listener_, eventListener);
};
