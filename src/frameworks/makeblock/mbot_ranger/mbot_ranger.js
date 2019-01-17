/**
 * @fileoverview mBot Ranger framework.
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
goog.provide('cwc.framework.makeblock.MBotRanger');

goog.require('cwc.framework.Messenger');


/**
 * @constructor
 * @struct
 * @final
 * @export
 */
cwc.framework.makeblock.MBotRanger = function() {
  /** @type {string} */
  this.name = 'mBot Ranger Framework';

  /** @type {!function(?)} */
  this.buttonEvent = function() {};

  /** @type {!function(?)} */
  this.temperatureSensorEvent = function() {};

  /** @type {!function(?, ?)} */
  this.lightnessSensorEvent = function() {};

  /** @type {!function(?, ?, ?)} */
  this.lineFollowerSensorEvent = function() {};

  /** @type {!function(?)} */
  this.ultrasonicSensorEvent = function() {};

  /** @type {number} */
  this.buttonValue = 0;

  /** @type {number} */
  this.temperatureSensorValue = 0;

  /** @type {number} */
  this.lightnessSensorValue = 0;

  /** @type {number} */
  this.lineFollowerSensorValue = 0;

  /** @type {number} */
  this.ultrasonicSensorValue = 0;

  /** @type {number} */
  this.motorSpeed = 60 / 60;

  /** @private {!cwc.framework.Messenger} */
  this.messenger_ = new cwc.framework.Messenger()
    .setListenerScope(this)
    .addListener('__EVENT__CHANGED_LIGHTNESS', this.handleLightnessSensor_)
    .addListener('__EVENT__CHANGED_LINEFOLLOWER',
      this.handleLineFollowerSensor_)
    .addListener('__EVENT__CHANGED_TEMPERATURE', this.handleTemperatureSensor_)
    .addListener('__EVENT__CHANGED_ULTRASONIC', this.handleUltrasonicSensor_);
};


/**
 * Set the on-board LED color of the mBOt
 * @param {number} red 0-255
 * @param {number} green 0-255
 * @param {number} blue 0-255
 * @param {string=} index 1-14
 * @param {number=} delay
 * @export
 */
cwc.framework.makeblock.MBotRanger.prototype.setRGBLED = function(red, green,
    blue, index, delay) {
  this.messenger_.send('setRGBLED', {
    'red': red,
    'green': green,
    'blue': blue,
    'index': index || 0}, delay);
};


/**
 * Plays a tone through the buzzer.
 * @param  {number} frequency frequency of the note
 * @param  {number} duration  duration in milliseconds
 * @param  {number=} delay
 * @export
 */
cwc.framework.makeblock.MBotRanger.prototype.playTone = function(frequency,
    duration, delay) {
  this.messenger_.send('playTone', {
    'frequency': frequency, 'duration': duration}, delay);
};


/**
 * get values from lightness sensors
 * @return {number}
 * @export
 */
cwc.framework.makeblock.MBotRanger.prototype.getButtonValue = function() {
  return this.buttonValue;
};


/**
 * get values from temperature sensors
 * @return {number}
 * @export
 */
cwc.framework.makeblock.MBotRanger.prototype.getTemperatureSensorValue =
function() {
  return this.temperatureSensorValue;
};


/**
 * get values from lightness sensors
 * @return {number}
 * @export
 */
cwc.framework.makeblock.MBotRanger.prototype.getLightnessSensorValue =
function() {
  return this.lightnessSensorValue;
};


/**
 * get values from line follower sensors
 * @return {number}
 * @export
 */
cwc.framework.makeblock.MBotRanger.prototype.getLineFollowerSensorValue =
function() {
  return this.lineFollowerSensorValue;
};


/**
 * get values from ultrasonic sensors
 * @return {number}
 * @export
 */
cwc.framework.makeblock.MBotRanger.prototype.getUltrasonicSensorValue =
function() {
  return this.ultrasonicSensorValue;
};


/**
 * Turn mBot at a speed
 * @param {number} power -255 - 255
 * @param {number=} opt_delay in msec or true for auto
 * @export
 */
cwc.framework.makeblock.MBotRanger.prototype.rotatePower = function(power,
    opt_delay) {
  this.messenger_.send('rotatePower', {'power': power});
};


