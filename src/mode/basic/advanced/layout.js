/**
 * @fileoverview Layout for the Basic advanced modification.
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
goog.provide('cwc.mode.basic.advanced.Layout');

goog.require('cwc.soy.mode.Basic.advanced');
goog.require('cwc.utils.Helper');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.basic.advanced.Layout = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = helper.getPrefix();
};


/**
 * Decorates the basic advanced layout.
 */
cwc.mode.basic.advanced.Layout.prototype.decorate = function() {
  var layoutInstance = this.helper.getInstance('layout', true);
  layoutInstance.decorateSimpleTwoColumnLayout(630);
  var nodes = layoutInstance.getNodes();

  console.log('Adding Content');
  goog.soy.renderElement(
      nodes['content-left'],
      cwc.soy.mode.Basic.advanced.editor,
      {'prefix': this.prefix}
  );

  goog.soy.renderElement(
      nodes['content-right'],
      cwc.soy.mode.Basic.advanced.preview,
      {'prefix': this.prefix}
  );

};
