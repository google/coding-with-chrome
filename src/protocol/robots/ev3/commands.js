/**
 * @fileoverview Byte commands for the EV3 communication.
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
goog.provide('cwc.protocol.ev3.Commands');

goog.require('cwc.protocol.ev3.Buffer');
goog.require('cwc.protocol.ev3.CallbackType');
goog.require('cwc.protocol.ev3.Command');


/**
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.ev3.Commands = function() {
  /** @private {Object} */
  this.cache_ = {};
};


/**
 * @param {!string} name
 * @param {...Object|number} args
 * @return {Object}
 */
cwc.protocol.ev3.Commands.prototype.getCache = function(name, ...args) {
  let key = this.getCacheName(name, args);
  if (key in this.cache_) {
    return this.cache_[key];
  }
  return null;
};


/**
 * @param {!string} name
 * @param {!Object} data
 * @param {...Object|number} args
 * @return {Object}
 */
cwc.protocol.ev3.Commands.prototype.setCache = function(name, data, ...args) {
  let key = this.getCacheName(name, args);
  this.cache_[key] = data;
  return data;
};


/**
 * @param {!string} name
 * @param {!Object} args
 * @return {!string}
 */
cwc.protocol.ev3.Commands.prototype.getCacheName = function(name, args) {
  return name + ':' + JSON.stringify(
    Array.prototype.slice.call(/** @type {IArrayLike} */ (args)));
};


/**
 * Reads current battery level.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.ev3.Commands.prototype.getBattery = function() {
  let buffer = new cwc.protocol.ev3.Buffer(0, 0,
      cwc.protocol.ev3.CallbackType.BATTERY);
  buffer.writeCommand(cwc.protocol.ev3.Command.UI.READ.BATTERY);
  buffer.writeIndex();
  return buffer.readSigned();
};


/**
 * Reads the device type.
 * @param {!cwc.protocol.ev3.InputPort} port
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.ev3.Commands.prototype.getDeviceType = function(port) {
  let buffer = new cwc.protocol.ev3.Buffer(0x7F, 0,
      cwc.protocol.ev3.CallbackType.DEVICE_NAME);
  buffer.writeCommand(cwc.protocol.ev3.Command.INPUT.DEVICE.GETDEVICENAME);
  buffer.writeNullByte();
  buffer.writePort(port);
  buffer.writeByte(0x7F);
  buffer.writeIndex();
  return buffer.readSigned();
};


/**
 * Reads current EV3 firmware.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.ev3.Commands.prototype.getFirmware = function() {
  let buffer = new cwc.protocol.ev3.Buffer(0x10, 0,
      cwc.protocol.ev3.CallbackType.FIRMWARE);
  buffer.writeCommand(cwc.protocol.ev3.Command.UI.READ.FIRMWARE);
  buffer.writeByte(0x10);
  buffer.writeIndex();
  return buffer.readSigned();
};


/**
 * Get the current raw data of the sensor.
 * @param {!cwc.protocol.ev3.InputPort} port
 * @param {number=} mode
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.ev3.Commands.prototype.getActorData = function(port, mode = 0) {
  let cache = this.getCache('getActorData', port, mode);
  if (cache) {
    return /** @type {!ArrayBuffer} */ (cache);
  }
  let buffer = new cwc.protocol.ev3.Buffer(0x04, 0,
      cwc.protocol.ev3.CallbackType.ACTOR_VALUE);
  buffer.writeCommand(cwc.protocol.ev3.Command.INPUT.DEVICE.READRAW);
  buffer.writeNullByte();
  buffer.writePort(port);
  buffer.writeNullByte();
  buffer.writeByte(mode);
  buffer.writeSingleByte();
  buffer.writeIndex();
  return /** @type {!ArrayBuffer} */ (this.setCache('getActorData',
    buffer.readSigned(), port, mode));
};


/**
 * Gets the current data of the sensor.
 * @param {!cwc.protocol.ev3.InputPort} port
 * @param {number=} mode
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.ev3.Commands.prototype.getSensorData = function(port, mode = 0) {
  let cache = this.getCache('getSensorData', port, mode);
  if (cache) {
    return /** @type {!ArrayBuffer} */ (cache);
  }
  let buffer = new cwc.protocol.ev3.Buffer(0x04, 0,
     cwc.protocol.ev3.CallbackType.DEVICE_RAW_VALUE);
  buffer.writeCommand(cwc.protocol.ev3.Command.INPUT.DEVICE.READRAW);
  buffer.writeNullByte();
  buffer.writePort(port);
  buffer.writeNullByte();
  buffer.writeByte(mode);
  buffer.writeSingleByte();
  buffer.writeIndex();
  return /** @type {!ArrayBuffer} */ (this.setCache('getSensorData',
    buffer.readSigned(), port, mode));
};


