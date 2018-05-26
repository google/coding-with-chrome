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

goog.require('cwc.framework.Messenger');
goog.require('cwc.protocol.lego.ev3.LedColor');
goog.require('cwc.protocol.lego.ev3.LedMode');
goog.require('cwc.protocol.lego.ev3.RobotType');
goog.require('cwc.protocol.lego.ev3.Robots');


/**
 * @constructor
 * @struct
 * @final
 * @export
 */
cwc.framework.Ev3 = function() {
  /** @type {string} */
  this.name = 'EV3 Framework';

  /** @type {Object} */
  this.deviceInfo = {};

  /** @type {cwc.protocol.lego.ev3.RobotType} */
  this.robotType = cwc.protocol.lego.ev3.RobotType.UNKNOWN;

  /** @type {number} */
  this.wheelDiameter = 0;

  /** @type {number} */
  this.wheelCircumference = 0;

  /** @type {!number} */
  this.wheelWidth = 0;

  /** @type {number} */
  this.wheelbase = 0;

  /** @type {number} */
  this.rotateCircumference = 0;

  /** @type {!number} */
  this.largeMotorSpeed = 170 / 60;

  /** @type {!number} */
  this.mediumMotorSpeed = 250 / 60;

  /** @private {!cwc.protocol.lego.ev3.Devices} */
  this.deviceData_ = {};

  /** @private {Object} */
  this.sensorData_ = {};

  /** @private {Object.<Function>} */
  this.events_ = {
    '0': function() {},
    '1': function() {},
    '2': function() {},
    '3': function() {},
    '16': function() {},
    '17': function() {},
    '18': function() {},
    '19': function() {},
  };

  /** @private {!cwc.framework.Messenger} */
  this.messenger_ = new cwc.framework.Messenger()
    .setListenerScope(this)
    .addListener('__EVENT__CHANGED_DEVICES', this.handleDeviceEvent_)
    .addListener('__EVENT__COL-AMBIENT', this.handleSensorEvent_)
    .addListener('__EVENT__COL-COLOR', this.handleSensorEvent_)
    .addListener('__EVENT__COL-REFLECT', this.handleSensorEvent_)
    .addListener('__EVENT__GYRO-ANG', this.handleSensorEvent_)
    .addListener('__EVENT__GYRO-RATE', this.handleSensorEvent_)
    .addListener('__EVENT__IR-PROX', this.handleSensorEvent_)
    .addListener('__EVENT__IR-REMOTE', this.handleSensorEvent_)
    .addListener('__EVENT__IR-SEEK', this.handleSensorEvent_)
    .addListener('__EVENT__L-MOTOR-DEG', this.handleSensorEvent_)
    .addListener('__EVENT__L-MOTOR-ROT', this.handleSensorEvent_)
    .addListener('__EVENT__M-MOTOR-DEG', this.handleSensorEvent_)
    .addListener('__EVENT__M-MOTOR-ROT', this.handleSensorEvent_)
    .addListener('__EVENT__TOUCH', this.handleSensorEvent_)
    .addListener('__EVENT__US-DIST-CM', this.handleSensorEvent_)
    .addListener('__EVENT__US-DIST-IN', this.handleSensorEvent_)
    .addListener('__EVENT__US-LISTEN', this.handleSensorEvent_)
    .addListener('updateDeviceInfo', this.handleUpdateDeviceInfo_)
    .addListener('updateRobotType', this.handleUpdateRobotType_)
    .addListener('updateWheelDiameter', this.handleUpdateWheelDiameter_)
    .addListener('updateWheelWidth', this.handleUpdateWheelWidth_)
    .addListener('updateWheelbase', this.handleUpdateWheelbase_);
};


/**
 * Sets the EV3 robot model
 * @param {!string} model
 * @export
 */
cwc.framework.Ev3.prototype.setRobotModel = function(model) {
  if (model == 'custom') {
    return;
  }
  if (!(model in cwc.protocol.lego.ev3.Robots)) {
    console.error('Unknown robot model: ' + model);
    return;
  }
  console.log('Set robot model to ' + model);
  this.setRobotType(cwc.protocol.lego.ev3.Robots[model].type);
  this.setWheelDiameter(cwc.protocol.lego.ev3.Robots[model].wheelDiameter);
  this.setWheelWidth(cwc.protocol.lego.ev3.Robots[model].wheelWidth);
  this.setWheelbase(cwc.protocol.lego.ev3.Robots[model].wheelbase);
};


