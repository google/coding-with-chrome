/**
 * @fileoverview Control for the EV3 modification.
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
goog.provide('cwc.mode.lego.ev3.Control');

goog.require('cwc.soy.mode.ev3.Control');
goog.require('cwc.utils.Events');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {!cwc.mode.lego.ev3.Connection} connection
 * @struct
 * @final
 */
cwc.mode.lego.ev3.Control = function(helper, connection) {
  /** @type {string} */
  this.name = 'EV3 Control';

  /** @type {string} */
  this.prefix = helper.getPrefix('ev3-control');

  /** @type {Element} */
  this.node = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.mode.lego.ev3.Connection} */
  this.connection = connection;

  /** @type {!cwc.protocol.lego.ev3.Api} */
  this.api = this.connection.getApi();

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix);
};


/**
 * Decorates the EV3 control window.
 * @param {!Element} node
 */
cwc.mode.lego.ev3.Control.prototype.decorate = function(node) {
  this.node = node;

  goog.soy.renderElement(
    this.node,
    cwc.soy.mode.ev3.Control.template, {
      prefix: this.prefix,
    }
  );

  this.addEventHandler_();
  this.addGamepadHandler_();
  this.addKeyHandler_();
};


/**
 * @private
 */
cwc.mode.lego.ev3.Control.prototype.addEventHandler_ = function() {
  // Movements
  this.events_.listen('move-left', goog.events.EventType.CLICK, function() {
    this.api.rotateSteps(45, -50);
  }, false, this);

  this.events_.listen('move-forward', goog.events.EventType.CLICK, function() {
    this.api.moveSteps(50);
  }, false, this);

  this.events_.listen('move-backward', goog.events.EventType.CLICK, function() {
    this.api.moveSteps(50, -50);
  }, false, this);

  this.events_.listen('move-right', goog.events.EventType.CLICK, function() {
    this.api.rotateSteps(45);
  }, false, this);

  // Servo
  this.events_.listen('servo-up', goog.events.EventType.CLICK, function() {
    this.api.moveServo(5, 50);
  }, false, this);

  this.events_.listen('servo-down', goog.events.EventType.CLICK, function() {
    this.api.moveServo(5, -50);
  }, false, this);

  // Ping
  this.events_.listen('ping', goog.events.EventType.CLICK, function() {
    this.api.playTone(3000, 200, 50);
  }, false, this);

  // Stop
  this.events_.listen('stop', goog.events.EventType.CLICK, function() {
    this.api.stop();
  }, false, this);
};


/**
 * @private
 */
cwc.mode.lego.ev3.Control.prototype.addGamepadHandler_ = function() {
  let eventHandler = this.helper.getInstance('gamepad').getEventHandler();
  let rotation = false;
  this.events_.listen(eventHandler, cwc.utils.Gamepad.Events.Type.BUTTON[7],
    (e) => {
      if (!rotation) {
        this.api.movePower(e.data * 100);
      }
  });
  this.events_.listen(eventHandler, cwc.utils.Gamepad.Events.Type.BUTTON[6],
    (e) => {
      if (!rotation) {
        this.api.movePower(-e.data * 100);
      }
  });
  this.events_.listen(eventHandler, cwc.utils.Gamepad.Events.Type.AXIS[0],
    (e) => {
      rotation = e.data ? true : false;
      this.api.rotatePower(e.data * 100);
  });
  this.events_.listen(eventHandler, cwc.utils.Gamepad.Events.Type.BUTTON[0],
    (e) => {
      if (e.data) {
        this.api.playTone(3000, 200, 50);
      }
  });
};


/**
 * @private
 */
