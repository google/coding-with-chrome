/**
 * @fileoverview EV3 framework for the runner instance.
 * This EV3 framework will be used by the runner instance, inside the webview
 * sandbox, to access the EV3 over the runner instance and the Bluetooth
 * interface.
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
goog.provide('cwc.framework.Ev3');

goog.require('cwc.framework.Runner');
goog.require('cwc.protocol.ev3.DeviceName');
goog.require('cwc.protocol.ev3.LedColor');
goog.require('cwc.protocol.ev3.LedMode');



/**
 * @constructor
 * @param {!cwc.framework.Runner} runner
 * @struct
 * @final
 */
cwc.framework.Ev3 = function(runner) {
  /** @type {string} */
  this.name = 'EV3 Framework';

  /** @type {Object} */
  this.deviceData = {};

  /** @type {Object} */
  this.deviceInfo = {};

  /** @type {Object} */
  this.colorSensorData = null;

  /** @type {Object} */
  this.irSensorData = null;

  /** @type {Object} */
  this.touchSensorData = null;

  /** @type {function(?)} */
  this.colorSensorEvent = function() {};

  /** @type {function(?)} */
  this.touchSensorEvent = function() {};

  /** @type {function(?)} */
  this.irSensorEvent = function() {};

  /** @type {number} */
  this.colorSensorValue = 0;

  /** @type {number} */
  this.touchSensorValue = 0;

  /** @type {number} */
  this.irSensorValue = 0;

  /** @type {!cwc.framework.Runner} */
  this.runner = runner;

  /** @type {number} */
  this.penSteps = 290;

  /** @type {boolean} */
  this.penMovedUp = false;

  /** @type {boolean} */
  this.penMovedDown = false;

  /** @type {boolean} */
  this.robotForwardDirection = false;

  /** @type {boolean} */
  this.robotBackwardDirection = true;

  if (this.runner) {
    this.init();
  } else {
    console.error('Was unable to get runner:', runner);
  }
};


/**
 * Adds the default commands which are used by the EV3 framework.
 */
cwc.framework.Ev3.prototype.init = function() {
  this.runner.addCommand('updateDeviceData',
      this.handleUpdateDeviceData.bind(this));
  this.runner.addCommand('updateDeviceInfo',
      this.handleUpdateDeviceInfo.bind(this));
  this.penMovedDown = false;
  this.penMovedUp = false;
};


/**
 * Updates the current sensor / actor states with the received data.
 * @param {Object} data
 */
cwc.framework.Ev3.prototype.handleUpdateDeviceData = function(data) {
  for (var device_name in this.deviceInfo) {
    var devicePort = this.deviceInfo[device_name];
    if (!(devicePort in this.deviceData) ||
        this.deviceData[devicePort].value != data[devicePort].value) {
      this.deviceData[devicePort] = data[devicePort];
      switch (device_name) {
        case cwc.protocol.ev3.DeviceName.IR_SENSOR:
          this.irSensorData = data[devicePort];
          this.irSensorValue = data[devicePort].value;
          this.irSensorEvent(this.irSensorValue);
          break;
        case cwc.protocol.ev3.DeviceName.COLOR_SENSOR:
          this.colorSensorData = data[devicePort];
          this.colorSensorValue = data[devicePort].value;
          this.colorSensorEvent(this.colorSensorValue);
          break;
        case cwc.protocol.ev3.DeviceName.TOUCH_SENSOR:
          this.touchSensorData = data[devicePort];
          this.touchSensorValue = data[devicePort].value;
          this.touchSensorEvent(this.touchSensorValue);
          break;
      }
    }
  }
  this.deviceData = data;
};


/**
 * Updates the current sensor / actor states with the received data.
 * @param {Object} data
 */
cwc.framework.Ev3.prototype.handleUpdateDeviceInfo = function(data) {
  this.deviceInfo = data;
};


/**
 * Returns the Color Sensor object.
 * @return {Object}
 * @export
 */
cwc.framework.Ev3.prototype.getColorSensor = function() {
  return this.colorSensorData;
};


/**
 * Returns the Touch object.
 * @return {Object}
 * @export
 */
cwc.framework.Ev3.prototype.getTouchSensor = function() {
  return this.touchSensorData;
};


/**
 * Returns the IR object.
 * @return {Object}
 * @export
 */
cwc.framework.Ev3.prototype.getIrSensor = function() {
  return this.irSensorData;
};


/**
 * Returns the Color Sensor value.
 * @return {number}
 * @export
 */
