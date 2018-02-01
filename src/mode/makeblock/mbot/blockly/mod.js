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
goog.provide('cwc.mode.makeblock.mbot.blockly.Mod');

goog.require('cwc.mode.default.blockly.Editor');
goog.require('cwc.mode.makeblock.mbot.Connection');
goog.require('cwc.mode.makeblock.mbot.Monitor');
goog.require('cwc.mode.makeblock.mbot.Runner');
goog.require('cwc.mode.makeblock.mbot.blockly.Layout');
goog.require('cwc.renderer.external.makeblock.MBot');
goog.require('cwc.soy.mbot.Blocks');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.makeblock.mbot.blockly.Mod = function(helper) {
  /** @type {cwc.mode.makeblock.blockly.Editor} */
  this.editor = new cwc.mode.default.blockly.Editor(helper);

  /** @type {cwc.mode.makeblock.mbot.Connection} */
  this.connection = new cwc.mode.makeblock.mbot.Connection(helper);

  /** @type {cwc.mode.makeblock.mbot.blockly.Layout} */
  this.layout = new cwc.mode.makeblock.mbot.blockly.Layout(helper);

  /** @type {cwc.renderer.external.makeblock.MBot} */
  this.renderer = new cwc.renderer.external.makeblock.MBot(helper);

  /** @type {cwc.mode.makeblock.mbot.Runner} */
  this.runner = new cwc.mode.makeblock.mbot.Runner(helper, this.connection);

  /** @type {cwc.mode.makeblock.mbot.Monitor} */
  this.monitor = new cwc.mode.makeblock.mbot.Monitor(helper, this.connection);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.makeblock.mbot.blockly.Mod.prototype.decorate = function() {
  this.connection.init();
  this.layout.decorate();
  this.editor.decorate(cwc.soy.mbot.Blocks.toolbox);
  this.runner.decorate();
  this.monitor.decorate();
  this.renderer.init();
};
