/**
 * @fileoverview Default Blockly modifications.
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
goog.provide('cwc.mode.default.blockly.Mod');

goog.require('cwc.mode.default.blockly.Editor');
goog.require('cwc.mode.default.blockly.Layout');
goog.require('cwc.renderer.internal.HTML5');
goog.require('cwc.ui.Message');
goog.require('cwc.ui.Preview');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.default.blockly.Mod = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.mode.default.blockly.Editor} */
  this.editor = new cwc.mode.default.blockly.Editor(this.helper);

  /** @type {!cwc.mode.default.blockly.Layout} */
  this.layout = new cwc.mode.default.blockly.Layout(this.helper);

  /** @type {!cwc.ui.Message} */
  this.message = new cwc.ui.Message(this.helper);

  /** @type {!cwc.ui.Preview} */
  this.preview = new cwc.ui.Preview(this.helper);

  /** @type {cwc.renderer.internal.HTML5} */
  this.renderer = new cwc.renderer.internal.HTML5(this.helper);
};


/**
 * Decorates standard Blockly editor.
 * @param {!Function} toolbox
 */
cwc.mode.default.blockly.Mod.prototype.decorate = function(toolbox) {
  this.layout.decorate();
  this.editor.decorate(toolbox);
  this.decoratePreview();
  this.decorateMessage();
  this.renderer.init();
};


/**
 * Decorates preview
 */
cwc.mode.default.blockly.Mod.prototype.decoratePreview = function() {
  this.helper.setInstance('preview', this.preview, true);
  this.preview.decorate();
};


/**
 * Decorates the editor.
 */
cwc.mode.default.blockly.Mod.prototype.decorateMessage = function() {
  this.helper.setInstance('message', this.message);
  this.message.decorate();
};
