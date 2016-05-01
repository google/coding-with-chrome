/**
 * @fileoverview Layout for the Sphero modification.
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
goog.provide('cwc.mode.sphero.Monitor');

goog.require('cwc.soy.mode.sphero.Monitor');
goog.require('cwc.ui.Helper');

goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.sphero.Monitor = function(helper, connection) {
  /** @type {string} */
  this.name = 'Sphero Monitor';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!string} */
  this.prefix = this.helper.getPrefix('sphero-monitor');

  /** @type {!cwc.mode.sphero.Connection} */
  this.connection = connection;

  /** @type {!cwc.protocol.sphero.Api} */
  this.api = this.connection.getApi();

  /** @type {Element} */
  this.nodeIntro = null;

  /** @type {Element} */
  this.nodeControl = null;

  /** @type {Element} */
  this.nodeCalibration = null;

  /** @type {Element} */
  this.nodeControlButtons = null;

  /** @type {Element} */
  this.nodeSystemButtons = null;

  /** @type {!string} */
  this.buttonSize = '36px';

  /** @type {!goog.ui.CustomButton} */
  this.buttonMoveLeft = cwc.ui.Helper.getIconButton('keyboard_arrow_left',
      'Move left', this.moveLeft_.bind(this), this.buttonSize);

  /** @type {!goog.ui.CustomButton} */
  this.buttonMoveUp = cwc.ui.Helper.getIconButton('keyboard_arrow_up',
      'Move forward', this.moveForward_.bind(this), this.buttonSize);

  /** @type {!goog.ui.CustomButton} */
  this.buttonMoveRight = cwc.ui.Helper.getIconButton('keyboard_arrow_right',
      'Move right', this.moveRight_.bind(this), this.buttonSize);

  /** @type {!goog.ui.CustomButton} */
  this.buttonMoveDown = cwc.ui.Helper.getIconButton('keyboard_arrow_down',
      'Move backward', this.moveBackward_.bind(this), this.buttonSize);

  /** @type {!goog.ui.CustomButton} */
  this.buttonStop = cwc.ui.Helper.getIconButton('pan_tool',
      'Stop Sphero', this.stop_.bind(this), this.buttonSize);

  /** @type {!goog.ui.CustomButton} */
  this.buttonSleep = cwc.ui.Helper.getIconButton('local_hotel',
      'Send Sphero to sleep', this.sleep_.bind(this), this.buttonSize);

  /** @type {goog.ui.KeyboardShortcutHandler} */
  this.shortcutHandler = null;

  /** @type {Element|StyleSheet} */
  this.styleSheet = null;

  /** @type {!Array} */
  this.listener = [];

  /** @private {cwc.ui.RunnerMonitor} */
  this.runnerMonitor_ = null;
};


/**
 * Connects the Sphero unit.
 * @export
 */
cwc.mode.sphero.Monitor.prototype.decorate = function() {
  var runnerInstance = this.helper.getInstance('runner', true);
  this.runnerMonitor_ = runnerInstance.getMonitor();
  if (!this.runnerMonitor_) {
    console.error('Runner Monitor is not there!', this.runner);
    return;
  }

  this.nodeIntro = this.runnerMonitor_.getIntroNode();
  this.nodeControl = this.runnerMonitor_.getControlNode();
  this.nodeCalibration = this.runnerMonitor_.getCalibrationNode();

  goog.soy.renderElement(
      this.nodeIntro,
      cwc.soy.mode.sphero.Monitor.intro,
      {'prefix': this.prefix}
  );

  goog.soy.renderElement(
      this.nodeControl,
      cwc.soy.mode.sphero.Monitor.control,
      {'prefix': this.prefix}
  );

  goog.soy.renderElement(
      this.nodeCalibration,
      cwc.soy.mode.sphero.Monitor.calibration,
      {'prefix': this.prefix}
  );

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(
      cwc.soy.mode.sphero.Monitor.style({'prefix': this.prefix}));
  }

  this.nodeControlButtons = goog.dom.getElement(
      this.prefix + 'control-buttons');
  this.nodeSystemButtons = goog.dom.getElement(
      this.prefix + 'system-buttons');

  // Unload event
  var layoutInstance = this.helper.getInstance('layout', true);
  var eventHandler = layoutInstance.getEventHandler();
  this.addEventListener_(eventHandler, goog.events.EventType.UNLOAD,
    this.cleanUp, false, this);

  this.addEventHandler_();
  this.addKeyHandler_();
  runnerInstance.enableMonitor(true);
  layoutInstance.refresh();
};


