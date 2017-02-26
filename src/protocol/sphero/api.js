/**
 * @fileoverview Handles the communication with the Sphero unit.
 *
 * This api allows to read and control the Lego Mindstorm Sphero sensors and
 * actors over an Bluetooth connection.
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
goog.provide('cwc.protocol.sphero.Api');

goog.require('cwc.protocol.sphero.CallbackType');
goog.require('cwc.protocol.sphero.Commands');
goog.require('cwc.protocol.sphero.Events');
goog.require('cwc.protocol.sphero.MessageType');
goog.require('cwc.protocol.sphero.Monitoring');
goog.require('cwc.utils.ByteTools');

goog.require('goog.events.EventTarget');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.sphero.Api = function(helper) {

  /** @type {string} */
  this.name = 'Sphero';

  /** @type {boolean} */
  this.prepared = false;

  /** @type {string} */
  this.autoConnectName = 'Sphero';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.protocol.ev3.Commands} */
  this.commands = new cwc.protocol.sphero.Commands();

  /** @type {cwc.protocol.sphero.Monitoring} */
  this.monitoring = new cwc.protocol.sphero.Monitoring(this);

  /** @private {!Array.} */
  this.headerAck_ = [0xff, 0xff];

  /** @private {!Array.} */
  this.headerAsync_ = [0xff, 0xfe];

  /** @private {!number} */
  this.headerMinSize_ = 7;

  /** @type {cwc.protocol.bluetooth.Device} */
  this.device = null;

  /** @private {!boolean} */
  this.calibrate_ = false;

  /** @private {!number} */
  this.locationPosX_ = 0;

  /** @private {!number} */
  this.locationPosY_ = 0;

  /** @private {!number} */
  this.locationVelX_ = 0;

  /** @private {!number} */
  this.locationVelY_ = 0;

  /** @private {!number} */
  this.locationSog_ = 0;

  /** @private {!number} */
  this.locationSpeed_ = 0;

  /** @private {!number} */
  this.heading_ = 0;

  /** @private {!number} */
  this.speed_ = 20;

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
  this.setRGB(255, 0, 0);
  this.getRGB();
  this.setRGB(0, 255, 0);
  this.getRGB();
  this.setRGB(0, 0, 255);
  this.getRGB();
  this.setColisionDetection();
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
 */
cwc.protocol.sphero.Api.prototype.reset = function() {
  if (this.device) {
    this.device.reset();
  }
};


/**
 * @param {!boolean} enable
 * @export
 */
