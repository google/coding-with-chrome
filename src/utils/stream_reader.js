/**
 * @fileoverview Stream Reader Tools.
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
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.provide('cwc.utils.StreamReader');

goog.require('cwc.utils.ByteTools');


/**
 * @constructor
 */
cwc.utils.StreamReader = function() {
  /** @type {Array} */
  this.footer = null;

  /** @type {Array} */
  this.headers = null;

  /** @type {number} */
  this.minSize = 0;

  /** @private {Uint8Array} */
  this.buffer_ = null;

  /** @private {Function} */
  this.checksum_ = null;
};


/**
 * @param {!Function} checksum
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.utils.StreamReader.prototype.setChecksum = function(checksum) {
  this.checksum_ = checksum;
  return this;
};


/**
 * @param {!Array} footer
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.utils.StreamReader.prototype.setFooter = function(footer) {
  this.footer = footer;
  return this;
};


/**
 * @param {!Array} headers
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.utils.StreamReader.prototype.setHeaders = function(headers) {
  this.headers = typeof headers[0] !== 'object' ? [headers] : headers;
  return this;
};


/**
 * @param {!number} size
 * @return {THIS}
 * @template THIS
 * @export
 */
cwc.utils.StreamReader.prototype.setMinimumSize = function(size) {
  this.minSize = size;
  return this;
};


/**
 * @param {Uint8Array} buffer
 */
cwc.utils.StreamReader.prototype.addBuffer = function(buffer) {
  this.buffer_ = cwc.utils.ByteTools.joinUint8Array(this.buffer_, buffer);
};


/**
 * Read stream by header and footer.
 * @param {!Uint8Array} data
 * @return {Uint8Array}
 */
cwc.utils.StreamReader.prototype.readByHeaderAndFooter = function(data) {
  let dataBuffer = this.readByHeader(data);

  // Validate packet by footer to avoid fragments
  let endPosition = cwc.utils.ByteTools.getBytePositions(
    dataBuffer, this.footer);
  if (endPosition) {
    if (endPosition.length > 1) {
      this.addBuffer(dataBuffer.slice(endPosition[0] + 2, endPosition[1] + 2));
    } else {
      this.addBuffer(dataBuffer.slice(endPosition[0] + 2));
    }
    dataBuffer = dataBuffer.slice(0, endPosition[0]);
    if (dataBuffer.length < this.minSize) {
      this.addBuffer(dataBuffer);
      return null;
    }
  } else {
    this.addBuffer(dataBuffer);
    return null;
  }
  return dataBuffer;
};


/**
 * Read stream by header.
 * @param {!Uint8Array} data
 * @return {Uint8Array}
 */
cwc.utils.StreamReader.prototype.readByHeader = function(data) {
  return this.read(data);
};


/**
 * Read stream.
 * @param {!Uint8Array} data
 * @return {Uint8Array}
 */
cwc.utils.StreamReader.prototype.read = function(data) {
  let buffer = cwc.utils.ByteTools.getUint8Data(
    data, this.headers, this.minSize, this.buffer_);
  let dataBuffer = buffer['data'];
  this.buffer_ = buffer['buffer'];

  // Simple packet validation.
  if (!dataBuffer) {
    return null;
  } else if (dataBuffer.length < this.minSize) {
    this.addBuffer(dataBuffer);
    return null;
  }

  // Checksum validation.
  if (this.checksum_ && !this.checksum_(dataBuffer)) {
    this.addBuffer(dataBuffer);
    return null;
  }

  return dataBuffer;
};
