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
goog.provide('cwc.protocol.makeblock.mbot.Commands');

goog.require('cwc.protocol.makeblock.mbot.Buffer');
goog.require('cwc.protocol.makeblock.mbot.CommandType');
goog.require('cwc.protocol.makeblock.mbot.Device');
goog.require('cwc.protocol.makeblock.mbot.Header');
goog.require('cwc.protocol.makeblock.mbot.IndexType');
goog.require('cwc.protocol.makeblock.mbot.Port');
goog.require('cwc.protocol.makeblock.mbot.Slot');


/**
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.makeblock.mbot.Commands = function() {
  /** @private {Object} */
  this.cache_ = {};
};


/**
 * Sets RGB LED color on the top of the mbot.
 * @param {!number} red 0-255
 * @param {!number} green 0-255
 * @param {!number} blue 0-255
 * @param {!number} opt_index   0 for all lights; 1 for left, 2 for right
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbot.Commands.prototype.setRGBLED = function(red, green,
    blue, opt_index) {
  let buffer = new cwc.protocol.makeblock.mbot.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mbot.IndexType.NONE);
  buffer.writeType(cwc.protocol.makeblock.mbot.CommandType.RUN);
  buffer.writeDevice(cwc.protocol.makeblock.mbot.Device.LEDLIGHT);
  buffer.writePort(cwc.protocol.makeblock.mbot.Port.LED_LIGHT);
  buffer.writeByte(cwc.protocol.makeblock.mbot.Slot.LED_LIGHT);
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
cwc.protocol.makeblock.mbot.Commands.prototype.playTone = function(frequency,
    duration) {
  let buffer = new cwc.protocol.makeblock.mbot.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mbot.IndexType.NONE);
  buffer.writeType(cwc.protocol.makeblock.mbot.CommandType.RUN);
  buffer.writeDevice(cwc.protocol.makeblock.mbot.Device.BUZZER);
  buffer.writeShort(frequency);
  buffer.writeShort(duration);
  return buffer.readSigned();
};


/**
 * Sets motor power
 * @param {!number} power (0-255)
 * @param {number=} opt_port
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbot.Commands.prototype.setMotorPower = function(power,
    opt_port) {
  let buffer = new cwc.protocol.makeblock.mbot.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mbot.IndexType.NONE);
  buffer.writeType(cwc.protocol.makeblock.mbot.CommandType.RUN);
  buffer.writeDevice(cwc.protocol.makeblock.mbot.Device.DCMOTOR);
  buffer.writePort(opt_port || cwc.protocol.makeblock.mbot.Port.RIGHT_MOTOR);
  buffer.writeShort(power);
  return buffer.readSigned();
};


/**
 * Reads out the current ultrasonic sensor value.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbot.Commands.prototype.readUltrasonicSensor = function(
) {
  let buffer = new cwc.protocol.makeblock.mbot.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mbot.IndexType.ULTRASONIC);
  buffer.writeType(cwc.protocol.makeblock.mbot.CommandType.GET);
  buffer.writeDevice(cwc.protocol.makeblock.mbot.Device.ULTRASONIC);
  buffer.writePort(cwc.protocol.makeblock.mbot.Port.ULTRASONIC);
  return buffer.readSigned();
};


/**
 * Reads out the current light sensor value.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbot.Commands.prototype.readLightSensor = function() {
  let buffer = new cwc.protocol.makeblock.mbot.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mbot.IndexType.LIGHTSENSOR);
  buffer.writeType(cwc.protocol.makeblock.mbot.CommandType.GET);
  buffer.writeDevice(cwc.protocol.makeblock.mbot.Device.LIGHTSENSOR);
  buffer.writePort(cwc.protocol.makeblock.mbot.Port.LIGHTSENSOR);
  return buffer.readSigned();
};


/**
 * Reads out the current line follower sensor value.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbot.Commands.prototype.readLineFollowerSensor =
function() {
  let buffer = new cwc.protocol.makeblock.mbot.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mbot.IndexType.LINEFOLLOWER);
  buffer.writeType(cwc.protocol.makeblock.mbot.CommandType.GET);
  buffer.writeDevice(cwc.protocol.makeblock.mbot.Device.LINEFOLLOWER);
  buffer.writePort(cwc.protocol.makeblock.mbot.Port.LINEFOLLOWER);
  return buffer.readSigned();
};


/**
 * Gets current firmware version.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbot.Commands.prototype.getVersion = function() {
  let buffer = new cwc.protocol.makeblock.mbot.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mbot.IndexType.VERSION);
  buffer.writeType(cwc.protocol.makeblock.mbot.CommandType.GET);
  buffer.writeDevice(cwc.protocol.makeblock.mbot.Device.VERSION);
  return buffer.readSigned();
};


/**
 * Resets the mBot.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbot.Commands.prototype.reset = function() {
  let buffer = new cwc.protocol.makeblock.mbot.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mbot.IndexType.NONE);
  buffer.writeType(cwc.protocol.makeblock.mbot.CommandType.RESET);
  return buffer.readSigned();
};


/**
 * Starts the mBot.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbot.Commands.prototype.start = function() {
  let buffer = new cwc.protocol.makeblock.mbot.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mbot.IndexType.NONE);
  buffer.writeType(cwc.protocol.makeblock.mbot.CommandType.START);
  return buffer.readSigned();
};
