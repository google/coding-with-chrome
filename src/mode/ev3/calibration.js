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
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Helper');



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
  this.nodeRobotModel = null;

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

  /** @type {Element} */
  this.nodeRobotList = null;

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
      cwc.soy.mode.ev3.Calibration.template, {prefix: this.prefix}
  );

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(
      cwc.soy.mode.ev3.Calibration.style({prefix: this.prefix}));
  }

  // Nodes
  this.nodeRobotCustom = goog.dom.getElement(this.prefix + 'robot-custom');
  this.nodeRobotList = goog.dom.getElement(this.prefix + 'robot-list');
  this.nodeRobotModel = goog.dom.getElement(this.prefix + 'robot-model');
  this.nodeRobotType = goog.dom.getElement(this.prefix + 'robot-type');
  this.nodeSet = goog.dom.getElement(this.prefix + 'set');
  this.nodeWheelDiameter = goog.dom.getElement(this.prefix + 'wheel-diameter');
  this.nodeWheelWidth = goog.dom.getElement(this.prefix + 'wheel-width');
  this.nodeWheelbase = goog.dom.getElement(this.prefix + 'wheelbase');

  // Robot Models
  for (var robot in cwc.protocol.ev3.Robots) {
    if (cwc.protocol.ev3.Robots.hasOwnProperty(robot)) {
      var item = cwc.ui.Helper.getMenuItem(robot, '',
        this.setType.bind(this));
      this.nodeRobotList.appendChild(item);
    }
  }
  cwc.ui.Helper.mdlRefresh();

  // Robot Model
  var fileInstance = this.helper.getInstance('file');
  if (fileInstance) {
    this.setRobotModel(fileInstance.getModel() || 'TRACK3R');
  } else {
    this.setRobotModel('TRACK3R');
  }
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
  var model = event.target.textContent;
  if (model.toLowerCase() == 'custom') {
    goog.style.showElement(this.nodeRobotCustom, true);
    return;
  }
  this.setRobotModel(model);
  goog.style.showElement(this.nodeRobotCustom, false);
};


/**
 * Sets the EV3 robot model.
 * @param {!string} model
 */
cwc.mode.ev3.Calibration.prototype.setRobotModel = function(model) {
  console.log('Set robot model to', model);
  console.log('Type:', cwc.protocol.ev3.Robots[model].type);

  var robotConfig = cwc.protocol.ev3.Robots[model];
  var fileInstance = this.helper.getInstance('file');
  if (fileInstance) {
    fileInstance.setModel(model);
  }

  if (this.nodeRobotModel) {
    this.nodeRobotModel.value = model;
  }

  this.nodeWheelDiameter.value = robotConfig.wheelDiameter;
  this.nodeWheelWidth.value = robotConfig.wheelWidth;
  this.nodeWheelbase.value = robotConfig.wheelbase;
  this.nodeRobotType.value = robotConfig.type;

  this.helper.dispatchEvent('changeRobotType',
    cwc.protocol.ev3.Robots[model].type);
};


/**
 * Transfers the calibration settings.
 * @param {Event=} opt_event
 */
cwc.mode.ev3.Calibration.prototype.setCalibration = function(opt_event) {
  this.runner.setWheelDiameter(this.nodeWheelDiameter.value);
  this.runner.setWheelWidth(this.nodeWheelWidth.value);
  this.runner.setWheelbase(this.nodeWheelbase.value);
  this.runner.setRobotType(this.nodeRobotType.value);
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
