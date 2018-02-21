/**
 * @fileoverview Sphero Classic General definitions of devices and bytecodes.
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
goog.provide('cwc.protocol.sphero.classic.CallbackType');
goog.provide('cwc.protocol.sphero.classic.Command');
goog.provide('cwc.protocol.sphero.classic.CommandType');
goog.provide('cwc.protocol.sphero.classic.MessageType');


/**
 * @enum {number}
 */
cwc.protocol.sphero.classic.AntiDOS = {
  DEVELOPER_MODE: [0x30, 0x31, 0x31, 0x69, 0x33],
};


/**
 * @enum {number}
 */
cwc.protocol.sphero.classic.CallbackType = {
  NONE: 0x00,
  LOCATION: 0x10,
  RGB: 0x15,
  VERSION: 0x20,
  UNKNOWN: 0xF0,
};


/**
 * @enum {!Object.<Array>|Array}
 */
cwc.protocol.sphero.classic.Command = {
  SYSTEM: {
    PING: [0x00, 0x01],
    VERSION: [0x00, 0x02],
    POWER_STATE: [0x00, 0x20],
    SLEEP: [0x00, 0x22],
  },
  HEADING: [0x02, 0x01],
  DATA_STREAMING: [0x02, 0x11],
  COLLISION_DETECTION: [0x02, 0x12],
  LOCATION: {
    SET: [0x02, 0x13],
    GET: [0x02, 0x15],
  },
  RGB_LED: {
    SET: [0x02, 0x20],
    GET: [0x02, 0x22],
  },
  BACK_LED: [0x02, 0x21],
  ROLL: [0x02, 0x30],
  BOOST: [0x02, 0x31],
  MOVE: [0x02, 0x32],
  POWER: [0x02, 0x33],
  MOTION_TIMEOUT: [0x02, 0x34],
};


/**
 * @enum {!Object.<number>|number}
 */
cwc.protocol.sphero.classic.CommandType = {
  DIRECT: {
    REPLY: 0xFF,
    NOREPLY: 0xFE,
  },
};


/**
 * @enum {number}
 */
cwc.protocol.sphero.classic.MessageType = {
  COLLISION_DETECTED: 0x07,
};
