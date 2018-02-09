/**
 * @fileoverview Default devices.
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
goog.provide('cwc.protocol.default.Device');


/**
 * @constructor
 */
cwc.protocol.default.Device = function() {
  /** @type {!string} */
  this.address = '';

  /** @type {!boolean} */
  this.connected = false;

  /** @type {!string} */
  this.name = '';

  /** @type {!boolean} */
  this.paired = false;

  /** @type {!string} */
  this.id = '';

  /** @type {!string} */
  this.type = '';

  /** @type {!string} */
  this.icon = '';
};


/**
 * @param {!string} address
 */
cwc.protocol.default.Device.prototype.setAddress = function(address) {
  this.address = address;
};


/**
 * @return {!string}
 */
cwc.protocol.default.Device.prototype.getAddress = function() {
  return this.address || '';
};


/**
 * @param {!boolean} connected
 */
cwc.protocol.default.Device.prototype.setConnected = function(connected) {
  this.connected = connected;
};


/**
 * @return {!boolean}
 */
cwc.protocol.default.Device.prototype.isConnected = function() {
  return this.connected;
};


/**
 * @param {!boolean} paired
 */
cwc.protocol.default.Device.prototype.setPaired = function(paired) {
  this.paired = paired;
};


/**
 * @return {!boolean}
 */
cwc.protocol.default.Device.prototype.isPaired = function() {
  return this.paired;
};


/**
 * @param {!string} id
 */
cwc.protocol.default.Device.prototype.setId = function(id) {
  this.id = id;
};


/**
 * @return {!string}
 */
cwc.protocol.default.Device.prototype.getId = function() {
  return this.id || '';
};


/**
 * @param {!string} name
 */
cwc.protocol.default.Device.prototype.setName = function(name) {
  this.name = name;
};


/**
 * @return {!string}
 */
cwc.protocol.default.Device.prototype.getName = function() {
  return this.name || '';
};


/**
 * @param {!string} type
 */
cwc.protocol.default.Device.prototype.setType = function(type) {
  this.type = type;
};


/**
 * @return {!string}
 */
cwc.protocol.default.Device.prototype.getType = function() {
  return this.type || '';
};


/**
 * @param {!string} icon
 */
cwc.protocol.default.Device.prototype.setIcon = function(icon) {
  this.icon = icon;
};


/**
 * @return {!string}
 */
cwc.protocol.default.Device.prototype.getIcon = function() {
  return this.icon || '';
};
