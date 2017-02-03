/**
 * @fileoverview Phaser Blockly modifications.
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
goog.provide('cwc.mode.phaser.blockly.Mod');

goog.require('cwc.mode.phaser.Preview');
goog.require('cwc.mode.phaser.blockly.Editor');
goog.require('cwc.mode.phaser.blockly.Layout');
goog.require('cwc.renderer.internal.HTML5');
goog.require('cwc.utils.Helper');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.phaser.blockly.Mod = function(helper) {
  /** @type {!cwc.mode.phaser.blockly.Layout} */
  this.layout = new cwc.mode.phaser.blockly.Layout(helper);

  /** @type {!cwc.mode.phaser.blockly.Editor} */
  this.editor = new cwc.mode.phaser.blockly.Editor(helper);

  /** @type {!cwc.mode.phaser.Preview} */
  this.preview = new cwc.mode.phaser.Preview(helper);

  /** @type {cwc.renderer.internal.HTML5} */
  this.renderer = new cwc.renderer.internal.HTML5(helper);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.phaser.blockly.Mod.prototype.decorate = function() {
  this.layout.decorate();
  this.editor.decorate();
  this.preview.decorate(true);
  this.renderer.init();
};
