/**
 * @fileoverview Handles the pairing and communication with virtual devices.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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
goog.provide('cwc.protocol.virtual.Device');


/**
 * @constructor
 */
cwc.protocol.virtual.Device = function() {
  /** @type {!string} */
  this.address = 'virtual::localhost';

  /** @type {!boolean} */
  this.connected = false;

  /** @type {!Object} */
  this.dataHandler = {};

  /** @type {!Function} */
  this.dataHandlerAll = null;
};


/**
 * @param {Function=} optCallback Will be only called  after an connection.
 * @export
 */
cwc.protocol.virtual.Device.prototype.connect = function(optCallback) {
  if (this.connected) {
    console.warn('Virtual device is already connected!');
    return;
  }
  this.connected = true;
  if (optCallback) {
    optCallback(this, this.address);
  }
};


/**
 * @param {boolean=} force
 * @param {Function=} callback
 * @export
 */
cwc.protocol.virtual.Device.prototype.disconnect = function(force, callback) {
  if (!this.connected) {
    return;
  }
  this.connected = false;
  if (callback) {
    callback(this, this.address);
  }
};


/**
 * @export
 */
cwc.protocol.virtual.Device.prototype.reset = function() {
  if (!this.connected) {
    return;
  }
};


/**
 * @return {!boolean}
 * @export
 */
cwc.protocol.virtual.Device.prototype.isConnected = function() {
  return this.connected;
};


/**
 * @return {!string}
 * @export
 */
cwc.protocol.virtual.Device.prototype.getAddress = function() {
  return this.address || '';
};


/**
 * @param {!Function} callback
 * @param {Array=} opt_packet_header
 * @param {number=} opt_min_packet_size
 * @export
 */
cwc.protocol.virtual.Device.prototype.setDataHandler = function(
    callback, opt_packet_header, opt_min_packet_size) {
  if (opt_packet_header) {
    let id = opt_packet_header.join('_');
    this.dataHandler[id] = {};
    this.dataHandler[id]['buffer'] = null;
    this.dataHandler[id]['callback'] = callback;
    this.dataHandler[id]['headers'] = opt_packet_header;
    this.dataHandler[id]['size'] = opt_min_packet_size || 4;
  } else {
    this.dataHandlerAll = callback;
  }
};


/**
 * @param {!Array|ArrayBuffer|Uint8Array} buffer
 * @return {!Array|ArrayBuffer|Uint8Array}
 * @export
 */
cwc.protocol.virtual.Device.prototype.send = function(buffer) {
  if (!this.connected) {
    return;
  }
  return buffer;
};
