/**
 * @fileoverview Command Handler for Lego EV3 implementation.
 *
 * This api allows to read and control the Sphero sensors and actors over an
 * Bluetooth connection.
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
goog.provide('cwc.protocol.lego.ev3.Handler');

goog.require('cwc.protocol.lego.ev3.Commands');


/**
 * @constructor
 * @final
 */
cwc.protocol.lego.ev3.Handler = function() {

};


/**
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['getBattery'] = function() {
  return cwc.protocol.lego.ev3.Commands.getBattery();
};


/**
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['getFirmware'] = function() {
  return cwc.protocol.lego.ev3.Commands.getFirmware();
};


/**
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['getDeviceType'] = function(data = {}) {
  return cwc.protocol.lego.ev3.Commands.getDeviceType(data['port']);
};


/**
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['getDeviceTypes'] = function(
    data = {}) {
  return cwc.protocol.lego.ev3.Commands.getDeviceTypes(data['ports']);
};


/**
 * Gets the current data of the device.
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['getSensorData'] = function(data = {}) {
  return cwc.protocol.lego.ev3.Commands.getSensorData(
    data['port'], data['mode']);
};


/**
 * Get the current data of the device in Pct.
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['getSensorDataPct'] = function(
    data = {}) {
  return cwc.protocol.lego.ev3.Commands.getSensorDataPct(
    data['port'], data['mode']);
};


/**
 * Get the current data of the device in Pct.
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['getSensorDataSi'] = function(
    data = {}) {
  return cwc.protocol.lego.ev3.Commands.getSensorDataSi(
    data['port'], data['mode']);
};


/**
 * Get the current data of the device.
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['getActorData'] = function(data = {}) {
  return cwc.protocol.lego.ev3.Commands.getActorData(
    data['port'], data['mode']);
};


/**
 * @param {cwc.protocol.lego.ev3.LedColor} color
 * @param {cwc.protocol.lego.ev3.LedMode=} mode
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['setLed'] = function(color, mode) {
  return cwc.protocol.lego.ev3.Commands.setLed(color, mode);
};


/**
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['movePower'] = function(data = {}) {
  return cwc.protocol.lego.ev3.Commands.movePower(
    data['motorLeft'] | data['motorRight'], data['power'], data['brake']);
};


/**
 * @param {!number} power
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['movePowerLeft'] = function(power) {
  let brake = true;
  let motorLeft = this.actor[cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR];
  return cwc.protocol.lego.ev3.Commands.movePower(motorLeft, power, brake);
};


/**
 * @param {!number} power
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['movePowerRight'] = function(power) {
  let brake = true;
  let motorRight = this.actor[cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR_OPT];
  return cwc.protocol.lego.ev3.Commands.movePower(motorRight, power, brake);
};


/**
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['rotatePower'] = function(data = {}) {
  return cwc.protocol.lego.ev3.Commands.rotatePower(
    data['motorLeft'], data['motorRight'], data['powerLeft'],
    data['powerRight'] || data['powerLeft'], data['brake']);
};


/**
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['stop'] = function(data = {}) {
  return cwc.protocol.lego.ev3.Commands.stop(
    data['port'], data['brake']);
};


/**
 * Clears the EV3 unit.
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['clear'] = function() {
  return cwc.protocol.lego.ev3.Commands.clear();
};


/**
 * Clears the EV3 display.
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['drawClean'] = function() {
  return cwc.protocol.lego.ev3.Commands.drawClean();
};


/**
 * Updates the EV3 display.
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['drawUpdate'] = function() {
  return cwc.protocol.lego.ev3.Commands.drawUpdate();
};


/**
 * Shows the selected image file.
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['drawImage'] = function(data = {}) {
  return cwc.protocol.lego.ev3.Commands.drawImage(data['filename']);
};


/**
 * Draws a line.
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['drawLine'] = function(data = {}) {
  return cwc.protocol.lego.ev3.Commands.drawLine(
    data['x1'], data['y1'], data['x2'], data['y2'], data['color']);
};


/**
 * Plays a tone with the defined volume, frequency and duration.
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['playTone'] = function(data = {}) {
  return cwc.protocol.lego.ev3.Commands.playTone(
    data['frequency'], data['duration'], data['volume']);
};


/**
 * Plays the selected sound file.
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['playSound'] = function(data = {}) {
  return cwc.protocol.lego.ev3.Commands.playSound(
    data['filename'], data['volume']);
};


/**
 * Moves the servo motor for the predefined specific steps.
 * @param {!number} steps
 * @param {number=} speed
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['moveServo'] = function(steps, speed) {
  let brake = true;
  let rampUp = 0;
  let rampDown = 0;
  return cwc.protocol.lego.ev3.Commands.moveSteps(
    this.actor[cwc.protocol.lego.ev3.DeviceName.MEDIUM_MOTOR], steps, speed,
    rampUp, rampDown, brake);
};


/**
 * Moves the motors for the predefined specific steps.
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['moveSteps'] = function(data = {}) {
  return cwc.protocol.lego.ev3.Commands.moveSteps(
    data['motorLeft'] | data['motorRight'], data['steps'], data['speed'],
    data['rampUp'], data['rampDown'], data['brake']);
};


/**
 * Moves the motors for the predefined specific steps and ports.
 * @param {!number} steps
 * @param {number=} opt_ports
 * @param {number=} opt_speed
 * @param {boolean=} opt_break
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['customMoveSteps'] = function(steps,
    opt_ports, opt_speed, opt_break) {
  let ports = opt_ports === undefined ?
    this.actor[cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR] : opt_ports;
  let brake = opt_break === undefined ? true : opt_break;
  let rampUp = 0;
  let rampDown = 0;
  return cwc.protocol.lego.ev3.Commands.moveSteps(ports, steps, opt_speed,
      rampUp, rampDown, brake);
};


/**
 * Rotates the motors for the predefined specific steps.
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['rotateSteps'] = function(data = {}) {
  return cwc.protocol.lego.ev3.Commands.rotateSteps(
    data['port_left'], data['port_right'], data['steps'], data['speed_left'],
    data['speed_right'], data['ramp_up'], data['ramp_down'], data['brake']);
};


/**
 * Rotates the motors for the predefined specific steps and ports.
 * @param {!number} steps
 * @param {number=} opt_ports
 * @param {number=} opt_step_speed
 * @param {boolean=} opt_break
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['customRotateSteps'] = function(steps,
    opt_ports, opt_step_speed, opt_break) {
  let ports = opt_ports === undefined ?
    this.actor[cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR_OPT] : opt_ports;
  let brake = opt_break === undefined ? true : opt_break;
  return cwc.protocol.lego.ev3.Commands.customRotateSteps(ports, steps,
    opt_step_speed, 0, 0, brake);
};
