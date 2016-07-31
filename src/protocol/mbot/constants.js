/**
 * @fileoverview Define constants used in mbot protocol.
 *
 * define constants used in mbot protocol
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


goog.provide('cwc.protocol.mbot.Command');


/**
 * Enum of commands for the communication protocol.
 * @enum {!Object.<string>|number}
 */
cwc.protocol.mbot.Command = {
  PREFIX_A: 0xff,
  PREFIX_B: 0x55,

  COMMAND_READ: 1,
  COMMAND_WRITE: 2,

  INDEX_WITHOUT_RESPONSE: 99,

  DEVICE_ULTRASONIC: 1,
  DEVICE_LIGHTSENSOR: 3,
  DEVICE_LEDLIGHT: 8,
  DEVICE_DCMOTOR: 10,
  DEVICE_LINEFOLLOWER: 11,
  DEVICE_BUZZER: 34,

  PORT_ULTRASONIC: 3,
  PORT_LIGHTSENSOR: 6,
  PORT_LINEFOLLOWER: 2,
  PORT_LED_LIGHT: 7,
  PORT_LEFT_MOTOR: 9,
  PORT_RIGHT_MOTOR: 10,

  SLOT_LED_LIGHT: 2,

  DATATYPE_BYTE: 1,
  DATATYPE_FLOAT: 2,
  DATATYPE_SHORT: 3,
  DATATYPE_STRING: 4,

  // In future developments, this should be replaced by a state machine.
  BYTE_INDEX: 2,
  BYTE_DATATYPE: 3,
  BYTE_PAYLOAD: 4,

  LINEFOLLOWER_SUM_BLACK_BLACK: 128,
  LINEFOLLOWER_SUM_BLACK_WHITE: 64,
  LINEFOLLOWER_SUM_WHITE_BLACK: 191,
  LINEFOLLOWER_SUM_WHITE_WHITE: 0,
};
