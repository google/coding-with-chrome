/**
 * @fileoverview Default Editor modifications.
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
goog.provide('cwc.mode.default.Mod');

goog.require('cwc.renderer.internal.HTML5');
goog.require('cwc.soy.mode.default.Layout');
goog.require('cwc.ui.Blockly');
goog.require('cwc.ui.Editor');
goog.require('cwc.ui.Message');
goog.require('cwc.ui.Preview');


/**
 * @typedef {cwc.mode.lego.ev3.Connection|
 *   cwc.mode.makeblock.mbot.Connection|
 *   cwc.mode.makeblock.mbotRanger.Connection|
 *   cwc.mode.sphero.classic.Connection|
 *   cwc.mode.sphero.bb8.Connection|
 *   cwc.mode.sphero.sprkPlus.Connection|
 *   cwc.mode.sphero.ollie.Connection}
 */
cwc.mode.default.ConnectionTypes;


/**
 * @typedef {cwc.renderer.external.EV3|
 *   cwc.renderer.external.Sphero|
 *   cwc.renderer.internal.Coffeescript|
 *   cwc.renderer.internal.HTML5|
 *   cwc.renderer.internal.Javascript|
 *   cwc.renderer.external.Python|
 *   cwc.renderer.external.PencilCode|
 *   cwc.renderer.external.makeblock.MBotRanger|
 *   cwc.renderer.external.makeblock.MBot}
 */
cwc.mode.default.RendererTypes;


/**
 * @typedef {cwc.mode.lego.ev3.Runner|
 *   cwc.mode.makeblock.mbot.Runner|
 *   cwc.mode.makeblock.mbotRanger.Runner|
 *   cwc.mode.sphero.Runner}
 */
cwc.mode.default.RunnerTypes;


/**
 * @typedef {cwc.mode.lego.ev3.Monitor|
 *   cwc.mode.sphero.Monitor|
 *   cwc.mode.makeblock.mbot.Monitor|
 *   cwc.mode.makeblock.mbotRanger.Monitor}
 */
cwc.mode.default.MonitorTypes;


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.default.Mod = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.ui.Editor} */
  this.editor = new cwc.ui.Editor(helper);

  /** @type {!cwc.ui.Message} */
  this.message = new cwc.ui.Message(this.helper);

  /** @type {!cwc.ui.Preview} */
  this.preview = new cwc.ui.Preview(this.helper);

  /** @type {cwc.ui.Blockly} */
  this.blockly = null;

  /** @type {!Function} */
  this.blocklyToolbox = null;

  /** @type {cwc.mode.default.ConnectionTypes} */
  this.connection = null;

  /** @type {cwc.mode.default.RendererTypes} */
  this.renderer = new cwc.renderer.internal.HTML5(this.helper);

  /** @type {cwc.mode.default.RunnerTypes} */
  this.runner = null;

  /** @type {cwc.mode.default.MonitorTypes} */
  this.monitor = null;
};


/**
 * Decorates standard Editor.
 */
cwc.mode.default.Mod.prototype.decorate = function() {
  // Decorates Layout
  this.decorateLayout();

  // Handle device connections.
  if (this.connection) {
    this.connection.init();
  }

  // Decorates Editor and Blockly Editor.
  if (this.blockly) {
    this.decorateBlockly();
  }
  this.decorateEditor();

  // Add Blockly events if needed.
  if (this.blockly) {
    // Switch buttons
    this.blockly.addOption('Switch to Editor', this.showEditor_.bind(this),
        'Switch to the raw code editor view');
    this.editor.addOption('Switch to Blockly', this.showBlockly_.bind(this),
        'Switch to the Blockly editor mode');

    // Custom Events
    this.blockly.addEditorChangeHandler(
      this.editor.handleSyncEvent.bind(this.editor));

    // Reset size
    this.blockly.adjustSize();
  }

  if (this.runner) {
    this.runner.decorate();
  } else {
    this.decoratePreview();
  }

  if (this.monitor) {
    this.monitor.decorate();
  }
  this.decorateMessage();

  if (this.renderer) {
    this.renderer.init();
  }
};


