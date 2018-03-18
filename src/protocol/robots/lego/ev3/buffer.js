/**
 * @fileoverview EV3 Communication buffer
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
goog.provide('cwc.protocol.lego.ev3.Buffer');

goog.require('cwc.protocol.lego.ev3.CommandType');
goog.require('cwc.protocol.lego.ev3.ParameterSize');
goog.require('cwc.protocol.lego.ev3.InputPort');
goog.require('cwc.protocol.lego.ev3.OutputPort');
goog.require('cwc.utils.ByteArray');
goog.require('cwc.utils.ByteArrayTypes');


/**
 * @constructor
 * @extends {cwc.utils.ByteArray}
 */
cwc.protocol.lego.ev3.Buffer = function() {
  /** @type {!cwc.protocol.lego.ev3.CallbackType} */
  this.callbackType = cwc.protocol.lego.ev3.CallbackType.NONE;

  /**
   * @type {!cwc.protocol.lego.ev3.InputPort|
   *   cwc.protocol.lego.ev3.OutputPort}
   */
  this.callbackTarget = cwc.protocol.lego.ev3.InputPort.ONE;

  /** @type {!Array} */
  this.data = [];

  /** @type {Object.<cwc.utils.ByteArrayTypes|string|number>} */
  this.headers = {};
};
goog.inherits(cwc.protocol.lego.ev3.Buffer, cwc.utils.ByteArray);


/**
 * @param {cwc.protocol.lego.ev3.CallbackType=} callbackType
 * @param {number=} globalSize
 * @param {number=} localSize
 * @return {THIS}
 * @template THIS
 */
cwc.protocol.lego.ev3.Buffer.prototype.writeHeader = function(callbackType,
    globalSize = 0x04, localSize = 0x00) {
  if (callbackType) {
    this.callbackType = callbackType;
  }

  this.setHeader(cwc.utils.ByteArrayTypes.BYTE,
    cwc.protocol.lego.ev3.ParameterSize.BYTE);
  this.setHeader(cwc.utils.ByteArrayTypes.SHORT,
    cwc.protocol.lego.ev3.ParameterSize.SHORT);
  this.setHeader(cwc.utils.ByteArrayTypes.INT,
    cwc.protocol.lego.ev3.ParameterSize.INT);
  this.setHeader(cwc.utils.ByteArrayTypes.STR,
    cwc.protocol.lego.ev3.ParameterSize.STRING);
  this.setHeader(cwc.utils.ByteArrayTypes.INDEX,
    cwc.protocol.lego.ev3.ParameterSize.INDEX);

  this.write(/** @type {number} */ ((callbackType) ?
      cwc.protocol.lego.ev3.CommandType.DIRECT.REPLY :
      cwc.protocol.lego.ev3.CommandType.DIRECT.NOREPLY));
  this.write(globalSize & 0xFF);
  this.write(((localSize << 2) | ((globalSize >> 8) & 0x03)) & 0xFF);
  return this;
};


/**
 * @param {!cwc.protocol.lego.ev3.InputPort|
 *   cwc.protocol.lego.ev3.OutputPort} port
 * @return {THIS}
 * @template THIS
 */
cwc.protocol.lego.ev3.Buffer.prototype.writePort = function(port) {
  this.writeNullByte();
  this.writeByte(port);
  this.callbackTarget = port;
  return this;
};


/**
 * @param {!number} ports
 * @return {THIS}
 * @template THIS
 */
cwc.protocol.lego.ev3.Buffer.prototype.writePorts = function(ports) {
  this.writeNullByte();
  this.writeByte(ports);
  return this;
};


/**
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Buffer.prototype.readSigned = function() {
  let buffer = this.getData();
  let dataLength = buffer.length + 2;
  let dataBuffer = new ArrayBuffer(dataLength + 2);
  let data = new Uint8Array(dataBuffer);
  data[0] = dataLength & 0xFF;
  data[1] = (dataLength >> 8) & 0xFF;
  data[2] = this.callbackType;
  data[3] = this.callbackTarget;
  for (let i = 0; i < dataLength; i++) {
    data[4 + i] = buffer[i] & 0xFF;
  }
  return dataBuffer;
};
