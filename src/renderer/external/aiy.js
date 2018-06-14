/**
 * @fileoverview AIY renderer.
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
goog.provide('cwc.renderer.external.AIY');

goog.require('cwc.file.Files');
goog.require('cwc.framework.Internal');
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
cwc.renderer.external.AIY = function(helper, connection) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @private {!Array} */
  this.frameworks_ = [
    cwc.framework.Internal.AIY,
  ];

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events('AIY', '', this);

  /** @private {!cwc.protocol.aiy.Api} */
  this.connection_ = connection;
};

/**
 * Initializes and defines the AIY renderer.
 * @return {!Promise}
 */
cwc.renderer.external.AIY.prototype.init = function() {
  let rendererInstance = this.helper.getInstance('renderer', true);
  this.events_.listen(
    this.connection_.getEventHandler(),
    cwc.protocol.aiy.Events.Type.RECEIVED_DATA,
    this.receivedData.bind(this)
  );
  return rendererInstance.setRenderer(this.render.bind(this));
};

/**
 * Handles the received data event from AIY.
 * @param {Event} event
 * @private
 */
cwc.renderer.external.AIY.prototype.receivedData = function(event) {
  let terminalInstance = this.helper.getInstance('terminal');
  if (terminalInstance) {
    terminalInstance.writeOutput(event.data);
  }
};


/**
 * AIY render logic.
 * @param {Object} editorContent
 * @param {cwc.file.Files} libraryFiles
 * @param {cwc.renderer.Helper} rendererHelper
 * @return {string}
 * @export
 */
cwc.renderer.external.AIY.prototype.render = function(editorContent) {
  let pythonCode = editorContent[cwc.ui.EditorContent.DEFAULT];
  this.connection_.connectAndSend(pythonCode);
  return '';
};
