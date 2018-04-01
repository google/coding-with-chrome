/**
 * @fileoverview Handles the communication with Makeblock mBots.
 *
 * This api allows to read and control the Makeblock mBot kits with
 * bluetooth connection.
 *
 * @license Copyright 2016 Shenzhen Maker Works Co, Ltd. All Rights Reserved.
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
 * @author wangyu@makeblock.cc (Yu Wang)
 */
goog.provide('cwc.protocol.makeblock.mbotRanger.Api');

goog.require('cwc.protocol.bluetooth.classic.Events');
goog.require('cwc.protocol.makeblock.mbotRanger.Commands');
goog.require('cwc.protocol.makeblock.mbotRanger.IndexType');
goog.require('cwc.protocol.makeblock.mbotRanger.Monitoring');
goog.require('cwc.protocol.makeblock.mbotRanger.Port');
goog.require('cwc.protocol.makeblock.mbotRanger.Slot');
goog.require('cwc.utils.ByteTools');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.NumberTools');
goog.require('cwc.utils.StreamReader');

goog.require('goog.events.EventTarget');


/**
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.makeblock.mbotRanger.Api = function() {
  /** @type {!cwc.protocol.makeblock.mbotRanger.Commands} */
  this.commands = new cwc.protocol.makeblock.mbotRanger.Commands();

  /** @type {string} */
  this.name = 'mBot Ranger';

  /** @type {Object} */
  this.device = null;

  /** @type {boolean} */
  this.prepared = false;

  /** @type {Object} */
  this.sensorData = {};

  /** @type {!cwc.protocol.makeblock.mbotRanger.Monitoring} */
  this.monitoring = new cwc.protocol.makeblock.mbotRanger.Monitoring(this);

  /** @type {goog.events.EventTarget} */
  this.eventHandler = new goog.events.EventTarget();

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

  /** @private {Object} */
  this.sensorDataCache_ = {};

  /** @private {!cwc.utils.StreamReader} */
  this.streamReader_ = new cwc.utils.StreamReader()
    .setHeaders([0xff, 0x55])
    .setFooter([0x0d, 0x0a])
    .setMinimumSize(4);
};