cwc.mode.lego.ev3.Control.prototype.addKeyHandler_ = function() {
  this.shortcutHandler = new goog.ui.KeyboardShortcutHandler(document);
  this.shortcutHandler.registerShortcut('backward', 'down');
  this.shortcutHandler.registerShortcut('left', 'left');
  this.shortcutHandler.registerShortcut('right', 'right');
  this.shortcutHandler.registerShortcut('forward', 'up');
  this.shortcutHandler.registerShortcut('up', 33);
  this.shortcutHandler.registerShortcut('down', 34);

  this.shortcutHandler.registerShortcut('boost-backward', 'shift+down');
  this.shortcutHandler.registerShortcut('boost-left', 'shift+left');
  this.shortcutHandler.registerShortcut('boost-right', 'shift+right');
  this.shortcutHandler.registerShortcut('boost-forward', 'shift+up');

  this.shortcutHandler.registerShortcut('stop', 'space');

  goog.events.listen(this.shortcutHandler,
    goog.ui.KeyboardShortcutHandler.EventType.SHORTCUT_TRIGGERED,
    this.handleKeyboardShortcut_, false, this);
};


/**
 * Handles keyboard shortcuts.
 * @param {goog.events.EventLike} event
 * @private
 */
cwc.mode.lego.ev3.Control.prototype.handleKeyboardShortcut_ = function(event) {
  if (!this.runnerMonitor_.isControlActive() &&
      !this.runnerMonitor_.isMonitorActive()) {
    return;
  }

  // Motor control commands
  switch (this.robotType_) {
    case cwc.protocol.lego.ev3.RobotType.ARM:
      this.handleArmKeyboardShortcut_(event.identifier);
      break;
    case cwc.protocol.lego.ev3.RobotType.VEHICLE:
      this.handleVehicleKeyboardShortcut_(event.identifier);
      break;
    default:
      this.handleVehicleKeyboardShortcut_(event.identifier);
  }

  // General commands
  switch (event.identifier) {
    case 'stop':
      this.api.stop();
      break;
  }
};


/**
 * Handles arm keyboard shortcuts.
 * @param {!string} keys
 * @private
 */
cwc.mode.lego.ev3.Control.prototype.handleArmKeyboardShortcut_ = function(
    keys) {
  let speed = 40;
  let steps = 5;

  switch (keys) {
    // Normal speed
    case 'forward':
      this.api.customMoveSteps(steps, undefined, -speed);
      break;
    case 'right':
      this.api.customRotateSteps(steps, undefined, speed);
      break;
    case 'backward':
      this.api.customMoveSteps(steps, undefined, speed);
      break;
    case 'left':
      this.api.customRotateSteps(steps, undefined, -speed);
      break;
    case 'up':
      this.api.moveServo(steps, speed);
      break;
    case 'down':
      this.api.moveServo(steps, -speed);
      break;
  }
};


/**
 * Handles vehicle keyboard shortcuts.
 * @param {string} keys
 * @private
 */
cwc.mode.lego.ev3.Control.prototype.handleVehicleKeyboardShortcut_ = function(
    keys) {
  let steps = 5;
  let speed = 50;
  let boostedSpeed = 100;

  switch (keys) {
    // Normal speed
    case 'forward':
      this.api.moveSteps(50, speed, false);
      break;
    case 'right':
      this.api.rotateSteps(steps, speed, false);
      break;
    case 'backward':
      this.api.moveSteps(50, -speed, false);
      break;
    case 'left':
      this.api.rotateSteps(steps, -speed, false);
      break;
    case 'up':
      this.api.moveServo(steps, speed);
      break;
    case 'down':
      this.api.moveServo(steps, -speed);
      break;

    // Boosted speed
    case 'boost-forward':
      this.api.moveSteps(50, boostedSpeed, false);
      break;
    case 'boost-right':
      this.api.rotateSteps(10, boostedSpeed, false);
      break;
    case 'boost-backward':
      this.api.moveSteps(50, -boostedSpeed, false);
      break;
    case 'boost-left':
      this.api.rotateSteps(10, -boostedSpeed, false);
      break;
    case 'boost-up':
      this.api.moveServo(10, boostedSpeed);
      break;
    case 'boost-down':
      this.api.moveServo(10, -boostedSpeed);
      break;
  }
};
