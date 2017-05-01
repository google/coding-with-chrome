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
goog.provide('cwc.protocol.USB.api');

goog.require('cwc.protocol.USB.Devices');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.USB.api = function(helper) {
  /** @type {string} */
  this.name = 'USB';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {boolean} */
  this.enabled = false;

  /** @type {booleab} */
  this.prepared = false;

  /** @type {chrome.usb} */
  this.usb = chrome.usb;
};


/**
 * Prepares the USB api and monitors the USB devices.
 */
cwc.protocol.USB.api.prototype.prepare = function() {
  if (this.usb && !this.prepared) {
    console.log('Prepare USB support...');
    this.prepared = true;
  }
};
