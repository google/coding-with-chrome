/**
 * @fileoverview Layout for the HTML5 modification.
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
goog.provide('cwc.mode.html5.Layout');

goog.require('cwc.soy.mode.HTML5');
goog.require('cwc.utils.Helper');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.html5.Layout = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = helper.getPrefix();
};


/**
 * Decorates the HTML5 layout.
 */
cwc.mode.html5.Layout.prototype.decorate = function() {
  var layoutInstance = this.helper.getInstance('layout', true);

  console.log('Decorate HTML5 layout ...');
  layoutInstance.decorateSimpleTwoColumnLayout();
  var nodes = layoutInstance.getNodes();

  goog.soy.renderElement(
      nodes['content-left'],
      cwc.soy.mode.HTML5.editor,
      {'prefix': this.prefix}
  );

  goog.soy.renderElement(
      nodes['content-right'],
      cwc.soy.mode.HTML5.preview,
      {'prefix': this.prefix}
  );

};
