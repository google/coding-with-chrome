/**
 * @fileoverview AIY modifications.
 *
 * @license Copyright 2018 Google Inc. All Rights Reserved.
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
 * @author fstanis@google.com (Filip Stanis)
 */
goog.provide('cwc.mode.aiy.Mod');

goog.require('cwc.mode.aiy.Connection');
goog.require('cwc.mode.aiy.Toolbar');
goog.require('cwc.mode.aiy.Editor');
goog.require('cwc.mode.aiy.Layout');
goog.require('cwc.mode.default.Mod');
goog.require('cwc.ui.Terminal');
goog.require('cwc.utils.Helper');
goog.require('cwc.protocol.aiy.Events');
goog.require('cwc.ui.EditorContent');
goog.require('cwc.utils.Dialog');
goog.require('cwc.utils.Events');

/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.aiy.Mod = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.mode.aiy.Layout} */
  this.layout = new cwc.mode.aiy.Layout(helper);

  /** @type {!cwc.mode.aiy.Editor} */
  this.editor = new cwc.mode.aiy.Editor(helper);

  /** @type {!cwc.ui.Terminal} */
  this.terminal = new cwc.ui.Terminal(helper);

  /** @type {!cwc.mode.aiy.Connection} */
  this.connection = new cwc.mode.aiy.Connection(helper);

  /** @type {!cwc.mode.aiy.Toolbar} */
  this.toolbar = new cwc.mode.aiy.Toolbar(helper);

  /** @type {!cwc.utils.Events} */
  this.events = new cwc.utils.Events('AIY', '', this);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.aiy.Mod.prototype.decorate = function() {
  this.layout.decorate();
  this.editor.decorate();
  this.decorateTerminal();
  this.connection.init();
  this.initEvents();

  this.toolbar.on('run', this.run.bind(this));
};


cwc.mode.aiy.Mod.prototype.initEvents = function() {
  const eventHandler = this.connection.getEventHandler();
  this.events.listen(
    eventHandler,
    cwc.protocol.aiy.Events.Type.RECEIVED_DATA_STDERR,
    this.receivedData.bind(this)
  );
  this.events.listen(
    eventHandler,
    cwc.protocol.aiy.Events.Type.RECEIVED_DATA_STDOUT,
    this.receivedData.bind(this)
  );
  this.events.listen(
    eventHandler,
    cwc.protocol.aiy.Events.Type.EXIT,
    this.receivedExit.bind(this)
  );
};


/**
 * Decorates console
 */
cwc.mode.aiy.Mod.prototype.decorateTerminal = async function() {
  this.helper.setInstance('terminal', this.terminal, true);
  await this.terminal.decorate();
};


/**
 * Run code
 */
cwc.mode.aiy.Mod.prototype.run = function() {
  const editorInstance = this.editor.editor;
  let pythonCode = editorInstance.getEditorContent(
    cwc.ui.EditorContent.DEFAULT);
  this.connection.connectAndSendCode(pythonCode);
}


/**
 * Handles the received data event from AIY.
 * @param {Event} event
 * @private
 */
cwc.mode.aiy.Mod.prototype.receivedData = function(event) {
  this.terminal.write(event.data);
};

/**
 * Handles the process exit event.
 * @param {Event} event
 * @private
 */
cwc.mode.aiy.Mod.prototype.receivedExit = function(event) {
  this.terminal.writeln('<process terminated>');
  this.connection.reconnect();
};
