/**
 * @fileoverview EV3 device constructor.
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
goog.provide('cwc.protocol.lego.ev3.Device');
goog.provide('cwc.protocol.lego.ev3.DeviceName');


/**
 * @enum {!Object.<string>|string}
 */
cwc.protocol.lego.ev3.DeviceName = {
  COLOR_SENSOR: 'Color Sensor',
  GYRO_SENSOR: 'Gyro Sensor',
  IR_SENSOR: 'IR Sensor',
  LARGE_MOTOR: 'Large Servo Motor',
  LARGE_MOTOR_OPT: 'Opt Large Servo Motor',
  MEDIUM_MOTOR: 'Medium Servo Motor',
  MEDIUM_MOTOR_OPT: 'Opt Medium Servo Motor',
  TOUCH_SENSOR: 'Touch Sensor',
  TOUCH_SENSOR_OPT: 'Opt Touch Sensor',
  ULTRASONIC_SENSOR: 'Ultrasonic Sensor',
  NONE: '',
};


/**
 * @param {!cwc.protocol.lego.ev3.DeviceName} name
 * @param {number=} opt_mode
 * @param {number=} optValue
 * @param {string=} opt_css
 * @constructor
 */
cwc.protocol.lego.ev3.Device = function(name, opt_mode, optValue, opt_css) {
  this.name = name;
  this.mode = opt_mode || 0;
  this.css = opt_css || 'default';
  this.value = optValue || 0;
};


/**
 * @param {number} value
 */
cwc.protocol.lego.ev3.Device.prototype.setValue = function(value) {
  this.value = value;
};


/**
 * @return {number}
 */
cwc.protocol.lego.ev3.Device.prototype.getValue = function() {
  return this.value;
};


/**
 * @return {!cwc.protocol.lego.ev3.DeviceName}
 */
cwc.protocol.lego.ev3.Device.prototype.getName = function() {
  return this.name;
};


/**
 * @return {number}
 */
cwc.protocol.lego.ev3.Device.prototype.getMode = function() {
  return this.mode;
};


/**
 * @param {!number} mode
 */
cwc.protocol.lego.ev3.Device.prototype.setMode = function(mode) {
  this.mode = mode;
};


/**
 * @param {!string} css
 */
cwc.protocol.lego.ev3.Device.prototype.setCss = function(css) {
  this.css = css;
};
