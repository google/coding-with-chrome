/**
 * @fileoverview Statusbar for the runner.
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
goog.provide('cwc.ui.RunnerStatusbar');

goog.require('cwc.soy.RunnerStatusbar');
goog.require('cwc.ui.RunnerStatus');
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
cwc.ui.RunnerStatusbar = function(helper) {
  /** @type {string} */
  this.name = 'RunnerStatusbar';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('runner-statusbar');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeStatus = null;
};


/**
 * Decorates the given node and adds the editor status to the ui.
 * @param {Element} node The target node to add the status bar.
 */
cwc.ui.RunnerStatusbar.prototype.decorate = function(node) {
  this.node = node;

  goog.soy.renderElement(
      this.node,
      cwc.soy.RunnerStatusbar.template,
      {'prefix': this.prefix}
  );

  this.nodeStatus = goog.dom.getElement(this.prefix + 'statusbar');
};


/**
 * Sets the status message.
 * @param {!cwc.ui.RunnerStatus} status
 * @param {number=} startTime
 * @param {number=} stopTime
 */
cwc.ui.RunnerStatusbar.prototype.setStatus = function(status, startTime = 0,
    stopTime = 0) {
  let statusText = status;
  switch (status) {
    case cwc.ui.RunnerStatus.PREPARE:
      statusText = 'Preparing ...';
      break;
    case cwc.ui.RunnerStatus.STOPPED:
      statusText = 'Stopped';
      break;
    case cwc.ui.RunnerStatus.RELOADING:
      statusText = 'Reloading ...';
      break;
    case cwc.ui.RunnerStatus.LOADING:
      statusText = 'Loading...';
      break;
    case cwc.ui.RunnerStatus.LOADED:
      statusText = 'Finished after ' +
        ((stopTime - startTime) / 1000) + ' seconds.';
      break;
    case cwc.ui.RunnerStatus.TERMINATED:
      statusText = 'Terminated';
      break;
    case cwc.ui.RunnerStatus.UNRESPONSIVE:
      statusText = 'Unresponsive';
      break;
  }
  if (this.nodeStatus) {
    this.show();
    goog.dom.setTextContent(this.nodeStatus, statusText);
    goog.Timer.callOnce(this.hide.bind(this), 500);
  } else {
    console.log(statusText);
  }
};


/**
 * Shows status bar.
 */
cwc.ui.RunnerStatusbar.prototype.hide = function() {
  goog.Timer.callOnce(function() {
    goog.style.setElementShown(this.node, false);
  }.bind(this), 1000);
};


/**
 * Hides status bar.
 */
cwc.ui.RunnerStatusbar.prototype.show = function() {
  goog.style.setElementShown(this.node, true);
};
