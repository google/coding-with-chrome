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
goog.require('cwc.protocol.lego.ev3.DeviceGroup');
goog.require('cwc.protocol.lego.ev3.DeviceType');
goog.require('cwc.protocol.lego.ev3.Devices');


/**
 * @constructor
 * @final
 */
cwc.protocol.lego.ev3.Handler = function() {
  /** @private {!cwc.protocol.lego.ev3.Devices} */
  this.devices_ = new cwc.protocol.lego.ev3.Devices();
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
  let ports = data['ports'];
  if (typeof data['ports'] === 'undefined') {
    let portLeft = this.getLargeMotorPortLeft_(data['port_left']);
    let portRight = this.getLargeMotorPortRight_(data['port_right']);
    ports = portLeft | portRight;
  }
  return cwc.protocol.lego.ev3.Commands.movePower(
    ports, data['power'], data['brake']);
};


/**
 * @param {number} power
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['movePowerLeft'] = function(power) {
  let brake = true;
  let motorLeft = this.actor[cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR];
  return cwc.protocol.lego.ev3.Commands.movePower(motorLeft, power, brake);
};


/**
 * @param {number} power
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
  let portLeft = this.getLargeMotorPortLeft_(data['port_left']);
  let portRight = this.getLargeMotorPortRight_(data['port_right']);
  let powerLeft = this.getValue_(data['power_left'], data['power']);
  let powerRight = this.getValue_(data['power_right'], data['power']);
  return cwc.protocol.lego.ev3.Commands.rotatePower(
    portLeft, portRight, powerLeft, powerRight, data['brake']);
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
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['moveServo'] = function(data = {}) {
  let port = this.getMediumMotorPort_(data['port']);
  return cwc.protocol.lego.ev3.Commands.moveSteps(
    port, data['steps'], data['speed'],
    data['rampUp'], data['rampDown'], data['brake']);
};


/**
 * Moves the motors for the predefined specific steps.
 * @param {Object=} data
 * @return {!ArrayBuffer}
 */
cwc.protocol.lego.ev3.Handler.prototype['moveSteps'] = function(data = {}) {
  let ports = data['ports'];
  if (typeof data['ports'] === 'undefined') {
    let portLeft = this.getLargeMotorPortLeft_(data['port_left']);
    let portRight = this.getLargeMotorPortRight_(data['port_right']);
    ports = portLeft | portRight;
  }
  return cwc.protocol.lego.ev3.Commands.moveSteps(
    ports, data['steps'], data['speed'],
    data['rampUp'], data['rampDown'], data['brake']);
};


/**
 * Moves the motors for the predefined specific steps and ports.
 * @param {number} steps
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
  let portLeft = this.getLargeMotorPortLeft_(data['port_left']);
  let portRight = this.getLargeMotorPortRight_(data['port_right']);
  let speedLeft = this.getValue_(data['speed_left'], data['speed']);
  let speedRight = this.getValue_(data['speed_right'], data['speed']);
  return cwc.protocol.lego.ev3.Commands.rotateSteps(
    portLeft, portRight, data['steps'], speedLeft, speedRight,
    data['ramp_up'], data['ramp_down'], data['brake']);
};


/**
 * Rotates the motors for the predefined specific steps and ports.
 * @param {number} steps
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


/**
 * @param {!Object} devices
 * @private
 */
cwc.protocol.lego.ev3.Handler.prototype.setDevices_ = function(devices) {
  this.devices_ = devices;
};


/**
 * @param {number=} value
 * @param {number=} fallback
 * @return {number}
 * @private
 */
cwc.protocol.lego.ev3.Handler.prototype.getValue_ = function(value, fallback) {
  if (typeof value === 'undefined') {
    return fallback;
  }
  return value;
};


/**
 * @param {number=} value
 * @return {number}
 * @private
 */
cwc.protocol.lego.ev3.Handler.prototype.getMediumMotorPort_ = function(
    value) {
  if (typeof value === 'undefined' &&
      this.devices_['actor'][cwc.protocol.lego.ev3.DeviceGroup.M_MOTOR]) {
    return this.devices_['actor'][cwc.protocol.lego.ev3.DeviceGroup.M_MOTOR][0];
  }
  return value;
};


/**
 * @param {number=} value
 * @return {number}
 * @private
 */
cwc.protocol.lego.ev3.Handler.prototype.getLargeMotorPortLeft_ = function(
    value) {
  if (typeof value === 'undefined' &&
      this.devices_['actor'][cwc.protocol.lego.ev3.DeviceGroup.L_MOTOR]) {
    return this.devices_['actor'][cwc.protocol.lego.ev3.DeviceGroup.L_MOTOR][0];
  }
  return value;
};


/**
 * @param {number=} value
 * @return {number}
 * @private
 */
cwc.protocol.lego.ev3.Handler.prototype.getLargeMotorPortRight_ = function(
    value) {
  if (typeof value === 'undefined' &&
      this.devices_['actor'][cwc.protocol.lego.ev3.DeviceGroup.L_MOTOR]) {
    return this.devices_['actor'][cwc.protocol.lego.ev3.DeviceGroup.L_MOTOR][1];
  }
  return value;
};
