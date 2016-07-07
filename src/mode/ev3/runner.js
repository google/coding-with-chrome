/**
 * @fileoverview Runner for the EV3 modification.
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
goog.provide('cwc.mode.ev3.Runner');

goog.require('cwc.protocol.ev3.Events');
goog.require('cwc.protocol.ev3.Robots');
goog.require('cwc.runner.profile.ev3.Command');
goog.require('cwc.runner.profile.ev3.Monitor');
goog.require('cwc.soy.mode.ev3.Runner');
goog.require('cwc.ui.Runner');
goog.require('cwc.ui.Turtle');
goog.require('cwc.utils.Helper');

goog.require('goog.dom');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {!cwc.mode.ev3.Connection} connection
 * @struct
 * @final
 */
cwc.mode.ev3.Runner = function(helper, connection) {
  /** @type {string} */
  this.name = 'EV3 Runner';

  /** @type {string} */
  this.prefix = helper.getPrefix('ev3');

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.mode.ev3.Connection} */
  this.connection = connection;

  /** @type {!cwc.protocol.ev3.Api} */
  this.api = this.connection.getApi();

  /** @type {!cwc.runner.profile.ev3.Command} */
  this.command = new cwc.runner.profile.ev3.Command(this.api);

  /** @type {!string} */
  this.sprite = ' data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAWCAMAA' +
    'AACYceEAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAEVAAABFQEpfgIbAAAAGXRFWHRTb2Z0d' +
    '2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAMxQTFRFAAAAAAAAYGBgcXFxZmZmdHR0iXZ2j' +
    '4BwgICAioqKhISEhISElnZcmnFZkJCQl5eXjIyMi4uLmZmZmpqamJiYpKSkn5+fmJiYp6enp' +
    'qamqampp6enw4lgzoZYr6+vsLCwr6+vrq6upKSk1YdS14VOxoFSuLi4tbW1t7e3tLS04IFD4' +
    'INEurq6v7+/u7u7vr6+w8PDwsLCwsLCw8PDv7+/83opxsbGx8fHyMjI9HUhyMjIwbClwrGm+' +
    'HEW+W8TxbGjy8vLzMzM/mcC/2YAuorQHQAAAD90Uk5TAAEICQoLDRAWGBsdJysuMTM3NzpUV' +
    'FhcdHV5en+Dk5SZmqqsrbS4ub3Dz8/V1tjZ6Ors7u/2+Pj5+fr7/P39zRrHRwAAAJNJREFUG' +
    'BltwQUCgkAUBcCH3d0tdncX33//OymKsgs7A4HW06BWe9ahFNjxKQiVDjN3oRC7MfM9DrcJm' +
    '8ZwyVwepmsWTkP6GmmQFQ2yFCDxzuhn4YeoSrYKBJE12TZR2NokauEvtSfROY2fPskGsOQMk' +
    'hl5fHim5DT3wVQmtxLeQktyW4UBNEmlASQOpHJMQt+q6S/tLkQmfwmdrwAAAABJRU5ErkJgg' +
    'g==';

  /** @type {!cwc.ui.Turtle} */
  this.turtle = new cwc.ui.Turtle(helper, this.sprite);

  /** @type {!cwc.runner.profile.ev3.Monitor} */
  this.monitor = new cwc.runner.profile.ev3.Monitor(this.turtle);

  /** @type {Element} */
  this.node = null;

  /** @type {!Array} */
  this.listener = [];

  /** @type {!cwc.ui.Runner} */
  this.runner = new cwc.ui.Runner(helper);

  /** @type {!boolean} */
  this.showOverlay = true;

  /** @type {!boolean} */
  this.showPreview = true;

  /** @type {!cwc.protocol.ev3.RobotType} */
  this.robotType = cwc.protocol.ev3.Robots['TRACK3R'].type;

  /** @type {!number} */
  this.wheelDiameter = cwc.protocol.ev3.Robots['TRACK3R'].wheelDiameter;

  /** @type {!number} */
  this.wheelWidth = cwc.protocol.ev3.Robots['TRACK3R'].wheelWidth;

  /** @type {!number} */
  this.wheelbase = cwc.protocol.ev3.Robots['TRACK3R'].wheelbase;
};


/**
 * Decorates the runner object for the EV3 modification.
 * @export
 */
