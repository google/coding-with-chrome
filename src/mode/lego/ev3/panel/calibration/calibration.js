/**
 * @fileoverview Calibration screen for the EV3 modification.
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
goog.provide('cwc.mode.lego.ev3.Calibration');

goog.require('cwc.protocol.lego.ev3.Robots');
goog.require('cwc.soy.mode.ev3.Calibration');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Helper');
goog.require('cwc.utils.Logger');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {!cwc.mode.lego.ev3.Connection} connection
 * @param {!cwc.mode.lego.ev3.Runner} runner
 * @param {!cwc.mode.lego.ev3.Monitor} monitor
 * @struct
 * @final
 */
cwc.mode.lego.ev3.Calibration = function(helper, connection, runner, monitor) {
  /** @type {string} */
  this.name = 'EV3 Calibration';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = helper.getPrefix('ev3-calibrate');

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

  /** @type {!cwc.mode.lego.ev3.Connection} */
  this.connection = connection;

  /** @type {!cwc.protocol.lego.ev3.Api} */
  this.api = this.connection.getApi();

  /** @type {!cwc.mode.lego.ev3.Runner} */
  this.runner = runner;

  /** @type {boolean} */
  this.prepared = false;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {!cwc.mode.lego.ev3.Monitor} */
  this.monitor_ = monitor;

  if (!this.connection) {
    this.log_.error('Missing connection instance !');
  }
};


/**
 * Decorates the EV3 monitor window.
 */
cwc.mode.lego.ev3.Calibration.prototype.decorate = function() {
  let runnerInstance = this.helper.getInstance('runner', true);
  let runnerMonitor = runnerInstance.getMonitor();
  if (!runnerMonitor) {
    this.log_.error('Runner Monitor is not there!', this.runner);
    return;
  }

  this.nodeCalibration = runnerMonitor.getCalibrationNode();

  goog.soy.renderElement(
      this.nodeCalibration,
      cwc.soy.mode.ev3.Calibration.template, {prefix: this.prefix}
  );

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
  for (let robot in cwc.protocol.lego.ev3.Robots) {
    if (cwc.protocol.lego.ev3.Robots.hasOwnProperty(robot)) {
      let item = cwc.ui.Helper.getMenuItem(robot, '', this.setType.bind(this));
      this.nodeRobotList.appendChild(item);
    }
  }
  cwc.ui.Helper.mdlRefresh();

  // Robot Model
  let fileInstance = this.helper.getInstance('file');
  if (fileInstance) {
    this.setRobotModel(fileInstance.getModel() || 'TRACK3R');
  } else {
    this.setRobotModel('TRACK3R');
  }
  goog.style.setElementShown(this.nodeRobotCustom, false);

  // Unload event
  let layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    let eventHandler = layoutInstance.getEventHandler();
    this.events_.listen(eventHandler, goog.events.EventType.UNLOAD,
        this.cleanUp, false, this);
  }

  this.addEventHandler_();
  runnerInstance.enableMonitor(true);
};


/**
 * @private
 */
cwc.mode.lego.ev3.Calibration.prototype.addEventHandler_ = function() {
  let detectSensors = goog.dom.getElement(this.prefix + 'detect-sensors');

  // Calibration
  this.events_.listen(detectSensors, goog.events.EventType.CLICK,
    this.detect.bind(this), false, this);

  // Robot set
  this.events_.listen(this.nodeSet, goog.events.EventType.CLICK,
    this.setCalibration, false, this);
};


/**
 * Detects the connected EV3 devices.
 */
cwc.mode.lego.ev3.Calibration.prototype.detect = function() {
  this.connection.getDevices();
};


/**
 * Detects the connected EV3 devices.
 * @param {Event} event
 */
cwc.mode.lego.ev3.Calibration.prototype.setType = function(event) {
  let model = event.target.textContent;
  if (model.toLowerCase() == 'custom') {
    goog.style.setElementShown(this.nodeRobotCustom, true);
    return;
  }
  this.setRobotModel(model);
  goog.style.setElementShown(this.nodeRobotCustom, false);
};


/**
 * Sets the EV3 robot model
 * @param {!string} model
 */
cwc.mode.lego.ev3.Calibration.prototype.setRobotModel = function(model) {
  this.log_.info('Set robot model to', model);
  this.log_.info('Type:', cwc.protocol.lego.ev3.Robots[model].type);

  let robotConfig = cwc.protocol.lego.ev3.Robots[model];
  let fileInstance = this.helper.getInstance('file');
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
  this.monitor_.updateRobotType(robotConfig.type);
};


/**
 * Transfers the calibration settings.
 * @param {Event=} opt_event
 */
cwc.mode.lego.ev3.Calibration.prototype.setCalibration = function(opt_event) {
  this.runner.setWheelDiameter(this.nodeWheelDiameter.value);
  this.runner.setWheelWidth(this.nodeWheelWidth.value);
  this.runner.setWheelbase(this.nodeWheelbase.value);
  this.runner.setRobotType(this.nodeRobotType.value);
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.lego.ev3.Calibration.prototype.cleanUp = function() {
   this.events_.clear();
};
