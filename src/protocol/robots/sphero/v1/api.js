/**
 * @fileoverview Handles the communication with the Sphero Classic unit.
 *
 * This api allows to read and control the Lego Mindstorm Sphero sensors and
 * actors over an Bluetooth connection.
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
goog.provide('cwc.protocol.sphero.v1.Api');

goog.require('cwc.protocol.sphero.v1.CallbackType');
goog.require('cwc.protocol.sphero.v1.Commands');
goog.require('cwc.protocol.sphero.v1.Events');
goog.require('cwc.protocol.sphero.v1.MessageType');
goog.require('cwc.protocol.sphero.v1.Monitoring');
goog.require('cwc.utils.ByteTools');

goog.require('goog.events.EventTarget');


/**
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.sphero.v1.Api = function() {
  /** @type {string} */
  this.name = 'Sphero v1';

  /** @type {boolean} */
  this.prepared = false;

  /** @type {!cwc.protocol.sphero.v1.Commands} */
  this.commands = new cwc.protocol.sphero.v1.Commands();

  /** @type {cwc.protocol.sphero.v1.Monitoring} */
  this.monitoring = new cwc.protocol.sphero.v1.Monitoring(this);

  /** @private {!Array} */
  this.headerAck_ = [0xff, 0xff];

  /** @private {!Array} */
  this.headerAsync_ = [0xff, 0xfe];

  /** @private {!number} */
  this.headerMinSize_ = 7;

  /** @type {cwc.protocol.bluetooth.lowEnergy.Device} */
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
 * Connects the Sphero ball.
 * @param {!cwc.protocol.bluetooth.lowEnergy.Device} device
 * @return {boolean} Was able to prepare and connect to the Sphero.
 * @export
 */
cwc.protocol.sphero.v1.Api.prototype.connect = function(device) {
  if (!device || !device.isConnected()) {
    console.error('Sphero is not ready yet...');
    return false;
  }

  if (!this.prepared) {
    console.log('Preparing Sphero bluetooth LE api for', device.getId());
    this.device = device;
    this.device.sendRaw(
      new TextEncoder('utf-8').encode('011i3'),
      '22bb746f-2bbd-7554-2d6f-726568705327');
    this.device.sendRaw(
      Uint8Array.from(0x07), '22bb746f-2bb2-7554-2d6f-726568705327');
    this.device.sendRaw(
      Uint8Array.from(0x01), '22bb746f-2bbf-7554-2d6f-726568705327', () => {
        this.prepare();
        this.runTest();
      });
  }
  return true;
};


/**
 * @return {!boolean}
 */
cwc.protocol.sphero.v1.Api.prototype.isConnected = function() {
  return (this.device && this.device.isConnected()) ? true : false;
};


/**
 * @export
 */
