/**
 * @fileoverview Connection for the AIY modification.
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
goog.provide('cwc.mode.aiy.Connection');

goog.require('cwc.utils.Events');
goog.require('cwc.protocol.aiy.Api');
goog.require('cwc.utils.Dialog');

/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.aiy.Connection = function(helper) {
  /** @type {string} */
  this.name = 'AIY Connection';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

  /** @private {!cwc.protocol.aiy.Api} */
  this.api_ = helper.getInstance('aiy', true);

  /** @private {cwc.utils.Dialog} */
  this.dialog_ = new cwc.utils.Dialog();
}


/**
 * Connects the AIY device.
 * @export
 */
cwc.mode.aiy.Connection.prototype.init = function() {
  this.connectInteractive();
};


/**
 * Connects to the AIY if not connected and sends a message.
 * @param {!string} data
 * @return {!Promise}
 * @export
 */
cwc.mode.aiy.Connection.prototype.connectAndSend = function(data) {
  let blocker = Promise.resolve();
  if (!this.api_.isConnected()) {
    blocker = this.connectInteractive();
  }
  return blocker.then(() => this.api_.send(data));
};


/**
 * The default WebSocket URL.
 * @const
 */
cwc.mode.aiy.Connection.DEFAULT_URL = 'ws://raspberrypi.local:8765';


/**
 * Prompts the user for the URL and then tries to connect to it.
 * @return {Promise}
 * @private
 */
cwc.mode.aiy.Connection.prototype.connectInteractive = function() {
  return this.dialog_.showPrompt(
    'Socket URL',
    'Please type in the URL of the Raspberry Pi',
    cwc.mode.aiy.Connection.DEFAULT_URL
  ).then((url) => {
    return this.api_.connect(url);
  }).catch((error) => {
    this.dialog_.showAlert('Error connecting to AIY', 'Error code: ' + error);
  });
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.mode.aiy.Connection.prototype.getEventHandler = function() {
  return this.api_.getEventHandler();
};
