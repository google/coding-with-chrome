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
goog.provide('cwc.mode.mbot.blockly.Mod');

goog.require('cwc.mode.mbot.Connection');
goog.require('cwc.mode.mbot.Runner');
goog.require('cwc.mode.mbot.blockly.Editor');
goog.require('cwc.mode.mbot.blockly.Layout');
goog.require('cwc.mode.mbot.Monitor');
goog.require('cwc.renderer.external.mbot');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.mbot.blockly.Mod = function(helper) {
  /** @type {cwc.mode.mbot.Connection} */
  this.connection = new cwc.mode.mbot.Connection(helper);

  /** @type {cwc.mode.mbot.advanced.Editor} */
  this.editor = new cwc.mode.mbot.blockly.Editor(helper);

  /** @type {cwc.mode.mbot.Layout} */
  this.layout = new cwc.mode.mbot.blockly.Layout(helper);

  /** @type {cwc.renderer.external.mbot} */
  this.renderer = new cwc.renderer.external.mbot(helper);

  /** @type {cwc.mode.mbot.Runner} */
  this.runner = new cwc.mode.mbot.Runner(helper, this.connection);

  /** @type {cwc.mode.mbot.Monitor} */
  this.monitor = new cwc.mode.mbot.Monitor(helper, this.connection);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.mbot.blockly.Mod.prototype.decorate = function() {
  this.connection.init();
  this.layout.decorate();
  this.editor.decorate();
  this.runner.decorate();
  this.monitor.decorate();
  this.renderer.init();
};