cwc.mode.ev3.Runner.prototype.decorate = function() {
  this.node = goog.dom.getElement(this.prefix + 'runner-chrome');
  this.helper.setInstance('runner', this.runner, true);
  this.helper.setInstance('turtle', this.turtle, true);

  // Start command
  this.runner.addCommand('__start__', this.handleStart_, this);

  // Movement commands
  this.runner.addCommand('moveSteps', this.command.moveSteps, this);
  this.runner.addMonitor('moveSteps', this.monitor.moveSteps, this.monitor);

  this.runner.addCommand('movePen', this.command.movePen, this);
  this.runner.addMonitor('movePen', this.monitor.movePen, this.monitor);

  this.runner.addCommand('moveServo', this.command.moveServo, this);

  this.runner.addCommand('rotateSteps', this.command.rotateSteps, this);
  this.runner.addMonitor('rotateSteps', this.monitor.rotateSteps, this.monitor);

  // Custom movement commands
  this.runner.addCommand('customMoveSteps',
      this.command.customMoveSteps, this);

  this.runner.addCommand('customRotateSteps',
      this.command.customRotateSteps, this);

  // EV3 Unit Commands
  this.runner.addCommand('playSound', this.command.playSound, this);
  this.runner.addCommand('playTone', this.command.playTone, this);
  this.runner.addCommand('showImage', this.command.showImage, this);

  // Direct commands
  this.runner.addCommand('movePower', this.command.movePower, this);
  this.runner.addCommand('rotatePower', this.command.rotatePower, this);
  this.runner.addCommand('stop', this.command.stop, this);

  // General commands
  this.runner.addCommand('setColorSensorMode', this.command.setColorSensorMode,
      this);
  this.runner.addCommand('setIrSensorMode', this.command.setIrSensorMode, this);
  this.runner.addCommand('setUltrasonicSensorMode',
      this.command.setUltrasonicSensorMode, this);
  this.runner.addCommand('setLed', this.command.setLed, this);

  // Events
  var apiEventHandler = this.api.getEventHandler();
  if (!apiEventHandler) {
    console.error('EV3 API event handler is not defined!');
  }
  this.runner.addEvent(apiEventHandler,
      cwc.protocol.ev3.Events.Type.COLOR_SENSOR_VALUE_CHANGED,
      'updateColorSensor');
  this.runner.addEvent(apiEventHandler,
      cwc.protocol.ev3.Events.Type.GYRO_SENSOR_VALUE_CHANGED,
      'updateGyroSensor');
  this.runner.addEvent(apiEventHandler,
      cwc.protocol.ev3.Events.Type.IR_SENSOR_VALUE_CHANGED,
      'updateIrSensor');
  this.runner.addEvent(apiEventHandler,
      cwc.protocol.ev3.Events.Type.TOUCH_SENSOR_VALUE_CHANGED,
      'updateTouchSensor');
  this.runner.addEvent(apiEventHandler,
      cwc.protocol.ev3.Events.Type.ULTRASONIC_SENSOR_VALUE_CHANGED,
      'updateUltrasonicSensor');

  // Overlay and templates.
  var templates = cwc.soy.mode.ev3.Runner;
  this.runner.setInfoTemplate(templates.info);
  if (this.showOverlay && !this.showPreview) {
    this.runner.setOverlayTemplate(templates.overlay);
  } else if (!this.showPreview) {
    this.runner.setConnectTemplate(templates.connect);
    this.runner.setDisconnectTemplate(templates.disconnect);
    this.runner.setPrepareTemplate(templates.prepare);
    this.runner.setRunTemplate(templates.run);
    this.runner.setReloadTemplate(templates.reload);
    this.runner.setStopTemplate(templates.stop);
    this.runner.setTerminateTemplate(templates.stop);
  }

  this.runner.setCleanUpFunction(this.command.cleanUp.bind(this));
  this.runner.decorate(this.node, this.prefix);

  if (templates.info) {
    this.runner.showInfoButton(true);
  }

  if (this.showPreview) {
    this.runner.showTurtle(true);
  }

  // Preview output
  var turtleNode = this.runner.getTurtleNode();
  this.turtle.decorate(turtleNode, this.prefix);

  // Unload event
  var layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    var eventHandler = layoutInstance.getEventHandler();
    this.addEventListener(eventHandler, goog.events.EventType.UNLOAD,
        this.cleanUp, false, this);
  }

  // EV3 events
  this.addEventListener(apiEventHandler,
      cwc.protocol.ev3.Events.Type.CHANGED_DEVICES,
      this.updateDeviceInfo, false, this);
};


/**
 * @private
 */
cwc.mode.ev3.Runner.prototype.handleStart_ = function() {
  this.updateDeviceInfo();
  this.setWheelDiameter();
  this.setWheelWidth();
  this.setWheelbase();
  this.setRobotType();

  this.monitor.reset();
  this.turtle.action('speed', 1);
  this.turtle.action('scale', 1);
  this.turtle.reset();
};


/**
 * Updates the runner inside the sandbox with the device information.
 */
cwc.mode.ev3.Runner.prototype.updateDeviceInfo = function() {
  this.runner.send('updateDeviceInfo', this.api.getDeviceInfo());
};


/**
 * @param {cwc.protocol.ev3.RobotType=} opt_type
 */
cwc.mode.ev3.Runner.prototype.setRobotType = function(opt_type) {
  if (opt_type !== undefined) {
    this.robotType = opt_type;
  }
  this.runner.send('updateRobotType', this.robotType);
};


/**
 * @param {number=} opt_diameter in diameter
 */
cwc.mode.ev3.Runner.prototype.setWheelDiameter = function(opt_diameter) {
  if (opt_diameter !== undefined) {
    this.wheelDiameter = opt_diameter;
  }
  this.runner.send('updateWheelDiameter', this.wheelDiameter);
};


/**
 * @param {number=} opt_width in diameter
 */
cwc.mode.ev3.Runner.prototype.setWheelWidth = function(opt_width) {
  if (opt_width !== undefined) {
    this.wheelWidth = opt_width;
  }
  this.runner.send('updateWheelWidth', this.wheelWidth);
};


/**
 * @param {number=} opt_distance in millimeter
 */
cwc.mode.ev3.Runner.prototype.setWheelbase = function(opt_distance) {
  if (opt_distance) {
    this.wheelbase = opt_distance;
  }
  this.runner.send('updateWheelbase', this.wheelbase);
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
 */
cwc.mode.ev3.Runner.prototype.addEventListener = function(src, type,
    listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};


/**
 * Cleans up the event listener and any other modification.
 */
cwc.mode.ev3.Runner.prototype.cleanUp = function() {
  this.connection.cleanUp();
  this.helper.removeEventListeners(this.listener, this.name);
  this.listener = [];
};
