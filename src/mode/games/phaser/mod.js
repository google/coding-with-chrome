/**
 * @fileoverview Phaser modifications.
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
goog.provide('cwc.mode.phaser.Mod');

goog.require('cwc.mode.default.Mod');
goog.require('cwc.renderer.external.Phaser');
goog.require('cwc.soy.phaser.Blocks');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {boolean=} enableBlockly
 */
cwc.mode.phaser.Mod = function(helper, enableBlockly = false) {
  /** @type {boolean} */
  this.enableBlockly = enableBlockly;

  /** @type {!cwc.mode.default.Mod} */
  this.mod = new cwc.mode.default.Mod(helper);

  /** @type {!cwc.renderer.external.Phaser} */
  this.renderer = new cwc.renderer.external.Phaser(helper);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.phaser.Mod.prototype.decorate = async function() {
  if (this.enableBlockly) {
    this.mod.enableBlockly(cwc.soy.phaser.Blocks.toolbox);
  }
  this.mod.setRenderer(this.renderer);
  await this.mod.decorate();
  if (this.enableBlockly) {
    this.mod.blockly.enableToolboxAutoCollapse(true);
    this.mod.blockly.disableOrphansBlocks(true);
  }
};
