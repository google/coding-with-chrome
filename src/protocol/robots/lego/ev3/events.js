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
goog.provide('cwc.protocol.lego.ev3.Events');

goog.require('cwc.utils.EventData');


/**
 * Custom events.
 * @enum {string}
 */
cwc.protocol.lego.ev3.Events.Type = {
  CHANGED_DEVICES: 'changed_devices',
  CHANGED_VALUES: 'changed_values',
  COLOR_SENSOR: 'color_sensor_value_changed',
  CONNECT: 'connect',
  GYRO_SENSOR: 'gyro_sensor_value_changed',
  IR_SENSOR: 'ir_sensor_value_changed',
  LARGE_MOTOR: 'large_motor_value_changed',
  LARGE_MOTOR_OPT: 'large_motor_optValue_changed',
  MEDIUM_MOTOR: 'medium_motor_value_changed',
  MEDIUM_MOTOR_OPT: 'medium_motor_optValue_changed',
  TOUCH_SENSOR: 'touch_sensor_value_changed',
  TOUCH_SENSOR_OPT: 'touch_sensor_optValue_changed',
  ULTRASONIC_SENSOR: 'ultra_sonic_sensor_value_changed',
};


/**
 * @param {string} data
 * @param {number} step
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.lego.ev3.Events.connect = function(data, step) {
  return new cwc.utils.EventData(
      cwc.protocol.lego.ev3.Events.Type.CONNECT, data, step);
};


/**
 * @param {Object} data
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.lego.ev3.Events.changedDevices = function(data) {
  return new cwc.utils.EventData(
      cwc.protocol.lego.ev3.Events.Type.CHANGED_DEVICES, data);
};


/**
 * @param {Object|number} data
 * @param {number=} port
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.lego.ev3.Events.colorSensorValue = function(data, port) {
  return new cwc.utils.EventData(
      cwc.protocol.lego.ev3.Events.Type.COLOR_SENSOR, data, port);
};


/**
 * @param {Object|number} data
 * @param {number=} port
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.lego.ev3.Events.gyroSensorValue = function(data, port) {
  return new cwc.utils.EventData(
      cwc.protocol.lego.ev3.Events.Type.GYRO_SENSOR, data, port);
};


/**
 * @param {Object|number} data
 * @param {number=} port
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.lego.ev3.Events.irSensorValue = function(data, port) {
  return new cwc.utils.EventData(
      cwc.protocol.lego.ev3.Events.Type.IR_SENSOR, data, port);
};


/**
 * @param {Object|number} data
 * @param {number=} port
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.lego.ev3.Events.largeMotorValue = function(data, port) {
  return new cwc.utils.EventData(
      cwc.protocol.lego.ev3.Events.Type.LARGE_MOTOR, data, port);
};


/**
 * @param {Object|number} data
 * @param {number=} port
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.lego.ev3.Events.largeMotorOptValue = function(data, port) {
  return new cwc.utils.EventData(
      cwc.protocol.lego.ev3.Events.Type.LARGE_MOTOR_OPT, data, port);
};


/**
 * @param {Object|number} data
 * @param {number=} port
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.lego.ev3.Events.mediumMotorValue = function(data, port) {
  return new cwc.utils.EventData(
      cwc.protocol.lego.ev3.Events.Type.MEDIUM_MOTOR, data, port);
};


/**
 * @param {Object|number} data
 * @param {number=} port
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.lego.ev3.Events.mediumMotorOptValue = function(data, port) {
  return new cwc.utils.EventData(
      cwc.protocol.lego.ev3.Events.Type.MEDIUM_MOTOR_OPT, data, port);
};


/**
 * @param {Object|number} data
 * @param {number=} port
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.lego.ev3.Events.touchSensorValue = function(data, port) {
  return new cwc.utils.EventData(
      cwc.protocol.lego.ev3.Events.Type.TOUCH_SENSOR, data, port);
};


/**
 * @param {Object|number} data
 * @param {number=} port
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.lego.ev3.Events.touchSensorOptValue = function(data, port) {
  return new cwc.utils.EventData(
      cwc.protocol.lego.ev3.Events.Type.TOUCH_SENSOR_OPT, data, port);
};


/**
 * @param {Object|number} data
 * @param {number=} port
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.lego.ev3.Events.ultrasonicSensorValue = function(data, port) {
  return new cwc.utils.EventData(
      cwc.protocol.lego.ev3.Events.Type.ULTRASONIC_SENSOR, data, port);
};
