/**
 * @fileoverview Editor for the Coding with Chrome editor.
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
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
goog.require('cwc.utils.Helper');

goog.require('goog.ui.Container');
goog.require('goog.ui.Toolbar');
goog.require('goog.ui.ToolbarButton');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {string} prefix
 * @struct
 * @final
 */
cwc.ui.RunnerToolbar = function(helper, prefix) {
  /** @type {Element} */
  this.node = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = prefix;

  /** @type {string} */
  this.generalPrefix = this.helper.getPrefix();

  /** @type {boolean} */
  this.runStatus = false;

  /** @type {boolean} */
  this.loadStatus = false;

  /** @type {goog.ui.Toolbar} */
  this.toolbar = new goog.ui.Toolbar();

  /** @type {goog.ui.ToolbarButton} */
  this.runButton = cwc.ui.Helper.getIconToolbarButton('play_arrow',
      'Runs the code …', this.run.bind(this));

  /** @type {goog.ui.ToolbarButton} */
  this.stopButton = cwc.ui.Helper.getIconToolbarButton('stop',
      'Stops the code …', this.terminate.bind(this));

  /** @type {goog.ui.ToolbarButton} */
  this.reloadButton = cwc.ui.Helper.getIconToolbarButton('refresh',
      'Reloads preview …', this.reload.bind(this));

  /** @type {goog.ui.ToolbarButton} */
  this.infoButton = cwc.ui.Helper.getIconToolbarButton('info_outline',
      'Shows general information …', this.toggleInfo.bind(this));
};


/**
 * @param {!Element} node
 */
cwc.ui.RunnerToolbar.prototype.decorate = function(node) {
  this.node = node;

  this.stopButton.setEnabled(false);
  this.reloadButton.setEnabled(false);
  this.infoButton.setEnabled(false);
  this.infoButton.addClassName('floaty_right');

  this.toolbar.setOrientation(goog.ui.Container.Orientation.HORIZONTAL);
  this.toolbar.addChild(this.runButton, true);
  this.toolbar.addChild(this.stopButton, true);
  this.toolbar.addChild(this.reloadButton, true);
  this.toolbar.addChild(this.infoButton, true);
  this.toolbar.render(this.node);
};


/**
 * Runs the code.
 */
cwc.ui.RunnerToolbar.prototype.run = function() {
  var runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.run();
  }
};


/**
 * Stops runner instance.
 */
cwc.ui.RunnerToolbar.prototype.stop = function() {
  var runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.stop();
  }
};


/**
 * Terminates runner instance.
 */
cwc.ui.RunnerToolbar.prototype.terminate = function() {
  var runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.terminate();
  }
};


/**
 * Reloads runner instance.
 */
cwc.ui.RunnerToolbar.prototype.reload = function() {
  var runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.reload();
  }
};


/**
 * Shows / hides info window.
 */
cwc.ui.RunnerToolbar.prototype.toggleInfo = function() {
  var runnerInstance = this.helper.getInstance('runner');
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
  this.stopButton.setEnabled(running);
  this.runStatus = running;
};


/**
 * Sets load status.
 * @param {boolean} loaded
 * @export
 */
cwc.ui.RunnerToolbar.prototype.setLoadStatus = function(loaded) {
  this.runButton.setEnabled(!loaded);
  this.reloadButton.setEnabled(!loaded);
  this.loadStatus = loaded;
};


/**
 * @param {boolean} enable
 */
cwc.ui.RunnerToolbar.prototype.enableInfoButton = function(enable) {
  if (this.infoButton) {
    this.infoButton.setEnabled(enable);
  }
};


/**
 * @param {boolean} visible
 */
cwc.ui.RunnerToolbar.prototype.showRunButton = function(visible) {
  this.runButton.setVisible(visible);
};
