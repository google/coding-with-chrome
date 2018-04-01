/**
 * @fileoverview Byte commands for the Sphero Classic communication.
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
goog.provide('cwc.protocol.sphero.classic.Commands');

goog.require('cwc.protocol.sphero.classic.Buffer');
goog.require('cwc.protocol.sphero.classic.CallbackType');
goog.require('cwc.protocol.sphero.classic.Command');


/**
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.sphero.classic.Commands = function() {};


/**
 * Sets RGB LED color.
 * @param {!number} red 0-255
 * @param {!number} green 0-255
 * @param {!number} blue 0-255
 * @param {boolean=} persistent
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.classic.Commands.prototype.setRGB = function(red, green,
    blue, persistent = false) {
  return new cwc.protocol.sphero.classic.Buffer()
    .setCommand(cwc.protocol.sphero.classic.Command.RGB_LED.SET)
    .writeByte(red)
    .writeByte(green)
    .writeByte(blue)
    .writeByte(persistent == false ? 0x00 : 0x01)
    .readSigned();
};


/**
 * Gets current RGB LED color.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.classic.Commands.prototype.getRGB = function() {
  return new cwc.protocol.sphero.classic.Buffer()
    .setCallback(cwc.protocol.sphero.classic.CallbackType.RGB)
    .setCommand(cwc.protocol.sphero.classic.Command.RGB_LED.GET)
    .readSigned();
};


/**
 * Sets back-light LED brightness.
 * @param {!number} brightness 0-255
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.classic.Commands.prototype.setBackLed = function(
    brightness) {
  return new cwc.protocol.sphero.classic.Buffer()
    .setCommand(cwc.protocol.sphero.classic.Command.BACK_LED)
    .writeByte(brightness)
    .readSigned();
};


/**
 * Sets heading.
 * @param {!number} heading 0-359
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.classic.Commands.prototype.setHeading = function(heading) {
  return new cwc.protocol.sphero.classic.Buffer()
    .setCommand(cwc.protocol.sphero.classic.Command.HEADING)
    .writeUInt16(heading)
    .readSigned();
};


/**
 * Rolls the Sphero.
 * @param {number} speed 0-255
 * @param {number=} heading 0-359
 * @param {boolean=} state
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.classic.Commands.prototype.roll = function(speed = 50,
    heading = 0, state = undefined) {
  return new cwc.protocol.sphero.classic.Buffer()
    .setCommand(cwc.protocol.sphero.classic.Command.ROLL)
    .writeByte(speed)
    .writeUInt16(heading)
    .writeByte(state === undefined ? 0x01 : (state ? 0x01 : 0x00))
    .readSigned();
};


/**
 * Sets collision detection.
 * @param {number=} method 0x00 to disable this service.
 * @param {number=} thresholdX left/right axes
 * @param {number=} thresholdY front/back axes
 * @param {number=} speedX
 * @param {number=} speedY
 * @param {number=} interval in 10msec
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.classic.Commands.prototype.setColisionDetection = function(
    method = 0x01, thresholdX = 0x60, thresholdY = 0x60, speedX = 0x60,
    speedY = 0x60, interval = 0x0A) {
  return new cwc.protocol.sphero.classic.Buffer()
    .setCommand(cwc.protocol.sphero.classic.Command.COLLISION_DETECTION)
    .writeByte(method)
    .writeByte(thresholdX)
    .writeByte(thresholdY)
    .writeByte(speedX)
    .writeByte(speedY)
    .writeByte(interval)
    .readSigned();
};


/**
 * Sets montion timeout.
 * @param {!number} timeout in msec
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.classic.Commands.prototype.setMotionTimeout = function(
    timeout) {
  return new cwc.protocol.sphero.classic.Buffer()
    .setCommand(cwc.protocol.sphero.classic.Command.MOTION_TIMEOUT)
    .writeByte(timeout)
    .readSigned();
};


/**
 * @param {!boolean} enabled
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.classic.Commands.prototype.boost = function(enabled) {
  return new cwc.protocol.sphero.classic.Buffer()
    .setCommand(cwc.protocol.sphero.classic.Command.BOOST)
    .writeByte(enabled ? 0x01 : 0x00)
    .readSigned();
};


/**
 * Puts the Sphero into sleep.
 * @param {number=} wakeup
 * @param {number=} macro
 * @param {number=} orb_basic
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.classic.Commands.prototype.sleep = function(wakeup = 0x00,
    macro = 0x00, orb_basic = 0x00) {
  return new cwc.protocol.sphero.classic.Buffer()
    .setCommand(cwc.protocol.sphero.classic.Command.SYSTEM.SLEEP)
    .writeByte(wakeup)
    .writeByte(macro)
    .writeByte(orb_basic)
    .readSigned();
};


/**
 * Reads the current Sphero location.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.classic.Commands.prototype.getLocation = function() {
  return new cwc.protocol.sphero.classic.Buffer()
    .setCallback(cwc.protocol.sphero.classic.CallbackType.LOCATION)
    .setCommand(cwc.protocol.sphero.classic.Command.LOCATION.GET)
    .readSigned();
};


/**
 * Reads current Sphero version.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.sphero.classic.Commands.prototype.getVersion = function() {
  return new cwc.protocol.sphero.classic.Buffer()
    .setCallback(cwc.protocol.sphero.classic.CallbackType.VERSION)
    .setCommand(cwc.protocol.sphero.classic.Command.SYSTEM.VERSION)
    .readSigned();
};
