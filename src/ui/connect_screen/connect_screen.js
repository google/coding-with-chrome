/**
 * @fileoverview Connect Screen for different types of devices.
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
goog.provide('cwc.ui.connectScreen.Screens');

goog.require('cwc.soy.connectScreen.Screens');
goog.require('cwc.ui.connectScreen.Bluetooth');
goog.require('cwc.ui.connectScreen.Serial');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 */
cwc.ui.connectScreen.Screens = function(helper) {
  /** @type {string} */
  this.name = 'ConnectScreen';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('connectScreen');

  /** @type {cwc.ui.connectScreen.Bluetooth} */
  this.bluetoothScreen = new cwc.ui.connectScreen.Bluetooth(this.helper);

  /** @type {cwc.ui.connectScreen.Serial} */
  this.serialScreen = new cwc.ui.connectScreen.Serial(this.helper);
};


/**
 * Request user to connect the specific device, if not already connected.
 * @param {cwc.lib.protocol.bluetoothWeb.profile.Device} device
 * @return {Promise}
 */
cwc.ui.connectScreen.Screens.prototype.requestBluetoothDevice = function(
    device) {
  return this.bluetoothScreen.requestDevice(device);
};


/**
 * Shows bluetooth connect screen.
 */
cwc.ui.connectScreen.Screens.prototype.showBluetoothDevices = function() {
  this.bluetoothScreen.showDevices();
};


/**
 * Shows serial connect screen.
 */
cwc.ui.connectScreen.Screens.prototype.showSerialDevices = function() {
  this.serialScreen.showDevices();
};


/**
 * @param {string} title
 * @param {string} text
 * @param {number} step
 */
cwc.ui.connectScreen.Screens.prototype.showConnectingStep = function(
    title, text, step) {
  this.helper.getInstance('dialog').showTemplate(title,
    cwc.soy.connectScreen.Screens.connectingSteps, {
      step: step,
      text: text,
    });
  if (step == 3) {
    window.setTimeout(() => {
      this.helper.getInstance('dialog').close();
    }, 2000);
  }
};
