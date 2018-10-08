/**
 * @fileoverview Bluetooth Web Menu Bar for the Coding with Chrome editor.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
goog.provide('cwc.ui.MenuBarBluetoothWeb');

goog.require('cwc.lib.protocol.bluetoothWeb.Events');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');


goog.scope(function() {
const BluetoothEvents =
  goog.module.get('cwc.lib.protocol.bluetoothWeb.Events');

/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.MenuBarBluetoothWeb = function(helper) {
  /** @type {string} */
  this.name = 'Menu Bar Bluetooth Web';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('menu-bar');

  /** @type {Element} */
  this.nodeConnect = null;

  /** @type {Element} */
  this.nodeConnected = null;

  /** @type {Element} */
  this.nodeDisabled = null;

  /** @type {boolean|undefined} */
  this.bluetooth = undefined;

  /** @type {boolean|undefined} */
  this.bluetoothConnectStatus = undefined;

  /** @private {Function} */
  this.clickHandler_ = function() {};

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix, this);

  /** @type {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


cwc.ui.MenuBarBluetoothWeb.prototype.decorate = function() {
  // Bluetooth connect
  this.nodeConnect = goog.dom.getElement(this.prefix + 'bluetooth-web-connect');
  this.events_.listen(this.nodeConnect, goog.events.EventType.CLICK,
    this.handleClick_);

  // Bluetooth connected
  this.nodeConnected = goog.dom.getElement(
    this.prefix + 'bluetooth-web-connected');
  this.events_.listen(this.nodeConnected, goog.events.EventType.CLICK,
    function() {
      let connectScreenInstance = this.helper.getInstance('connectScreen');
      connectScreenInstance.showBluetoothDevices();
    });

  // Bluetooth disabled
  this.nodeDisabled = goog.dom.getElement(
    this.prefix + 'bluetooth-web-disabled');
  this.events_.listen(this.nodeDisabled, goog.events.EventType.CLICK,
    this.checkBluetoothState_);

  // Event Handling
  let bluetoothInstance = this.helper.getInstance('bluetoothWeb');
  if (bluetoothInstance) {
    this.events_.listen(bluetoothInstance.getEventTarget(),
      BluetoothEvents.Type.DEVICE_STATE_CHANGE,
      this.handleDeviceChange_);
  }

  this.show();
};


/**
 * @param {Function} func
 */
cwc.ui.MenuBarBluetoothWeb.prototype.setClickHandler = function(func) {
  this.clickHandler_ = func;
};


/**
 * @param {boolean=} visible
 * @param {boolean=} connected
 */
cwc.ui.MenuBarBluetoothWeb.prototype.show = function(visible = true,
    connected = false) {
  goog.style.setElementShown(
    goog.dom.getElement(this.prefix + 'bluetooth-web-body'), visible);
  if (visible) {
    let enabled = this.helper.checkBrowserFeature('bluetooth');
    goog.style.setElementShown(this.nodeConnect, !connected && enabled);
    goog.style.setElementShown(this.nodeConnected, connected);
    goog.style.setElementShown(this.nodeDisabled, !enabled);
  }
};


/**
 * @private
 */
cwc.ui.MenuBarBluetoothWeb.prototype.checkBluetoothState_ = function() {
  this.helper.showInfo('Checking bluetooth state ...');
};


/**
 * @param {?} e
 * @private
 */
cwc.ui.MenuBarBluetoothWeb.prototype.handleDeviceChange_ = function(
    e) {
  if (this.bluetoothConnectStatus === e.data.connected) {
    return;
  }
  this.show(true, e.data.connected);
  this.bluetoothConnectStatus = e.data.connected;
};


/**
 * Cleans up the event listener and any other modification.
 * @private
 */
cwc.ui.MenuBarBluetoothWeb.prototype.handleClick_ = function() {
  this.clickHandler_();
};


/**
 * Cleans up the event listener and any other modification.
 * @private
 */
cwc.ui.MenuBarBluetoothWeb.prototype.cleanUp_ = function() {
  this.events_.clear();
};
});
