/**
 * @fileoverview Connect Screen for bluetooth devices.
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
goog.provide('cwc.ui.connectScreen.Bluetooth');

goog.require('cwc.soy.connectScreen.Bluetooth');
goog.require('cwc.utils.Events');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 */
cwc.ui.connectScreen.Bluetooth = function(helper) {
  /** @type {string} */
  this.name = 'ConnectScreenBluetooth';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('connectScreenBluetooth');

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix);
};


/**
 * Shows bluetooth connect screen.
 */
cwc.ui.connectScreen.Bluetooth.prototype.showDevices = function() {
  let devices = {};

  // Chrome Bluetooth devices
  let bluetoothInstance = this.helper.getInstance('bluetoothChrome');
  if (bluetoothInstance) {
    let bluetoothDevices = bluetoothInstance.getDevices();
    for (let bluetoothDevice in bluetoothDevices) {
      if (bluetoothDevices.hasOwnProperty(bluetoothDevice)) {
        let device = bluetoothDevices[bluetoothDevice];
        devices[device.getAddress()] = this.parseDeviceData_(device);
      }
    }
  }

  // Bluetooth LE devices
  let bluetoothWebInstance = this.helper.getInstance('bluetoothWeb', true);
  let bluetoothWebDevices = bluetoothWebInstance.getDevices();
  for (let bluetoothWebDevice in bluetoothWebDevices) {
    if (bluetoothWebDevices.hasOwnProperty(bluetoothWebDevice)) {
      let device = bluetoothWebDevices[bluetoothWebDevice];
      devices[device.getId()] = this.parseDeviceData_(device);
    }
  }

  let foundDevices = Object.keys(devices).length > 0;
  this.showTemplate_('Connect Bluetooth device',
    cwc.soy.connectScreen.Bluetooth.template, {
      ble: this.helper.checkBrowserFeature('bluetooth'),
      devices: devices,
      found_devices: foundDevices,
      experimental: this.helper.experimentalEnabled(),
      prefix: this.prefix,
    });

  if (this.helper.checkBrowserFeature('bluetooth')) {
    this.events_.listen('search-button', goog.events.EventType.CLICK,
      this.handleSearch_.bind(this));
  }

  if (foundDevices) {
    this.events_.listen('device-list', goog.events.EventType.CLICK,
      this.handleAction_.bind(this));
  }
};


/**
 * @param {cwc.lib.protocol.bluetoothWeb.Profile.Device} device
 * @return {Promise}
 */
cwc.ui.connectScreen.Bluetooth.prototype.requestDevice = function(device) {
  console.log('Request device ....', device);
  return new Promise((resolve) => {
    let bluetoothInstance = this.helper.getInstance('bluetoothWeb', true);
    let devices = bluetoothInstance.getDevicesByName(device.name);
    if (devices && devices[0]) {
      return resolve(devices[0]);
    }
    console.log('Asked user to connect device', device.name);
    this.showTemplate_('Connect ' + device.name,
      cwc.soy.connectScreen.Bluetooth.requestDevice, {
        ble: this.helper.checkBrowserFeature('bluetooth'),
        device: device,
        experimental: this.helper.experimentalEnabled(),
        prefix: this.prefix,
    });
    this.events_.listen('search-button', goog.events.EventType.CLICK, () => {
      bluetoothInstance.requestDevice(device).then((bluetoothDevice) => {
        this.helper.getInstance('connectScreen')
          .showConnectingStep(
            'Pairing Device', 'Pairing device' + device.name, 1);
        resolve(bluetoothDevice);
      }).catch(() => {
        this.close_();
      });
    });
  });
};


/**
 * @param {Event} e
 * @private
 */
cwc.ui.connectScreen.Bluetooth.prototype.handleAction_ = function(e) {
  let target = e.target;
  if (!target || !target.dataset || !target.hasAttribute('data-action')) {
    return;
  }
  let action = target.dataset['action'];
  let address = target.dataset['address'];
  let id = target.dataset['id'];
  let device = null;
  if (address) {
    let bluetoothInstance = this.helper.getInstance('bluetoothChrome');
    device = bluetoothInstance.getDevice(address);
  } else if (id) {
    let bluetoothWebInstance = this.helper.getInstance('bluetoothWeb');
    device = bluetoothWebInstance.getDevice(id);
  }
  if (!device) {
    return;
  }
  switch (action) {
    case 'connect':
      this.connectDevice_(device);
      break;
    case 'disconnect':
      this.disconnectDevice_(device);
      break;
    default:
      console.log(target.dataset);
  }
};


/**
 * @private
 */
cwc.ui.connectScreen.Bluetooth.prototype.handleSearch_ = function() {
  this.helper.getInstance('bluetoothWeb')
    .requestDevices(this.refresh_.bind(this));
};


/**
 * @private
 */
cwc.ui.connectScreen.Bluetooth.prototype.close_ = function() {
  this.helper.getInstance('dialog').close();
};


/**
 * @param {!cwc.lib.protocol.bluetoothChrome.Device} device
 * @private
 */
cwc.ui.connectScreen.Bluetooth.prototype.connectDevice_ = function(device) {
  this.close_();
  this.showTemplate_('Connecting Bluetooth device',
    cwc.soy.connectScreen.Bluetooth.connect, {
      device: this.parseDeviceData_(device),
    });
  device.connect(this.close_.bind(this));
};


/**
 * @param {!cwc.lib.protocol.bluetoothChrome.Device} device
 * @private
 */
cwc.ui.connectScreen.Bluetooth.prototype.disconnectDevice_ = function(device) {
  this.close_();
  this.showTemplate_('Disconnecting Bluetooth device',
    cwc.soy.connectScreen.Bluetooth.disconnect, {
      device: this.parseDeviceData_(device),
    });
  device.disconnect(true, this.close_.bind(this));
};


/**
 * @param {string} title
 * @param {Object} template
 * @param {Object} context
 * @private
 */
cwc.ui.connectScreen.Bluetooth.prototype.showTemplate_ = function(title,
    template, context) {
  this.helper.getInstance('dialog').showTemplate(title, template, context);
};


/**
 * @private
 */
cwc.ui.connectScreen.Bluetooth.prototype.refresh_ = function() {
  console.log('Refreshing ...');
  this.showDevices();
};


/**
 * @param {!cwc.lib.protocol.bluetoothChrome.Device|
 *  cwc.lib.protocol.bluetoothWeb.Device} device
 * @return {Object}
 * @private
 */
cwc.ui.connectScreen.Bluetooth.prototype.parseDeviceData_ = function(device) {
  return {
    'address': device.getAddress(),
    'connected': device.isConnected(),
    'icon': device.getIcon(),
    'id': device.getId(),
    'name': device.getName(),
    'type': device.getType(),
  };
};
