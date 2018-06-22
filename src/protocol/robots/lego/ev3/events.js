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

goog.require('cwc.protocol.lego.ev3.DeviceType');
goog.require('cwc.utils.EventData');


/**
 * Custom events.
 * @enum {string}
 */
cwc.protocol.lego.ev3.Events.Type = Object.assign({
  CHANGED_DEVICES: 'CHANGED_DEVICES',
  CONNECT: 'connect',
}, cwc.protocol.lego.ev3.DeviceType);


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
 * @param {number} port
 * @param {!Object|number} data
 * @param {!cwc.protocol.lego.ev3.DeviceType} type
 * @return {!cwc.utils.EventData}
 */
cwc.protocol.lego.ev3.Events.changedSensorValue = function(port, data, type) {
  return new cwc.utils.EventData(type, data, port);
};
