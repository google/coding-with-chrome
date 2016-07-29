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
  var buffer = new cwc.protocol.sphero.Buffer();
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
  var buffer = new cwc.protocol.sphero.Buffer(
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
  var buffer = new cwc.protocol.sphero.Buffer();
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
  var buffer = new cwc.protocol.sphero.Buffer();
  buffer.writeCommand(cwc.protocol.sphero.Command.HEADING);
  buffer.writeUInt(heading);
  return buffer.readSigned();
};


/**
 * Rolls the Sphero.
 * @param {number} opt_speed 0-255
 * @param {number=} opt_heading 0-359
 * @param {boolean=} opt_state
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.Commands.prototype.roll = function(opt_speed, opt_heading,
    opt_state) {
  var buffer = new cwc.protocol.sphero.Buffer();
  buffer.writeCommand(cwc.protocol.sphero.Command.ROLL);
  buffer.writeByte(opt_speed, 50);
  buffer.writeUInt(opt_heading, 0);
  buffer.writeByte(opt_state === undefined ? 0x01 : (opt_state ? 0x01 : 0x00));
  return buffer.readSigned();
};


/**
 * Sets collision detection.
 * @param {number=} opt_method 0x00 to disable this service.
 * @param {number=} opt_threshold_x left/right axes
 * @param {number=} opt_threshold_y front/back axes
 * @param {number=} opt_speed_x
 * @param {number=} opt_speed_y
 * @param {number=} opt_interval in 10msec
 * @export
 */
cwc.protocol.sphero.Commands.prototype.setColisionDetection = function(
    opt_method, opt_threshold_x, opt_threshold_y, opt_speed_x, opt_speed_y,
    opt_interval) {
  var buffer = new cwc.protocol.sphero.Buffer();
  buffer.writeCommand(cwc.protocol.sphero.Command.COLLISION_DETECTION);
  buffer.writeByte(opt_method, 0x01);
  buffer.writeByte(opt_threshold_x, 0x60);
  buffer.writeByte(opt_threshold_y, 0x60);
  buffer.writeByte(opt_speed_x, 0x60);
  buffer.writeByte(opt_speed_y, 0x60);
  buffer.writeByte(opt_interval, 0x0A);
  return buffer.readSigned();
};


/**
 * Sets montion timeout.
 * @param {!number} timeout in msec
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.Commands.prototype.setMotionTimeout = function(timeout) {
  var buffer = new cwc.protocol.sphero.Buffer();
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
  var buffer = new cwc.protocol.sphero.Buffer();
  buffer.writeCommand(cwc.protocol.sphero.Command.BOOST);
  buffer.writeByte(enabled ? 0x01 : 0x00);
  return buffer.readSigned();
};


/**
 * Puts the Sphero into sleep.
 * @param {number=} opt_wakeup
 * @param {number=} opt_macro
 * @param {number=} opt_orb_basic
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.Commands.prototype.sleep = function(opt_wakeup, opt_macro,
    opt_orb_basic) {
  var buffer = new cwc.protocol.sphero.Buffer();
  buffer.writeCommand(cwc.protocol.sphero.Command.SYSTEM.SLEEP);
  buffer.writeByte(opt_wakeup, 0x00);
  buffer.writeByte(opt_macro, 0x00);
  buffer.writeByte(opt_orb_basic, 0x00);
  return buffer.readSigned();
};


/**
 * Reads the current Sphero location.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.Commands.prototype.getLocation = function() {
  var buffer = new cwc.protocol.sphero.Buffer(
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
  var buffer = new cwc.protocol.sphero.Buffer(
      cwc.protocol.sphero.CallbackType.FIRMWARE);
  buffer.writeCommand(cwc.protocol.sphero.Command.SYSTEM.VERSION);
  return buffer.readSigned();
};
