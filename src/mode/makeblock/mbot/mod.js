/**
 * @fileoverview mBot modification.
 *
 * @license Copyright 2016 Shenzhen Maker Works Co, Ltd. All Rights Reserved.
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
 * @author wangyu@makeblock.cc (Yu Wang)
 */
goog.provide('cwc.mode.makeblock.mbot.Mod');

goog.require('cwc.mode.default.Mod');
goog.require('cwc.mode.makeblock.mbot.Connection');
goog.require('cwc.mode.makeblock.mbot.Control');
goog.require('cwc.mode.makeblock.mbot.Monitor');
goog.require('cwc.mode.makeblock.mbot.SensorEvents');
goog.require('cwc.mode.makeblock.mbot.Simulation');
goog.require('cwc.renderer.external.makeblock.MBot');
goog.require('cwc.soy.mbot.Blocks');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {boolean=} enableBlockly
 */
cwc.mode.makeblock.mbot.Mod = function(helper, enableBlockly = false) {
  /** @type {boolean} */
  this.enableBlockly = enableBlockly;

  /** @type {!cwc.mode.makeblock.mbot.Connection} */
  this.connection = new cwc.mode.makeblock.mbot.Connection(helper);

  /** @type {!cwc.mode.makeblock.mbot.SensorEvents} */
  this.events = cwc.mode.makeblock.mbot.SensorEvents;

  /** @type {!cwc.mode.default.Mod} */
  this.mod = new cwc.mode.default.Mod(helper);

  /** @type {!cwc.mode.makeblock.mbot.Control} */
  this.control = new cwc.mode.makeblock.mbot.Control(helper, this.connection);

  /** @type {!cwc.mode.makeblock.mbot.Monitor} */
  this.monitor = new cwc.mode.makeblock.mbot.Monitor(helper, this.connection);

  /** @type {!cwc.mode.lego.ev3.Simulation} */
  this.simulation = new cwc.mode.makeblock.mbot.Simulation(helper);

  /** @type {!cwc.renderer.external.makeblock.MBot} */
  this.renderer = new cwc.renderer.external.makeblock.MBot(helper);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.makeblock.mbot.Mod.prototype.decorate = function() {
  if (this.enableBlockly) {
    this.mod.enableBlockly(cwc.soy.mbot.Blocks.toolbox);
  }
  this.mod.setConnection(this.connection);
  this.mod.setMessengerEvents(this.events);
  this.mod.setRenderer(this.renderer);
  this.mod.setSimulation(this.simulation);
  this.mod.decorate();
  this.mod.message.decorateControl(this.control);
  this.mod.message.decorateMonitor(this.monitor);
};
