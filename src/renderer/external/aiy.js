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
goog.require('cwc.renderer.Helper');
goog.require('cwc.ui.EditorContent');
goog.require('cwc.utils.Dialog');
goog.require('cwc.utils.Helper');

/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.renderer.external.AIY = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @private {!Array} */
  this.frameworks_ = [
    cwc.framework.Internal.AIY,
  ];

  /** @private {?WebSocket} */
  this.socket_ = null;

  /** @private {cwc.utils.Dialog} */
  this.dialog_ = new cwc.utils.Dialog();
};

/**
 * Initializes and defines the AIY renderer.
 * @return {!Promise}
 */
cwc.renderer.external.AIY.prototype.init = function() {
  let rendererInstance = this.helper.getInstance('renderer', true);
  return rendererInstance.setRenderer(this.render.bind(this));
};

/**
 * Handles the received messages on the WebSocket.
 * @param {string} data
 * @private
 */
cwc.renderer.external.AIY.prototype.handleMessage_ = function(data) {
  let terminalInstance = this.helper.getInstance('terminal');
  if (terminalInstance) {
    terminalInstance.writeOutput(data);
  }
};

/**
 * Sends a message to the AIY WebSocket.
 * @param {string} message
 * @private
 */
cwc.renderer.external.AIY.prototype.sendMessage_ = function(message) {
  let blocker = Promise.resolve();
  if (!this.socket_) {
    blocker = this.dialog_.showPrompt(
      'Socket URL',
      'Please type in the URL of the Raspberry Pi',
      'ws://raspberrypi.local:8765'
    ).then((url) => {
      return this.openSocket_(url);
    }).catch((error) => {
      this.dialog_.showAlert('Error connecting to AIY', 'Error code: ' + error);
    });
  }
  blocker.then(() => this.socket_.send(message));
};

/**
 * Handles the received messages on the WebSocket.
 * @param {!string} url
 * @return {Promise}
 * @private
 */
cwc.renderer.external.AIY.prototype.openSocket_ = function(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    socket.addEventListener('open', () => {
      this.socket_ = socket;
      resolve();
    }, false);
    socket.addEventListener('close', (event) => {
      this.socket_ = null;
      if (event.code !== 1000) {
        reject(new Error(`WebSocket closed with code ${event.code}`));
      }
    }, false);
    socket.addEventListener('message', (event) => {
      this.handleMessage_(event.data);
    }, false);
  });
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
    this.sendMessage_(pythonCode);
    return '';
};
