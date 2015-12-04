/**
 * @fileoverview Editor for the EV3 modification.
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
goog.provide('cwc.mode.ev3.advanced.Editor');

goog.require('cwc.ui.Editor');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Helper');

goog.require('goog.ui.Dialog');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.mode.ev3.advanced.Editor = function(helper) {
  /** @type {!cwc.ui.Editor} */
  this.editor = new cwc.ui.Editor(helper);

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeEditor = null;

  /** @type {string} */
  this.prefix = helper.getPrefix('ev3-editor');

  /** @type {string} */
  this.generalPrefix = helper.getPrefix();
};


/**
 * Decorates the simple editor.
 */
cwc.mode.ev3.advanced.Editor.prototype.decorate = function() {
  this.nodeEditor = goog.dom.getElement(this.prefix + 'editor-chrome');
  if (!this.nodeEditor) {
    console.error('Was unable to find Editor node:', this.nodeEditor);
    return;
  }

  // Output editor.
  this.helper.setInstance('editor', this.editor, true);
  this.editor.decorate(this.nodeEditor, this.prefix);
  this.editor.showEditorViews(false);
  this.editor.showEditorTypeInfo(false);

  // Custom Events
  var runText = 'Executes the code and send commands to the EV3 unit.';
  var editorRunButton = cwc.ui.Helper.getIconToolbarButton(
      'play_arrow', runText, this.runCode.bind(this));
  this.editor.addToolbarButton(editorRunButton, true);
};


/**
 * Runs / Executes the code.
 */
cwc.mode.ev3.advanced.Editor.prototype.runCode = function() {
  var runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.run();
  }
};
