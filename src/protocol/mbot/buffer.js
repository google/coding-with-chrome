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
goog.provide('cwc.protocol.mbot.Buffer');

goog.require('cwc.protocol.mbot.Command');
goog.require('cwc.protocol.mbot.CommandType');
goog.require('cwc.protocol.mbot.Header');

goog.require('cwc.utils.ByteArray');



/**
 * @constructor
 */
cwc.protocol.mbot.Buffer = function() {
  /** @type {!cwc.utils.ByteArray} */
  this.data = new cwc.utils.ByteArray();

  /** @type {!cwc.protocol.mbot.Header} */
  this.header = cwc.protocol.mbot.Header;
};


/**
 * Writes null byte with 0x00.
 */
cwc.protocol.mbot.Buffer.prototype.writeNullByte = function() {
  this.data.writeByte(0x00);
};


/**
 * Writes single byte with 0x01.
 */
cwc.protocol.mbot.Buffer.prototype.writeSingleByte = function() {
  this.data.writeByte(0x01);
};


/**
 * @param {number} value
 * @param {number=} opt_default
 */
cwc.protocol.mbot.Buffer.prototype.writeByte = function(value, opt_default) {
  this.data.writeByte(value, opt_default);
};


/**
 * @param {number} value
 */
cwc.protocol.mbot.Buffer.prototype.writeInt = function(value) {
  this.data.writeInt(value);
};


/**
 * @param {number} value
 */
cwc.protocol.mbot.Buffer.prototype.writeShort = function(value) {
  this.data.writeShort(value);
};


/**
 * @param {string} value
 */
cwc.protocol.mbot.Buffer.prototype.writeString = function(value) {
  this.data.writeString(value);
};


/**
 * @param {!cwc.protocol.mbot.Command} command
 */
cwc.protocol.mbot.Buffer.prototype.writeCommand = function(command) {
  this.writeByte(command);
};


/**
 * @param {!cwc.protocol.mbot.CommandType} type
 */
cwc.protocol.mbot.Buffer.prototype.writeType = function(type) {
  this.writeByte(type);
};


/**
 * @param {!cwc.protocol.mbot.Port} port
 */
cwc.protocol.mbot.Buffer.prototype.writePort = function(port) {
  this.writeByte(port);
};


/**
 * @param {!cwc.protocol.mbot.Command} index
 */
cwc.protocol.mbot.Buffer.prototype.writeIndex = function(index) {
  this.writeByte(index);
};


/**
 * @return {!ArrayBuffer}
 */
cwc.protocol.mbot.Buffer.prototype.readSigned = function() {
  var buffer = this.data.getData();
  var checkSum = buffer.length;
  var dataLength = buffer.length;

/*
  var commandBody = [index, readOrWrite, deviceType].concat(commandBytes);
  var commandHeader = [this.command.PREFIX_A, this.command.PREFIX_B,
    commandBody.length];
  var command = commandHeader.concat(commandBody);
*/

  var dataBuffer = new ArrayBuffer(dataLength + 3);
  var data = new Uint8Array(dataBuffer);
  data[0] = this.header[0];
  data[1] = this.header[1];
  data[2] = checkSum;
  for (let i = 0; i < dataLength; i++) {
    data[3 + i] = buffer[i];
  }

  console.log('NEW Data', data);
  return dataBuffer;
};
