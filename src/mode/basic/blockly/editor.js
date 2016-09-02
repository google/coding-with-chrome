/**
 * @fileoverview Editor for the Blockly modification.
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
goog.provide('cwc.mode.basic.blockly.Editor');

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
cwc.mode.basic.blockly.Editor = function(helper) {
  /** @type {!cwc.ui.Blockly} */
  this.blockly = new cwc.ui.Blockly(helper);

  /** @type {Element} */
  this.nodeBlockly = null;

  /** @type {Element} */
  this.nodeBlocklyToolbox = null;

  /** @type {Element} */
  this.nodeEditor = null;

  /** @type {!cwc.ui.Editor} */
  this.editor = new cwc.ui.Editor(helper);

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = helper.getPrefix();
};


/**
 * Decorates the Blockly editor.
 */
cwc.mode.basic.blockly.Editor.prototype.decorate = function() {

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

  // Blocks toolbox
  this.nodeBlocklyToolbox = goog.dom.getElement(this.prefix +
      'blockly-toolbox');
  if (!this.nodeBlocklyToolbox) {
    console.error('Was unable to find Blockly Toolbox:',
        this.nodeBlocklyToolbox);
    return;
  }

  // Blockly editor.
  this.helper.setInstance('blockly', this.blockly, true);
  this.blockly.decorate(this.nodeBlockly, this.nodeBlocklyToolbox,
      this.prefix, true);

  // Text editor.
  this.helper.setInstance('editor', this.editor, true);
  this.editor.decorate(this.nodeEditor, this.prefix);
  this.editor.showEditor(false);
  this.editor.showEditorViews(false);
  this.editor.showEditorTypeInfo(false);
  this.editor.enableMediaButton(true);

  // Additional buttons.
  this.blockly.addOption('Switch to Editor', this.showEditor.bind(this),
      'Switch to the raw code editor view.');
  this.editor.addOption('Switch to Blockly', this.showBlockly.bind(this),
      'Switch to the Blocky editor mode.');

  // Custom Events
  this.blockly.addChangeListener(this.editor.syncJavaScript.bind(this.editor));

  // Reset size
  this.blockly.adjustSize();
};


/**
 * Switches from the Blockly ui to the code editor.
 */
cwc.mode.basic.blockly.Editor.prototype.showEditor = function() {
  var fileInstance = this.helper.getInstance('file');
  this.editor.showEditor(true);
  this.blockly.showBlockly(false);
  fileInstance.setUi('javascript');
};


/**
 * Switches from the code editor to the Blockly ui.
 */
cwc.mode.basic.blockly.Editor.prototype.showBlockly = function() {
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
 * @param {Event=} opt_e
 */
cwc.mode.basic.blockly.Editor.prototype.switchToEditor = function(opt_e) {
  var fileInstance = this.helper.getInstance('file');
  this.editor.showEditor(false);
  this.blockly.showBlockly(true);
  fileInstance.setUi('blockly');
};
