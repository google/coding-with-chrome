/**
 * @fileoverview Simple Blockly modifications.
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
goog.provide('cwc.mode.basic.blockly.Mod');

goog.require('cwc.mode.basic.Preview');
goog.require('cwc.mode.default.Message');
goog.require('cwc.mode.default.blockly.Editor');
goog.require('cwc.mode.default.blockly.Layout');
goog.require('cwc.renderer.internal.HTML5');
goog.require('cwc.soy.simple.Blocks');
goog.require('cwc.utils.Helper');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.basic.blockly.Mod = function(helper) {
  /** @type {!cwc.mode.default.blockly.Layout} */
  this.layout = new cwc.mode.default.blockly.Layout(helper);

  /** @type {!cwc.mode.default.blockly.Editor} */
  this.editor = new cwc.mode.default.blockly.Editor(helper);

  /** @type {!cwc.mode.basic.Preview} */
  this.preview = new cwc.mode.basic.Preview(helper);

  /** @type {!cwc.mode.default.Message} */
  this.message = new cwc.mode.default.Message(helper);

  /** @type {cwc.renderer.internal.HTML5} */
  this.renderer = new cwc.renderer.internal.HTML5(helper);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.basic.blockly.Mod.prototype.decorate = function() {
  this.layout.decorate();
  this.editor.decorate(cwc.soy.simple.Blocks.toolbox);
  this.preview.decorate();
  this.message.decorate();
  this.renderer.init();
};
