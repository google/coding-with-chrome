/**
 * @fileoverview Status button.
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
goog.provide('cwc.ui.StatusButton');

goog.require('cwc.soy.ui.StatusButton');
goog.require('cwc.ui.StatusbarState');
goog.require('cwc.utils.Logger');


/**
 * Class represents the statusbar inside the ui.
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.StatusButton = function(helper) {
  /** @type {string} */
  this.name = 'Status Button';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('status-button');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeStatus = null;

  /** @type {Element} */
  this.nodeRun = null;

  /** @type {Element} */
  this.nodeStop = null;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix);

  /** @private {!cwc.utils.Logger|null} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Decorates the given node and adds the status button to the ui.
 * @param {Element=} node The target node to add the status bar.
 */
cwc.ui.StatusButton.prototype.decorate = function(node) {
  this.node = node;
  if (!this.node) {
    this.log_.error('Invalid Status node:', this.node);
    return;
  }

  goog.soy.renderElement(
      this.node,
      cwc.soy.ui.StatusButton.template, {
        'prefix': this.prefix,
      }
  );

  this.nodeRun = goog.dom.getElement(this.prefix + 'run');
  this.nodeStop = goog.dom.getElement(this.prefix + 'stop');

  goog.style.setElementShown(this.nodeRun, true);
  goog.style.setElementShown(this.nodeStop, false);
};


/**
 * @param {function} func
 */
cwc.ui.StatusButton.prototype.setStopAction = function(func) {
  this.events_.listen('stop-button', goog.events.EventType.CLICK, func);
};


/**
 * @param {function} func
 */
cwc.ui.StatusButton.prototype.setRunAction = function(func) {
  this.events_.listen('run-button', goog.events.EventType.CLICK, func);
};


/**
 * Sets the status message.
 * @param {!cwc.ui.StatusbarState} status
 */
cwc.ui.StatusButton.prototype.setStatus = function(status) {
  // Load Status
  switch (status) {
    case cwc.ui.StatusbarState.LOADED:
    case cwc.ui.StatusbarState.STOPPED:
    case cwc.ui.StatusbarState.TERMINATED:
      goog.style.setElementShown(this.nodeRun, true);
      goog.style.setElementShown(this.nodeStop, false);
      break;
    case cwc.ui.StatusbarState.LOADING:
    case cwc.ui.StatusbarState.PREPARE:
      break;
  }

  // Run Status
  switch (status) {
    case cwc.ui.StatusbarState.STOPPED:
    case cwc.ui.StatusbarState.TERMINATED:
      break;
    case cwc.ui.StatusbarState.LOADING:
    case cwc.ui.StatusbarState.PREPARE:
      goog.style.setElementShown(this.nodeRun, false);
      goog.style.setElementShown(this.nodeStop, true);
      break;
  }
};
