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
goog.provide('cwc.protocol.lego.ev3.Commands');

goog.require('cwc.protocol.lego.ev3.Buffer');
goog.require('cwc.protocol.lego.ev3.CallbackType');
goog.require('cwc.protocol.lego.ev3.Command');


/**
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.lego.ev3.Commands = function() {
  /** @private {Object} */
  this.cache_ = {};
};


/**
 * @param {!string} name
 * @param {...Object|number} args
 * @return {Object}
 */
cwc.protocol.lego.ev3.Commands.prototype.getCache = function(name, ...args) {
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
cwc.protocol.lego.ev3.Commands.prototype.setCache = function(name, data,
    ...args) {
  let key = this.getCacheName(name, args);
  this.cache_[key] = data;
  return data;
};


/**
 * @param {!string} name
 * @param {!Object} args
 * @return {!string}
 */
cwc.protocol.lego.ev3.Commands.prototype.getCacheName = function(name, args) {
  return name + ':' + JSON.stringify(
    Array.prototype.slice.call(/** @type {IArrayLike} */ (args)));
};


/**
 * Reads current battery level.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.prototype.getBattery = function() {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader(cwc.protocol.lego.ev3.CallbackType.BATTERY, 0)
    .writeCommand(cwc.protocol.lego.ev3.Command.UI.READ.BATTERY)
    .writeIndex()
    .readSigned();
};


/**
 * Reads the device type.
 * @param {!cwc.protocol.lego.ev3.InputPort} port
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.prototype.getDeviceType = function(port) {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader(cwc.protocol.lego.ev3.CallbackType.DEVICE_NAME, 0x7F)
    .writeCommand(cwc.protocol.lego.ev3.Command.INPUT.DEVICE.GETDEVICENAME)
    .writePort(port)
    .writeByte(0x7F)
    .writeIndex()
    .readSigned();
};


/**
 * Reads current EV3 firmware.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.prototype.getFirmware = function() {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader(cwc.protocol.lego.ev3.CallbackType.FIRMWARE, 0x10)
    .writeCommand(cwc.protocol.lego.ev3.Command.UI.READ.FIRMWARE)
    .writeByte(0x10)
    .writeIndex()
    .readSigned();
};


/**
 * Get the current raw data of the sensor.
 * @param {!cwc.protocol.lego.ev3.InputPort} port
 * @param {number=} mode
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.prototype.getActorData = function(port,
    mode = 0) {
  let cache = this.getCache('getActorData', port, mode);
  if (cache) {
    return /** @type {!ArrayBuffer} */ (cache);
  }
  let buffer = new cwc.protocol.lego.ev3.Buffer()
    .writeHeader(cwc.protocol.lego.ev3.CallbackType.ACTOR_VALUE)
    .writeCommand(cwc.protocol.lego.ev3.Command.INPUT.DEVICE.READRAW)
    .writePort(port)
    .writeNullByte()
    .writeByte(mode)
    .writeSingleByte()
    .writeIndex();
  return /** @type {!ArrayBuffer} */ (this.setCache('getActorData',
    buffer.readSigned(), port, mode));
};


/**
 * Gets the current data of the sensor.
 * @param {!cwc.protocol.lego.ev3.InputPort} port
 * @param {number=} mode
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.prototype.getSensorData = function(port,
    mode = 0) {
  let cache = this.getCache('getSensorData', port, mode);
  if (cache) {
    return /** @type {!ArrayBuffer} */ (cache);
  }
  let buffer = new cwc.protocol.lego.ev3.Buffer()
    .writeHeader(cwc.protocol.lego.ev3.CallbackType.DEVICE_RAW_VALUE)
    .writeCommand(cwc.protocol.lego.ev3.Command.INPUT.DEVICE.READRAW)
    .writePort(port)
    .writeNullByte()
    .writeByte(mode)
    .writeSingleByte()
    .writeIndex();
  return /** @type {!ArrayBuffer} */ (this.setCache('getSensorData',
    buffer.readSigned(), port, mode));
};


/**
 * Get the current data of the sensor in Pct.
 * @param {!cwc.protocol.lego.ev3.InputPort} port
 * @param {number=} mode
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.prototype.getSensorDataPct = function(port,
    mode = 0) {
  let cache = this.getCache('getSensorDataPct', port, mode);
  if (cache) {
    return /** @type {!ArrayBuffer} */ (cache);
  }
  let buffer = new cwc.protocol.lego.ev3.Buffer()
    .writeHeader(cwc.protocol.lego.ev3.CallbackType.DEVICE_PCT_VALUE)
    .writeCommand(cwc.protocol.lego.ev3.Command.INPUT.DEVICE.READPCT)
    .writePort(port)
    .writeNullByte()
    .writeByte(mode)
    .writeSingleByte()
    .writeIndex();
  return /** @type {!ArrayBuffer} */ (this.setCache('getSensorDataPct',
    buffer.readSigned(), port, mode));
};


