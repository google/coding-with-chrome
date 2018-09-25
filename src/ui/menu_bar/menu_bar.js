/**
 * @fileoverview Menu Bar for the Coding with Chrome editor.
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
goog.provide('cwc.ui.MenuBar');

goog.require('cwc.soy.MenuBar');
goog.require('cwc.ui.MenuBarBluetooth');
goog.require('cwc.ui.MenuBarBluetoothWeb');
goog.require('cwc.ui.MenuBarGamepad');
goog.require('cwc.ui.MenuBarUsb');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');

goog.require('goog.dom');
goog.require('goog.dom.fullscreen');
goog.require('goog.soy');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.MenuBar = function(helper) {
  /** @type {string} */
  this.name = 'Menu Bar';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('menu-bar');

  /** @type {!cwc.ui.MenuBarBluetooth} */
  this.menuBarBluetooth = new cwc.ui.MenuBarBluetooth(this.helper);

  /** @type {!cwc.ui.MenuBarBluetoothWeb} */
  this.menuBarBluetoothWeb = new cwc.ui.MenuBarBluetoothWeb(this.helper);

  /** @type {!cwc.ui.MenuBarGamepad} */
  this.menuBarGamepad = new cwc.ui.MenuBarGamepad(this.helper);

  /** @type {!cwc.ui.MenuBarUsb} */
  this.menuBarUsb = new cwc.ui.MenuBarUsb(this.helper);

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeAccountLogin = null;

  /** @type {Element} */
  this.nodeAccountLogout = null;

  /** @type {Element} */
  this.nodeMaximizeButton = null;

  /** @type {Element} */
  this.nodeRestoreButton = null;

  /** @type {Element} */
  this.nodeServices = null;

  /** @private {boolean} */
  this.isChromeApp_ = this.helper.checkChromeFeature('app');

  /** @private {boolean} */
  this.isChromeOS_ = this.helper.checkChromeFeature('os');

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix, this);

  /** @type {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Decorates the given node and adds the menu bar.
 * @param {Element} node The target node to add the menu bar.
 */
cwc.ui.MenuBar.prototype.decorate = function(node) {
  this.log_.info('Derocate into', node);
  this.node = node;

  goog.soy.renderElement(
    this.node,
    cwc.soy.MenuBar.template, {
      'prefix': this.prefix,
      'language': this.helper.getUserLanguage(),
    }
  );

  this.decorateApiButton();
  this.decorateHardwareButton();
  this.decorateGuiButton();
};


cwc.ui.MenuBar.prototype.decorateApiButton = function() {
  // Account body
  goog.style.setElementShown(goog.dom.getElement(this.prefix + 'account-body'),
    !this.isChromeOS_ && this.helper.checkChromeFeature('manifest.oauth2'));

  // Account login
  this.nodeAccountLogin = goog.dom.getElement(this.prefix + 'account');
  this.events_.listen(this.nodeAccountLogin, goog.events.EventType.CLICK,
    this.loginAccount, false, this);

  // Account logout
  this.nodeAccountLogout = goog.dom.getElement(this.prefix + 'account-logout');
  this.events_.listen(this.nodeAccountLogout, goog.events.EventType.CLICK,
    this.logoutAccount);
};


cwc.ui.MenuBar.prototype.decorateHardwareButton = function() {
  this.nodeServices = goog.dom.getElement(this.prefix + 'services-body');
  this.menuBarBluetooth.decorate();
  this.menuBarBluetoothWeb.decorate();
  this.menuBarGamepad.decorate();
  this.menuBarUsb.decorate();
};


cwc.ui.MenuBar.prototype.decorateGuiButton = function() {
  // Close button
  let nodeCloseButton = goog.dom.getElement(this.prefix + 'close');
  this.events_.listen(nodeCloseButton, goog.events.EventType.CLICK,
    this.closeWindow);

  // Language icon
  this.events_.listen(
    'language', goog.events.EventType.CLICK, this.changeLanguage);

  // Minimize icon
  let nodeMinimizeButton = goog.dom.getElement(this.prefix + 'minimize');
  this.events_.listen(
    nodeMinimizeButton, goog.events.EventType.CLICK, this.minimizeWindow);

  // Maximize icon
  this.nodeMaximizeButton = goog.dom.getElement(this.prefix + 'maximize');
  this.events_.listen(
    this.nodeMaximizeButton, goog.events.EventType.CLICK, () => {
      let guiInstance = this.helper.getInstance('gui');
      if (guiInstance) {
        guiInstance.setFullscreen(true);
      }
    });

  // Restore icon
  this.nodeRestoreButton = goog.dom.getElement(this.prefix + 'restore');
  this.events_.listen(
    this.nodeRestoreButton, goog.events.EventType.CLICK, () => {
      let guiInstance = this.helper.getInstance('gui');
      if (guiInstance) {
        guiInstance.setFullscreen(false);
      }
    });

  // Shows maximize / restore icon based on available fullscreen support.
  if (this.isChromeApp_ && chrome.app.window) {
    this.setFullscreen(chrome.app.window.current()['isFullscreen']());
  } else if (goog.dom.fullscreen.isSupported()) {
    this.setFullscreen(goog.dom.fullscreen.isFullScreen());
  } else {
    goog.style.setElementShown(this.nodeMaximizeButton, false);
    goog.style.setElementShown(this.nodeRestoreButton, false);
  }

  // Fullscreen listener.
  if (this.isChromeApp_ && chrome.app.window) {
    chrome.app.window.current().onFullscreened.addListener(() => {
      this.setFullscreen(true);
    });
    chrome.app.window.current().onRestored.addListener(() => {
      this.setFullscreen(false);
    });
  } else if (goog.dom.fullscreen.isSupported()) {
    this.events_.listen(window, goog.dom.fullscreen.EventType.CHANGE, () => {
      this.setFullscreen(goog.dom.fullscreen.isFullScreen());
    });
  }

  // Show specific buttons for Chrome Apps only!
  if (!this.isChromeApp_) {
    goog.style.setElementShown(nodeCloseButton, false);
    goog.style.setElementShown(nodeMinimizeButton, false);
  }
};


