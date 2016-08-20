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
 * @enum {Event}
 */
cwc.protocol.makeblock.mbotRanger.Events.Type = {
  LIGHTNESS_SENSOR_1: 'lightness_sensor_1_value_changed',
  LIGHTNESS_SENSOR_2: 'lightness_sensor_2_value_changed',
  LINEFOLLOWER_SENSOR: 'linefollower_sensor_value_changed',
  TEMPERATUR_SENSOR: 'temperatur_sensor_value_changed',
  ULTRASONIC_SENSOR: 'ultrasonic_sensor_value_changed'
};


/**
 * @param {object} data
 * @param {number=} opt_port
 * @final
 */
cwc.protocol.makeblock.mbotRanger.Events.LightnessSensor1Value = function(data,
    opt_port) {
  return new cwc.protocol.makeblock.mbotRanger.Events.Data_(
      cwc.protocol.makeblock.mbotRanger.Events.Type.LIGHTNESS_SENSOR_1,
      data, opt_port);
};


/**
 * @param {object} data
 * @param {number=} opt_port
 * @final
 */
cwc.protocol.makeblock.mbotRanger.Events.LightnessSensor2Value = function(data,
    opt_port) {
  return new cwc.protocol.makeblock.mbotRanger.Events.Data_(
      cwc.protocol.makeblock.mbotRanger.Events.Type.LIGHTNESS_SENSOR_2,
      data, opt_port);
};


/**
 * @param {object} data
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
 * @param {object} data
 * @param {number=} opt_port
 * @final
 */
cwc.protocol.makeblock.mbotRanger.Events.TemperaturSensorValue = function(
    data, opt_port) {
  return new cwc.protocol.makeblock.mbotRanger.Events.Data_(
      cwc.protocol.makeblock.mbotRanger.Events.Type.TEMPERATUR_SENSOR,
      data, opt_port);
};


/**
 * @param {object} data
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
 * @param {!object} data
 * @param {number=} opt_port
 * @constructor
 * @final
 * @private
 */
cwc.protocol.makeblock.mbotRanger.Events.Data_ = function(type, data,
    opt_port) {
  /** @type {!cwc.protocol.makeblock.mbotRanger.Events.Type} */
  this.type = type;

  /** @type {!object} */
  this.data = data;

  /** @type {number=} */
  this.port = opt_port;
};
