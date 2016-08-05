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
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.provide('cwc.protocol.makeblock.mbot.Command');
goog.provide('cwc.protocol.makeblock.mbot.CommandType');
goog.provide('cwc.protocol.makeblock.mbot.Device');
goog.provide('cwc.protocol.makeblock.mbot.Header');
goog.provide('cwc.protocol.makeblock.mbot.Port');
goog.provide('cwc.protocol.makeblock.mbot.Slot');


/**
 * Enum of commands for the communication protocol.
 * @enum {!Object.<string>|number}
 */
cwc.protocol.makeblock.mbot.Command = {
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


/**
 * Enum of command types for the communication protocol.
 * @enum {!Object.<string>|number}
 */
cwc.protocol.makeblock.mbot.CommandType = {
  READ: 0x01,
  WRITE: 0x02
};


/**
 * Enum of devices for the communication protocol.
 * @enum {!Object.<string>|number}
 */
cwc.protocol.makeblock.mbot.Device = {
  ULTRASONIC: 1,
  LIGHTSENSOR: 3,
  LEDLIGHT: 8,
  DCMOTOR: 10,
  LINEFOLLOWER: 11,
  BUZZER: 34,
};


/**
 * Header for the communication protocol.
 * @type {!array}
 */
cwc.protocol.makeblock.mbot.Header = [0xff, 0x55];


/**
 * Enum of commands for the communication protocol.
 * @enum {!Object.<string>|number}
 */
cwc.protocol.makeblock.mbot.Slot = {
  LED_LIGHT: 0x02
};


/**
 * Enum of ports for the communication protocol.
 * @enum {!Object.<string>|number}
 */
cwc.protocol.makeblock.mbot.Port = {
  ULTRASONIC: 0x03,
  LINEFOLLOWER: 0x02,
  LIGHTSENSOR: 0x06,
  LED_LIGHT: 0x07,
  LEFT_MOTOR: 0x09,
  RIGHT_MOTOR: 0x0A
};
