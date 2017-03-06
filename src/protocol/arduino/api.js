/**
 * @fileoverview Handles the communication with the Arduino unit.
 * This api allows users to control an Arduino over the USB interface.
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
goog.provide('cwc.protocol.Arduino.api');

goog.require('goog.events');
goog.require('goog.events.EventTarget');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.Arduino.api = function(helper) {
  /** @type {string} */
  this.name = 'Arduino';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {goog.events.EventTarget} */
  this.eventHandler = new goog.events.EventTarget();

  /** @type {cwc.protocol.serial.Device} */
  this.device = null;

  /** @type {boolean} */
  this.connected = false;

  /** @type {Function} */
  this.terminalHandler = null;
};


/**
 * Connects the Arduino.
 * @param {!cwc.protocol.serial.Device} device
 * @return {boolean} Was able to prepare and connect to the Arduino.
 * @export
 */
cwc.protocol.Arduino.api.prototype.connect = function(device) {
  if (!device) {
    console.error('Arduino is not ready yet …');
    return false;
  }
  if (this.device && this.connected && this.device != device) {
    this.device.disconnect();
  }
  console.log('Connect to Arduino device', device);
  this.device = device;
  this.device.setDataHandler(this.handleOnReceive.bind(this));
  this.device.connect();
  this.connected = true;
  return true;
};


/**
 * Disconnects the Arduino.
 */
cwc.protocol.Arduino.api.prototype.disconnect = function() {
  if (!this.connected) {
    console.warn('Arduino is not connected, no need to disconnect!');
    return;
  }
  console.log('Disconnect Arduino device', this.device);
  //this.cleanUp();
  this.device.disconnect();
  this.connected = false;
};


/**
 * @return {boolean}
 */
cwc.protocol.Arduino.api.prototype.isConnected = function() {
  return this.connected;
};


/**
 * Handles received data and callbacks from the serial device.
 * @param {Array<number>|ArrayBuffer|ArrayBufferView|null|number} raw_data
 */
cwc.protocol.Arduino.api.prototype.handleOnReceive = function(
    raw_data) {
  if (!raw_data) {
    return;
  }

  var sortedData = new Uint8Array(raw_data);
  console.log('handleData', sortedData);
  var str = String.fromCharCode.apply(null, sortedData);
  if (this.terminalHandler) {
    this.terminalHandler(str);
  }

  // Example api call returns 128 if 'C' is recieved.
  if (str == 'C') {
    var buffer = new ArrayBuffer(1);
    buffer[0] = 128;
    this.device.send(buffer);
  }
};


/**
 * @return {goog.events.EventTarget}
 * @export
 */
cwc.protocol.Arduino.api.prototype.getEventHandler = function() {
  return this.eventHandler;
};


/**
 * @param {!Function} handler
 * @export
 */
cwc.protocol.Arduino.api.prototype.setTerminalHandler = function(
    handler) {
  this.terminalHandler = handler;
};


/**
 * Basic cleanup for the Arduino unit.
 * @export
 */
cwc.protocol.Arduino.api.prototype.cleanUp = function() {
  this.connected = false;
};