/**
 * Rotates mBot for certain time and speeds
 * @param {number} time in msec
 * @param {number} power -255 - 255
 * @export
 */
cwc.framework.makeblock.MBotRanger.prototype.rotatePowerTime = function(time,
    power) {
  this.messenger_.send('rotatePower', {'power': power}, time);
  this.messenger_.send('rotatePower', {'power': 0}, 10);
};


/**
 * Move mBot for certain speeds
 * @param {number} power -255 - 255
 * @param {number=} slot
 * @param {number=} delay in msec
 * @export
 */
cwc.framework.makeblock.MBotRanger.prototype.movePower = function(power,
    slot, delay) {
  this.messenger_.send('movePower', {
    'power': power,
    'slot': slot}, delay);
};


/**
 * Move mBot for certain time and speeds
 * @param {number} time in msec
 * @param {number} power -255 - 255
 * @export
 */
cwc.framework.makeblock.MBotRanger.prototype.movePowerTime = function(time,
    power) {
  this.messenger_.send('movePower', {'power': power}, time);
  this.messenger_.send('movePower', {'power': 0}, 10);
};


/**
 * Move mBot for certain speeds
 * @param {number} steps 0 - 255
 * @param {number=} speed 0 - 255
 * @param {number=} delay in msec or true for auto
 * @export
 */
cwc.framework.makeblock.MBotRanger.prototype.moveSteps = function(steps,
    speed, delay) {
  this.messenger_.send('moveSteps', {
    'steps': steps,
    'power': speed}, delay || 200);
};


/**
 * Waits for the given time.
 * @param {number} time in msec
 * @export
 */
cwc.framework.makeblock.MBotRanger.prototype.wait = function(time) {
  this.messenger_.send('wait', null, time);
};


/**
 * Stop the mBot
 * @param {number=} delay in msec
 * @export
 */
cwc.framework.makeblock.MBotRanger.prototype.stop = function(delay) {
  this.messenger_.send('stop', null, delay);
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.makeblock.MBotRanger.prototype.onButtonChange = function(func) {
  if (goog.isFunction(func)) {
    this.buttonEvent = func;
  }
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.makeblock.MBotRanger.prototype.onTemperatureSensorChange =
function(func) {
  if (goog.isFunction(func)) {
    this.temperatureSensorEvent = func;
  }
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.makeblock.MBotRanger.prototype.onLightnessSensorChange =
function(func) {
  if (goog.isFunction(func)) {
    this.lightnessSensorEvent = func;
  }
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.makeblock.MBotRanger.prototype.onLineFollowerSensorChange =
function(func) {
  if (goog.isFunction(func)) {
    this.lineFollowerSensorEvent = func;
  }
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.makeblock.MBotRanger.prototype.onUltrasonicSensorChange =
function(func) {
  if (goog.isFunction(func)) {
    this.ultrasonicSensorEvent = func;
  }
};


/**
 * @param {!Event} event
 * @private
 */
cwc.framework.makeblock.MBotRanger.prototype.handleTemperatureSensor_ =
function(event) {
  this.temperatureSensorValue = event.data;
  this.temperatureSensorEvent(event.data);
};


/**
 * @param {!Event} event
 * @private
 */
cwc.framework.makeblock.MBotRanger.prototype.handleLightnessSensor_ =
function(event) {
  this.lightnessSensorValue = event.data;
  this.lightnessSensorEvent(event.data['sensor_1'], event.data['sensor_2']);
};


/**
 * @param {!Event} event
 * @private
 */
cwc.framework.makeblock.MBotRanger.prototype.handleLineFollowerSensor_ =
function(event) {
  this.lineFollowerSensorValue = event.data;
  this.lineFollowerSensorEvent(
    event.data['left'], event.data['right'], event.data['raw']);
};


/**
 * @param {!Event} event
 * @private
 */
cwc.framework.makeblock.MBotRanger.prototype.handleUltrasonicSensor_ =
function(event) {
  this.ultrasonicSensorValue = event.data;
  this.ultrasonicSensorEvent(event.data);
};


// Global mapping
window['mBotRanger'] = new cwc.framework.makeblock.MBotRanger();
