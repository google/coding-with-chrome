/**
 * @fileoverview Sphero Communication buffer
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
goog.provide('cwc.protocol.sphero.Buffer');

goog.require('cwc.protocol.sphero.CallbackType');
goog.require('cwc.protocol.sphero.Command');
goog.require('cwc.protocol.sphero.CommandType');
goog.require('cwc.utils.ByteArray');


/**
 * @constructor
 * @param {cwc.protocol.sphero.CallbackType=} optCallback
 */
cwc.protocol.sphero.Buffer = function(optCallback) {
  /** @type {!cwc.utils.ByteArray} */
  this.data = new cwc.utils.ByteArray();

  /** @type {cwc.protocol.sphero.CallbackType} */
  this.callbackType = optCallback ||
      cwc.protocol.sphero.CallbackType.NONE;

  /** @type {!cwc.protocol.sphero.Command} */
  this.command = [0x00, 0x01];

  /** @type {!number} */
  this.header = 0xFF;

  /** @type {!cwc.protocol.sphero.CommandType} */
  this.type = (optCallback) ?
      cwc.protocol.sphero.CommandType.DIRECT.REPLY :
      cwc.protocol.sphero.CommandType.DIRECT.NOREPLY;
};


/**
 * Writes null byte with 0x00.
 */
cwc.protocol.sphero.Buffer.prototype.writeNullByte = function() {
  this.data.writeByte(0x00);
};


/**
 * Writes single byte with 0x01.
 */
cwc.protocol.sphero.Buffer.prototype.writeSingleByte = function() {
  this.data.writeByte(0x01);
};


/**
 * @param {number} value
 * @param {number=} opt_default
 */
cwc.protocol.sphero.Buffer.prototype.writeByte = function(value, opt_default) {
  this.data.writeByte(value, opt_default);
};


/**
 * @param {number} value
 */
cwc.protocol.sphero.Buffer.prototype.writeInt = function(value) {
  this.data.writeInt(value);
};


/**
 * @param {number} value
 */
cwc.protocol.sphero.Buffer.prototype.writeUInt = function(value) {
  this.data.writeUInt16(value);
};


/**
 * @param {number} value
 */
cwc.protocol.sphero.Buffer.prototype.writeShort = function(value) {
  this.data.writeShort(value);
};


/**
 * @param {string} value
 */
cwc.protocol.sphero.Buffer.prototype.writeString = function(value) {
  this.data.writeString(value);
};


/**
 * @param {!string} command
 */
cwc.protocol.sphero.Buffer.prototype.writeCommand = function(command) {
  this.command = command;
};


/**
 * @return {!ArrayBuffer}
 */
cwc.protocol.sphero.Buffer.prototype.readSigned = function() {
  let buffer = this.data.getData();
  let checkSum = 0;
  let dataLength = buffer.length + 1;
  let dataBuffer = new ArrayBuffer(dataLength + 6);
  let data = new Uint8Array(dataBuffer);
  data[0] = this.header;
  data[1] = this.type;
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
