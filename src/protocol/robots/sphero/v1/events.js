/**
 * @fileoverview Sphero Classic Event definitions.
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
goog.provide('cwc.protocol.sphero.v1.Events');

goog.require('cwc.utils.EventData');


/**
 * Custom events.
 * @enum {string}
 */
cwc.protocol.sphero.v1.Events.Type = {
  CHANGED_LOCATION: 'changed_devices',
  CHANGED_SPEED: 'changed_speed',
  CHANGED_VELOCITY: 'changed_values',
  COLLISION: 'collision',
  CONNECTING: 'connecting',
};


/**
 * @param {Object} data
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.sphero.v1.Events.locationData = function(data) {
  return new cwc.utils.EventData(
      cwc.protocol.sphero.v1.Events.Type.CHANGED_LOCATION, data);
};


/**
 * @param {Object} data
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.sphero.v1.Events.velocityData = function(data) {
  return new cwc.utils.EventData(
      cwc.protocol.sphero.v1.Events.Type.CHANGED_VELOCITY, data);
};


/**
 * @param {Object|number} data
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.sphero.v1.Events.speedValue = function(data) {
  return new cwc.utils.EventData(
      cwc.protocol.sphero.v1.Events.Type.CHANGED_SPEED, data);
};


/**
 * @param {Object} data
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.sphero.v1.Events.collision = function(data) {
  return new cwc.utils.EventData(
      cwc.protocol.sphero.v1.Events.Type.COLLISION, data);
};


/**
 * @param {string} data
 * @param {number} step
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.sphero.v1.Events.connecting = function(data, step) {
  return new cwc.utils.EventData(
      cwc.protocol.sphero.v1.Events.Type.CONNECTING, data, step);
};
