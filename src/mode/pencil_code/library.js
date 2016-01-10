/**
 * @fileoverview Library for the Pencil Code editor.
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
goog.provide('cwc.mode.pencilCode.Library');

goog.require('cwc.ui.Library');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.mode.pencilCode.Library = function(helper) {
  /** @type {Element} */
  this.node = null;

  /** @type {!cwc.ui.Library} */
  this.library = new cwc.ui.Library(helper);

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = helper.getPrefix();
};


/**
 * Decorates the simple editor.
 */
cwc.mode.pencilCode.Library.prototype.decorate = function() {
  this.node = goog.dom.getElement(this.prefix + 'library-chrome');
  this.helper.setInstance('library', this.library, true);
  this.library.decorate(this.node, this.prefix);
};
