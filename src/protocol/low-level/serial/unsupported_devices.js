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
goog.provide('cwc.protocol.Serial.unsupportedDevicePaths');


/**
 * List of unknown or unsupported serial devices.
 * The Format is the following:
 *
 * Object {
 *   PATH: 'Comment...'
 * }
 *
 * @enum {!Object.<!Object>}
 */
cwc.protocol.Serial.unsupportedDevicePaths = {
  '/dev/cu.Bluetooth-Incoming-Port': 'Unsupported',
  '/dev/tty.Bluetooth-Incoming-Port': 'Unsupported',
  '/dev/cu.Bluetooth-Modem': 'Unsupported',
  '/dev/tty.Bluetooth-Modem': 'Unsupported',
  '/dev/cu.EV3-SerialPort': 'Not tested yet.',
  '/dev/tty.EV3-SerialPort': 'Not tested yet.',
};
