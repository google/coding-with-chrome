/**
 * @fileoverview EV3 General definitions of devices and bytecodes.
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
goog.provide('cwc.protocol.ev3.BrickButton');
goog.provide('cwc.protocol.ev3.CallbackTarget');
goog.provide('cwc.protocol.ev3.CallbackType');
goog.provide('cwc.protocol.ev3.ColorSensorMode');
goog.provide('cwc.protocol.ev3.ColorSensorValues');
goog.provide('cwc.protocol.ev3.Command');
goog.provide('cwc.protocol.ev3.CommandType');
goog.provide('cwc.protocol.ev3.DeviceType');
goog.provide('cwc.protocol.ev3.Events');
goog.provide('cwc.protocol.ev3.GyroSensorMode');
goog.provide('cwc.protocol.ev3.InputPort');
goog.provide('cwc.protocol.ev3.IrSensorMode');
goog.provide('cwc.protocol.ev3.LedColor');
goog.provide('cwc.protocol.ev3.LedMode');
goog.provide('cwc.protocol.ev3.LedType');
goog.provide('cwc.protocol.ev3.MotorMode');
goog.provide('cwc.protocol.ev3.OutputPort');
goog.provide('cwc.protocol.ev3.ParameterSize');
goog.provide('cwc.protocol.ev3.Polarity');


/**
 * @enum {number}
 */
cwc.protocol.ev3.BrickButton = {
  NONE: 0,
  UP: 1,
  ENTER: 2,
  DOWN: 3,
  RIGHT: 4,
  LEFT: 5,
  BACK: 6,
  ANY: 7
};


/**
 * Enum of implemented callback targets.
 * @enum {number}
 */
cwc.protocol.ev3.CallbackTarget = {
  ONE: 0x00,
  TWO: 0x01,
  THREE: 0x02,
  FOUR: 0x03,
  A: 0x10,
  B: 0x11,
  C: 0x12,
  D: 0x13,
  SYS: 0x20,
  NONE: 0xF0
};


/**
 * Enum of implemented callback types.
 * @enum {number}
 */
cwc.protocol.ev3.CallbackType = {
  NONE: 0x00,
  DEVICE_PCT_VALUE: 0x01,
  DEVICE_SI_VALUE: 0x02,
  DEVICE_NAME: 0x03,
  ACTOR_VALUE: 0x05,
  FIRMWARE: 0x20,
  UNKNOWN: 0xF0
};


/**
 * Color sensor modes.
 * @enum {number}
 */
cwc.protocol.ev3.ColorSensorMode = {
  REFLECTIVE: 0,
  AMBIENT: 1,
  COLOR: 2
};


/**
 * Color sensor values.
 * @enum {string}
 */
cwc.protocol.ev3.ColorSensorValues = {
  0: 'transparent',
  1: 'black',
  2: 'blue',
  3: 'green',
  4: 'yellow',
  5: 'red',
  6: 'white',
  7: 'brown'
};


/**
 * Enum of commands for the communication protocol.
 * @enum {!Object.<string>|number}
 */
cwc.protocol.ev3.Command = {
  UI: {
    FLUSH: {
    },
    READ: {
      BATTERY: [0x81, 0x12],
      FIRMWARE: [0x81, 0x0A]
    },
    WRITE: {
      LED: [0x82, 0x1B]
    },
    BUTTON: {
      PRESSED: [0x83, 0x09]
    },
    DRAW: {
      UPDATE: [0x84, 0x00],
      CLEAN: [0x84, 0x01],
      PIXEL: [0x84, 0x02],
      LINE: [0x84, 0x03],
      CIRCLE: [0x84, 0x04],
      TEXT: [0x84, 0x05],
      FILLRECT: [0x84, 0x09],
      RECT: [0x84, 0x0A],
      INVERSERECT: [0x84, 0x10],
      SELECTFONT: [0x84, 0x11],
      TOPLINE: [0x84, 0x12],
      FILLWINDOW: [0x84, 0x13],
      DOTLINE: [0x84, 0x15],
      FILLCIRCLE: [0x84, 0x18],
      BMPFILE: [0x84, 0x1C]
    }
  },
  SOUND: {
    BREAK: [0x94, 0x00],
    TONE: [0x94, 0x01],
    PLAY: [0x94, 0x02],
    REPEAT: [0x94, 0x03],
    SERVICE: [0x94, 0x04]
  },
  INPUT: {
    DEVICE_LIST: 0x98,
    DEVICE: {
      GETTYPEMODE: [0x99, 0x05],
      GETDEVICENAME: [0x99, 0x15],
      GETMODENAME: [0x99, 0x16],
      READPCT: [0x99, 0x1B],
      READSI: [0x99, 0x1C],
      CLEARALL: [0x99, 0x0A],
      CLEARCHANGES: [0x99, 0x1A]
    },
    READ: 0x9A,
    TEST: 0x9B,
    READY: 0x9C,
    READSI: 0x9D,
    READEXT: 0x9E
  },
  OUTPUT: {
    RESET: 0xA2,
    STOP: 0xA3,
    POWER: 0xA4,
    SPEED: 0xA5,
    START: 0xA6,
    POLARITY: 0xA7,
    POSITION: 0xAB,
    STEP: {
      POWER: 0xAC,
      SPEED: 0XAE,
      SYNC: 0xB0
    },
    TIME: {
      POWER: 0xAD,
      SPEED: 0xAF,
      SYNC: 0xB1
    }
  }
};


