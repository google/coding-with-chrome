/**
 * @fileoverview EV3 Blockly modifications.
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
goog.provide('cwc.mode.lego.ev3.blockly.Mod');

goog.require('cwc.mode.default.Mod');
goog.require('cwc.mode.lego.ev3.Connection');
goog.require('cwc.mode.lego.ev3.Control');
goog.require('cwc.mode.lego.ev3.DeviceEvents');
goog.require('cwc.mode.lego.ev3.Hints');
goog.require('cwc.mode.lego.ev3.Monitor');
goog.require('cwc.mode.lego.ev3.SensorEvents');
goog.require('cwc.mode.lego.ev3.Simulation');
goog.require('cwc.renderer.external.EV3');
goog.require('cwc.soy.ev3.Blocks');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.lego.ev3.blockly.Mod = function(helper) {
  /** @type {!cwc.mode.lego.ev3.Connection} */
  this.connection = new cwc.mode.lego.ev3.Connection(helper);

  /** @type {!cwc.mode.lego.ev3.SensorEvents} */
  this.events = Object.assign(
    cwc.mode.lego.ev3.DeviceEvents, cwc.mode.lego.ev3.SensorEvents,
  );

  /** @type {!cwc.mode.default.Mod} */
  this.mod = new cwc.mode.default.Mod(helper);

  /** @type {!cwc.mode.lego.ev3.Control} */
  this.control = new cwc.mode.lego.ev3.Control(helper, this.connection);

  /** @type {!cwc.mode.lego.ev3.Monitor} */
  this.monitor = new cwc.mode.lego.ev3.Monitor(helper, this.connection);

  /** @type {!cwc.mode.lego.ev3.Simulation} */
  this.simulation = new cwc.mode.lego.ev3.Simulation(helper);

  /** @type {!cwc.renderer.external.EV3} */
  this.renderer = new cwc.renderer.external.EV3(helper);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.lego.ev3.blockly.Mod.prototype.decorate = function() {
  this.mod.enableBlockly(cwc.soy.ev3.Blocks.toolbox);
  this.mod.setConnection(this.connection);
  this.mod.setMessengerEvents(this.events);
  this.mod.setRenderer(this.renderer);
  this.mod.setSimulation(this.simulation);
  this.mod.decorate();
  this.mod.preview.getMessenger().addListener('setSensorMode',
    this.connection.setSensorMode, this.connection);
  this.mod.message.decorateControl(this.control);
  this.mod.message.decorateMonitor(this.monitor);
  this.mod.editor.setLocalHints(cwc.mode.lego.ev3.Hints);
};
