/**
 * @fileoverview Layout for the Blockly modification.
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
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
goog.provide('cwc.mode.basic.blockly.Layout');

goog.require('cwc.soy.mode.Basic.blockly');
goog.require('cwc.utils.Helper');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.basic.blockly.Layout = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = helper.getPrefix();

  /** @type {!number} */
  this.layoutWidth = 500;
};


/**
 * Decorates the Blockly layout.
 */
cwc.mode.basic.blockly.Layout.prototype.decorate = function() {
  var layoutInstance = this.helper.getInstance('layout', true);
  layoutInstance.decorateSimpleTwoColumnLayout(this.layoutWidth);
  var nodes = layoutInstance.getNodes();

  console.log('Decorate editor …');
  goog.soy.renderElement(
      nodes['content-left'],
      cwc.soy.mode.Basic.blockly.editor,
      {'prefix': this.prefix}
  );

  console.log('Decorate preview …');
  goog.soy.renderElement(
      nodes['content-right'],
      cwc.soy.mode.Basic.blockly.preview,
      {'prefix': this.prefix}
  );

};
