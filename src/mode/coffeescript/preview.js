/**
 * @fileoverview Preview for the Coffeescript editor.
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
 * @author mbordihn@google.com (Markus Bordihn)
 */

goog.provide('cwc.mode.coffeescript.Preview');

goog.require('cwc.ui.Preview');
goog.require('cwc.utils.Helper');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.mode.coffeescript.Preview = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.ui.Preview} */
  this.preview = new cwc.ui.Preview(helper);
};


/**
 * Decorates the preview window.
 */
cwc.mode.coffeescript.Preview.prototype.decorate = function() {
  this.helper.setInstance('preview', this.preview, true);
  this.preview.decorate();
  this.preview.showConsole(true);
};
