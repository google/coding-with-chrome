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
goog.provide('cwc.mode.makeblock.mbotRanger.blockly.Mod');

goog.require('cwc.mode.default.Mod');
goog.require('cwc.mode.makeblock.mbotRanger.Connection');
goog.require('cwc.mode.makeblock.mbotRanger.Monitor');
goog.require('cwc.mode.makeblock.mbotRanger.Runner');
goog.require('cwc.renderer.external.makeblock.MBotRanger');
goog.require('cwc.soy.mbotRanger.Blocks');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.makeblock.mbotRanger.blockly.Mod = function(helper) {
  /** @type {!cwc.mode.makeblock.mbotRanger.Connection} */
  this.connection = new cwc.mode.makeblock.mbotRanger.Connection(helper);

  /** @type {!cwc.mode.default.Mod} */
  this.mod = new cwc.mode.default.Mod(helper);

  /** @type {!cwc.mode.makeblock.mbotRanger.Monitor} */
  this.monitor = new cwc.mode.makeblock.mbotRanger.Monitor(helper,
    this.connection);

  /** @type {!cwc.renderer.external.makeblock.MBotRanger} */
  this.renderer = new cwc.renderer.external.makeblock.MBotRanger(helper);

  /** @type {!cwc.mode.makeblock.mbotRanger.Runner} */
  this.runner = new cwc.mode.makeblock.mbotRanger.Runner(helper,
    this.connection);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.makeblock.mbotRanger.blockly.Mod.prototype.decorate = function() {
  this.mod.enableBlockly(cwc.soy.mbotRanger.Blocks.toolbox);
  this.mod.setConnection(this.connection);
  this.mod.setMonitor(this.monitor);
  this.mod.setRenderer(this.renderer);
  this.mod.setRunner(this.runner);
  this.mod.decorate();
};
