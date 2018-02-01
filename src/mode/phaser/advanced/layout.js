/**
 * @fileoverview Layout for the Phaser advanced modification.
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
goog.provide('cwc.mode.phaser.advanced.Layout');

goog.require('cwc.soy.mode.phaser.advanced.Layout');
goog.require('cwc.utils.Helper');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.phaser.advanced.Layout = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!number} */
  this.layoutWidth = 600;
};


/**
 * Decorates the Blockly layout.
 */
cwc.mode.phaser.advanced.Layout.prototype.decorate = function() {
  let layoutInstance = this.helper.getInstance('layout', true);
  layoutInstance.decorateDefault(this.layoutWidth);
  layoutInstance.renderMiddleContent(
    cwc.soy.mode.phaser.advanced.Layout.editor);
  layoutInstance.renderRightContent(
    cwc.soy.mode.phaser.advanced.Layout.preview);
};
