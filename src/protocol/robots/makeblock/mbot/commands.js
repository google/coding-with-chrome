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
goog.require('cwc.protocol.makeblock.mbot.CallbackType');
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
 * @param {!number} index 0 for all lights; 1 for left, 2 for right
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbot.Commands.prototype.setRGBLED = function(red, green,
    blue, index = 0x00) {
  return new cwc.protocol.makeblock.mbot.Buffer()
    .writeCallback(cwc.protocol.makeblock.mbot.CallbackType.NONE)
    .writeType(cwc.protocol.makeblock.mbot.CommandType.RUN)
    .writeDevice(cwc.protocol.makeblock.mbot.Device.LEDLIGHT)
    .writePort(cwc.protocol.makeblock.mbot.Port.LED_LIGHT)
    .writeByte(cwc.protocol.makeblock.mbot.Slot.LED_LIGHT)
    .writeByte(index)
    .writeByte(red)
    .writeByte(green)
    .writeByte(blue)
    .readSigned();
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
  return new cwc.protocol.makeblock.mbot.Buffer()
    .writeCallback(cwc.protocol.makeblock.mbot.CallbackType.NONE)
    .writeType(cwc.protocol.makeblock.mbot.CommandType.RUN)
    .writeDevice(cwc.protocol.makeblock.mbot.Device.BUZZER)
    .writeShort(frequency)
    .writeShort(duration)
    .readSigned();
};


/**
 * Sets motor power
 * @param {!number} power (0-255)
 * @param {cwc.protocol.makeblock.mbot.Port=} port
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbot.Commands.prototype.setMotorPower = function(power,
    port = cwc.protocol.makeblock.mbot.Port.RIGHT_MOTOR) {
  return new cwc.protocol.makeblock.mbot.Buffer()
    .writeCallback(cwc.protocol.makeblock.mbot.CallbackType.NONE)
    .writeType(cwc.protocol.makeblock.mbot.CommandType.RUN)
    .writeDevice(cwc.protocol.makeblock.mbot.Device.DCMOTOR)
    .writePort(port)
    .writeShort(power)
    .readSigned();
};


/**
 * Reads out the current ultrasonic sensor value.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbot.Commands.prototype.readUltrasonicSensor = function(
) {
  return new cwc.protocol.makeblock.mbot.Buffer()
    .writeCallback(cwc.protocol.makeblock.mbot.CallbackType.ULTRASONIC)
    .writeType(cwc.protocol.makeblock.mbot.CommandType.GET)
    .writeDevice(cwc.protocol.makeblock.mbot.Device.ULTRASONIC)
    .writePort(cwc.protocol.makeblock.mbot.Port.ULTRASONIC)
    .readSigned();
};


/**
 * Reads out the current light sensor value.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbot.Commands.prototype.readLightSensor = function() {
  return new cwc.protocol.makeblock.mbot.Buffer()
    .writeCallback(cwc.protocol.makeblock.mbot.CallbackType.LIGHTSENSOR)
    .writeType(cwc.protocol.makeblock.mbot.CommandType.GET)
    .writeDevice(cwc.protocol.makeblock.mbot.Device.LIGHTSENSOR)
    .writePort(cwc.protocol.makeblock.mbot.Port.LIGHTSENSOR)
    .readSigned();
};


/**
 * Reads out the current line follower sensor value.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbot.Commands.prototype.readLineFollowerSensor =
function() {
  return new cwc.protocol.makeblock.mbot.Buffer()
    .writeCallback(cwc.protocol.makeblock.mbot.CallbackType.LINEFOLLOWER)
    .writeType(cwc.protocol.makeblock.mbot.CommandType.GET)
    .writeDevice(cwc.protocol.makeblock.mbot.Device.LINEFOLLOWER)
    .writePort(cwc.protocol.makeblock.mbot.Port.LINEFOLLOWER)
    .readSigned();
};


/**
 * Gets current firmware version.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbot.Commands.prototype.getVersion = function() {
  return new cwc.protocol.makeblock.mbot.Buffer()
    .writeCallback(cwc.protocol.makeblock.mbot.CallbackType.VERSION)
    .writeType(cwc.protocol.makeblock.mbot.CommandType.GET)
    .writeDevice(cwc.protocol.makeblock.mbot.Device.VERSION)
    .readSigned();
};


/**
 * Resets the mBot.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbot.Commands.prototype.reset = function() {
  return new cwc.protocol.makeblock.mbot.Buffer()
    .writeCallback(cwc.protocol.makeblock.mbot.CallbackType.NONE)
    .writeType(cwc.protocol.makeblock.mbot.CommandType.RESET)
    .readSigned();
};


/**
 * Starts the mBot.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mbot.Commands.prototype.start = function() {
  return new cwc.protocol.makeblock.mbot.Buffer()
    .writeCallback(cwc.protocol.makeblock.mbot.CallbackType.NONE)
    .writeType(cwc.protocol.makeblock.mbot.CommandType.START)
    .readSigned();
};