cwc.protocol.sphero.Api.prototype.monitor = function(enable) {
  if (enable && this.isConnected()) {
    this.monitoring.start();
  } else if (!enable) {
    this.monitoring.stop();
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
 *
 */
cwc.protocol.sphero.Api.prototype.setColisionDetection = function() {
  this.send_(this.commands.setColisionDetection());
};


/**
 * Sets the RGB color.
 * @param {!number} red 0-255
 * @param {!number} green 0-255
 * @param {!number} blue 0-255
 * @param {boolean=} opt_persistant
 */
cwc.protocol.sphero.Api.prototype.setRGB = function(red, green, blue,
    opt_persistant) {
  this.send_(this.commands.setRGB(red, green, blue, opt_persistant));
};


/**
 * Gets the current RGB color.
 */
cwc.protocol.sphero.Api.prototype.getRGB = function() {
  this.send_(this.commands.getRGB());
};


/**
 * @param {!number} brightness 0-255
 */
cwc.protocol.sphero.Api.prototype.setBackLed = function(brightness) {
  this.send_(this.commands.setBackLed(brightness));
};


/**
 * @param {!number} heading 0-359
 */
cwc.protocol.sphero.Api.prototype.setHeading = function(heading) {
  this.send_(this.commands.setHeading(heading));
};


/**
 * @param {number} opt_speed 0-255
 * @param {number=} opt_heading 0-359
 * @param {boolean=} opt_state
 */
cwc.protocol.sphero.Api.prototype.roll = function(opt_speed, opt_heading,
    opt_state) {
  var speed = this.speed_ = opt_speed === undefined ?
    this.speed_ : opt_speed;
  var heading = this.heading_ = opt_heading === undefined ?
    this.heading_ : opt_heading;
  this.send_(this.commands.roll(speed, heading, opt_state));
};


/**
 * @param {!number} timeout in msec
 */
cwc.protocol.sphero.Api.prototype.setMotionTimeout = function(timeout) {
  this.send_(this.commands.setMotionTimeout(timeout));
};


/**
 * @param {!boolean} enabled
 */
cwc.protocol.sphero.Api.prototype.boost = function(enabled) {
  this.send_(this.commands.boost(enabled));
};


/**
 * Puts the Sphero into sleep.
 * @param {number=} opt_wakeup
 * @param {number=} opt_macro
 * @param {number=} opt_orb_basic
 */
cwc.protocol.sphero.Api.prototype.sleep = function(opt_wakeup, opt_macro,
    opt_orb_basic) {
  console.log('Sends Sphero to sleep, good night.');
  this.send_(this.commands.sleep(opt_wakeup, opt_macro, opt_orb_basic));
};


/**
 * Stops the Sphero and clears the buffer.
 */
cwc.protocol.sphero.Api.prototype.stop = function() {
  this.reset();
  this.setRGB(0, 0, 0, 1);
  this.setBackLed(0);
  this.boost(false);
  this.roll(0, 0, 0);
};


/**
 * Starts the calibration to calibrate the Sphero.
 * @param {!number} heading
 */
cwc.protocol.sphero.Api.prototype.calibrate = function(heading) {
  if (!this.calibrate_) {
    this.setRGB(0, 0, 0);
    this.setBackLed(255);
    this.calibrate_ = true;
  }
  this.roll(0, heading);
};


/**
 * Ends the calibrate of the Sphero and store the new 0 point.
 */
cwc.protocol.sphero.Api.prototype.setCalibration = function() {
  this.calibrate_ = false;
  this.setBackLed(0);
  this.setHeading(0);
};


/**
 * Reads the current Sphero location.
 */
cwc.protocol.sphero.Api.prototype.getLocation = function() {
  this.send_(this.commands.getLocation());
};


/**
 * Reads current Sphero version.
 */
cwc.protocol.sphero.Api.prototype.getVersion = function() {
  this.send_(this.commands.getVersion());
};


/**
 * Run self test.
 */
cwc.protocol.sphero.Api.prototype.runTest = function() {
  console.log('Prepare self test…');
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
  this.roll(0, 180);
};


/**
 * Basic cleanup for the Sphero ball.
 */
cwc.protocol.sphero.Api.prototype.cleanUp = function() {
  console.log('Clean up Sphero…');
  this.monitoring.stop();
  this.reset();
};


/**
 * @param {!ArrayBuffer} buffer
 * @private
 */
cwc.protocol.sphero.Api.prototype.send_ = function(buffer) {
  if (!this.device) {
    return;
  }
  this.device.send(buffer);
};


/**
 * @param {Object} data
 * @private
 */
cwc.protocol.sphero.Api.prototype.updateLocationData_ = function(data) {
  var xpos = cwc.utils.ByteTools.signedBytesToInt([data[0], data[1]]);
  var ypos = cwc.utils.ByteTools.signedBytesToInt([data[2], data[3]]);
  var xvel = cwc.utils.ByteTools.signedBytesToInt([data[4], data[5]]);
  var yvel = cwc.utils.ByteTools.signedBytesToInt([data[6], data[7]]);
  var speed = cwc.utils.ByteTools.bytesToInt([data[8], data[9]]);

  if (xpos != this.locationPosX_ || ypos != this.locationPosY_) {
    this.locationPosX_ = xpos;
    this.locationPosY_ = ypos;
    this.eventHandler.dispatchEvent(
      cwc.protocol.sphero.Events.LocationData({x: xpos, y: ypos}));
  }

  if (xvel != this.locationVelX || yvel != this.locationVelY) {
    this.locationVelX_ = xvel;
    this.locationVelY_ = yvel;
    this.eventHandler.dispatchEvent(
      cwc.protocol.sphero.Events.VelocityData({x: xvel, y: yvel}));
  }

  if (speed != this.locationSpeed) {
    this.locationSpeed_ = speed;
    this.eventHandler.dispatchEvent(
      cwc.protocol.sphero.Events.SpeedValue(speed));
  }
};


/**
 * @param {Object} data
 * @private
 */
cwc.protocol.sphero.Api.prototype.parseCollisionData_ = function(data) {
  var x = cwc.utils.ByteTools.signedBytesToInt([data[0], data[1]]);
  var y = cwc.utils.ByteTools.signedBytesToInt([data[2], data[3]]);
  var z = cwc.utils.ByteTools.signedBytesToInt([data[4], data[5]]);
  var axis = data[6] == 0x01 ? 'y' : 'x';
  var xMagnitude = cwc.utils.ByteTools.signedBytesToInt([data[7], data[8]]);
  var yMagnitude = cwc.utils.ByteTools.signedBytesToInt([data[9], data[10]]);
  var speed = data[11];
  this.eventHandler.dispatchEvent(
    cwc.protocol.sphero.Events.Collision({
      x: x,
      y: y,
      z: z,
      axis: axis,
      magnitude: {
        x: xMagnitude,
        y: yMagnitude
      },
      speed: speed
    }));
};


/**
 * Handles received data and callbacks from the Bluetooth socket.
 * @param {ArrayBuffer} buffer
 * @private
 */
cwc.protocol.sphero.Api.prototype.handleAcknowledged_ = function(buffer) {
  if (!this.verifiyChecksum_(buffer)) {
    return;
  }
  var type = buffer[3];
  var len = buffer[4];
  var data = buffer.slice(5, buffer.length -1);
  switch (type) {
    case cwc.protocol.sphero.CallbackType.RGB:
      console.log('RGB:', data[0], data[1], data[2]);
      break;
    case cwc.protocol.sphero.CallbackType.LOCATION:
      this.updateLocationData_(data);
      break;
    default:
      console.log('Received type', type, 'with', len,
        ' bytes of unknown data:', data);
  }
};


/**
 * Handles async packets from the Bluetooth socket.
 * @param {ArrayBuffer} buffer
 * @private
 */
cwc.protocol.sphero.Api.prototype.handleAsync_ = function(buffer) {
  if (!this.verifiyChecksum_(buffer)) {
    return;
  }
  var message = buffer[2];
  var len = buffer[4];
  var data = buffer.slice(5, buffer.length -1);
  switch (message) {
    case cwc.protocol.sphero.MessageType.COLLISION_DETECTED:
      this.parseCollisionData_(data);
      break;
    default:
      console.log('Received message', message, 'with', len,
        ' bytes of unknown data:', data);
  }
};


/**
 * @param {!ArrayBuffer} buffer
 * @param {Number=} opt_checksum
 * @return {!boolean}
 * @private
 */
cwc.protocol.sphero.Api.prototype.verifiyChecksum_ = function(buffer,
    opt_checksum) {
  var bufferChecksum = 0;
  var bufferLength = buffer.length -1;
  var checksum = opt_checksum || buffer[bufferLength];
  for (let i = 2; i < bufferLength; i++) {
    bufferChecksum += buffer[i];
  }

  return checksum === (bufferChecksum % 256) ^ 0xFF;
};
