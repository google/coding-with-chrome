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
goog.provide('cwc.framework.makeblock.mBot');

goog.require('cwc.framework.Runner');



/**
 * @constructor
 * @param {!Function} code
 * @struct
 * @final
 * @export
 */
cwc.framework.makeblock.mBot = function(code) {
  /** @type {string} */
  this.name = 'mbot Framework';

  /** @type {Function} */
  this.code = function() {code(this);}.bind(this);

  /** @private {!function(?)} */
  this.emptyFunction_ = function() {};

  /** @type {!function(?)} */
  this.buttonEvent = this.emptyFunction_;

  /** @type {!function(?)} */
  this.lightnessSensorEvent = this.emptyFunction_;

  /** @type {!function(?, ?, ?)} */
  this.linefollowerSensorEvent = this.emptyFunction_;

  /** @type {!function(?)} */
  this.ultrasonicSensorEvent = this.emptyFunction_;

  /** @type {!cwc.framework.Runner} */
  this.runner = new cwc.framework.Runner(this.code, this);

  /** @type {!number} */
  this.buttonValue = 0;

  /** @type {!number} */
  this.lightnessSensorValue = 0;

  /** @type {!number} */
  this.linefollowerSensorValue = 0;

  /** @type {!number} */
  this.ultrasonicSensorValue = 0;

  /** @type {!number} */
  this.motorSpeed = 60 / 60;

  // External commands
  this.runner.addCommand('updateButton', this.updateButton_);
  this.runner.addCommand('updateLightnessSensor',
    this.updateLightnessSensor_);
  this.runner.addCommand('updateLinefollowerSensor',
    this.updateLinefollowerSensor_);
  this.runner.addCommand('updateUltrasonicSensor',
      this.updateUltrasonicSensor_);
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
cwc.framework.makeblock.mBot.prototype.setLEDColor = function(red, green, blue,
    opt_position, opt_delay) {
  this.runner.send('setLEDColor', {
    'red': red,
    'green': green,
    'blue': blue,
    'position': opt_position || 0}, opt_delay);
};


/**
 * Plays a tone through the buzzer.
 * @param  {!number} frequency frequency of the note
 * @param  {!number} duration  duration in milliseconds
 * @param  {number=} opt_delay
 * @export
 */
cwc.framework.makeblock.mBot.prototype.playTone = function(frequency, duration,
    opt_delay) {
  this.runner.send('playTone', {
    'frequency': frequency, 'duration': duration}, opt_delay);
};


/**
 * get values from lightness sensors
 * @return {number}
 * @export
 */
cwc.framework.makeblock.mBot.prototype.getButtonValue = function() {
  return this.buttonValue;
};


/**
 * get values from lightness sensors
 * @return {number}
 * @export
 */
cwc.framework.makeblock.mBot.prototype.getLightnessSensorValue = function() {
  return this.lightnessSensorValue;
};


/**
 * get values from lightness sensors
 * @return {number}
 * @export
 */
cwc.framework.makeblock.mBot.prototype.getLinefollowerSensorValue = function() {
  return this.linefollowerSensorValue;
};


/**
 * get values from ultrasonic sensors
 * @return {number}
 * @export
 */
cwc.framework.makeblock.mBot.prototype.getUltrasonicSensorValue = function() {
  return this.ultrasonicSensorValue;
};



/**
 * @param {!number} speed
 * @return {!number} Calculated delay + buffer.
 * @export
 */
cwc.framework.makeblock.mBot.prototype.getDelay = function(speed) {
  var buffer = 250;
  var motorSpeed = this.motorSpeed;
  var delay = Math.floor(
    ((Math.abs(100 / speed)) / motorSpeed) * 1000 + buffer);
  return delay;
};


/**
 * Turn mBot at a speed
 * @param {!number} speed 0 - 255
 * @param {number|boolean=} opt_delay in msec or true for auto
 * @export
 */
cwc.framework.makeblock.mBot.prototype.rotatePower = function(speed,
    opt_delay) {
  var delay = opt_delay === true ? this.getDelay(speed) : opt_delay;
  this.runner.send('rotatePower', {
    'speed': speed}, delay);
};


/**
 * Rotates mBot for certain time and speeds
 * @param {!number} time in msec
 * @param {!number} speed 0 - 255
 * @export
 */
cwc.framework.makeblock.mBot.prototype.rotatePowerTime = function(time, speed) {
  this.runner.send('rotatePower', {
    'speed': speed}, time);
  this.runner.send('rotatePower', {
    'speed': 0}, 100);
};


/**
 * Move mBot for certain speeds
 * @param {!number} speed 0 - 255
 * @param {number|boolean=} opt_delay in msec or true for auto
 * @export
 */
cwc.framework.makeblock.mBot.prototype.movePower = function(speed, opt_delay) {
  var delay = opt_delay === true ? this.getDelay(speed) : opt_delay;
  this.runner.send('movePower', {
    'speed': speed}, delay);
};


/**
 * Move mBot for certain time and speeds
 * @param {!number} time in msec
 * @param {!number} speed 0 - 255
 * @export
 */
cwc.framework.makeblock.mBot.prototype.movePowerTime = function(time, speed) {
  this.runner.send('movePower', {
    'speed': speed}, time);
  this.runner.send('movePower', {
    'speed': 0}, 100);
};


/**
 * Waits for the given time.
 * @param {!number} time in msec
 * @export
 */
cwc.framework.makeblock.mBot.prototype.wait = function(time) {
  this.runner.send('wait', null, time);
};


/**
 * Stop the mBot
 * @param {number=} opt_delay in msec
 * @export
 */
cwc.framework.makeblock.mBot.prototype.stop = function(opt_delay) {
  this.runner.send('stop', null, opt_delay);
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.makeblock.mBot.prototype.onButtonChange = function(func) {
  if (goog.isFunction(func)) {
    this.buttonEvent = func;
  }
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.makeblock.mBot.prototype.onLightnessSensorChange = function(
    func) {
  if (goog.isFunction(func)) {
    this.lightnessSensorEvent = func;
  }
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.makeblock.mBot.prototype.onLinefollowerSensorChange = function(
    func) {
  if (goog.isFunction(func)) {
    this.linefollowerSensorEvent = func;
  }
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.makeblock.mBot.prototype.onUltrasonicSensorChange = function(
    func) {
  if (goog.isFunction(func)) {
    this.ultrasonicSensorEvent = func;
  }
};


/**
 * @param {!number} data
 * @private
 */
cwc.framework.makeblock.mBot.prototype.updateButton_ = function(data) {
  this.buttonValue = data;
  this.buttonEvent(data);
};


/**
 * @param {!number} data
 * @private
 */
cwc.framework.makeblock.mBot.prototype.updateLightnessSensor_ = function(data) {
  this.lightnessSensorValue = data;
  this.lightnessSensorEvent(data);
};


/**
 * @param {!number} data
 * @private
 */
cwc.framework.makeblock.mBot.prototype.updateLinefollowerSensor_ = function(
    data) {
  this.linefollowerSensorValue = data;
  this.linefollowerSensorEvent(data['left'], data['right'], data['raw']);
};


/**
 * @param {!number} data
 * @private
 */
cwc.framework.makeblock.mBot.prototype.updateUltrasonicSensor_ = function(
    data) {
  this.ultrasonicSensorValue = data;
  this.ultrasonicSensorEvent(data);
};
