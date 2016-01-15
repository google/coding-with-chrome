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

goog.require('cwc.protocol.sphero.Buffer');
goog.require('cwc.protocol.sphero.CallbackType');
goog.require('cwc.protocol.sphero.Command');
goog.require('cwc.protocol.sphero.Monitoring');



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

  /** @type {cwc.protocol.sphero.Monitoring} */
  this.monitoring = new cwc.protocol.sphero.Monitoring(this);

  /** @private {!array} */
  this.headerAck_ = [0xff, 0xff];

  /** @private {!array} */
  this.headerAsync_ = [0xff, 0xfe];

  /** @private {!number} */
  this.headerMinSize_ = 6;

  /** @type {cwc.protocol.bluetooth.Device} */
  this.device = null;

  /** @type {?} */
  this.locationData = {};

  /** @type {goog.events.EventTarget} */
  this.eventHandler = new goog.events.EventTarget();
};


/**
 * AutoConnects the Sphero ball.
 * @export
 */
cwc.protocol.sphero.Api.prototype.autoConnect = function() {
  var bluetoothInstance = this.helper.getInstance('bluetooth', true);
  bluetoothInstance.autoConnectDevice(this.autoConnectName,
      this.connect.bind(this));
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
    console.error('Sphero ball is not ready yet …');
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
 * @return {boolean}
 */
cwc.protocol.sphero.Api.prototype.isConnected = function() {
  return (this.device && this.device.isConnected());
};


/**
 * @export
 */
cwc.protocol.sphero.Api.prototype.prepare = function() {
  this.device.setDataHandler(this.handleAcknowledged_.bind(this),
      this.headerAck_, this.headerMinSize_);
  this.device.setDataHandler(this.handleAsync_.bind(this),
      this.headerAsync_, this.headerMinSize_);
  this.monitoring.init();
  this.monitoring.start();
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
  if (this.device) {
    this.device.disconnect();
  }
  this.cleanUp();
};


/**
 * Resets the Sphero ball connection.
 * @param {number=} opt_delay
 */
cwc.protocol.sphero.Api.prototype.reset = function(opt_delay) {
  if (this.device) {
    this.device.reset(opt_delay);
  }
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.protocol.sphero.Api.prototype.getEventHandler = function() {
  return this.eventHandler;
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.protocol.sphero.Api.prototype.getLocationData = function() {
  return this.locationData;
};


/**
 * @param {!number} red 0-255
 * @param {!number} green 0-255
 * @param {!number} blue 0-255
 * @param {boolean=} opt_persistant
 * @param {number=} opt_delay in msec
 */
cwc.protocol.sphero.Api.prototype.setRGB = function(red, green, blue,
    opt_persistant, opt_delay) {
  var buffer = new cwc.protocol.sphero.Buffer();
  buffer.writeCommand(this.command.RGB_LED.SET);
  buffer.writeByte(red);
  buffer.writeByte(green);
  buffer.writeByte(blue);
  buffer.writeByte(opt_persistant == false ? 0x00 : 0x01);
  this.send_(buffer, opt_delay);
};


/**
 *
 */
cwc.protocol.sphero.Api.prototype.getRGB = function() {
  var buffer = new cwc.protocol.sphero.Buffer(this.callbackType.RGB);
  buffer.writeCommand(this.command.RGB_LED.GET);
  this.send_(buffer);
};


/**
 * @param {!number} brightness 0-255
 * @param {number=} opt_delay in msec
 */
cwc.protocol.sphero.Api.prototype.setBackLed = function(brightness,
    opt_delay) {
  var buffer = new cwc.protocol.sphero.Buffer();
  buffer.writeCommand(this.command.BACK_LED);
  buffer.writeByte(brightness);
  this.send_(buffer, opt_delay);
};


/**
 * @param {!number} heading 0-359
 * @param {number=} opt_delay in msec
 */
cwc.protocol.sphero.Api.prototype.setHeading = function(heading, opt_delay) {
  var buffer = new cwc.protocol.sphero.Buffer();
  buffer.writeCommand(this.command.HEADING);
  buffer.writeUInt(heading);
  this.send_(buffer, opt_delay);
};


/**
 * @param {!number} speed 0-255
 * @param {number=} opt_heading 0-359
 * @param {boolean=} opt_state
 * @param {number=} opt_delay in msec
 */
cwc.protocol.sphero.Api.prototype.roll = function(speed, opt_heading,
    opt_state, opt_delay) {
  var buffer = new cwc.protocol.sphero.Buffer();
  var heading = opt_heading || 0;
  var state = typeof opt_state !== 'undefined' ? opt_state : 0x01;
  buffer.writeCommand(this.command.ROLL);
  buffer.writeByte(speed);
  buffer.writeUInt(heading);
  buffer.writeByte(state);
  this.send_(buffer, opt_delay);
};


/**
 * @param {!number} timeout in msec
 */
cwc.protocol.sphero.Api.prototype.setMotionTimeout = function(timeout,
    opt_delay) {
  var buffer = new cwc.protocol.sphero.Buffer();
  buffer.writeCommand(this.command.MOTION_TIMEOUT);
  buffer.writeByte(timeout);
  this.send_(buffer, opt_delay);
};


/**
 * @param {!boolean} enabled
 * @param {number=} opt_delay in msec
 */
cwc.protocol.sphero.Api.prototype.boost = function(enabled, opt_delay) {
  var buffer = new cwc.protocol.sphero.Buffer();
  buffer.writeCommand(this.command.BOOST);
  buffer.writeByte(enabled ? 0x01 : 0x00);
  this.send_(buffer);
};


/**
 * @param {number=} opt_time in 1/10 sec
 * @param {number=} opt_heading 0-359
 * @param {number=} opt_delay in msec
 */
cwc.protocol.sphero.Api.prototype.boosty = function(opt_time, opt_heading,
    opt_delay) {
  var buffer = new cwc.protocol.sphero.Buffer();
  var boostTime = typeof opt_time !== 'undefined' ? opt_time : 10;
  var heading = opt_heading || 0;
  buffer.writeCommand(this.command.BOOST);
  buffer.writeByte(boostTime);
  buffer.writeUInt(heading);
  this.send_(buffer);
};


/**
 * Puts the Sphero into sleep.
 * @param {number=} opt_wakeup
 * @param {number=} opt_macro
 * @param {number=} opt_orb_basic
 * @param {number=} opt_delay
 */
cwc.protocol.sphero.Api.prototype.sleep = function(opt_wakeup, opt_macro,
    opt_orb_basic, opt_delay) {
  console.log('Sends Sphero to sleep, good night.');
  var buffer = new cwc.protocol.sphero.Buffer();
  buffer.writeCommand(this.command.SYSTEM.SLEEP);
  buffer.writeByte(opt_wakeup || 0);
  buffer.writeByte(opt_macro || 0);
  buffer.writeByte(opt_orb_basic || 0);
  this.send_(buffer, opt_delay);
};


/**
 * Stops the Sphero and clears the buffer.
 * @param {number=} opt_delay
 */
cwc.protocol.sphero.Api.prototype.stop = function(opt_delay) {
  this.reset(opt_delay);
  this.setRGB(0, 0, 0, 1, opt_delay);
  this.setBackLed(0, opt_delay);
  this.move(0, 0, 0, opt_delay);
};


/**
 * Calibrate the Sphero.
 * @param {!number} heading
 */
cwc.protocol.sphero.Api.prototype.calibrate = function(heading) {
  this.setRGB(0, 0, 0);
  this.setBackLed(255);
  this.move(0, heading);
};


/**
 * Ends the calibrate of the Sphero and store the new 0 point.
 */
cwc.protocol.sphero.Api.prototype.setCalibration = function() {
  this.setBackLed(0);
  this.setHeading(0);
};


/**
 * Reads the current Sphero location.
 */
cwc.protocol.sphero.Api.prototype.getLocation = function() {
  var buffer = new cwc.protocol.sphero.Buffer(this.callbackType.LOCATION);
  buffer.writeCommand(this.command.LOCATION.GET);
  this.send_(buffer);
};


/**
 * Reads current Sphero version.
 */
cwc.protocol.sphero.Api.prototype.getVersion = function() {
  var buffer = new cwc.protocol.sphero.Buffer(this.callbackType.FIRMWARE);
  buffer.writeCommand(this.command.SYSTEM.VERSION);
  this.send_(buffer);
};


cwc.protocol.sphero.Api.prototype.runTest = function() {
  console.log('Prepare self Tests…');
  this.setRGB(255, 0, 0, 1, 500);
  this.setRGB(0, 255, 0, 1, 500);
  this.setRGB(0, 0, 255, 1, 500);
  this.setRGB(0, 0, 0, 1, 500);

  this.setBackLed(100, 100);
  this.setBackLed(75, 100);
  this.setBackLed(50, 100);
  this.setBackLed(25, 100);
  this.setBackLed(0, 100);

  this.setRGB(255, 0, 0);
  this.move(0, 180);
};


/**
 * Basic cleanup for the Sphero ball.
 */
cwc.protocol.sphero.Api.prototype.cleanUp = function() {
  console.log('Clean up Sphero …');
  this.monitoring.stop();
  this.reset();
};


/**
 * @param {!cwc.protocol.sphero.Buffer} buffer
 * @param {number=} opt_delay
 * @private
 */
cwc.protocol.sphero.Api.prototype.send_ = function(buffer, opt_delay) {
  if (!this.device) {
    return;
  }
  var data = buffer.readSigned();
  if (opt_delay) {
    this.device.sendDelayed(data, opt_delay);
  } else {
    this.device.send(data);
  }
};


/**
 * Handles received data and callbacks from the Bluetooth socket.
 * @param {ArrayBuffer} buffer
 * @private
 */
cwc.protocol.sphero.Api.prototype.handleAcknowledged_ = function(buffer) {
  if (!buffer || buffer.length < 7) {
    return;
  }
  var type = buffer[3];
  //var len = buffer[4];
  var data = buffer.slice(5, buffer.length -1);
  var chk = buffer[buffer.length - 1];
  var bufferChk = 0;
  for (var i = 2; i < buffer.length -1; i++) {
    bufferChk += buffer[i];
  }
  bufferChk = (bufferChk % 256) ^ 0xFF;
  if (chk !== bufferChk) {
    return;
  }
  switch (type) {
    case this.callbackType.RGB:
      console.log('RGB:', data[0], data[1], data[2]);
      break;
    case this.callbackType.LOCATION:
      var xpos = (data[0] << 8) + data[1];
      var ypos = (data[2] << 8) + data[3];
      this.locationData = {
        xpos: xpos > 32768 ? (xpos - 65535) : xpos,
        ypos: ypos > 32768 ? (ypos - 65535) : ypos,
        xvel: (data[4] << 8) + data[5],
        yvel: (data[6] << 8) + data[7],
        sog: (data[8] << 8) + data[9]
      };
      console.log('Location:', this.locationData);
      break;
    default:
      console.log('Recieved unknown data:', data);
  }
};


/**
 * Handles async packets from the Bluetooth socket.
 * @param {ArrayBuffer} buffer
 * @private
 */
cwc.protocol.sphero.Api.prototype.handleAsync_ = function(buffer) {
  if (!buffer || buffer.length < 7) {
    return;
  }
  console.log('Async:', buffer);
};
