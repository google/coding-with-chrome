/**
 * @fileoverview mbot framework for runner instances.
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
goog.provide('cwc.framework.mBot');

goog.require('cwc.framework.Runner');



/**
 * @constructor
 * @param {!Function} code
 * @struct
 * @final
 * @export
 */
cwc.framework.mBot = function(code) {
  /** @type {string} */
  this.name = 'mbot Framework';

  /** @type {Function} */
  this.code = function() {code(this);}.bind(this);

  /** @private {!function(?)} */
  this.emptyFunction_ = function() {};

  /** @type {!function(?)} */
  this.ultrasonicSensorEvent = this.emptyFunction_;

  /** @type {!function(?)} */
  this.lightnessSensorEvent = this.emptyFunction_;

  /** @type {!cwc.framework.Runner} */
  this.runner = new cwc.framework.Runner(this.code, this);

  /** @type {float} [description] */
  this.ultrasonicSensorValue = 99999;

  /** @type {float} [description] */
  this.lightnessSensorValue = 99999;

  /** @type {!number} */
  this.motorSpeed = 60 / 60;

  // External commands
  this.runner.addCommand('updateUltrasonicSensor',
    this.handleUpdateUltrasonicSensorValue_);
  this.runner.addCommand('updateLightnessSensor',
    this.handleUpdateLightnessSensorValue_);
};


/**
 * Set the on-board LED color of the mBOt
 * @param {!number} red 0-255
 * @param {!number} green 0-255
 * @param {!number} blue 0-255
 * @param {string=} opt_position
 *   position of the on-board LED: 0-both, 1-left, 2-right
 * @param {void=} opt_delay
 * @export
 */
cwc.framework.mBot.prototype.setLEDColor = function(red, green, blue,
    opt_position, opt_delay) {
  this.runner.send('setLEDColor', {
    'red': red,
    'green': green,
    'blue': blue,
    'position': opt_position || 0}, opt_delay);
};


/**
 * Plays a tone through the buzzer.
 * @param  {int} frequency frequency of the note
 * @param  {int} duration  duration in milliseconds
 * @param  {null} opt_delay
 * @export
 */
cwc.framework.mBot.prototype.playTone = function(frequency, duration,
    opt_delay) {
  this.runner.send('playTone', {
    'frequency': frequency, 'duration': duration}, opt_delay);
};


/**
 * get values from ultrasonic sensors
 * @return {void}
 * @export
 */
cwc.framework.mBot.prototype.getUltrasonicSensorValue = function() {
  console.log('read ultrasonic sensor and get ' + this.ultrasonicSensorValue);
  return this.ultrasonicSensorValue;
};


/**
 * get values from lightness sensors
 * @return {void}
 * @export
 */
cwc.framework.mBot.prototype.getLightnessSensorValue = function() {
  return this.lightnessSensorValue;
};


/**
 * @param {!number} speed
 * @return {!number} Calculated delay + buffer.
 * @export
 */
cwc.framework.mBot.prototype.getDelay = function(speed) {
  var buffer = 250;
  var motorSpeed = this.motorSpeed;
  var delay = Math.floor(
    ((Math.abs(100 / speed)) / motorSpeed) * 1000 + buffer);
  return delay;
};


/**
 * Turn mBot at a speed
 * @param {!number} speed 0 - 255
 * @param {number=} opt_delay in msec or true for auto
 * @export
 */
cwc.framework.mBot.prototype.turnPower = function(speed, opt_delay) {
  var delay = opt_delay === true ? this.getDelay(speed) : opt_delay;
  this.runner.send('turnPower', {
    'speed': speed}, delay);
};


/**
 * Move mBot for certain speeds
 * @param {!number} speed 0 - 255
 * @param {number=} opt_delay in msec or true for auto
 * @export
 */
cwc.framework.mBot.prototype.movePower = function(speed, opt_delay) {
  var delay = opt_delay === true ? this.getDelay(speed) : opt_delay;
  this.runner.send('movePower', {
    'speed': speed}, delay);
};


/**
 * Waits for the given time.
 * @param {!number} time in msec
 * @export
 */
cwc.framework.mBot.prototype.wait = function(time) {
  this.runner.send('wait', null, time);
};


/**
 * Stop the mBot
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.mBot.prototype.stop = function(opt_delay) {
  this.runner.send('stop', null, opt_delay);
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.mBot.prototype.onUltrasonicSensorChange = function(func) {
  if (goog.isFunction(func)) {
    this.ultrasonicSensorEvent = func;
  }
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.mBot.prototype.onLightnessSensorChange = function(func) {
  if (goog.isFunction(func)) {
    this.lightnessSensorEvent = func;
  }
};


/**
 * @param {!number} data
 * @private
 */
cwc.framework.mBot.prototype.handleUpdateUltrasonicSensorValue_ = function(
    data) {
  this.ultrasonicSensorValue = data;
  this.ultrasonicSensorEvent(data);
};


/**
 * @param {!number} data
 * @private
 */
cwc.framework.mBot.prototype.handleUpdateLightnessSensorValue_ = function(
    data) {
  this.lightnessSensorValue = data;
  this.lightnessSensorEvent(data);
};
