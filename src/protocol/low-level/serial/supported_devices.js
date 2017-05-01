/**
 * @fileoverview Handles the pairing and communication with USB devices.
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
goog.provide('cwc.protocol.Serial.supportedDevice');
goog.provide('cwc.protocol.Serial.supportedDevicePaths');
goog.provide('cwc.protocol.Serial.supportedDevices');


/**
 * @enum {!Object.<!Object>}
 */
cwc.protocol.Serial.supportedDevice = {
  ARDUINO: {
    'name': 'Arduino',
    'bps': 9600,
  },
  ARDUINO_NANO: {
    'name': 'Arduino Nano',
    'bps': 9600,
  },
  ARDUINO_UNO: {
    'name': 'Arduino UNO',
    'bps': 9600,
  },
  ARDUINO_MEGA: {
    'name': 'Arduino MEGA',
    'bps': 9600,
  },
  EV3_TTY: {
    'name': 'EV3 serial tty',
  },
  EV3_CU: {
    'name': 'EV3 serial cu',  // calling unit
  },
};


/**
 * List of known and supported serial devices.
 * The Format is the following:
 *
 * VENDOR ID {
 *   PRODUCT ID {
 *     CUSTOM NAME: '…'
 *   }
 * }
 *
 * @enum {!Object.<!Object>}
 */
cwc.protocol.Serial.supportedDevices = {
  0x403: {
    0x6001: cwc.protocol.Serial.supportedDevice.ARDUINO_NANO,
  },
  0x2341: {
    0x6001: cwc.protocol.Serial.supportedDevice.ARDUINO_UNO,
    0x0042: cwc.protocol.Serial.supportedDevice.ARDUINO_MEGA,
    0x0043: cwc.protocol.Serial.supportedDevice.ARDUINO_UNO,
  },
};


/**
 * List of known and supported serial devices.
 * The Format is the following:
 *
 * PATH NAME {
 *   CUSTOM NAME: '…'
 * }
 *
 * @enum {!Object.<!Object>}
 */
cwc.protocol.Serial.supportedDevicePaths = {
  '/dev/tty.usbmodem1a1231':
      cwc.protocol.Serial.supportedDevice.ARDUINO,
  '/dev/cu.EV3-SerialPort':
      cwc.protocol.Serial.supportedDevice.EV3_CU,
  '/dev/tty.EV3-SerialPort':
      cwc.protocol.Serial.supportedDevice.EV3_TTY,
};
