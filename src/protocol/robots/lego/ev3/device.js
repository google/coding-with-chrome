/**
 * @fileoverview EV3 Device definitions.
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
goog.provide('cwc.protocol.lego.ev3.Device');
goog.provide('cwc.protocol.lego.ev3.DeviceGroup');
goog.provide('cwc.protocol.lego.ev3.Devices');
goog.provide('cwc.protocol.lego.ev3.DevicesDefault');

goog.require('cwc.protocol.lego.ev3.ColorSensorMode');
goog.require('cwc.protocol.lego.ev3.DeviceType');
goog.require('cwc.protocol.lego.ev3.GyroMode');
goog.require('cwc.protocol.lego.ev3.IrSensorMode');
goog.require('cwc.protocol.lego.ev3.MotorMode');
goog.require('cwc.protocol.lego.ev3.UltrasonicSensorMode');


/**
 * Sensor and Actors device groups.
 * @enum {!Object.<string>}
 */
cwc.protocol.lego.ev3.DeviceGroup = {
  COLOR: 'COL',
  GYROSCOPE: 'GYRO',
  INFRARED: 'IR',
  L_MOTOR: 'L_MOTOR',
  M_MOTOR: 'M_MOTOR',
  TOUCH: 'TOUCH',
  ULTRASONIC: 'US',
};


/**
 * Sensor and Actors device types.
 * @enum {!Object.<string>}
 */
cwc.protocol.lego.ev3.Device = {
  'NONE': {
    type: cwc.protocol.lego.ev3.DeviceType.NONE,
    mode: 0,
  },
  'COL-REFLECT': {
    group: cwc.protocol.lego.ev3.DeviceGroup.COLOR,
    type: cwc.protocol.lego.ev3.DeviceType.COL_REFLECT,
    mode: cwc.protocol.lego.ev3.ColorSensorMode.REFLECTIVE,
  },
  'COL-AMBIENT': {
    group: cwc.protocol.lego.ev3.DeviceGroup.COLOR,
    type: cwc.protocol.lego.ev3.DeviceType.COL_AMBIENT,
    mode: cwc.protocol.lego.ev3.ColorSensorMode.AMBIENT,
  },
  'COL-COLOR': {
    group: cwc.protocol.lego.ev3.DeviceGroup.COLOR,
    type: cwc.protocol.lego.ev3.DeviceType.COL_COLOR,
    mode: cwc.protocol.lego.ev3.ColorSensorMode.COLOR,
  },
  'GYRO-ANG': {
    group: cwc.protocol.lego.ev3.DeviceGroup.GYROSCOPE,
    type: cwc.protocol.lego.ev3.DeviceType.GYRO_ANG,
    mode: cwc.protocol.lego.ev3.GyroMode.ANGLE,
  },
  'GYRO-RATE': {
    group: cwc.protocol.lego.ev3.DeviceGroup.GYROSCOPE,
    type: cwc.protocol.lego.ev3.DeviceType.GYRO_RATE,
    mode: cwc.protocol.lego.ev3.GyroMode.RATE,
  },
  'IR-PROX': {
    group: cwc.protocol.lego.ev3.DeviceGroup.INFRARED,
    type: cwc.protocol.lego.ev3.DeviceType.IR_PROX,
    mode: cwc.protocol.lego.ev3.IrSensorMode.PROXIMITY,
  },
  'IR-SEEK': {
    group: cwc.protocol.lego.ev3.DeviceGroup.INFRARED,
    type: cwc.protocol.lego.ev3.DeviceType.IR_SEEK,
    mode: cwc.protocol.lego.ev3.IrSensorMode.SEEK,
  },
  'IR-REMOTE': {
    group: cwc.protocol.lego.ev3.DeviceGroup.INFRARED,
    type: cwc.protocol.lego.ev3.DeviceType.IR_REMOTE,
    mode: cwc.protocol.lego.ev3.IrSensorMode.REMOTECONTROL,
  },
  'L-MOTOR-DEG': {
    group: cwc.protocol.lego.ev3.DeviceGroup.L_MOTOR,
    type: cwc.protocol.lego.ev3.DeviceType.L_MOTOR_DEG,
    mode: cwc.protocol.lego.ev3.MotorMode.DEGREE,
  },
  'L-MOTOR-ROT': {
    group: cwc.protocol.lego.ev3.DeviceGroup.L_MOTOR,
    type: cwc.protocol.lego.ev3.DeviceType.L_MOTOR_ROT,
    mode: cwc.protocol.lego.ev3.MotorMode.ROTATION,
  },
  'M-MOTOR-DEG': {
    group: cwc.protocol.lego.ev3.DeviceGroup.M_MOTOR,
    type: cwc.protocol.lego.ev3.DeviceType.M_MOTOR_DEG,
    mode: cwc.protocol.lego.ev3.MotorMode.DEGREE,
  },
  'M-MOTOR-ROT': {
    group: cwc.protocol.lego.ev3.DeviceGroup.M_MOTOR,
    type: cwc.protocol.lego.ev3.DeviceType.M_MOTOR_ROT,
    mode: cwc.protocol.lego.ev3.MotorMode.ROTATION,
  },
  'TOUCH': {
    group: cwc.protocol.lego.ev3.DeviceGroup.TOUCH,
    type: cwc.protocol.lego.ev3.DeviceType.TOUCH,
    mode: 0,
  },
  'US-DIST-CM': {
    group: cwc.protocol.lego.ev3.DeviceGroup.ULTRASONIC,
    type: cwc.protocol.lego.ev3.DeviceType.US_DIST_CM,
    mode: cwc.protocol.lego.ev3.UltrasonicSensorMode.DIST_CM,
  },
  'US-DIST-IN': {
    group: cwc.protocol.lego.ev3.DeviceGroup.ULTRASONIC,
    type: cwc.protocol.lego.ev3.DeviceType.US_DIST_IN,
    mode: cwc.protocol.lego.ev3.UltrasonicSensorMode.DIST_INCH,
  },
  'US-LISTEN': {
    group: cwc.protocol.lego.ev3.DeviceGroup.ULTRASONIC,
    mode: cwc.protocol.lego.ev3.UltrasonicSensorMode.LISTEN,
    type: cwc.protocol.lego.ev3.DeviceType.US_LISTEN,
  },
};


/**
 * @constructor
 * @struct
 */
cwc.protocol.lego.ev3.Devices = function() {
  /** @type {Object} */
  this['port'] = cwc.protocol.lego.ev3.DevicesDefault;

  /** @type {Object.<Array>} */
  this['actor'] = {
    'L_MOTOR': [],
    'M_MOTOR': [],
  };

  /** @type {Object.<Array>} */
  this['sensor'] = {
    'COL': [],
    'GYRO': [],
    'IR': [],
    'L_MOTOR': [],
    'M_MOTOR': [],
    'TOUCH': [],
    'US': [],
  };
};


/**
 * @enum {!Object.<string>}
 */
cwc.protocol.lego.ev3.DevicesDefault = {
 0: cwc.protocol.lego.ev3.Device.NONE,
 1: cwc.protocol.lego.ev3.Device.NONE,
 2: cwc.protocol.lego.ev3.Device.NONE,
 3: cwc.protocol.lego.ev3.Device.NONE,
 16: cwc.protocol.lego.ev3.Device.NONE,
 17: cwc.protocol.lego.ev3.Device.NONE,
 18: cwc.protocol.lego.ev3.Device.NONE,
 19: cwc.protocol.lego.ev3.Device.NONE,
};