cwc.framework.Ev3.prototype.getColorSensorValue = function() {
  return this.colorSensorValue;
};


/**
 * Returns the Touch value.
 * @return {number}
 * @export
 */
cwc.framework.Ev3.prototype.getTouchSensorValue = function() {
  return this.touchSensorValue;
};


/**
 * Returns the IR object.
 * @return {number}
 * @export
 */
cwc.framework.Ev3.prototype.getIrSensorValue = function() {
  return this.irSensorValue;
};


/**
 * Returns the data for the given interface name.
 * @param {!string} port
 * @return {Object}
 * @export
 */
cwc.framework.Ev3.prototype.getInterface = function(port) {
  if (port in this.deviceData) {
    return this.deviceData[port];
  }
  return null;
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.Ev3.prototype.onColorSensorChange = function(func) {
  if (goog.isFunction(func)) {
    this.colorSensorEvent = func;
  }
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.Ev3.prototype.onTouchSensorChange = function(func) {
  if (goog.isFunction(func)) {
    this.touchSensorEvent = func;
  }
};


/**
 * @param {!Function} func
 * @export
 */
cwc.framework.Ev3.prototype.onIrSensorChange = function(func) {
  if (goog.isFunction(func)) {
    this.irSensorEvent = func;
  }
};


/**
 * Displays the selected file name on the EV3 display.
 * @param {!string} file_name
 * @export
 */
cwc.framework.Ev3.prototype.showImage = function(file_name) {
  this.runner.send({'command': 'showImage', 'value': {
    'file': file_name }
  });
};


/**
 * Plays tone.
 * @param {!number} frequency
 * @param {number=} opt_duration
 * @param {number=} opt_volume
 * @export
 */
cwc.framework.Ev3.prototype.playTone = function(frequency, opt_duration,
    opt_volume) {
  this.runner.send({'command': 'playTone', 'value': {
    'frequency': frequency,
    'duration': opt_duration,
    'volume': opt_volume }
  });
};


/**
 * Plays a sound file.
 * @param {!string} file_name
 * @param {number=} opt_volume
 * @export
 */
cwc.framework.Ev3.prototype.playSound = function(file_name, opt_volume) {
  this.runner.send({'command': 'playSound', 'value': {
    'file': file_name,
    'volume': opt_volume }
  });
};


/**
 * Moves forward / backward.
 * @param {!number} steps
 * @param {boolean=} opt_direction
 * @export
 */
cwc.framework.Ev3.prototype.move = function(steps, opt_direction) {
  this.runner.send({'command': 'move', 'value': {
    'steps': steps,
    'direction': opt_direction }
  });
};


/**
 * Moves forward.
 * @param {!number} steps
 * @export
 */
cwc.framework.Ev3.prototype.moveForward = function(steps) {
  this.move(steps, this.robotForwardDirection);
};


/**
 * Moves forward.
 * @param {!number} steps
 * @export
 */
cwc.framework.Ev3.prototype.moveBackward = function(steps) {
  this.move(steps, this.robotBackwardDirection);
};


/**
 * Moves the pen.
 * @param {!number} steps
 * @param {boolean=} opt_direction
 * @export
 */
cwc.framework.Ev3.prototype.movePen = function(steps, opt_direction) {
  this.runner.send({'command': 'moveServo', 'value': {
    'steps': steps,
    'direction': opt_direction }
  });
};


/**
 * Moves the pen down.
 * @export
 */
cwc.framework.Ev3.prototype.movePenDown = function() {
  if (!this.penMovedDown) {
    this.movePen(this.penSteps, false);
    this.penMovedDown = true;
    this.penMovedUp = false;
  } else {
    console.log('Pen was already moved down.');
  }
};


/**
 * Moves the pen up.
 * @export
 */
cwc.framework.Ev3.prototype.movePenUp = function() {
  if (!this.penMovedUp) {
    this.movePen(this.penSteps, true);
    this.penMovedDown = false;
    this.penMovedUp = true;
  } else {
    console.log('Pen was already moved up.');
  }
};


/**
 * Rotates left / right.
 * @param {!number} angle
 * @param {boolean=} opt_direction
 * @export
 */
cwc.framework.Ev3.prototype.rotate = function(angle, opt_direction) {
  this.runner.send({'command': 'rotate', 'value': {
    'angle': angle,
    'direction': opt_direction }
  });
};


/**
 * Rotates left.
 * @param {!number} angle
 * @export
 */
cwc.framework.Ev3.prototype.rotateLeft = function(angle) {
  this.rotate(angle, this.robotBackwardDirection);
};


/**
 * Rotates right.
 * @param {!number} angle
 * @export
 */
cwc.framework.Ev3.prototype.rotateRight = function(angle) {
  this.rotate(angle, this.robotForwardDirection);
};


/**
 * Stops all motors, but only after the last command was processed.
 * @export
 */
cwc.framework.Ev3.prototype.delayedStop = function() {
  this.runner.send({'command': 'delayedStop', 'value': {} });
};


/**
 * Moves forward / backward with power.
 * @param {!number} power
 * @param {boolean=} opt_direction
 * @export
 */
cwc.framework.Ev3.prototype.movePower = function(power, opt_direction) {
  this.runner.send({'command': 'movePower', 'value': {
    'power': power,
    'direction': opt_direction }
  });
};


/**
 * Moves forward with power.
 * @param {!number} power
 * @export
 */
cwc.framework.Ev3.prototype.movePowerForward = function(power) {
  this.movePower(power, this.robotForwardDirection);
};


/**
 * Moves backward with power.
 * @param {!number} power
 * @export
 */
cwc.framework.Ev3.prototype.movePowerBackward = function(power) {
  this.movePower(power, this.robotBackwardDirection);
};


/**
 * Rotates left / right with power.
 * @param {!number} power General power value.
 * @param {number=} opt_power Dedicated power value for the second motor.
 * @param {boolean=} opt_direction
 * @export
 */
cwc.framework.Ev3.prototype.rotatePower = function(power, opt_power,
    opt_direction) {
  this.runner.send({'command': 'rotatePower', 'value': {
    'power': power,
    'opt_power': opt_power,
    'direction': opt_direction }
  });
};


/**
 * Rotates left with power.
 * @param {!number} power General power value.
 * @export
 */
cwc.framework.Ev3.prototype.rotatePowerLeft = function(power) {
  this.rotatePower(power, power, this.robotBackwardDirection);
};


/**
 * Rotates right with power.
 * @param {!number} power General power value.
 * @export
 */
cwc.framework.Ev3.prototype.rotatePowerRight = function(power) {
  this.rotatePower(power, power, this.robotForwardDirection);
};


/**
 * Stops all motors.
 * @export
 */
cwc.framework.Ev3.prototype.stop = function() {
  this.runner.send({'command': 'stop', 'value': {} });
};


/**
 * @param {!string} text
 * @export
 */
cwc.framework.Ev3.prototype.echo = function(text) {
  this.runner.send({'command': 'echo', 'value' : text });
};


/**
 * @param {!number} mode
 */
cwc.framework.Ev3.prototype.setColorSensorMode = function(mode) {
  this.runner.send({'command': 'setColorSensorMode', 'value': mode });
};


/**
 * @param {!number} mode
 */
cwc.framework.Ev3.prototype.setIrSensorMode = function(mode) {
  this.runner.send({'command': 'setIrSensorMode', 'value': mode });
};


/**
 * @param {cwc.protocol.ev3.LedColor} color
 * @param {cwc.protocol.ev3.LedMode=} opt_mode
 */
cwc.framework.Ev3.prototype.setLed = function(color, opt_mode) {
  this.runner.send({'command': 'setLed', 'value': {
    'color': color,
    'mode': opt_mode }
  });
};


/**
 * @param {!number} speed
 */
cwc.framework.Ev3.prototype.setStepSpeed = function(speed) {
  this.runner.send({'command': 'setStepSpeed', 'value': speed });
};


/**
 * Adds the EV3 framework to the runner listener.
 * @param {Function} callback
 * @export
 */
cwc.framework.Ev3.prototype.listen = function(callback) {
  if (this.runner) {
    var warper = function() {
      callback(this);
    };
    this.runner.listen(warper.bind(this));
  }
};


goog.exportSymbol('cwc.framework.Ev3', cwc.framework.Ev3);
goog.exportSymbol('cwc.framework.Ev3.prototype.delayedStop',
    cwc.framework.Ev3.prototype.delayedStop);
goog.exportSymbol('cwc.framework.Ev3.prototype.echo',
    cwc.framework.Ev3.prototype.echo);
goog.exportSymbol('cwc.framework.Ev3.prototype.getColorSensor',
    cwc.framework.Ev3.prototype.getColorSensor);
goog.exportSymbol('cwc.framework.Ev3.prototype.getColorSensorValue',
    cwc.framework.Ev3.prototype.getColorSensorValue);
goog.exportSymbol('cwc.framework.Ev3.prototype.getInterface',
    cwc.framework.Ev3.prototype.getInterface);
goog.exportSymbol('cwc.framework.Ev3.prototype.getIrSensor',
    cwc.framework.Ev3.prototype.getIrSensor);
goog.exportSymbol('cwc.framework.Ev3.prototype.getIrSensorValue',
    cwc.framework.Ev3.prototype.getIrSensorValue);
goog.exportSymbol('cwc.framework.Ev3.prototype.getTouchSensor',
    cwc.framework.Ev3.prototype.getTouchSensor);
goog.exportSymbol('cwc.framework.Ev3.prototype.getTouchSensorValue',
    cwc.framework.Ev3.prototype.getTouchSensorValue);
goog.exportSymbol('cwc.framework.Ev3.prototype.listen',
    cwc.framework.Ev3.prototype.listen);
goog.exportSymbol('cwc.framework.Ev3.prototype.move',
    cwc.framework.Ev3.prototype.move);
goog.exportSymbol('cwc.framework.Ev3.prototype.moveForward',
    cwc.framework.Ev3.prototype.moveForward);
goog.exportSymbol('cwc.framework.Ev3.prototype.moveBackward',
    cwc.framework.Ev3.prototype.moveBackward);
goog.exportSymbol('cwc.framework.Ev3.prototype.movePen',
    cwc.framework.Ev3.prototype.movePen);
goog.exportSymbol('cwc.framework.Ev3.prototype.movePenDown',
    cwc.framework.Ev3.prototype.movePenDown);
goog.exportSymbol('cwc.framework.Ev3.prototype.movePenUp',
    cwc.framework.Ev3.prototype.movePenUp);
goog.exportSymbol('cwc.framework.Ev3.prototype.movePower',
    cwc.framework.Ev3.prototype.movePower);
goog.exportSymbol('cwc.framework.Ev3.prototype.movePowerForward',
    cwc.framework.Ev3.prototype.movePowerForward);
goog.exportSymbol('cwc.framework.Ev3.prototype.movePowerBackward',
    cwc.framework.Ev3.prototype.movePowerBackward);
goog.exportSymbol('cwc.framework.Ev3.prototype.onColorSensorChange',
    cwc.framework.Ev3.prototype.onColorSensorChange);
goog.exportSymbol('cwc.framework.Ev3.prototype.onIrSensorChange',
    cwc.framework.Ev3.prototype.onIrSensorChange);
goog.exportSymbol('cwc.framework.Ev3.prototype.onTouchSensorChange',
    cwc.framework.Ev3.prototype.onTouchSensorChange);
goog.exportSymbol('cwc.framework.Ev3.prototype.playSound',
    cwc.framework.Ev3.prototype.playSound);
goog.exportSymbol('cwc.framework.Ev3.prototype.playTone',
    cwc.framework.Ev3.prototype.playTone);
goog.exportSymbol('cwc.framework.Ev3.prototype.rotate',
    cwc.framework.Ev3.prototype.rotate);
goog.exportSymbol('cwc.framework.Ev3.prototype.rotateLeft',
    cwc.framework.Ev3.prototype.rotateLeft);
goog.exportSymbol('cwc.framework.Ev3.prototype.rotateRight',
    cwc.framework.Ev3.prototype.rotateRight);
goog.exportSymbol('cwc.framework.Ev3.prototype.rotatePower',
    cwc.framework.Ev3.prototype.rotatePower);
goog.exportSymbol('cwc.framework.Ev3.prototype.rotatePowerLeft',
    cwc.framework.Ev3.prototype.rotatePowerLeft);
goog.exportSymbol('cwc.framework.Ev3.prototype.rotatePowerRight',
    cwc.framework.Ev3.prototype.rotatePowerRight);
goog.exportSymbol('cwc.framework.Ev3.prototype.showImage',
    cwc.framework.Ev3.prototype.showImage);
goog.exportSymbol('cwc.framework.Ev3.prototype.setColorSensorMode',
    cwc.framework.Ev3.prototype.setColorSensorMode);
goog.exportSymbol('cwc.framework.Ev3.prototype.setIrSensorMode',
    cwc.framework.Ev3.prototype.setIrSensorMode);
goog.exportSymbol('cwc.framework.Ev3.prototype.setLed',
    cwc.framework.Ev3.prototype.setLed);
goog.exportSymbol('cwc.framework.Ev3.prototype.setStepSpeed',
    cwc.framework.Ev3.prototype.setStepSpeed);
goog.exportSymbol('cwc.framework.Ev3.prototype.stop',
    cwc.framework.Ev3.prototype.stop);
