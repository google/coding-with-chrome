/**
 * @fileoverview Editor for the Arduino modification.
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
goog.provide('cwc.mode.arduino.Editor');

goog.require('cwc.ui.Editor');
goog.require('cwc.ui.Helper');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.mode.arduino.Editor = function(helper) {
  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeEditor = null;

  /** @type {cwc.ui.Editor} */
  this.editor = new cwc.ui.Editor(helper);

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = helper.getPrefix('arduino-editor');
};


/**
 * Decorates the simple editor.
 */
cwc.mode.arduino.Editor.prototype.decorate = function() {
  this.node = goog.dom.getElement(this.prefix + 'editor-chrome');
  this.helper.setInstance('editor', this.editor, true);
  this.editor.decorate(this.node, this.prefix);
  this.editor.showEditorViews(false);
  this.editor.showEditorTypeInfo(false);
  this.editor.enableMediaButton(false);
};


/**
 * Runs / Executes the code.
 */
cwc.mode.arduino.Editor.prototype.runCode = function() {
  var runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.run();
  }
};
