/**
 * @fileoverview Handles the communication with the EV3 unit.
 *
 * This api allows to read and control the Lego Mindstorm EV3 sensors and
 * actors over an Bluetooth connection.
 *
 * @license Copyright 2015 The Coding with Chrome Authors.
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
goog.provide('cwc.protocol.lego.ev3.Api');

goog.require('cwc.protocol.lego.ev3.ColorSensorMode');
goog.require('cwc.protocol.lego.ev3.Commands');
goog.require('cwc.protocol.lego.ev3.Device');
goog.require('cwc.protocol.lego.ev3.DeviceName');
goog.require('cwc.protocol.lego.ev3.DeviceType');
goog.require('cwc.protocol.lego.ev3.Events');
goog.require('cwc.protocol.lego.ev3.InputPort');
goog.require('cwc.protocol.lego.ev3.IrSensorMode');
goog.require('cwc.protocol.lego.ev3.LedColor');
goog.require('cwc.protocol.lego.ev3.LedMode');
goog.require('cwc.protocol.lego.ev3.Monitoring');
goog.require('cwc.protocol.lego.ev3.MotorMode');
goog.require('cwc.protocol.lego.ev3.OutputPort');

goog.require('goog.events');
goog.require('goog.events.EventTarget');


/**
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.lego.ev3.Api = function() {
  /** @type {string} */
  this.name = 'EV3';

  /** @type {boolean} */
  this.prepared = false;

  /** @type {cwc.protocol.bluetooth.classic.Device} */
  this.device = null;

  /** @private {!Array} */
  this.header_ = [0xff, 0xff];

  /** @private {!number} */
  this.headerMinSize_ = 5;

  /** @type {Object} */
  this.actor = {};

  /** @type {Object} */
  this.sensor = {};

  /** @type {Object} */
  this.deviceInfo = {};

  /** @type {Object} */
  this.deviceData = {};

  /** @type {!string} */
  this.firmware = '';

  /** @type {!string} */
  this.battery = '';

  /** @type {goog.events.EventTarget} */
  this.eventHandler = new goog.events.EventTarget();

  /** @type {!cwc.protocol.lego.ev3.Monitoring} */
  this.monitoring = new cwc.protocol.lego.ev3.Monitoring(this);

  /** @type {!cwc.protocol.lego.ev3.Commands} */
  this.commands = new cwc.protocol.lego.ev3.Commands();

  /** @type {Object} */
  this.cache_ = {};
};


/**
 * Connects the EV3 unit.
 * @param {!cwc.protocol.bluetooth.classic.Device} device
 * @return {boolean} Was able to prepare and connect to the EV3.
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.connect = function(device) {
  if (!device || !device.isConnected()) {
    console.error('EV3 unit is not ready yet...');
    return false;
  }

  if (!this.prepared) {
    console.log('Prepare EV3 bluetooth api for', device.getAddress());
    this.device = device;
    this.prepare();
  }

  return true;
};


/**
 * @return {!boolean}
 */
cwc.protocol.lego.ev3.Api.prototype.isConnected = function() {
  return (this.device && this.device.isConnected()) ? true : false;
};


/**
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.prepare = function() {
  this.device.setDataHandler(this.handleOnReceive_.bind(this));
  // this.device.setDataHandler(this.handleOnReceive_.bind(this),
  //    this.header_, this.headerMinSize_);
  this.monitoring.init();
  this.playTone(2000, 200, 25);
  this.getFirmware();
  this.getDevices();
  this.playTone(3000, 200, 50);
  this.drawClean();
  this.drawLine(0, 0, 999, 999);
  this.drawImage('Test/Smile');
  this.drawUpdate();
  this.prepared = true;
};


/**
 * Disconnects the EV3 unit.
 */
cwc.protocol.lego.ev3.Api.prototype.disconnect = function() {
  if (this.device) {
    this.device.disconnect();
  }
  this.monitor(false);
  this.cleanUp();
};


/**
 * Resets the EV3 connection.
 */
cwc.protocol.lego.ev3.Api.prototype.reset = function() {
  if (this.device) {
    this.device.reset();
  }
};


/**
 * Basic cleanup for the EV3 unit.
 */
