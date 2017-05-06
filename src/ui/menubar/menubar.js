/**
 * @fileoverview Menubar for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Menubar');

goog.require('cwc.soy.Menubar');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Helper');

goog.require('goog.dom');
goog.require('goog.soy');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Menubar = function(helper) {
  /** @type {string} */
  this.name = 'Menubar';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('menubar');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeAccountBody = null;

  /** @type {Element} */
  this.nodeAccountLogin = null;

  /** @type {Element} */
  this.nodeAccountLogout = null;

  /** @type {Element} */
  this.nodeBluetooth = null;

  /** @type {Element} */
  this.nodeBluetoothBody = null;

  /** @type {Element} */
  this.nodeBluetoothConnected = null;

  /** @type {Element} */
  this.nodeBluetoothDisabled = null;

  /** @type {Element} */
  this.nodeSerial = null;

  /** @type {Element} */
  this.nodeSerialBody = null;

  /** @type {Element} */
  this.nodeSerialConnected = null;

  /** @type {Element} */
  this.nodeSerialDisabled = null;

  /** @type {Element} */
  this.nodeCloseButton = null;

  /** @type {Element} */
  this.nodeMinimizeButton = null;

  /** @type {Element} */
  this.nodeMaximizeButton = null;

  /** @type {Element} */
  this.nodeRestoreButton = null;

  /** @type {boolean} */
  this.bluetooth = false;

  /** @type {boolean} */
  this.bluetoothConnectStatus = false;

  /** @type {boolean} */
  this.serial = false;

  /** @type {boolean} */
  this.serialConnectStatus = false;

  /** @type {AppWindow|null} */
  this.currentWindow = null;

  /** @private {!boolean} */
  this.isChromeApp_ = this.helper.checkChromeFeature('app');

  /** @private {!boolean} */
  this.isChromeOS_ = this.helper.checkChromeFeature('os');
};


/**
 * Decorates the given node and adds the menu bar.
 * @param {Element} node The target node to add the menu bar.
 * @export
 */
