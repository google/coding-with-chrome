/**
 * @fileoverview Byte commands for the mBot communication.
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
goog.provide('cwc.protocol.makeblock.mbotRanger.Commands');

goog.require('cwc.protocol.makeblock.mbotRanger.Buffer');
goog.require('cwc.protocol.makeblock.mbotRanger.Action');
goog.require('cwc.protocol.makeblock.mbotRanger.Device');
goog.require('cwc.protocol.makeblock.mbotRanger.Header');
goog.require('cwc.protocol.makeblock.mbotRanger.IndexType');
goog.require('cwc.protocol.makeblock.mbotRanger.Port');
goog.require('cwc.protocol.makeblock.mbotRanger.Slot');



/**
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.makeblock.mbotRanger.Commands = function() {
  /** @private {Object} */
  this.cache_ = {};
};


/**
 * Sets RGB LED color on the top of the mbot.
 * @param {!number} red 0-255
 * @param {!number} green 0-255
 * @param {!number} blue 0-255
 * @param {!number} opt_index 0 or 1 - 12
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Commands.prototype.setRGBLED = function(red,
    green, blue, opt_index) {
  var buffer = new cwc.protocol.makeblock.mbotRanger.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mbotRanger.IndexType.NONE);
  buffer.writeAction(cwc.protocol.makeblock.mbotRanger.Action.RUN);
  buffer.writeDevice(cwc.protocol.makeblock.mbotRanger.Device.RGBLED);
  buffer.writePort(cwc.protocol.makeblock.mbotRanger.Port.AUTO);
  buffer.writeSlot(cwc.protocol.makeblock.mbotRanger.Slot.AUTO);
  buffer.writeByte(opt_index || 0x00);
  buffer.writeByte(red);
  buffer.writeByte(green);
  buffer.writeByte(blue);
  return buffer.readSigned();
};


/**
 * Plays a tone through mBot's buzzer
 * @param {!number} frequency Frequency of the tone to play
 * @param {!number} duration Duration of the tone, in ms
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Commands.prototype.playTone = function(
    frequency, duration) {
  var buffer = new cwc.protocol.makeblock.mbotRanger.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mbotRanger.IndexType.NONE);
  buffer.writeAction(cwc.protocol.makeblock.mbotRanger.Action.RUN);
  buffer.writeDevice(cwc.protocol.makeblock.mbotRanger.Device.TONE);
  buffer.writePort(cwc.protocol.makeblock.mbotRanger.Port.TONE);
  buffer.writeShort(frequency);
  buffer.writeShort(duration);
  return buffer.readSigned();
};


/**
 * Sets motor power
 * @param {!number} power (0-255)
 * @param {number=} opt_slot
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Commands.prototype.setMotorPower = function(
    power, opt_slot) {
  var buffer = new cwc.protocol.makeblock.mbotRanger.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mbotRanger.IndexType.NONE);
  buffer.writeAction(cwc.protocol.makeblock.mbotRanger.Action.RUN);
  buffer.writeDevice(cwc.protocol.makeblock.mbotRanger.Device.ENCODER);
  buffer.writePort(cwc.protocol.makeblock.mbotRanger.Port.AUTO);
  buffer.writeSlot(opt_slot, cwc.protocol.makeblock.mbotRanger.Slot.ONE);
  buffer.writeShort(power);
  return buffer.readSigned();
};


/**
 * Reads out the current ultrasonic sensor value.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Commands.prototype.readUltrasonicSensor =
function() {
  var buffer = new cwc.protocol.makeblock.mbotRanger.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mbotRanger.IndexType.ULTRASONIC);
  buffer.writeAction(cwc.protocol.makeblock.mbotRanger.Action.GET);
  buffer.writeDevice(cwc.protocol.makeblock.mbotRanger.Device.ULTRASONIC);
  buffer.writePort(cwc.protocol.makeblock.mbotRanger.Port.ULTRASONIC);
  return buffer.readSigned();
};


/**
 * Reads out the current light sensor value.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Commands.prototype.readLightSensor = function(
) {
  var buffer = new cwc.protocol.makeblock.mbotRanger.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mbotRanger.IndexType.LIGHTSENSOR);
  buffer.writeAction(cwc.protocol.makeblock.mbotRanger.Action.GET);
  buffer.writeDevice(cwc.protocol.makeblock.mbotRanger.Device.LIGHTSENSOR);
  buffer.writePort(cwc.protocol.makeblock.mbotRanger.Port.LIGHTSENSOR);
  return buffer.readSigned();
};


/**
 * Reads out the current line follower sensor value.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Commands.prototype.readLineFollowerSensor =
function() {
  var buffer = new cwc.protocol.makeblock.mbotRanger.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mbotRanger.IndexType.LINEFOLLOWER);
  buffer.writeAction(cwc.protocol.makeblock.mbotRanger.Action.GET);
  buffer.writeDevice(cwc.protocol.makeblock.mbotRanger.Device.LINEFOLLOWER);
  buffer.writePort(cwc.protocol.makeblock.mbotRanger.Port.LINEFOLLOWER);
  return buffer.readSigned();
};


/**
 * Gets current firmware version.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Commands.prototype.getVersion = function() {
  var buffer = new cwc.protocol.makeblock.mbotRanger.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mbotRanger.IndexType.VERSION);
  buffer.writeAction(cwc.protocol.makeblock.mbotRanger.Action.GET);
  buffer.writeDevice(cwc.protocol.makeblock.mbotRanger.Device.VERSION);
  return buffer.readSigned();
};


/**
 * Resets the mBot.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Commands.prototype.reset = function() {
  var buffer = new cwc.protocol.makeblock.mbotRanger.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mbotRanger.IndexType.NONE);
  buffer.writeAction(cwc.protocol.makeblock.mbotRanger.Action.RESET);
  return buffer.readSigned();
};


/**
 * Starts the mBot.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Commands.prototype.start = function() {
  var buffer = new cwc.protocol.makeblock.mbotRanger.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mbotRanger.IndexType.NONE);
  buffer.writeAction(cwc.protocol.makeblock.mbotRanger.Action.START);
  return buffer.readSigned();
};
