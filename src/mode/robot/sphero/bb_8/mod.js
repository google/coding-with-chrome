/**
 * @fileoverview Sphero BB-8 modifications.
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
goog.provide('cwc.mode.sphero.bb8.Mod');

goog.require('cwc.mode.default.Mod');
goog.require('cwc.mode.sphero.bb8.Connection');
goog.require('cwc.mode.sphero.sphero2.Calibration');
goog.require('cwc.mode.sphero.sphero2.Control');
goog.require('cwc.mode.sphero.sphero2.Simulation');
goog.require('cwc.mode.sphero.sprkPlus.SensorEvents');
goog.require('cwc.renderer.external.sphero.Sphero2');
goog.require('cwc.soy.sphero.Blocks');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {boolean=} enableBlockly
 */
cwc.mode.sphero.bb8.Mod = function(helper, enableBlockly = false) {
  /** @type {boolean} */
  this.enableBlockly = enableBlockly;

  /** @type {!cwc.mode.sphero.bb8.Connection} */
  this.connection = new cwc.mode.sphero.bb8.Connection(helper);

  /** @type {!cwc.mode.sphero.sprkPlus.SensorEvents} */
  this.events = Object.assign(cwc.mode.sphero.sprkPlus.SensorEvents);

  /** @type {!cwc.mode.default.Mod} */
  this.mod = new cwc.mode.default.Mod(helper);

  /** @type {!cwc.mode.sphero.sphero2.Calibration} */
  this.calibration = new cwc.mode.sphero.sphero2.Calibration(
    helper, this.connection);

  /** @type {!cwc.mode.sphero.sphero2.Control} */
  this.control = new cwc.mode.sphero.sphero2.Control(helper, this.connection);

  /** @type {!cwc.mode.sphero.sphero2.Simulation} */
  this.simulation = new cwc.mode.sphero.sphero2.Simulation(helper);

  /** @type {!cwc.renderer.external.sphero.Sphero2} */
  this.renderer = new cwc.renderer.external.sphero.Sphero2(helper);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.sphero.bb8.Mod.prototype.decorate = function() {
  if (this.enableBlockly) {
    this.mod.enableBlockly(cwc.soy.sphero.Blocks.toolbox);
  }
  this.mod.setConnection(this.connection);
  this.mod.setMessengerEvents(this.events);
  this.mod.setRenderer(this.renderer);
  this.mod.setSimulation(this.simulation);
  this.mod.decorate();
  this.mod.message.decorateControl(this.control);
  this.mod.message.decorateCalibration(this.calibration);
  this.mod.editor.setLocalHints(cwc.mode.sphero.Hints);
};
