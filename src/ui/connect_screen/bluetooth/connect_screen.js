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
};


/**
 * Shows bluetooth connect screen.
 */
cwc.ui.connectScreen.Bluetooth.prototype.showDevices = function() {
  let bluetoothInstance = this.helper.getInstance('bluetooth', true);
  let bluetoothDevices = bluetoothInstance.getDevices();
  let devices = {};
  for (let bluetoothDevice in bluetoothDevices) {
    if (bluetoothDevices.hasOwnProperty(bluetoothDevice)) {
      let device = bluetoothDevices[bluetoothDevice];
      devices[device.getAddress()] = this.parseDeviceData_(device);
    }
  }

  this.showTemplate_('Connect Bluetooth device',
    cwc.soy.connectScreen.Bluetooth.devices, {
      prefix: this.prefix,
      devices: devices,
    });

  let deviceList = goog.dom.getElement(this.prefix + 'device-list');
  goog.events.listen(deviceList, goog.events.EventType.CLICK,
    this.handleAction_.bind(this));
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
  let bluetoothInstance = this.helper.getInstance('bluetooth');
  let action = target.dataset['action'];
  let address = target.dataset['address'];
  let device = bluetoothInstance.getDevice(address);
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
cwc.ui.connectScreen.Bluetooth.prototype.close_ = function() {
  let dialogInstance = this.helper.getInstance('dialog', true);
  dialogInstance.close();
};


/**
 * @param {!cwc.protocol.bluetooth.Device} device
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
 * @param {!cwc.protocol.bluetooth.Device} device
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
 * @param {!string} title
 * @param {Object} template
 * @param {Object} opt_context
 * @private
 */
cwc.ui.connectScreen.Bluetooth.prototype.showTemplate_ = function(title,
    template, opt_context) {
  let dialogInstance = this.helper.getInstance('dialog', true);
  dialogInstance.showTemplate(title, template, opt_context);
};


/**
 * @param {!cwc.protocol.bluetooth.Device} device
 * @return {Object}
 * @private
 */
cwc.ui.connectScreen.Bluetooth.prototype.parseDeviceData_ = function(device) {
  return {
    'name': device.getName(),
    'address': device.getAddress(),
    'connected': device.isConnected(),
    'type': device.getType(),
    'icon': device.getIcon(),
  };
};
