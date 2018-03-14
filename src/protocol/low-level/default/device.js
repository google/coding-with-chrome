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

goog.require('cwc.utils.Logger');

goog.require('goog.events.EventTarget');


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

  /** @type {!cwc.protocol.bluetooth.classic.supportedDevices|
   *         !cwc.protocol.bluetooth.lowEnergy.supportedDevices|
   *         !Object}
   */
  this.profile = {};

  /** @type {!cwc.utils.Logger} */
  this.log = new cwc.utils.Logger();

  /** @type {!goog.events.EventTarget} */
  this.eventHandler = new goog.events.EventTarget();
};


/**
 * @param {!string} address
 * @return {THIS}
 * @template THIS
 */
cwc.protocol.default.Device.prototype.setAddress = function(address) {
  this.address = address;
  return this;
};


/**
 * @return {!string}
 */
cwc.protocol.default.Device.prototype.getAddress = function() {
  return this.address || '';
};


/**
 * @param {!boolean} connected
 * @return {THIS}
 * @template THIS
 */
cwc.protocol.default.Device.prototype.setConnected = function(connected) {
  this.connected = connected;
  return this;
};


/**
 * @return {!boolean}
 */
cwc.protocol.default.Device.prototype.isConnected = function() {
  return this.connected;
};


/**
 * @param {!goog.events.EventTarget} eventHandler
 * @return {THIS}
 * @template THIS
 */
cwc.protocol.default.Device.prototype.setEventHandler = function(eventHandler) {
  this.eventHandler = eventHandler;
  return this;
};


/**
 * @return {!goog.events.EventTarget}
 */
cwc.protocol.default.Device.prototype.getEventHandler = function() {
  return this.eventHandler;
};


/**
 * @param {!boolean} paired
 * @return {THIS}
 * @template THIS
 */
cwc.protocol.default.Device.prototype.setPaired = function(paired) {
  this.paired = paired;
  return this;
};


/**
 * @return {!boolean}
 */
cwc.protocol.default.Device.prototype.isPaired = function() {
  return this.paired;
};


/**
 * @param {!string} id
 * @return {THIS}
 * @template THIS
 */
cwc.protocol.default.Device.prototype.setId = function(id) {
  this.id = id;
  return this;
};


/**
 * @return {!string}
 */
cwc.protocol.default.Device.prototype.getId = function() {
  return this.id || '';
};


/**
 * @param {!string} name
 * @return {THIS}
 * @template THIS
 */
cwc.protocol.default.Device.prototype.setName = function(name) {
  this.name = name;
  return this;
};


/**
 * @return {!string}
 */
cwc.protocol.default.Device.prototype.getName = function() {
  return this.name || '';
};


/**
 * @param {!string} type
 * @return {THIS}
 * @template THIS
 */
cwc.protocol.default.Device.prototype.setType = function(type) {
  this.type = type;
  return this;
};


/**
 * @return {!string}
 */
cwc.protocol.default.Device.prototype.getType = function() {
  return this.type || '';
};


/**
 * @param {!Object} profile
 * @return {THIS}
 * @template THIS
 */
cwc.protocol.default.Device.prototype.setProfile = function(profile) {
  this.profile = profile;
  if (!this.icon && profile.icon) {
    this.icon = profile.icon;
  }
  if (!this.type && profile.name) {
    this.type = profile.name;
  }
  return this;
};


/**
 * @return {!Object}
 */
cwc.protocol.default.Device.prototype.getProfile = function() {
  return this.profile || {};
};


/**
 * @param {!string} icon
 * @return {THIS}
 * @template THIS
 */
cwc.protocol.default.Device.prototype.setIcon = function(icon) {
  this.icon = icon;
  return this;
};


/**
 * @return {!string}
 */
cwc.protocol.default.Device.prototype.getIcon = function() {
  return this.icon || '';
};


/**
 * @param {!string} name
 * @return {THIS}
 * @template THIS
 */
cwc.protocol.default.Device.prototype.setLogName = function(name) {
  this.log = new cwc.utils.Logger(name);
  return this;
};
