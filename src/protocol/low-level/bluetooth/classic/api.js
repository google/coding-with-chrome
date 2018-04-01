/**
 * @fileoverview Handels the pairing and communication with Bluetooth devices.
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
goog.provide('cwc.protocol.bluetooth.classic.Api');

goog.require('cwc.protocol.bluetooth.classic.Adapter');
goog.require('cwc.protocol.bluetooth.classic.Devices');
goog.require('cwc.protocol.bluetooth.classic.Events');
goog.require('cwc.utils.Logger');

goog.require('goog.events.EventTarget');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.bluetooth.classic.Api = function(helper) {
  /** @type {string} */
  this.name = 'Bluetooth';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {boolean} */
  this.enabled = false;

  /** @type {boolean} */
  this.prepared = false;

  /** @type {Object} */
  this.connectionIds = {};

  /** @private {!boolean} */
  this.isChromeApp_ = this.helper.checkChromeFeature('app');

  /** @private {!goog.events.EventTarget} */
  this.eventHandler_ = new goog.events.EventTarget();

  /** @private {cwc.protocol.bluetooth.classic.Adapter} */
  this.adapter_ = new cwc.protocol.bluetooth.classic.Adapter(
    this.eventHandler_);

  /** @private {cwc.protocol.bluetooth.classic.Devices} */
  this.devices_ = new cwc.protocol.bluetooth.classic.Devices(
    this.eventHandler_);

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Prepares the bluetooth api and monitors Bluetooth adapter.
 */
cwc.protocol.bluetooth.classic.Api.prototype.prepare = function() {
  if (!this.isChromeApp_ || !chrome.bluetooth) {
    console.warn('Bluetooth 2.0 support is not available!');
    return;
  } else if (this.prepared) {
    return;
  }

  this.log_.debug('Preparing Bluetooth 2.0 support...');

  // Monitor Bluetooth adapter
  goog.events.listen(this.eventHandler_,
    cwc.protocol.bluetooth.classic.Events.Type.ADAPTER_STATE_CHANGE,
    this.updateDevices, false, this);
  this.adapter_.prepare();

  // Monitor Bluetooth devices
  this.devices_.prepare();

  // Monitor Bluetooth sockets
  chrome.bluetoothSocket.onReceive.addListener(
    this.handleOnReceive_.bind(this));
  chrome.bluetoothSocket.onReceiveError.addListener(
    this.handleOnReceiveError_.bind(this));

  this.prepared = true;
};


cwc.protocol.bluetooth.classic.Api.prototype.updateDevices = function() {
  this.devices_.updateDevices();
};


/**
 * @param {!string} address
 * @return {cwc.protocol.bluetooth.classic.Device}
 */
cwc.protocol.bluetooth.classic.Api.prototype.getDevice = function(address) {
  return this.devices_.getDevice(address);
};


/**
 * @param {!string} name
 * @return {cwc.protocol.bluetooth.classic.Device}
 */
cwc.protocol.bluetooth.classic.Api.prototype.getDeviceByName = function(name) {
  return this.devices_.getDeviceByName(name);
};


/**
 * @return {Object}
 */
cwc.protocol.bluetooth.classic.Api.prototype.getDevices = function() {
  return this.devices_.getDevices();
};


/**
 * @return {!goog.events.EventTarget}
 */
cwc.protocol.bluetooth.classic.Api.prototype.getEventHandler = function() {
  return this.eventHandler_;
};


/**
 * @param {!string} deviceName
 * @param {Function} callback
 */
cwc.protocol.bluetooth.classic.Api.prototype.autoConnectDevice = function(
    deviceName, callback) {
  this.devices_.autoConnectDevice(deviceName, callback);
};


cwc.protocol.bluetooth.classic.Api.prototype.updateAdapterState = function() {
  this.adapter_.updateAdapterState();
};


cwc.protocol.bluetooth.classic.Api.prototype.closeSockets = function() {
  this.devices_.closeSockets();
};


/**
 * @param {Object} info
 * @private
 */
cwc.protocol.bluetooth.classic.Api.prototype.handleOnReceive_ = function(info) {
  this.devices_.receiveData(info['socketId'], info['data']);
};


/**
 * @param {Object} info
 * @private
 */
cwc.protocol.bluetooth.classic.Api.prototype.handleOnReceiveError_ = function(
    info) {
  this.devices_.receiveError(info['socketId'], info['error']);
};
