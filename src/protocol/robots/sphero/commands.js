/**
 * @fileoverview Byte commands for the Sphero communication.
 *
 * @license Copyright 2016 The Coding with Chrome Authors.
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
goog.provide('cwc.protocol.sphero.Commands');

goog.require('cwc.protocol.sphero.Buffer');
goog.require('cwc.protocol.sphero.CallbackType');
goog.require('cwc.protocol.sphero.Command');


/**
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.sphero.Commands = function() {
  /** @private {Object} */
  this.cache_ = {};
};


/**
 * Sets RGB LED color.
 * @param {!number} red 0-255
 * @param {!number} green 0-255
 * @param {!number} blue 0-255
 * @param {boolean=} opt_persistant
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.Commands.prototype.setRGB = function(red, green, blue,
    opt_persistant) {
  let buffer = new cwc.protocol.sphero.Buffer();
  buffer.writeCommand(cwc.protocol.sphero.Command.RGB_LED.SET);
  buffer.writeByte(red);
  buffer.writeByte(green);
  buffer.writeByte(blue);
  buffer.writeByte(opt_persistant == false ? 0x00 : 0x01);
  return buffer.readSigned();
};


/**
 * Gets current RGB LED color.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.Commands.prototype.getRGB = function() {
  let buffer = new cwc.protocol.sphero.Buffer(
    cwc.protocol.sphero.CallbackType.RGB);
  buffer.writeCommand(cwc.protocol.sphero.Command.RGB_LED.GET);
  return buffer.readSigned();
};


/**
 * Sets back-light LED brightness.
 * @param {!number} brightness 0-255
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.Commands.prototype.setBackLed = function(brightness) {
  let buffer = new cwc.protocol.sphero.Buffer();
  buffer.writeCommand(cwc.protocol.sphero.Command.BACK_LED);
  buffer.writeByte(brightness);
  return buffer.readSigned();
};


/**
 * Sets heading.
 * @param {!number} heading 0-359
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.Commands.prototype.setHeading = function(heading) {
  let buffer = new cwc.protocol.sphero.Buffer();
  buffer.writeCommand(cwc.protocol.sphero.Command.HEADING);
  buffer.writeUInt(heading);
  return buffer.readSigned();
};


/**
 * Rolls the Sphero.
 * @param {number} speed 0-255
 * @param {number=} heading 0-359
 * @param {boolean=} state
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.Commands.prototype.roll = function(speed = 50, heading = 0,
    state = undefined) {
  let buffer = new cwc.protocol.sphero.Buffer();
  buffer.writeCommand(cwc.protocol.sphero.Command.ROLL);
  buffer.writeByte(speed);
  buffer.writeUInt(heading);
  buffer.writeByte(state === undefined ? 0x01 : (state ? 0x01 : 0x00));
  return buffer.readSigned();
};


/**
 * Sets collision detection.
 * @param {number=} method 0x00 to disable this service.
 * @param {number=} threshold_x left/right axes
 * @param {number=} threshold_y front/back axes
 * @param {number=} speed_x
 * @param {number=} speed_y
 * @param {number=} interval in 10msec
 * @return {!cwc.protocol.sphero.Buffer}
 * @export
 */
cwc.protocol.sphero.Commands.prototype.setColisionDetection = function(
    method = 0x01, threshold_x = 0x60, threshold_y = 0x60, speed_x = 0x60,
    speed_y = 0x60, interval = 0x0A) {
  let buffer = new cwc.protocol.sphero.Buffer();
  buffer.writeCommand(cwc.protocol.sphero.Command.COLLISION_DETECTION);
  buffer.writeByte(method);
  buffer.writeByte(threshold_x);
  buffer.writeByte(threshold_y);
  buffer.writeByte(speed_x);
  buffer.writeByte(speed_y);
  buffer.writeByte(interval);
  return buffer.readSigned();
};


/**
 * Sets montion timeout.
 * @param {!number} timeout in msec
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.Commands.prototype.setMotionTimeout = function(timeout) {
  let buffer = new cwc.protocol.sphero.Buffer();
  buffer.writeCommand(cwc.protocol.sphero.Command.MOTION_TIMEOUT);
  buffer.writeByte(timeout);
  return buffer.readSigned();
};


/**
 * @param {!boolean} enabled
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.Commands.prototype.boost = function(enabled) {
  let buffer = new cwc.protocol.sphero.Buffer();
  buffer.writeCommand(cwc.protocol.sphero.Command.BOOST);
  buffer.writeByte(enabled ? 0x01 : 0x00);
  return buffer.readSigned();
};


/**
 * Puts the Sphero into sleep.
 * @param {number=} wakeup
 * @param {number=} macro
 * @param {number=} orb_basic
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.Commands.prototype.sleep = function(wakeup = 0x00,
    macro = 0x00, orb_basic = 0x00) {
  let buffer = new cwc.protocol.sphero.Buffer();
  buffer.writeCommand(cwc.protocol.sphero.Command.SYSTEM.SLEEP);
  buffer.writeByte(wakeup);
  buffer.writeByte(macro);
  buffer.writeByte(orb_basic);
  return buffer.readSigned();
};


/**
 * Reads the current Sphero location.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.Commands.prototype.getLocation = function() {
  let buffer = new cwc.protocol.sphero.Buffer(
      cwc.protocol.sphero.CallbackType.LOCATION);
  buffer.writeCommand(cwc.protocol.sphero.Command.LOCATION.GET);
  return buffer.readSigned();
};


/**
 * Reads current Sphero version.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.Commands.prototype.getVersion = function() {
  let buffer = new cwc.protocol.sphero.Buffer(
      cwc.protocol.sphero.CallbackType.FIRMWARE);
  buffer.writeCommand(cwc.protocol.sphero.Command.SYSTEM.VERSION);
  return buffer.readSigned();
};
