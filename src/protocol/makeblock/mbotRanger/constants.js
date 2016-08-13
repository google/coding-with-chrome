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
goog.provide('cwc.protocol.makeblock.mbotRanger.Action');
goog.provide('cwc.protocol.makeblock.mbotRanger.ByteType');
goog.provide('cwc.protocol.makeblock.mbotRanger.DataType');
goog.provide('cwc.protocol.makeblock.mbotRanger.Device');
goog.provide('cwc.protocol.makeblock.mbotRanger.Header');
goog.provide('cwc.protocol.makeblock.mbotRanger.IndexType');
goog.provide('cwc.protocol.makeblock.mbotRanger.Port');
goog.provide('cwc.protocol.makeblock.mbotRanger.Slot');



/**
 * In future developments, this should be replaced by a state machine.
 * @enum {!Object.<string>|number}
 */
cwc.protocol.makeblock.mbotRanger.ByteType = {
  INDEX: 2,
  DATATYPE: 3,
  PAYLOAD: 4
};


/**
 * Enum of command types for the communication protocol.
 * @enum {!Object.<string>|number}
 */
cwc.protocol.makeblock.mbotRanger.Action = {
  GET: 0x01,
  RUN: 0x02,
  RESET: 0x04,
  START: 0x05
};


/**
 * Enum of data types.
 * @enum {!Object.<string>|number}
 */
cwc.protocol.makeblock.mbotRanger.DataType = {
  BYTE: 1,
  FLOAT: 2,
  SHORT: 3,
  STRING: 4
};


/**
 * Enum of devices for the communication protocol.
 * @enum {!Object.<string>|number}
 */
cwc.protocol.makeblock.mbotRanger.Device = {
  VERSION: 0,
  ULTRASONIC: 1,
  TEMPERATURE_SENSOR: 2,
  LIGHTSENSOR: 3,
  GYRO: 6,
  SOUND_SENSOR: 7,
  RGBLED: 8,
  MOTOR: 10,
  ENCODER: 12,
  IR: 13,
  IRREMOTE: 14,
  LINEFOLLOWER: 17,
  BUTTON: 22,
  TONE: 34
};


/**
 * Header for the communication protocol.
 * @type {!array}
 */
cwc.protocol.makeblock.mbotRanger.Header = [0xff, 0x55];


/**
 * Enum of implemented callback types.
 * @enum {number}
 */
cwc.protocol.makeblock.mbotRanger.IndexType = {
  NONE: 0x00,
  ULTRASONIC: 0x10,
  LINEFOLLOWER: 0x11,
  LIGHTSENSOR: 0x12,
  VERSION: 0x20,
  INNER_BUTTON: 0x80
};


/**
 * Enum of ports for the communication protocol.
 * @enum {!Object.<string>|number}
 */
cwc.protocol.makeblock.mbotRanger.Port = {
  AUTO: 0,
  ULTRASONIC: 10,
  LINEFOLLOWER: 11,
  LIGHTSENSOR: 0x06,
  RGBLED: 44,
  LEFT_MOTOR: 0x22,
  RIGHT_MOTOR: 0x11,
  TONE: 45
};


/**
 * Enum of commands for the communication protocol.
 * @enum {!Object.<string>|number}
 */
cwc.protocol.makeblock.mbotRanger.Slot = {
  AUTO: 0,
  ONE: 1,
  TWO: 2
};