cwc.ui.Menubar.prototype.decorate = function(node) {
  this.node = node;

  goog.soy.renderElement(
      this.node,
      cwc.soy.Menubar.menubarTemplate, {
        'prefix': this.prefix,
      }
  );

  // Account body
  this.nodeAccountBody = goog.dom.getElement(this.prefix + 'account-body');
  goog.style.setElementShown(this.nodeAccountBody,
    !this.isChromeOS_ && this.helper.checkChromeFeature('manifest.oauth2'));

  // Account login
  this.nodeAccountLogin = goog.dom.getElement(this.prefix + 'account');
  goog.events.listen(this.nodeAccountLogin, goog.events.EventType.CLICK,
    this.loginAccount, false, this);

  // Account logout
  this.nodeAccountLogout = goog.dom.getElement(this.prefix + 'account-logout');
  goog.events.listen(this.nodeAccountLogout, goog.events.EventType.CLICK,
    this.logoutAccount, false, this);

  // Bluetooth body
  this.nodeBluetoothBody = goog.dom.getElement(this.prefix + 'bluetooth-body');
  goog.style.setElementShown(this.nodeBluetoothBody,
    this.helper.checkChromeFeature('bluetooth'));

  // Bluetooth enabled
  this.nodeBluetooth = goog.dom.getElement(this.prefix + 'bluetooth');
  goog.events.listen(this.nodeBluetooth, goog.events.EventType.CLICK,
    function() {
      let connectScreenInstance = this.helper.getInstance('connectScreen');
      connectScreenInstance.showBluetoothDevices();
    }, false, this);

  // Bluetooth connected
  this.nodeBluetoothConnected = goog.dom.getElement(
    this.prefix + 'bluetooth-connected');
  goog.events.listen(this.nodeBluetoothConnected, goog.events.EventType.CLICK,
    function() {
      let connectScreenInstance = this.helper.getInstance('connectScreen');
      connectScreenInstance.showBluetoothDevices();
    }, false, this);

  // Bluetooth disabled
  this.nodeBluetoothDisabled = goog.dom.getElement(
    this.prefix + 'bluetooth-disabled');
  goog.events.listen(this.nodeBluetoothDisabled, goog.events.EventType.CLICK,
    this.checkBluetoothState_, false, this);

  // Close button
  this.nodeCloseButton = goog.dom.getElement(this.prefix + 'close');
  goog.events.listen(this.nodeCloseButton, goog.events.EventType.CLICK,
    this.requestCloseWindow, false, this);

  // Serial body
  this.nodeSerialBody = goog.dom.getElement(this.prefix + 'serial-body');
  goog.style.setElementShown(this.nodeSerialBody,
    this.helper.checkChromeFeature('serial'));

  // Serial enabled
  this.nodeSerial = goog.dom.getElement(this.prefix + 'serial');
  goog.events.listen(this.nodeSerial, goog.events.EventType.CLICK, function() {
    let connectScreenInstance = this.helper.getInstance('connectScreen');
    connectScreenInstance.showSerialDevices();
  }, false, this);

  // Serial connected
  this.nodeSerialConnected = goog.dom.getElement(
    this.prefix + 'serial-connected');
  goog.events.listen(this.nodeSerialConnected, goog.events.EventType.CLICK,
    function() {
      let connectScreenInstance = this.helper.getInstance('connectScreen');
      connectScreenInstance.showSerialDevices();
    }, false, this);

  // Serial disabled
  this.nodeSerialDisabled = goog.dom.getElement(
    this.prefix + 'serial-disabled');

  if (this.helper.checkChromeFeature('serial')) {
    this.setSerialEnabled(true);
  }

  // Minimize icon
  this.nodeMinimizeButton = goog.dom.getElement(this.prefix + 'minimize');
  goog.events.listen(this.nodeMinimizeButton, goog.events.EventType.CLICK,
    this.minimizeWindow, false, this);

  // Maximize icon
  this.nodeMaximizeButton = goog.dom.getElement(this.prefix + 'maximize');
  goog.events.listen(this.nodeMaximizeButton, goog.events.EventType.CLICK,
    this.maximizeWindow, false, this);

  // Restore icon
  this.nodeRestoreButton = goog.dom.getElement(this.prefix + 'restore');
  goog.events.listen(this.nodeRestoreButton, goog.events.EventType.CLICK,
    this.restoreWindow, false, this);

  if (this.isChromeApp_) {
    this.currentWindow = chrome.app.window.current();
    goog.style.setElementShown(this.nodeMaximizeButton,
      !this.currentWindow['isMaximized']());
    goog.style.setElementShown(this.nodeRestoreButton,
      this.currentWindow['isMaximized']());
  } else {
    goog.style.setElementShown(this.nodeCloseButton, false);
    goog.style.setElementShown(this.nodeMaximizeButton, false);
    goog.style.setElementShown(this.nodeRestoreButton, false);
  }
};


/**
 * Sets authentication for the current view.
 * @param {boolean} auth Determinate if user is authenticated.
 */
cwc.ui.Menubar.prototype.setAuthenticated = function(auth) {
  goog.style.setElementShown(this.nodeAccountLogin, !auth);
  goog.style.setElementShown(this.nodeAccountLogout, auth);
};


/**
 * Logs in into Google Account for gDrive integration.
 */
cwc.ui.Menubar.prototype.loginAccount = function() {
  let accountInstance = this.helper.getInstance('account', true);
  accountInstance.authenticate();
};


/**
 * Logs out of current Google Account.
 */
cwc.ui.Menubar.prototype.logoutAccount = function() {
  let accountInstance = this.helper.getInstance('account', true);
  accountInstance.deauthenticate();
};


/**
 * Shows new file dialog.
 */
cwc.ui.Menubar.prototype.requestShowSelectScreen = function() {
  let selectScreenInstance = this.helper.getInstance('selectScreen');
  if (selectScreenInstance) {
    selectScreenInstance.requestShowSelectScreen();
  }
};


/**
 * Request to close the editor window.
 */
cwc.ui.Menubar.prototype.requestCloseWindow = function() {
  this.helper.handleUnsavedChanges(this.closeWindow.bind(this));
};


/**
 * Close editor window.
 */
