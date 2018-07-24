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
goog.provide('cwc.protocol.makeblock.mBotRanger.Action');
goog.provide('cwc.protocol.makeblock.mBotRanger.ByteType');
goog.provide('cwc.protocol.makeblock.mBotRanger.DataType');
goog.provide('cwc.protocol.makeblock.mBotRanger.Device');
goog.provide('cwc.protocol.makeblock.mBotRanger.Header');
goog.provide('cwc.protocol.makeblock.mBotRanger.IndexType');
goog.provide('cwc.protocol.makeblock.mBotRanger.Port');
goog.provide('cwc.protocol.makeblock.mBotRanger.Slot');


/**
 * In future developments, this should be replaced by a state machine.
 * @enum {number}
 */
cwc.protocol.makeblock.mBotRanger.ByteType = {
  INDEX: 2,
  DATATYPE: 3,
  PAYLOAD: 4,
};


/**
 * Enum of command types for the communication protocol.
 * @enum {number}
 */
cwc.protocol.makeblock.mBotRanger.Action = {
  GET: 0x01,
  RUN: 0x02,
  RESET: 0x04,
  START: 0x05,
};


/**
 * Enum of data types.
 * @enum {number}
 */
cwc.protocol.makeblock.mBotRanger.DataType = {
  BYTE: 1,
  FLOAT: 2,
  SHORT: 3,
  STRING: 4,
};


/**
 * Enum of devices for the communication protocol.
 * @enum {number}
 */
cwc.protocol.makeblock.mBotRanger.Device = {
  ENCODER: 12,
  ENCODER_BOARD: 62,
  GYRO: 6,
  IR: 13,
  IRREMOTE: 14,
  LIGHTSENSOR: 0x03,
  LINEFOLLOWER: 17,
  MOTOR: 10,
  RGBLED: 8,
  SOUND_SENSOR: 7,
  TEMPERATURE: 0x1b,
  TONE: 34,
  ULTRASONIC: 0x01,
  VERSION: 0,
};


/**
 * Header for the communication protocol.
 * @type {!Array}
 */
cwc.protocol.makeblock.mBotRanger.Header = [0xff, 0x55];


/**
 * Enum of implemented callback types.
 * @enum {number}
 */
cwc.protocol.makeblock.mBotRanger.IndexType = {
  NONE: 0x00,
  ACK: 0x0d,
  ULTRASONIC: 0x10,
  LINEFOLLOWER: 0x11,
  LIGHTSENSOR_1: 0x2a,
  LIGHTSENSOR_2: 0x2b,
  TEMPERATURE: 0x21,
  VERSION: 0x20,
};


/**
 * Enum of ports for the communication protocol.
 * @enum {number}
 */
cwc.protocol.makeblock.mBotRanger.Port = {
  AUTO: 0x00,
  ENCODER_BOARD_POS: 0x01,
  ENCODER_BOARD_SPEED: 0x02,
  ULTRASONIC: 0x0a,
  LINEFOLLOWER: 0x09,
  LIGHTSENSOR_1: 0x0c,
  LIGHTSENSOR_2: 0x0d,
  LEFT_MOTOR: 0x22,
  RIGHT_MOTOR: 0x11,
  RGBLED: 0x2c,
  TONE: 0x2d,
  TEMPERATURE: 0x0d,
};


/**
 * Enum of commands for the communication protocol.
 * @enum {number}
 */
cwc.protocol.makeblock.mBotRanger.Slot = {
  AUTO: 0,
  ONE: 1,
  TWO: 2,
};
