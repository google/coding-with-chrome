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

goog.require('cwc.protocol.bluetooth.Api');
goog.require('cwc.protocol.ev3.BrickButton');
goog.require('cwc.protocol.ev3.Buffer');
goog.require('cwc.protocol.ev3.ColorSensorMode');
goog.require('cwc.protocol.ev3.Command');
goog.require('cwc.protocol.ev3.CommandType');
goog.require('cwc.protocol.ev3.Device');
goog.require('cwc.protocol.ev3.DeviceName');
goog.require('cwc.protocol.ev3.DeviceType');
goog.require('cwc.protocol.ev3.Events');
goog.require('cwc.protocol.ev3.GyroSensorMode');
goog.require('cwc.protocol.ev3.InputPort');
goog.require('cwc.protocol.ev3.IrSensorMode');
goog.require('cwc.protocol.ev3.LedColor');
goog.require('cwc.protocol.ev3.LedMode');
goog.require('cwc.protocol.ev3.Monitoring');
goog.require('cwc.protocol.ev3.MotorMode');
goog.require('cwc.protocol.ev3.OutputPort');
goog.require('cwc.protocol.ev3.Polarity');

goog.require('cwc.utils.Helper');
goog.require('cwc.utils.StackEntry');

goog.require('goog.Timer');
goog.require('goog.events');
goog.require('goog.events.EventTarget');


