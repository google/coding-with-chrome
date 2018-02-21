/**
 * @fileoverview Monitor for the EV3 modification.
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
goog.provide('cwc.mode.ev3.Monitor');

goog.require('cwc.protocol.ev3.Api');
goog.require('cwc.protocol.ev3.Events');
goog.require('cwc.protocol.ev3.RobotType');
goog.require('cwc.protocol.ev3.Robots');
goog.require('cwc.soy.mode.ev3.Monitor');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Helper');

goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.KeyboardShortcutHandler');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {!cwc.mode.ev3.Connection} connection
 * @struct
 * @final
 */
cwc.mode.ev3.Monitor = function(helper, connection) {
  /** @type {string} */
  this.name = 'EV3 Monitor';

  /** @type {string} */
  this.prefix = helper.getPrefix('ev3-monitor');

  /** @type {Element} */
  this.nodeControl = null;

  /** @type {Element} */
  this.nodeIntro = null;

  /** @type {Element} */
  this.nodeMonitor = null;

  /** @type {Element} */
  this.nodeMonitorValues = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.mode.ev3.Connection} */
  this.connection = connection;

  /** @type {!cwc.protocol.ev3.Api} */
  this.api = this.connection.getApi();

  /** @type {boolean} */
  this.prepared = false;

  /** @type {goog.ui.KeyboardShortcutHandler} */
  this.shortcutHandler = null;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix);

  /** @private {cwc.protocol.ev3.RobotType} */
  this.robotType_ = cwc.protocol.ev3.RobotType.UNKNOWN;

  /** @private {cwc.ui.RunnerMonitor} */
  this.runnerMonitor_ = null;

  if (!this.connection) {
    console.error('Missing connection instance !');
  }
};


/**
 * Decorates the EV3 monitor window.
 */
cwc.mode.ev3.Monitor.prototype.decorate = function() {
  let runnerInstance = this.helper.getInstance('runner', true);
  this.runnerMonitor_ = runnerInstance.getMonitor();
  if (!this.runnerMonitor_) {
    console.error('Runner Monitor is not there!', this.runnerMonitor_);
    return;
  }

  this.nodeIntro = this.runnerMonitor_.getIntroNode();
  this.nodeMonitor = this.runnerMonitor_.getMonitorNode();
  this.nodeControl = this.runnerMonitor_.getControlNode();

  goog.soy.renderElement(
      this.nodeIntro,
      cwc.soy.mode.ev3.Monitor.intro, {
        prefix: this.prefix,
      }
  );

  goog.soy.renderElement(
      this.nodeMonitor,
      cwc.soy.mode.ev3.Monitor.monitor, {
        prefix: this.prefix,
      }
  );

  goog.soy.renderElement(
      this.nodeControl,
      cwc.soy.mode.ev3.Monitor.control, {
        prefix: this.prefix,
      }
  );

  this.nodeMonitorValues = goog.dom.getElement(this.prefix + 'monitor');

  // Update event
  let eventHandler = this.connection.getEventHandler();
  this.events_.listen(eventHandler,
      cwc.protocol.ev3.Events.Type.CHANGED_VALUES, this.updateDeviceData, false,
      this);

  // Custom events
  let customEventHandler = this.helper.getEventHandler();
  this.events_.listen(customEventHandler, 'changeRobotType', function(e) {
    this.updateRobotType(e.data);
  }, false, this);

  // Monitoring
  this.updateDeviceData();

  // Unload event
  let layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    let eventHandler = layoutInstance.getEventHandler();
    this.events_.listen(eventHandler, goog.events.EventType.UNLOAD,
        this.cleanUp, false, this);
  }

  this.addEventHandler_();
  this.addKeyHandler_();
  runnerInstance.enableMonitor(true);
  layoutInstance.refresh();
};


/**
 * Updates device Data in monitor tab.
 * @param {Event=} opt_event
 */
cwc.mode.ev3.Monitor.prototype.updateDeviceData = function(opt_event) {
  if (this.runnerMonitor_.isMonitorActive()) {
    goog.soy.renderElement(
        this.nodeMonitorValues,
        cwc.soy.mode.ev3.Monitor.monitorValues, {
          prefix: this.prefix,
          devices: this.connection.getDeviceData(),
        }
    );
  }
};


/**
 * Updates device Data in monitor tab.
 * @param {!cwc.protocol.ev3.RobotType} type
 */
cwc.mode.ev3.Monitor.prototype.updateRobotType = function(type) {
  this.robotType_ = type;
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.ev3.Monitor.prototype.cleanUp = function() {
  console.log('Clean up EV3 monitor ...');
  this.events_.clear();
};


/**
 * @private
 */
cwc.mode.ev3.Monitor.prototype.addEventHandler_ = function() {
  // Movements
  this.events_.listen(goog.dom.getElement('move-left'),
    goog.events.EventType.CLICK, function() {
      this.api.rotateSteps(45, -50);
  }, false, this);

  this.events_.listen(goog.dom.getElement('move-forward'),
    goog.events.EventType.CLICK, function() {
      this.api.moveSteps(50);
  }, false, this);

  this.events_.listen(goog.dom.getElement('move-backward'),
    goog.events.EventType.CLICK, function() {
      this.api.moveSteps(50, -50);
  }, false, this);

  this.events_.listen(goog.dom.getElement('move-right'),
    goog.events.EventType.CLICK, function() {
      this.api.rotateSteps(45);
  }, false, this);

  // Servo
  this.events_.listen(goog.dom.getElement('servo-up'),
    goog.events.EventType.CLICK, function() {
      this.api.moveServo(5, 50);
  }, false, this);

  this.events_.listen(goog.dom.getElement('servo-down'),
    goog.events.EventType.CLICK, function() {
      this.api.moveServo(5, -50);
  }, false, this);

  // Ping
  this.events_.listen(goog.dom.getElement('ping'),
    goog.events.EventType.CLICK, function() {
      this.api.playTone(3000, 200, 50);
  }, false, this);

  // Stop
  this.events_.listen(goog.dom.getElement('stop'),
    goog.events.EventType.CLICK, function() {
      this.api.stop();
  }, false, this);
};


/**
 * @private
 */
cwc.mode.ev3.Monitor.prototype.addKeyHandler_ = function() {
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
cwc.mode.ev3.Monitor.prototype.handleKeyboardShortcut_ = function(event) {
  if (!this.runnerMonitor_.isControlActive() &&
      !this.runnerMonitor_.isMonitorActive()) {
    return;
  }

  // Motor control commands
  switch (this.robotType_) {
    case cwc.protocol.ev3.RobotType.ARM:
      this.handleArmKeyboardShortcut_(event.identifier);
      break;
    case cwc.protocol.ev3.RobotType.VEHICLE:
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
cwc.mode.ev3.Monitor.prototype.handleArmKeyboardShortcut_ = function(keys) {
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
cwc.mode.ev3.Monitor.prototype.handleVehicleKeyboardShortcut_ = function(keys) {
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