/**
 * Get the current data of the sensor in Pct.
 * @param {!cwc.protocol.ev3.InputPort} port
 * @param {number=} mode
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.ev3.Commands.prototype.getSensorDataPct = function(port,
    mode = 0) {
  let cache = this.getCache('getSensorDataPct', port, mode);
  if (cache) {
    return /** @type {!ArrayBuffer} */ (cache);
  }
  let buffer = new cwc.protocol.ev3.Buffer(0x04, 0,
      cwc.protocol.ev3.CallbackType.DEVICE_PCT_VALUE);
  buffer.writeCommand(cwc.protocol.ev3.Command.INPUT.DEVICE.READPCT);
  buffer.writeNullByte();
  buffer.writePort(port);
  buffer.writeNullByte();
  buffer.writeByte(mode);
  buffer.writeSingleByte();
  buffer.writeIndex();
  return /** @type {!ArrayBuffer} */ (this.setCache('getSensorDataPct',
    buffer.readSigned(), port, mode));
};


/**
 * Get the current data of the sensor in Si.
 * @param {!cwc.protocol.ev3.InputPort} port
 * @param {number=} mode
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.ev3.Commands.prototype.getSensorDataSi = function(port, mode = 0) {
  let cache = this.getCache('getSensorDataSi', port, mode);
  if (cache) {
    return /** @type {!ArrayBuffer} */ (cache);
  }
  let buffer = new cwc.protocol.ev3.Buffer(0x04, 0,
      cwc.protocol.ev3.CallbackType.DEVICE_SI_VALUE);
  buffer.writeCommand(cwc.protocol.ev3.Command.INPUT.DEVICE.READSI);
  buffer.writeNullByte();
  buffer.writePort(port);
  buffer.writeNullByte();
  buffer.writeByte(mode);
  buffer.writeSingleByte();
  buffer.writeIndex();
  return /** @type {!ArrayBuffer} */ (this.setCache('getSensorDataSi',
    buffer.readSigned(), port, mode));
};


