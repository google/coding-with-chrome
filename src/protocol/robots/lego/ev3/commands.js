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
goog.require('cwc.utils.ByteArray');


/**
 * Reads current battery level.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.getBattery = function() {
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
cwc.protocol.lego.ev3.Commands.getDeviceType = function(port) {
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
cwc.protocol.lego.ev3.Commands.getFirmware = function() {
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
cwc.protocol.lego.ev3.Commands.getActorData = function(port, mode = 0) {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader(cwc.protocol.lego.ev3.CallbackType.ACTOR_VALUE)
    .writeCommand(cwc.protocol.lego.ev3.Command.INPUT.DEVICE.READRAW)
    .writePort(port)
    .writeNullByte()
    .writeByte(mode)
    .writeSingleByte()
    .writeIndex()
    .readSigned();
};


/**
 * Gets the current data of the sensor.
 * @param {!cwc.protocol.lego.ev3.InputPort} port
 * @param {number=} mode
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.getSensorData = function(port, mode = 0) {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader(cwc.protocol.lego.ev3.CallbackType.DEVICE_RAW_VALUE)
    .writeCommand(cwc.protocol.lego.ev3.Command.INPUT.DEVICE.READRAW)
    .writePort(port)
    .writeNullByte()
    .writeByte(mode)
    .writeSingleByte()
    .writeIndex()
    .readSigned();
};


/**
 * Get the current data of the sensor in Pct.
 * @param {!cwc.protocol.lego.ev3.InputPort} port
 * @param {number=} mode
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.getSensorDataPct = function(port, mode = 0) {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader(cwc.protocol.lego.ev3.CallbackType.DEVICE_PCT_VALUE)
    .writeCommand(cwc.protocol.lego.ev3.Command.INPUT.DEVICE.READPCT)
    .writePort(port)
    .writeNullByte()
    .writeByte(mode)
    .writeSingleByte()
    .writeIndex()
    .readSigned();
};


/**
 * Get the current data of the sensor in Si.
 * @param {!cwc.protocol.lego.ev3.InputPort} port
 * @param {number=} mode
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.getSensorDataSi = function(port, mode = 0) {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader(cwc.protocol.lego.ev3.CallbackType.DEVICE_SI_VALUE)
    .writeCommand(cwc.protocol.lego.ev3.Command.INPUT.DEVICE.READSI)
    .writePort(port)
    .writeNullByte()
    .writeByte(mode)
    .writeSingleByte()
    .writeIndex()
    .readSigned();
};


/**
 * @param {cwc.protocol.lego.ev3.LedColor} color
 * @param {cwc.protocol.lego.ev3.LedMode=} mode
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.setLed = function(color,
    mode = cwc.protocol.lego.ev3.LedMode.NORMAL) {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader()
    .writeCommand(cwc.protocol.lego.ev3.Command.UI.WRITE.LED)
    .writeByte(color + mode)
    .readSigned();
};


/**
 * @param {!cwc.protocol.lego.ev3.OutputPort|number} ports
 * @param {number} power (-100 - 100)
 * @param {boolean=} brake Stop current movements.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.movePower = function(ports, power, brake) {
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
 * @param {number} power_left Power value for left motor. (-100 - 100)
 * @param {number} power_right Power value for right motor. (-100 - 100)
 * @param {boolean=} brake Stop current movements.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.rotatePower = function(port_left,
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
 * @param {number} steps
 * @param {number=} opt_speed (-100 - 100)
 * @param {number=} opt_ramp_up (-100 - 100)
 * @param {number=} opt_ramp_down (-100 - 100)
 * @param {boolean=} brake Stop current movements.
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.moveSteps = function(ports, steps,
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
 * @param {!cwc.protocol.lego.ev3.OutputPort} portLeft
 * @param {!cwc.protocol.lego.ev3.OutputPort} portRight
 * @param {number} steps
 * @param {number=} speedLeft
 * @param {number=} speedRight
 * @param {number=} rampUp
 * @param {number=} rampDown
 * @param {boolean=} brake
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.rotateSteps = function(
    portLeft, portRight, steps, speedLeft = 50, speedRight = 50,
    rampUp, rampDown, brake) {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader()

    .writeCommand(cwc.protocol.lego.ev3.Command.OUTPUT.STOP)
    .writePorts(portLeft | portRight)
    .writeByte(brake ? 1 : 0)

    .writeCommand(cwc.protocol.lego.ev3.Command.OUTPUT.STEP.SPEED)
    .writePort(portLeft)
    .writeByte(speedLeft)
    .writeInt(rampUp || 0)
    .writeInt(steps)
    .writeInt(rampDown || 0)
    .writeByte(brake ? 1 : 0)

    .writeCommand(cwc.protocol.lego.ev3.Command.OUTPUT.STEP.SPEED)
    .writePort(portRight)
    .writeByte(-speedRight)
    .writeInt(rampUp || 0)
    .writeInt(steps)
    .writeInt(rampDown || 0)
    .writeByte(brake ? 1 : 0)
    .readSigned();
};


/**
 * Rotates the defined motors for the predefined specific steps.
 * @param {!cwc.protocol.lego.ev3.OutputPort} ports
 * @param {number} steps
 * @param {number=} opt_speed
 * @param {number=} opt_ramp_up
 * @param {number=} opt_ramp_down
 * @param {boolean=} opt_brake
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.customRotateSteps = function(ports,
    steps, opt_speed = 50, opt_ramp_up, opt_ramp_down, opt_brake) {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader()

    .writeCommand(cwc.protocol.lego.ev3.Command.OUTPUT.STOP)
    .writePorts(ports)
    .writeByte(opt_brake ? 1 : 0)

    .writeCommand(cwc.protocol.lego.ev3.Command.OUTPUT.STEP.SPEED)
    .writePort(ports)
    .writeByte(opt_speed)
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
cwc.protocol.lego.ev3.Commands.stop = function(
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
cwc.protocol.lego.ev3.Commands.clear = function() {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader()
    .writeCommand(cwc.protocol.lego.ev3.Command.INPUT.DEVICE.CLEARALL)
    .writeNullByte()
    .readSigned();
};


/**
 * Plays a tone with the defined volume, frequency and duration.
 * @param {number} frequency
 * @param {number=} duration
 * @param {number=} volume
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.playTone = function(frequency, duration = 50,
    volume = 100) {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader()
    .writeCommand(cwc.protocol.lego.ev3.Command.SOUND.TONE)
    .writeByte(Math.min(100, Math.max(0, volume)))
    .writeShort(frequency)
    .writeShort(Math.max(duration, 50))
    .readSigned();
};


/**
 * Plays the selected sound file.
 * @param {string} filename
 * @param {number=} volume
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.playSound = function(filename, volume) {
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
cwc.protocol.lego.ev3.Commands.drawClean = function() {
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
cwc.protocol.lego.ev3.Commands.drawUpdate = function() {
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader()
    .writeCommand(cwc.protocol.lego.ev3.Command.UI.DRAW.UPDATE)
    .readSigned();
};


/**
 * Shows the selected image file.
 * @param {string} filename
 * @param {number=} x
 * @param {number=} y
 * @param {number=} color
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.drawImage = function(filename, x, y, color) {
  let filepath = '/home/root/lms2012/prjs/' + filename.replace('.rgf', '');
  return new cwc.protocol.lego.ev3.Buffer()
    .writeHeader()
    .writeCommand(cwc.protocol.lego.ev3.Command.UI.DRAW.BMPFILE)
    .writeByte(color == undefined ? 0x01 : color)
    .writeInt(Math.min(177, Math.max(0, x || 0)))
    .writeInt(Math.min(127, Math.max(0, y || 0)))
    .writeString(filepath)
    .readSigned();
};


/**
 * Draws a line.
 * @param {number} x1 (0-177)
 * @param {number} y1 (0-127)
 * @param {number} x2 (0-177)
 * @param {number} y2 (0-127)
 * @param {number=} color (0 = white, 1 = black)
 * @return {!ArrayBuffer}
 * @export
 */
cwc.protocol.lego.ev3.Commands.drawLine = function(x1, y1, x2, y2, color) {
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
