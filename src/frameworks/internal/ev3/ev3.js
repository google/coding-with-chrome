/**
 * @fileoverview EV3 framework for the runner instance.
 * This EV3 framework will be used by the runner instance, inside the webview
 * sandbox, to access the EV3 over the runner instance and the Bluetooth
 * interface.
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
goog.provide('cwc.framework.Ev3');

goog.require('cwc.framework.Runner');
goog.require('cwc.protocol.ev3.DeviceName');
goog.require('cwc.protocol.ev3.LedColor');
goog.require('cwc.protocol.ev3.LedMode');
goog.require('cwc.protocol.ev3.RobotType');
goog.require('cwc.protocol.ev3.Robots');



/**
 * @constructor
 * @param {!Function} code
 * @struct
 * @final
 * @export
 */
cwc.framework.Ev3 = function(code) {
  /** @type {string} */
  this.name = 'EV3 Framework';

  /** @type {Function} */
  this.code = function() {code(this);}.bind(this);

  /** @type {!cwc.framework.Runner} */
  this.runner = new cwc.framework.Runner(this.code, this);

  /** @type {Object} */
  this.deviceInfo = {};

  /** @private {!function(?)} */
  this.emptyFunction_ = function() {};

  /** @type {!function(?)} */
  this.colorSensorEvent = this.emptyFunction_;

  /** @type {!function(?)} */
  this.touchSensorEvent = this.emptyFunction_;

  /** @type {!function(?)} */
  this.irSensorEvent = this.emptyFunction_;

  /** @type {!function(?)} */
  this.gyroSensorEvent = this.emptyFunction_;

  /** @type {!function(?)} */
  this.ultrasonicSensorEvent = this.emptyFunction_;

  /** @type {number} */
  this.colorSensorValue = null;

  /** @type {number} */
  this.touchSensorValue = null;

  /** @type {number} */
  this.irSensorValue = null;

  /** @type {number} */
  this.gyroSensorValue = null;

  /** @type {number} */
  this.ultrasonicSensorValue = null;

  /** @type {cwc.protocol.ev3.RobotType} */
  this.robotType = null;

  /** @type {number} */
  this.wheelDiameter = null;

  /** @type {number} */
  this.wheelCircumference = null;

  /** @type {!number} */
  this.wheelWidth = 0;

  /** @type {number} */
  this.wheelbase = null;

  /** @type {number} */
  this.rotateCircumference = null;

  /** @type {!number} */
  this.largeMotorSpeed = 170 / 60;

  /** @type {!number} */
  this.mediumMotorSpeed = 250 / 60;

  this.runner.addCommand('updateColorSensor', this.handleUpdateColorSensor_);
  this.runner.addCommand('updateDeviceInfo', this.handleUpdateDeviceInfo_);
  this.runner.addCommand('updateGyroSensor', this.handleUpdateGyroSensor_);
  this.runner.addCommand('updateIrSensor', this.handleUpdateIrSensor_);
  this.runner.addCommand('updateTouchSensor', this.handleUpdateTouchSensor_);
  this.runner.addCommand('updateUltrasonicSensor',
      this.handleUpdateUltrasonicSensor_);
  this.runner.addCommand('updateRobotType', this.handleUpdateRobotType_);
  this.runner.addCommand('updateWheelDiameter',
      this.handleUpdateWheelDiameter_);
  this.runner.addCommand('updateWheelWidth', this.handleUpdateWheelWidth_);
  this.runner.addCommand('updateWheelbase', this.handleUpdateWheelbase_);
};


/**
 * Sets the EV3 robot model.
 * @param {!string} model
 * @export
 */
cwc.framework.Ev3.prototype.setRobotModel = function(model) {
  if (model == 'custom') {
    return;
  }
  if (!(model in cwc.protocol.ev3.Robots)) {
    console.error('Unknown robot model: ' + model);
    return;
  }
  console.log('Set robot model to ' + model);
  this.setRobotType(cwc.protocol.ev3.Robots[model].type);
  this.setWheelDiameter(cwc.protocol.ev3.Robots[model].wheelDiameter);
  this.setWheelWidth(cwc.protocol.ev3.Robots[model].wheelWidth);
  this.setWheelbase(cwc.protocol.ev3.Robots[model].wheelbase);
};


/**
 * Sets the EV3 robot type.
 * @param {!string} type
 * @export
 */
cwc.framework.Ev3.prototype.setRobotType = function(type) {
  this.robotType = type;
  console.log('Set robot type to ' + this.robotType);
};


