/**
 * @fileoverview Editor for the Coding with Chrome editor.
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
goog.provide('cwc.ui.RunnerToolbar');

goog.require('cwc.ui.Helper');
goog.require('cwc.ui.StatusbarState');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.ui.RunnerToolbar = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('runner-toolbar');

  /** @type {Element} */
  this.node = null;

  /** @type {boolean} */
  this.runStatus = false;

  /** @type {boolean} */
  this.loadStatus = false;

  /** @type {Element} */
  this.nodeExpand = null;

  /** @type {Element} */
  this.nodeExpandExit = null;

  /** @type {Element} */
  this.nodeInfo = null;

  /** @type {Element} */
  this.nodeRefresh = null;

  /** @type {Element} */
  this.nodeReload = null;

  /** @type {Element} */
  this.nodeRun = null;

  /** @type {Element} */
  this.nodeStop = null;

  /** @type {boolean} */
  this.expandState = false;
};


/**
 * @param {!Element} node
 */
cwc.ui.RunnerToolbar.prototype.decorate = function(node) {
  this.node = node;
  this.nodeExpand = goog.dom.getElement(this.prefix + 'expand');
  this.nodeExpandExit = goog.dom.getElement(this.prefix + 'expand-exit');
  this.nodeInfo = goog.dom.getElement(this.prefix + 'info');
  this.nodeRefresh = goog.dom.getElement(this.prefix + 'refresh');
  this.nodeReload = goog.dom.getElement(this.prefix + 'reload');
  this.nodeRun = goog.dom.getElement(this.prefix + 'run');
  this.nodeStop = goog.dom.getElement(this.prefix + 'stop');

  cwc.ui.Helper.enableElement(this.nodeRefresh, false);
  cwc.ui.Helper.enableElement(this.nodeReload, false);
  cwc.ui.Helper.enableElement(this.nodeStop, false);
  goog.style.setElementShown(this.nodeExpandExit, false);
  goog.style.setElementShown(this.nodeInfo, false);
  goog.style.setElementShown(this.nodeReload, false);

  goog.events.listen(this.nodeExpand, goog.events.EventType.CLICK,
    this.expand.bind(this));
  goog.events.listen(this.nodeExpandExit, goog.events.EventType.CLICK,
    this.collapse.bind(this));
  goog.events.listen(this.nodeInfo, goog.events.EventType.CLICK,
    this.toggleInfo.bind(this));
  goog.events.listen(this.nodeRefresh, goog.events.EventType.CLICK,
    this.refresh.bind(this));
  goog.events.listen(this.nodeReload, goog.events.EventType.CLICK,
    this.reload.bind(this));
  goog.events.listen(this.nodeRun, goog.events.EventType.CLICK,
    this.run.bind(this));
  goog.events.listen(this.nodeStop, goog.events.EventType.CLICK,
    this.stop.bind(this));
};


/**
 * Sets the status message.
 * @param {!cwc.ui.RunnerStatus} status
 */
cwc.ui.RunnerToolbar.prototype.setStatus = function(status) {
  switch (status) {
    case cwc.ui.StatusbarState.LOADED:
    case cwc.ui.StatusbarState.STOPPED:
      this.setLoadStatus(false);
      break;
    case cwc.ui.StatusbarState.LOADING:
      this.setLoadStatus(true);
      break;
    case cwc.ui.StatusbarState.TERMINATED:
      this.setRunStatus(false);
      break;
    case cwc.ui.StatusbarState.PREPARE:
      this.setRunStatus(true);
      break;
  }
};


/**
 * Runs the code.
 */
cwc.ui.RunnerToolbar.prototype.run = function() {
  let runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.run();
  }
};


/**
 * Stops runner instance.
 */
cwc.ui.RunnerToolbar.prototype.stop = function() {
  let runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.stop();
  }
};


/**
 * Terminates runner instance.
 */
cwc.ui.RunnerToolbar.prototype.terminate = function() {
  let runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.terminate();
  }
};


/**
 * Refreshes runner instance.
 */
cwc.ui.RunnerToolbar.prototype.refresh = function() {
  let runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.refresh();
  }
};


/**
 * Reloads runner instance.
 */
cwc.ui.RunnerToolbar.prototype.reload = function() {
  let runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.reload();
  }
};


/**
 * Shows / hides info window.
 */
cwc.ui.RunnerToolbar.prototype.toggleInfo = function() {
  let runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.toggleInfo();
  }
};


/**
 * Sets run status.
 * @param {boolean} running
 * @export
 */
cwc.ui.RunnerToolbar.prototype.setRunStatus = function(running) {
  cwc.ui.Helper.enableElement(this.nodeStop, running);
  this.runStatus = running;
};


/**
 * Sets load status.
 * @param {boolean} loaded
 * @export
 */
cwc.ui.RunnerToolbar.prototype.setLoadStatus = function(loaded) {
  cwc.ui.Helper.enableElement(this.nodeRun, !loaded);
  cwc.ui.Helper.enableElement(this.nodeRefresh, !loaded);
  cwc.ui.Helper.enableElement(this.nodeReload, !loaded);
  this.loadStatus = loaded;
};


/**
 * @param {boolean} enable
 */
cwc.ui.RunnerToolbar.prototype.enableInfoButton = function(enable) {
  if (this.nodeInfo) {
    cwc.ui.Helper.enableElement(this.nodeInfo, enable);
  }
};


/**
 * Toggles the current expand state.
 */
cwc.ui.RunnerToolbar.prototype.toggleExpand = function() {
  this.expandState = !this.expandState;
  this.setExpand(this.expandState);
};


/**
 * Toggles the current expand state.
 */
cwc.ui.RunnerToolbar.prototype.expand = function() {
  this.setExpand(true);
};


/**
 * Toggles the current expand state.
 */
cwc.ui.RunnerToolbar.prototype.collapse = function() {
  this.setExpand(false);
};


/**
 * Expands or collapse the current window.
 * @param {boolean} expand
 */
cwc.ui.RunnerToolbar.prototype.setExpand = function(expand) {
  this.expandState = expand;
  let layoutInstance = this.helper.getInstance('layout', true);
  if (layoutInstance) {
    layoutInstance.setFullscreen(expand, 0);
    goog.style.setElementShown(this.nodeExpand, !expand);
    goog.style.setElementShown(this.nodeExpandExit, expand);
  }
};


/**
 * Shows/Hide the expand button.
 * @param {boolean} visible
 */
cwc.ui.RunnerToolbar.prototype.showExpandButton = function(visible) {
  goog.style.setElementShown(this.nodeExpand, visible);
};


/**
 * @param {boolean} visible
 */
cwc.ui.RunnerToolbar.prototype.showRunButton = function(visible) {
  goog.style.setElementShown(this.nodeRun, visible);
};


/**
 * @param {boolean} visible
 */
cwc.ui.RunnerToolbar.prototype.showInfoButton = function(visible) {
  goog.style.setElementShown(this.nodeInfo, visible);
};