/**
 * Type of command.
 * @enum {number}
 */
cwc.protocol.ev3.CommandType = {
  DIRECT: {
    REPLY: 0x00,
    NOREPLY: 0x80
  },
  SYSTEM: {
    REPLY: 0x01,
    NOREPLY: 0x81
  }
};


/**
 * Device types.
 * @enum {string}
 */
cwc.protocol.ev3.DeviceType = {
  IR_PROX: 'ir-prox',
  IR_SEEK: 'ir-seek',
  IR_REMOTE: 'ir-remote',
  TOUCH: 'touch',
  COL_REFLECT: 'col-reflect',
  COL_AMBIENT: 'col-ambient',
  COL_COLOR: 'col-color',
  L_MOTOR_DEG: 'l-motor-deg',
  L_MOTOR_ROT: 'l-motor-rot',
  M_MOTOR_DEG: 'm-motor-deg',
  M_MOTOR_ROT: 'm-motor-rot',
  NONE: 'none'
};


/**
 * Custom events.
 * @enum {string}
 */
cwc.protocol.ev3.Events = {
  GET_VALUES: 'get_values',
  CHANGED_VALUES: 'changed_values',
  CHANGED_DEVICES: 'changed_devices',
  ACTOR_VALUES_CHANGED: 'actor_values_changed',
  SENSOR_VALUES_CHANGED: 'sensor_values_changed',
  IR_SENSOR_VALUE_CHANGED: 'ir_sensor_value_changed',
  COLOR_SENSOR_VALUE_CHANGED: 'color_sensor_value_changed',
  TOUCH_SENSOR_VALUE_CHANGED: 'touch_sensor_value_changed'
};


/**
 * Gyrosensor modes.
 * @enum {number}
 */
cwc.protocol.ev3.GyroSensorMode = {
  ANGLE: 0,
  RATE: 1
};


/**
 * Input ports.
 * @enum {number}
 */
cwc.protocol.ev3.InputPort = {
  ONE: 0x00,
  TWO: 0x01,
  THREE: 0x02,
  FOUR: 0x03,
  A: 0x10,
  B: 0x11,
  C: 0x12,
  D: 0x13
};


/**
 * IR sensor modes.
 * @enum {number}
 */
cwc.protocol.ev3.IrSensorMode = {
  PROXIMITY: 0,
  SEEK: 1,
  REMOTECONTROL: 2
};


/**
 * Led colors.
 * @enum {number}
 */
cwc.protocol.ev3.LedColor = {
  OFF: 0,
  GREEN: 1,
  RED: 2,
  ORANGE: 3
};


/**
 * Led modes.
 * @enum {number}
 */
cwc.protocol.ev3.LedMode = {
  NORMAL: 0,
  FLASH: 3,
  PULSE: 6
};


/**
 * Led Types.
 * @enum {number}
 */
cwc.protocol.ev3.LedType = {
  ALL: 0,
  RIGHT: {
    RED: 1,
    GREEN: 2
  },
  LEFT: {
    RED: 3,
    GREEN: 4
  }
};


/**
 * Motor modes.
 * @enum {number}
 */
cwc.protocol.ev3.MotorMode = {
  DEGREE: 0,
  ROTATION: 1
};


/**
 * Output ports.
 * @enum {number}
 */
cwc.protocol.ev3.OutputPort = {
  A: 0x01,
  B: 0x02,
  C: 0x04,
  D: 0x08,
  ALL: 0x0F
};


/**
 * Parameter sizes for the different types.
 * @enum {number}
 */
cwc.protocol.ev3.ParameterSize = {
  BYTE: 0x81,   // 1 byte
  SHORT: 0x82,  // 2 bytes
  INT: 0x83,    // 4 bytes
  STRING: 0x84  // null-terminated string
};


/**
 * Motor polarity.
 * @enum {number}
 */
cwc.protocol.ev3.Polarity = {
  BACKWARD: -1,
  OPPOSITE: 0,
  FORWARD: 1
};
