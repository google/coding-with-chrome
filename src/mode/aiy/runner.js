/**
 * @fileoverview AIY runner.
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
 * @author fstanis@google.com (Filip Stanis)
 */
goog.provide('cwc.mode.aiy.Runner');

goog.require('cwc.file.Files');
goog.require('cwc.protocol.aiy.Events');
goog.require('cwc.mode.aiy.Connection');
goog.require('cwc.renderer.Helper');
goog.require('cwc.ui.EditorContent');
goog.require('cwc.utils.Dialog');
goog.require('cwc.utils.Helper');
goog.require('cwc.utils.Events');

/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {!cwc.protocol.aiy.Api} connection
 * @struct
 * @final
 */
cwc.mode.aiy.Runner = function(helper, connection) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events('AIY', '', this);

  /** @private {!cwc.protocol.aiy.Api} */
  this.connection_ = connection;
};


/**
 * Initializes and defines the AIY runner.
 */
cwc.mode.aiy.Runner.prototype.init = function() {
  this.events_.listen(
    this.connection_.getEventHandler(),
    cwc.protocol.aiy.Events.Type.RECEIVED_DATA,
    this.receivedData.bind(this)
  );
};


/**
 * Handles the received data event from AIY.
 * @param {Event} event
 * @private
 */
cwc.mode.aiy.Runner.prototype.receivedData = function(event) {
  let consoleInstance = this.helper.getInstance('console');
  if (consoleInstance) {
    consoleInstance.writeOutput(event.data);
  }
};


/**
 * AIY run logic.
 * @export
 */
cwc.mode.aiy.Runner.prototype.run = function() {
  let editorInstance = this.helper.getInstance('editor');
  if (editorInstance) {
    let pythonCode = editorInstance.getEditorContent(
      cwc.ui.EditorContent.DEFAULT);
    this.connection_.connectAndSend(pythonCode);
  }
};
