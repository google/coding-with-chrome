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
goog.require('goog.ui.MenuItem');



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
  this.deviceConnectMenu = null;

  /** @type {goog.ui.PopupMenu} */
  this.deviceDisconnectMenu = null;

  /** @type {Object} */
  this.deviceMenuDevices = {};

  /** @type {goog.ui.MenuItem} */
  this.connectedDevice = null;
};


/**
 * Decorates the help menu.
 * @param {Element} node
 * @export
 */
cwc.ui.DeviceMenu.prototype.decorateConnect = function(node) {
  if (!node) {
    console.log('Was not able to decorate device connect menu!');
    return;
  }

  this.deviceConnectMenu = new goog.ui.PopupMenu();
  this.deviceConnectMenu.attach(node, goog.positioning.Corner.BOTTOM_START);
  this.deviceConnectMenu.render();
};


/**
 * Decorates the help menu.
 * @param {Element} node
 * @export
 */
cwc.ui.DeviceMenu.prototype.decorateDisconnect = function(node) {
  if (!node) {
    console.log('Was not able to decorate device disconnect menu!');
    return;
  }

  this.deviceDisconnectMenu = new goog.ui.PopupMenu();
  this.deviceDisconnectMenu.attach(node, goog.positioning.Corner.BOTTOM_START);
  this.deviceDisconnectMenu.render();
};


/**
* @param {cwc.protocol.bluetooth.Device} device
* @export
*/
cwc.ui.DeviceMenu.prototype.updateDeviceList = function(device) {
  var address = device.getAddress();
  var connected = device.isConnected();
  var name = device.getName();


  if (connected) {
    this.connectedDevice = new goog.ui.MenuItem(name);
    this.deviceDisconnectMenu.removeChildren(true);
    this.deviceDisconnectMenu.addChild(this.connectedDevice, true);
    goog.events.listen(this.connectedDevice,
        goog.ui.Component.EventType.ACTION, function() {
          device.disconnect();
        }, false, this);
    this.connectedDevice.setContent('Disconnect ' + name + ' (' +
        address + ')');
  } else {
    if (!(address in this.deviceMenuDevices)) {
      this.deviceMenuDevices[address] = new goog.ui.MenuItem(name);
      this.deviceConnectMenu.addChild(this.deviceMenuDevices[address], true);
      goog.events.listen(this.deviceMenuDevices[address],
        goog.ui.Component.EventType.ACTION, function() {
          device.connect();
        }, false, this);
      this.deviceMenuDevices[address].setContent('Connect to ' + name + ' (' +
          address + ')');
    }
  }
};
