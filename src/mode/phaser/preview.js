/**
 * @fileoverview Preview for the Simple editor.
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
goog.provide('cwc.mode.phaser.Preview');

goog.require('cwc.ui.Preview');
goog.require('cwc.utils.Helper');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.mode.phaser.Preview = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {Element} */
  this.node = null;

  /** @type {!cwc.ui.Preview} */
  this.preview = new cwc.ui.Preview(helper);

  /** @type {string} */
  this.prefix = helper.getPrefix();
};


/**
 * Decorates the preview window.
 * @param {boolean=} opt_blockly_mode
 */
cwc.mode.phaser.Preview.prototype.decorate = function(opt_blockly_mode) {
  this.node = goog.dom.getElement(this.prefix + 'preview-chrome');
  this.helper.setInstance('preview', this.preview, true);
  this.preview.decorate(this.node);
};


/**
 * Shows or hides the built in console.
 * @param {boolean} visible
 */
cwc.mode.phaser.Preview.prototype.showConsole = function(visible) {
  this.preview.showConsole(visible);
};
