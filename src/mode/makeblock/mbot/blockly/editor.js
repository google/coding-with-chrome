/**
 * @fileoverview layout for mBot instances.
 *
 * @license Copyright 2016 Shenzhen Maker Works Co, Ltd. All Rights Reserved.
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
 * @author wangyu@makeblock.cc (Yu Wang)
 */
goog.provide('cwc.mode.makeblock.mbot.blockly.Editor');

goog.require('cwc.soy.mode.makeblock.mbot.blockly.Blocks');
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
cwc.mode.makeblock.mbot.blockly.Editor = function(helper) {

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
  this.prefix = helper.getPrefix('mbot-editor');
};


/**
 * Decorates the simple editor.
 */
cwc.mode.makeblock.mbot.blockly.Editor.prototype.decorate = function() {
  this.nodeBlockly = goog.dom.getElement(this.prefix + 'blockly-chrome');
  if (!this.nodeBlockly) {
    console.error('Was unable to find Blockly node:', this.nodeBlockly);
    return;
  }

  this.nodeEditor = goog.dom.getElement(this.prefix + 'editor-chrome');
  if (!this.nodeEditor) {
    console.error('Was unable to find Editor node:', this.nodeEditor);
    return;
  }

  // Blockly toolbox
  this.nodeBlocklyToolbox = goog.dom.getElement(this.prefix +
      'blockly-toolbox');
  if (!this.nodeBlocklyToolbox) {
    console.error('Was unable to find Blockly Toolbox:',
        this.nodeBlocklyToolbox);
    return;
  }
  goog.soy.renderElement(this.nodeBlocklyToolbox,
    cwc.soy.mode.makeblock.mbot.blockly.Blocks.toolbox);

  // Blockly editor.
  this.helper.setInstance('blockly', this.blockly, true);
  this.blockly.setToolbox(this.nodeBlocklyToolbox);
  this.blockly.decorate(this.nodeBlockly);

  // Text editor.
  this.helper.setInstance('editor', this.editor, true);
  this.editor.decorate(this.nodeEditor);
  this.editor.showEditor(false);
  this.editor.showEditorViews(false);
  this.editor.showEditorTypeInfo(false);

  // Switch buttons.
  this.blockly.addOption('Switch to Editor', this.showEditor.bind(this),
      'Switch to the raw code editor view');
  this.editor.addOption('Switch to Blockly', this.showBlockly.bind(this),
      'Switch to the Blocky editor mode');

  // Custom Events
  this.blockly.addChangeListener(this.editor.syncJavaScript.bind(this.editor));

  // Reset size
  this.blockly.adjustSize();
};


/**
 * Runs / Executes the code.
 */
cwc.mode.makeblock.mbot.blockly.Editor.prototype.runCode = function() {
  var runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.run();
  }
};


/**
 * Switches from the Blockly ui to the code editor.
 */
cwc.mode.makeblock.mbot.blockly.Editor.prototype.showEditor = function() {
  var fileInstance = this.helper.getInstance('file');
  this.editor.showEditor(true);
  this.blockly.showBlockly(false);
  fileInstance.setUi('custom');
};


/**
 * Switches from the code editor to the Blockly ui.
 */
cwc.mode.makeblock.mbot.blockly.Editor.prototype.showBlockly = function() {
  var dialogInstance = this.helper.getInstance('dialog');
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
cwc.mode.makeblock.mbot.blockly.Editor.prototype.switchToEditor = function() {
  var fileInstance = this.helper.getInstance('file');
  this.editor.showEditor(false);
  this.blockly.showBlockly(true);
  fileInstance.setUi('blockly');
};
