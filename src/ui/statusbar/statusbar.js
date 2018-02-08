/**
 * @fileoverview Statusbar.
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
goog.provide('cwc.ui.Statusbar');

goog.require('cwc.soy.ui.Statusbar');
goog.require('cwc.ui.StatusbarState');
goog.require('cwc.utils.Logger');

goog.require('goog.dom');
goog.require('goog.soy');
goog.require('goog.style');


/**
 * Class represents the statusbar inside the ui.
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Statusbar = function(helper) {
  /** @type {string} */
  this.name = 'Statusbar';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('statusbar');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeStatus = null;

  /** @private {!cwc.utils.Logger|null} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Decorates the given node and adds the editor status to the ui.
 * @param {Element=} node The target node to add the status bar.
 */
cwc.ui.Statusbar.prototype.decorate = function(node) {
  this.node = node || goog.dom.getElement(this.prefix + 'chrome');
  if (!this.node) {
    this.log_.error('Invalid Status node:', this.node);
    return;
  }

  goog.soy.renderElement(
      this.node,
      cwc.soy.ui.Statusbar.template, {
        'prefix': this.prefix,
      }
  );

  this.nodeStatus = goog.dom.getElement(this.prefix + 'status');
  if (!this.nodeStatus) {
    this.log_.error('Invalid Status text node:', this.nodeStatus);
    return;
  }
};


/**
 * Sets the status message.
 * @param {!cwc.ui.StatusbarState} status
 * @param {number=} startTime
 * @param {number=} stopTime
 */
cwc.ui.Statusbar.prototype.setStatus = function(status, startTime = 0,
    stopTime = 0) {
  let statusText = cwc.ui.Statusbar.translateState(status, startTime, stopTime);
  if (this.nodeStatus) {
    this.show();
    goog.dom.setTextContent(this.nodeStatus, statusText);
    goog.Timer.callOnce(this.hide.bind(this), 1500);
  }
  this.log_.info(statusText);
};


/**
 * Shows status bar.
 */
cwc.ui.Statusbar.prototype.hide = function() {
  goog.Timer.callOnce(function() {
    goog.style.setElementShown(this.node, false);
  }.bind(this), 1000);
};


/**
 * Hides status bar.
 */
cwc.ui.Statusbar.prototype.show = function() {
  goog.style.setElementShown(this.node, true);
};


/*
 * @param {!cwc.ui.StatusbarState} status
 * @param {number=} startTime
 * @param {number=} stopTime
 * @return {string}
 */
cwc.ui.Statusbar.translateState = function(status, startTime = 0,
    stopTime = 0) {
  switch (status) {
    case cwc.ui.StatusbarState.PREPARE:
      return 'Preparing ...';
    case cwc.ui.StatusbarState.STOPPED:
      return 'Stopped';
    case cwc.ui.StatusbarState.RELOADING:
      return 'Reloading ...';
    case cwc.ui.StatusbarState.RUNNING:
      return 'Running ...';
    case cwc.ui.StatusbarState.LOADING:
      return 'Loading ...';
    case cwc.ui.StatusbarState.LOADED:
      return 'Finished after ' + ((stopTime - startTime) / 1000) + ' seconds.';
    case cwc.ui.StatusbarState.TERMINATED:
      return 'Terminated';
    case cwc.ui.StatusbarState.UNRESPONSIVE:
      return 'Unresponsive';
  }
  return status || '';
};
