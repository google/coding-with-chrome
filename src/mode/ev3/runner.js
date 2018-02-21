/**
 * @fileoverview Runner for the EV3 modification.
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
goog.provide('cwc.mode.ev3.Runner');

goog.require('cwc.protocol.ev3.Events');
goog.require('cwc.protocol.ev3.Robots');
goog.require('cwc.runner.profile.ev3.Command');
goog.require('cwc.runner.profile.ev3.Monitor');
goog.require('cwc.soy.mode.ev3.Runner');
goog.require('cwc.ui.Runner');
goog.require('cwc.ui.Turtle');
goog.require('cwc.utils.Events');
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
  this.prefix = helper.getPrefix();

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.mode.ev3.Connection} */
  this.connection = connection;

  /** @type {!cwc.protocol.ev3.Api} */
  this.api = this.connection.getApi();

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

  /** @type {Element} */
  this.node = null;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

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

  // Start Event
  this.runner.setStartEvent(this.handleStart_, this);

  // Commands
  this.runner.addCommandProfile(
    new cwc.runner.profile.ev3.Command(this.api));

  // Monitors
  this.runner.addMonitorProfile(
    new cwc.runner.profile.ev3.Monitor(this.turtle));

  // Events
  let apiEventHandler = this.api.getEventHandler();
  if (!apiEventHandler) {
    console.error('EV3 API event handler is not defined!');
  }
  this.runner.addEvent(apiEventHandler,
      cwc.protocol.ev3.Events.Type.COLOR_SENSOR,
      'updateColorSensor');
  this.runner.addEvent(apiEventHandler,
      cwc.protocol.ev3.Events.Type.GYRO_SENSOR,
      'updateGyroSensor');
  this.runner.addEvent(apiEventHandler,
      cwc.protocol.ev3.Events.Type.IR_SENSOR,
      'updateIrSensor');
  this.runner.addEvent(apiEventHandler,
      cwc.protocol.ev3.Events.Type.TOUCH_SENSOR,
      'updateTouchSensor');
  this.runner.addEvent(apiEventHandler,
      cwc.protocol.ev3.Events.Type.ULTRASONIC_SENSOR,
      'updateUltrasonicSensor');

  // Info template
  this.runner.showInfoButton(true);
  this.runner.setInfoTemplate(cwc.soy.mode.ev3.Runner.info);
  this.runner.setCleanUpFunction(this.api.cleanUp, this.api);
  this.runner.decorate(this.node);

  // Preview output
  this.runner.showTurtle(true);
  this.turtle.decorate(this.runner.getTurtleNode());

  // Unload event
  let layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    this.events_.listen(layoutInstance.getEventHandler(),
        goog.events.EventType.UNLOAD, this.cleanUp, false, this);
  }

  // EV3 events
  this.events_.listen(apiEventHandler,
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
};


/**
 * Updates the runner inside the sandbox with the device information.
 */
cwc.mode.ev3.Runner.prototype.updateDeviceInfo = function() {
  this.runner.send('updateDeviceInfo', this.api.getDeviceInfo());
};


/**
 * @param {cwc.protocol.ev3.RobotType=} optType
 */
cwc.mode.ev3.Runner.prototype.setRobotType = function(optType) {
  if (optType !== undefined) {
    this.robotType = optType;
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
 * Cleans up the event listener and any other modification.
 */
cwc.mode.ev3.Runner.prototype.cleanUp = function() {
  this.connection.cleanUp();
  this.events_.clear();
};
