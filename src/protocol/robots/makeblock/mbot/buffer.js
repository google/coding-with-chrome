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
goog.require('cwc.protocol.makeblock.mbot.IndexType');
goog.require('cwc.utils.ByteArray');


/**
 * @constructor
 */
cwc.protocol.makeblock.mbot.Buffer = function() {
  /** @type {!cwc.utils.ByteArray} */
  this.data = new cwc.utils.ByteArray();

  /** @type {!Array} */
  this.header = cwc.protocol.makeblock.mbot.Header;
};


/**
 * Writes null byte with 0x00.
 */
cwc.protocol.makeblock.mbot.Buffer.prototype.writeNullByte = function() {
  this.data.writeByte(0x00);
};


/**
 * Writes single byte with 0x01.
 */
cwc.protocol.makeblock.mbot.Buffer.prototype.writeSingleByte = function() {
  this.data.writeByte(0x01);
};


/**
 * @param {number} value
 * @param {number=} opt_default
 */
cwc.protocol.makeblock.mbot.Buffer.prototype.writeByte = function(value,
    opt_default) {
  this.data.writeByte(value, opt_default);
};


/**
 * @param {number} value
 */
cwc.protocol.makeblock.mbot.Buffer.prototype.writeInt = function(value) {
  this.data.writeInt(value);
};


/**
 * @param {number} value
 */
cwc.protocol.makeblock.mbot.Buffer.prototype.writeShort = function(value) {
  this.data.writeShort(value);
};


/**
 * @param {string} value
 */
cwc.protocol.makeblock.mbot.Buffer.prototype.writeString = function(value) {
  this.data.writeString(value);
};


/**
 * @param {!cwc.protocol.makeblock.mbot.Device} command
 */
cwc.protocol.makeblock.mbot.Buffer.prototype.writeDevice = function(command) {
  this.data.writeByte(command);
};


/**
 * @param {!cwc.protocol.makeblock.mbot.CommandType} type
 */
cwc.protocol.makeblock.mbot.Buffer.prototype.writeType = function(type) {
  this.data.writeByte(type);
};


/**
 * @param {!cwc.protocol.makeblock.mbot.Port} port
 */
cwc.protocol.makeblock.mbot.Buffer.prototype.writePort = function(port) {
  this.data.writeByte(port);
};


/**
 * @param {!cwc.protocol.makeblock.mbot.IndexType} index
 */
cwc.protocol.makeblock.mbot.Buffer.prototype.writeIndex = function(index) {
  this.data.writeUInt(index);
};


/**
 * @return {!ArrayBuffer}
 */
cwc.protocol.makeblock.mbot.Buffer.prototype.readSigned = function() {
  let buffer = this.data.getData();
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
