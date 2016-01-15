/**
 * @fileoverview General-purpose ByteArray.
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
goog.provide('cwc.utils.ByteArray');
goog.provide('cwc.utils.ByteArrayTypes');



/**
 * @enum {!string}
 */
cwc.utils.ByteArrayTypes = {
  BYTE: 'byte',
  SHORT: 'short',
  INT: 'int',
  UINT16: 'uint16',
  STR: 'str'
};



/**
 * @constructor
 * @param {string|number=} opt_byte_header
 * @param {string|number=} opt_short_header
 * @param {string|number=} opt_integer_header
 * @param {string|number=} opt_string_header
 * @final
 * @export
 */
cwc.utils.ByteArray = function(opt_byte_header, opt_short_header,
    opt_integer_header, opt_string_header) {
  /** @private {!Array} */
  this.data_ = [];

  /** @private {Object.<cwc.utils.ByteArrayTypes>} */
  this.headers_ = {};

  if (opt_byte_header) {
    this.setHeader(cwc.utils.ByteArrayTypes.BYTE, opt_byte_header);
  }

  if (opt_short_header) {
    this.setHeader(cwc.utils.ByteArrayTypes.SHORT, opt_short_header);
  }

  if (opt_integer_header) {
    this.setHeader(cwc.utils.ByteArrayTypes.INT, opt_integer_header);
  }

  if (opt_string_header) {
    this.setHeader(cwc.utils.ByteArrayTypes.STR, opt_string_header);
  }
};


/**
 * Writes a byte into the buffer.
 * @param {number} value
 * @export
 */
cwc.utils.ByteArray.prototype.writeByte = function(value) {
  this.addHeader(cwc.utils.ByteArrayTypes.BYTE);
  this.write(value);
};


/**
 * Writes a short into the buffer.
 * @param {number} value
 * @export
 */
cwc.utils.ByteArray.prototype.writeShort = function(value) {
  this.addHeader(cwc.utils.ByteArrayTypes.SHORT);
  this.write(value);
  this.write(value >> 8);
};


/**
 * Writes an integer into the buffer.
 * @param {number} value
 * @export
 */
cwc.utils.ByteArray.prototype.writeInt = function(value) {
  this.addHeader(cwc.utils.ByteArrayTypes.INT);
  this.write(value);
  this.write(value >> 8);
  this.write(value >> 16);
  this.write(value >> 24);
};


/**
 * Writes an unsigned integer into the buffer.
 * @param {number} value
 * @export
 */
cwc.utils.ByteArray.prototype.writeUInt16 = function(value) {
  this.addHeader(cwc.utils.ByteArrayTypes.UINT16);
  this.write(value >> 8);
  this.write(value & 0xFF);
};


/**
 * Writes a string into the buffer.
 * @param {string} value
 * @export
 */
cwc.utils.ByteArray.prototype.writeString = function(value) {
  this.addHeader(cwc.utils.ByteArrayTypes.STR);
  var valueLength = value.length;
  for (var i = 0; i < valueLength; i++) {
    this.write(value.charCodeAt(i));
  }
  this.write(0x00);
};


/**
 * @param {string|number} data
 * @export
 */
cwc.utils.ByteArray.prototype.write = function(data) {
  this.data_.push(data);
};


/**
 * @return {number}
 * @export
 */
cwc.utils.ByteArray.prototype.length = function() {
  return this.data_.length;
};


/**
 * @return {!Array}
 * @export
 */
cwc.utils.ByteArray.prototype.getData = function() {
  return this.data_;
};


/**
 * @export
 */
cwc.utils.ByteArray.prototype.clearData = function() {
  this.data_ = [];
};


/**
 * @param {cwc.utils.ByteArrayTypes} type
 * @export
 */
cwc.utils.ByteArray.prototype.addHeader = function(type) {
  if (this.hasHeader(type)) {
    this.write(this.headers_[type]);
  }
};


/**
 * @param {cwc.utils.ByteArrayTypes} type
 * @param {string|number} data
 * @export
 */
cwc.utils.ByteArray.prototype.setHeader = function(type, data) {
  this.headers_[type] = data;
};


/**
 * @param {cwc.utils.ByteArrayTypes} type
 * @return {boolean}
 * @export
 */
cwc.utils.ByteArray.prototype.hasHeader = function(type) {
  return type in this.headers_;
};


/**
 * @param {cwc.utils.ByteArrayTypes} type
 * @return {string|number}
 * @export
 */
cwc.utils.ByteArray.prototype.getHeader = function(type) {
  return this.headers_[type];
};
