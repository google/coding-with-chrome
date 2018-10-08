/**
 * @fileoverview Usb Menu Bar for the Coding with Chrome editor.
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
goog.provide('cwc.ui.MenuBarUsb');

goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.MenuBarUsb = function(helper) {
  /** @type {string} */
  this.name = 'Menu Bar Usb';

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
  this.serial = undefined;

  /** @type {boolean|undefined} */
  this.serialConnectStatus = undefined;

  /** @private {boolean} */
  this.isChromeApp_ = this.helper.checkChromeFeature('app');

  /** @private {boolean} */
  this.isChromeOS_ = this.helper.checkChromeFeature('os');

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix, this);

  /** @type {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


cwc.ui.MenuBarUsb.prototype.decorate = function() {
  // Bluetooth body
  this.show();

  // Serial enabled
  this.node = goog.dom.getElement(this.prefix + 'serial');
  this.events_.listen(this.node, goog.events.EventType.CLICK, function() {
    let connectScreenInstance = this.helper.getInstance('connectScreen');
    connectScreenInstance.showSerialDevices();
  });

  // Serial connected
  this.nodeConnected = goog.dom.getElement(
    this.prefix + 'serial-connected');
  this.events_.listen(this.nodeConnected, goog.events.EventType.CLICK,
    function() {
      let connectScreenInstance = this.helper.getInstance('connectScreen');
      connectScreenInstance.showSerialDevices();
    });

  // Serial disabled
  this.nodeDisabled = goog.dom.getElement(
    this.prefix + 'serial-disabled');

  if (this.helper.checkChromeFeature('serial')) {
    this.setSerialEnabled(true);
  }
};

/**
 * @param {boolean=} visible
 */
cwc.ui.MenuBarUsb.prototype.show = function(visible = true) {
  goog.style.setElementShown(
    goog.dom.getElement(this.prefix + 'serial-body'),
    this.helper.checkChromeFeature('serial') && visible);
};


/**
 * @param {boolean} enabled
 */
cwc.ui.MenuBarUsb.prototype.setSerialEnabled = function(enabled) {
  if (this.helper.checkChromeFeature('serial')) {
    if (this.serial != enabled) {
      this.log_.info('Set Serial to', enabled ? 'enabled' : 'disabled');
    }
    goog.style.setElementShown(this.node, enabled);
    goog.style.setElementShown(this.nodeConnected, false);
    goog.style.setElementShown(this.nodeDisabled, !enabled);
  }
  this.serial = enabled;
};


/**
 * @param {boolean} connected
 */
cwc.ui.MenuBarUsb.prototype.setSerialConnected = function(connected) {
  if (this.helper.checkChromeFeature('serial') && this.serial) {
    if (this.serialConnectStatus != connected) {
      this.log_.info('Set Serial status to',
        connected ? 'connected' : 'disconnected');
    }
    goog.style.setElementShown(this.node, !connected);
    goog.style.setElementShown(this.nodeConnected, connected);
    goog.style.setElementShown(this.nodeDisabled, false);
  } else {
    this.setSerialEnabled(false);
  }
  this.serialConnectStatus = connected;
};


/**
 * Cleans up the event listener and any other modification.
 * @private
 */
cwc.ui.MenuBarUsb.prototype.cleanUp_ = function() {
  this.events_.clear();
};
