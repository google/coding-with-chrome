/**
 * @fileoverview Control layout for the mbot modification.
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
goog.provide('cwc.mode.makeblock.mbotRanger.Control');

goog.require('cwc.soy.mode.makeblock.mbotRanger.Control');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Gamepad.Events');

goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.KeyboardShortcutHandler');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {!cwc.mode.makeblock.mbotRanger.Connection} connection
 */
cwc.mode.makeblock.mbotRanger.Control = function(helper, connection) {
  /** @type {string} */
  this.name = 'mBot Ranger Control';

  /** @type {string} */
  this.prefix = helper.getPrefix('mbot-ranger-control');

  /** @type {Element} */
  this.node = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.mode.makeblock.mbotRanger.Connection} */
  this.connection = connection;

  /** @type {!cwc.protocol.makeblock.mbotRanger.Api} */
  this.api = this.connection.getApi();

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix, this);

  /** @private {cwc.ui.Message} */
  this.messageInstance_ = null;

  /** @private {number} */
  this.normalSpeed_ = 85;

  /** @private {number} */
  this.boostedSpeed_ = 130;
};


/**
 * Decorates the mBot Ranger Control window.
 * @param {!Element} node
 * @export
 */
cwc.mode.makeblock.mbotRanger.Control.prototype.decorate = function(node) {
  this.node = node;

  goog.soy.renderElement(
    this.node,
    cwc.soy.mode.makeblock.mbotRanger.Control.template, {
      prefix: this.prefix,
    }
  );

  this.messageInstance_ = this.helper.getInstance('message');

  this.addEventHandler_();
  this.addGamepadHandler_();
  this.addKeyHandler_();
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.makeblock.mbotRanger.Control.prototype.cleanUp = function() {
  if (this.connectMonitor) {
    this.connectMonitor.stop();
  }
  this.events_.clear();
};


/**
 * @private
 */
cwc.mode.makeblock.mbotRanger.Control.prototype.addEventHandler_ = function() {
  // Movements
  this.events_.listen('move-left', goog.events.EventType.CLICK, function() {
    this.api.exec('rotatePower', {'power': -this.normalSpeed_});
  }, false, this);

  this.events_.listen('move-forward', goog.events.EventType.CLICK, function() {
    this.api.exec('movePower', {'power': this.normalSpeed_});
  }, false, this);

  this.events_.listen('move-backward', goog.events.EventType.CLICK, function() {
    this.api.exec('movePower', {'power': -this.normalSpeed_});
  }, false, this);

  this.events_.listen('move-right', goog.events.EventType.CLICK, function() {
    this.api.exec('rotatePower', {'power': this.normalSpeed_});
  }, false, this);

  // Ping
  this.events_.listen('ping', goog.events.EventType.CLICK, function() {
    this.api.exec('playTone', {'frequency': 588, 'duration': 240});
  }, false, this);

  // Stop
  this.events_.listen('stop', goog.events.EventType.CLICK, function() {
    this.connection.stop();
  }, false, this);
};


/**
 * @private
 */
cwc.mode.makeblock.mbotRanger.Control.prototype.addGamepadHandler_ = function(
    ) {
  let eventHandler = this.helper.getInstance('gamepad').getEventHandler();
  let rotation = false;
  this.events_.listen(eventHandler, cwc.utils.Gamepad.Events.Type.BUTTON[7],
    (event) => {
      if (!rotation) {
        this.api.exec('movePower', {'power': event.data * 255});
      }
  });
  this.events_.listen(eventHandler, cwc.utils.Gamepad.Events.Type.BUTTON[6],
    (event) => {
      if (!rotation) {
        this.api.exec('movePower', {'power': -event.data * 255});
      }
  });
  this.events_.listen(eventHandler, cwc.utils.Gamepad.Events.Type.AXIS[0],
    (event) => {
      rotation = event.data ? true : false;
      this.api.exec('rotatePower', {'power': event.data * 255});
  });
  this.events_.listen(eventHandler, cwc.utils.Gamepad.Events.Type.BUTTON[0],
    (event) => {
      if (event.data) {
        this.api.exec('playTone', {'frequency': 588, 'duration': 240});
      }
  });
};


/**
 * @private
 */
cwc.mode.makeblock.mbotRanger.Control.prototype.addKeyHandler_ = function() {
  this.shortcutHandler = new goog.ui.KeyboardShortcutHandler(document);
  this.shortcutHandler.registerShortcut('backward', 'down');
  this.shortcutHandler.registerShortcut('left', 'left');
  this.shortcutHandler.registerShortcut('right', 'right');
  this.shortcutHandler.registerShortcut('forward', 'up');

  this.shortcutHandler.registerShortcut('boost-backward', 'shift+down');
  this.shortcutHandler.registerShortcut('boost-left', 'shift+left');
  this.shortcutHandler.registerShortcut('boost-right', 'shift+right');
  this.shortcutHandler.registerShortcut('boost-forward', 'shift+up');

  this.shortcutHandler.registerShortcut('stop', 'space');

  this.events_.listen(this.shortcutHandler,
    goog.ui.KeyboardShortcutHandler.EventType.SHORTCUT_TRIGGERED,
    this.handleKeyboardShortcut_);
};


/**
 * Handles keyboard shortcuts.
 * @param {goog.events.EventLike} event
 * @private
 */
cwc.mode.makeblock.mbotRanger.Control.prototype.handleKeyboardShortcut_ =
function(event) {
  if (!this.messageInstance_.isControlActive() &&
      !this.messageInstance_.isMonitorActive() ||
      event.target.tagName === 'INPUT') {
    return;
  }

  switch (event.identifier) {
    // Normal speed
    case 'forward':
      this.api.exec('movePower', {'power': this.normalSpeed_});
      break;
    case 'right':
      this.api.exec('rotatePower', {'power': this.normalSpeed_});
      break;
    case 'backward':
      this.api.exec('movePower', {'power': -this.normalSpeed_});
      break;
    case 'left':
      this.api.exec('rotatePower', {'power': -this.normalSpeed_});
      break;

    // Boosted speed
    case 'boost-forward':
      this.api.exec('movePower', {'power': this.boostedSpeed_});
      break;
    case 'boost-right':
      this.api.exec('rotatePower', {'power': this.boostedSpeed_});
      break;
    case 'boost-backward':
      this.api.exec('movePower', {'power': -this.boostedSpeed_});
      break;
    case 'boost-left':
      this.api.exec('rotatePower', {'power': -this.boostedSpeed_});
      break;

    case 'stop':
      this.connection.stop();
      break;
    default:
      console.info(event.identifier);
  }
};
