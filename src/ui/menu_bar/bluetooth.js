/**
 * @fileoverview Bluetooth Menu Bar for the Coding with Chrome editor.
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
goog.provide('cwc.ui.MenuBarBluetooth');


goog.require('cwc.lib.protocol.bluetoothChrome.Events');


goog.scope(function() {
const BluetoothEvents =
  goog.module.get('cwc.lib.protocol.bluetoothChrome.Events');

/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.MenuBarBluetooth = function(helper) {
  /** @type {string} */
  this.name = 'Menu Bar Bluetooth';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('menu-bar');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeConnected = null;

  /** @type {Element} */
  this.nodeDisabled = null;

  /** @type {boolean|undefined} */
  this.bluetooth = undefined;

  /** @type {boolean|undefined} */
  this.bluetoothConnectStatus = undefined;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix, this);

  /** @type {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


cwc.ui.MenuBarBluetooth.prototype.decorate = function() {
  // Bluetooth body
  this.show();

  // Bluetooth enabled
  this.node = goog.dom.getElement(this.prefix + 'bluetooth');
  this.events_.listen(this.node, goog.events.EventType.CLICK,
    function() {
      let connectScreenInstance = this.helper.getInstance('connectScreen');
      connectScreenInstance.showBluetoothDevices();
    });

  // Bluetooth connected
  this.nodeConnected = goog.dom.getElement(
    this.prefix + 'bluetooth-connected');
  this.events_.listen(this.nodeConnected, goog.events.EventType.CLICK,
    function() {
      let connectScreenInstance = this.helper.getInstance('connectScreen');
      connectScreenInstance.showBluetoothDevices();
    });

  // Bluetooth disabled
  this.nodeDisabled = goog.dom.getElement(
    this.prefix + 'bluetooth-disabled');
  this.events_.listen(this.nodeDisabled, goog.events.EventType.CLICK,
    this.checkBluetoothState_);

  // Event Handling
  let bluetoothInstance = this.helper.getInstance('bluetoothChrome');
  if (bluetoothInstance) {
    this.events_.listen(bluetoothInstance.getEventTarget(),
      BluetoothEvents.Type.ADAPTER_STATE_CHANGE,
      this.handleBluetoothAdapterChange_);
    this.events_.listen(bluetoothInstance.getEventTarget(),
      BluetoothEvents.Type.DEVICE_STATE_CHANGE,
      this.handleBluetoothDeviceChange_);
  }
};


/**
 * @param {boolean=} visible
 */
cwc.ui.MenuBarBluetooth.prototype.show = function(visible = true) {
  goog.style.setElementShown(
    goog.dom.getElement(this.prefix + 'bluetooth-body'),
    this.helper.checkChromeFeature('bluetooth') && visible);
};


/**
 * @private
 */
cwc.ui.MenuBarBluetooth.prototype.checkBluetoothState_ = function() {
  this.helper.showInfo('Checking bluetooth state ...');
  let bluetoothInstance = this.helper.getInstance('bluetoothChrome');
  if (bluetoothInstance) {
    bluetoothInstance.updateAdapterState();
  }
};


/**
 * @param {?} e
 * @private
 */
cwc.ui.MenuBarBluetooth.prototype.handleBluetoothAdapterChange_ = function(e) {
  if (this.bluetooth === e.data.enabled) {
    return;
  }
  goog.style.setElementShown(this.node, e.data.enabled);
  goog.style.setElementShown(this.nodeConnected, false);
  goog.style.setElementShown(this.nodeDisabled, !e.data.enabled);
  this.bluetooth = e.data.enabled;
};


/**
 * @param {?} e
 * @private
 */
cwc.ui.MenuBarBluetooth.prototype.handleBluetoothDeviceChange_ = function(e) {
  if (this.bluetoothConnectStatus === e.data.connected) {
    return;
  }
  goog.style.setElementShown(this.node, !e.data.connected);
  goog.style.setElementShown(this.nodeConnected, e.data.connected);
  goog.style.setElementShown(this.nodeDisabled, false);
  this.bluetoothConnectStatus = e.data.connected;
};


/**
 * Cleans up the event listener and any other modification.
 * @private
 */
cwc.ui.MenuBarBluetooth.prototype.cleanUp_ = function() {
  this.events_.clear();
};
});
