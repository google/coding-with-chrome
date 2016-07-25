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
  this.prefix = 'menubar-';

  /** @type {string} */
  this.generalPrefix = this.helper.getPrefix();

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeHelp = null;

  /** @type {Element} */
  this.nodeAccountLogin = null;

  /** @type {Element} */
  this.nodeAccountLogout = null;

  /** @type {Element} */
  this.nodeBluetooth = null;

  /** @type {Element} */
  this.nodeBluetoothConnected = null;

  /** @type {Element} */
  this.nodeBluetoothDisabled = null;

  /** @type {Element} */
  this.nodeUsb = null;

  /** @type {Element} */
  this.nodeCloseButton = null;

  /** @type {Element} */
  this.nodeSettings = null;

  /** @type {Element} */
  this.nodeMinimizeButton = null;

  /** @type {Element} */
  this.nodeMaximizeButton = null;

  /** @type {Element} */
  this.nodeRestoreButton = null;

  /** @type {boolean} */
  this.bluetooth = null;

  /** @type {boolean} */
  this.bluetoothConnectStatus = null;

  /** @type {chrome.app.window.AppWindow} */
  this.currentWindow =  null;

  /** @type {!goog.ui.Button} */
  this.closeButton = cwc.ui.Helper.getIconButton(
      'close', 'Close', this.requestCloseWindow.bind(this));

  /** @type {!goog.ui.Button} */
  this.minimizeButton = cwc.ui.Helper.getIconButton(
      'photo_size_select_small', 'minimize', this.minimizeWindow.bind(this));

  /** @type {!goog.ui.Button} */
  this.maximizeButton = cwc.ui.Helper.getIconButton(
      'fullscreen', 'maximize', this.maximizeWindow.bind(this));

  /** @type {!goog.ui.Button} */
  this.restoreButton = cwc.ui.Helper.getIconButton(
      'fullscreen_exit', 'restore', this.restoreWindow.bind(this));

  /** @type {!goog.ui.Button} */
  this.accountLogin = cwc.ui.Helper.getIconButton(
      'perm_identity', 'Login', this.loginAccount.bind(this));

  /** @type {!goog.ui.Button} */
  this.accountLogout = cwc.ui.Helper.getIconButton(
      'person', 'Logout', this.logoutAccount.bind(this));

  /** @type {!goog.ui.Button} */
  this.bluetoothMenu = cwc.ui.Helper.getIconButton('bluetooth',
      'Connect Bluetooth device …');

  /** @type {!goog.ui.Button} */
  this.bluetoothConnected = cwc.ui.Helper.getIconButton(
      'bluetooth_connected', 'Disconnect Bluetooth device …');

  /** @type {!goog.ui.Button} */
  this.bluetoothDisabled = cwc.ui.Helper.getIconButton(
      'bluetooth_disabled', 'Bluetooth is disabled!',
      this.checkBluetoothState_.bind(this));

  /** @type {!goog.ui.Button} */
  this.usbMenu = cwc.ui.Helper.getIconButton('usb', 'Connect USB device …');

  /** @private {!boolean} */
  this.isChromeApp_ = this.helper.checkChromeFeature('app.window');
};


/**
 * Decorates the given node and adds the menu bar.
 * @param {Element} node The target node to add the menu bar.
 * @param {string=} opt_prefix Additional prefix for the ids of the
 *    inserted elements and style definitions.
 * @export
 */
