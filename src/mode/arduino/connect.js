/**
 * @fileoverview Layout for the Arduino modification.
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
goog.provide('cwc.mode.arduino.Connect');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.arduino.Connect = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {cwc.ui.ConnectionManager} */
  this.connectionManager = helper.getInstance('connectionManager');

  /** @type {cwc.protocol.Arduino.api} */
  this.api = helper.getInstance('arduino');
};


/**
 *
 */
cwc.mode.arduino.Connect.prototype.init = function() {
  if (this.connectionManager) {
    this.connectionManager.getArduino(this.handleConnect_.bind(this));
  }
};


/**
 * @param {cwc.protocol.serial.Device} device
 * @private
 */
cwc.mode.arduino.Connect.prototype.handleConnect_ = function(device) {
  if (device) {
    var runnerInstance = this.helper.getInstance('runner');
    if (runnerInstance) {
      var terminalEvent = runnerInstance.writeTerminal.bind(runnerInstance);
      this.api.setTerminalHandler(terminalEvent);
    }
    this.api.connect(device);
  } else {
    this.api.disconnect();
  }
};
