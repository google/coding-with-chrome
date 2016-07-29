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

goog.require('cwc.ui.connectScreen.Bluetooth');



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

  /** @type {string} */
  this.generalPrefix = this.helper.getPrefix();

  /** @type {Element|StyleSheet} */
  this.styleSheet = null;

  /** @type {cwc.ui.connectScreen.Bluetooth} */
  this.bluetoothScreen = new cwc.ui.connectScreen.Bluetooth(this.helper);
};


/**
 * Shows bluetooth connect screen.
 */
cwc.ui.connectScreen.Screens.prototype.showBluetoothDevices = function() {
  this.bluetoothScreen.showDevices();
};
