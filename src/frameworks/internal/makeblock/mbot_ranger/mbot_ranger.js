/**
 * @fileoverview mBot framework for runner instances.
 *
 * @license Copyright 2016 Shenzhen Maker Works Co, Ltd. All Rights Reserved.
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
 * @author wangyu@makeblock.cc (Yu Wang)
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.provide('cwc.framework.makeblock.mBotRanger');

goog.require('cwc.framework.Runner');


/**
 * @constructor
 * @param {!Function} code
 * @struct
 * @final
 * @export
 */
cwc.framework.makeblock.mBotRanger = function(code) {
  /** @type {string} */
  this.name = 'mBot Ranger Framework';

  /** @private {!function(?)} */
  this.emptyFunction_ = function() {};

  /** @type {!function(?)} */
  this.buttonEvent = this.emptyFunction_;

  /** @type {!function(?)} */
  this.temperatureSensorEvent = this.emptyFunction_;

  /** @type {!function(?, ?)} */
  this.lightnessSensorEvent = this.emptyFunction_;

  /** @type {!function(?, ?, ?)} */
  this.lineFollowerSensorEvent = this.emptyFunction_;

  /** @type {!function(?)} */
  this.ultrasonicSensorEvent = this.emptyFunction_;

  /** @type {Function} */
  this.code = code;

  /** @type {!cwc.framework.Runner} */
  this.runner = new cwc.framework.Runner()
    .setScope(this)
    .setCallback(this.code)
    .setMonitor(this.monitor_);

  /** @type {!number} */
  this.buttonValue = 0;

  /** @type {!number} */
  this.temperatureSensorValue = 0;

  /** @type {!number} */
  this.lightnessSensorValue = 0;

  /** @type {!number} */
  this.lineFollowerSensorValue = 0;

  /** @type {!number} */
  this.ultrasonicSensorValue = 0;

  /** @type {!number} */
  this.motorSpeed = 60 / 60;

  this.addCommandListener();
};


/**
 * Enable external listener
 */
cwc.framework.makeblock.mBotRanger.prototype.addCommandListener = function() {
  this.runner.addCommand('updateTemperatureSensor',
    this.updateTemperatureSensor_);
  this.runner.addCommand('updateLightnessSensor',
    this.updateLightnessSensor_);
  this.runner.addCommand('updateLineFollowerSensor',
    this.updateLineFollowerSensor_);
  this.runner.addCommand('updateUltrasonicSensor',
    this.updateUltrasonicSensor_);
};


/**
 * Set the on-board LED color of the mBOt
 * @param {!number} red 0-255
 * @param {!number} green 0-255
 * @param {!number} blue 0-255
 * @param {string=} opt_index 1-14
 * @param {number=} opt_delay
 * @export
 */
cwc.framework.makeblock.mBotRanger.prototype.setRGBLED = function(red, green,
    blue, opt_index, opt_delay) {
  this.runner.send('setRGBLED', {
    'red': red,
    'green': green,
    'blue': blue,
    'index': opt_index || 0}, opt_delay);
};


/**
 * Plays a tone through the buzzer.
 * @param  {!number} frequency frequency of the note
 * @param  {!number} duration  duration in milliseconds
 * @param  {number=} opt_delay
 * @export
 */
cwc.framework.makeblock.mBotRanger.prototype.playTone = function(frequency,
    duration, opt_delay) {
  this.runner.send('playTone', {
    'frequency': frequency, 'duration': duration}, opt_delay);
};


/**
 * get values from lightness sensors
 * @return {number}
 * @export
 */
cwc.framework.makeblock.mBotRanger.prototype.getButtonValue = function() {
  return this.buttonValue;
};


/**
 * get values from temperature sensors
 * @return {number}
 * @export
 */
cwc.framework.makeblock.mBotRanger.prototype.getTemperatureSensorValue =
function() {
  return this.temperatureSensorValue;
};


/**
 * get values from lightness sensors
 * @return {number}
 * @export
 */
cwc.framework.makeblock.mBotRanger.prototype.getLightnessSensorValue =
function() {
  return this.lightnessSensorValue;
};


/**
 * get values from line follower sensors
 * @return {number}
 * @export
 */
cwc.framework.makeblock.mBotRanger.prototype.getLineFollowerSensorValue =
function() {
  return this.lineFollowerSensorValue;
};


/**
 * get values from ultrasonic sensors
 * @return {number}
 * @export
 */
cwc.framework.makeblock.mBotRanger.prototype.getUltrasonicSensorValue =
function() {
  return this.ultrasonicSensorValue;
};


/**
 * @param {!number} speed
 * @return {!number} Calculated delay + buffer.
 * @export
 */
cwc.framework.makeblock.mBotRanger.prototype.getDelay = function(speed) {
  let buffer = 250;
  let motorSpeed = this.motorSpeed;
  let delay = Math.floor(
    ((Math.abs(100 / speed)) / motorSpeed) * 1000 + buffer);
  return delay;
};


