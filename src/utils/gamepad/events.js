/**
 * @fileoverview Gamepad Event definitions.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
goog.provide('cwc.utils.Gamepad.Events');
goog.provide('cwc.utils.Gamepad.Events.Type');

goog.require('cwc.utils.EventData');


/**
 * @enum {!Object.<string>|string}
 */
cwc.utils.Gamepad.Events.Type = {
  AXIS: {
    0: 'stick_left_x',
    1: 'stick_left_y',
    2: 'stick_right_x',
    3: 'stick_right_y',
  },
  BUTTON: {
    0: 'button_a',
    1: 'button_b',
    2: 'button_x',
    3: 'button_y',
    4: 'button_lb',
    5: 'button_rb',
    6: 'button_lt',
    7: 'button_rt',
    8: 'button_select',
    9: 'button_start',
    10: 'button_stick_left',
    11: 'button_stick_right',
    12: 'button_up',
    13: 'button_down',
    14: 'button_left',
    15: 'button_right',
    16: 'button_home',
  },
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  UPDATE: 'update',
};


/**
 * @param {Object} data
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.utils.Gamepad.Events.connected = function(data) {
  return new cwc.utils.EventData(
    /** @type {string} */ (cwc.utils.Gamepad.Events.Type.CONNECTED), data);
};


/**
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.utils.Gamepad.Events.disconnected = function() {
  return new cwc.utils.EventData(
    /** @type {string} */ (cwc.utils.Gamepad.Events.Type.DISCONNECTED), '');
};


/**
 * @param {number} index
 * @param {number} value
 * @return {!cwc.utils.EventData}
 */
cwc.utils.Gamepad.Events.axisMoved = function(index, value) {
  return new cwc.utils.EventData(
    /** @type {string} */ (cwc.utils.Gamepad.Events.Type.AXIS[index]),
    value || 0);
};


/**
 * @param {number} index
 * @param {number} value
 * @return {!cwc.utils.EventData}
 */
cwc.utils.Gamepad.Events.buttonPressed = function(index, value) {
  return new cwc.utils.EventData(
    /** @type {string} */ (cwc.utils.Gamepad.Events.Type.BUTTON[index]),
    value || 0);
};


/**
 * @param {Object} data
 * @return {!cwc.utils.EventData}
 */
cwc.utils.Gamepad.Events.update = function(data) {
  return new cwc.utils.EventData(
    /** @type {string} */ (cwc.utils.Gamepad.Events.Type.UPDATE), data);
};