/**
 * @param {!number} diameter in millimeter
 * @export
 */
cwc.framework.Ev3.prototype.setWheelDiameter = function(diameter) {
  this.wheelDiameter = Number(diameter);
  this.wheelCircumference = this.wheelDiameter * Math.PI;
};


/**
 * @param {!number} wheel_width in millimeter
 * @export
 */
cwc.framework.Ev3.prototype.setWheelWidth = function(wheel_width) {
  this.wheelWidth = Number(wheel_width);
  this.setRotateCircumference_();
};


/**
 * @param {!number} distance in millimeter
 * @export
 */
cwc.framework.Ev3.prototype.setWheelbase = function(distance) {
  this.wheelbase = Number(distance);
  this.setRotateCircumference_();
};


/**
 * @private
 */
cwc.framework.Ev3.prototype.setRotateCircumference_ = function() {
  if (this.wheelbase) {
    this.rotateCircumference = (this.wheelbase + this.wheelWidth) * Math.PI;
  } else {
    this.rotateCircumference = 1;
  }
};


/**
 * @param {!number} steps
 * @param {!number} opt_speed
 * @param {string=} opt_type
 * @return {!number} Calculated delay + buffer.
 */
cwc.framework.Ev3.prototype.getDelay = function(steps, opt_speed, opt_type) {
  var buffer = 250;
  var motorSpeed = this.largeMotorSpeed;
  var speed = opt_speed || 50;
  var delay = Math.floor(
    (((steps / 360) * Math.abs(100 / speed)) / motorSpeed) * 1000 + buffer);
  return delay;
};


/**
 * Returns the Color Sensor value.
 * @return {number}
 * @export
 */
cwc.framework.Ev3.prototype.getColorSensorValue = function() {
  return this.colorSensorValue;
};


/**
 * Returns the Gyro object.
 * @return {number}
 * @export
 */
cwc.framework.Ev3.prototype.getGyroSensorValue = function() {
  return this.gyroSensorValue;
};


/**
 * Returns the IR object.
 * @return {number}
 * @export
 */
cwc.framework.Ev3.prototype.getIrSensorValue = function() {
  return this.irSensorValue;
};


/**
 * Returns the Touch value.
 * @return {number}
 * @export
 */
cwc.framework.Ev3.prototype.getTouchSensorValue = function() {
  return this.touchSensorValue;
};


/**
 * Returns the Ultrasonic object.
 * @return {number}
 * @export
 */