cwc.protocol.sphero.v1.Api.prototype.prepare = function() {
  this.device.listen('22bb746f-2ba6-7554-2d6f-726568705327',
    this.handleData_.bind(this));
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
cwc.protocol.sphero.v1.Api.prototype.disconnect = function() {
  if (this.device) {
    this.device.disconnect();
  }
  this.cleanUp();
};


/**
 * Resets the Sphero ball connection.
 */
cwc.protocol.sphero.v1.Api.prototype.reset = function() {
  if (this.device) {
    this.device.reset();
  }
};


/**
 * @param {!boolean} enable
 * @export
 */
cwc.protocol.sphero.v1.Api.prototype.monitor = function(enable) {
  if (enable && this.isConnected()) {
    this.monitoring.start();
  } else if (!enable) {
    this.monitoring.stop();
  }
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.protocol.sphero.v1.Api.prototype.getEventHandler = function() {
  return this.eventHandler;
};


/**
 *
 */
cwc.protocol.sphero.v1.Api.prototype.setColisionDetection = function() {
  this.send_(this.commands.setColisionDetection());
};


/**
 * Sets the RGB color.
 * @param {!number} red 0-255
 * @param {!number} green 0-255
 * @param {!number} blue 0-255
 * @param {boolean=} opt_persistent
 */
cwc.protocol.sphero.v1.Api.prototype.setRGB = function(red, green, blue,
    opt_persistent) {
  this.send_(this.commands.setRGB(red, green, blue, opt_persistent));
};


/**
 * Gets the current RGB color.
 */
cwc.protocol.sphero.v1.Api.prototype.getRGB = function() {
  this.send_(this.commands.getRGB());
};


/**
 * @param {!number} brightness 0-255
 */
cwc.protocol.sphero.v1.Api.prototype.setBackLed = function(brightness) {
  this.send_(this.commands.setBackLed(brightness));
};


/**
 * @param {!number} heading 0-359
 */
cwc.protocol.sphero.v1.Api.prototype.setHeading = function(heading) {
  this.send_(this.commands.setHeading(heading));
};


/**
 * @param {number} opt_speed 0-255
 * @param {number=} opt_heading 0-359
 * @param {boolean=} opt_state
 */
cwc.protocol.sphero.v1.Api.prototype.roll = function(opt_speed, opt_heading,
    opt_state) {
  let speed = this.speed_ = opt_speed === undefined ?
    this.speed_ : opt_speed;
  let heading = this.heading_ = opt_heading === undefined ?
    this.heading_ : opt_heading;
  this.send_(this.commands.roll(speed, heading, opt_state));
};


/**
 * @param {!number} timeout in msec
 */
cwc.protocol.sphero.v1.Api.prototype.setMotionTimeout = function(timeout) {
  this.send_(this.commands.setMotionTimeout(timeout));
};


/**
 * @param {!boolean} enabled
 */
cwc.protocol.sphero.v1.Api.prototype.boost = function(enabled) {
  this.send_(this.commands.boost(enabled));
};


/**
 * Puts the Sphero into sleep.
 * @param {number=} opt_wakeup
 * @param {number=} opt_macro
 * @param {number=} opt_orb_basic
 */
cwc.protocol.sphero.v1.Api.prototype.sleep = function(opt_wakeup, opt_macro,
    opt_orb_basic) {
  console.log('Sends Sphero to sleep, good night.');
  this.send_(this.commands.sleep(opt_wakeup, opt_macro, opt_orb_basic));
};


/**
 * Stops the Sphero and clears the buffer.
 */
cwc.protocol.sphero.v1.Api.prototype.stop = function() {
  this.reset();
  this.setRGB(0, 0, 0, true);
  this.setBackLed(0);
  this.boost(false);
  this.roll(0, 0, false);
};


/**
 * Starts the calibration to calibrate the Sphero.
 * @param {!number} heading
 */
cwc.protocol.sphero.v1.Api.prototype.calibrate = function(heading) {
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
cwc.protocol.sphero.v1.Api.prototype.setCalibration = function() {
  this.calibrate_ = false;
  this.setBackLed(0);
  this.setHeading(0);
};


/**
 * Reads the current Sphero location.
 */
cwc.protocol.sphero.v1.Api.prototype.getLocation = function() {
  this.send_(this.commands.getLocation());
};


/**
 * Reads current Sphero version.
 */
cwc.protocol.sphero.v1.Api.prototype.getVersion = function() {
  this.send_(this.commands.getVersion());
};


/**
 * Run self test.
 */
cwc.protocol.sphero.v1.Api.prototype.runTest = function() {
  console.log('Prepare self test…');
  this.setRGB(255, 0, 0, true);
  this.setRGB(0, 255, 0, true);
  this.setRGB(0, 0, 255, true);
  this.setRGB(0, 0, 0, true);

  this.setBackLed(100);
  this.setBackLed(75);
  this.setBackLed(50);
  this.setBackLed(25);
  this.setBackLed(0);

  this.setRGB(255, 0, 0);
  this.roll(0, 180);
};


/**
 * Basic cleanup for the Sphero ball.
 */
cwc.protocol.sphero.v1.Api.prototype.cleanUp = function() {
  console.log('Clean up Sphero v1 API…');
  this.monitoring.stop();
  this.reset();
};


/**
 * @param {!ArrayBuffer} buffer
 * @private
 */
cwc.protocol.sphero.v1.Api.prototype.send_ = function(buffer) {
  if (!this.device) {
    return;
  }
  this.device.send(buffer);
};


/**
 * @param {Object} data
 * @private
 */
cwc.protocol.sphero.v1.Api.prototype.updateLocationData_ = function(data) {
  let xpos = cwc.utils.ByteTools.signedBytesToInt([data[0], data[1]]);
  let ypos = cwc.utils.ByteTools.signedBytesToInt([data[2], data[3]]);
  let xvel = cwc.utils.ByteTools.signedBytesToInt([data[4], data[5]]);
  let yvel = cwc.utils.ByteTools.signedBytesToInt([data[6], data[7]]);
  let speed = cwc.utils.ByteTools.bytesToInt([data[8], data[9]]);

  if (xpos != this.locationPosX_ || ypos != this.locationPosY_) {
    this.locationPosX_ = xpos;
    this.locationPosY_ = ypos;
    this.eventHandler.dispatchEvent(
      cwc.protocol.sphero.v1.Events.locationData({x: xpos, y: ypos}));
  }

  if (xvel != this.locationVelX_ || yvel != this.locationVelY_) {
    this.locationVelX_ = xvel;
    this.locationVelY_ = yvel;
    this.eventHandler.dispatchEvent(
      cwc.protocol.sphero.v1.Events.velocityData({x: xvel, y: yvel}));
  }

  if (speed != this.locationSpeed_) {
    this.locationSpeed_ = speed;
    this.eventHandler.dispatchEvent(
      cwc.protocol.sphero.v1.Events.speedValue(speed));
  }
};


/**
 * @param {Object} data
 * @private
 */
cwc.protocol.sphero.v1.Api.prototype.parseCollisionData_ = function(data) {
  let x = cwc.utils.ByteTools.signedBytesToInt([data[0], data[1]]);
  let y = cwc.utils.ByteTools.signedBytesToInt([data[2], data[3]]);
  let z = cwc.utils.ByteTools.signedBytesToInt([data[4], data[5]]);
  let axis = data[6] == 0x01 ? 'y' : 'x';
  let xMagnitude = cwc.utils.ByteTools.signedBytesToInt([data[7], data[8]]);
  let yMagnitude = cwc.utils.ByteTools.signedBytesToInt([data[9], data[10]]);
  let speed = data[11];
  this.eventHandler.dispatchEvent(
    cwc.protocol.sphero.v1.Events.collision({
      x: x,
      y: y,
      z: z,
      axis: axis,
      magnitude: {
        x: xMagnitude,
        y: yMagnitude,
      },
      speed: speed,
    }));
};


/**
 * @param {!Array} buffer
 * @private
 */
cwc.protocol.sphero.v1.Api.prototype.handleData_ = function(buffer) {
  if (!this.verifiyChecksum_(buffer)) {
    console.error('Checksum error ...');
    return;
  }
  console.log('handleData', buffer, buffer[3]);
};


/**
 * Handles received data and callbacks from the Bluetooth socket.
 * @param {!Array} buffer
 * @private
 */
cwc.protocol.sphero.v1.Api.prototype.handleAcknowledged_ = function(buffer) {
  if (!this.verifiyChecksum_(buffer)) {
    return;
  }
  let type = buffer[3];
  let len = buffer[4];
  let data = buffer.slice(5, buffer.length -1);
  switch (type) {
    case cwc.protocol.sphero.v1.CallbackType.RGB:
      console.log('RGB:', data[0], data[1], data[2]);
      break;
    case cwc.protocol.sphero.v1.CallbackType.LOCATION:
      this.updateLocationData_(data);
      break;
    default:
      console.log('Received type', type, 'with', len,
        ' bytes of unknown data:', data);
  }
};


/**
 * Handles async packets from the Bluetooth socket.
 * @param {!Array} buffer
 * @private
 */
cwc.protocol.sphero.v1.Api.prototype.handleAsync_ = function(buffer) {
  if (!this.verifiyChecksum_(buffer)) {
    return;
  }
  let message = buffer[2];
  let len = buffer[4];
  let data = buffer.slice(5, buffer.length -1);
  switch (message) {
    case cwc.protocol.sphero.v1.MessageType.COLLISION_DETECTED:
      this.parseCollisionData_(data);
      break;
    default:
      console.log('Received message', message, 'with', len,
        ' bytes of unknown data:', data);
  }
};


/**
 * @param {!Array} buffer
 * @param {Number=} checksum
 * @return {!boolean}
 * @private
 */
cwc.protocol.sphero.v1.Api.prototype.verifiyChecksum_ = function(buffer,
    checksum) {
  let bufferChecksum = 0;
  let bufferLength = buffer.length -1;
  if (!checksum) {
    checksum = buffer[bufferLength];
  }
  for (let i = 2; i < bufferLength; i++) {
    bufferChecksum += buffer[i];
  }

  return (checksum === (bufferChecksum % 256) ^ 0xFF) ? true : false;
};
