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
goog.require('cwc.protocol.lego.ev3.Handler');
goog.require('cwc.protocol.lego.ev3.InputPort');
goog.require('cwc.protocol.lego.ev3.IrSensorMode');
goog.require('cwc.protocol.lego.ev3.LedColor');
goog.require('cwc.protocol.lego.ev3.LedMode');
goog.require('cwc.protocol.lego.ev3.Monitoring');
goog.require('cwc.protocol.lego.ev3.MotorMode');
goog.require('cwc.protocol.lego.ev3.OutputPort');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.StreamReader');

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

  /** @type {!cwc.protocol.lego.ev3.Handler} */
  this.handler = new cwc.protocol.lego.ev3.Handler();

  /** @type {!cwc.protocol.lego.ev3.Commands} */
  this.commands = new cwc.protocol.lego.ev3.Commands();

  /** @type {Object} */
  this.cache_ = {};

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

  /** @private {!goog.events.EventTarget} */
  this.eventHandler_ = new goog.events.EventTarget();

  /** @type {!cwc.protocol.lego.ev3.Monitoring} */
  this.monitoring = new cwc.protocol.lego.ev3.Monitoring(this);

  /** @private {!cwc.utils.StreamReader} */
  this.streamReader_ = new cwc.utils.StreamReader().setMinimumSize(5);
};


/**
 * Connects the EV3 unit.
 * @param {!cwc.protocol.bluetooth.classic.Device} device
 * @return {boolean} Was able to prepare and connect to the EV3.
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.connect = function(device) {
  if (!device) {
    return false;
  } else if (!device.isConnected()) {
    console.error('EV3 unit is not ready yet...');
    return false;
  }

  if (!this.prepared) {
    console.log('Prepare EV3 bluetooth api for', device.getAddress());
    this.eventHandler_.dispatchEvent(cwc.protocol.lego.ev3.Events.connect(
      'Prepare EV3 api for' + device.getAddress(), 2));
    this.device = device;
    this.prepare();
    this.eventHandler_.dispatchEvent(cwc.protocol.lego.ev3.Events.connect(
      'Ready ...', 3));
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
  this.events_.listen(this.device.getEventHandler(),
    cwc.protocol.bluetooth.classic.Events.Type.ON_RECEIVE,
    this.handleOnReceive_.bind(this));
  this.monitoring.init();
  this.playTone(2000, 200, 25);
  this.exec('getFirmware');
  this.exec('getBattery');
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
 * Executer for the default handler commands.
 * @param {!string} command
 * @param {Object=} data
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.exec = function(command, data = {}) {
  this.send_(this.handler[command](data));
};


/**
 * Executer for the runner profiles with parameters in revert order.
 * @param {!Object} data
 * @param {!string} command
 * @export
 */
cwc.protocol.lego.ev3.Api.prototype.execRunnerProfile = function(data,
    command) {
  this.exec(command, data);
};


/**
 * @return {!cwc.protocol.sphero.classic.Handler}
 */
