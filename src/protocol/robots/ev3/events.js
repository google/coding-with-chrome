/**
 * @fileoverview EV3 Event definitions.
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
goog.provide('cwc.protocol.ev3.Events');


/**
 * Custom events.
 * @enum {string}
 */
cwc.protocol.ev3.Events.Type = {
  CHANGED_DEVICES: 'changed_devices',
  CHANGED_VALUES: 'changed_values',
  COLOR_SENSOR: 'color_sensor_value_changed',
  GYRO_SENSOR: 'gyro_sensor_value_changed',
  IR_SENSOR: 'ir_sensor_value_changed',
  LARGE_MOTOR_OPT: 'large_motor_optValue_changed',
  LARGE_MOTOR: 'large_motor_value_changed',
  MEDIUM_MOTOR_OPT: 'medium_motor_optValue_changed',
  MEDIUM_MOTOR: 'medium_motor_value_changed',
  TOUCH_SENSOR_OPT: 'touch_sensor_optValue_changed',
  TOUCH_SENSOR: 'touch_sensor_value_changed',
  ULTRASONIC_SENSOR: 'ultra_sonic_sensor_value_changed',
};


/**
 * @param {Object} data
 * @return {!cwc.protocol.ev3.Events.Data_}
 * @final
 */
cwc.protocol.ev3.Events.changedDevices = function(data) {
  return new cwc.protocol.ev3.Events.Data_(
      cwc.protocol.ev3.Events.Type.CHANGED_DEVICES, data);
};


/**
 * @param {Object|number} data
 * @param {number=} opt_port
 * @return {!cwc.protocol.ev3.Events.Data_}
 * @final
 */
cwc.protocol.ev3.Events.colorSensorValue = function(data, opt_port) {
  return new cwc.protocol.ev3.Events.Data_(
      cwc.protocol.ev3.Events.Type.COLOR_SENSOR, data, opt_port);
};


/**
 * @param {Object|number} data
 * @param {number=} opt_port
 * @return {!cwc.protocol.ev3.Events.Data_}
 * @final
 */
cwc.protocol.ev3.Events.gyroSensorValue = function(data, opt_port) {
  return new cwc.protocol.ev3.Events.Data_(
      cwc.protocol.ev3.Events.Type.GYRO_SENSOR, data, opt_port);
};


/**
 * @param {Object|number} data
 * @param {number=} opt_port
 * @return {!cwc.protocol.ev3.Events.Data_}
 * @final
 */
cwc.protocol.ev3.Events.irSensorValue = function(data, opt_port) {
  return new cwc.protocol.ev3.Events.Data_(
      cwc.protocol.ev3.Events.Type.IR_SENSOR, data, opt_port);
};


/**
 * @param {Object|number} data
 * @param {number=} opt_port
 * @return {!cwc.protocol.ev3.Events.Data_}
 * @final
 */
cwc.protocol.ev3.Events.largeMotorValue = function(data, opt_port) {
  return new cwc.protocol.ev3.Events.Data_(
      cwc.protocol.ev3.Events.Type.LARGE_MOTOR, data, opt_port);
};


/**
 * @param {Object|number} data
 * @param {number=} opt_port
 * @return {!cwc.protocol.ev3.Events.Data_}
 * @final
 */
cwc.protocol.ev3.Events.largeMotorOptValue = function(data, opt_port) {
  return new cwc.protocol.ev3.Events.Data_(
      cwc.protocol.ev3.Events.Type.LARGE_MOTOR_OPT, data,
      opt_port);
};


/**
 * @param {Object|number} data
 * @param {number=} opt_port
 * @return {!cwc.protocol.ev3.Events.Data_}
 * @final
 */
cwc.protocol.ev3.Events.mediumMotorValue = function(data, opt_port) {
  return new cwc.protocol.ev3.Events.Data_(
      cwc.protocol.ev3.Events.Type.MEDIUM_MOTOR, data, opt_port);
};


/**
 * @param {Object|number} data
 * @param {number=} opt_port
 * @return {!cwc.protocol.ev3.Events.Data_}
 * @final
 */
cwc.protocol.ev3.Events.mediumMotorOptValue = function(data, opt_port) {
  return new cwc.protocol.ev3.Events.Data_(
      cwc.protocol.ev3.Events.Type.MEDIUM_MOTOR_OPT, data,
      opt_port);
};


/**
 * @param {Object|number} data
 * @param {number=} opt_port
 * @return {!cwc.protocol.ev3.Events.Data_}
 * @final
 */
cwc.protocol.ev3.Events.touchSensorValue = function(data, opt_port) {
  return new cwc.protocol.ev3.Events.Data_(
      cwc.protocol.ev3.Events.Type.TOUCH_SENSOR, data, opt_port);
};


/**
 * @param {Object|number} data
 * @param {number=} opt_port
 * @return {!cwc.protocol.ev3.Events.Data_}
 * @final
 */
cwc.protocol.ev3.Events.touchSensorOptValue = function(data, opt_port) {
  return new cwc.protocol.ev3.Events.Data_(
      cwc.protocol.ev3.Events.Type.TOUCH_SENSOR_OPT, data,
        opt_port);
};


/**
 * @param {Object|number} data
 * @param {number=} opt_port
 * @return {!cwc.protocol.ev3.Events.Data_}
 * @final
 */
cwc.protocol.ev3.Events.ultrasonicSensorValue = function(data, opt_port) {
  return new cwc.protocol.ev3.Events.Data_(
      cwc.protocol.ev3.Events.Type.ULTRASONIC_SENSOR, data,
        opt_port);
};


/**
 * @param {!cwc.protocol.ev3.Events.Type} type
 * @param {Object|number=} opt_data
 * @param {number=} opt_port
 * @constructor
 * @final
 * @private
 */
cwc.protocol.ev3.Events.Data_ = function(type, opt_data, opt_port) {
  /** @type {!cwc.protocol.ev3.Events.Type} */
  this.type = type;

  /** @type {!Object|number} */
  this.data = opt_data || {};

  /** @type {number} */
  this.port = opt_port;
};