cwc.ui.Menubar.prototype.closeWindow = function() {
  console.log('Close Coding with Chrome editor ...');
  let bluetoothInstance = this.helper.getInstance('bluetooth');
  if (bluetoothInstance) {
    bluetoothInstance.closeSockets();
  }
  this.currentWindow['close']();
};


/**
 * Minimize editor window.
 */
cwc.ui.Menubar.prototype.minimizeWindow = function() {
  this.currentWindow['minimize']();
  let editorWindow = chrome.app.window.get('editor');
  if (editorWindow) {
    editorWindow['drawAttention']();
  }
};


/**
 * Maximize editor window.
 */
cwc.ui.Menubar.prototype.maximizeWindow = function() {
  this.currentWindow['maximize']();
  goog.style.setElementShown(this.nodeMaximizeButton, false);
  goog.style.setElementShown(this.nodeRestoreButton, true);
};


/**
 * Restore editor window.
 */
cwc.ui.Menubar.prototype.restoreWindow = function() {
  this.currentWindow['restore']();
  goog.style.setElementShown(this.nodeMaximizeButton, true);
  goog.style.setElementShown(this.nodeRestoreButton, false);
};


/**
 * @param {boolean} enabled Determine if Bluetooth is enabled.
 * @export
 */
cwc.ui.Menubar.prototype.setBluetoothEnabled = function(enabled) {
  if (this.helper.checkChromeFeature('bluetooth')) {
    if (this.bluetooth != enabled) {
      console.log('Set Bluetooth to', enabled ? 'enabled' : 'disabled');
    }
    goog.style.setElementShown(this.nodeBluetooth, enabled);
    goog.style.setElementShown(this.nodeBluetoothConnected, false);
    goog.style.setElementShown(this.nodeBluetoothDisabled, !enabled);
  }
  this.bluetooth = enabled;
};


/**
 * @param {boolean} connected Determine if any Bluetooth devices are connected.
 * @export
 */
cwc.ui.Menubar.prototype.setBluetoothConnected = function(connected) {
  if (this.helper.checkChromeFeature('bluetooth') && this.bluetooth) {
    if (this.bluetoothConnectStatus != connected) {
      console.log('Set Bluetooth status to',
        connected ? 'connected' : 'disconnected');
    }
    goog.style.setElementShown(this.nodeBluetooth, !connected);
    goog.style.setElementShown(this.nodeBluetoothConnected, connected);
    goog.style.setElementShown(this.nodeBluetoothDisabled, false);
  } else {
    this.setBluetoothEnabled(false);
  }
  this.bluetoothConnectStatus = connected;
};


/**
 * @param {Event=} opt_event
 * @private
 */
cwc.ui.Menubar.prototype.checkBluetoothState_ = function(opt_event) {
  this.helper.showInfo('Checking bluetooth state ...');
  let bluetoothInstance = this.helper.getInstance('bluetooth');
  if (bluetoothInstance) {
    bluetoothInstance.updateAdapterState();
  }
};


/**
 * @param {boolean} enabled
 * @export
 */
cwc.ui.Menubar.prototype.setSerialEnabled = function(enabled) {
  if (this.helper.checkChromeFeature('serial')) {
    if (this.serial != enabled) {
      console.log('Set Serial to', enabled ? 'enabled' : 'disabled');
    }
    goog.style.setElementShown(this.nodeSerial, enabled);
    goog.style.setElementShown(this.nodeSerialConnected, false);
    goog.style.setElementShown(this.nodeSerialDisabled, !enabled);
  }
  this.serial = enabled;
};


/**
 * @param {boolean} connected
 * @export
 */
cwc.ui.Menubar.prototype.setSerialConnected = function(connected) {
  if (this.helper.checkChromeFeature('serial') && this.serial) {
    if (this.serialConnectStatus != connected) {
      console.log('Set Serial status to',
        connected ? 'connected' : 'disconnected');
    }
    goog.style.setElementShown(this.nodeSerial, !connected);
    goog.style.setElementShown(this.nodeSerialConnected, connected);
    goog.style.setElementShown(this.nodeSerialDisabled, false);
  } else {
    this.setSerialEnabled(false);
  }
  this.serialConnectStatus = connected;
};
