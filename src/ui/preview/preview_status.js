/**
 * @fileoverview Preview Status for the Coding with Chrome editor.
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
goog.provide('cwc.ui.PreviewStatus');

goog.require('cwc.ui.PreviewEvents');
goog.require('cwc.utils.Events');

goog.require('goog.events.EventTarget');


/**
 * @param {!cwc.utils.Helper} helper
 * @param {goog.events.EventTarget=} eventHandler
 * @constructor
 * @struct
 * @final
 */
cwc.ui.PreviewStatus = function(helper, eventHandler) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.name = 'Preview Status Handler';

  /** @type {cwc.ui.PreviewState<number>} */
  this.status = cwc.ui.PreviewState.INITIALIZED;

  /** @type {number} */
  this.startTime = 0;

  /** @type {number} */
  this.stopTime = 0;

  /** @type {cwc.ui.Statusbar} */
  this.statusbar = null;

  /** @type {cwc.ui.PreviewStatusButton} */
  this.statusButton = null;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, '', this);

  /** @private {!goog.events.EventTarget} */
  this.eventHandler_ = eventHandler || new goog.events.EventTarget();
};


/**
 * @param {Element=} content
 */
cwc.ui.PreviewStatus.prototype.addEventHandler = function(content) {
  if (!content) {
    return;
  }
  this.events_.clear();
  this.events_.listen(content, 'contentload', this.handleContentLoad_);
  this.events_.listen(content, 'loadstart', this.handleLoadStart_);
  this.events_.listen(content, 'loadstop', this.handleLoadStop_);
  this.events_.listen(content, 'unresponsive', this.handleUnresponsive_);
  content.addEventListener('consolemessage',
    this.handleConsoleMessage_.bind(this));
};


/**
 * @param {!cwc.ui.PreviewState} status
 */
cwc.ui.PreviewStatus.prototype.setStatus = function(status) {
  if (this.status === status) {
    return;
  }
  if (this.statusbar) {
    this.statusbar.setStatus(status, this.startTime, this.stopTime);
  }
  if (this.statusButton) {
    this.statusButton.setStatus(status);
  }
  this.eventHandler_.dispatchEvent(cwc.ui.PreviewEvents.statusChange(status));
  this.status = status;
};


/**
 * @param {cwc.ui.PreviewState=} status
 * @return {!cwc.ui.PreviewState|boolean}
 */
cwc.ui.PreviewStatus.prototype.getStatus = function(status) {
  if (!status) {
    return this.status;
  }
  return this.status === status;
};


/**
 * @param {!cwc.ui.Statusbar} statusbar
 * @return {THIS}
 * @template THIS
 */
cwc.ui.PreviewStatus.prototype.setStatusbar = function(statusbar) {
  this.statusbar = statusbar;
  return this;
};


/**
 * @param {!cwc.ui.PreviewStatusButton} statusButton
 * @return {THIS}
 * @template THIS
 */
cwc.ui.PreviewStatus.prototype.setStatusButton = function(statusButton) {
  this.statusButton = statusButton;
  return this;
};


/**
 * Dispatches a CONTENT_LOAD event. Because we destroy and recreate the
 * webview each time content changes, the user can't add an event listener
 * to that directly.
 * @private
 */
cwc.ui.PreviewStatus.prototype.handleContentLoad_ = function() {
  this.eventHandler_.dispatchEvent(
    cwc.ui.PreviewEvents.contentLoad(this.content));
};


/**
 * Collects all messages from the preview window for the console.
 * @param {Event} event
 * @private
 */
cwc.ui.PreviewStatus.prototype.handleConsoleMessage_ = function(event) {
  let terminalInstance = this.helper.getInstance('terminal');
  if (terminalInstance) {
    terminalInstance.writeConsoleMessage(event);
  }
};


/**
 * Displays the start of load event.
 * @param {Event} e
 * @private
 */
cwc.ui.PreviewStatus.prototype.handleLoadStart_ = function(e) {
  if (e && e['target'] && e['target']['src'] === 'about:blank') {
    return;
  }
  this.startTime = new Date().getTime();
  this.setStatus(cwc.ui.PreviewState.LOADING);
};


/**
 * Displays the end of the load event.
 * @param {Event} e
 * @private
 */
cwc.ui.PreviewStatus.prototype.handleLoadStop_ = function(e) {
  if (e && e['target'] && e['target']['src'] === 'about:blank') {
    return;
  }
  this.stopTime = new Date().getTime();
  this.setStatus(cwc.ui.PreviewState.LOADED);
};


/**
 * Shows a unresponsive warning with the options to terminate the preview.
 * @private
 */
cwc.ui.PreviewStatus.prototype.handleUnresponsive_ = function() {
  this.setStatus(cwc.ui.PreviewState.UNRESPONSIVE);
  let dialogInstance = this.helper.getInstance('dialog');
  dialogInstance.showActionCancel('Unresponsive Warning',
    'The preview is unresponsive! Terminate?', 'Terminate').then((answer) => {
      if (answer) {
        this.terminate();
      }
    });
};
