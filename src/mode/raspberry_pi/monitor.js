/**
 * @fileoverview Monitor layout for the Raspberry Pi modification.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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
goog.provide('cwc.mode.raspberryPi.Monitor');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.raspberryPi.Monitor = function(helper) {
  /** @type {string} */
  this.name = 'Sphero Monitor';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!string} */
  this.prefix = this.helper.getPrefix('raspberry_pi-monitor');

  /** @private {cwc.ui.RunnerMonitor} */
  this.runnerMonitor_ = null;
};


/**
 * @export
 */
cwc.mode.raspberryPi.Monitor.prototype.decorate = function() {
  let runnerInstance = this.helper.getInstance('runner', true);
  this.runnerMonitor_ = runnerInstance.getMonitor();
  if (!this.runnerMonitor_) {
    console.error('Runner Monitor is not there!', this.runnerMonitor_);
    return;
  }
  this.runnerMonitor_.showCalibrationTab(false);
  this.runnerMonitor_.showControlTab(false);
  this.runnerMonitor_.showIntroTab(false);
  this.runnerMonitor_.showMonitorTab(false);
  runnerInstance.enableMonitor(true);

  let layoutInstance = this.helper.getInstance('layout', true);
  layoutInstance.refresh();
};
