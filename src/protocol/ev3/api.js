/**
 * @fileoverview Handles the communication with the EV3 unit.
 *
 * This api allows to read and control the Lego Mindstorm EV3 sensors and
 * actors over an Bluetooth connection.
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
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
goog.provide('cwc.protocol.ev3.Api');

goog.require('cwc.protocol.ev3.ColorSensorMode');
goog.require('cwc.protocol.ev3.Commands');
goog.require('cwc.protocol.ev3.Device');
goog.require('cwc.protocol.ev3.DeviceName');
goog.require('cwc.protocol.ev3.DeviceType');
goog.require('cwc.protocol.ev3.Events');
goog.require('cwc.protocol.ev3.InputPort');
goog.require('cwc.protocol.ev3.IrSensorMode');
goog.require('cwc.protocol.ev3.LedColor');
goog.require('cwc.protocol.ev3.LedMode');
goog.require('cwc.protocol.ev3.Monitoring');
goog.require('cwc.protocol.ev3.MotorMode');
goog.require('cwc.protocol.ev3.OutputPort');

goog.require('cwc.utils.Helper');

goog.require('goog.events');
goog.require('goog.events.EventTarget');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.ev3.Api = function(helper) {
  /** @type {string} */
  this.name = 'EV3';

  /** @type {boolean} */
  this.prepared = false;

  /** @type {string} */
  this.autoConnectName = 'EV3';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {cwc.protocol.bluetooth.Device} */
  this.device = null;

  /** @private {!array} */
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

  /** @type {cwc.protocol.ev3.Monitoring} */
  this.monitoring = new cwc.protocol.ev3.Monitoring(this);

  /** @type {!cwc.protocol.ev3.CallbackType} */
  this.callbackType = cwc.protocol.ev3.CallbackType;

  /** @type {!cwc.protocol.ev3.Commands} */
  this.commands = new cwc.protocol.ev3.Commands();

  /** @type {!cwc.protocol.ev3.DeviceName} */
  this.deviceName = cwc.protocol.ev3.DeviceName;

  /** @type {Object} */
  this.cache_ = {};
};


/**
 * AutoConnects the EV3 unit.
 * @export
 */
cwc.protocol.ev3.Api.prototype.autoConnect = function() {
  var bluetoothInstance = this.helper.getInstance('bluetooth', true);
  bluetoothInstance.autoConnectDevice(this.autoConnectName,
      this.connect.bind(this), true);
};


/**
 * Connects the EV3 unit.
 * @param {!string} address
 * @return {boolean} Was able to prepare and connect to the EV3.
 * @export
 */
cwc.protocol.ev3.Api.prototype.connect = function(address) {
  var bluetoothInstance = this.helper.getInstance('bluetooth', true);
  var device = bluetoothInstance.getDevice(address);
  if (!device) {
    console.error('EV3 unit is not ready yet …');
    return false;
  }

  if (!this.prepared && device.isConnected()) {
    console.log('Prepare EV3 bluetooth api for', device.getAddress());
    this.device = device;
    this.prepare();
  }

  return true;
};


/**
 * @return {boolean}
 */
cwc.protocol.ev3.Api.prototype.isConnected = function() {
  return this.device && this.device.isConnected();
};


/**
 * @export
 */
