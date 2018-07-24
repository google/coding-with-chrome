/**
 * @fileoverview Command Handler fpr Makeblock mBots Ranger implementation.
 *
 * This api allows to read and control the Makeblock mBot Ranger kits with
 * bluetooth connection.
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
goog.provide('cwc.protocol.makeblock.mBotRanger.Handler');

goog.require('cwc.protocol.makeblock.mBotRanger.Commands');


/**
 * @constructor
 * @final
 */
cwc.protocol.makeblock.mBotRanger.Handler = function() {};


/**
 * Powers the motor.
 * @param {!Object} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.makeblock.mBotRanger.Handler.prototype['movePower'] = function(
    data) {
  if (data['slot'] === undefined) {
    return [
      cwc.protocol.makeblock.mBotRanger.Commands.movePower(-data['power'],
        cwc.protocol.makeblock.mBotRanger.Slot.ONE),
      cwc.protocol.makeblock.mBotRanger.Commands.movePower(data['power'],
        cwc.protocol.makeblock.mBotRanger.Slot.TWO),
    ];
  }
  return cwc.protocol.makeblock.mBotRanger.Commands.movePower(
    data['power'], data['slot']);
};


/**
 * Powers the motor.
 * @param {!Object} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.makeblock.mBotRanger.Handler.prototype['rotatePower'] = function(
    data) {
  if (data['slot'] === undefined) {
    return [
      cwc.protocol.makeblock.mBotRanger.Commands.movePower(data['power'],
        cwc.protocol.makeblock.mBotRanger.Slot.ONE),
      cwc.protocol.makeblock.mBotRanger.Commands.movePower(data['power'],
        cwc.protocol.makeblock.mBotRanger.Slot.TWO),
    ];
  }
  return cwc.protocol.makeblock.mBotRanger.Commands.movePower(
    data['power'], data['slot']);
};


/**
 * Rotates the motor for the given steps.
 * @param {!Object} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.makeblock.mBotRanger.Handler.prototype['moveSteps'] = function(
    data) {
  if (data['slot'] === undefined) {
    return [
      cwc.protocol.makeblock.mBotRanger.Commands.moveSteps(
        -data['steps'], data['power'],
        cwc.protocol.makeblock.mBotRanger.Slot.ONE),
      cwc.protocol.makeblock.mBotRanger.Commands.moveSteps(
        data['steps'], data['power'],
        cwc.protocol.makeblock.mBotRanger.Slot.TWO),
    ];
  }
  return cwc.protocol.makeblock.mBotRanger.Commands.moveSteps(
    data['steps'], data['power'], data['slot']);
};


/**
 * Sets led light on the top of the mBot Ranger
 * @param {!Object} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.makeblock.mBotRanger.Handler.prototype['setRGBLED'] = function(
    data) {
  return cwc.protocol.makeblock.mBotRanger.Commands.setRGBLED(
    data['red'], data['green'], data['blue'], data['index']);
};


/**
 * Plays a tone through mBot Ranger's buzzer
 * @param {!Object} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.makeblock.mBotRanger.Handler.prototype['playTone'] = function(
    data) {
  return cwc.protocol.makeblock.mBotRanger.Commands.playTone(
    data['frequency'], data['duration']);
};


/**
 * Device version
 * @return {!ArrayBuffer}
 */
cwc.protocol.makeblock.mBotRanger.Handler.prototype['getVersion'] = function() {
  return cwc.protocol.makeblock.mBotRanger.Commands.getVersion();
};


/**
 * Reads out sensor value.
 * @param {!Object} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.makeblock.mBotRanger.Handler.prototype['getSensorData'] = function(
    data) {
  return cwc.protocol.makeblock.mBotRanger.Commands.getSensorData(
    data['index'], data['device'], data['port']);
};


/**
 * Resets the mBot Ranger.
 * @return {!ArrayBuffer}
 */
cwc.protocol.makeblock.mBotRanger.Handler.prototype['reset'] = function() {
  return cwc.protocol.makeblock.mBotRanger.Commands.reset();
};


/**
 * Stops mBot Ranger.
 * @return {!ArrayBuffer}
 */
cwc.protocol.makeblock.mBotRanger.Handler.prototype['stop'] = function() {
  return [
    this['setRGBLED']({}),
      cwc.protocol.makeblock.mBotRanger.Commands.movePower(
        1, cwc.protocol.makeblock.mBotRanger.Slot.ONE),
      cwc.protocol.makeblock.mBotRanger.Commands.movePower(
        1, cwc.protocol.makeblock.mBotRanger.Slot.TWO),
      cwc.protocol.makeblock.mBotRanger.Commands.movePower(
        0, cwc.protocol.makeblock.mBotRanger.Slot.ONE),
      cwc.protocol.makeblock.mBotRanger.Commands.movePower(
        0, cwc.protocol.makeblock.mBotRanger.Slot.TWO),
    this['reset'](),
  ];
};
