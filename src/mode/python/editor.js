/**
 * @fileoverview Editor for the Python modification.
 *
 * @license Copyright 2016 Google Inc. All Rights Reserved.
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
goog.provide('cwc.mode.python.Editor');

goog.require('cwc.ui.Editor');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.mode.python.Editor = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {cwc.ui.Editor} */
  this.editor = new cwc.ui.Editor(helper);
};


/**
 * Decorates the text Editor.
 */
cwc.mode.python.Editor.prototype.decorate = function() {
  this.helper.setInstance('editor', this.editor, true);
  this.editor.decorate();
  this.editor.showLibraryButton(false);
  this.editor.showEditorViews(false);
};