cwc.protocol.ev3.Api.prototype.prepare = function() {
  this.device.setDataHandler(this.handleOnReceive_.bind(this));
  //this.device.setDataHandler(this.handleOnReceive_.bind(this),
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
cwc.protocol.ev3.Api.prototype.disconnect = function() {
  if (this.device) {
    this.device.disconnect();
  }
  this.monitor(false);
  this.cleanUp();
};


/**
 * Resets the EV3 connection.
 * @param {number=} opt_delay
 */
cwc.protocol.ev3.Api.prototype.reset = function(opt_delay) {
  if (this.device) {
    this.device.reset(opt_delay);
  }
};


/**
 * @return {boolean}
 */
cwc.protocol.ev3.Api.prototype.isConnected = function() {
  return this.device && this.device.isConnected();
};


/**
 * Basic cleanup for the EV3 unit.
 */
cwc.protocol.ev3.Api.prototype.cleanUp = function() {
  this.stop();
  this.clear();
};


/**
 * @return {Object}
 */
cwc.protocol.ev3.Api.prototype.getDeviceData = function() {
  return this.deviceData;
};


/**
 * @return {Object}
 */
cwc.protocol.ev3.Api.prototype.getDeviceInfo = function() {
  return this.deviceInfo;
};


/**
 * @return {Object}
 */
cwc.protocol.ev3.Api.prototype.getColorSensorData = function() {
  return this.deviceData[this.deviceInfo[this.deviceName.COLOR_SENSOR]];
};


/**
 * @return {Object}
 */
cwc.protocol.ev3.Api.prototype.getIrSensorData = function() {
  return this.deviceData[this.deviceInfo[this.deviceName.IR_SENSOR]];
};


/**
 * @return {Object}
 */
cwc.protocol.ev3.Api.prototype.getTouchSensorData = function() {
  return this.deviceData[this.deviceInfo[this.deviceName.TOUCH_SENSOR]];
};


/**
 * @return {Object}
 */
cwc.protocol.ev3.Api.prototype.getTouchSensorOptData = function() {
  return this.deviceData[this.deviceInfo[this.deviceName.TOUCH_SENSOR_OPT]];
};


/**
 * @return {Object}
 */
cwc.protocol.ev3.Api.prototype.getUltraSonicSensorData = function() {
  return this.deviceData[this.deviceInfo[this.deviceName.ULTRASONIC_SENSOR]];
};


/**
 * @return {Object}
 */
cwc.protocol.ev3.Api.prototype.getGyroSensorData = function() {
  return this.deviceData[this.deviceInfo[this.deviceName.GYRO_SENSOR]];
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.protocol.ev3.Api.prototype.getEventHandler = function() {
  return this.eventHandler;
};


/**
 * @param {cwc.protocol.ev3.ColorSensorMode} mode
 */
cwc.protocol.ev3.Api.prototype.setColorSensorMode = function(mode) {
  this.deviceData[this.deviceInfo[this.deviceName.COLOR_SENSOR]].setMode(mode);
  this.deviceData[this.deviceInfo[this.deviceName.COLOR_SENSOR]].setCss(
      (mode == cwc.protocol.ev3.ColorSensorMode.COLOR) ? 'color' : 'default');
};


/**
 * @param {cwc.protocol.ev3.IrSensorMode} mode
 */
cwc.protocol.ev3.Api.prototype.setIrSensorMode = function(mode) {
  this.deviceData[this.deviceInfo[this.deviceName.IR_SENSOR]].setMode(mode);
};


/**
 * @param {cwc.protocol.ev3.UltrasonicSensorMode} mode
 */
cwc.protocol.ev3.Api.prototype.setUltrasonicSensorMode = function(mode) {
  console.log(mode);
  this.deviceData[this.deviceInfo[this.deviceName.ULTRASONIC_SENSOR]]
    .setMode(mode);
};


/**
 * @param {!boolean} enable
 * @export
 */
cwc.protocol.ev3.Api.prototype.monitor = function(enable) {
  if (enable && this.isConnected()) {
    this.monitoring.start();
  } else if (!enable) {
    this.monitoring.stop();
  }
};


/**
 * Detects all connected devices.
 */
cwc.protocol.ev3.Api.prototype.getDevices = function() {
  this.monitor(false);

  // Sensor ports
  this.sensor = {};
  this.sensor[this.deviceName.COLOR_SENSOR] = cwc.protocol.ev3.InputPort.ONE;
  this.sensor[this.deviceName.TOUCH_SENSOR] = cwc.protocol.ev3.InputPort.TWO;
  this.sensor[this.deviceName.IR_SENSOR] = cwc.protocol.ev3.InputPort.FOUR;
  this.getDeviceType(cwc.protocol.ev3.InputPort.ONE);
  this.getDeviceType(cwc.protocol.ev3.InputPort.TWO);
  this.getDeviceType(cwc.protocol.ev3.InputPort.THREE);
  this.getDeviceType(cwc.protocol.ev3.InputPort.FOUR);

  // Actor ports
  this.actor = {};
  this.actor[this.deviceName.MEDIUM_MOTOR] = cwc.protocol.ev3.OutputPort.A;
  this.actor[this.deviceName.LARGE_MOTOR] = cwc.protocol.ev3.OutputPort.B;
  this.actor[this.deviceName.LARGE_MOTOR_OPT] = cwc.protocol.ev3.OutputPort.C;
  this.getDeviceType(cwc.protocol.ev3.InputPort.A);
  this.getDeviceType(cwc.protocol.ev3.InputPort.B);
  this.getDeviceType(cwc.protocol.ev3.InputPort.C);
  this.getDeviceType(cwc.protocol.ev3.InputPort.D);
};


/**
 * @export
 */
cwc.protocol.ev3.Api.prototype.getFirmware = function() {
  this.send_(this.commands.getFirmware());
};


/**
 * @param {!cwc.protocol.ev3.InputPort} port
 * @export
 */
cwc.protocol.ev3.Api.prototype.getDeviceType = function(port) {
  this.send_(this.commands.getDeviceType(port));
};


/**
 * Gets the current data of the device.
 * @param {!cwc.protocol.ev3.InputPort} port
 * @export
 */
cwc.protocol.ev3.Api.prototype.getSensorData = function(port) {
  if (!(port in this.deviceData)) {
    return;
  }
  this.send_(this.commands.getSensorData(port,
    this.deviceData[port].getMode()));
};


/**
 * Get the current data of the device in Pct.
 * @param {!cwc.protocol.ev3.InputPort} port
 * @export
 */
cwc.protocol.ev3.Api.prototype.getSensorDataPct = function(port) {
  if (!(port in this.deviceData)) {
    return;
  }
  this.send_(this.commands.getSensorDataPct(port,
      this.deviceData[port].getMode()));
};


/**
 * Get the current data of the device in Pct.
 * @param {!cwc.protocol.ev3.InputPort} port
 * @export
 */
cwc.protocol.ev3.Api.prototype.getSensorDataSi = function(port) {
  if (!(port in this.deviceData)) {
    return;
  }
  this.send_(this.commands.getSensorDataSi(port,
      this.deviceData[port].getMode()));
};


/**
 * Get the current data of the device.
 * @param {!cwc.protocol.ev3.InputPort} port
 * @export
 */
cwc.protocol.ev3.Api.prototype.getActorData = function(port) {
  if (!(port in this.deviceData)) {
    return;
  }
  this.send_(this.commands.getActorData(port, this.deviceData[port].getMode()));
};


/**
 * @param {cwc.protocol.ev3.LedColor} color
 * @param {cwc.protocol.ev3.LedMode=} opt_mode
 * @export
 */
cwc.protocol.ev3.Api.prototype.setLed = function(color, opt_mode) {
  this.send_(this.commands.setLed(color, opt_mode));
};


/**
 * @param {!number} power
 */
cwc.protocol.ev3.Api.prototype.movePower = function(power) {
  var brake = true;
  var motor_left = this.actor[this.deviceName.LARGE_MOTOR];
  var motor_right = this.actor[this.deviceName.LARGE_MOTOR_OPT];
  var ports = motor_left | motor_right;
  this.send_(this.commands.movePower(ports, power, brake));
};


/**
 * @param {!number} power_left Main power value.
 * @param {number=} opt_power_right Optional second power value.
 */
cwc.protocol.ev3.Api.prototype.rotatePower = function(power_left,
    opt_power_right) {
  var brake = true;
  var motor_left = this.actor[this.deviceName.LARGE_MOTOR];
  var motor_right = this.actor[this.deviceName.LARGE_MOTOR_OPT];
  this.send_(this.commands.rotatePower(motor_left, motor_right, power_left,
      opt_power_right || power_left, brake));
};


/**
 * @param {cwc.protocol.ev3.InputPort=} opt_port
 */
cwc.protocol.ev3.Api.prototype.stop = function(opt_port) {
  var brake = 1;
  this.send_(this.commands.stop(opt_port, brake));
  this.reset();
};


/**
 * Clears the EV3 unit.
 * @export
 */
cwc.protocol.ev3.Api.prototype.clear = function() {
  this.send_(this.commands.clear());
};


/**
 * Clears the EV3 display.
 * @export
 */
cwc.protocol.ev3.Api.prototype.drawClean = function() {
  this.send_(this.commands.drawClean());
};


/**
 * Updates the EV3 display.
 * @export
 */
cwc.protocol.ev3.Api.prototype.drawUpdate = function() {
  this.send_(this.commands.drawUpdate());
};


/**
 * Shows the selected image file.
 * @param {!string} file_name
 * @export
 */
cwc.protocol.ev3.Api.prototype.drawImage = function(file_name) {
  this.send_(this.commands.drawImage(file_name));
};


/**
 * Draws a line.
 * @export
 */
cwc.protocol.ev3.Api.prototype.drawLine = function(x1, y1, x2, y2, opt_color) {
  this.send_(this.commands.drawLine(x1, y1, x2, y2, opt_color));
};


/**
 * Plays a tone with the defined volume, frequency and duration.
 * @param {!number} frequency
 * @param {number=} opt_duration
 * @param {number=} opt_volume
 * @export
 */
cwc.protocol.ev3.Api.prototype.playTone = function(frequency, opt_duration,
    opt_volume) {
  this.send_(this.commands.playTone(frequency, opt_duration, opt_volume));
};


/**
 * Plays the selected sound file.
 * @param {!string} file_name
 * @param {number=} opt_volume
 * @export
 */
cwc.protocol.ev3.Api.prototype.playSound = function(file_name, opt_volume) {
  this.send_(this.commands.playSound(file_name, opt_volume));
};


/**
 * Moves the servo motor for the predefined specific steps.
 * @param {!number} steps
 * @param {number=} opt_step_speed
 * @export
 */
cwc.protocol.ev3.Api.prototype.moveServo = function(steps, opt_speed) {
  var brake = true;
  var rampUp = 0;
  var rampDown = 0;
  this.send_(this.commands.moveSteps(this.actor[this.deviceName.MEDIUM_MOTOR],
      steps, opt_speed, rampUp, rampDown, brake));
};


/**
 * Moves the motors for the predefined specific steps.
 * @param {!number} steps
 * @param {number=} opt_speed
 * @param {boolean=} opt_break
 * @export
 */
cwc.protocol.ev3.Api.prototype.moveSteps = function(steps,
    opt_speed, opt_break) {
  var motor_left = this.actor[this.deviceName.LARGE_MOTOR];
  var motor_right = this.actor[this.deviceName.LARGE_MOTOR_OPT];
  var brake = opt_break === undefined ? true : opt_break;
  var rampUp = 0;
  var rampDown = 0;
  this.send_(this.commands.moveSteps(motor_left | motor_right, steps, opt_speed,
      rampUp, rampDown, brake));
};


/**
 * Rotates the motors for the predefined specific steps.
 * @param {!number} steps
 * @param {number=} opt_step_speed
 * @param {boolean=} opt_break
 * @export
 */
cwc.protocol.ev3.Api.prototype.rotateSteps = function(steps,
    opt_step_speed, opt_break) {
  var brake = opt_break === undefined ? true : opt_break;
  var motor_left = this.actor[this.deviceName.LARGE_MOTOR];
  var motor_right = this.actor[this.deviceName.LARGE_MOTOR_OPT];
  this.send_(this.commands.rotateSteps(motor_left, motor_right, steps,
    opt_step_speed, opt_step_speed, 0, 0, brake));
};


/**
 * @param {!ArrayBuffer} buffer
 * @private
 */
cwc.protocol.ev3.Api.prototype.send_ = function(buffer) {
  if (!this.device) {
    return;
  }
  this.device.send(buffer);
};


/**
 * @param {!cwc.protocol.ev3.InputPort} port
 * @param {!string} type
 * @private
 */
cwc.protocol.ev3.Api.prototype.updateDeviceType_ = function(port, type) {
  if (type == cwc.protocol.ev3.DeviceType.NONE) {
    return;
  }
  var typeNormalized = type.replace(/-/g, '_').replace(/ /g, '');
  if (!(typeNormalized in cwc.protocol.ev3.DeviceType)) {
    if (type == 'PORT ERROR') {
      console.error('Received Port Error on port', port, '!');
      console.error('PLEASE RESTART THE EV3 TO FIX THIS ERROR !');
    } else if (type == 'TERMINAL') {
      console.warn('Please check connection on port', port, '!');
    } else {
      console.warn('Unknown device type "', type, '" on port', port, '!');
    }
    return;
  }
  var deviceTypeName = cwc.protocol.ev3.DeviceType[typeNormalized];
  var deviceName = deviceTypeName;
  var deviceMode = 0;
  var deviceCss = '';
  switch (deviceTypeName) {
    case cwc.protocol.ev3.DeviceType.IR_PROX:
      deviceName = this.deviceName.IR_SENSOR;
      deviceMode = cwc.protocol.ev3.IrSensorMode.PROXIMITY;
      break;
    case cwc.protocol.ev3.DeviceType.IR_SEEK:
      deviceName = this.deviceName.IR_SENSOR;
      deviceMode = cwc.protocol.ev3.IrSensorMode.SEEK;
      break;
    case cwc.protocol.ev3.DeviceType.IR_REMOTE:
      deviceName = this.deviceName.IR_SENSOR;
      deviceMode = cwc.protocol.ev3.IrSensorMode.REMOTECONTROL;
      break;
    case cwc.protocol.ev3.DeviceType.TOUCH:
      deviceName = this.deviceName.TOUCH_SENSOR;
      break;
    case cwc.protocol.ev3.DeviceType.COL_REFLECT:
      deviceName = this.deviceName.COLOR_SENSOR;
      deviceMode = cwc.protocol.ev3.ColorSensorMode.REFLECTIVE;
      break;
    case cwc.protocol.ev3.DeviceType.COL_AMBIENT:
      deviceName = this.deviceName.COLOR_SENSOR;
      deviceMode = cwc.protocol.ev3.ColorSensorMode.AMBIENT;
      break;
    case cwc.protocol.ev3.DeviceType.COL_COLOR:
      deviceName = this.deviceName.COLOR_SENSOR;
      deviceMode = cwc.protocol.ev3.ColorSensorMode.COLOR;
      deviceCss = 'color';
      break;
    case cwc.protocol.ev3.DeviceType.US_DIST_CM:
      deviceName = this.deviceName.ULTRASONIC_SENSOR;
      deviceMode = cwc.protocol.ev3.UltrasonicSensorMode.DIST_CM;
      break;
    case cwc.protocol.ev3.DeviceType.US_DIST_IN:
      deviceName = this.deviceName.ULTRASONIC_SENSOR;
      deviceMode = cwc.protocol.ev3.UltrasonicSensorMode.DIST_IN;
      break;
    case cwc.protocol.ev3.DeviceType.US_DIST_LISTEN:
      deviceName = this.deviceName.ULTRASONIC_SENSOR;
      deviceMode = cwc.protocol.ev3.UltrasonicSensorMode.DIST_LISTEN;
      break;
    case cwc.protocol.ev3.DeviceType.GYRO_ANG:
      deviceName = this.deviceName.GYRO_SENSOR;
      deviceMode = cwc.protocol.ev3.GyroMode.ANGLE;
      break;
    case cwc.protocol.ev3.DeviceType.GYRO_RATE:
      deviceName = this.deviceName.GYRO_SENSOR;
      deviceMode = cwc.protocol.ev3.GyroMode.RATE;
      break;
    case cwc.protocol.ev3.DeviceType.L_MOTOR_DEG:
      deviceName = this.deviceName.LARGE_MOTOR;
      deviceMode = cwc.protocol.ev3.MotorMode.DEGREE;
      break;
    case cwc.protocol.ev3.DeviceType.L_MOTOR_ROT:
      deviceName = this.deviceName.LARGE_MOTOR;
      deviceMode = cwc.protocol.ev3.MotorMode.ROTATION;
      break;
    case cwc.protocol.ev3.DeviceType.M_MOTOR_DEG:
      deviceName = this.deviceName.MEDIUM_MOTOR;
      deviceMode = cwc.protocol.ev3.MotorMode.DEGREE;
      break;
    case cwc.protocol.ev3.DeviceType.M_MOTOR_ROT:
      deviceName = this.deviceName.MEDIUM_MOTOR;
      deviceMode = cwc.protocol.ev3.MotorMode.ROTATION;
      break;
    default:
      return;
  }

  // Support of two devices of the same type.
  if (deviceName in this.deviceInfo && this.deviceInfo[deviceName] != port) {
    switch (deviceName) {
      case this.deviceName.LARGE_MOTOR:
        deviceName = this.deviceName.LARGE_MOTOR_OPT;
        break;
      case this.deviceName.MEDIUM_MOTOR:
        deviceName = this.deviceName.MEDIUM_MOTOR_OPT;
        break;
      case this.deviceName.TOUCH_SENSOR:
        deviceName = this.deviceName.TOUCH_SENSOR_OPT;
        break;
    }
  }

  console.log('Found', deviceName, 'with mode', deviceMode, 'on port', port);
  this.deviceData[port] = new cwc.protocol.ev3.Device(deviceName,
      deviceMode, 0, deviceCss);
  this.eventHandler.dispatchEvent(
      new cwc.protocol.ev3.Events.ChangedDevices(this.deviceData));
  this.deviceInfo[deviceName] = port;

  switch (port) {
    case cwc.protocol.ev3.InputPort.ONE:
    case cwc.protocol.ev3.InputPort.TWO:
    case cwc.protocol.ev3.InputPort.THREE:
    case cwc.protocol.ev3.InputPort.FOUR:
      this.sensor[deviceName] = port;
      this.getSensorData(port);
      break;
    case cwc.protocol.ev3.InputPort.A:
    case cwc.protocol.ev3.InputPort.B:
    case cwc.protocol.ev3.InputPort.C:
    case cwc.protocol.ev3.InputPort.D:
      this.actor[deviceName] = Math.pow(2, (port - 0x10));
      this.getActorData(port);
      break;
  }
  this.monitoring.start(this.deviceInfo);
};


/**
 * @param {!cwc.protocol.ev3.InputPort} port
 * @param {!number} value
 * @param {cwc.protocol.ev3.DeviceName=} opt_device_name
 * @private
 */
cwc.protocol.ev3.Api.prototype.updateDeviceData_ = function(port, value,
    opt_device_name) {
  if (this.deviceData[port] && this.deviceData[port].getValue() != value) {
    this.deviceData[port].setValue(value);
    this.monitoring.update();
    switch (opt_device_name) {
      case this.deviceName.COLOR_SENSOR:
        this.eventHandler.dispatchEvent(
            cwc.protocol.ev3.Events.ColorSensorValue(value, port));
        break;
      case this.deviceName.GYRO_SENSOR:
        this.eventHandler.dispatchEvent(
            cwc.protocol.ev3.Events.GyroSensorValue(value, port));
        break;
      case this.deviceName.IR_SENSOR:
        this.eventHandler.dispatchEvent(
            cwc.protocol.ev3.Events.IrSensorValue(value, port));
        break;
      case this.deviceName.ULTRASONIC_SENSOR:
        this.eventHandler.dispatchEvent(
            cwc.protocol.ev3.Events.UltrasonicSensorValue(value, port));
        break;
      case this.deviceName.TOUCH_SENSOR:
        this.eventHandler.dispatchEvent(
            cwc.protocol.ev3.Events.TouchSensorValue(value, port));
        break;
      case this.deviceName.TOUCH_SENSOR_OPT:
        this.eventHandler.dispatchEvent(
            cwc.protocol.ev3.Events.TouchSensorOptValue(value, port));
        break;
      case this.deviceName.LARGE_MOTOR:
        this.eventHandler.dispatchEvent(
            cwc.protocol.ev3.Events.TouchSensorValue(value, port));
        break;
      case this.deviceName.MEDIUM_MOTOR:
        this.eventHandler.dispatchEvent(
            cwc.protocol.ev3.Events.MediumMotorValue(value, port));
        break;
      case this.deviceName.LARGE_MOTOR_OPT:
        this.eventHandler.dispatchEvent(
            cwc.protocol.ev3.Events.LargeMotorOptValue(value, port));
        break;
      case this.deviceName.MEDIUM_MOTOR_OPT:
        this.eventHandler.dispatchEvent(
            cwc.protocol.ev3.Events.MediumMotorOptValue(value, port));
        break;
    }
  }
};


/**
 * Handles received data and callbacks from the Bluetooth socket.
 * @param {Array<number>|ArrayBuffer|ArrayBufferView|null|number} raw_data
 * @private
 */
cwc.protocol.ev3.Api.prototype.handleOnReceive_ = function(raw_data) {
  if (!raw_data) {
    console.error('Received no data!');
    return;
  }
  var data = data = new Uint8Array(raw_data);
  if (data.length < 5) {
    console.error('Received data are to small!');
    return;
  }
  var value = 0;
  var result = 0;
  var callback = data[2];
  var port = data[3];

  // Handles the different callback types.
  switch (callback) {
    case this.callbackType.FIRMWARE:
      value = data.subarray(5, 5 + 16);
      this.firmware = (String.fromCharCode.apply(null, value)).trim();
      console.log('EV3 Firmware Version', this.firmware);
      break;
    case this.callbackType.BATTERY:
      value = data.subarray(5, 5 + 16);
      this.battery = value;
      console.log('EV3 Battery level', this.battery);
      break;
    case this.callbackType.DEVICE_NAME:
      value = data.subarray(5, 5 + 0x7E);
      var type = (String.fromCharCode.apply(null, value)).trim();
      this.updateDeviceType_(port, type);
      break;
    case this.callbackType.DEVICE_PCT_VALUE:
    case this.callbackType.DEVICE_RAW_VALUE:
      value = data[5];
      this.updateDeviceData_(port, value, this.deviceData[port].getName());
      break;
    case this.callbackType.DEVICE_SI_VALUE:
      value = new Uint8Array([data[5], data[6], data[7], data[8]]);
      result = (new Float32Array(value.buffer)[0]).toFixed(1);
      this.updateDeviceData_(port, result, this.deviceData[port].getName());
      break;
    case this.callbackType.ACTOR_VALUE:
      value = new Uint8Array([data[5], data[6], data[7], data[8]]);
      result = new Int32Array(value.buffer)[0];
      this.updateDeviceData_(port, result, this.deviceData[port].getName());
      break;
  }
};
