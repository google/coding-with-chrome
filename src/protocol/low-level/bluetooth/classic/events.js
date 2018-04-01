/**
 * @fileoverview Bluetooth Event definitions.
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
goog.provide('cwc.protocol.bluetooth.classic.Events');

goog.require('cwc.utils.EventData');


/**
 * @enum {string}
 */
cwc.protocol.bluetooth.classic.Events.Type = {
  ADAPTER_STATE_CHANGE: 'adapter_state_change',
  DEVICE_STATE_CHANGE: 'device_stage_change',
  ON_RECEIVE: 'on_receive',
};


/**
 * @param {Object} data
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.bluetooth.classic.Events.adapterState = function(data) {
  return new cwc.utils.EventData(
      cwc.protocol.bluetooth.classic.Events.Type.ADAPTER_STATE_CHANGE, data);
};


/**
 * @param {Object} data
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.bluetooth.classic.Events.deviceState = function(data) {
  return new cwc.utils.EventData(
      cwc.protocol.bluetooth.classic.Events.Type.DEVICE_STATE_CHANGE, data);
};


/**
 * @param {!ArrayBuffer} data
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.bluetooth.classic.Events.onReceive = function(data) {
  return new cwc.utils.EventData(
      cwc.protocol.bluetooth.classic.Events.Type.ON_RECEIVE, data);
};
