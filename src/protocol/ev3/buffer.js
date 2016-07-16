/**
 * @fileoverview EV3 Communication buffer
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
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
goog.provide('cwc.protocol.ev3.Buffer');

goog.require('cwc.protocol.ev3.CommandType');
goog.require('cwc.protocol.ev3.ParameterSize');
goog.require('cwc.protocol.ev3.InputPort');
goog.require('cwc.protocol.ev3.OutputPort');
goog.require('cwc.utils.ByteArray');



/**
 * @constructor
 * @param {number=} opt_global_size
 * @param {number=} opt_local_size
 * @param {cwc.protocol.ev3.CallbackType=} opt_callback
 */
cwc.protocol.ev3.Buffer = function(opt_global_size,
    opt_local_size, opt_callback) {
  /** @type {!cwc.utils.ByteArray} */
  this.data = new cwc.utils.ByteArray(
      cwc.protocol.ev3.ParameterSize.BYTE,
      cwc.protocol.ev3.ParameterSize.SHORT,
      cwc.protocol.ev3.ParameterSize.INT,
      cwc.protocol.ev3.ParameterSize.STRING);

  /** @type {!number} */
  this.globalSize = opt_global_size || 0x00;

  /** @type {!number} */
  this.localSize = opt_local_size || 0x00;

  /** @type {!cwc.protocol.ev3.CallbackType} */
  this.callbackType = opt_callback ||
      cwc.protocol.ev3.CallbackType.NONE;

  /** @type {!cwc.protocol.ev3.InputPort} */
  this.callbackTarget = 0x00;

  /** @type {!cwc.protocol.ev3.CommandType} */
  this.type = (opt_callback) ?
      cwc.protocol.ev3.CommandType.DIRECT.REPLY :
      cwc.protocol.ev3.CommandType.DIRECT.NOREPLY;

  this.data.write(this.type);
  this.data.write(this.globalSize & 0xFF);
  this.data.write(((this.localSize << 2) |
      ((this.globalSize >> 8) & 0x03)) & 0xFF);
};


/**
 * @param {!Array|!string} command
 */
cwc.protocol.ev3.Buffer.prototype.writeCommand = function(command) {
  if (command instanceof Array) {
    this.data.write(command[0]);
    this.data.write(command[1]);
  } else {
    this.data.write(command);
  }
};


/**
 * Writes null byte with 0x00.
 */
cwc.protocol.ev3.Buffer.prototype.writeNullByte = function() {
  this.data.writeByte(0x00);
};


/**
 * Writes single byte with 0x01.
 */
cwc.protocol.ev3.Buffer.prototype.writeSingleByte = function() {
  this.data.writeByte(0x01);
};


/**
 * @param {number} value
 */
cwc.protocol.ev3.Buffer.prototype.writeByte = function(value) {
  this.data.writeByte(value);
};


/**
 * @param {number} value
 */
cwc.protocol.ev3.Buffer.prototype.writeInt = function(value) {
  this.data.writeInt(value);
};


/**
 * @param {number} value
 */
cwc.protocol.ev3.Buffer.prototype.writeShort = function(value) {
  this.data.writeShort(value);
};


/**
 * @param {string} value
 */
cwc.protocol.ev3.Buffer.prototype.writeString = function(value) {
  this.data.writeString(value);
};


/**
 * @param {number=} opt_index
 */
cwc.protocol.ev3.Buffer.prototype.writeIndex = function(opt_index) {
  this.data.write(0xE1);
  this.data.write(opt_index || 0x00);
};


/**
 * @param {!cwc.protocol.ev3.InputPort|
 * 			cwc.protocol.ev3.OutputPort} port
 */
cwc.protocol.ev3.Buffer.prototype.writePort = function(port) {
  this.data.writeByte(port);
  this.callbackTarget = port;
};


/**
 * @param {!number} ports
 */
cwc.protocol.ev3.Buffer.prototype.writePorts = function(ports) {
  this.data.writeByte(ports);
};


/**
 * @return {!ArrayBuffer}
 */
cwc.protocol.ev3.Buffer.prototype.readSigned = function() {
  var buffer = this.data.getData();
  var dataLength = buffer.length + 2;
  var dataBuffer = new ArrayBuffer(dataLength + 2);
  var data = new Uint8Array(dataBuffer);
  data[0] = dataLength & 0xFF;
  data[1] = (dataLength >> 8) & 0xFF;
  data[2] = this.callbackType;
  data[3] = this.callbackTarget;
  for (let i = 0; i < dataLength; i++) {
    data[4 + i] = buffer[i] & 0xFF;
  }
  return dataBuffer;
};
