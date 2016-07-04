/**
 * @fileoverview Connect Screen for bluetooth devices.
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

  /** @type {string} */
  this.generalPrefix = this.helper.getPrefix();

  /** @type {Element|StyleSheet} */
  this.styleSheet = null;
};


/**
 * Shows bluetooth connect screen.
 */
cwc.ui.connectScreen.Bluetooth.prototype.showDevices = function() {
  var bluetoothInstance = this.helper.getInstance('bluetooth', true);
  var dialogInstance = this.helper.getInstance('dialog', true);
  var bluetoothDevices = bluetoothInstance.getDevices();
  var devices = {};
  for (var bluetoothDevice in bluetoothDevices) {
    if (bluetoothDevices.hasOwnProperty(bluetoothDevice)) {
      var device = bluetoothDevices[bluetoothDevice];
      devices[device.getName()] = {
        'address': device.getAddress(),
        'connected': device.isConnected(),
        'type': device.getType(),
        'icon': device.getIcon()
      };
    }
  }

  dialogInstance.showTemplate('Connect Bluetooth device',
    cwc.soy.connectScreen.Bluetooth.devices, {
      prefix: this.prefix,
      devices: devices
    });

  var deviceList = goog.dom.getElement(this.prefix + 'device-list');
  goog.events.listen(deviceList, goog.events.EventType.CLICK,
    this.handleAction_.bind(this));
};


/**
 * @param {Event} e
 * @private
 */
cwc.ui.connectScreen.Bluetooth.prototype.handleAction_ = function(e) {
  var target = e.target;
  if (!target || !target.dataset || !target.hasAttribute('data-action')) {
    return;
  }
  var bluetoothInstance = this.helper.getInstance('bluetooth');
  var action = target.dataset['action'];
  var address = target.dataset['address'];
  var device = bluetoothInstance.getDevice(address);
  if (!device) {
    return;
  }
  switch (action) {
    case 'connect':
      device.connect();
      break;
    case 'disconnect':
      device.disconnect(true);
      break;
    default:
      console.log(target.dataset);
  }

};