/**
 * Turn mBot at a speed
 * @param {!number} power -255 - 255
 * @param {number=} opt_delay in msec or true for auto
 * @export
 */
cwc.framework.makeblock.mBotRanger.prototype.rotatePower = function(power,
    opt_delay) {
  this.runner.send('rotatePower', {
    'power': power});
};


/**
 * Rotates mBot for certain time and speeds
 * @param {!number} time in msec
 * @param {!number} power -255 - 255
 * @export
 */
cwc.framework.makeblock.mBotRanger.prototype.rotatePowerTime = function(time,
    power) {
  this.runner.send('rotatePower', {
    'power': power}, time);
  this.runner.send('rotatePower', {
    'power': 0}, 100);
};


/**
 * Move mBot for certain speeds
 * @param {!number} power -255 - 255
 * @param {number=} opt_slot
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.makeblock.mBotRanger.prototype.movePower = function(power,
    opt_slot, opt_delay) {
  this.runner.send('movePower', {
    'power': power,
    'slot': opt_slot});
};


/**
 * Move mBot for certain time and speeds
 * @param {!number} time in msec
 * @param {!number} power -255 - 255
 * @export
 */
cwc.framework.makeblock.mBotRanger.prototype.movePowerTime = function(time,
    power) {
  this.runner.send('movePower', {
    'power': power}, time);
  this.runner.send('movePower', {
    'power': 0}, 100);
};


/**
 * Move mBot for certain speeds
 * @param {!number} steps 0 - 255
 * @param {number=} opt_speed 0 - 255
 * @param {number=} opt_delay in msec or true for auto
 * @export
 */
cwc.framework.makeblock.mBotRanger.prototype.moveSteps = function(steps,
    opt_speed, opt_delay) {
  this.runner.send('moveSteps', {
    'steps': steps,
    'power': opt_speed}, 200);
};


/**
 * Waits for the given time.
 * @param {!number} time in msec
 * @export
 */
cwc.framework.makeblock.mBotRanger.prototype.wait = function(time) {
  this.runner.send('wait', null, time);
};


/**
 * Stop the mBot
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.makeblock.mBotRanger.prototype.stop = function(opt_delay) {
  this.runner.send('stop', null, opt_delay);
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.makeblock.mBotRanger.prototype.onButtonChange = function(func) {
  if (goog.isFunction(func)) {
    this.buttonEvent = func;
  }
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.makeblock.mBotRanger.prototype.onTemperatureSensorChange =
function(func) {
  if (goog.isFunction(func)) {
    this.temperatureSensorEvent = func;
  }
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.makeblock.mBotRanger.prototype.onLightnessSensorChange = function(
    func) {
  if (goog.isFunction(func)) {
    this.lightnessSensorEvent = func;
  }
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.makeblock.mBotRanger.prototype.onLineFollowerSensorChange =
function(func) {
  if (goog.isFunction(func)) {
    this.lineFollowerSensorEvent = func;
  }
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.makeblock.mBotRanger.prototype.onUltrasonicSensorChange =
function(func) {
  if (goog.isFunction(func)) {
    this.ultrasonicSensorEvent = func;
  }
};


/**
 * @param {!number} data
 * @private
 */
cwc.framework.makeblock.mBotRanger.prototype.updateTemperatureSensor_ =
function(data) {
  this.temperatureSensorValue = data;
  this.temperatureSensorEvent(data);
};


/**
 * @param {!number} data
 * @private
 */
cwc.framework.makeblock.mBotRanger.prototype.updateLightnessSensor_ =
function(data) {
  this.lightnessSensorValue = data;
  this.lightnessSensorEvent(data['sensor_1'], data['sensor_2']);
};


/**
 * @param {!number} data
 * @private
 */
cwc.framework.makeblock.mBotRanger.prototype.updateLineFollowerSensor_ =
function(data) {
  this.lineFollowerSensorValue = data;
  this.lineFollowerSensorEvent(data['left'], data['right'], data['raw']);
};


/**
 * @param {!number} data
 * @private
 */
cwc.framework.makeblock.mBotRanger.prototype.updateUltrasonicSensor_ =
function(data) {
  this.ultrasonicSensorValue = data;
  this.ultrasonicSensorEvent(data);
};


/**
 * @private
 */
cwc.framework.makeblock.mBotRanger.prototype.monitor_ = function() {
  this.runner.enableMonitor(this.code, 'mBotRanger.onLineFollowerSensorChange',
    'setLineFollowerMonitor');
  this.runner.enableMonitor(this.code, 'mBotRanger.onLightnessSensorChange',
    'setLightnessMonitor');
  this.runner.enableMonitor(this.code, 'mBotRanger.onTemperatureSensorChange',
    'setTemperatureMonitor');
  this.runner.enableMonitor(this.code, 'mBotRanger.onUltrasonicSensorChange',
    'setUltrasonicMonitor');
};