cwc.protocol.lego.ev3.Api.prototype.cleanUp = function() {
  this.stop();
  this.clear();
};


/**
 * @return {Object}
 */
cwc.protocol.lego.ev3.Api.prototype.getDeviceData = function() {
  return this.deviceData;
};


/**
 * @return {Object}
 */
cwc.protocol.lego.ev3.Api.prototype.getDeviceInfo = function() {
  return this.deviceInfo;
};


/**
 * @return {Object}
 */
cwc.protocol.lego.ev3.Api.prototype.getColorSensorData = function() {
  return this.deviceData[
    this.deviceInfo[cwc.protocol.lego.ev3.DeviceName.COLOR_SENSOR]];
};


/**
 * @return {Object}
 */
cwc.protocol.lego.ev3.Api.prototype.getIrSensorData = function() {
  return this.deviceData[
    this.deviceInfo[cwc.protocol.lego.ev3.DeviceName.IR_SENSOR]];
};


/**
 * @return {Object}
 */
cwc.protocol.lego.ev3.Api.prototype.getTouchSensorData = function() {
  return this.deviceData[
    this.deviceInfo[cwc.protocol.lego.ev3.DeviceName.TOUCH_SENSOR]];
};


/**
 * @return {Object}
 */
cwc.protocol.lego.ev3.Api.prototype.getTouchSensorOptData = function() {
  return this.deviceData[
    this.deviceInfo[cwc.protocol.lego.ev3.DeviceName.TOUCH_SENSOR_OPT]];
};


/**
 * @return {Object}
 */
cwc.protocol.lego.ev3.Api.prototype.getUltraSonicSensorData = function() {
  return this.deviceData[
    this.deviceInfo[cwc.protocol.lego.ev3.DeviceName.ULTRASONIC_SENSOR]];
};


/**
 * @return {Object}
 */
