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
goog.provide('cwc.protocol.USB.supportedDevices');


/**
 * List of known and supported USB devices.
 * The Format is the following:
 *
 * VENDOR ID {
 *   PRODUCT ID {
 *     CUSTOM NAME: '…'
 *   }
 * }
 *
 * The supported device can be accessed over the custom device name.
 *
 * @enum {!Object.<!Object>}
 */
cwc.protocol.USB.supportedDevices = {
  '9025': {
    '32822': {
      'id': 'arduino_leonardo',
      'name': 'Arduino Leonardo'
    }
  },
  '2341': {
    '0043': {
      'name': 'Ardunio Uno'
    }
  }
};
