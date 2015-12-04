/**
 * @fileoverview Handles the communication with the Sphero unit.
 *
 * This api allows to read and control the Lego Mindstorm Sphero sensors and
 * actors over an Bluetooth connection.
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
goog.provide('cwc.protocol.sphero.Api');

goog.require('cwc.protocol.bluetooth.Api');
goog.require('cwc.protocol.sphero.Buffer');
goog.require('cwc.protocol.sphero.CallbackType');
goog.require('cwc.protocol.sphero.Command');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.sphero.Api = function(helper) {

  /** @type {!cwc.protocol.sphero.Command} */
  this.command = cwc.protocol.sphero.Command;

  /** @type {!cwc.protocol.sphero.CallbackType} */
  this.callbackType = cwc.protocol.sphero.CallbackType;

  /** @type {string} */
  this.name = 'Sphero';

  /** @type {boolean} */
  this.prepared = false;

  /** @type {string} */
  this.autoConnectName = 'Sphero';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {cwc.protocol.bluetooth.Device} */
  this.device = null;

  /** @type {goog.events.EventTarget} */
  this.eventHandler = new goog.events.EventTarget();
};


/**
 * AutoConnects the Sphero unit.
 * @return {boolean}
 * @export
 */
cwc.protocol.sphero.Api.prototype.autoConnect = function() {
  var bluetoothInstance = this.helper.getInstance('bluetooth', true);
  var device = bluetoothInstance.getDeviceByName(this.autoConnectName);
  if (device) {
    if (device.isConnected()) {
      return this.connect(device.getAddress());
    } else {
      this.helper.showInfo('Connecting Sphero ball...');
      var connectEvent = function(socket_id, address) {
        this.connect(address);
      };
      return device.connect(connectEvent.bind(this));
    }
  }
  this.helper.showError('Was unable to auto connect to', this.autoConnectName);
  return false;
};


/**
 * Connects the Sphero ball.
 * @param {!string} address
 * @return {boolean} Was able to prepare and connect to the Sphero.
 * @export
 */
cwc.protocol.sphero.Api.prototype.connect = function(address) {
  var bluetoothInstance = this.helper.getInstance('bluetooth', true);
  var device = bluetoothInstance.getDevice(address);
  if (!device) {
    console.error('Sphero ball is not ready yet ...');
    return false;
  }

  if (!this.prepared && device.isConnected()) {
    console.log('Preparing Sphero bluetooth api for', device.getAddress());
    this.device = device;
    this.prepare();
    this.runTest();
  }

  return true;
};


/**
 * @export
 */
cwc.protocol.sphero.Api.prototype.prepare = function() {
  this.device.setDataHandler(this.handleOnReceive.bind(this));
  this.setRGB(255, 0, 0);
  this.getRGB();
  this.setRGB(0, 255, 0);
  this.getRGB();
  this.setRGB(0, 0, 255);
  this.getRGB();
  this.prepared = true;
};


/**
 * Disconnects the Sphero ball.
 */
cwc.protocol.sphero.Api.prototype.disconnect = function() {
  this.device.disconnect();
};


/**
 * @param {!cwc.protocol.sphero.Buffer} buffer
 * @param {number=} opt_delay
 */
cwc.protocol.sphero.Api.prototype.send = function(buffer, opt_delay) {
  var data = buffer.readSigned();
  if (opt_delay) {
    this.device.sendDelayed(data, opt_delay);
  } else {
    this.device.send(data);
  }
};


/**
 * @param {!number} red 0-255
 * @param {!number} green 0-255
 * @param {!number} blue 0-255
 * @param {boolean=} opt_persistant
 */
cwc.protocol.sphero.Api.prototype.setRGB = function(red, green, blue,
    opt_persistant) {
  var buffer = new cwc.protocol.sphero.Buffer();
  buffer.writeCommand(this.command.RGB_LED.SET);
  buffer.writeByte(red);
  buffer.writeByte(green);
  buffer.writeByte(blue);
  buffer.writeByte(opt_persistant == false ? 0x00 : 0x01);
  this.send(buffer);
};


