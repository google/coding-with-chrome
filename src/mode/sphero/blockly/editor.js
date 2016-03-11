/**
 * @fileoverview Editor for the Sphero modification.
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
goog.provide('cwc.mode.sphero.blockly.Editor');

goog.require('cwc.blocks.sphero.Blocks');
goog.require('cwc.ui.Blockly');
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
cwc.mode.sphero.blockly.Editor = function(helper) {

  /** @type {!cwc.blocks.sphero.Blocks} */
  this.blocks = cwc.blocks.sphero.Blocks;

  /** @type {!cwc.ui.Blockly} */
  this.blockly = new cwc.ui.Blockly(helper);

  /** @type {!cwc.ui.Editor} */
  this.editor = new cwc.ui.Editor(helper);

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeBlockly = null;

  /** @type {Element} */
  this.nodeBlocklyToolbox = null;

  /** @type {Element} */
  this.nodeEditor = null;

  /** @type {string} */
  this.prefix = helper.getPrefix('sphero-editor');

  /** @type {string} */
  this.generalPrefix = helper.getPrefix();
};


/**
 * Decorates the simple editor.
 */
cwc.mode.sphero.blockly.Editor.prototype.decorate = function() {
  this.nodeBlockly = goog.dom.getElement(this.prefix + 'blockly-chrome');
  if (!this.nodeBlockly) {
    console.error('Was unable to find Blockly node:', this.nodeBlockly);
    return;
  }
  this.nodeBlocklyToolbox = goog.dom.getElement(this.prefix +
      'blockly-toolbox');
  if (!this.nodeBlocklyToolbox) {
    console.error('Was unable to find Blockly Toolbox:',
        this.nodeBlocklyToolbox);
    return;
  }
  this.nodeEditor = goog.dom.getElement(this.prefix + 'editor-chrome');
  if (!this.nodeEditor) {
    console.error('Was unable to find Editor node:', this.nodeEditor);
    return;
  }

  // Output editor.
  this.helper.setInstance('editor', this.editor, true);
  this.editor.decorate(this.nodeEditor, this.prefix);
  this.editor.showEditor(false);
  this.editor.showEditorViews(false);
  this.editor.showEditorTypeInfo(false);

  // Blockly editor.
  this.helper.setInstance('blockly', this.blockly, true);
  this.blockly.decorate(this.nodeBlockly, this.nodeBlocklyToolbox,
      this.prefix, true);

  // Custom Events
  var runText = 'Executes the code and send commands to the Sphero unit.';
  var blocklyRunButton = cwc.ui.Helper.getIconToolbarButton(
      'play_arrow', runText, this.runCode.bind(this));
  var editorRunButton = cwc.ui.Helper.getIconToolbarButton(
      'play_arrow', runText, this.runCode.bind(this));

  this.blockly.addToolbarButton(blocklyRunButton, true,
      'Click here to execute your code!');
  this.blockly.addOption('Switch to Editor', this.showEditor.bind(this),
      'Switch to the raw code editor view.');
  this.blockly.addChangeListener(this.changeHandler.bind(this));

  this.editor.addToolbarButton(editorRunButton, true);
  this.editor.addOption('Switch to Blockly', this.showBlockly.bind(this),
      'Switch to the Blocky editor mode.');
};


/**
 * Code change handler.
 */
cwc.mode.sphero.blockly.Editor.prototype.changeHandler = function() {
  var fileInstance = this.helper.getInstance('file');
  if (fileInstance.getUi() != 'custom') {
    var content = this.blockly.getJavaScript();
    this.editor.setEditorJavaScriptContent(content);
  }
};


/**
 * Runs / Executes the code.
 */
cwc.mode.sphero.blockly.Editor.prototype.runCode = function() {
  var runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.run();
  }
};


/**
 * Switches from the Blockly ui to the code editor.
 */
cwc.mode.sphero.blockly.Editor.prototype.showEditor = function() {
  var fileInstance = this.helper.getInstance('file');
  this.editor.showEditor(true);
  this.blockly.showBlockly(false);
  fileInstance.setUi('custom');
};


/**
 * Switches from the code editor to the Blockly ui.
 */
cwc.mode.sphero.blockly.Editor.prototype.showBlockly = function() {
  var fileInstance = this.helper.getInstance('file');
  var dialog = new goog.ui.Dialog();
  dialog.setTitle('Warning');
  dialog.setContent('Switching to Blockly mode will overwrite any manual ' +
      'changes!<br><b>Continue?</b>');
  dialog.setButtonSet(goog.ui.Dialog.ButtonSet.createYesNo());
  dialog.setDisposeOnHide(true);
  dialog.render();

  goog.events.listen(dialog, goog.ui.Dialog.EventType.SELECT, function(event) {
    if (event.key == 'yes') {
      this.editor.showEditor(false);
      this.blockly.showBlockly(true);
      fileInstance.setUi('blockly');
    }
  }, false, this);
  dialog.setVisible(true);
};
