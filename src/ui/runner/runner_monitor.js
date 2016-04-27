/**
 * @fileoverview Monitor for the runner.
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
goog.provide('cwc.ui.RunnerMonitor');

goog.require('cwc.soy.RunnerMonitor');
goog.require('goog.ui.Toolbar');
goog.require('goog.ui.ToolbarButton');
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
  this.prefix = prefix;

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

  /** @type {!boolean} */
  this.introEnabled = false;

  /** @type {!boolean} */
  this.monitorEnabled = false;

  /** @type {!boolean} */
  this.controlEnabled = false;

  /** @type {!boolean} */
  this.calibrationEnabled = false;

  /** @type {Element|StyleSheet} */
  this.styleSheet = null;
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

  this.nodeCalibration = goog.dom.getElement(
    this.prefix + 'monitor-calibration');
  this.nodeContent = goog.dom.getElement(this.prefix + 'monitor-content');
  this.nodeControl = goog.dom.getElement(this.prefix + 'monitor-control');
  this.nodeIntro = goog.dom.getElement(this.prefix + 'monitor-intro');
  this.nodeMain = goog.dom.getElement(this.prefix + 'monitor-main');
  this.nodeMonitor = goog.dom.getElement(this.prefix + 'monitor-monitor');
  this.nodeStatusbar = goog.dom.getElement(this.prefix + 'monitor-statusbar');
  this.nodeToolbar = goog.dom.getElement(this.prefix + 'monitor-toolbar');
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