cwc.protocol.lego.ev3.Api.prototype.getRunnerProfile = function() {
  return this.handler;
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
 * @return {!goog.events.EventTarget}
 */
cwc.protocol.lego.ev3.Api.prototype.getEventHandler = function() {
  return this.eventHandler_;
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
  this.exec('getDeviceType', {'port': cwc.protocol.lego.ev3.InputPort.ONE});
  this.exec('getDeviceType', {'port': cwc.protocol.lego.ev3.InputPort.TWO});
  this.exec('getDeviceType', {'port': cwc.protocol.lego.ev3.InputPort.THREE});
  this.exec('getDeviceType', {'port': cwc.protocol.lego.ev3.InputPort.FOUR});

  // Actor ports
  this.actor = {};
  this.actor[cwc.protocol.lego.ev3.DeviceName.MEDIUM_MOTOR] =
    cwc.protocol.lego.ev3.OutputPort.A;
  this.actor[cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR] =
    cwc.protocol.lego.ev3.OutputPort.B;
  this.actor[cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR_OPT] =
    cwc.protocol.lego.ev3.OutputPort.C;
  this.exec('getDeviceType', {'port': cwc.protocol.lego.ev3.InputPort.A});
  this.exec('getDeviceType', {'port': cwc.protocol.lego.ev3.InputPort.B});
  this.exec('getDeviceType', {'port': cwc.protocol.lego.ev3.InputPort.C});
  this.exec('getDeviceType', {'port': cwc.protocol.lego.ev3.InputPort.D});
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
  let typeNormalized = type.replace(/-/g, '_').replace(/\s/g, '');
  if (!(typeNormalized in cwc.protocol.lego.ev3.DeviceType)) {
    if (type == 'PORT ERROR') {
      console.error('Received Port Error on port', port, '!');
      console.error('PLEASE RESTART THE EV3 TO FIX THIS ERROR !');
    } else if (type == 'TERMINAL') {
      console.warn('Please check connection on port', port, '!');
    } else {
      console.warn('Unknown device "' + typeNormalized + '" on port', port);
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
  this.eventHandler_.dispatchEvent(
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
        this.eventHandler_.dispatchEvent(
            cwc.protocol.lego.ev3.Events.colorSensorValue(value, port));
        break;
      case cwc.protocol.lego.ev3.DeviceName.GYRO_SENSOR:
        this.eventHandler_.dispatchEvent(
            cwc.protocol.lego.ev3.Events.gyroSensorValue(value, port));
        break;
      case cwc.protocol.lego.ev3.DeviceName.IR_SENSOR:
        this.eventHandler_.dispatchEvent(
            cwc.protocol.lego.ev3.Events.irSensorValue(value, port));
        break;
      case cwc.protocol.lego.ev3.DeviceName.ULTRASONIC_SENSOR:
        this.eventHandler_.dispatchEvent(
            cwc.protocol.lego.ev3.Events.ultrasonicSensorValue(value, port));
        break;
      case cwc.protocol.lego.ev3.DeviceName.TOUCH_SENSOR:
        this.eventHandler_.dispatchEvent(
            cwc.protocol.lego.ev3.Events.touchSensorValue(value, port));
        break;
      case cwc.protocol.lego.ev3.DeviceName.TOUCH_SENSOR_OPT:
        this.eventHandler_.dispatchEvent(
            cwc.protocol.lego.ev3.Events.touchSensorOptValue(value, port));
        break;
      case cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR:
        this.eventHandler_.dispatchEvent(
            cwc.protocol.lego.ev3.Events.touchSensorValue(value, port));
        break;
      case cwc.protocol.lego.ev3.DeviceName.MEDIUM_MOTOR:
        this.eventHandler_.dispatchEvent(
            cwc.protocol.lego.ev3.Events.mediumMotorValue(value, port));
        break;
      case cwc.protocol.lego.ev3.DeviceName.LARGE_MOTOR_OPT:
        this.eventHandler_.dispatchEvent(
            cwc.protocol.lego.ev3.Events.largeMotorOptValue(value, port));
        break;
      case cwc.protocol.lego.ev3.DeviceName.MEDIUM_MOTOR_OPT:
        this.eventHandler_.dispatchEvent(
            cwc.protocol.lego.ev3.Events.mediumMotorOptValue(value, port));
        break;
    }
  }
};


/**
 * Handles received data and callbacks from the Bluetooth socket.
 * @param {Event} e
 * @private
 */
cwc.protocol.lego.ev3.Api.prototype.handleOnReceive_ = function(e) {
  let dataBuffer = this.streamReader_.read(e.data);
  if (!dataBuffer) {
    return;
  }

  // Verify packet length.
  let packetLength = cwc.utils.ByteTools.bytesToInt(
    [dataBuffer[1], dataBuffer[0]]) + 2;
  if (dataBuffer.length < packetLength) {
    this.streamReader_.addBuffer(dataBuffer);
    return;
  } else if (dataBuffer.length > packetLength) {
    dataBuffer = dataBuffer.slice(0, packetLength);
    this.streamReader_.addBuffer(dataBuffer.slice(packetLength));
  }

  let callback =
    /** @type {cwc.protocol.lego.ev3.CallbackType} */ (dataBuffer[2]);
  let port = /** @type {cwc.protocol.lego.ev3.InputPort} */ (dataBuffer[3]);
  let data = dataBuffer.slice(5);

  // Handles the different callback types.
  switch (callback) {
    case cwc.protocol.lego.ev3.CallbackType.FIRMWARE:
      this.firmware = cwc.utils.ByteTools.toUTF8(data);
      console.log('EV3 Firmware Version', this.firmware);
      break;
    case cwc.protocol.lego.ev3.CallbackType.BATTERY:
      console.log('EV3 Battery level', data);
      break;
    case cwc.protocol.lego.ev3.CallbackType.DEVICE_NAME:
      this.updateDeviceType_(port, cwc.utils.ByteTools.toString(data));
      break;
    case cwc.protocol.lego.ev3.CallbackType.DEVICE_PCT_VALUE:
    case cwc.protocol.lego.ev3.CallbackType.DEVICE_RAW_VALUE:
      if (this.deviceData[port]) {
        this.updateDeviceData_(port, data[0], this.deviceData[port].getName());
      }
      break;
    case cwc.protocol.lego.ev3.CallbackType.DEVICE_SI_VALUE:
      this.updateDeviceData_(
        port, cwc.utils.ByteTools.bytesToFloat32(data).toFixed(1),
        this.deviceData[port].getName());
      break;
    case cwc.protocol.lego.ev3.CallbackType.ACTOR_VALUE:
      this.updateDeviceData_(
        port, cwc.utils.ByteTools.bytesToInt32Alternative(data),
        this.deviceData[port].getName());
      break;
  }
};