/**
 * Connects the mbot.
 * @param {!cwc.protocol.bluetooth.classic.Device} device
 * @return {boolean} Was able to prepare and connect to the mbot.
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.connect = function(device) {
  if (!device) {
    console.error('mBot Ranger is not ready yet...');
    return false;
  }

  if (!this.prepared && device.isConnected()) {
    console.log('Preparing bluetooth api for', device.getAddress());
    this.device = device;
    this.prepare();
    // this.runTest();
  }

  return true;
};


/**
 * @return {!boolean}
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.isConnected = function() {
  return (this.device && this.device.isConnected()) ? true : false;
};


/**
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.prepare = function() {
  this.events_.listen(this.device.getEventHandler(),
    cwc.protocol.bluetooth.classic.Events.Type.ON_RECEIVE,
    this.handleOnReceive_.bind(this));
  this.playTone(524, 240);
  this.playTone(584, 240);
  this.setRGBLED(0, 0, 0, 0);
  this.getVersion();
  this.prepared = true;
};


/**
 * Disconnects the mBot.
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.disconnect = function() {
  if (this.device) {
    this.device.disconnect();
  }
  this.cleanUp();
};


/**
 * Basic cleanup for the mBot.
 * apparently this method is called by runner
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.cleanUp = function() {
  console.log('Clean up mBot Ranger...');
  this.reset();
  this.monitoring.stop();
};


/**
 * Resets the mBot connection and cache.
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.reset = function() {
  this.sensorData = {};
  this.sensorDataCache_ = {};
  if (this.device) {
    this.stop();
    this.device.reset();
  }
};


/**
 * @return {goog.events.EventTarget}
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.getEventHandler = function() {
  return this.eventHandler;
};


/**
 * @return {!cwc.protocol.makeblock.mbotRanger.Monitoring}
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.getMonitoring = function() {
  return this.monitoring;
};


/**
 * Powers the motor.
 * @param {!number} power (-255 - 255)
 * @param {cwc.protocol.makeblock.mbotRanger.Slot=} opt_slot
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.movePower = function(power,
    opt_slot) {
  if (opt_slot === undefined) {
    let motorPower = cwc.utils.NumberTools.minMax(power, -130, 130);
    this.send_(this.commands.movePower(-motorPower,
      cwc.protocol.makeblock.mbotRanger.Slot.ONE));
    this.send_(this.commands.movePower(motorPower,
      cwc.protocol.makeblock.mbotRanger.Slot.TWO));
  } else {
    this.send_(this.commands.movePower(power, opt_slot));
  }
};


/**
 * Sets left motor power
 * @param  {!number} power 0-255
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.setLeftMotorPower = function(
    power) {
  this.send_(this.commands.movePower(power,
    cwc.protocol.makeblock.mbotRanger.Slot.ONE));
};


/**
 * Sets right motor power
 * @param  {!number} power 0-255
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.setRightMotorPower = function(
    power) {
  this.send_(this.commands.movePower(power,
    cwc.protocol.makeblock.mbotRanger.Slot.TWO));
};


/**
 * Powers the motor.
 * @param {!number} power (-255 - 255)
 * @param {cwc.protocol.makeblock.mbotRanger.Slot=} opt_slot
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.rotatePower = function(power,
    opt_slot) {
  if (opt_slot === undefined) {
    let motorPower = cwc.utils.NumberTools.minMax(power, -130, 130);
    this.send_(this.commands.movePower(motorPower,
      cwc.protocol.makeblock.mbotRanger.Slot.ONE));
    this.send_(this.commands.movePower(motorPower,
      cwc.protocol.makeblock.mbotRanger.Slot.TWO));
  } else {
    this.send_(this.commands.movePower(power, opt_slot));
  }
};


/**
 * Rotates the motor for the given steps.
 * @param {!number} steps (−32768 - 32.767)
 * @param {number=} power (0-180)
 * @param {cwc.protocol.makeblock.mbotRanger.Slot=} slot
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.moveSteps = function(steps,
    power = 90, slot) {
  if (slot === undefined) {
    let motorPower = cwc.utils.NumberTools.minMax(power, -130, 130);
    this.send_(this.commands.moveSteps(-steps, motorPower,
      cwc.protocol.makeblock.mbotRanger.Slot.ONE));
    this.send_(this.commands.moveSteps(steps, motorPower,
      cwc.protocol.makeblock.mbotRanger.Slot.TWO));
  } else {
    this.send_(this.commands.moveSteps(steps, power, slot));
  }
};


/**
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.readUltrasonicSensor = function(
) {
  this.send_(this.commands.readUltrasonicSensor());
};


/**
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.readLineFollowerSensor =
function() {
  this.send_(this.commands.readLineFollowerSensor());
};


/**
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.readLightSensor1 = function() {
  this.send_(this.commands.readLightSensor1());
};


/**
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.readLightSensor2 = function() {
  this.send_(this.commands.readLightSensor2());
};


/**
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.readTemperatureSensor =
function() {
  this.send_(this.commands.readTemperatureSensor());
};


/**
 * Sets led light on the top of the mbot
 * @param {!number} red           red value (0-255)
 * @param {!number} green         green value (0-255)
 * @param {!number} blue          blue value (0-255)
 * @param {number=} opt_index   0 for all lights; 1 for left, 2 for right
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.setRGBLED = function(red,
    green, blue, opt_index) {
  this.send_(this.commands.setRGBLED(red, green, blue, opt_index));
};


/**
 * Plays a tone through mBot's buzzer
 * @param {!number} frequency frequency of the tone to play
 * @param {!number} duration duration of the tone, in ms
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.playTone = function(frequency,
    duration) {
  this.send_(this.commands.playTone(frequency, duration));
};


/**
 * Stops the mBot.
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.stop = function() {
  this.setRGBLED(0, 0, 0, 0);
  this.movePower(0);
  this.rotatePower(0);
};


/**
 * Device version
 * @export
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.getVersion = function() {
  this.send_(this.commands.getVersion());
};


/**
 * Convert float bytes to float value in robot response;
 * @param  {Array} dataBytes bytes from the robot
 * @return {number} float value
 * @private
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.parseFloatBytes_ = function(
    dataBytes) {
  if (!dataBytes) {
    return 0;
  }
  let intValue = this.fourBytesToInt_(
    dataBytes[3], dataBytes[2], dataBytes[1], dataBytes[0]);
  let result = parseFloat(this.intBitsToFloat_(intValue).toFixed(2));
  return result;
};


/**
 * Convert four bytes (b4b3b2b1) to a single int.
 * @param {number} b1
 * @param {number} b2
 * @param {number} b3
 * @param {number} b4
 * @return {number} the result int
 * @private
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.fourBytesToInt_ = function(b1,
    b2, b3, b4) {
  return ( b1 << 24 ) + ( b2 << 16 ) + ( b3 << 8 ) + b4;
};


/**
 * Convert from int (in byte form) to float
 * @param {number} num   the input int value
 * @return {number}     the result as float
 * @private
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.intBitsToFloat_ = function(
    num) {
  /* s 为符号（sign）；e 为指数（exponent）；m 为有效位数（mantissa）*/
  let sign = ( num >> 31 ) == 0 ? 1 : -1;
  let exponent = ( num >> 23 ) & 0xff;
  let mantissa = ( exponent == 0 ) ?
    ( num & 0x7fffff ) << 1 : ( num & 0x7fffff ) | 0x800000;
  return sign * mantissa * Math.pow( 2, exponent - 150 );
};


