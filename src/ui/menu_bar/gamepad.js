/**
 * @fileoverview Gamepad Menu Bar for the Coding with Chrome editor.
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
goog.provide('cwc.ui.MenuBarGamepad');


goog.require('cwc.utils.Gamepad.Events');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.MenuBarGamepad = function(helper) {
  /** @type {string} */
  this.name = 'Menu Bar Gamepad';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('menu-bar');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeConnected = null;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix, this);

  /** @type {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};

/**
 *
 */
cwc.ui.MenuBarGamepad.prototype.decorate = function() {
  this.show();

  let dialogInstance = this.helper.getInstance('dialog');

  // Gamepad
  let gamepadInstance = this.helper.getInstance('gamepad');
  this.node = goog.dom.getElement(this.prefix + 'gamepad');
  this.events_.listen(
    this.node, goog.events.EventType.CLICK, () => {
      dialogInstance.showAlert('Enable Gamepad support',
        'Please turn on the Gamepad and press any of the buttons.');
    });
  this.events_.listen(gamepadInstance.getEventTarget(),
    /** @type {string} */ (cwc.utils.Gamepad.Events.Type.CONNECTED), () => {
      dialogInstance.close('Enable Gamepad support');
      this.setGamepad(true);
    });
  this.events_.listen(gamepadInstance.getEventTarget(),
    /** @type {string} */ (cwc.utils.Gamepad.Events.Type.DISCONNECTED), () => {
      this.setGamepad(false);
    });
  this.nodeConnected = goog.dom.getElement(
    this.prefix + 'gamepad-connected');
  this.setGamepad(false);
};


/**
 * @param {boolean=} visible
 */
cwc.ui.MenuBarGamepad.prototype.show = function(visible = true) {
  goog.style.setElementShown(
    goog.dom.getElement(this.prefix + 'gamepad-body'),
    this.helper.checkBrowserFeature('Gamepad') && visible);
};


/**
 * @param {boolean} connected
 */
cwc.ui.MenuBarGamepad.prototype.setGamepad = function(connected) {
  goog.style.setElementShown(this.node, !connected);
  goog.style.setElementShown(this.nodeConnected, connected);
};