/**
 *
 */
cwc.protocol.sphero.Api.prototype.getRGB = function() {
  var buffer = new cwc.protocol.sphero.Buffer(this.callbackType.RGB);
  buffer.writeCommand(this.command.RGB_LED.GET);
  this.send(buffer);
};


/**
 * @param {!number} brightness 0-255
 */
cwc.protocol.sphero.Api.prototype.setBackLed = function(brightness) {
  var buffer = new cwc.protocol.sphero.Buffer();
  buffer.writeCommand(this.command.BACK_LED);
  buffer.writeByte(brightness);
  this.send(buffer);
};


/**
 * @param {!number} heading 0-359
 */
cwc.protocol.sphero.Api.prototype.setHeading = function(heading) {
  var buffer = new cwc.protocol.sphero.Buffer();
  buffer.writeCommand(this.command.HEADING);
  buffer.writeUInt(heading);
  this.send(buffer);
};


/**
 * @param {!number} speed 0-255
 * @param {number=} opt_heading 0-359
 * @param {boolean=} opt_state
 */
cwc.protocol.sphero.Api.prototype.move = function(speed, opt_heading,
    opt_state) {
  var buffer = new cwc.protocol.sphero.Buffer();
  var heading = opt_heading || 0;
  var state = typeof opt_state !== 'undefined' ? opt_state : 1;
  buffer.writeCommand(this.command.MOVE);
  buffer.writeByte(speed);
  buffer.writeUInt(heading);
  buffer.writeByte(state);
  this.send(buffer);
};


/**
 * @param {number=} opt_time in 1/10 sec
 * @param {number=} opt_heading 0-359
 */
cwc.protocol.sphero.Api.prototype.boost = function(opt_time, opt_heading) {
  var buffer = new cwc.protocol.sphero.Buffer();
  var boostTime = typeof opt_time !== 'undefined' ? opt_time : 10;
  var heading = opt_heading || 0;
  buffer.writeCommand(this.command.BOOST);
  buffer.writeByte(boostTime);
  buffer.writeUInt(heading);
  this.send(buffer);
};


/**
 * Reads current EV3 firmware.
 */
cwc.protocol.sphero.Api.prototype.getVersion = function() {
  var buffer = new cwc.protocol.sphero.Buffer(this.callbackType.FIRMWARE);
  buffer.writeCommand(this.command.SYSTEM.VERSION);
  this.send(buffer);
};


cwc.protocol.sphero.Api.prototype.runTest = function() {
  console.log('Prepare self Tests...');
  this.setRGB(255, 0, 0);
  this.setRGB(0, 255, 0);
  this.setRGB(0, 0, 255);
  this.setRGB(0, 0, 0);

  this.setBackLed(100);
  this.setBackLed(75);
  this.setBackLed(50);
  this.setBackLed(25);
  this.setBackLed(0);

  this.setRGB(255, 0, 0);
  this.move(0, 180);
  this.boost();
};


/**
 * Handles received data and callbacks from the Bluetooth socket.
 * @param {Array<number>|ArrayBuffer|ArrayBufferView|null|number} raw_data
 */
cwc.protocol.sphero.Api.prototype.handleOnReceive = function(
    raw_data) {
  if (!raw_data) {
    console.error('Recieved no data!');
    return;
  }
  var data = data = new Uint8Array(raw_data);
  if (data.length <= 5) {
    console.error('Recieved data are to small!');
    return;
  }

  var callback = data[3];

  console.log('Recieved data:', raw_data, data);
};


/**
 * Local echo command for testing.
 * @param {string} value
 */
cwc.protocol.sphero.Api.prototype.echo = function(value) {
  console.log('Sphero echo:', value);
};


/**
 * Basic cleanup for the Sphero ball.
 */
cwc.protocol.sphero.Api.prototype.cleanUp = function() {
  console.log('Clean up Sphero ...');
};
