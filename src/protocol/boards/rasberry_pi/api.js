/**
 * @fileoverview Handles the communication with the Raspberry Pi unit.
 * This api allows users to control an Raspberry Pi over the USB interface.
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
goog.provide('cwc.protocol.raspberryPi.Api');

goog.require('cwc.protocol.raspberryPi.Events');

goog.require('goog.events');
goog.require('goog.events.EventTarget');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.raspberryPi.Api = function(helper) {
  /** @type {string} */
  this.name = 'Rasberry Pi';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {cwc.protocol.serial.Device} */
  this.device = null;

  /** @type {boolean} */
  this.connected = false;

  /** @type {goog.events.EventTarget} */
  this.eventHandler = new goog.events.EventTarget();

  /** @type {Function} */
  this.terminalHandler = null;
};


/**
 * AutoConnects the Raspberry Pi.
 * @export
 */
cwc.protocol.raspberryPi.Api.prototype.autoConnect = function() {
  let serialInstance = this.helper.getInstance('serial', true);
  let device = serialInstance.getConnectedDevice();
  if (device) {
    this.connect(device);
  }
};


/**
 * Connects the Raspberry Pi.
 * @param {!cwc.protocol.serial.Device} device
 * @return {boolean} Was able to prepare and connect to the Raspberry Pi.
 * @export
 */
cwc.protocol.raspberryPi.Api.prototype.connect = function(device) {
  if (!device) {
    console.error('Raspberry Pi is not ready yet...');
    return false;
  }
  if (this.device && this.connected && this.device != device) {
    this.device.disconnect();
  }
  this.device = device;
  this.device.setDataHandler(this.handleOnReceive_.bind(this));
  if (device && device.isConnected()) {
    console.log('Reconnecting to Raspberry Pi device', device);
  } else {
    console.log('Connecting to Raspberry Pi device', device);
    this.device.connect();
  }
  this.connected = true;
  return true;
};


/**
 * Disconnects the Raspberry Pi.
 */
cwc.protocol.raspberryPi.Api.prototype.disconnect = function() {
  if (!this.connected) {
    console.warn('Raspberry Pi is not connected, no need to disconnect!');
    return;
  }
  console.log('Disconnect RaspberryPi device', this.device);
  this.device.disconnect();
  this.connected = false;
};


/**
 * Resets the Raspberry Pi.
 */
cwc.protocol.raspberryPi.Api.prototype.reset = function() {
  if (!this.connected) {
    console.warn('Raspberry Pi is not connected, no need to reset!');
    return;
  }
  console.log('Reset RaspberryPi device', this.device);
  this.device.reset();
};


/**
 * @return {boolean}
 */
cwc.protocol.raspberryPi.Api.prototype.isConnected = function() {
  return this.connected;
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.protocol.raspberryPi.Api.prototype.getEventHandler = function() {
  return this.eventHandler;
};


/**
 * @param {!ArrayBuffer|Uint8Array} data
 * @export
 */
cwc.protocol.raspberryPi.Api.prototype.send = function(data) {
  this.send_(data);
};


/**
 * @param {!string} text
 * @export
 */
cwc.protocol.raspberryPi.Api.prototype.sendText = function(text) {
  let buffer = new ArrayBuffer(text.length);
  let bufferView = new Uint8Array(buffer);
  for (let i = 0; i < text.length; i++) {
    bufferView[i] = text.charCodeAt(i);
  }
  this.send_(buffer);
};


/**
 * @param {!ArrayBuffer} buffer
 * @private
 */
cwc.protocol.raspberryPi.Api.prototype.send_ = function(buffer) {
  if (!this.device) {
    return;
  }
  this.device.send(buffer);
};


/**
 * Handles received data and callbacks from the socket.
 * @param {Array<number>|ArrayBuffer|ArrayBufferView|null|number} raw_data
 * @private
 */
cwc.protocol.raspberryPi.Api.prototype.handleOnReceive_ = function(raw_data) {
  if (!raw_data) {
    console.error('Received no data!');
    return;
  }
  this.eventHandler.dispatchEvent(
      cwc.protocol.raspberryPi.Events.recievedData(raw_data));
};
