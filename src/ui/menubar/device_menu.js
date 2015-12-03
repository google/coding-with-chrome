/**
 * @fileoverview Device menu for the Coding with Chrome editor.
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
goog.provide('cwc.ui.DeviceMenu');

goog.require('cwc.utils.Helper');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.ui.DeviceMenu = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {goog.ui.PopupMenu} */
  this.deviceMenu = null;

  /** @type {Object} */
  this.deviceMenuDevices = {};
};


/**
 * Decorates the help menu.
 * @param {Element} node
 * @export
 */
cwc.ui.DeviceMenu.prototype.decorate = function(node) {
  if (!node) {
    console.log('Was not able to decorate device menu!');
    return;
  }

  this.deviceMenu = new goog.ui.PopupMenu();
  this.deviceMenu.attach(node, goog.positioning.Corner.BOTTOM_START);
  this.deviceMenu.render();
};


/**
* @param {cwc.protocol.bluetooth.Device} device
* @param {object} profile
* @param {number=} opt_socket
* @export
*/
cwc.ui.DeviceMenu.prototype.updateDeviceList = function(device,
    profile, opt_socket) {
  var address = device.address;
  var connected = device.connected;
  var name = device.name;
  var rssi = device.rssi || '-';

  if (!(address in this.deviceMenuDevices)) {
    console.log('Adding new Menu Item', name);
    this.deviceMenuDevices[address] = new goog.ui.CheckBoxMenuItem(name);
    this.deviceMenu.addChild(this.deviceMenuDevices[address], true);
    goog.events.listen(this.deviceMenuDevices[address],
        goog.ui.Component.EventType.ACTION, function() {
          this.deviceMenuDevices[address].setChecked(connected && opt_socket);
          var bluetoothInstance = this.helper.getInstance('bluetooth');
          if (bluetoothInstance) {
            bluetoothInstance.connectDevice(device, profile);
          }
        }, false, this);
  }
  if (connected && opt_socket) {
    this.deviceMenuDevices[address].setContent(name + ' (' +
        address + ' / rssi: ' + rssi + ')');
  } else {
    this.deviceMenuDevices[address].setContent('Connect to ' + name + ' (' +
        address + ')');
  }
  this.deviceMenuDevices[address].setChecked(connected && opt_socket);
};
