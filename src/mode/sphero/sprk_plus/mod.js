/**
 * @fileoverview Sphero SPRK+ modifications.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
goog.provide('cwc.mode.sphero.sprkPlus.Mod');

goog.require('cwc.mode.default.Mod');
goog.require('cwc.mode.sphero.Hints');
goog.require('cwc.mode.sphero.sprkPlus.Calibration');
goog.require('cwc.mode.sphero.sprkPlus.Connection');
goog.require('cwc.mode.sphero.sprkPlus.Control');
goog.require('cwc.mode.sphero.sprkPlus.Monitor');
goog.require('cwc.mode.sphero.sprkPlus.SensorEvents');
goog.require('cwc.mode.sphero.sprkPlus.Simulation');
goog.require('cwc.renderer.external.Sphero');
goog.require('cwc.soy.sphero.sprkPlus.Blocks');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {boolean=} enableBlockly
 */
cwc.mode.sphero.sprkPlus.Mod = function(helper, enableBlockly = false) {
  /** @type {boolean} */
  this.enableBlockly = enableBlockly;

  /** @type {!cwc.mode.sphero.sprkPlus.Connection} */
  this.connection = new cwc.mode.sphero.sprkPlus.Connection(helper);

  /** @type {!cwc.mode.sphero.sprkPlus.SensorEvents} */
  this.events = Object.assign(cwc.mode.sphero.sprkPlus.SensorEvents);

  /** @type {!cwc.mode.default.Mod} */
  this.mod = new cwc.mode.default.Mod(helper);

  /** @type {!cwc.mode.sphero.sprkPlus.Calibration} */
  this.calibration = new cwc.mode.sphero.sprkPlus.Calibration(
    helper, this.connection);

  /** @type {!cwc.mode.sphero.sprkPlus.Control} */
  this.control = new cwc.mode.sphero.sprkPlus.Control(helper, this.connection);

  /** @type {!cwc.mode.sphero.sprkPlus.Monitor} */
  this.monitor = new cwc.mode.sphero.sprkPlus.Monitor(helper, this.connection);

  /** @type {!cwc.mode.sphero.sprkPlus.Simulation} */
  this.simulation = new cwc.mode.sphero.sprkPlus.Simulation(helper);

  /** @type {!cwc.renderer.external.Sphero} */
  this.renderer = new cwc.renderer.external.Sphero(helper);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.sphero.sprkPlus.Mod.prototype.decorate = function() {
  if (this.enableBlockly) {
    this.mod.enableBlockly(cwc.soy.sphero.sprkPlus.Blocks.toolbox);
  }
  this.mod.setConnection(this.connection);
  this.mod.setMessengerEvents(this.events);
  this.mod.setRenderer(this.renderer);
  this.mod.setSimulation(this.simulation);
  this.mod.decorate();
  this.mod.message.decorateCalibration(this.calibration);
  this.mod.message.decorateControl(this.control);
  this.mod.message.decorateMonitor(this.monitor);
  this.mod.editor.setLocalHints(cwc.mode.sphero.Hints);
};
