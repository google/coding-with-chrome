/**
 * @fileoverview Layout for the Javascript modification.
 *
 * @license Copyright 2015 The Coding with Chrome Authors.
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
 * @author carheden@google.com (Adam Carheden)
 */
goog.provide('cwc.mode.javascript.Layout');

goog.require('cwc.soy.mode.Javascript');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.javascript.Layout = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = helper.getPrefix();
};


/**
 * Decorates the text layout.
 */
cwc.mode.javascript.Layout.prototype.decorate = function() {
  let layoutInstance = this.helper.getInstance('layout', true);
  layoutInstance.decorateDefault(500);
  layoutInstance.renderMiddleContent(cwc.soy.mode.Javascript.editor);
  layoutInstance.renderRightContent(cwc.soy.mode.Javascript.preview);
};