goog.scope(function() {
/* Local Aliases. */
var BrickButton = cwc.protocol.ev3.BrickButton;
var CallbackType = cwc.protocol.ev3.CallbackType;
var CallbackTarget = cwc.protocol.ev3.CallbackTarget;
var ColorSensorMode = cwc.protocol.ev3.ColorSensorMode;
var Command = cwc.protocol.ev3.Command;
var CommandType = cwc.protocol.ev3.CommandType;
var DeviceName = cwc.protocol.ev3.DeviceName;
var DeviceType = cwc.protocol.ev3.DeviceType;
var Events = cwc.protocol.ev3.Events;
var GyroSensorMode = cwc.protocol.ev3.GyroSensorMode;
var InputPort = cwc.protocol.ev3.InputPort;
var IrSensorMode = cwc.protocol.ev3.IrSensorMode;
var LedColor = cwc.protocol.ev3.LedColor;
var LedMode = cwc.protocol.ev3.LedMode;
var MotorMode = cwc.protocol.ev3.MotorMode;
var OutputPort = cwc.protocol.ev3.OutputPort;
var Polarity = cwc.protocol.ev3.Polarity;



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.ev3.Api = function(helper) {
  /** @type {string} */
  this.name = 'EV3';

  /** @type {number} */
  this.stepSpeed = 40;

  /** @type {number} */
  this.stepRotationRatio45 = 6.4;

  /** @type {number} */
  this.stepRotationRatio90 = 6.5;

  /** @type {number} */
  this.stepRotationRatio180 = 6.6;

  /** @type {number} */
  this.stepRotationRatio360 = 6.7;

  /** @type {boolean} */
  this.prepared = false;

  /** @type {string} */
  this.autoConnectName = 'EV3';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {cwc.protocol.bluetooth.Device} */
  this.device = null;

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
};


/**
 * AutoConnects the EV3 unit.
 * @return {boolean}
 * @export
 */
cwc.protocol.ev3.Api.prototype.autoConnect = function() {
  var bluetoothInstance = this.helper.getInstance('bluetooth', true);
  var device = bluetoothInstance.getDeviceByName(this.autoConnectName);
  if (device) {
    if (device.isConnected()) {
      return this.connect(device.getAddress());
    } else {
      this.helper.showInfo('Connecting EV3 unit...');
      var connectEvent = function(socket_id, address) {
        this.connect(address);
      };
      return device.connect(connectEvent.bind(this));
    }
  }

  this.helper.showError('Was unable to auto connect to', this.autoConnectName);
  return false;
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
    console.error('EV3 unit is not ready yet ...');
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
 * @export
 */
cwc.protocol.ev3.Api.prototype.prepare = function() {
  this.device.setDataHandler(this.handleOnReceive.bind(this));
  this.monitoring.init();
  this.playTone(2000, 200, 25);
  this.getFirmware();
  this.getDevices();
  this.playTone(3000, 200, 50);
  this.prepared = true;
};


/**
 * Disconnects the EV3 unit.
 */
cwc.protocol.ev3.Api.prototype.disconnect = function() {
  this.device.disconnect();
  this.cleanUp();
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
  if (this.bluetooth) {
    this.bluetooth.clearSenderStack('EV3');
  }
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
  return this.deviceData[this.deviceInfo[DeviceName.COLOR_SENSOR]];
};


/**
 * @return {Object}
 */
cwc.protocol.ev3.Api.prototype.getIrSensorData = function() {
  return this.deviceData[this.deviceInfo[DeviceName.IR_SENSOR]];
};


/**
 * @return {Object}
 */
cwc.protocol.ev3.Api.prototype.getTouchSensorData = function() {
  return this.deviceData[this.deviceInfo[DeviceName.TOUCH_SENSOR]];
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
  this.deviceData[this.deviceInfo[DeviceName.COLOR_SENSOR]].setMode(mode);
  this.deviceData[this.deviceInfo[DeviceName.COLOR_SENSOR]].setCss(
      (mode == ColorSensorMode.COLOR) ? 'color' : 'default');
};


/**
 * @param {cwc.protocol.ev3.IrSensorMode} mode
 */
cwc.protocol.ev3.Api.prototype.setIrSensorMode = function(mode) {
  this.deviceData[this.deviceInfo[DeviceName.IR_SENSOR]].setMode(mode);
};


/**
 * @param {!number} speed
 */
cwc.protocol.ev3.Api.prototype.setStepSpeed = function(speed) {
  console.log('Set default step speed to', speed);
  this.stepSpeed = speed;
};


/**
 * Detects all connected devices.
 */
cwc.protocol.ev3.Api.prototype.getDevices = function() {
  this.monitoring.stop();

  // Sensor ports
  this.getDeviceType(InputPort.ONE);
  this.getDeviceType(InputPort.TWO);
  this.getDeviceType(InputPort.THREE);
  this.getDeviceType(InputPort.FOUR);

  // Actor ports
  this.getDeviceType(InputPort.A);
  this.getDeviceType(InputPort.B);
  this.getDeviceType(InputPort.C);
  this.getDeviceType(InputPort.D);
};


/**
 * @param {!cwc.protocol.ev3.InputPort} port
 * @param {!string} type
 */
cwc.protocol.ev3.Api.prototype.updateDeviceType = function(port,
    type) {
  if (type == DeviceType.NONE) {
    return;
  }
  var typeNormalized = type.replace(/-/g, '_');
  if (!(typeNormalized in DeviceType)) {
    if (type == 'PORT ERROR') {
      console.error('Recieved Port Error on port', port, '!');
      console.error('PLEASE RESTART THE EV3 TO FIX THIS ERROR !');
    } else {
      console.warn('Unknown device type "', type, '" on port', port, '!');
    }
    return;
  }
  var deviceTypeName = DeviceType[typeNormalized];
  var deviceName = deviceTypeName;
  var deviceMode = 0;
  var deviceCss = '';
  var sensorGroup = true;
  switch (deviceTypeName) {
    case DeviceType.IR_PROX:
      deviceName = DeviceName.IR_SENSOR;
      deviceMode = IrSensorMode.PROXIMITY;
      break;
    case DeviceType.IR_SEEK:
      deviceName = DeviceName.IR_SENSOR;
      deviceMode = IrSensorMode.SEEK;
      break;
    case DeviceType.IR_REMOTE:
      deviceName = DeviceName.IR_SENSOR;
      deviceMode = IrSensorMode.REMOTECONTROL;
      break;
    case DeviceType.TOUCH:
      deviceName = DeviceName.TOUCH_SENSOR;
      break;
    case DeviceType.COL_REFLECT:
      deviceName = DeviceName.COLOR_SENSOR;
      deviceMode = ColorSensorMode.REFLECTIVE;
      break;
    case DeviceType.COL_AMBIENT:
      deviceName = DeviceName.COLOR_SENSOR;
      deviceMode = ColorSensorMode.AMBIENT;
      break;
    case DeviceType.COL_COLOR:
      deviceName = DeviceName.COLOR_SENSOR;
      deviceMode = ColorSensorMode.COLOR;
      deviceCss = 'color';
      break;
    case DeviceType.L_MOTOR_DEG:
      deviceName = DeviceName.LARGE_MOTOR;
      deviceMode = MotorMode.DEGREE;
      sensorGroup = false;
      break;
    case DeviceType.L_MOTOR_ROT:
      deviceName = DeviceName.LARGE_MOTOR;
      deviceMode = MotorMode.ROTATION;
      sensorGroup = false;
      break;
    case DeviceType.M_MOTOR_DEG:
      deviceName = DeviceName.MEDIUM_MOTOR;
      deviceMode = MotorMode.DEGREE;
      sensorGroup = false;
      break;
    case DeviceType.M_MOTOR_ROT:
      deviceName = DeviceName.MEDIUM_MOTOR;
      deviceMode = MotorMode.ROTATION;
      sensorGroup = false;
      break;
  }

  if (deviceName in this.deviceInfo && this.deviceInfo[deviceName] != port) {
    if (deviceName == DeviceName.LARGE_MOTOR) {
      deviceName = DeviceName.LARGE_MOTOR_OPT;
    } else if (deviceName == DeviceName.MEDIUM_MOTOR) {
      deviceName = DeviceName.MEDIUM_MOTOR_OPT;
    }
  }

  console.log('Found', deviceName, 'with mode', deviceMode, 'on port', port);
  this.deviceData[port] = new cwc.protocol.ev3.Device(deviceName,
      deviceMode, 0, deviceCss);
  this.eventHandler.dispatchEvent(Events.CHANGED_DEVICES);

  if (sensorGroup) {
    this.deviceInfo[deviceName] = port;
    this.getSensorData(port);
  } else {
    this.deviceInfo[deviceName] = port;
    this.getActorData(port);
  }
  this.monitoring.start(this.deviceInfo);
};


/**
 * @param {!cwc.protocol.ev3.InputPort} port
 * @param {!number} value
 * @param {cwc.protocol.ev3.DeviceName=} opt_device_name
 */
cwc.protocol.ev3.Api.prototype.updateDeviceData = function(port,
    value, opt_device_name) {
  if (this.deviceData[port] && this.deviceData[port].getValue() != value) {
    this.deviceData[port].setValue(value);
    this.monitoring.update();
    switch (opt_device_name) {
      case DeviceName.COLOR_SENSOR:
        this.eventHandler.dispatchEvent(Events.COLOR_SENSOR_VALUE_CHANGED);
        break;
      case DeviceName.IR_SENSOR:
        this.eventHandler.dispatchEvent(Events.IR_SENSOR_VALUE_CHANGED);
        break;
      case DeviceName.TOUCH_SENSOR:
        this.eventHandler.dispatchEvent(Events.TOUCH_SENSOR_VALUE_CHANGED);
        break;
    }
  }
};


/**
 * @param {!cwc.protocol.ev3.Buffer} buffer
 * @param {number=} opt_delay
 */
cwc.protocol.ev3.Api.prototype.send = function(buffer, opt_delay) {
  if (!this.device) {
	return;
  }
  var data = buffer.readSigned();
  if (opt_delay) {
    this.device.sendDelayed(data, opt_delay);
  } else {
    this.device.send(data);
  }
};


/**
 * Reads current EV3 battery level.
 */
cwc.protocol.ev3.Api.prototype.getBattery = function() {
  var buffer = new cwc.protocol.ev3.Buffer(0x10, 0, CallbackType.BATTERY);
  buffer.writeCommand(Command.UI.READ.BATTERY);
  buffer.writeIndex();
  this.send(buffer);
};


/**
 * Reads current EV3 firmware.
 */
cwc.protocol.ev3.Api.prototype.getFirmware = function() {
  var buffer = new cwc.protocol.ev3.Buffer(0x10, 0, CallbackType.FIRMWARE);
  buffer.writeCommand(Command.UI.READ.FIRMWARE);
  buffer.writeByte(0x10);
  buffer.writeIndex();
  this.send(buffer);
};


/**
 * Reads the device type.
 * @param {!cwc.protocol.ev3.InputPort} port
 * @export
 */
cwc.protocol.ev3.Api.prototype.getDeviceType = function(port) {
  var buffer = new cwc.protocol.ev3.Buffer(0x7F, 0, CallbackType.DEVICE_NAME);
  buffer.writeCommand(Command.INPUT.DEVICE.GETDEVICENAME);
  buffer.writeNullByte();
  buffer.writePort(port);
  buffer.writeByte(0x7F);
  buffer.writeIndex();
  this.send(buffer);
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
  var device = this.deviceData[port];
  var buffer = new cwc.protocol.ev3.Buffer(0x04, 0,
      CallbackType.DEVICE_SI_VALUE);
  buffer.writeCommand(Command.INPUT.DEVICE.READSI);
  buffer.writeNullByte();
  buffer.writePort(port);
  buffer.writeNullByte();
  buffer.writeByte(device.getMode());
  buffer.writeSingleByte();
  buffer.writeIndex();
  this.send(buffer);
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
  var device = this.deviceData[port];
  var buffer = new cwc.protocol.ev3.Buffer(0x04, 0,
      CallbackType.DEVICE_PCT_VALUE);
  buffer.writeCommand(Command.INPUT.DEVICE.READPCT);
  buffer.writeNullByte();
  buffer.writePort(port);
  buffer.writeNullByte();
  buffer.writeByte(device.getMode());
  buffer.writeSingleByte();
  buffer.writeIndex();
  this.send(buffer);
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
  var device = this.deviceData[port];
  var buffer = new cwc.protocol.ev3.Buffer(0x04, 0,
      CallbackType.ACTOR_VALUE);
  buffer.writeCommand(Command.INPUT.DEVICE.READSI);
  buffer.writeNullByte();
  buffer.writePort(port);
  buffer.writeNullByte();
  buffer.writeByte(device.getMode());
  buffer.writeSingleByte();
  buffer.writeIndex();
  this.send(buffer);
};


/**
 * @param {cwc.protocol.ev3.LedColor} color
 * @param {cwc.protocol.ev3.LedMode=} opt_mode
 */
cwc.protocol.ev3.Api.prototype.setLed = function(color, opt_mode) {
  var led = color + (opt_mode || 0);
  var buffer = new cwc.protocol.ev3.Buffer();
  buffer.writeCommand(Command.UI.WRITE.LED);
  buffer.writeByte(led);
  this.send(buffer, 10);
};


/**
 * @param {!number} power
 * @param {boolean=} opt_invert Inverts the motor directions.
 */
cwc.protocol.ev3.Api.prototype.movePower = function(power,
    opt_invert) {
  var brake = 1;
  var ports = OutputPort.B | OutputPort.C;
  var buffer = new cwc.protocol.ev3.Buffer();
  buffer.writeCommand(Command.OUTPUT.STOP);
  buffer.writeNullByte();
  buffer.writePorts(ports);
  buffer.writeByte(brake);
  buffer.writeCommand(Command.OUTPUT.POWER);
  buffer.writeNullByte();
  buffer.writePorts(ports);
  buffer.writeByte((opt_invert) ? -power : power);
  buffer.writeCommand(Command.OUTPUT.START);
  buffer.writeNullByte();
  buffer.writePorts(ports);
  this.send(buffer);
};


/**
 * @param {!number} power Main power value.
 * @param {number=} opt_power Optional second power value.
 * @param {boolean=} opt_invert Inverts the motor directions.
 */
cwc.protocol.ev3.Api.prototype.rotatePower = function(power,
    opt_power, opt_invert) {
  var brake = 1;
  var power1 = (opt_invert) ? -power : power;
  var power2 = ((opt_invert) ? opt_power : -opt_power) || -power1;
  var ports = OutputPort.B | OutputPort.C;
  var buffer = new cwc.protocol.ev3.Buffer();
  buffer.writeCommand(Command.OUTPUT.STOP);
  buffer.writeNullByte();
  buffer.writePorts(ports);
  buffer.writeByte(brake);
  buffer.writeCommand(Command.OUTPUT.POWER);
  buffer.writeNullByte();
  buffer.writePort(OutputPort.B);
  buffer.writeByte(power1);
  buffer.writeCommand(Command.OUTPUT.POWER);
  buffer.writeNullByte();
  buffer.writePort(OutputPort.C);
  buffer.writeByte(power2);
  buffer.writeCommand(Command.OUTPUT.START);
  buffer.writeNullByte();
  buffer.writePorts(ports);
  this.send(buffer);
};


/**
 * @param {cwc.protocol.ev3.InputPort=} opt_port
 */
cwc.protocol.ev3.Api.prototype.stop = function(opt_port) {
  var brake = 1;
  var buffer = new cwc.protocol.ev3.Buffer();
  buffer.writeCommand(Command.OUTPUT.STOP);
  buffer.writeNullByte();
  buffer.writePorts(opt_port || OutputPort.ALL);
  buffer.writeByte(brake);
  this.send(buffer);
};


/**
 * @param {cwc.protocol.ev3.InputPort=} opt_port
 */
cwc.protocol.ev3.Api.prototype.delayedStop = function(opt_port) {
  var brake = 1;
  var buffer = new cwc.protocol.ev3.Buffer();
  buffer.writeCommand(Command.OUTPUT.STOP);
  buffer.writeNullByte();
  buffer.writePorts(opt_port || OutputPort.ALL);
  buffer.writeByte(brake);
  this.send(buffer, 500);
};


/**
 * Clears the EV3 unit.
 */
cwc.protocol.ev3.Api.prototype.clear = function() {
  var buffer = new cwc.protocol.ev3.Buffer();
  buffer.writeCommand(Command.INPUT.DEVICE.CLEARALL);
  buffer.writeNullByte();
  this.send(buffer);
};


/**
 * Shows the selected image file.
 * @param {!string} file_name
 * @export
 */
cwc.protocol.ev3.Api.prototype.showImage = function(file_name) {
  var buffer = new cwc.protocol.ev3.Buffer();
  buffer.writeCommand(Command.UI.DRAW.BMPFILE);
  buffer.writeString(file_name);
  this.send(buffer, 100);
};


/**
 * Plays a tone with the defined volume, frequency and duration.
 * @param {!number} frequency
 * @param {number=} opt_duration
 * @param {number=} opt_volume
 * @export
 */
cwc.protocol.ev3.Api.prototype.playTone = function(frequency,
    opt_duration, opt_volume) {
  var duration = Math.max(opt_duration, 50) || 50;
  var volume = Math.min(opt_volume || 100, 100);
  var buffer = new cwc.protocol.ev3.Buffer();
  buffer.writeCommand(Command.SOUND.TONE);
  buffer.writeByte(volume);
  buffer.writeShort(frequency);
  buffer.writeShort(duration);
  this.send(buffer, duration + 10);
};


/**
 * Plays the selected sound file.
 * @param {!string} file_name
 * @param {number=} opt_volume
 * @export
 */
cwc.protocol.ev3.Api.prototype.playSound = function(file_name,
    opt_volume) {
  var buffer = new cwc.protocol.ev3.Buffer();
  buffer.writeCommand(Command.SOUND.PLAY);
  buffer.writeByte(Math.min(100, Math.max(0, opt_volume)));
  buffer.writeString(file_name);
  this.send(buffer, 100);
};


/**
 * Moves the servo motor for the predefined specific steps.
 * @param {!number} steps
 * @param {boolean=} opt_invert Inverts the motor directions.
 * @export
 */
cwc.protocol.ev3.Api.prototype.moveServo = function(steps,
    opt_invert) {
  var brake = 1;
  var speed = (opt_invert) ? this.stepSpeed * -1 : this.stepSpeed;
  var port = OutputPort.A;
  var rampUp = 0;
  var rampDown = 0;
  var buffer = new cwc.protocol.ev3.Buffer();
  buffer.writeCommand(Command.OUTPUT.STOP);
  buffer.writeNullByte();
  buffer.writePort(port);
  buffer.writeByte(brake);
  buffer.writeCommand(Command.OUTPUT.STEP.SPEED);
  buffer.writeNullByte();
  buffer.writePort(port);
  buffer.writeByte(speed);
  buffer.writeInt(rampUp);
  buffer.writeInt(steps);
  buffer.writeInt(rampDown);
  buffer.writeByte(brake);
  this.send(buffer, steps * 4);
};


/**
 * Moves the motors for the predefined specific steps.
 * @param {!number} steps
 * @param {boolean=} opt_invert Inverts the motor directions.
 * @param {number=} opt_step_speed
 * @export
 */
cwc.protocol.ev3.Api.prototype.moveSteps = function(steps,
    opt_invert, opt_step_speed) {
  var speed = (opt_invert) ? this.stepSpeed * -1 : this.stepSpeed;
  var ports = OutputPort.B | OutputPort.C;
  var rampUp = 0;
  var rampDown = 0;
  var brake = 1;
  var buffer = new cwc.protocol.ev3.Buffer();
  buffer.writeCommand(Command.OUTPUT.STOP);
  buffer.writeNullByte();
  buffer.writePorts(ports);
  buffer.writeByte(brake);
  buffer.writeCommand(Command.OUTPUT.STEP.SPEED);
  buffer.writeNullByte();
  buffer.writePorts(ports);
  buffer.writeByte(speed);
  buffer.writeInt(rampUp);
  buffer.writeInt(steps);
  buffer.writeInt(rampDown);
  buffer.writeByte(brake);
  this.send(buffer, steps * 4);
};


/**
 * Rotates the motors for the predefined specific steps.
 * @param {!number} angle
 * @param {boolean=} opt_invert Inverts the motor directions.
 * @param {number=} opt_step_speed
 * @param {number=} opt_angle_ratio
 * @export
 */
cwc.protocol.ev3.Api.prototype.rotateAngle = function(angle,
    opt_invert, opt_step_speed, opt_angle_ratio) {
  var ratio = opt_angle_ratio;
  if (!ratio) {
    if (angle <= 45) {
      ratio = this.stepRotationRatio45;
    } else if (angle <= 90) {
      ratio = this.stepRotationRatio90;
    } else if (angle <= 180) {
      ratio = this.stepRotationRatio180;
    } else {
      ratio = this.stepRotationRatio360;
    }
  }
  var steps = ratio * angle;
  var speed = (opt_invert) ? this.stepSpeed * -1 : this.stepSpeed;
  var rampUp = 0;
  var rampDown = 0;
  var brake = 1;
  var ports = OutputPort.B | OutputPort.C;
  var buffer = new cwc.protocol.ev3.Buffer();
  buffer.writeCommand(Command.OUTPUT.STOP);
  buffer.writeNullByte();
  buffer.writePorts(ports);
  buffer.writeByte(brake);
  buffer.writeCommand(Command.OUTPUT.STEP.SPEED);
  buffer.writeNullByte();
  buffer.writePort(OutputPort.B);
  buffer.writeByte(speed);
  buffer.writeInt(rampUp);
  buffer.writeInt(steps);
  buffer.writeInt(rampDown);
  buffer.writeByte(brake);
  buffer.writeCommand(Command.OUTPUT.STEP.SPEED);
  buffer.writeNullByte();
  buffer.writePort(OutputPort.C);
  buffer.writeByte(-speed);
  buffer.writeInt(rampUp);
  buffer.writeInt(steps);
  buffer.writeInt(rampDown);
  buffer.writeByte(brake);
  this.send(buffer, steps * 6);
};


/**
 * Handles received data and callbacks from the Bluetooth socket.
 * @param {Array<number>|ArrayBuffer|ArrayBufferView|null|number} raw_data
 */
cwc.protocol.ev3.Api.prototype.handleOnReceive = function(
    raw_data) {
  if (!raw_data) {
    console.error('Recieved no data!');
    return;
  }
  var data = data = new Uint8Array(raw_data);
  if (data.length < 5) {
    console.error('Recieved data are to small!');
    return;
  }

  var value = 0;
  var result = 0;
  var callback = data[2];
  var port = data[3];

  // Handles the different callback types.
  switch (callback) {
    case CallbackType.FIRMWARE:
      value = data.subarray(5, 5 + 16);
      this.firmware = (String.fromCharCode.apply(null, value)).trim();
      console.log('EV3 Firmware Version', this.firmware);
      break;
    case CallbackType.BATTERY:
      value = data.subarray(5, 5 + 16);
      this.battery = value;
      console.log('EV3 Battery level', this.battery);
      break;
    case CallbackType.DEVICE_NAME:
      value = data.subarray(5, 5 + 0x7E);
      var type = (String.fromCharCode.apply(null, value)).trim();
      this.updateDeviceType(port, type);
      break;
    case CallbackType.DEVICE_SI_VALUE:
    case CallbackType.DEVICE_PCT_VALUE:
      value = data[5];
      this.updateDeviceData(port, value, this.deviceData[port].getName());
      break;
    case CallbackType.ACTOR_VALUE:
      value = new Uint8Array([data[5], data[6], data[7], data[8]]);
      result = new Int32Array(value.buffer)[0];
      this.updateDeviceData(port, result, this.deviceData[port].getName());
      break;
  }
};


/**
 * Local echo command for testing.
 * @param {string} value
 */
cwc.protocol.ev3.Api.prototype.echo = function(value) {
  console.log('EV3 echo:', value);
};

});  // goog.scope
