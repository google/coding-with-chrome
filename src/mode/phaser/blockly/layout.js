/**
 * @fileoverview Layout for the Phaser Blockly modification.
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
goog.provide('cwc.mode.phaser.blockly.Layout');

goog.require('cwc.soy.mode.phaser.blockly.Layout');
goog.require('cwc.utils.Helper');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.phaser.blockly.Layout = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = helper.getPrefix();

  /** @type {!number} */
  this.layoutWidth = 600;
};


/**
 * Decorates the Blockly layout.
 */
cwc.mode.phaser.blockly.Layout.prototype.decorate = function() {
  var layoutInstance = this.helper.getInstance('layout', true);
  layoutInstance.decorateSimpleTwoColumnLayout(this.layoutWidth);

  goog.soy.renderElement(
      layoutInstance.getNode('content-left'),
      cwc.soy.mode.Basic.blockly.Layout.editor, {
        prefix: this.prefix}
  );

  goog.soy.renderElement(
      layoutInstance.getNode('content-right'),
      cwc.soy.mode.Basic.blockly.Layout.preview, {
        prefix: this.prefix}
  );

};
