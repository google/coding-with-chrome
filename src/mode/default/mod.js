/**
 * @fileoverview Default Editor modifications.
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
goog.provide('cwc.mode.default.Mod');

goog.require('cwc.mode.default.Layout');
goog.require('cwc.renderer.internal.HTML5');
goog.require('cwc.ui.Message');
goog.require('cwc.ui.Preview');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.default.Mod = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.ui.Editor} */
  this.editor = new cwc.ui.Editor(this.helper);

  /** @type {!cwc.mode.default.Layout} */
  this.layout = new cwc.mode.default.Layout(this.helper);

  /** @type {!cwc.ui.Message} */
  this.message = new cwc.ui.Message(this.helper);

  /** @type {!cwc.ui.Preview} */
  this.preview = new cwc.ui.Preview(this.helper);

  /** @type {cwc.renderer.internal.HTML5} */
  this.renderer = new cwc.renderer.internal.HTML5(this.helper);
};


/**
 * Decorates standard Blockly editor.
 */
cwc.mode.default.Mod.prototype.decorate = function() {
  this.layout.decorate();
  this.decorateEditor();
  this.decoratePreview();
  this.decorateMessage();
  this.renderer.init();
};


/**
 * Decorates editor
 */
cwc.mode.default.Mod.prototype.decorateEditor = function() {
  this.helper.setInstance('editor', this.editor, true);
  this.editor.decorate();
  this.editor.showEditorViews(true);
  this.editor.enableMediaButton(true);
};


/**
 * Decorates preview
 */
cwc.mode.default.Mod.prototype.decoratePreview = function() {
  this.helper.setInstance('preview', this.preview, true);
  this.preview.decorate();
};


/**
 * Decorates the editor.
 */
cwc.mode.default.Mod.prototype.decorateMessage = function() {
  this.helper.setInstance('message', this.message, true);
  this.message.decorate();
};


/**
 * @param {cwc.renderer.internal.HTML5|
 *         cwc.renderer.internal.Javascript} renderer
 */
cwc.mode.default.Mod.prototype.setRenderer = function(renderer) {
  this.renderer = renderer;
};