/**
 * @param {boolean} visible
 */
cwc.ui.MenuBar.prototype.showServices = function(visible) {
  if (this.nodeServices) {
    goog.style.setElementShown(this.nodeServices, visible);
  }
};


/**
 * @param {boolean} visible
 */
cwc.ui.MenuBar.prototype.showBluetooth = function(visible) {
  if (this.menuBarBluetooth) {
    this.menuBarBluetooth.show(visible);
  }
};


/**
 * @param {boolean} visible
 */
cwc.ui.MenuBar.prototype.showBluetoothWeb = function(visible) {
  if (this.menuBarBluetoothWeb) {
    this.menuBarBluetoothWeb.show(visible);
  }
};


/**
 * @param {boolean} visible
 */
cwc.ui.MenuBar.prototype.showGamepad = function(visible) {
  if (this.menuBarGamepad) {
    this.menuBarGamepad.show(visible);
  }
};


/**
 * @param {boolean} visible
 */
cwc.ui.MenuBar.prototype.showUsb = function(visible) {
  if (this.menuBarUsb) {
    this.menuBarUsb.show(visible);
  }
};


/**
 * @param {Function} func
 */
cwc.ui.MenuBar.prototype.setBluetoothWebHandler = function(func) {
  if (this.menuBarBluetoothWeb && func) {
    this.menuBarBluetoothWeb.setClickHandler(func);
  }
};


/**
 * Changes the language.
 */
cwc.ui.MenuBar.prototype.changeLanguage = function() {
  this.helper.getInstance('language').selectLanguage();
};


/**
 * Sets authentication for the current view.
 * @param {boolean} auth Determinate if user is authenticated.
 */
cwc.ui.MenuBar.prototype.setAuthenticated = function(auth) {
  goog.style.setElementShown(this.nodeAccountLogin, !auth);
  goog.style.setElementShown(this.nodeAccountLogout, auth);
};


/**
 * Logs in into Google Account for gDrive integration.
 */
cwc.ui.MenuBar.prototype.loginAccount = function() {
  this.helper.getInstance('account').authenticate();
};


/**
 * Logs out of current Google Account.
 */
cwc.ui.MenuBar.prototype.logoutAccount = function() {
  this.helper.getInstance('account').deauthenticate();
};


/**
 * Shows new file dialog.
 */
cwc.ui.MenuBar.prototype.requestShowSelectScreen = function() {
  let selectScreenInstance = this.helper.getInstance('selectScreen');
  if (selectScreenInstance) {
    selectScreenInstance.requestShowSelectScreen();
  }
};


/**
 * Request to close the editor window.
 */
cwc.ui.MenuBar.prototype.closeWindow = function() {
  let guiInstance = this.helper.getInstance('gui');
  if (guiInstance) {
    guiInstance.requestClose();
  }
};


/**
 * Minimize editor window.
 */
cwc.ui.MenuBar.prototype.minimizeWindow = function() {
  let guiInstance = this.helper.getInstance('gui');
  if (guiInstance) {
    guiInstance.minimize();
  }
};


/**
 * @param {boolean} fullscreen
 */
cwc.ui.MenuBar.prototype.setFullscreen = function(fullscreen) {
  goog.style.setElementShown(this.nodeMaximizeButton, !fullscreen);
  goog.style.setElementShown(this.nodeRestoreButton, fullscreen);
};


/**
 * @param {string} language
 */
cwc.ui.MenuBar.prototype.setLanguage = function(language) {
  goog.dom.getElement(this.prefix + 'badge-language').dataset.badge = language;
};


/**
 * Cleans up the event listener and any other modification.
 * @private
 */
cwc.ui.MenuBar.prototype.cleanUp_ = function() {
  this.events_.clear();
};
