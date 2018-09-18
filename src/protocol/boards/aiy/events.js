/**
 * @fileoverview AIY Event definitions.
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
 * @author fstanis@google.com (Filip Stanis)
 */
goog.provide('cwc.protocol.aiy.Events');

goog.require('cwc.utils.EventData');


/**
 * Custom events.
 * @enum {string}
 */
cwc.protocol.aiy.Events.Type = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  RECEIVED_DATA_STDOUT: 'received_data_stdout',
  RECEIVED_DATA_STDERR: 'received_data_stderr',
  EXIT: 'exit',
};


/**
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.aiy.Events.connected = function() {
  return new cwc.utils.EventData(cwc.protocol.aiy.Events.Type.CONNECTED);
};


/**
 * @param {number} code
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.aiy.Events.disconnected = function(code) {
  return new cwc.utils.EventData(
      cwc.protocol.aiy.Events.Type.DISCONNECTED, code);
};


/**
 * @param {string} data
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.aiy.Events.receivedDataStdout = function(data) {
  return new cwc.utils.EventData(
      cwc.protocol.aiy.Events.Type.RECEIVED_DATA_STDOUT, data);
};

/**
 * @param {string} data
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.aiy.Events.receivedDataStderr = function(data) {
  return new cwc.utils.EventData(
      cwc.protocol.aiy.Events.Type.RECEIVED_DATA_STDERR, data);
};

/**
 * @param {number} code
 * @return {!cwc.utils.EventData}
 * @final
 */
cwc.protocol.aiy.Events.exit = function(code) {
  return new cwc.utils.EventData(
      cwc.protocol.aiy.Events.Type.EXIT, code);
};