/**
 * @private
 */
cwc.mode.sphero.Monitor.prototype.addEventHandler_ = function() {
  this.buttonMoveDown.render(this.nodeControlButtons);
  this.buttonMoveLeft.render(this.nodeControlButtons);
  this.buttonMoveRight.render(this.nodeControlButtons);
  this.buttonMoveUp.render(this.nodeControlButtons);

  this.buttonStop.render(this.nodeSystemButtons);
  this.buttonSleep.render(this.nodeSystemButtons);

  var calibrationSlide = goog.dom.getElement(this.prefix + 'calibration-slide');
  this.addEventListener_(
    calibrationSlide, goog.events.EventType.INPUT, function(e) {
      this.api.calibrate(e.target.value, true);
    }, false, this);

  this.addEventListener_(
    calibrationSlide, goog.events.EventType.CHANGE, function(opt_e) {
      this.api.setCalibration();
    }, false, this);

};


/**
 * @private
 */
cwc.mode.sphero.Monitor.prototype.addKeyHandler_ = function() {
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
  this.shortcutHandler.registerShortcut('boost', 'shift');
  goog.events.listen(this.shortcutHandler,
    goog.ui.KeyboardShortcutHandler.EventType.SHORTCUT_TRIGGERED,
    this.handleKeyboardShortcut_, false, this);
};


/**
 * @param {Event=} opt_event
 * @private
 */
cwc.mode.sphero.Monitor.prototype.moveLeft_ = function(opt_event) {
  this.api.roll(50, 270);
};


/**
 * @param {Event=} opt_event
 * @private
 */
cwc.mode.sphero.Monitor.prototype.moveForward_ = function(opt_event) {
  this.api.roll(50, 0);
};


/**
 * @param {Event=} opt_event
 * @private
 */
cwc.mode.sphero.Monitor.prototype.moveRight_ = function(opt_event) {
  this.api.roll(50, 90);
};


/**
 * @param {Event=} opt_event
 * @private
 */
cwc.mode.sphero.Monitor.prototype.moveBackward_ = function(opt_event) {
  this.api.roll(50, 180);
};


/**
 * @param {Event=} opt_event
 * @private
 */
cwc.mode.sphero.Monitor.prototype.moveStop_ = function(opt_event) {
  this.api.boost(false);
  this.api.roll(0);
};


/**
 * @param {Event=} opt_event
 * @private
 */
cwc.mode.sphero.Monitor.prototype.moveBoost_ = function(opt_event) {
  this.api.boost(true);
};


/**
 * @param {Event=} opt_event
 * @private
 */
cwc.mode.sphero.Monitor.prototype.stop_ = function(opt_event) {
  this.connection.stop();
};


/**
 * @param {Event=} opt_event
 * @private
 */
cwc.mode.sphero.Monitor.prototype.sleep_ = function(opt_event) {
  this.api.sleep();
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.sphero.Monitor.prototype.cleanUp = function() {
  if (this.connectMonitor) {
    this.connectMonitor.stop();
  }
  this.helper.removeEventListeners(this.listener, this.name);
};


/**
 * Handles keyboard shortcuts.
 * @private
 */
cwc.mode.sphero.Monitor.prototype.handleKeyboardShortcut_ = function(event) {
  if (this.runnerMonitor_.isControlActive()) {
    switch (event.identifier) {

      // Normal speed
      case 'forward':
        this.api.roll(50, 0);
        break;
      case 'right':
        this.api.roll(50, 90);
        break;
      case 'backward':
        this.api.roll(50, 180);
        break;
      case 'left':
        this.api.roll(50, 270);
        break;

      // Boosted speed
      case 'boost-forward':
        this.api.roll(255, 0);
        break;
      case 'boost-right':
        this.api.roll(255, 90);
        break;
      case 'boost-backward':
        this.api.roll(255, 180);
        break;
      case 'boost-left':
        this.api.roll(255, 270);
        break;

      case 'stop':
        this.moveStop_();
        break;
      case 'boost':
        this.moveBoost_();
        break;
      default:
        console.info(event.identifier);
    }
  }
};


/**
 * Adds an event listener for a specific event on a native event
 * target (such as a DOM element) or an object that has implemented
 * {@link goog.events.Listenable}.
 *
 * @param {EventTarget|goog.events.Listenable} src
 * @param {string} type
 * @param {function(?)} listener
 * @param {boolean=} opt_useCapture
 * @param {Object=} opt_listenerScope
 * @private
 */
cwc.mode.sphero.Monitor.prototype.addEventListener_ = function(src, type,
    listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};