cwc.protocol.lego.ev3.Api.prototype.getGyroSensorData = function() {
  return this.deviceData[
    this.deviceInfo[cwc.protocol.lego.ev3.DeviceName.GYRO_SENSOR]];
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.protocol.lego.ev3.Api.prototype.getEventHandler = function() {
  return this.eventHandler;
};


/**
 * @param {cwc.protocol.lego.ev3.ColorSensorMode} mode
 */
cwc.protocol.lego.ev3.Api.prototype.setColorSensorMode = function(mode) {
  let sensor = this.deviceData[
    this.deviceInfo[cwc.protocol.lego.ev3.DeviceName.COLOR_SENSOR]];
  if (sensor) {
    sensor.setMode(mode);
    sensor.setCss((mode == cwc.protocol.lego.ev3.ColorSensorMode.COLOR) ?
      'color' : 'default');
  }
};


/**
 * @param {cwc.protocol.lego.ev3.IrSensorMode} mode
 */
cwc.protocol.lego.ev3.Api.prototype.setIrSensorMode = function(mode) {
  let sensor = this.deviceData[
    this.deviceInfo[cwc.protocol.lego.ev3.DeviceName.IR_SENSOR]];
  if (sensor) {
    sensor.setMode(mode);
  }
};


/**
 * @param {cwc.protocol.lego.ev3.UltrasonicSensorMode} mode
 */
cwc.protocol.lego.ev3.Api.prototype.setUltrasonicSensorMode = function(mode) {
  let sensor = this.deviceData[
    this.deviceInfo[cwc.protocol.lego.ev3.DeviceName.ULTRASONIC_SENSOR]];
  if (sensor) {
    sensor.setMode(mode);
  }
};


/**
 * @param {!boolean} enable
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.monitor = function(enable) {
  if (enable && this.isConnected()) {
    this.monitoring.start();
  } else if (!enable) {
    this.monitoring.stop();
  }
};


/**
 * Detects all connected devices.
 */
cwc.protocol.lego.ev3.Api.prototype.getDevices = function() {
  this.monitor(false);

  // Sensor ports
  this.sensor = {};
  this.sensor[cwc.protocol.lego.ev3.DeviceName.COLOR_SENSOR] =
    cwc.protocol.lego.ev3.InputPort.ONE;
  this.sensor[cwc.protocol.lego.ev3.DeviceName.TOUCH_SENSOR] =
    cwc.protocol.lego.ev3.InputPort.TWO;
  this.sensor[cwc.protocol.lego.ev3.DeviceName.IR_SENSOR] =
    cwc.protocol.lego.ev3.InputPort.FOUR;
  this.getDeviceType(cwc.protocol.lego.ev3.InputPort.ONE);
  this.getDeviceType(cwc.protocol.lego.ev3.InputPort.TWO);
  this.getDeviceType(cwc.protocol.lego.ev3.InputPort.THREE);
  this.getDeviceType(cwc.protocol.lego.ev3.InputPort.FOUR);

  // Actor ports
  this.actor = {};
  this.actor[cwc.protocol.lego.ev3.DeviceName.MEDIUM_MOTOR] =
    cwc.protocol.lego.ev3.OutputPort.A;
  this.actor[cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR] =
    cwc.protocol.lego.ev3.OutputPort.B;
  this.actor[cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR_OPT] =
    cwc.protocol.lego.ev3.OutputPort.C;
  this.getDeviceType(cwc.protocol.lego.ev3.InputPort.A);
  this.getDeviceType(cwc.protocol.lego.ev3.InputPort.B);
  this.getDeviceType(cwc.protocol.lego.ev3.InputPort.C);
  this.getDeviceType(cwc.protocol.lego.ev3.InputPort.D);
};


/**
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.getFirmware = function() {
  this.send_(this.commands.getFirmware());
};


/**
 * @param {!cwc.protocol.lego.ev3.InputPort} port
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.getDeviceType = function(port) {
  this.send_(this.commands.getDeviceType(port));
};


/**
 * Gets the current data of the device.
 * @param {!cwc.protocol.lego.ev3.InputPort} port
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.getSensorData = function(port) {
  if (!(port in this.deviceData)) {
    return;
  }
  this.send_(this.commands.getSensorData(port,
    this.deviceData[port].getMode()));
};


/**
 * Get the current data of the device in Pct.
 * @param {!cwc.protocol.lego.ev3.InputPort} port
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.getSensorDataPct = function(port) {
  if (!(port in this.deviceData)) {
    return;
  }
  this.send_(this.commands.getSensorDataPct(port,
      this.deviceData[port].getMode()));
};


/**
 * Get the current data of the device in Pct.
 * @param {!cwc.protocol.lego.ev3.InputPort} port
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.getSensorDataSi = function(port) {
  if (!(port in this.deviceData)) {
    return;
  }
  this.send_(this.commands.getSensorDataSi(port,
      this.deviceData[port].getMode()));
};


/**
 * Get the current data of the device.
 * @param {!cwc.protocol.lego.ev3.InputPort} port
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.getActorData = function(port) {
  if (!(port in this.deviceData)) {
    return;
  }
  this.send_(this.commands.getActorData(port, this.deviceData[port].getMode()));
};


/**
 * @param {cwc.protocol.lego.ev3.LedColor} color
 * @param {cwc.protocol.lego.ev3.LedMode=} opt_mode
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.setLed = function(color, opt_mode) {
  this.send_(this.commands.setLed(color, opt_mode));
};


/**
 * @param {!number} power
 */
cwc.protocol.lego.ev3.Api.prototype.movePower = function(power) {
  let brake = true;
  let motorLeft = this.actor[cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR];
  let motorRight = this.actor[cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR_OPT];
  let ports = motorLeft | motorRight;
  this.send_(this.commands.movePower(ports, power, brake));
};


/**
 * @param {!number} powerLeft Main power value.
 * @param {number=} powerRight Optional second power value.
 */
cwc.protocol.lego.ev3.Api.prototype.rotatePower = function(powerLeft,
    powerRight) {
  let brake = true;
  let motorLeft = this.actor[cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR];
  let motorRight = this.actor[cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR_OPT];
  this.send_(this.commands.rotatePower(motorLeft, motorRight, powerLeft,
      powerRight || powerLeft, brake));
};


/**
 * @param {cwc.protocol.lego.ev3.OutputPort=} port
 */
cwc.protocol.lego.ev3.Api.prototype.stop = function(port) {
  let brake = 1;
  this.send_(this.commands.stop(port, brake));
  this.reset();
};


/**
 * Clears the EV3 unit.
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.clear = function() {
  this.send_(this.commands.clear());
};


/**
 * Clears the EV3 display.
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.drawClean = function() {
  this.send_(this.commands.drawClean());
};


/**
 * Updates the EV3 display.
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.drawUpdate = function() {
  this.send_(this.commands.drawUpdate());
};


/**
 * Shows the selected image file.
 * @param {!string} filename
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.drawImage = function(filename) {
  this.send_(this.commands.drawImage(filename));
};


/**
 * Draws a line.
 * @param {!number} x1
 * @param {!number} y1
 * @param {!number} x2
 * @param {!number} y2
 * @param {number=} color
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.drawLine = function(x1, y1, x2, y2,
    color = 1) {
  this.send_(this.commands.drawLine(x1, y1, x2, y2, color));
};


/**
 * Plays a tone with the defined volume, frequency and duration.
 * @param {!number} frequency
 * @param {number=} duration
 * @param {number=} volume
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.playTone = function(frequency, duration,
    volume) {
  this.send_(this.commands.playTone(frequency, duration, volume));
};


/**
 * Plays the selected sound file.
 * @param {!string} filename
 * @param {number=} volume
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.playSound = function(filename, volume) {
  this.send_(this.commands.playSound(filename, volume));
};


/**
 * Moves the servo motor for the predefined specific steps.
 * @param {!number} steps
 * @param {number=} speed
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.moveServo = function(steps, speed) {
  let brake = true;
  let rampUp = 0;
  let rampDown = 0;
  this.send_(this.commands.moveSteps(
    this.actor[cwc.protocol.lego.ev3.DeviceName.MEDIUM_MOTOR], steps, speed,
    rampUp, rampDown, brake));
};


/**
 * Moves the motors for the predefined specific steps.
 * @param {!number} steps
 * @param {number=} opt_speed
 * @param {boolean=} opt_break
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.moveSteps = function(steps,
    opt_speed, opt_break) {
  let motorLeft = this.actor[cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR];
  let motorRight = this.actor[cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR_OPT];
  let brake = opt_break === undefined ? true : opt_break;
  let rampUp = 0;
  let rampDown = 0;
  this.send_(this.commands.moveSteps(motorLeft | motorRight, steps, opt_speed,
      rampUp, rampDown, brake));
};


/**
 * Moves the motors for the predefined specific steps and ports.
 * @param {!number} steps
 * @param {number=} opt_ports
 * @param {number=} opt_speed
 * @param {boolean=} opt_break
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.customMoveSteps = function(steps,
    opt_ports, opt_speed, opt_break) {
  let ports = opt_ports === undefined ?
    this.actor[cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR] : opt_ports;
  let brake = opt_break === undefined ? true : opt_break;
  let rampUp = 0;
  let rampDown = 0;
  this.send_(this.commands.moveSteps(ports, steps, opt_speed,
      rampUp, rampDown, brake));
};


/**
 * Rotates the motors for the predefined specific steps.
 * @param {!number} steps
 * @param {number=} opt_step_speed
 * @param {boolean=} opt_break
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.rotateSteps = function(steps,
    opt_step_speed, opt_break) {
  let brake = opt_break === undefined ? true : opt_break;
  let motorLeft = this.actor[cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR];
  let motorRight = this.actor[cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR_OPT];
  this.send_(this.commands.rotateSteps(motorLeft, motorRight, steps,
      opt_step_speed, opt_step_speed, 0, 0, brake));
};


/**
 * Rotates the motors for the predefined specific steps and ports.
 * @param {!number} steps
 * @param {number=} opt_ports
 * @param {number=} opt_step_speed
 * @param {boolean=} opt_break
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.customRotateSteps = function(steps,
    opt_ports, opt_step_speed, opt_break) {
  let ports = opt_ports === undefined ?
    this.actor[cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR_OPT] : opt_ports;
  let brake = opt_break === undefined ? true : opt_break;
  this.send_(this.commands.customRotateSteps(ports, steps, opt_step_speed, 0, 0,
      brake));
};


/**
 * @param {!ArrayBuffer} buffer
 * @private
 */
cwc.protocol.lego.ev3.Api.prototype.send_ = function(buffer) {
  if (!this.device) {
    return;
  }
  this.device.send(buffer);
};


/**
 * @param {!cwc.protocol.lego.ev3.InputPort} port
 * @param {!string} type
 * @private
 */
cwc.protocol.lego.ev3.Api.prototype.updateDeviceType_ = function(port, type) {
  if (type == cwc.protocol.lego.ev3.DeviceType.NONE) {
    return;
  }
  let typeNormalized = type.replace(/-/g, '_').replace(/ /g, '');
  if (!(typeNormalized in cwc.protocol.lego.ev3.DeviceType)) {
    if (type == 'PORT ERROR') {
      console.error('Received Port Error on port', port, '!');
      console.error('PLEASE RESTART THE EV3 TO FIX THIS ERROR !');
    } else if (type == 'TERMINAL') {
      console.warn('Please check connection on port', port, '!');
    } else {
      console.warn('Unknown device type "', type, '" on port', port, '!');
      console.warn('Please check re-connect device on port', port, '!');
    }
    return;
  }
  let deviceTypeName = cwc.protocol.lego.ev3.DeviceType[typeNormalized];
  let deviceName = deviceTypeName;
  let deviceMode = 0;
  let deviceCss = '';
  switch (deviceTypeName) {
    case cwc.protocol.lego.ev3.DeviceType.IR_PROX:
      deviceName = cwc.protocol.lego.ev3.DeviceName.IR_SENSOR;
      deviceMode = cwc.protocol.lego.ev3.IrSensorMode.PROXIMITY;
      break;
    case cwc.protocol.lego.ev3.DeviceType.IR_SEEK:
      deviceName = cwc.protocol.lego.ev3.DeviceName.IR_SENSOR;
      deviceMode = cwc.protocol.lego.ev3.IrSensorMode.SEEK;
      break;
    case cwc.protocol.lego.ev3.DeviceType.IR_REMOTE:
      deviceName = cwc.protocol.lego.ev3.DeviceName.IR_SENSOR;
      deviceMode = cwc.protocol.lego.ev3.IrSensorMode.REMOTECONTROL;
      break;
    case cwc.protocol.lego.ev3.DeviceType.TOUCH:
      deviceName = cwc.protocol.lego.ev3.DeviceName.TOUCH_SENSOR;
      break;
    case cwc.protocol.lego.ev3.DeviceType.COL_REFLECT:
      deviceName = cwc.protocol.lego.ev3.DeviceName.COLOR_SENSOR;
      deviceMode = cwc.protocol.lego.ev3.ColorSensorMode.REFLECTIVE;
      break;
    case cwc.protocol.lego.ev3.DeviceType.COL_AMBIENT:
      deviceName = cwc.protocol.lego.ev3.DeviceName.COLOR_SENSOR;
      deviceMode = cwc.protocol.lego.ev3.ColorSensorMode.AMBIENT;
      break;
    case cwc.protocol.lego.ev3.DeviceType.COL_COLOR:
      deviceName = cwc.protocol.lego.ev3.DeviceName.COLOR_SENSOR;
      deviceMode = cwc.protocol.lego.ev3.ColorSensorMode.COLOR;
      deviceCss = 'color';
      break;
    case cwc.protocol.lego.ev3.DeviceType.US_DIST_CM:
      deviceName = cwc.protocol.lego.ev3.DeviceName.ULTRASONIC_SENSOR;
      deviceMode = cwc.protocol.lego.ev3.UltrasonicSensorMode.DIST_CM;
      break;
    case cwc.protocol.lego.ev3.DeviceType.US_DIST_IN:
      deviceName = cwc.protocol.lego.ev3.DeviceName.ULTRASONIC_SENSOR;
      deviceMode = cwc.protocol.lego.ev3.UltrasonicSensorMode.DIST_INCH;
      break;
    case cwc.protocol.lego.ev3.DeviceType.US_LISTEN:
      deviceName = cwc.protocol.lego.ev3.DeviceName.ULTRASONIC_SENSOR;
      deviceMode = cwc.protocol.lego.ev3.UltrasonicSensorMode.LISTEN;
      break;
    case cwc.protocol.lego.ev3.DeviceType.GYRO_ANG:
      deviceName = cwc.protocol.lego.ev3.DeviceName.GYRO_SENSOR;
      deviceMode = cwc.protocol.lego.ev3.GyroMode.ANGLE;
      break;
    case cwc.protocol.lego.ev3.DeviceType.GYRO_RATE:
      deviceName = cwc.protocol.lego.ev3.DeviceName.GYRO_SENSOR;
      deviceMode = cwc.protocol.lego.ev3.GyroMode.RATE;
      break;
    case cwc.protocol.lego.ev3.DeviceType.L_MOTOR_DEG:
      deviceName = cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR;
      deviceMode = cwc.protocol.lego.ev3.MotorMode.DEGREE;
      break;
    case cwc.protocol.lego.ev3.DeviceType.L_MOTOR_ROT:
      deviceName = cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR;
      deviceMode = cwc.protocol.lego.ev3.MotorMode.ROTATION;
      break;
    case cwc.protocol.lego.ev3.DeviceType.M_MOTOR_DEG:
      deviceName = cwc.protocol.lego.ev3.DeviceName.MEDIUM_MOTOR;
      deviceMode = cwc.protocol.lego.ev3.MotorMode.DEGREE;
      break;
    case cwc.protocol.lego.ev3.DeviceType.M_MOTOR_ROT:
      deviceName = cwc.protocol.lego.ev3.DeviceName.MEDIUM_MOTOR;
      deviceMode = cwc.protocol.lego.ev3.MotorMode.ROTATION;
      break;
    default:
      return;
  }

  // Support of two devices of the same type.
  if (deviceName in this.deviceInfo && this.deviceInfo[deviceName] != port) {
    switch (deviceName) {
      case cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR:
        deviceName = cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR_OPT;
        break;
      case cwc.protocol.lego.ev3.DeviceName.MEDIUM_MOTOR:
        deviceName = cwc.protocol.lego.ev3.DeviceName.MEDIUM_MOTOR_OPT;
        break;
      case cwc.protocol.lego.ev3.DeviceName.TOUCH_SENSOR:
        deviceName = cwc.protocol.lego.ev3.DeviceName.TOUCH_SENSOR_OPT;
        break;
    }
  }

  console.log('Found', deviceName, 'with mode', deviceMode, 'on port', port);
  this.deviceData[port] = new cwc.protocol.lego.ev3.Device(deviceName,
      deviceMode, 0, deviceCss);
  this.eventHandler.dispatchEvent(
      cwc.protocol.lego.ev3.Events.changedDevices(this.deviceData));
  this.deviceInfo[deviceName] = port;

  switch (port) {
    case cwc.protocol.lego.ev3.InputPort.ONE:
    case cwc.protocol.lego.ev3.InputPort.TWO:
    case cwc.protocol.lego.ev3.InputPort.THREE:
    case cwc.protocol.lego.ev3.InputPort.FOUR:
      this.sensor[deviceName] = port;
      this.getSensorData(port);
      break;
    case cwc.protocol.lego.ev3.InputPort.A:
    case cwc.protocol.lego.ev3.InputPort.B:
    case cwc.protocol.lego.ev3.InputPort.C:
    case cwc.protocol.lego.ev3.InputPort.D:
      this.actor[deviceName] = Math.pow(2, (port - 0x10));
      this.getActorData(port);
      break;
  }
  this.monitoring.start(this.deviceInfo);
};


/**
 * @param {!cwc.protocol.lego.ev3.InputPort} port
 * @param {!number} value
 * @param {cwc.protocol.lego.ev3.DeviceName=} opt_device_name
 * @private
 */
cwc.protocol.lego.ev3.Api.prototype.updateDeviceData_ = function(port, value,
    opt_device_name) {
  if (this.deviceData[port] && this.deviceData[port].getValue() != value) {
    this.deviceData[port].setValue(value);
    this.monitoring.update();
    switch (opt_device_name) {
      case cwc.protocol.lego.ev3.DeviceName.COLOR_SENSOR:
        this.eventHandler.dispatchEvent(
            cwc.protocol.lego.ev3.Events.colorSensorValue(value, port));
        break;
      case cwc.protocol.lego.ev3.DeviceName.GYRO_SENSOR:
        this.eventHandler.dispatchEvent(
            cwc.protocol.lego.ev3.Events.gyroSensorValue(value, port));
        break;
      case cwc.protocol.lego.ev3.DeviceName.IR_SENSOR:
        this.eventHandler.dispatchEvent(
            cwc.protocol.lego.ev3.Events.irSensorValue(value, port));
        break;
      case cwc.protocol.lego.ev3.DeviceName.ULTRASONIC_SENSOR:
        this.eventHandler.dispatchEvent(
            cwc.protocol.lego.ev3.Events.ultrasonicSensorValue(value, port));
        break;
      case cwc.protocol.lego.ev3.DeviceName.TOUCH_SENSOR:
        this.eventHandler.dispatchEvent(
            cwc.protocol.lego.ev3.Events.touchSensorValue(value, port));
        break;
      case cwc.protocol.lego.ev3.DeviceName.TOUCH_SENSOR_OPT:
        this.eventHandler.dispatchEvent(
            cwc.protocol.lego.ev3.Events.touchSensorOptValue(value, port));
        break;
      case cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR:
        this.eventHandler.dispatchEvent(
            cwc.protocol.lego.ev3.Events.touchSensorValue(value, port));
        break;
      case cwc.protocol.lego.ev3.DeviceName.MEDIUM_MOTOR:
        this.eventHandler.dispatchEvent(
            cwc.protocol.lego.ev3.Events.mediumMotorValue(value, port));
        break;
      case cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR_OPT:
        this.eventHandler.dispatchEvent(
            cwc.protocol.lego.ev3.Events.largeMotorOptValue(value, port));
        break;
      case cwc.protocol.lego.ev3.DeviceName.MEDIUM_MOTOR_OPT:
        this.eventHandler.dispatchEvent(
            cwc.protocol.lego.ev3.Events.mediumMotorOptValue(value, port));
        break;
    }
  }
};


/**
 * Handles received data and callbacks from the Bluetooth socket.
 * @param {Array<number>|ArrayBuffer|ArrayBufferView|null|number} raw_data
 * @private
 */
cwc.protocol.lego.ev3.Api.prototype.handleOnReceive_ = function(raw_data) {
  if (!raw_data) {
    console.error('Received no data!');
    return;
  }
  let data = new Uint8Array(raw_data);
  if (data.length < 5) {
    console.error('Received data are to small!');
    return;
  }
  let value = 0;
  let result = 0;
  let callback = data[2];
  let port = /** @type {cwc.protocol.lego.ev3.InputPort} */ (data[3]);

  // Handles the different callback types.
  switch (callback) {
    case cwc.protocol.lego.ev3.CallbackType.FIRMWARE:
      value = data.subarray(5, 5 + 16);
      this.firmware = (String.fromCharCode.apply(null, value)).trim();
      console.log('EV3 Firmware Version', this.firmware);
      break;
    case cwc.protocol.lego.ev3.CallbackType.BATTERY:
      value = data.subarray(5, 5 + 16);
      this.battery = (String.fromCharCode.apply(null, value)).trim();
      console.log('EV3 Battery level', this.battery);
      break;
    case cwc.protocol.lego.ev3.CallbackType.DEVICE_NAME:
      value = data.subarray(5, 5 + 0x7E);
      this.updateDeviceType_(port,
        (String.fromCharCode.apply(null, value)).trim());
      break;
    case cwc.protocol.lego.ev3.CallbackType.DEVICE_PCT_VALUE:
    case cwc.protocol.lego.ev3.CallbackType.DEVICE_RAW_VALUE:
      value = data[5];
      this.updateDeviceData_(port, value, this.deviceData[port].getName());
      break;
    case cwc.protocol.lego.ev3.CallbackType.DEVICE_SI_VALUE:
      value = new Uint8Array([data[5], data[6], data[7], data[8]]);
      result = Number((new Float32Array(value.buffer)[0]).toFixed(1));
      this.updateDeviceData_(port, result, this.deviceData[port].getName());
      break;
    case cwc.protocol.lego.ev3.CallbackType.ACTOR_VALUE:
      value = new Uint8Array([data[5], data[6], data[7], data[8]]);
      result = /** @type {number} */ (new Int32Array(value.buffer)[0]);
      this.updateDeviceData_(port, result, this.deviceData[port].getName());
      break;
  }
};
