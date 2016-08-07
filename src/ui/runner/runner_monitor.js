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

goog.require('cwc.soy.RunnerMonitor');
goog.require('goog.math');
goog.require('goog.style');



/**
 * Class represents the monitor inside the ui.
 * @param {!cwc.utils.Helper} helper
 * @param {!string} prefix
 * @constructor
 * @struct
 * @final
 */
cwc.ui.RunnerMonitor = function(helper, prefix) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = prefix + 'monitor-';

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeToolbar = null;

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
  this.tabMonitor = null;

  /** @type {Element|StyleSheet} */
  this.styleSheet = null;

  /** @private {!string} */
  this.active_ = 'is-active';
};


/**
 * @param {Element} node
 * @export
 */
cwc.ui.RunnerMonitor.prototype.decorate = function(node) {
  this.node = node;

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(
        cwc.soy.RunnerMonitor.style({ 'prefix': this.prefix }));
  }

  goog.soy.renderElement(
      this.node,
      cwc.soy.RunnerMonitor.template,
      { 'prefix': this.prefix }
  );

  // Tabs
  this.tabCalibration = goog.dom.getElement(this.prefix + 'tab-calibration');
  this.tabControl = goog.dom.getElement(this.prefix + 'tab-control');
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

  // Statusbar and Toolbar
  this.nodeStatusbar = goog.dom.getElement(this.prefix + 'statusbar');
  this.nodeToolbar = goog.dom.getElement(this.prefix + 'toolbar');

  goog.events.listen(this.nodeMainRun, goog.events.EventType.CLICK,
      this.handleRun_, false, this);

  goog.events.listen(this.nodeMainStop, goog.events.EventType.CLICK,
      this.handleStop_, false, this);
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
 * @param {!boolean} show
 */
cwc.ui.RunnerMonitor.prototype.showCalibrationTab = function(show) {
  goog.style.showElement(this.tabCalibration, show);
};


/**
 * @param {!boolean} show
 */
cwc.ui.RunnerMonitor.prototype.showControlTab = function(show) {
  goog.style.showElement(this.tabCalibration, show);
};


/**
 * @param {!boolean} show
 */
cwc.ui.RunnerMonitor.prototype.showMonitorTab = function(show) {
  goog.style.showElement(this.tabMonitor, show);
};


/**
 * @return {element}
 */
cwc.ui.RunnerMonitor.prototype.getCalibrationNode = function() {
  return this.nodeCalibration;
};


/**
 * @return {element}
 */
cwc.ui.RunnerMonitor.prototype.getControlNode = function() {
  return this.nodeControl;
};


/**
 * @return {element}
 */
cwc.ui.RunnerMonitor.prototype.getIntroNode = function() {
  return this.nodeIntro;
};


/**
 * @return {element}
 */
cwc.ui.RunnerMonitor.prototype.getMainNode = function() {
  return this.nodeMain;
};


/**
 * @return {element}
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
    var parentSize = goog.style.getSize(this.node);
    var newHeight = parentSize.height;

    if (this.nodeToolbar) {
      var toolbarSize = goog.style.getSize(this.nodeToolbar);
      newHeight = newHeight - toolbarSize.height;
    }

    if (this.nodeStatusbar) {
      var infobarSize = goog.style.getSize(this.nodeStatusbar);
      newHeight = newHeight - infobarSize.height;
    }

    var contentSize = new goog.math.Size(parentSize.width, newHeight);
    goog.style.setSize(this.nodeContent, contentSize);
  }
};


/**
 * Runs the runner instance.
 * @private
 */
cwc.ui.RunnerMonitor.prototype.handleRun_ = function() {
  var runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.run();
  }
};


/**
 * Stops the runner instance.
 * @private
 */
cwc.ui.RunnerMonitor.prototype.handleStop_ = function() {
  var runnerInstance = this.helper.getInstance('runner');
  if (runnerInstance) {
    runnerInstance.stop();
  }
};
