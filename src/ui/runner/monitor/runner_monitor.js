/**
 * @fileoverview Monitor for the runner.
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
goog.provide('cwc.ui.RunnerMonitor');

goog.require('cwc.soy.ui.RunnerMonitor');
goog.require('cwc.ui.StatusbarState');

goog.require('goog.math');
goog.require('goog.style');


/**
 * Class represents the monitor inside the ui.
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.RunnerMonitor = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('runner-monitor');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeContent = null;

  /** @type {Element} */
  this.nodeStatusbar = null;

  /** @type {Element} */
  this.nodeIntro = null;

  /** @type {Element} */
  this.nodeMonitor = null;

  /** @type {Element} */
  this.nodeControl = null;

  /** @type {Element} */
  this.nodeCalibration = null;

  /** @type {Element} */
  this.nodeMain = null;

  /** @type {Element} */
  this.nodeMainRun = null;

  /** @type {Element} */
  this.nodeMainStop = null;

  /** @type {Element} */
  this.tabCalibration = null;

  /** @type {Element} */
  this.tabControl = null;

  /** @type {Element} */
  this.tabIntro = null;

  /** @type {Element} */
  this.tabMonitor = null;

  /** @private {!string} */
  this.active_ = 'is-active';
};


/**
 * @param {Element} node
 * @export
 */
cwc.ui.RunnerMonitor.prototype.decorate = function(node) {
  this.node = node;

  goog.soy.renderElement(
      this.node,
      cwc.soy.ui.RunnerMonitor.template,
      {'prefix': this.prefix}
  );

  // Tabs
  this.tabCalibration = goog.dom.getElement(this.prefix + 'tab-calibration');
  this.tabControl = goog.dom.getElement(this.prefix + 'tab-control');
  this.tabIntro = goog.dom.getElement(this.prefix + 'tab-intro');
  this.tabMonitor = goog.dom.getElement(this.prefix + 'tab-monitor');

  // Content
  this.nodeCalibration = goog.dom.getElement(this.prefix + 'calibration');
  this.nodeContent = goog.dom.getElement(this.prefix + 'content');
  this.nodeControl = goog.dom.getElement(this.prefix + 'control');
  this.nodeIntro = goog.dom.getElement(this.prefix + 'intro');
  this.nodeMain = goog.dom.getElement(this.prefix + 'main');
  this.nodeMonitor = goog.dom.getElement(this.prefix + 'monitor');

  // Buttons
  this.nodeMainRun = goog.dom.getElement(this.prefix + 'main-run');
  this.nodeMainStop = goog.dom.getElement(this.prefix + 'main-stop');

  // Statusbar
  this.nodeStatusbar = goog.dom.getElement(this.prefix + 'statusbar');

  goog.events.listen(this.nodeMainRun, goog.events.EventType.CLICK,
      this.handleRun_, false, this);

  goog.events.listen(this.nodeMainStop, goog.events.EventType.CLICK,
      this.handleStop_, false, this);
};


/**
 * Sets the status message.
 * @param {!cwc.ui.StatusbarState} status
 */
cwc.ui.RunnerMonitor.prototype.setStatus = function(status) {
  switch (status) {
    case cwc.ui.StatusbarState.STOPPED:
      this.setRunStatus(false);
      break;
    case cwc.ui.StatusbarState.REFRESHING:
    case cwc.ui.StatusbarState.PREPARE:
      this.setRunStatus(true);
      break;
  }
};


/**
 * Sets run status.
 * @param {boolean} running
 * @export
 */
cwc.ui.RunnerMonitor.prototype.setRunStatus = function(running) {
  goog.dom.classlist.enable(this.nodeMainRun, this.active_, !running);
  goog.dom.classlist.enable(this.nodeMainStop, this.active_, running);
};


/**
 * @param {!boolean} visible
 */
cwc.ui.RunnerMonitor.prototype.showCalibrationTab = function(visible) {
  goog.style.setElementShown(this.tabCalibration, visible);
};


/**
 * @param {!boolean} visible
 */
cwc.ui.RunnerMonitor.prototype.showControlTab = function(visible) {
  goog.style.setElementShown(this.tabControl, visible);
};


/**
 * @param {!boolean} visible
 */
cwc.ui.RunnerMonitor.prototype.showIntroTab = function(visible) {
  goog.style.setElementShown(this.tabIntro, visible);
};


/**
 * @param {!boolean} visible
 */
cwc.ui.RunnerMonitor.prototype.showMonitorTab = function(visible) {
  goog.style.setElementShown(this.tabMonitor, visible);
};


/**
 * @return {Element}
 */
cwc.ui.RunnerMonitor.prototype.getCalibrationNode = function() {
  return this.nodeCalibration;
};


/**
 * @return {Element}
 */
cwc.ui.RunnerMonitor.prototype.getControlNode = function() {
  return this.nodeControl;
};


/**
 * @return {Element}
 */
cwc.ui.RunnerMonitor.prototype.getIntroNode = function() {
  return this.nodeIntro;
};


/**
 * @return {Element}
 */
cwc.ui.RunnerMonitor.prototype.getMainNode = function() {
  return this.nodeMain;
};


/**
 * @return {Element}
 */
cwc.ui.RunnerMonitor.prototype.getMonitorNode = function() {
  return this.nodeMonitor;
};


/**
 * @return {boolean}
 */
cwc.ui.RunnerMonitor.prototype.isControlActive = function() {
  return goog.dom.classlist.contains(this.tabControl, this.active_);
};


/**
 * @return {boolean}
 */
cwc.ui.RunnerMonitor.prototype.isMonitorActive = function() {
  return goog.dom.classlist.contains(this.tabMonitor, this.active_);
};


/**
 * Adjusts size after resize or on size change.
 */
cwc.ui.RunnerMonitor.prototype.adjustSize = function() {
  if (this.node) {
    let parentSize = goog.style.getSize(this.node);
    let newHeight = parentSize.height;

    if (this.nodeStatusbar) {
      let infobarSize = goog.style.getSize(this.nodeStatusbar);
      newHeight = newHeight - infobarSize.height;
    }

    let contentSize = new goog.math.Size(parentSize.width, newHeight);
    goog.style.setSize(this.nodeContent, contentSize);
  }
};


/**
 * Runs the runner instance.
 * @private
 */
cwc.ui.RunnerMonitor.prototype.handleRun_ = function() {
  let runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.run();
  }
};


/**
 * Stops the runner instance.
 * @private
 */
cwc.ui.RunnerMonitor.prototype.handleStop_ = function() {
  let runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.stop();
  }
};