/**
 * Decorates standard Editor.
 */
cwc.mode.default.Mod.prototype.decorateRaw = function() {
  let layoutInstance = this.helper.getInstance('layout', true);
  layoutInstance.decorateBlank();
  layoutInstance.renderContent(cwc.soy.mode.default.Layout.editor);
  this.decorateEditor();
};


/**
 * Decorates Blockly
 */
cwc.mode.default.Mod.prototype.decorateBlockly = function() {
  this.helper.setInstance('blockly', this.blockly, true);
  this.blockly.decorate();
  this.blockly.setToolboxTemplate(this.blocklyToolbox);
};


/**
 * Decorates Editor
 */
cwc.mode.default.Mod.prototype.decorateEditor = function() {
  this.helper.setInstance('editor', this.editor, true);
  this.editor.decorate();
};


/**
 * Decorates the Preview / Editor layout.
 */
cwc.mode.default.Mod.prototype.decorateLayout = function() {
  let layoutInstance = this.helper.getInstance('layout', true);
  layoutInstance.decorateDefault();
  if (this.blockly) {
    layoutInstance.renderEditorContent(cwc.soy.mode.default.Layout.blockly);
  } else {
    layoutInstance.renderEditorContent(cwc.soy.mode.default.Layout.editor);
  }
  if (this.runner) {
    layoutInstance.renderPreviewContent(cwc.soy.mode.default.Layout.runner);
  } else {
    layoutInstance.renderPreviewContent(cwc.soy.mode.default.Layout.preview);
  }
};


/**
 * Decorates preview
 */
cwc.mode.default.Mod.prototype.decoratePreview = function() {
  this.helper.setInstance('preview', this.preview, true);
  this.preview.decorate();
};


/**
 * Decorates the message.
 */
cwc.mode.default.Mod.prototype.decorateMessage = function() {
  this.helper.setInstance('message', this.message, true);
  this.message.decorate();
};


/**
 * @param {!Function} toolbox
 */
cwc.mode.default.Mod.prototype.enableBlockly = function(toolbox) {
  this.blockly = new cwc.ui.Blockly(this.helper);
  this.blocklyToolbox = toolbox;
};


/**
 * @param {!cwc.mode.default.ConnectionTypes} connection
 */
cwc.mode.default.Mod.prototype.setConnection = function(connection) {
  this.connection = connection;
};


/**
 * @param {!cwc.mode.default.RendererTypes} renderer
 */
cwc.mode.default.Mod.prototype.setRenderer = function(renderer) {
  this.renderer = renderer;
};


/**
 * @param {!cwc.mode.default.RunnerTypes} runner
 */
cwc.mode.default.Mod.prototype.setRunner = function(runner) {
  this.runner = runner;
};


/**
 * @param {!cwc.mode.default.MonitorTypes} monitor
 */
cwc.mode.default.Mod.prototype.setMonitor = function(monitor) {
  this.monitor = monitor;
};


/**
 * Switches from the Blockly ui to the code editor.
 */
cwc.mode.default.Mod.prototype.showEditor_ = function() {
  this.editor.showEditor(true);
  this.blockly.showBlockly(false);
  this.helper.getInstance('file').setUi('editor');
};


/**
 * Switches from the code editor to the Blockly ui.
 */
cwc.mode.default.Mod.prototype.showBlockly_ = function() {
  let dialogInstance = this.helper.getInstance('dialog');
  dialogInstance.showActionCancel('Warning', 'Switching to Blockly mode ' +
    'will overwrite any manual changes! Continue?',
    i18t('@@GENERAL__CONTINUE')).then((answer) => {
      if (answer) {
        this.switchToEditor_();
      }
    });
};


/**
 * Switches from the Blockly ui to the code editor.
 */
cwc.mode.default.Mod.prototype.switchToEditor_ = function() {
  this.editor.showEditor(false);
  this.blockly.showBlockly(true);
  this.helper.getInstance('file').setUi('blockly');
};
