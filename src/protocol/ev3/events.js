/**
 * @fileoverview EV3 Event definitions.
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
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
  CHANGED_VALUES: 'changed_values',
  CHANGED_DEVICES: 'changed_devices',
  IR_SENSOR_VALUE_CHANGED: 'ir_sensor_value_changed',
  COLOR_SENSOR_VALUE_CHANGED: 'color_sensor_value_changed',
  TOUCH_SENSOR_VALUE_CHANGED: 'touch_sensor_value_changed',
  MEDIUM_MOTOR_VALUE_CHANGED: 'medium_motor_value_changed',
  MEDIUM_MOTOR_OPT_VALUE_CHANGED: 'medium_motor_opt_value_changed',
  LARGE_MOTOR_VALUE_CHANGED: 'large_motor_value_changed',
  LARGE_MOTOR_OPT_VALUE_CHANGED: 'large_motor_opt_value_changed'
};


/**
 * @param {object} data
 * @constructor
 * @final
 */
cwc.protocol.ev3.Events.ChangedDevices = function(data) {
  /** @type {cwc.protocol.ev3.Events.Type} */
  this.type = cwc.protocol.ev3.Events.Type.CHANGED_DEVICES;

  /** @type {object} */
  this.data = data;
};


/**
 * @param {object} data
 * @constructor
 * @final
 */
cwc.protocol.ev3.Events.IrSensorValue = function(data) {
  /** @type {cwc.protocol.ev3.Events.Type} */
  this.type = cwc.protocol.ev3.Events.Type.IR_SENSOR_VALUE_CHANGED;

  /** @type {object} */
  this.data = data;
};


/**
 * @param {object} data
 * @constructor
 * @final
 */
cwc.protocol.ev3.Events.ColorSensorValue = function(data) {
  /** @type {cwc.protocol.ev3.Events.Type} */
  this.type = cwc.protocol.ev3.Events.Type.COLOR_SENSOR_VALUE_CHANGED;

  /** @type {object} */
  this.data = data;
};


/**
 * @param {object} data
 * @constructor
 * @final
 */
cwc.protocol.ev3.Events.TouchSensorValue = function(data) {
  /** @type {cwc.protocol.ev3.Events.Type} */
  this.type = cwc.protocol.ev3.Events.Type.TOUCH_SENSOR_VALUE_CHANGED;

  /** @type {object} */
  this.data = data;
};