/**
 * Handles async packets from the Bluetooth socket.
 * @param {Event} e
 * @private
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.handleOnReceive_ = function(e) {
  let dataBuffer = this.streamReader_.readByHeaderAndFooter(e.data);

  // Ignore empty and OK packages with 0xff, 0x55, 0x0d, 0x0a
  if (!dataBuffer || dataBuffer.length === 4) {
    return;
  }

  let len = dataBuffer[1];
  let indexType = dataBuffer[2];
  let dataType = dataBuffer[3];
  let data = dataBuffer.slice(4);
  switch (indexType) {
    case cwc.protocol.makeblock.mbotRanger.IndexType.VERSION:
      console.log('mBot Firmware', new TextDecoder('utf-8').decode(data));
      break;
    case cwc.protocol.makeblock.mbotRanger.IndexType.ULTRASONIC:
    case cwc.protocol.makeblock.mbotRanger.IndexType.LINEFOLLOWER:
    case cwc.protocol.makeblock.mbotRanger.IndexType.LIGHTSENSOR_1:
    case cwc.protocol.makeblock.mbotRanger.IndexType.LIGHTSENSOR_2:
    case cwc.protocol.makeblock.mbotRanger.IndexType.TEMPERATURE:
      this.handleSensorData_(indexType, data, 4);
      break;
    case cwc.protocol.makeblock.mbotRanger.IndexType.ACK:
      break;
    default:
      console.log('UNKNOWN index', len, indexType, dataType, dataBuffer);
  }
};


/**
 * Handles the different type of sensor data.
 * @param {!cwc.protocol.makeblock.mbotRanger.IndexType} index_type
 * @param {Array} data
 * @param {number=} opt_data_size
 * @private
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.handleSensorData_ = function(
    index_type, data, opt_data_size) {
  if (opt_data_size && data.length < opt_data_size) {
    return;
  }

  if (this.sensorDataCache_[index_type] !== undefined &&
      cwc.utils.ByteTools.isArrayBufferEqual(
        this.sensorDataCache_[index_type], data)) {
    return;
  }
  this.sensorDataCache_[index_type] = data;

  switch (index_type) {
    case cwc.protocol.makeblock.mbotRanger.IndexType.LIGHTSENSOR_1:
    case cwc.protocol.makeblock.mbotRanger.IndexType.LIGHTSENSOR_2:
      this.dispatchSensorEvent_(index_type,
        cwc.protocol.makeblock.mbotRanger.Events.LightnessSensorValue, {
          'sensor_1': this.parseFloatBytes_(
            this.sensorDataCache_[
              cwc.protocol.makeblock.mbotRanger.IndexType.LIGHTSENSOR_1]),
          'sensor_2': this.parseFloatBytes_(
            this.sensorDataCache_[
              cwc.protocol.makeblock.mbotRanger.IndexType.LIGHTSENSOR_2]),
        });
      break;
    case cwc.protocol.makeblock.mbotRanger.IndexType.LINEFOLLOWER:
      this.dispatchSensorEvent_(index_type,
        cwc.protocol.makeblock.mbotRanger.Events.LinefollowerSensorValue, {
          'left': data[3] >= 64,
          'right': data[2] >= 64,
          'raw': data,
        });
      break;
    case cwc.protocol.makeblock.mbotRanger.IndexType.TEMPERATURE:
      this.dispatchSensorEvent_(index_type,
        cwc.protocol.makeblock.mbotRanger.Events.TemperatureSensorValue,
        this.parseFloatBytes_(data));
      break;
    case cwc.protocol.makeblock.mbotRanger.IndexType.ULTRASONIC:
      this.dispatchSensorEvent_(index_type,
        cwc.protocol.makeblock.mbotRanger.Events.UltrasonicSensorValue,
        this.parseFloatBytes_(data));
      break;
  }
};


/**
 * Dispatch event for sensor data change.
 * @param {!cwc.protocol.makeblock.mbotRanger.IndexType} index
 * @param {!Function} event
 * @param {Object|number} data
 * @private
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.dispatchSensorEvent_ = function(
    index, event, data) {
  this.sensorData[index] = data;
  this.eventHandler.dispatchEvent(event(data));
};


/**
 * @param {!ArrayBuffer} buffer
 * @private
 */
cwc.protocol.makeblock.mbotRanger.Api.prototype.send_ = function(buffer) {
  if (!this.device) {
    return;
  }
  this.device.send(buffer);
};
