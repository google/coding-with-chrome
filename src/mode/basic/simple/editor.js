/**
 * @fileoverview Editor for the Basic modification.
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
goog.provide('cwc.mode.basic.simple.Editor');

goog.require('cwc.ui.Editor');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.mode.basic.simple.Editor = function(helper) {
  /** @type {Element} */
  this.node = null;

  /** @type {cwc.ui.Editor} */
  this.editor = new cwc.ui.Editor(helper);

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = helper.getPrefix();
};


/**
 * Decorates the simple editor.
 */
cwc.mode.basic.simple.Editor.prototype.decorate = function() {
  this.node = goog.dom.getElement(this.prefix + 'editor-chrome');
  this.helper.setInstance('editor', this.editor, true);
  this.editor.decorate(this.node);
  this.editor.showEditorViews(false);
  this.editor.enableMediaButton(true);
};
