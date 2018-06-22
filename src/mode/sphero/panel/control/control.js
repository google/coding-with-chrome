/**
 * @fileoverview Control pane for the Sphero modification.
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
goog.provide('cwc.mode.sphero.Control');

goog.require('cwc.soy.mode.sphero.Control');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Gamepad.Events');

goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.KeyboardShortcutHandler');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {!cwc.mode.sphero.classic.Connection|
 *   cwc.mode.sphero.bb8.Connection|
 *   cwc.mode.sphero.sprkPlus.Connection|
 *   cwc.mode.sphero.ollie.Connection} connection
 */
cwc.mode.sphero.Control = function(helper, connection) {
  /** @type {string} */
  this.name = 'Sphero Control';

  /** @type {string} */
  this.prefix = helper.getPrefix('sphero-control');

  /** @type {Element} */
  this.node = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /**
   * @type {!cwc.mode.sphero.classic.Connection|
   *   cwc.mode.sphero.bb8.Connection|
   *   cwc.mode.sphero.sprkPlus.Connection|
   *   cwc.mode.sphero.ollie.Connection}
   */
  this.connection = connection;

  /** @type {!cwc.protocol.sphero.classic.Api} */
  this.api = this.connection.getApi();

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix, this);

  /** @private {cwc.ui.Message} */
  this.messageInstance_ = null;
};


/**
 * Decorates the Sphero Control window.
 * @param {!Element} node
 * @export
 */
cwc.mode.sphero.Control.prototype.decorate = function(node) {
  this.node = node;

  goog.soy.renderElement(
    this.node,
    cwc.soy.mode.sphero.Control.template, {
      prefix: this.prefix,
    }
  );

  this.messageInstance_ = this.helper.getInstance('message');

  this.addEventHandler_();
  this.addGamepadHandler_();
  this.addKeyHandler_();
};


/**
 * @private
 */
cwc.mode.sphero.Control.prototype.addEventHandler_ = function() {
  // Movements
  this.events_.listen('move-left', goog.events.EventType.CLICK, function() {
    this.api.exec('roll', {'speed': 50, 'heading': 270});
  });

  this.events_.listen('move-forward', goog.events.EventType.CLICK,
    function() {
      this.api.exec('roll', {'speed': 50, 'heading': 0});
  });

  this.events_.listen('move-backward', goog.events.EventType.CLICK,
    function() {
      this.api.exec('roll', {'speed': 50, 'heading': 180});
  });

  this.events_.listen('move-right', goog.events.EventType.CLICK, function() {
    this.api.exec('roll', {'speed': 50, 'heading': 90});
  });

  // Stop
  this.events_.listen('stop', goog.events.EventType.CLICK, function() {
    this.connection.stop();
  });

  // Sleep
  this.events_.listen('sleep', goog.events.EventType.CLICK, function() {
    this.api.exec('sleep');
  });
};


/**
 * @private
 */
cwc.mode.sphero.Control.prototype.addGamepadHandler_ = function() {
  let eventHandler = this.helper.getInstance('gamepad').getEventHandler();
  let gamepad = this.helper.getInstance('gamepad');
  this.events_.listen(eventHandler, cwc.utils.Gamepad.Events.Type.BUTTON[7],
    (event) => {
      this.api.exec('roll', {
        'speed': event.data * 255, 'heading': gamepad.getLeftAxisAngle()});
  });
  this.events_.listen(eventHandler, cwc.utils.Gamepad.Events.Type.BUTTON[6],
    () => {
      this.api.exec('rollStop');
  });
  this.events_.listen(eventHandler, cwc.utils.Gamepad.Events.Type.BUTTON[0],
    () => {
      this.api.exec('setRGB', {'green': 255});
  });
  this.events_.listen(eventHandler, cwc.utils.Gamepad.Events.Type.BUTTON[1],
    () => {
      this.api.exec('setRGB', {'red': 255});
  });
  this.events_.listen(eventHandler, cwc.utils.Gamepad.Events.Type.BUTTON[2],
    () => {
      this.api.exec('setRGB', {'blue': 255});
  });
  this.events_.listen(eventHandler, cwc.utils.Gamepad.Events.Type.BUTTON[3],
    () => {
      this.api.exec('setRGB');
  });
};


/**
 * @private
 */
cwc.mode.sphero.Control.prototype.addKeyHandler_ = function() {
  let shortcutHandler = new goog.ui.KeyboardShortcutHandler(document);
  shortcutHandler.registerShortcut('backward', 'down');
  shortcutHandler.registerShortcut('left', 'left');
  shortcutHandler.registerShortcut('right', 'right');
  shortcutHandler.registerShortcut('forward', 'up');

  shortcutHandler.registerShortcut('boost-backward', 'shift+down');
  shortcutHandler.registerShortcut('boost-left', 'shift+left');
  shortcutHandler.registerShortcut('boost-right', 'shift+right');
  shortcutHandler.registerShortcut('boost-forward', 'shift+up');

  shortcutHandler.registerShortcut('stop', 'space');

  this.events_.listen(shortcutHandler,
    goog.ui.KeyboardShortcutHandler.EventType.SHORTCUT_TRIGGERED,
    this.handleKeyboardShortcut_);
};


/**
 * Handles keyboard shortcuts.
 * @param {goog.events.EventLike} event
 * @private
 */
cwc.mode.sphero.Control.prototype.handleKeyboardShortcut_ = function(event) {
  if (!this.messageInstance_.isControlActive() &&
      !this.messageInstance_.isMonitorActive() ||
      event.target.tagName === 'INPUT') {
    return;
  }

  let normalSpeed = 50;
  let boostedSpeed = 255;

  switch (event.identifier) {
    // Normal speed
    case 'forward':
      this.api.exec('roll', {'speed': normalSpeed, 'heading': 0});
      break;
    case 'right':
      this.api.exec('roll', {'speed': normalSpeed, 'heading': 90});
      break;
    case 'backward':
      this.api.exec('roll', {'speed': normalSpeed, 'heading': 180});
      break;
    case 'left':
      this.api.exec('roll', {'speed': normalSpeed, 'heading': 270});
      break;

    // Boosted speed
    case 'boost-forward':
      this.api.exec('roll', {'speed': boostedSpeed, 'heading': 0});
      break;
    case 'boost-right':
      this.api.exec('roll', {'speed': boostedSpeed, 'heading': 90});
      break;
    case 'boost-backward':
      this.api.exec('roll', {'speed': boostedSpeed, 'heading': 180});
      break;
    case 'boost-left':
      this.api.exec('roll', {'speed': boostedSpeed, 'heading': 270});
      break;

    case 'stop':
      this.api.exec('boost', {'enable': false});
      this.api.exec('rollStop');
      break;
    default:
      console.info(event.identifier);
  }
};
