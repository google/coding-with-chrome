/**
 * @fileoverview Sphero Classic Communication buffer
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
goog.provide('cwc.protocol.sphero.classic.Buffer');

goog.require('cwc.protocol.sphero.classic.CallbackType');
goog.require('cwc.protocol.sphero.classic.Command');
goog.require('cwc.protocol.sphero.classic.CommandType');
goog.require('cwc.utils.ByteArray');


/**
 * @constructor
 * @extends {cwc.utils.ByteArray}
 */
cwc.protocol.sphero.classic.Buffer = function() {
  /** @type {cwc.protocol.sphero.classic.CallbackType} */
  this.callbackType = cwc.protocol.sphero.classic.CallbackType.NONE;

  /** @type {!cwc.protocol.sphero.classic.Command|Array} */
  this.command = cwc.protocol.sphero.classic.Command.SYSTEM.PING;

  /** @type {!Array} */
  this.data = [];
};
goog.inherits(cwc.protocol.sphero.classic.Buffer, cwc.utils.ByteArray);


/**
 * @param {!cwc.protocol.sphero.classic.CallbackType} callback
 * @return {THIS}
 * @template THIS
 */
cwc.protocol.sphero.classic.Buffer.prototype.setCallback = function(callback) {
  this.callbackType = callback;
  return this;
};


/**
 * @param {!cwc.protocol.sphero.classic.Command|Array} command
 * @return {THIS}
 * @template THIS
 */
cwc.protocol.sphero.classic.Buffer.prototype.setCommand = function(command) {
  this.command = command;
  return this;
};


/**
 * @return {!ArrayBuffer}
 */
cwc.protocol.sphero.classic.Buffer.prototype.readSigned = function() {
  let buffer = this.getData();
  let checkSum = 0;
  let dataLength = buffer.length + 1;
  let dataBuffer = new ArrayBuffer(dataLength + 6);
  let data = new Uint8Array(dataBuffer);
  data[0] = 0xFF;
  data[1] = this.callbackType ?
      cwc.protocol.sphero.classic.CommandType.DIRECT.REPLY :
      cwc.protocol.sphero.classic.CommandType.DIRECT.NOREPLY;
  data[2] = this.command[0];
  data[3] = this.command[1];
  data[4] = this.callbackType;
  data[5] = dataLength;
  checkSum += data[2] + data[3] + data[4] + data[5];
  for (let i = 0; i < dataLength; i++) {
    data[6 + i] = buffer[i] & 0xFF;
    checkSum += data[6 + i];
  }
  data[5 + dataLength] = checkSum & 0xFF ^ 0xFF;
  return dataBuffer;
};
