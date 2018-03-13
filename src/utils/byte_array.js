/**
 * @fileoverview General-purpose ByteArray.
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
goog.provide('cwc.utils.ByteArray');
goog.provide('cwc.utils.ByteArrayTypes');


/**
 * @enum {!number}
 */
cwc.utils.ByteArrayTypes = {
  BYTE: 1,
  SHORT: 2,
  INT: 3,
  UINT: 4,
  UINT16: 5,
  STR: 6,
  INDEX: 7,
};


/**
 * @constructor
 */
cwc.utils.ByteArray = function() {
  /** @type {!Array} */
  this.data = [];

  /** @type {Object.<cwc.utils.ByteArrayTypes|string|number>} */
  this.headers = {};
};


/**
 * Writes a byte into the buffer.
 * @param {number} value
 * @param {number=} defaultValue
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.utils.ByteArray.prototype.writeByte = function(value, defaultValue = 0x00) {
  this.addHeader(cwc.utils.ByteArrayTypes.BYTE);
  this.write(value === undefined ? defaultValue : value);
  return this;
};


/**
 * Writes null byte with 0x00.
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.utils.ByteArray.prototype.writeNullByte = function() {
  this.writeByte(0x00);
  return this;
};


/**
 * Writes single byte with 0x01.
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.utils.ByteArray.prototype.writeSingleByte = function() {
  this.writeByte(0x01);
  return this;
};


/**
 * Writes a short into the buffer.
 * @param {number} value
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.utils.ByteArray.prototype.writeShort = function(value) {
  this.addHeader(cwc.utils.ByteArrayTypes.SHORT);
  this.write(value);
  this.write(value >> 8);
  return this;
};


/**
 * Writes an integer into the buffer.
 * @param {number} value
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.utils.ByteArray.prototype.writeInt = function(value) {
  this.addHeader(cwc.utils.ByteArrayTypes.INT);
  this.write(value);
  this.write(value >> 8);
  this.write(value >> 16);
  this.write(value >> 24);
  return this;
};


/**
 * Writes an unsigned integer into the buffer.
 * @param {number} value
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.utils.ByteArray.prototype.writeUInt = function(value) {
  this.addHeader(cwc.utils.ByteArrayTypes.UINT);
  this.write(value & 0xFF);
  return this;
};


/**
 * Writes an unsigned 16bit integer into the buffer.
 * @param {number} value
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.utils.ByteArray.prototype.writeUInt16 = function(value) {
  this.addHeader(cwc.utils.ByteArrayTypes.UINT16);
  this.write(value >> 8);
  this.write(value & 0xFF);
  return this;
};


/**
 * Writes a string into the buffer.
 * @param {string} value
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.utils.ByteArray.prototype.writeString = function(value) {
  this.addHeader(cwc.utils.ByteArrayTypes.STR);
  let valueLength = value.length;
  for (let i = 0; i < valueLength; i++) {
    this.write(value.charCodeAt(i));
  }
  this.write(0x00);
  return this;
};


/**
 * @param {!Array|!string} command
 * @return {THIS}
 * @template THIS
 */
cwc.utils.ByteArray.prototype.writeCommand = function(command) {
  if (command instanceof Array) {
    this.write(command[0]);
    this.write(command[1]);
  } else {
    this.write(command);
  }
  return this;
};


/**
 * Writes an index integer into the buffer.
 * @param {number} value
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.utils.ByteArray.prototype.writeIndex = function(value) {
  this.addHeader(cwc.utils.ByteArrayTypes.INDEX);
  this.write(value || 0x00);
  return this;
};


/**
 * @param {string|number} data
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.utils.ByteArray.prototype.write = function(data) {
  this.data.push(data);
  return this;
};


/**
 * @return {number}
 * @export
 */
cwc.utils.ByteArray.prototype.length = function() {
  return this.data.length;
};


/**
 * @return {!Array}
 * @export
 */
cwc.utils.ByteArray.prototype.getData = function() {
  return this.data;
};


/**
 * @export
 */
cwc.utils.ByteArray.prototype.clearData = function() {
  this.data = [];
};


/**
 * @param {cwc.utils.ByteArrayTypes} type
 * @export
 */
cwc.utils.ByteArray.prototype.addHeader = function(type) {
  if (this.hasHeader(type)) {
    this.write(this.headers[type]);
  }
};


/**
 * @param {cwc.utils.ByteArrayTypes} type
 * @param {string|number} data
 * @export
 */
cwc.utils.ByteArray.prototype.setHeader = function(type, data) {
  this.headers[type] = data;
};


/**
 * @param {cwc.utils.ByteArrayTypes} type
 * @return {boolean}
 * @export
 */
cwc.utils.ByteArray.prototype.hasHeader = function(type) {
  return type in this.headers;
};


/**
 * @param {cwc.utils.ByteArrayTypes} type
 * @return {string|number}
 * @export
 */
cwc.utils.ByteArray.prototype.getHeader = function(type) {
  return this.headers[type];
};
