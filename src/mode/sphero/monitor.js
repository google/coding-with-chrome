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

goog.require('goog.Timer');
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

  /** @type {Element} */
  this.nodeCalibrationButtons = null;

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

  /** @type {!goog.ui.CustomButton} */
  this.buttonCalibrate0 = cwc.ui.Helper.getIconButton('exposure_zero',
      'Set Calibration', this.calibrate0_.bind(this), this.buttonSize);

  /** @type {!goog.ui.CustomButton} */
  this.buttonCalibrateP10 = cwc.ui.Helper.getIconButton('exposure_plus_1',
      'Calibrate plus 10', this.calibrateP10_.bind(this), this.buttonSize);

  /** @type {!goog.ui.CustomButton} */
  this.buttonCalibrateN10 = cwc.ui.Helper.getIconButton('exposure_neg_1',
      'Calibrate negative 10', this.calibrateN10_.bind(this), this.buttonSize);

  /** @type {!goog.ui.CustomButton} */
  this.buttonCalibrateP20 = cwc.ui.Helper.getIconButton('exposure_plus_2',
      'Calibrate plus 20', this.calibrateP20_.bind(this), this.buttonSize);

  /** @type {!goog.ui.CustomButton} */
  this.buttonCalibrateN20 = cwc.ui.Helper.getIconButton('exposure_neg_2',
      'Calibrate negative 20', this.calibrateN20_.bind(this), this.buttonSize);

  /** @type {!number} */
  this.calibrationPoint = 0;

  /** @type {Element|StyleSheet} */
  this.styleSheet = null;

  /** @type {!Array} */
  this.listener = [];
};


/**
 * Connects the Sphero unit.
 * @export
 */
cwc.mode.sphero.Monitor.prototype.decorate = function() {
  var runnerInstance = this.helper.getInstance('runner', true);
  var runnerMonitor = runnerInstance.getMonitor();
  if (!runnerMonitor) {
    console.error('Runner Monitor is not there!', this.runner);
    return;
  }

  this.nodeIntro = runnerMonitor.getIntroNode();
  this.nodeControl = runnerMonitor.getControlNode();
  this.nodeCalibration = runnerMonitor.getCalibrationNode();

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
  this.nodeCalibrationButtons = goog.dom.getElement(
      this.prefix + 'calibration-buttons');

  // Unload event
  var layoutInstance = this.helper.getInstance('layout', true);
  var eventHandler = layoutInstance.getEventHandler();
  this.addEventListener_(eventHandler, goog.events.EventType.UNLOAD,
    this.cleanUp, false, this);

  this.addEventHandler_();
  //this.addKeyHandler_();
  runnerInstance.enableMonitor(true);
};


/**
 * @private
 */
cwc.mode.sphero.Monitor.prototype.addEventHandler_ = function() {
  this.buttonMoveLeft.render(this.nodeControlButtons);
  this.buttonMoveUp.render(this.nodeControlButtons);
  this.buttonMoveDown.render(this.nodeControlButtons);
  this.buttonMoveRight.render(this.nodeControlButtons);

  this.buttonStop.render(this.nodeSystemButtons);
  this.buttonSleep.render(this.nodeSystemButtons);

  this.buttonCalibrateN20.render(this.nodeCalibrationButtons);
  this.buttonCalibrateN10.render(this.nodeCalibrationButtons);
  this.buttonCalibrate0.render(this.nodeCalibrationButtons);
  this.buttonCalibrateP10.render(this.nodeCalibrationButtons);
  this.buttonCalibrateP20.render(this.nodeCalibrationButtons);
};


/**
 * @private
 */
cwc.mode.sphero.Monitor.prototype.addKeyHandler_ = function() {
  var keyHandler = new goog.events.KeyHandler(this.nodeControl);
  this.addEventListener_(keyHandler, 'key', function(e) {
    console.log('keyHandler', e);
  }, true, this);
};


/**
 * @param {Event=} opt_event
 * @privat
 */
cwc.mode.sphero.Monitor.prototype.moveLeft_ = function(opt_event) {
  this.api.roll(50, 270);
};


/**
 * @param {Event=} opt_event
 * @privat
 */
cwc.mode.sphero.Monitor.prototype.moveForward_ = function(opt_event) {
  this.api.roll(50, 0);
};


/**
 * @param {Event=} opt_event
 * @privat
 */
cwc.mode.sphero.Monitor.prototype.moveRight_ = function(opt_event) {
  this.api.roll(50, 90);
};


/**
 * @param {Event=} opt_event
 * @privat
 */
cwc.mode.sphero.Monitor.prototype.moveBackward_ = function(opt_event) {
  this.api.roll(50, 180);
};


/**
 * @param {Event=} opt_event
 * @privat
 */
cwc.mode.sphero.Monitor.prototype.stop_ = function(opt_event) {
  this.connection.stop();
};


/**
 * @param {Event=} opt_event
 * @privat
 */
cwc.mode.sphero.Monitor.prototype.sleep_ = function(opt_event) {
  this.api.sleep();
};


/**
 * @private
 */
cwc.mode.sphero.Monitor.prototype.calibrate0_ = function() {
  this.calibrationPoint = 0;
  this.api.setCalibration();
};


/**
 * @private
 */
cwc.mode.sphero.Monitor.prototype.calibrateN10_ = function() {
  var header = this.calibrationPoint;
  this.calibrationPoint = header = header - 10 >= 0 ? header - 10 : 359;
  this.api.calibrate(header, true);
};


/**
 * @private
 */
cwc.mode.sphero.Monitor.prototype.calibrateP10_ = function() {
  var header = this.calibrationPoint;
  this.calibrationPoint = header = header + 10 <= 359 ? header + 10 : 0;
  this.api.calibrate(header, true);
};


/**
 * @private
 */
cwc.mode.sphero.Monitor.prototype.calibrateN20_ = function() {
  var header = this.calibrationPoint;
  this.calibrationPoint = header = header - 20 >= 0 ? header - 20 : 359;
  this.api.calibrate(header, true);
};


/**
 * @private
 */
cwc.mode.sphero.Monitor.prototype.calibrateP20_ = function() {
  var header = this.calibrationPoint;
  this.calibrationPoint = header = header + 20 <= 359 ? header + 20 : 0;
  this.api.calibrate(header, true);
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

