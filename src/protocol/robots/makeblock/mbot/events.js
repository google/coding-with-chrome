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
goog.provide('cwc.protocol.makeblock.mbot.Events');


/**
 * Custom events.
 * @enum {string}
 */
cwc.protocol.makeblock.mbot.Events.Type = {
  BUTTON_PRESSED: 'button_pressed',
  LIGHTNESS_SENSOR: 'lightness_sensor_value_changed',
  LINEFOLLOWER_SENSOR: 'linefollower_sensor_value_changed',
  ULTRASONIC_SENSOR: 'ultrasonic_sensor_value_changed',
};


/**
 * @param {Object} data
 * @param {number=} opt_port
 * @return {!cwc.protocol.makeblock.mbot.Events.Data_}
 * @final
 */
cwc.protocol.makeblock.mbot.Events.ButtonPressed = function(data,
    opt_port) {
  return new cwc.protocol.makeblock.mbot.Events.Data_(
      cwc.protocol.makeblock.mbot.Events.Type.BUTTON_PRESSED,
      data, opt_port);
};


/**
 * @param {Object} data
 * @param {number=} opt_port
 * @return {!cwc.protocol.makeblock.mbot.Events.Data_}
 * @final
 */
cwc.protocol.makeblock.mbot.Events.UltrasonicSensorValue = function(data,
    opt_port) {
  return new cwc.protocol.makeblock.mbot.Events.Data_(
      cwc.protocol.makeblock.mbot.Events.Type.ULTRASONIC_SENSOR,
      data, opt_port);
};


/**
 * @param {Object} data
 * @param {number=} opt_port
 * @return {!cwc.protocol.makeblock.mbot.Events.Data_}
 * @final
 */
cwc.protocol.makeblock.mbot.Events.LightnessSensorValue = function(data,
    opt_port) {
  return new cwc.protocol.makeblock.mbot.Events.Data_(
      cwc.protocol.makeblock.mbot.Events.Type.LIGHTNESS_SENSOR,
      data, opt_port);
};


/**
 * @param {Object} data
 * @param {number=} opt_port
 * @return {!cwc.protocol.makeblock.mbot.Events.Data_}
 * @final
 */
cwc.protocol.makeblock.mbot.Events.LinefollowerSensorValue = function(data,
    opt_port) {
  return new cwc.protocol.makeblock.mbot.Events.Data_(
      cwc.protocol.makeblock.mbot.Events.Type.LINEFOLLOWER_SENSOR,
      data, opt_port);
};


/**
 * @param {!cwc.protocol.makeblock.mbot.Events.Type} type
 * @param {Object|number=} data
 * @param {number=} port
 * @constructor
 * @final
 * @private
 */
cwc.protocol.makeblock.mbot.Events.Data_ = function(type, data, port) {
  /** @type {!cwc.protocol.makeblock.mbot.Events.Type} */
  this.type = type;

  /** @type {!Object|number} */
  this.data = data || {};

  /** @type {number|undefined} */
  this.port = port;
};