cwc.framework.Ev3.prototype.getUltrasonicSensorValue = function() {
  return this.ultrasonicSensorValue;
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.Ev3.prototype.onColorSensorChange = function(func) {
  if (goog.isFunction(func)) {
    this.colorSensorEvent = func;
  }
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.Ev3.prototype.onGyroSensorChange = function(func) {
  if (goog.isFunction(func)) {
    this.gyroSensorEvent = func;
  }
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.Ev3.prototype.onIrSensorChange = function(func) {
  if (goog.isFunction(func)) {
    this.irSensorEvent = func;
  }
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.Ev3.prototype.onTouchSensorChange = function(func) {
  if (goog.isFunction(func)) {
    this.touchSensorEvent = func;
  }
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.Ev3.prototype.onUltrasonicSensorChange = function(func) {
  if (goog.isFunction(func)) {
    this.ultrasonicSensorEvent = func;
  }
};


/**
 * @export
 */
cwc.framework.Ev3.prototype.stopUltrasonicSensorEvent = function() {
  this.ultrasonicSensorEvent = this.emptyFunction_;
};


/**
 * Displays the selected file name on the EV3 display.
 * @param {!string} file_name
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Ev3.prototype.showImage = function(file_name, opt_delay) {
  this.runner.send('showImage', {'file': file_name}, opt_delay);
};


/**
 * Plays tone.
 * @param {!number} frequency
 * @param {number=} opt_duration
 * @param {number=} opt_volume
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Ev3.prototype.playTone = function(frequency, opt_duration,
    opt_volume, opt_delay) {
  this.runner.send('playTone', {
    'frequency': frequency,
    'duration': opt_duration,
    'volume': opt_volume}, opt_delay);
};


/**
 * Plays a sound file.
 * @param {!string} file_name
 * @param {number=} opt_volume
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Ev3.prototype.playSound = function(file_name, opt_volume,
    opt_delay) {
  this.runner.send('playSound', {
    'file': file_name,
    'volume': opt_volume}, opt_delay);
};


/**
 * Moves the servo motor for the predefined specific steps.
 * @param {!number} steps
 * @param {number=} opt_speed
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Ev3.prototype.moveServo = function(steps, opt_speed, opt_delay) {
  this.runner.send('moveServo', {
    'steps': steps,
    'speed': opt_speed}, opt_delay);
};


/**
 * Moves the servo motor for the predefined specific steps.
 * @param {!number} steps
 * @param {number=} opt_speed
 * @param {string=} opt_color
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Ev3.prototype.movePen = function(steps,
    opt_speed, opt_color, opt_delay) {
  this.runner.send('movePen', {
    'steps': steps,
    'speed': opt_speed,
    'color': opt_color}, opt_delay);
};


/**
 * Moves the motors for the specific steps.
 * @param {!number} steps
 * @param {number=} opt_speed
 * @param {number=} opt_delay in msec or true for auto
 * @export
 */
cwc.framework.Ev3.prototype.moveSteps = function(steps, opt_speed, opt_delay) {
  if (this.robotType == cwc.protocol.ev3.RobotType.ARM) {
    return this.customMoveSteps(steps, undefined, opt_speed, opt_delay);
  }
  var delay = opt_delay === true ? this.getDelay(steps, opt_speed) : opt_delay;
  var distance = Math.round((this.wheelCircumference * (steps/360)) / 10);
  this.runner.send('moveSteps', {
    'distance': distance,
    'steps': steps,
    'speed': opt_speed}, delay);
};


/**
 * Moves the motors for the specific steps.
 * @param {!number} steps
 * @param {number=} opt_ports
 * @param {number=} opt_speed
 * @param {number=} opt_delay in msec or true for auto
 * @export
 */
cwc.framework.Ev3.prototype.customMoveSteps = function(steps, opt_ports,
    opt_speed, opt_delay) {
  var delay = opt_delay === true ? this.getDelay(steps, opt_speed) : opt_delay;
  this.runner.send('customMoveSteps', {
    'steps': steps,
    'ports': opt_ports,
    'speed': opt_speed}, delay);
};


/**
 * Moves the motors for the specific distance.
 * @param {!number} distance in cm
 * @param {number=} opt_speed
 * @param {number|boolean=} opt_delay in msec or true for auto
 * @export
 */
cwc.framework.Ev3.prototype.moveDistance = function(distance, opt_speed,
    opt_delay) {
  var steps = Math.round((distance * 10 / this.wheelCircumference) * 360);
  var delay = opt_delay === true ? this.getDelay(steps, opt_speed) : opt_delay;
  this.runner.send('moveSteps', {
    'distance': distance,
    'steps': steps,
    'speed': opt_speed}, delay);
};


/**
 * Rotates the motors for the predefined specific steps.
 * @param {!number} steps
 * @param {number=} opt_speed
 * @param {number=} opt_ratio
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Ev3.prototype.rotateSteps = function(steps,
    opt_speed, opt_ratio, opt_delay) {
  this.runner.send('rotateSteps', {
    'steps': steps,
    'speed': opt_speed,
    'ratio': opt_ratio}, opt_delay);
};


/**
 * Rotates the motors for the predefined angle steps.
 * @param {!number} angle
 * @param {number=} opt_speed
 * @param {number=} opt_delay in msec or true for auto
 * @export
 */
cwc.framework.Ev3.prototype.rotateAngle = function(angle,
    opt_speed, opt_delay) {
  if (this.robotType == cwc.protocol.ev3.RobotType.ARM) {
    return this.customRotateAngle(angle, undefined, opt_speed, opt_delay);
  }
  var rotateDistance = this.rotateCircumference / 360;
  var steps = Math.round(
    (rotateDistance * angle / this.wheelCircumference) * 360);
  var delay = opt_delay === true ? this.getDelay(steps, opt_speed) : opt_delay;
  this.runner.send('rotateSteps', {
    'angle': angle,
    'steps': steps,
    'speed': opt_speed}, delay);
};


/**
 * Rotates the motors for the predefined angle steps.
 * @param {!number} angle
 * @param {number=} opt_ports
 * @param {number=} opt_speed
 * @param {number=} opt_delay in msec or true for auto
 * @export
 */
cwc.framework.Ev3.prototype.customRotateAngle = function(angle,
    opt_ports, opt_speed, opt_delay) {
  var rotateDistance = this.rotateCircumference / 360;
  var steps = Math.round(
    (rotateDistance * angle / this.wheelCircumference) * 360);
  var delay = opt_delay === true ? this.getDelay(steps, opt_speed) : opt_delay;
  this.runner.send('customRotateSteps', {
    'angle': angle,
    'steps': steps,
    'ports': opt_ports,
    'speed': opt_speed}, delay);
};


/**
 * Moves forward / backward with power.
 * @param {!number} power
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Ev3.prototype.movePower = function(power, opt_delay) {
  this.runner.send('movePower', {'power': power}, opt_delay);
};


/**
 * Rotates left / right with power.
 * @param {!number} power General power value.
 * @param {number=} opt_power Dedicated power value for the second motor.
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Ev3.prototype.rotatePower = function(power, opt_power,
    opt_delay) {
  this.runner.send('rotatePower', {
    'power': power,
    'opt_power': opt_power}, opt_delay);
};


/**
 * Stops all motors.
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Ev3.prototype.stop = function(opt_delay) {
  this.runner.send('stop', null, opt_delay);
};


/**
 * Waits for the given time.
 * @param {!number} time in msec
 * @export
 */
cwc.framework.Ev3.prototype.wait = function(time) {
  this.runner.send('wait', null, time);
};


/**
 * @param {!number} mode
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Ev3.prototype.setColorSensorMode = function(mode, opt_delay) {
  this.runner.send('setColorSensorMode', {'mode': mode}, opt_delay);
};


/**
 * @param {!number} mode
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Ev3.prototype.setIrSensorMode = function(mode, opt_delay) {
  this.runner.send('setIrSensorMode', {'mode': mode}, opt_delay);
};


/**
 * @param {!number} mode
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Ev3.prototype.setUltrasonicSensorMode = function(mode,
    opt_delay) {
  this.runner.send('setUltrasonicSensorMode', {'mode': mode}, opt_delay);
};


/**
 * @param {cwc.protocol.ev3.LedColor} color
 * @param {cwc.protocol.ev3.LedMode=} opt_mode
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Ev3.prototype.setLed = function(color, opt_mode, opt_delay) {
  this.runner.send('setLed', {
    'color': color,
    'mode': opt_mode}, opt_delay);
};


/**
 * @param {!number} speed
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Ev3.prototype.setStepSpeed = function(speed, opt_delay) {
  this.runner.send('setStepSpeed', {'speed': speed}, opt_delay);
};


/**
 * @param {!number} data
 * @private
 */
cwc.framework.Ev3.prototype.handleUpdateColorSensor_ = function(data) {
  this.colorSensorValue = data;
  this.colorSensorEvent(data);
};


/**
 * Updates the current sensor / actor states with the received data.
 * @param {Object} data
 * @private
 */
cwc.framework.Ev3.prototype.handleUpdateDeviceInfo_ = function(data) {
  this.deviceInfo = data;
};


/**
 * @param {!number} data
 * @private
 */
cwc.framework.Ev3.prototype.handleUpdateGyroSensor_ = function(data) {
  this.gyroSensorValue = data;
  this.gyroSensorEvent(data);
};


/**
 * @param {!number} data
 * @private
 */
cwc.framework.Ev3.prototype.handleUpdateIrSensor_ = function(data) {
  this.irSensorValue = data;
  this.irSensorEvent(data);
};


/**
 * @param {!number} data
 * @private
 */
cwc.framework.Ev3.prototype.handleUpdateTouchSensor_ = function(data) {
  this.touchSensorValue = data;
  this.touchSensorEvent(data);
};


/**
 * @param {!number} data
 * @private
 */
cwc.framework.Ev3.prototype.handleUpdateUltrasonicSensor_ = function(data) {
  this.ultrasonicSensorValue = data;
  this.ultrasonicSensorEvent(data);
};


/**
 * Sets the robot type.
 * @param {!number} data
 * @private
 */
cwc.framework.Ev3.prototype.handleUpdateRobotType_ = function(data) {
  this.setRobotType(data);
};


/**
 * Sets the wheel diameter.
 * @param {!number} data
 * @private
 */
cwc.framework.Ev3.prototype.handleUpdateWheelDiameter_ = function(data) {
  this.setWheelDiameter(data);
};


/**
 * Sets the wheel diameter.
 * @param {!number} data
 * @private
 */
cwc.framework.Ev3.prototype.handleUpdateWheelWidth_ = function(data) {
  this.setWheelWidth(data);
};


/**
 * Sets the wheelbase.
 * @param {!number} data
 * @private
 */
cwc.framework.Ev3.prototype.handleUpdateWheelbase_ = function(data) {
  this.setWheelbase(data);
};