/**
 * @param {cwc.protocol.ev3.LedColor} color
 * @param {cwc.protocol.ev3.LedMode=} mode
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.ev3.Commands.prototype.setLed = function(color,
    mode = cwc.protocol.ev3.LedMode.NORMAL) {
  let buffer = new cwc.protocol.ev3.Buffer();
  buffer.writeCommand(cwc.protocol.ev3.Command.UI.WRITE.LED);
  buffer.writeByte(color + mode);
  return buffer.readSigned();
};


/**
 * @param {!cwc.protocol.ev3.OutputPort|number} ports
 * @param {!number} power (-100 - 100)
 * @param {boolean=} opt_brake Stop current movements.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.ev3.Commands.prototype.movePower = function(ports, power,
    opt_brake) {
  let buffer = new cwc.protocol.ev3.Buffer();
  buffer.writeCommand(cwc.protocol.ev3.Command.OUTPUT.STOP);
  buffer.writeNullByte();
  buffer.writePorts(ports);
  buffer.writeByte(opt_brake ? 1 : 0);

  buffer.writeCommand(cwc.protocol.ev3.Command.OUTPUT.POWER);
  buffer.writeNullByte();
  buffer.writePorts(ports);
  buffer.writeByte(power);

  buffer.writeCommand(cwc.protocol.ev3.Command.OUTPUT.START);
  buffer.writeNullByte();
  buffer.writePorts(ports);
  return buffer.readSigned();
};


/**
 * @param {!cwc.protocol.ev3.OutputPort} port_left Left motor port.
 * @param {!cwc.protocol.ev3.OutputPort} port_right Right motor port.
 * @param {!number} power_left Power value for left motor. (-100 - 100)
 * @param {!number} power_right Power value for right motor. (-100 - 100)
 * @param {boolean=} opt_brake Stop current movements.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.ev3.Commands.prototype.rotatePower = function(port_left,
    port_right, power_left, power_right, opt_brake) {
  let buffer = new cwc.protocol.ev3.Buffer();
  buffer.writeCommand(cwc.protocol.ev3.Command.OUTPUT.STOP);
  buffer.writeNullByte();
  buffer.writePorts(port_left | port_right);
  buffer.writeByte(opt_brake ? 1 : 0);

  buffer.writeCommand(cwc.protocol.ev3.Command.OUTPUT.POWER);
  buffer.writeNullByte();
  buffer.writePort(port_left);
  buffer.writeByte(power_left);

  buffer.writeCommand(cwc.protocol.ev3.Command.OUTPUT.POWER);
  buffer.writeNullByte();
  buffer.writePort(port_right);
  buffer.writeByte(-power_right);

  buffer.writeCommand(cwc.protocol.ev3.Command.OUTPUT.START);
  buffer.writeNullByte();
  buffer.writePorts(port_left | port_right);
  return buffer.readSigned();
};


/**
 * Moves the motors for the predefined specific steps.
 * @param {!cwc.protocol.ev3.OutputPort|number} ports
 * @param {!number} steps
 * @param {number=} opt_speed (-100 - 100)
 * @param {number=} opt_ramp_up (-100 - 100)
 * @param {number=} opt_ramp_down (-100 - 100)
 * @param {boolean=} opt_brake Stop current movements.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.ev3.Commands.prototype.moveSteps = function(ports, steps,
    opt_speed, opt_ramp_up, opt_ramp_down, opt_brake) {
  let buffer = new cwc.protocol.ev3.Buffer();

  buffer.writeCommand(cwc.protocol.ev3.Command.OUTPUT.STOP);
  buffer.writeNullByte();
  buffer.writePorts(ports);
  buffer.writeByte(opt_brake ? 1 : 0);

  buffer.writeCommand(cwc.protocol.ev3.Command.OUTPUT.STEP.SPEED);
  buffer.writeNullByte();
  buffer.writePorts(ports);
  buffer.writeByte(opt_speed || 50);
  buffer.writeInt(opt_ramp_up || 0);
  buffer.writeInt(steps);
  buffer.writeInt(opt_ramp_down || 0);
  buffer.writeByte(opt_brake ? 1 : 0);
  return buffer.readSigned();
};


/**
 * Rotates the motors for the predefined specific steps.
 * @param {!cwc.protocol.ev3.OutputPort} port_left
 * @param {!cwc.protocol.ev3.OutputPort} port_right
 * @param {!number} steps
 * @param {number=} opt_speed_left
 * @param {number=} opt_speed_right
 * @param {number=} opt_ramp_up
 * @param {number=} opt_ramp_down
 * @param {boolean=} opt_brake
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.ev3.Commands.prototype.rotateSteps = function(port_left,
    port_right, steps, opt_speed_left, opt_speed_right, opt_ramp_up,
    opt_ramp_down, opt_brake) {
  let buffer = new cwc.protocol.ev3.Buffer();

  buffer.writeCommand(cwc.protocol.ev3.Command.OUTPUT.STOP);
  buffer.writeNullByte();
  buffer.writePorts(port_left | port_right);
  buffer.writeByte(opt_brake ? 1 : 0);

  buffer.writeCommand(cwc.protocol.ev3.Command.OUTPUT.STEP.SPEED);
  buffer.writeNullByte();
  buffer.writePort(port_left);
  buffer.writeByte(opt_speed_left || 50);
  buffer.writeInt(opt_ramp_up || 0);
  buffer.writeInt(steps);
  buffer.writeInt(opt_ramp_down || 0);
  buffer.writeByte(opt_brake ? 1 : 0);

  buffer.writeCommand(cwc.protocol.ev3.Command.OUTPUT.STEP.SPEED);
  buffer.writeNullByte();
  buffer.writePort(port_right);
  buffer.writeByte(-opt_speed_right || -50);
  buffer.writeInt(opt_ramp_up || 0);
  buffer.writeInt(steps);
  buffer.writeInt(opt_ramp_down || 0);
  buffer.writeByte(opt_brake ? 1 : 0);
  return buffer.readSigned();
};


/**
 * Rotates the defined motors for the predefined specific steps.
 * @param {!cwc.protocol.ev3.OutputPort} ports
 * @param {!number} steps
 * @param {number=} opt_speed
 * @param {number=} opt_ramp_up
 * @param {number=} opt_ramp_down
 * @param {boolean=} opt_brake
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.ev3.Commands.prototype.customRotateSteps = function(ports, steps,
    opt_speed, opt_ramp_up, opt_ramp_down, opt_brake) {
  let buffer = new cwc.protocol.ev3.Buffer();

  buffer.writeCommand(cwc.protocol.ev3.Command.OUTPUT.STOP);
  buffer.writeNullByte();
  buffer.writePorts(ports);
  buffer.writeByte(opt_brake ? 1 : 0);

  buffer.writeCommand(cwc.protocol.ev3.Command.OUTPUT.STEP.SPEED);
  buffer.writeNullByte();
  buffer.writePort(ports);
  buffer.writeByte(opt_speed || 50);
  buffer.writeInt(opt_ramp_up || 0);
  buffer.writeInt(steps);
  buffer.writeInt(opt_ramp_down || 0);
  buffer.writeByte(opt_brake ? 1 : 0);
  return buffer.readSigned();
};


/**
 * @param {cwc.protocol.ev3.OutputPort=} port
 * @param {number=} brake Stop current movements.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.ev3.Commands.prototype.stop = function(
    port = cwc.protocol.ev3.OutputPort.ALL, brake = 0) {
  let buffer = new cwc.protocol.ev3.Buffer();
  buffer.writeCommand(cwc.protocol.ev3.Command.OUTPUT.STOP);
  buffer.writeNullByte();
  buffer.writePorts(port);
  buffer.writeByte(brake);
  return buffer.readSigned();
};


/**
 * Clears the EV3 unit.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.ev3.Commands.prototype.clear = function() {
  let buffer = new cwc.protocol.ev3.Buffer();
  buffer.writeCommand(cwc.protocol.ev3.Command.INPUT.DEVICE.CLEARALL);
  buffer.writeNullByte();
  return buffer.readSigned();
};


/**
 * Plays a tone with the defined volume, frequency and duration.
 * @param {!number} frequency
 * @param {number=} opt_duration
 * @param {number=} opt_volume
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.ev3.Commands.prototype.playTone = function(frequency, opt_duration,
    opt_volume) {
  let buffer = new cwc.protocol.ev3.Buffer();
  buffer.writeCommand(cwc.protocol.ev3.Command.SOUND.TONE);
  buffer.writeByte(Math.min(100, Math.max(0, opt_volume || 100)));
  buffer.writeShort(frequency);
  buffer.writeShort(Math.max(opt_duration || 50, 50));
  return buffer.readSigned();
};


/**
 * Plays the selected sound file.
 * @param {!string} file_name
 * @param {number=} opt_volume
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.ev3.Commands.prototype.playSound = function(file_name,
    opt_volume) {
  let buffer = new cwc.protocol.ev3.Buffer();
  buffer.writeCommand(cwc.protocol.ev3.Command.SOUND.PLAY);
  buffer.writeByte(Math.min(100, Math.max(0, opt_volume || 100)));
  buffer.writeString(file_name);
  return buffer.readSigned();
};


/**
 * Clears the EV3 display.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.ev3.Commands.prototype.drawClean = function() {
  let buffer = new cwc.protocol.ev3.Buffer();
  buffer.writeCommand(cwc.protocol.ev3.Command.UI.DRAW.CLEAN);
  return buffer.readSigned();
};


/**
 * Updates the EV3 display.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.ev3.Commands.prototype.drawUpdate = function() {
  let buffer = new cwc.protocol.ev3.Buffer();
  buffer.writeCommand(cwc.protocol.ev3.Command.UI.DRAW.UPDATE);
  return buffer.readSigned();
};


/**
 * Shows the selected image file.
 * @param {!string} file_name
 * @param {number=} opt_x
 * @param {number=} opt_y
 * @param {number=} opt_color
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.ev3.Commands.prototype.drawImage = function(file_name,
    opt_x, opt_y, opt_color) {
  let buffer = new cwc.protocol.ev3.Buffer();
  let filename = '/home/root/lms2012/prjs/' + file_name.replace('.rgf', '');
  buffer.writeCommand(cwc.protocol.ev3.Command.UI.DRAW.BMPFILE);
  buffer.writeByte(opt_color == undefined ? 0x01 : opt_color);
  buffer.writeInt(Math.min(177, Math.max(0, opt_x || 0)));
  buffer.writeInt(Math.min(127, Math.max(0, opt_y || 0)));
  buffer.writeString(filename);
  return buffer.readSigned();
};


/**
 * Draws a line.
 * @param {!number} x1 (0-177)
 * @param {!number} y1 (0-127)
 * @param {!number} x2 (0-177)
 * @param {!number} y2 (0-127)
 * @param {number=} opt_color (0 = white, 1 = black)
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.ev3.Commands.prototype.drawLine = function(x1, y1, x2, y2,
    opt_color) {
  let buffer = new cwc.protocol.ev3.Buffer();
  buffer.writeCommand(cwc.protocol.ev3.Command.UI.DRAW.LINE);
  buffer.writeByte(opt_color == undefined ? 0x01 : opt_color);
  buffer.writeInt(Math.min(177, Math.max(0, x1)));
  buffer.writeInt(Math.min(127, Math.max(0, y1)));
  buffer.writeInt(Math.min(177, Math.max(0, x2)));
  buffer.writeInt(Math.min(127, Math.max(0, y2)));
  return buffer.readSigned();
};