/**
 * Sets the EV3 robot type.
 * @param {!cwc.protocol.lego.ev3.RobotType<string>} type
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
 * @param {number=} speed
 * @return {!number} Calculated delay + buffer.
 * @export
 */
cwc.framework.Ev3.prototype.getDelay = function(steps, speed = 50) {
  let buffer = 250;
  let motorSpeed = this.largeMotorSpeed;
  let delay = Math.floor(
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
 * @param {!number} port
 * @param {!Function} func
 * @export
 */
cwc.framework.Ev3.prototype.onSensorChange = function(port, func) {
  if (goog.isFunction(func)) {
    this.events_[port] = func;
  }
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
 * @param {!string} filename
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Ev3.prototype.drawImage = function(filename, opt_delay) {
  this.messenger_.send('drawImage', {'file': filename}, opt_delay);
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
  this.messenger_.send('playTone', {
    'frequency': frequency,
    'duration': opt_duration,
    'volume': opt_volume}, opt_delay);
};


/**
 * Plays a sound file.
 * @param {!string} filename
 * @param {number=} opt_volume
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Ev3.prototype.playSound = function(filename, opt_volume,
    opt_delay) {
  this.messenger_.send('playSound', {
    'file': filename,
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
  this.messenger_.send('moveServo', {
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
  this.messenger_.send('movePen', {
    'steps': steps,
    'speed': opt_speed,
    'color': opt_color}, opt_delay);
};


/**
 * Moves the motors for the specific steps.
 * @param {!number} steps
 * @param {number=} opt_speed
 * @param {number|boolean=} opt_delay in msec or true for auto
 * @export
 */
cwc.framework.Ev3.prototype.moveSteps = function(steps, opt_speed, opt_delay) {
  if (this.robotType == cwc.protocol.lego.ev3.RobotType.ARM) {
    this.customMoveSteps(steps, undefined, opt_speed, opt_delay);
  } else {
    let delay = /** @type {number|undefined} */ (
      opt_delay === true ? this.getDelay(steps, opt_speed) : opt_delay);
    let distance = Math.round((this.wheelCircumference * (steps/360)) / 10);
    this.messenger_.send('moveSteps', {
      'distance': distance,
      'steps': steps,
      'speed': opt_speed}, delay);
  }
};


/**
 * Moves the motors for the specific steps.
 * @param {!number} steps
 * @param {number=} opt_ports
 * @param {number=} opt_speed
 * @param {number|boolean=} opt_delay in msec or true for auto
 * @export
 */
cwc.framework.Ev3.prototype.customMoveSteps = function(steps, opt_ports,
    opt_speed, opt_delay) {
  let delay = /** @type {number|undefined} */ (
    opt_delay === true ? this.getDelay(steps, opt_speed) : opt_delay);
  this.messenger_.send('customMoveSteps', {
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
  let steps = Math.round((distance * 10 / this.wheelCircumference) * 360);
  let delay = /** @type {number|undefined} */ (
    opt_delay === true ? this.getDelay(steps, opt_speed) : opt_delay);
  this.messenger_.send('moveSteps', {
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
  this.messenger_.send('rotateSteps', {
    'steps': steps,
    'speed': opt_speed,
    'ratio': opt_ratio}, opt_delay);
};


/**
 * Rotates the motors for the predefined angle steps.
 * @param {!number} angle
 * @param {number=} opt_speed
 * @param {number|boolean=} opt_delay in msec or true for auto
 * @export
 */
cwc.framework.Ev3.prototype.rotateAngle = function(angle,
    opt_speed, opt_delay) {
  if (this.robotType == cwc.protocol.lego.ev3.RobotType.ARM) {
    this.customRotateAngle(angle, undefined, opt_speed, opt_delay);
  } else {
    let rotateDistance = this.rotateCircumference / 360;
    let steps = Math.round(
      (rotateDistance * angle / this.wheelCircumference) * 360);
    let delay = /** @type {number|undefined} */ (
     opt_delay === true ? this.getDelay(steps, opt_speed) : opt_delay);
    this.messenger_.send('rotateSteps', {
      'angle': angle,
      'steps': steps,
      'speed': opt_speed}, delay);
  }
};


/**
 * Rotates the motors for the predefined angle steps.
 * @param {!number} angle
 * @param {number=} opt_ports
 * @param {number=} opt_speed
 * @param {number|boolean=} opt_delay in msec or true for auto
 * @export
 */
cwc.framework.Ev3.prototype.customRotateAngle = function(angle,
    opt_ports, opt_speed, opt_delay) {
  let rotateDistance = this.rotateCircumference / 360;
  let steps = Math.round(
    (rotateDistance * angle / this.wheelCircumference) * 360);
  let delay = /** @type {number|undefined} */ (
    opt_delay === true ? this.getDelay(steps, opt_speed) : opt_delay);
  this.messenger_.send('customRotateSteps', {
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
  this.messenger_.send('movePower', {'power': power}, opt_delay);
};


/**
 * Rotates left / right with power.
 * @param {!number} powerLeft General power value.
 * @param {number=} powerRight Dedicated power value for the second motor.
 * @param {number=} delay in msec
 * @export
 */
cwc.framework.Ev3.prototype.rotatePower = function(powerLeft, powerRight,
    delay) {
  this.messenger_.send('rotatePower', {
    'power_left': powerLeft,
    'power_right': powerRight || powerLeft}, delay);
};


/**
 * Stops all motors.
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Ev3.prototype.stop = function(opt_delay) {
  this.messenger_.send('stop', null, opt_delay);
};


/**
 * Waits for the given time.
 * @param {!number} time in msec
 * @export
 */
cwc.framework.Ev3.prototype.wait = function(time) {
  this.messenger_.send('wait', null, time);
};


/**
 * @param {!number} port
 * @param {!number} mode
 * @param {number=} delay
 */
cwc.framework.Ev3.prototype.setSensorMode = function(port, mode, delay) {
  this.messenger_.send('setSensorMode', {'port': port, 'mode': mode}, delay);
};


/**
 * @param {!number} mode
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Ev3.prototype.setColorSensorMode = function(mode, opt_delay) {
  this.messenger_.send('setColorSensorMode', {'mode': mode}, opt_delay);
};


/**
 * @param {!number} mode
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Ev3.prototype.setIrSensorMode = function(mode, opt_delay) {
  this.messenger_.send('setIrSensorMode', {'mode': mode}, opt_delay);
};


/**
 * @param {!number} mode
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Ev3.prototype.setUltrasonicSensorMode = function(mode,
    opt_delay) {
  this.messenger_.send('setUltrasonicSensorMode', {'mode': mode}, opt_delay);
};


/**
 * @param {cwc.protocol.lego.ev3.LedColor} color
 * @param {cwc.protocol.lego.ev3.LedMode=} opt_mode
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Ev3.prototype.setLed = function(color, opt_mode, opt_delay) {
  this.messenger_.send('setLed', {
    'color': color,
    'mode': opt_mode}, opt_delay);
};


/**
 * @param {!number} speed
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.Ev3.prototype.setStepSpeed = function(speed, opt_delay) {
  this.messenger_.send('setStepSpeed', {'speed': speed}, opt_delay);
};


/**
 * @param {!number} event
 * @private
 */
cwc.framework.Ev3.prototype.handleDeviceEvent_ = function(event) {
  console.log('Device Event ' + event.data);
  this.deviceData_ = event.data;
};


/**
 * @param {!number} event
 * @private
 */
cwc.framework.Ev3.prototype.handleSensorEvent_ = function(event) {
  this.sensorData_[event.source] = event.data;
  this.events_[event.source](event.data);
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
 * Sets the robot type.
 * @param {!cwc.protocol.lego.ev3.RobotType<string>} data
 * @private
 */
cwc.framework.Ev3.prototype.handleUpdateRobotType_ = function(data) {
  this.setRobotType(data);
};


/**
 * Sets the wheel diameter
 * @param {!number} data
 * @private
 */
cwc.framework.Ev3.prototype.handleUpdateWheelDiameter_ = function(data) {
  this.setWheelDiameter(data);
};


/**
 * @param {Object} data
 * @private
 */
cwc.framework.Ev3.prototype.handleUpdateGamepad_ = function(data) {
  console.log(data);
  console.log(data['buttons']);
};


/**
 * Sets the wheel diameter
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


// Global mapping
window['ev3'] = new cwc.framework.Ev3();
