/**
 * @fileoverview mbot event definitions.
 *
 * This api allows to read and control the Makeblock mBot kits with
 * bluetooth connection.
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
 */
goog.provide('cwc.protocol.makeblock.mbotRanger.Events');



/**
 * Custom events.
 * @enum {string}
 */
cwc.protocol.makeblock.mbotRanger.Events.Type = {
  LIGHTNESS_SENSOR: 'lightness_sensor_value_changed',
  LINEFOLLOWER_SENSOR: 'linefollower_sensor_value_changed',
  TEMPERATURE_SENSOR: 'temperature_sensor_value_changed',
  ULTRASONIC_SENSOR: 'ultrasonic_sensor_value_changed'
};


/**
 * @param {Object} data
 * @param {number=} opt_port
 * @final
 */
cwc.protocol.makeblock.mbotRanger.Events.LightnessSensorValue = function(data,
    opt_port) {
  return new cwc.protocol.makeblock.mbotRanger.Events.Data_(
      cwc.protocol.makeblock.mbotRanger.Events.Type.LIGHTNESS_SENSOR,
      data, opt_port);
};


/**
 * @param {Object} data
 * @param {number=} opt_port
 * @final
 */
cwc.protocol.makeblock.mbotRanger.Events.LinefollowerSensorValue = function(
    data, opt_port) {
  return new cwc.protocol.makeblock.mbotRanger.Events.Data_(
      cwc.protocol.makeblock.mbotRanger.Events.Type.LINEFOLLOWER_SENSOR,
      data, opt_port);
};


/**
 * @param {Object} data
 * @param {number=} opt_port
 * @final
 */
cwc.protocol.makeblock.mbotRanger.Events.TemperatureSensorValue = function(
    data, opt_port) {
  return new cwc.protocol.makeblock.mbotRanger.Events.Data_(
      cwc.protocol.makeblock.mbotRanger.Events.Type.TEMPERATURE_SENSOR,
      data, opt_port);
};


/**
 * @param {Object} data
 * @param {number=} opt_port
 * @final
 */
cwc.protocol.makeblock.mbotRanger.Events.UltrasonicSensorValue = function(data,
    opt_port) {
  return new cwc.protocol.makeblock.mbotRanger.Events.Data_(
      cwc.protocol.makeblock.mbotRanger.Events.Type.ULTRASONIC_SENSOR,
      data, opt_port);
};


/**
 * @param {!cwc.protocol.makeblock.mbotRanger.Events.Type} type
 * @param {Object=} opt_data
 * @param {number=} opt_port
 * @constructor
 * @final
 * @private
 */
cwc.protocol.makeblock.mbotRanger.Events.Data_ = function(type, opt_data,
    opt_port) {
  /** @type {!cwc.protocol.makeblock.mbotRanger.Events.Type} */
  this.type = type;

  /** @type {!Object} */
  this.data = opt_data || {};

  /** @type {number=} */
  this.port = opt_port;
};
