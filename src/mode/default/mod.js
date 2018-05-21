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
goog.require('cwc.ui.Terminal');


/**
 * @typedef {cwc.protocol.lego.ev3.Api}
 */
cwc.mode.default.ApiTypes;


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
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.default.Mod = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {cwc.mode.default.ApiTypes} */
  this.api = null;

  /** @type {cwc.ui.Blockly} */
  this.blockly = null;

  /** @type {!Function} */
  this.blocklyToolbox = null;

  /** @type {cwc.mode.default.ConnectionTypes} */
  this.connection = null;

  /** @type {goog.events.EventTarget} */
  this.connectionEventHandler = null;

  /** @type {!cwc.ui.Editor} */
  this.editor = new cwc.ui.Editor(helper);

  /** @type {!cwc.ui.Message} */
  this.message = new cwc.ui.Message(this.helper);

  /** @type {Object} */
  this.messengerEvents = null;

  /** @type {!cwc.ui.Preview} */
  this.preview = new cwc.ui.Preview(this.helper);

  /** @type {cwc.mode.default.RendererTypes} */
  this.renderer = new cwc.renderer.internal.HTML5(this.helper);

  /** @type {cwc.ui.Terminal} */
  this.terminal = new cwc.ui.Terminal(this.helper);
};


/**
 * Decorates standard Editor.
 * @return {!Promise}
 */
cwc.mode.default.Mod.prototype.decorate = function() {
  return new Promise((resolve) => {
    this.decorateLayout();

    // Initialize Connection if available
    if (this.connection) {
      this.connection.init();
    }

    // Decorates Blockly or Editor.
    if (this.blockly) {
      this.decorateBlockly();
    } else {
      this.decorateTerminal();
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

    // Decorates Preview and Message instance
    this.decoratePreview();
    this.decorateMessage();

    // Decorates Renderer
    if (this.renderer) {
      this.renderer.init().then(() => {
        resolve();
      });
    } else {
      resolve();
    }
  });
};


/**
 * Decorates standard Editor.
 */
cwc.mode.default.Mod.prototype.decorateRaw = function() {
  let layoutInstance = this.helper.getInstance('layout');
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
  let layoutInstance = this.helper.getInstance('layout');
  layoutInstance.decorateDefault();

  // Decorates Blockly or Text Editor
  if (this.blockly) {
    layoutInstance.renderEditorContent(cwc.soy.mode.default.Layout.blockly);
  } else {
    layoutInstance.renderEditorContent(cwc.soy.mode.default.Layout.editor);
  }

  // Decorates Preview
  layoutInstance.renderPreviewContent(cwc.soy.mode.default.Layout.preview);
};


/**
 * Decorates preview with messenger.
 */
cwc.mode.default.Mod.prototype.decoratePreview = function() {
  this.helper.setInstance('preview', this.preview, true);
  this.preview.enableMessenger();
  this.preview.decorate();

  // Added api events.
  if (this.api) {
    this.preview.getMessenger().addApiListener(this.api);
  }

  // Added messenger events.
  if (this.messengerEvents && this.connectionEventHandler) {
    for (let event in this.messengerEvents) {
      if (this.messengerEvents.hasOwnProperty(event)) {
        let eventName = this.messengerEvents[event];
        this.preview.getMessenger().addEventListener(
          this.connectionEventHandler, eventName, '__EVENT__' + eventName);
      }
    }
  }
};


/**
 * @param {Function=} decorator
 */
cwc.mode.default.Mod.prototype.decorateControl = function(decorator) {
  this.message.decorateControl(decorator);
};


/**
 * @param {Function=} decorator
 */
cwc.mode.default.Mod.prototype.decorateMonitor = function(decorator) {
  this.message.decorateMonitor(decorator);
};


/**
 * Decorates the message.
 */
cwc.mode.default.Mod.prototype.decorateMessage = function() {
  this.helper.setInstance('message', this.message, true);
  this.message.decorate();
};


/**
 * Decorates terminal
 */
cwc.mode.default.Mod.prototype.decorateTerminal = function() {
  this.helper.setInstance('terminal', this.terminal, true);
  this.terminal.decorate();
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
  this.connectionEventHandler = connection.getEventHandler();
  this.api = connection.getApi();
};


/**
 * @param {!Object} events
 */
cwc.mode.default.Mod.prototype.setMessengerEvents = function(events) {
  this.messengerEvents = events;
};


/**
 * @param {!cwc.mode.default.RendererTypes} renderer
 */
cwc.mode.default.Mod.prototype.setRenderer = function(renderer) {
  this.renderer = renderer;
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
        this.switchToBlockly_();
      }
    });
};


/**
 * Switches from the code editor to the Blockly ui.
 */
cwc.mode.default.Mod.prototype.switchToBlockly_ = function() {
  this.editor.showEditor(false);
  this.blockly.showBlockly(true);
  this.helper.getInstance('file').setUi('blockly');
};
