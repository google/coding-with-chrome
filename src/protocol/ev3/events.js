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
 * @enum {Event}
 */
cwc.protocol.ev3.Events.Type = {
  CHANGED_DEVICES: 'changed_devices',
  CHANGED_VALUES: 'changed_values',
  COLOR_SENSOR: 'color_sensor_value_changed',
  GYRO_SENSOR: 'gyro_sensor_value_changed',
  IR_SENSOR: 'ir_sensor_value_changed',
  LARGE_MOTOR_OPT: 'large_motor_opt_value_changed',
  LARGE_MOTOR: 'large_motor_value_changed',
  MEDIUM_MOTOR_OPT: 'medium_motor_opt_value_changed',
  MEDIUM_MOTOR: 'medium_motor_value_changed',
  TOUCH_SENSOR_OPT: 'touch_sensor_opt_value_changed',
  TOUCH_SENSOR: 'touch_sensor_value_changed',
  ULTRASONIC_SENSOR: 'ultra_sonic_sensor_value_changed'
};


/**
 * @param {object} data
 * @final
 */
cwc.protocol.ev3.Events.ChangedDevices = function(data) {
  return new cwc.protocol.ev3.Events.Data_(
      cwc.protocol.ev3.Events.Type.CHANGED_DEVICES, data);
};


/**
 * @param {object} data
 * @param {number=} opt_port
 * @final
 */
cwc.protocol.ev3.Events.ColorSensorValue = function(data, opt_port) {
  return new cwc.protocol.ev3.Events.Data_(
      cwc.protocol.ev3.Events.Type.COLOR_SENSOR, data, opt_port);
};


/**
 * @param {object} data
 * @param {number=} opt_port
 * @final
 */
cwc.protocol.ev3.Events.GyroSensorValue = function(data, opt_port) {
  return new cwc.protocol.ev3.Events.Data_(
      cwc.protocol.ev3.Events.Type.GYRO_SENSOR, data, opt_port);
};


/**
 * @param {object} data
 * @param {number=} opt_port
 * @final
 */
cwc.protocol.ev3.Events.IrSensorValue = function(data, opt_port) {
  return new cwc.protocol.ev3.Events.Data_(
      cwc.protocol.ev3.Events.Type.IR_SENSOR, data, opt_port);
};


/**
 * @param {object} data
 * @param {number=} opt_port
 * @final
 */
cwc.protocol.ev3.Events.LargeMotorValue = function(data, opt_port) {
  return new cwc.protocol.ev3.Events.Data_(
      cwc.protocol.ev3.Events.Type.LARGE_MOTOR, data, opt_port);
};


/**
 * @param {object} data
 * @param {number=} opt_port
 * @final
 */
cwc.protocol.ev3.Events.LargeMotorOptValue = function(data, opt_port) {
  return new cwc.protocol.ev3.Events.Data_(
      cwc.protocol.ev3.Events.Type.LARGE_MOTOR_OPT, data,
      opt_port);
};


/**
 * @param {object} data
 * @param {number=} opt_port
 * @final
 */
cwc.protocol.ev3.Events.MediumMotorValue = function(data, opt_port) {
  return new cwc.protocol.ev3.Events.Data_(
      cwc.protocol.ev3.Events.Type.MEDIUM_MOTOR, data, opt_port);
};


/**
 * @param {object} data
 * @param {number=} opt_port
 * @final
 */
cwc.protocol.ev3.Events.MediumMotorOptValue = function(data, opt_port) {
  return new cwc.protocol.ev3.Events.Data_(
      cwc.protocol.ev3.Events.Type.MEDIUM_MOTOR_OPT, data,
      opt_port);
};


/**
 * @param {object} data
 * @param {number=} opt_port
 * @final
 */
cwc.protocol.ev3.Events.TouchSensorValue = function(data, opt_port) {
  return new cwc.protocol.ev3.Events.Data_(
      cwc.protocol.ev3.Events.Type.TOUCH_SENSOR, data, opt_port);
};


/**
 * @param {object} data
 * @param {number=} opt_port
 * @final
 */
cwc.protocol.ev3.Events.TouchSensorOptValue = function(data, opt_port) {
  return new cwc.protocol.ev3.Events.Data_(
      cwc.protocol.ev3.Events.Type.TOUCH_SENSOR_OPT, data,
        opt_port);
};


/**
 * @param {object} data
 * @param {number=} opt_port
 * @final
 */
cwc.protocol.ev3.Events.UltrasonicSensorValue = function(data, opt_port) {
  return new cwc.protocol.ev3.Events.Data_(
      cwc.protocol.ev3.Events.Type.ULTRASONIC_SENSOR, data,
        opt_port);
};


/**
 * @param {!cwc.protocol.ev3.Events.Type} type
 * @param {!object} data
 * @param {number=} opt_port
 * @constructor
 * @final
 * @private
 */
cwc.protocol.ev3.Events.Data_ = function(type, data, opt_port) {
  /** @type {!cwc.protocol.ev3.Events.Type} */
  this.type = type;

  /** @type {!object} */
  this.data = data;

  /** @type {number=} */
  this.port = opt_port;
};
