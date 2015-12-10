/**
 * @fileoverview Handles the pairing and communication with USB devices.
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
goog.provide('cwc.protocol.USB.Device');
goog.provide('cwc.protocol.USB.Devices');



/**
 * @constructor
 */
cwc.protocol.USB.Device = function() {

  /** @type {string} */
  this.address = '';

  /** @type {boolean} */
  this.connected = false;

  /** @type {string} */
  this.deviceClass = '';

  /** @type {string} */
  this.name = '';

  /** @type {string} */
  this.rssi = '';

  /** @type {boolean} */
  this.paired = false;
};



/**
 * @constructor
 */
cwc.protocol.USB.Devices = function() {

};


/**
 * Updates device list.
 */
cwc.protocol.USB.Devices.prototype.updateDevices = function() {
  var devices = cwc.protocol.USB.supportedDevices;
  for (var i = 0; i < devices.length; i++) {
    for (var i2 = 0; i2 < devices[i].length; i2++) {
      var vendorId = i;
      var productId = i2;
      var device = devices[vendorId][i2];
      console.log('Search for usb device', device.name);
      chrome.usb.getDevices({'vendorId': vendorId, 'productId': productId},
          this.onDeviceFound);
    }
  }
};


/**
 * @param {?} devices
 */
cwc.protocol.USB.Devices.prototype.handleOnDeviceFound = function(
    devices) {
  if (devices) {
    if (devices.length > 0) {
      console.log('Device(s) found:', devices.length);
    } else {
      console.log('Device could not be found');
    }
  } else {
    console.log('No device found.');
  }
};

