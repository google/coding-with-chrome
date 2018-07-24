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
goog.provide('cwc.protocol.makeblock.mBotRanger.Commands');

goog.require('cwc.protocol.makeblock.mBotRanger.Buffer');
goog.require('cwc.protocol.makeblock.mBotRanger.Action');
goog.require('cwc.protocol.makeblock.mBotRanger.Device');
goog.require('cwc.protocol.makeblock.mBotRanger.Header');
goog.require('cwc.protocol.makeblock.mBotRanger.IndexType');
goog.require('cwc.protocol.makeblock.mBotRanger.Port');
goog.require('cwc.protocol.makeblock.mBotRanger.Slot');


/**
 * Sets RGB LED color on the top of the mbot.
 * @param {number} red 0-255
 * @param {number} green 0-255
 * @param {number} blue 0-255
 * @param {number=} index 0 or 1 - 12
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mBotRanger.Commands.setRGBLED = function(red = 0,
    green = 0, blue = 0, index = 0x00) {
  let buffer = new cwc.protocol.makeblock.mBotRanger.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mBotRanger.IndexType.NONE);
  buffer.writeAction(cwc.protocol.makeblock.mBotRanger.Action.RUN);
  buffer.writeDevice(cwc.protocol.makeblock.mBotRanger.Device.RGBLED);
  buffer.writePort(cwc.protocol.makeblock.mBotRanger.Port.AUTO);
  buffer.writeSlot(cwc.protocol.makeblock.mBotRanger.Slot.AUTO);
  buffer.writeByte(index);
  buffer.writeByte(red);
  buffer.writeByte(green);
  buffer.writeByte(blue);
  return buffer.readSigned();
};


/**
 * Plays a tone through mBot's buzzer
 * @param {number} frequency Frequency of the tone to play
 * @param {number} duration Duration of the tone, in ms
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mBotRanger.Commands.playTone = function(
    frequency, duration) {
  let buffer = new cwc.protocol.makeblock.mBotRanger.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mBotRanger.IndexType.NONE);
  buffer.writeAction(cwc.protocol.makeblock.mBotRanger.Action.RUN);
  buffer.writeDevice(cwc.protocol.makeblock.mBotRanger.Device.TONE);
  buffer.writePort(cwc.protocol.makeblock.mBotRanger.Port.TONE);
  buffer.writeShort(frequency);
  buffer.writeShort(duration);
  return buffer.readSigned();
};


/**
 * Sets motor power
 * @param {number} power (0-255)
 * @param {cwc.protocol.makeblock.mBotRanger.Slot=} slot
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mBotRanger.Commands.movePower = function(
    power, slot = cwc.protocol.makeblock.mBotRanger.Slot.ONE) {
  let buffer = new cwc.protocol.makeblock.mBotRanger.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mBotRanger.IndexType.NONE);
  buffer.writeAction(cwc.protocol.makeblock.mBotRanger.Action.RUN);
  buffer.writeDevice(cwc.protocol.makeblock.mBotRanger.Device.ENCODER_BOARD);
  buffer.writePort(cwc.protocol.makeblock.mBotRanger.Port.ENCODER_BOARD_SPEED);
  buffer.writeSlot(slot);
  buffer.writeShort(power);
  return buffer.readSigned();
};


/**
 * Rotates the motor for the given steps.
 * @param {number} steps (−32768 - 32.767)
 * @param {number=} power (0-255)
 * @param {cwc.protocol.makeblock.mBotRanger.Slot=} slot
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mBotRanger.Commands.moveSteps = function(steps,
    power = 130, slot = cwc.protocol.makeblock.mBotRanger.Slot.ONE) {
  let buffer = new cwc.protocol.makeblock.mBotRanger.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mBotRanger.IndexType.NONE);
  buffer.writeAction(cwc.protocol.makeblock.mBotRanger.Action.RUN);
  buffer.writeDevice(cwc.protocol.makeblock.mBotRanger.Device.ENCODER_BOARD);
  buffer.writePort(cwc.protocol.makeblock.mBotRanger.Port.ENCODER_BOARD_POS);
  buffer.writeSlot(slot);
  buffer.writeInt(steps);
  buffer.writeShort(power);
  return buffer.readSigned();
};


/**
 * Reads out the sensor value.
 * @param {!cwc.protocol.makeblock.mBotRanger.IndexType} indexType
 * @param {!cwc.protocol.makeblock.mBotRanger.Device} device
 * @param {!cwc.protocol.makeblock.mBotRanger.Port} port
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mBotRanger.Commands.getSensorData = function(indexType,
    device, port) {
  let buffer = new cwc.protocol.makeblock.mBotRanger.Buffer();
  buffer.writeIndex(indexType);
  buffer.writeAction(cwc.protocol.makeblock.mBotRanger.Action.GET);
  buffer.writeDevice(device);
  buffer.writePort(port);
  return buffer.readSigned();
};


/**
 * Gets current firmware version.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mBotRanger.Commands.getVersion = function() {
  let buffer = new cwc.protocol.makeblock.mBotRanger.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mBotRanger.IndexType.VERSION);
  buffer.writeAction(cwc.protocol.makeblock.mBotRanger.Action.GET);
  buffer.writeDevice(cwc.protocol.makeblock.mBotRanger.Device.VERSION);
  return buffer.readSigned();
};


/**
 * Resets the mBot.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mBotRanger.Commands.reset = function() {
  let buffer = new cwc.protocol.makeblock.mBotRanger.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mBotRanger.IndexType.NONE);
  buffer.writeAction(cwc.protocol.makeblock.mBotRanger.Action.RESET);
  return buffer.readSigned();
};


/**
 * Starts the mBot.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.makeblock.mBotRanger.Commands.start = function() {
  let buffer = new cwc.protocol.makeblock.mBotRanger.Buffer();
  buffer.writeIndex(cwc.protocol.makeblock.mBotRanger.IndexType.NONE);
  buffer.writeAction(cwc.protocol.makeblock.mBotRanger.Action.START);
  return buffer.readSigned();
};
