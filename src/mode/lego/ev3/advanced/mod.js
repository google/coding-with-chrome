/**
 * @fileoverview EV3 Advanced modifications.
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
goog.provide('cwc.mode.lego.ev3.advanced.Mod');

goog.require('cwc.mode.default.Mod');
goog.require('cwc.mode.lego.ev3.Calibration');
goog.require('cwc.mode.lego.ev3.Connection');
goog.require('cwc.mode.lego.ev3.Hints');
goog.require('cwc.mode.lego.ev3.Monitor');
goog.require('cwc.mode.lego.ev3.Runner');
goog.require('cwc.renderer.external.EV3');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.lego.ev3.advanced.Mod = function(helper) {
  /** @type {!cwc.mode.lego.ev3.Connection} */
  this.connection = new cwc.mode.lego.ev3.Connection(helper);

  /** @type {!cwc.mode.default.Mod} */
  this.mod = new cwc.mode.default.Mod(helper);

  /** @type {!cwc.mode.lego.ev3.Monitor} */
  this.monitor = new cwc.mode.lego.ev3.Monitor(helper, this.connection);

  /** @type {!cwc.renderer.external.EV3} */
  this.renderer = new cwc.renderer.external.EV3(helper);

  /** @type {!cwc.mode.lego.ev3.Runner} */
  this.runner = new cwc.mode.lego.ev3.Runner(helper, this.connection);

  /** @type {!cwc.mode.lego.ev3.Calibration} */
  this.calibration = new cwc.mode.lego.ev3.Calibration(helper, this.connection,
    this.runner, this.monitor);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.lego.ev3.advanced.Mod.prototype.decorate = function() {
  this.mod.setConnection(this.connection);
  this.mod.setMonitor(this.monitor);
  this.mod.setRenderer(this.renderer);
  this.mod.setRunner(this.runner);
  this.mod.decorate();
  this.mod.editor.setLocalHints(cwc.mode.lego.ev3.Hints);
  this.calibration.decorate();
};
