/**
 * @fileoverview mBot Communication buffer
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
goog.provide('cwc.protocol.makeblock.mbot.Buffer');

goog.require('cwc.protocol.makeblock.mbot.CommandType');
goog.require('cwc.protocol.makeblock.mbot.Header');
goog.require('cwc.protocol.makeblock.mbot.CallbackType');
goog.require('cwc.utils.ByteArray');


/**
 * @constructor
 * @extends {cwc.utils.ByteArray}
 */
cwc.protocol.makeblock.mbot.Buffer = function() {
  /** @type {!Array} */
  this.data = [];

  /** @type {!Array} */
  this.header = cwc.protocol.makeblock.mbot.Header;
};
goog.inherits(cwc.protocol.makeblock.mbot.Buffer, cwc.utils.ByteArray);


/**
 * @param {!cwc.protocol.makeblock.mbot.Device} device
 * @return {THIS}
 * @template THIS
 */
cwc.protocol.makeblock.mbot.Buffer.prototype.writeDevice = function(device) {
  return this.writeByte(device);
};


/**
 * @param {!cwc.protocol.makeblock.mbot.CommandType} type
 * @return {THIS}
 * @template THIS
 */
cwc.protocol.makeblock.mbot.Buffer.prototype.writeType = function(type) {
  return this.writeByte(type);
};


/**
 * @param {!cwc.protocol.makeblock.mbot.Port} port
 * @return {THIS}
 * @template THIS
 */
cwc.protocol.makeblock.mbot.Buffer.prototype.writePort = function(port) {
  return this.writeByte(port);
};


/**
 * @param {!cwc.protocol.makeblock.mbot.CallbackType} index
 * @return {THIS}
 * @template THIS
 */
cwc.protocol.makeblock.mbot.Buffer.prototype.writeCallback = function(index) {
  return this.writeByte(index);
};


/**
 * @return {!ArrayBuffer}
 */
cwc.protocol.makeblock.mbot.Buffer.prototype.readSigned = function() {
  let buffer = this.getData();
  let checkSum = buffer.length;
  let dataLength = buffer.length;
  let dataBuffer = new ArrayBuffer(dataLength + 3);
  let data = new Uint8Array(dataBuffer);
  data[0] = this.header[0];
  data[1] = this.header[1];
  data[2] = checkSum;
  for (let i = 0; i < dataLength; i++) {
    data[3 + i] = buffer[i];
  }

  return dataBuffer;
};
