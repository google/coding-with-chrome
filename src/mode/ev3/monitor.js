/**
 * @fileoverview Monitor for the EV3 modification.
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
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

  /** @type {!Array} */
  this.listener = [];

  /** @type {goog.ui.KeyboardShortcutHandler} */
  this.shortcutHandler = null;

  /** @private {} */
  this.robotType_ = cwc.protocol.ev3.RobotType.UNKOWN;

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
  var runnerInstance = this.helper.getInstance('runner', true);
  this.runnerMonitor_ = runnerInstance.getMonitor();
  if (!this.runnerMonitor_) {
    console.error('Runner Monitor is not there!', this.runner);
    return;
  }

  this.nodeIntro = this.runnerMonitor_.getIntroNode();
  this.nodeMonitor = this.runnerMonitor_.getMonitorNode();
  this.nodeControl = this.runnerMonitor_.getControlNode();

  goog.soy.renderElement(
      this.nodeIntro,
      cwc.soy.mode.ev3.Monitor.intro, {
        'prefix': this.prefix
      }
  );

  goog.soy.renderElement(
      this.nodeMonitor,
      cwc.soy.mode.ev3.Monitor.monitor, {
        'prefix': this.prefix
      }
  );

  goog.soy.renderElement(
      this.nodeControl,
      cwc.soy.mode.ev3.Monitor.control,
      {'prefix': this.prefix}
  );

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(
      cwc.soy.mode.ev3.Monitor.style({'prefix': this.prefix}));
  }

  this.nodeMonitorValues = goog.dom.getElement(this.prefix + 'monitor');

  // Update event
  var eventHandler = this.connection.getEventHandler();
  this.addEventListener_(eventHandler,
      cwc.protocol.ev3.Events.Type.CHANGED_VALUES, this.updateDeviceData, false,
      this);

  // Custom events
  var customEventHandler = this.helper.getEventHandler();
  this.addEventListener_(customEventHandler, 'changeRobotType', function(e) {
    this.updateRobotType(e.data);
  }, false, this);

  // Monitoring
  this.updateDeviceData();

  // Unload event
  var layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    let eventHandler = layoutInstance.getEventHandler();
    this.addEventListener_(eventHandler, goog.events.EventType.UNLOAD,
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
        cwc.soy.mode.ev3.Monitor.monitorValues,
        {'prefix': this.prefix, 'devices': this.connection.getDeviceData()}
    );
  }
};


/**
 * Updates device Data in monitor tab.
 * @param {!string} type
 */
cwc.mode.ev3.Monitor.prototype.updateRobotType = function(type) {
  this.robotType_ = type;
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.ev3.Monitor.prototype.cleanUp = function() {
  if (this.timerMonitor) {
    this.timerMonitor.stop();
  }
  this.helper.removeEventListeners(this.listener, this.name);
};


/**
 * @private
 */
cwc.mode.ev3.Monitor.prototype.addEventHandler_ = function() {

  // Movements
  this.addEventListener_('move-left', goog.events.EventType.CLICK, function() {
    this.api.rotateSteps(45, -50);
  }.bind(this), false, this);

  this.addEventListener_('move-forward', goog.events.EventType.CLICK,
    function() {
      this.api.moveSteps(50);
    }.bind(this), false, this);

  this.addEventListener_('move-backward', goog.events.EventType.CLICK,
    function() {
      this.api.moveSteps(50, -50);
    }.bind(this), false, this);

  this.addEventListener_('move-right', goog.events.EventType.CLICK, function() {
    this.api.rotateSteps(45);
  }.bind(this), false, this);

  // Stop
  this.addEventListener_('stop', goog.events.EventType.CLICK, function() {
    this.api.stop();
  }.bind(this), false, this);

  // Ping
  this.addEventListener_('ping', goog.events.EventType.CLICK, function() {
    this.api.playTone(3000, 200, 50);
  }.bind(this), false, this);
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
 * @private
 */
cwc.mode.ev3.Monitor.prototype.handleKeyboardShortcut_ = function(event) {
  if (!this.runnerMonitor_.isControlActive()) {
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
 * @private
 */
cwc.mode.ev3.Monitor.prototype.handleArmKeyboardShortcut_ = function(keys) {
  var speed = 40;
  switch (keys) {
    // Normal speed
    case 'forward':
      this.api.customMoveSteps(5, undefined, -speed);
      break;
    case 'right':
      this.api.customRotateSteps(5, undefined, speed);
      break;
    case 'backward':
      this.api.customMoveSteps(5, undefined, speed);
      break;
    case 'left':
      this.api.customRotateSteps(5, undefined, -speed);
      break;
    case 'up':
      this.api.moveServo(5, speed);
      break;
    case 'down':
      this.api.moveServo(5, -speed);
      break;
  }
};


/**
 * Handles vehicle keyboard shortcuts.
 * @private
 */
cwc.mode.ev3.Monitor.prototype.handleVehicleKeyboardShortcut_ = function(keys) {
  var speed = 50;
  var boostedSpeed = 100;
  switch (keys) {
    // Normal speed
    case 'forward':
      this.api.moveSteps(50, speed, false);
      break;
    case 'right':
      this.api.rotateSteps(5, speed, false);
      break;
    case 'backward':
      this.api.moveSteps(50, -speed, false);
      break;
    case 'left':
      this.api.rotateSteps(5, -speed, false);
      break;
    case 'up':
      this.api.moveServo(5, speed);
      break;
    case 'down':
      this.api.moveServo(5, -speed);
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


/**
 * Adds an event listener for a specific event on a native event
 * target (such as a DOM element) or an object that has implemented
 * {@link goog.events.Listenable}.
 *
 * @param {EventTarget|goog.events.Listenable|string} src
 * @param {string} type
 * @param {function(?)} listener
 * @param {boolean=} opt_useCapture
 * @param {Object=} opt_listenerScope
 * @private
 */
cwc.mode.ev3.Monitor.prototype.addEventListener_ = function(src, type,
    listener, opt_useCapture, opt_listenerScope) {
  var target = goog.isString(src) ?
    goog.dom.getElement(this.prefix + src) : src;
  var eventListener = goog.events.listen(target, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};