/**
 * Get the current data of the sensor in Si.
 * @param {!cwc.protocol.lego.ev3.InputPort} port
 * @param {number=} mode
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.prototype.getSensorDataSi = function(port,
    mode = 0) {
  let cache = this.getCache('getSensorDataSi', port, mode);
  if (cache) {
    return /** @type {!ArrayBuffer} */ (cache);
  }
  let buffer = new cwc.protocol.lego.ev3.Buffer()
    .writeHeader(cwc.protocol.lego.ev3.CallbackType.DEVICE_SI_VALUE)
    .writeCommand(cwc.protocol.lego.ev3.Command.INPUT.DEVICE.READSI)
    .writePort(port)
    .writeNullByte()
    .writeByte(mode)
    .writeSingleByte()
    .writeIndex();
  return /** @type {!ArrayBuffer} */ (this.setCache('getSensorDataSi',
    buffer.readSigned(), port, mode));
};


/**
 * @param {cwc.protocol.lego.ev3.LedColor} color
 * @param {cwc.protocol.lego.ev3.LedMode=} mode
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.prototype.setLed = function(color,
    mode = cwc.protocol.lego.ev3.LedMode.NORMAL) {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader()
    .writeCommand(cwc.protocol.lego.ev3.Command.UI.WRITE.LED)
    .writeByte(color + mode)
    .readSigned();
};


/**
 * @param {!cwc.protocol.lego.ev3.OutputPort|number} ports
 * @param {!number} power (-100 - 100)
 * @param {boolean=} brake Stop current movements.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.prototype.movePower = function(ports, power,
    brake) {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader()

    .writeCommand(cwc.protocol.lego.ev3.Command.OUTPUT.STOP)
    .writePorts(ports)
    .writeByte(brake ? 1 : 0)

    .writeCommand(cwc.protocol.lego.ev3.Command.OUTPUT.POWER)
    .writePorts(ports)
    .writeByte(power)

    .writeCommand(cwc.protocol.lego.ev3.Command.OUTPUT.START)
    .writePorts(ports)

    .readSigned();
};


/**
 * @param {!cwc.protocol.lego.ev3.OutputPort} port_left Left motor port.
 * @param {!cwc.protocol.lego.ev3.OutputPort} port_right Right motor port.
 * @param {!number} power_left Power value for left motor. (-100 - 100)
 * @param {!number} power_right Power value for right motor. (-100 - 100)
 * @param {boolean=} brake Stop current movements.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.prototype.rotatePower = function(port_left,
    port_right, power_left, power_right, brake) {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader()

    .writeCommand(cwc.protocol.lego.ev3.Command.OUTPUT.STOP)
    .writePorts(port_left | port_right)
    .writeByte(brake ? 1 : 0)

    .writeCommand(cwc.protocol.lego.ev3.Command.OUTPUT.POWER)
    .writePort(port_left)
    .writeByte(power_left)

    .writeCommand(cwc.protocol.lego.ev3.Command.OUTPUT.POWER)
    .writePort(port_right)
    .writeByte(-power_right)

    .writeCommand(cwc.protocol.lego.ev3.Command.OUTPUT.START)
    .writePorts(port_left | port_right)
    .readSigned();
};


/**
 * Moves the motors for the predefined specific steps.
 * @param {!cwc.protocol.lego.ev3.OutputPort|number} ports
 * @param {!number} steps
 * @param {number=} opt_speed (-100 - 100)
 * @param {number=} opt_ramp_up (-100 - 100)
 * @param {number=} opt_ramp_down (-100 - 100)
 * @param {boolean=} brake Stop current movements.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.prototype.moveSteps = function(ports, steps,
    opt_speed, opt_ramp_up, opt_ramp_down, brake) {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader()

    .writeCommand(cwc.protocol.lego.ev3.Command.OUTPUT.STOP)
    .writePorts(ports)
    .writeByte(brake ? 1 : 0)

    .writeCommand(cwc.protocol.lego.ev3.Command.OUTPUT.STEP.SPEED)
    .writePorts(ports)
    .writeByte(opt_speed || 50)
    .writeInt(opt_ramp_up || 0)
    .writeInt(steps)
    .writeInt(opt_ramp_down || 0)
    .writeByte(brake ? 1 : 0)
    .readSigned();
};


/**
 * Rotates the motors for the predefined specific steps.
 * @param {!cwc.protocol.lego.ev3.OutputPort} port_left
 * @param {!cwc.protocol.lego.ev3.OutputPort} port_right
 * @param {!number} steps
 * @param {number=} speedLeft
 * @param {number=} speedRight
 * @param {number=} rampUp
 * @param {number=} rampDown
 * @param {boolean=} brake
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.prototype.rotateSteps = function(port_left,
    port_right, steps, speedLeft, speedRight, rampUp,
    rampDown, brake) {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader()

    .writeCommand(cwc.protocol.lego.ev3.Command.OUTPUT.STOP)
    .writePorts(port_left | port_right)
    .writeByte(brake ? 1 : 0)

    .writeCommand(cwc.protocol.lego.ev3.Command.OUTPUT.STEP.SPEED)
    .writePort(port_left)
    .writeByte(speedLeft || 50)
    .writeInt(rampUp || 0)
    .writeInt(steps)
    .writeInt(rampDown || 0)
    .writeByte(brake ? 1 : 0)

    .writeCommand(cwc.protocol.lego.ev3.Command.OUTPUT.STEP.SPEED)
    .writePort(port_right)
    .writeByte(-speedRight || -50)
    .writeInt(rampUp || 0)
    .writeInt(steps)
    .writeInt(rampDown || 0)
    .writeByte(brake ? 1 : 0)
    .readSigned();
};


/**
 * Rotates the defined motors for the predefined specific steps.
 * @param {!cwc.protocol.lego.ev3.OutputPort} ports
 * @param {!number} steps
 * @param {number=} opt_speed
 * @param {number=} opt_ramp_up
 * @param {number=} opt_ramp_down
 * @param {boolean=} opt_brake
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.prototype.customRotateSteps = function(ports,
    steps, opt_speed, opt_ramp_up, opt_ramp_down, opt_brake) {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader()

    .writeCommand(cwc.protocol.lego.ev3.Command.OUTPUT.STOP)
    .writePorts(ports)
    .writeByte(opt_brake ? 1 : 0)

    .writeCommand(cwc.protocol.lego.ev3.Command.OUTPUT.STEP.SPEED)
    .writePort(ports)
    .writeByte(opt_speed || 50)
    .writeInt(opt_ramp_up || 0)
    .writeInt(steps)
    .writeInt(opt_ramp_down || 0)
    .writeByte(opt_brake ? 1 : 0)
    .readSigned();
};


/**
 * @param {cwc.protocol.lego.ev3.OutputPort=} port
 * @param {number=} brake Stop current movements.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.prototype.stop = function(
    port = cwc.protocol.lego.ev3.OutputPort.ALL, brake = 0) {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader()
    .writeCommand(cwc.protocol.lego.ev3.Command.OUTPUT.STOP)
    .writePorts(port)
    .writeByte(brake)
    .readSigned();
};


/**
 * Clears the EV3 unit.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.prototype.clear = function() {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader()
    .writeCommand(cwc.protocol.lego.ev3.Command.INPUT.DEVICE.CLEARALL)
    .writeNullByte()
    .readSigned();
};


/**
 * Plays a tone with the defined volume, frequency and duration.
 * @param {!number} frequency
 * @param {number=} duration
 * @param {number=} volume
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.prototype.playTone = function(frequency,
    duration, volume) {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader()
    .writeCommand(cwc.protocol.lego.ev3.Command.SOUND.TONE)
    .writeByte(Math.min(100, Math.max(0, volume || 100)))
    .writeShort(frequency)
    .writeShort(Math.max(duration || 50, 50))
    .readSigned();
};


/**
 * Plays the selected sound file.
 * @param {!string} filename
 * @param {number=} volume
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.prototype.playSound = function(filename,
    volume) {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader()
    .writeCommand(cwc.protocol.lego.ev3.Command.SOUND.PLAY)
    .writeByte(Math.min(100, Math.max(0, volume || 100)))
    .writeString(filename)
    .readSigned();
};


/**
 * Clears the EV3 display.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.prototype.drawClean = function() {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader()
    .writeCommand(cwc.protocol.lego.ev3.Command.UI.DRAW.CLEAN)
    .readSigned();
};


/**
 * Updates the EV3 display.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.prototype.drawUpdate = function() {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader()
    .writeCommand(cwc.protocol.lego.ev3.Command.UI.DRAW.UPDATE)
    .readSigned();
};


/**
 * Shows the selected image file.
 * @param {!string} filename
 * @param {number=} opt_x
 * @param {number=} opt_y
 * @param {number=} opt_color
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.prototype.drawImage = function(filename,
    opt_x, opt_y, opt_color) {
  let filepath = '/home/root/lms2012/prjs/' + filename.replace('.rgf', '');
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader()
    .writeCommand(cwc.protocol.lego.ev3.Command.UI.DRAW.BMPFILE)
    .writeByte(opt_color == undefined ? 0x01 : opt_color)
    .writeInt(Math.min(177, Math.max(0, opt_x || 0)))
    .writeInt(Math.min(127, Math.max(0, opt_y || 0)))
    .writeString(filepath)
    .readSigned();
};


/**
 * Draws a line.
 * @param {!number} x1 (0-177)
 * @param {!number} y1 (0-127)
 * @param {!number} x2 (0-177)
 * @param {!number} y2 (0-127)
 * @param {number=} color (0 = white, 1 = black)
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.prototype.drawLine = function(x1, y1, x2, y2,
    color) {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader()
    .writeCommand(cwc.protocol.lego.ev3.Command.UI.DRAW.LINE)
    .writeByte(color == undefined ? 0x01 : color)
    .writeInt(Math.min(177, Math.max(0, x1)))
    .writeInt(Math.min(127, Math.max(0, y1)))
    .writeInt(Math.min(177, Math.max(0, x2)))
    .writeInt(Math.min(127, Math.max(0, y2)))
    .readSigned();
};