cwc.ui.Menubar.prototype.decorate = function(node, opt_prefix) {
  this.node = node;
  this.prefix = opt_prefix + this.prefix;

  goog.soy.renderElement(
      this.node,
      cwc.soy.Menubar.menubarTemplate,
      {'prefix': this.prefix}
  );

  goog.style.installStyles(
      cwc.soy.Menubar.menubarStyle({ 'prefix': this.prefix })
  );

  // Bluetooth icons
  if (this.helper.checkChromeFeature('bluetooth')) {

    // Bluetooth enabled
    this.nodeBluetooth = goog.dom.getElement(this.prefix + 'bluetooth');
    this.bluetoothMenu.render(this.nodeBluetooth);
    goog.events.listen(this.nodeBluetooth, goog.events.EventType.CLICK,
      function() {
        var connectScreenInstance = this.helper.getInstance('connectScreen');
        connectScreenInstance.showBluetoothDevices();
      }.bind(this));

    // Bluetooth connected
    this.nodeBluetoothConnected = goog.dom.getElement(
        this.prefix + 'bluetooth-connected');
    this.bluetoothConnected.render(this.nodeBluetoothConnected);
    goog.events.listen(this.nodeBluetoothConnected, goog.events.EventType.CLICK,
      function() {
        var connectScreenInstance = this.helper.getInstance('connectScreen');
        connectScreenInstance.showBluetoothDevices();
      }.bind(this));

    // Bluetooth disabled
    this.nodeBluetoothDisabled = goog.dom.getElement(
        this.prefix + 'bluetooth-disabled');
    this.bluetoothDisabled.render(this.nodeBluetoothDisabled);
  }

  // USB and serial icon
  if (this.helper.checkChromeFeature('serial') &&
      this.helper.checkChromeFeature('usb')) {
    //this.usbMenu = new cwc.ui.usbMenu(this.helper);
    this.nodeUsbEnabled = goog.dom.getElement(this.prefix + 'usb-enabled');
  }

  // Account icons
  if (this.helper.checkChromeFeature('manifest.oauth2')) {
    this.nodeAccountLogin = goog.dom.getElement(
        this.prefix + 'account');
    this.accountLogin.render(this.nodeAccountLogin);

    this.nodeAccountLogout = goog.dom.getElement(
        this.prefix + 'account-logout');
    this.accountLogout.render(this.nodeAccountLogout);
  }

  if (this.isChromeApp_) {
    this.currentWindow =  chrome.app.window.current();

    // Minimize icon
    this.nodeMinimizeButton = goog.dom.getElement(this.prefix + 'minimize');
    this.minimizeButton.render(this.nodeMinimizeButton);

    // Maximize icon
    this.nodeMaximizeButton = goog.dom.getElement(this.prefix + 'maximize');
    this.maximizeButton.render(this.nodeMaximizeButton);

    // Restore icon
    this.nodeRestoreButton = goog.dom.getElement(this.prefix + 'restore');
    this.restoreButton.render(this.nodeRestoreButton);
    goog.style.setElementShown(this.nodeMaximizeButton,
      !this.currentWindow['isMaximized']());
    goog.style.setElementShown(this.nodeRestoreButton,
      this.currentWindow['isMaximized']());

    // Close icon
    this.nodeCloseButton = goog.dom.getElement(this.prefix + 'close');
    this.closeButton.render(this.nodeCloseButton);
  }
};


/**
 * Sets authentication for the current view.
 * @param {boolean} auth Determinate if user is authenticated.
 */
cwc.ui.Menubar.prototype.setAuthenticated = function(auth) {
  if (this.fileMenu) {
    this.fileMenu.setAuthenticated(auth);
  }
  goog.style.setElementShown(this.nodeAccountLogin, !auth);
  goog.style.setElementShown(this.nodeAccountLogout, auth);
};


/**
 * Logs in into Google Account for gDrive integration.
 */
cwc.ui.Menubar.prototype.loginAccount = function() {
  var accountInstance = this.helper.getInstance('account', true);
  accountInstance.authenticate();
};


/**
 * Logs out of current Google Account.
 */
cwc.ui.Menubar.prototype.logoutAccount = function() {
  var accountInstance = this.helper.getInstance('account', true);
  accountInstance.deauthenticate();
};


/**
 * Shows new file dialog.
 */
cwc.ui.Menubar.prototype.requestShowSelectScreen = function() {
  var selectScreenInstance = this.helper.getInstance('selectScreen');
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
  var bluetoothInstance = this.helper.getInstance('bluetooth');
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
  var editorWindow = chrome.app.window.get('editor');
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
    goog.style.setElementShown(this.nodeBluetooth, false);
    goog.style.setElementShown(this.nodeBluetoothConnected, false);
    goog.style.setElementShown(this.nodeBluetoothDisabled, true);
  }
  this.bluetoothConnectStatus = connected;
};


/**
 * @param {Event=} opt_event
 * @private
 */
cwc.ui.Menubar.prototype.checkBluetoothState_ = function(opt_event) {
  this.helper.showInfo('Checking bluetooth state ...');
  var bluetoothInstance = this.helper.getInstance('bluetooth');
  if (bluetoothInstance) {
    bluetoothInstance.updateAdapterState();
  }
};
