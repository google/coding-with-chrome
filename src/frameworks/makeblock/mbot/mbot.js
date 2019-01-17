/**
 * @fileoverview mBot framework.
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
goog.provide('cwc.framework.makeblock.MBot');

goog.require('cwc.framework.Messenger');


/**
 * @constructor
 * @struct
 * @final
 * @export
 */
cwc.framework.makeblock.MBot = function() {
  /** @type {string} */
  this.name = 'mBot Framework';

  /** @type {!function(?)} */
  this.buttonEvent = function() {};

  /** @type {!function(?)} */
  this.lightnessSensorEvent = function() {};

  /** @type {!function(?, ?, ?)} */
  this.linefollowerSensorEvent = function() {};

  /** @type {!function(?)} */
  this.ultrasonicSensorEvent = function() {};

  /** @type {number} */
  this.buttonValue = 0;

  /** @type {number} */
  this.lightnessSensorValue = 0;

  /** @type {number} */
  this.linefollowerSensorValue = 0;

  /** @type {number} */
  this.ultrasonicSensorValue = 0;

  /** @type {number} */
  this.motorSpeed = 60 / 60;

  /** @private {!cwc.framework.Messenger} */
  this.messenger_ = new cwc.framework.Messenger()
    .setListenerScope(this)
    .addListener('__EVENT__BUTTON_PRESSED', this.handleButton_)
    .addListener('__EVENT__CHANGED_LIGHTNESS', this.handleLightnessSensor_)
    .addListener('__EVENT__CHANGED_LINEFOLLOWER',
      this.handleLineFollowerSensor_)
    .addListener('__EVENT__CHANGED_ULTRASONIC', this.handleUltrasonicSensor_);
};


/**
 * @deprecated since 2018
 */
cwc.framework.makeblock.MBot.prototype.setLEDColor =
  cwc.framework.makeblock.MBot.prototype.setRGBLED;


/**
 * Set the on-board LED color of the mBOt
 * @param {number} red 0-255
 * @param {number} green 0-255
 * @param {number} blue 0-255
 * @param {string=} index On-board LED: 0-both, 1-left, 2-right
 * @param {void=} delay
 * @export
 */
cwc.framework.makeblock.MBot.prototype.setRGBLED = function(
    red, green, blue, index, delay) {
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
cwc.framework.makeblock.MBot.prototype.playTone = function(frequency, duration,
    delay) {
  this.messenger_.send('playTone', {
    'frequency': frequency, 'duration': duration}, delay);
};


/**
 * get values from lightness sensors
 * @return {number}
 * @export
 */
cwc.framework.makeblock.MBot.prototype.getButtonValue = function() {
  return this.buttonValue;
};


/**
 * get values from lightness sensors
 * @return {number}
 * @export
 */
cwc.framework.makeblock.MBot.prototype.getLightnessSensorValue = function() {
  return this.lightnessSensorValue;
};


/**
 * get values from lightness sensors
 * @return {number}
 * @export
 */
cwc.framework.makeblock.MBot.prototype.getLinefollowerSensorValue = function() {
  return this.linefollowerSensorValue;
};


/**
 * get values from ultrasonic sensors
 * @return {number}
 * @export
 */
cwc.framework.makeblock.MBot.prototype.getUltrasonicSensorValue = function() {
  return this.ultrasonicSensorValue;
};


/**
 * @param {number} power
 * @return {number} Calculated delay + buffer.
 * @export
 */
cwc.framework.makeblock.MBot.prototype.getDelay = function(power) {
  let buffer = 250;
  let motorSpeed = this.motorSpeed;
  let delay = Math.floor(
    ((Math.abs(100 / power)) / motorSpeed) * 1000 + buffer);
  return delay;
};


/**
 * Turn mBot at a power
 * @param {number} power 0 - 255
 * @param {number|boolean=} opt_delay in msec or true for auto
 * @export
 */
cwc.framework.makeblock.MBot.prototype.rotatePower = function(power,
    opt_delay) {
  let delay = /** @type {number|undefined} */ (
    opt_delay === true ? this.getDelay(power) : opt_delay);
  this.messenger_.send('rotatePower', {'power': power}, delay);
};


/**
 * Rotates mBot for certain time and powers
 * @param {number} time in msec
 * @param {number} power 0 - 255
 * @export
 */
cwc.framework.makeblock.MBot.prototype.rotatePowerTime = function(time, power) {
  this.messenger_.send('rotatePower', {'power': power}, time);
  this.messenger_.send('rotatePower', {'power': 0}, 10);
};


/**
 * Move mBot for certain powers
 * @param {number} power 0 - 255
 * @param {number|boolean=} opt_delay in msec or true for auto
 * @export
 */
cwc.framework.makeblock.MBot.prototype.movePower = function(power, opt_delay) {
  let delay = /** @type {number|undefined} */ (
    opt_delay === true ? this.getDelay(power) : opt_delay);
  this.messenger_.send('movePower', {
    'power': power}, delay);
};


/**
 * Move mBot for certain time and powers
 * @param {number} time in msec
 * @param {number} power 0 - 255
 * @export
 */
cwc.framework.makeblock.MBot.prototype.movePowerTime = function(time, power) {
  this.messenger_.send('movePower', {'power': power}, time);
  this.messenger_.send('movePower', {'power': 0}, 10);
};


/**
 * Waits for the given time.
 * @param {number} time in msec
 * @export
 */
cwc.framework.makeblock.MBot.prototype.wait = function(time) {
  this.messenger_.send('wait', null, time);
};


/**
 * Stop the mBot
 * @param {number=} delay in msec
 * @export
 */
cwc.framework.makeblock.MBot.prototype.stop = function(delay) {
  this.messenger_.send('stop', null, delay);
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.makeblock.MBot.prototype.onButtonChange = function(func) {
  if (goog.isFunction(func)) {
    this.buttonEvent = func;
  }
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.makeblock.MBot.prototype.onLightnessSensorChange = function(
    func) {
  if (goog.isFunction(func)) {
    this.lightnessSensorEvent = func;
  }
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.makeblock.MBot.prototype.onLinefollowerSensorChange = function(
    func) {
  if (goog.isFunction(func)) {
    this.linefollowerSensorEvent = func;
  }
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.makeblock.MBot.prototype.onUltrasonicSensorChange = function(
    func) {
  if (goog.isFunction(func)) {
    this.ultrasonicSensorEvent = func;
  }
};


/**
 * @param {!Event} e
 * @private
 */
cwc.framework.makeblock.MBot.prototype.handleButton_ = function(e) {
  this.buttonValue = e.data;
  this.buttonEvent(e.data);
};


/**
 * @param {!Event} e
 * @private
 */
cwc.framework.makeblock.MBot.prototype.handleLightnessSensor_ = function(e) {
  this.lightnessSensorValue = e.data;
  this.lightnessSensorEvent(e.data);
};


/**
 * @param {!Event} e
 * @private
 */
cwc.framework.makeblock.MBot.prototype.handleLineFollowerSensor_ = function(e) {
  this.linefollowerSensorValue = e.data;
  this.linefollowerSensorEvent(e.data['left'], e.data['right'], e.data['raw']);
};


/**
 * @param {!Event} e
 * @private
 */
cwc.framework.makeblock.MBot.prototype.handleUltrasonicSensor_ = function(e) {
  this.ultrasonicSensorValue = e.data;
  this.ultrasonicSensorEvent(e.data);
};


// Global mapping
window['mBot'] = new cwc.framework.makeblock.MBot();
