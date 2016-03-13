/**
 * @fileoverview Calibration screen for the EV3 modification.
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
goog.provide('cwc.mode.ev3.Calibration');

goog.require('cwc.protocol.ev3.Robots');
goog.require('cwc.soy.mode.ev3.Calibration');
goog.require('cwc.utils.Helper');

goog.require('goog.ui.Select');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {!cwc.mode.ev3.Connection} connection
 * @param {!cwc.mode.ev3.Runner} runner
 * @struct
 * @final
 */
cwc.mode.ev3.Calibration = function(helper, connection, runner) {
  /** @type {string} */
  this.name = 'EV3 Calibration';

  /** @type {Element} */
  this.nodeCalibration = null;

  /** @type {Element} */
  this.nodeRobotType = null;

  /** @type {Element} */
  this.nodeRobotCustom = null;

  /** @type {Element} */
  this.nodeSet = null;

  /** @type {Element} */
  this.nodeWheelDiameter = null;

  /** @type {Element} */
  this.nodeWheelWidth = null;

  /** @type {Element} */
  this.nodeWheelbase = null;

  /** @type {goog.ui.Select} */
  this.selectRobotType =  new goog.ui.Select();

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.mode.ev3.Connection} */
  this.connection = connection;

  /** @type {!cwc.protocol.ev3.Api} */
  this.api = this.connection.getApi();

  /** @type {!cwc.mode.ev3.Runner} */
  this.runner = runner;

  /** @type {string} */
  this.prefix = helper.getPrefix('ev3-calibrate');

  /** @type {boolean} */
  this.prepared = false;

  /** @type {!Array} */
  this.listener = [];

  if (!this.connection) {
    console.error('Missing connection instance !');
  }

};


/**
 * Decorates the EV3 monitor window.
 */
cwc.mode.ev3.Calibration.prototype.decorate = function() {
  var runnerInstance = this.helper.getInstance('runner', true);
  var runnerMonitor = runnerInstance.getMonitor();
  if (!runnerMonitor) {
    console.error('Runner Monitor is not there!', this.runner);
    return;
  }

  this.nodeCalibration = runnerMonitor.getCalibrationNode();

  goog.soy.renderElement(
      this.nodeCalibration,
      cwc.soy.mode.ev3.Calibration.template, {
        'prefix': this.prefix,
        'robots': Object.keys(cwc.protocol.ev3.Robots)
      }
  );

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(
      cwc.soy.mode.ev3.Calibration.style({'prefix': this.prefix}));
  }

  this.nodeRobotType = goog.dom.getElement(this.prefix + 'robot-type');
  this.nodeRobotCustom = goog.dom.getElement(this.prefix + 'robot-custom');
  this.nodeWheelDiameter = goog.dom.getElement(this.prefix + 'wheel-diameter');
  this.nodeWheelWidth = goog.dom.getElement(this.prefix + 'wheel-width');
  this.nodeWheelbase = goog.dom.getElement(this.prefix + 'wheelbase');
  this.nodeSet = goog.dom.getElement(this.prefix + 'set');

  // Robot type
  this.selectRobotType.decorate(this.nodeRobotType);
  this.setRobotType('TRACK3R');
  goog.style.showElement(this.nodeRobotCustom, false);

  // Unload event
  var layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    let eventHandler = layoutInstance.getEventHandler();
    this.addEventListener_(eventHandler, goog.events.EventType.UNLOAD,
        this.cleanUp, false, this);
  }

  this.addEventHandler_();
  runnerInstance.enableMonitor(true);
};


/**
 * @private
 */
cwc.mode.ev3.Calibration.prototype.addEventHandler_ = function() {
  var detectSensors = goog.dom.getElement(this.prefix + 'detect-sensors');

  // Calibration
  this.addEventListener_(detectSensors, goog.events.EventType.CLICK,
    this.detect.bind(this), false, this);

  // Robot type
  this.addEventListener_(this.selectRobotType,
    goog.ui.Component.EventType.ACTION, this.setType, false, this);

  // Robot set
  this.addEventListener_(this.nodeSet, goog.events.EventType.CLICK,
    this.setCalibration, false, this);
};


/**
 * Detects the connected EV3 devices.
 */
cwc.mode.ev3.Calibration.prototype.detect = function() {
  this.connection.getDevices();
};


/**
 * Detects the connected EV3 devices.
 * @param {Event} event
 */
cwc.mode.ev3.Calibration.prototype.setType = function(event) {
  var type = event.target.getValue();
  if (type.toLowerCase() == 'custom') {
    goog.style.showElement(this.nodeRobotCustom, true);
    return;
  }
  this.setRobotType(type);
  goog.style.showElement(this.nodeRobotCustom, false);
};


/**
 * Sets the EV3 robot type.
 * @param {!string} type
 */
cwc.mode.ev3.Calibration.prototype.setRobotType = function(type) {
  this.nodeWheelDiameter.value = cwc.protocol.ev3.Robots[type].wheelDiameter;
  this.nodeWheelWidth.value = cwc.protocol.ev3.Robots[type].wheelWidth;
  this.nodeWheelbase.value = cwc.protocol.ev3.Robots[type].wheelbase;
} ;


/**
 * Transfers the calibration settings.
 * @param {Event=} opt_event
 */
cwc.mode.ev3.Calibration.prototype.setCalibration = function(opt_event) {
  this.runner.setWheelDiameter(this.nodeWheelDiameter.value);
  this.runner.setWheelWidth(this.nodeWheelWidth.value);
  this.runner.setWheelbase(this.nodeWheelbase.value);
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.ev3.Calibration.prototype.cleanUp = function() {
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
cwc.mode.ev3.Calibration.prototype.addEventListener_ = function(src, type,
    listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};
