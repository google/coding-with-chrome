/**
 * @fileoverview General Blockly Editor.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
goog.provide('cwc.mode.default.blockly.Editor');

goog.require('cwc.ui.Blockly');
goog.require('cwc.ui.Editor');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Helper');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.mode.default.blockly.Editor = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.ui.Blockly} */
  this.blockly = new cwc.ui.Blockly(helper);

  /** @type {!cwc.ui.Editor} */
  this.editor = new cwc.ui.Editor(helper);
};


/**
 * Decorates the Blockly editor.
 * @param {!Function} toolbox
 */
cwc.mode.default.blockly.Editor.prototype.decorate = function(toolbox) {
  // Blockly editor
  this.helper.setInstance('blockly', this.blockly, true);
  this.blockly.decorate();
  this.blockly.setToolboxTemplate(toolbox);

  // Text editor
  this.helper.setInstance('editor', this.editor, true);
  this.editor.decorate();
  this.editor.showEditor(false);
  this.editor.showEditorViews(false);
  this.editor.showMode(false);

  // Switch buttons
  this.blockly.addOption('Switch to Editor', this.showEditor.bind(this),
      'Switch to the raw code editor view');
  this.editor.addOption('Switch to Blockly', this.showBlockly.bind(this),
      'Switch to the Blocky editor mode');

  // Custom Events
  this.blockly.addEditorChangeHandler(
    this.editor.handleSyncEvent.bind(this.editor));

  // Reset size
  this.blockly.adjustSize();
};


/**
 * Switches from the Blockly ui to the code editor.
 */
cwc.mode.default.blockly.Editor.prototype.showEditor = function() {
  let fileInstance = this.helper.getInstance('file');
  this.editor.showEditor(true);
  this.blockly.showBlockly(false);
  fileInstance.setUi('javascript');
};


/**
 * Switches from the code editor to the Blockly ui.
 */
cwc.mode.default.blockly.Editor.prototype.showBlockly = function() {
  let dialogInstance = this.helper.getInstance('dialog');
  dialogInstance.showYesNo('Warning', 'Switching to Blockly mode will ' +
    'overwrite any manual changes! Continue?').then((answer) => {
      if (answer) {
        this.switchToEditor();
      }
    });
};


/**
 * Switches from the code editor to the Blockly ui.
 */
cwc.mode.default.blockly.Editor.prototype.switchToEditor = function() {
  let fileInstance = this.helper.getInstance('file');
  this.editor.showEditor(false);
  this.blockly.showBlockly(true);
  fileInstance.setUi('blockly');
};


/**
 * Shows/Hide the media button.
 * @param {boolean} visible
 */
cwc.mode.default.blockly.Editor.prototype.showMediaButton = function(visible) {
  this.blockly.showMediaButton(visible);
  this.editor.showMediaButton(visible);
};


/**
 * Shows/Hide the library button.
 * @param {boolean} visible
 */
cwc.mode.default.blockly.Editor.prototype.showLibraryButton = function(
    visible) {
  this.blockly.showLibraryButton(visible);
  this.editor.showLibraryButton(visible);
};


/**
 * @param {boolean} enable
 */
cwc.mode.default.blockly.Editor.prototype.enableToolboxAutoCollapse = function(
    enable) {
  this.blockly.enableToolboxAutoCollapse(enable);
};


/**
 * @param {boolean} enable
 */
cwc.mode.default.blockly.Editor.prototype.disableOrphansBlocks = function(
    enable) {
  this.blockly.disableOrphansBlocks(enable);
};
