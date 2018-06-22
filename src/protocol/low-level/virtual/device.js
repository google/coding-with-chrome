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

goog.require('cwc.protocol.default.Device');


/**
 * @constructor
 * @extends {cwc.protocol.default.Device}
 */
cwc.protocol.virtual.Device = function() {
  /** @type {string} */
  this.address = 'virtual::localhost';

  /** @type {boolean} */
  this.connected = false;
};
goog.inherits(cwc.protocol.virtual.Device, cwc.protocol.default.Device);


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
