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
goog.require('goog.ui.ToolbarRenderer');
goog.require('goog.ui.ToolbarSelect');
goog.require('goog.ui.ToolbarSeparator');
goog.require('goog.ui.ToolbarToggleButton');
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

  /** @type {!boolean} */
  this.introEnabled = false;

  /** @type {!boolean} */
  this.monitorEnabled = false;

  /** @type {!boolean} */
  this.controlEnabled = false;

  /** @type {!boolean} */
  this.calibrationEnabled = false;

  /** @type {goog.ui.Toolbar} */
  this.toolbar = new goog.ui.Toolbar();

  /** @type {goog.ui.ToolbarButton} */
  this.introButton = cwc.ui.Helper.getIconToolbarButton('developer_board',
      'General Information', this.showIntro.bind(this));

  /** @type {goog.ui.ToolbarButton} */
  this.monitorButton = cwc.ui.Helper.getIconToolbarButton('equalizer',
      'Device Monitor', this.showMonitor.bind(this));

  /** @type {goog.ui.ToolbarButton} */
  this.controlButton = cwc.ui.Helper.getIconToolbarButton('gamepad',
      'Control the unit.', this.showControl.bind(this));

  /** @type {goog.ui.ToolbarButton} */
  this.calibrationButton = cwc.ui.Helper.getIconToolbarButton('tune',
      'Calibrate the unit.', this.showCalibration.bind(this));

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

  this.nodeToolbar = goog.dom.getElement(this.prefix + 'monitor-toolbar');
  this.nodeContent = goog.dom.getElement(this.prefix + 'monitor-content');
  this.nodeControl = goog.dom.getElement(this.prefix + 'monitor-control');
  this.nodeMonitor = goog.dom.getElement(this.prefix + 'monitor-monitor');
  this.nodeIntro = goog.dom.getElement(this.prefix + 'monitor-intro');
  this.nodeStatusbar = goog.dom.getElement(this.prefix + 'monitor-statusbar');
  this.nodeCalibration = goog.dom.getElement(
      this.prefix + 'monitor-calibration');

  this.toolbar.setOrientation(goog.ui.Container.Orientation.HORIZONTAL);
  this.toolbar.addChild(this.introButton, true);
  this.toolbar.addChild(this.monitorButton, true);
  this.toolbar.addChild(this.controlButton, true);
  this.toolbar.addChild(this.calibrationButton, true);
  this.toolbar.render(this.nodeToolbar);

  this.updateButtons_();
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
cwc.ui.RunnerMonitor.prototype.getMonitorNode = function() {
  return this.nodeMonitor;
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
cwc.ui.RunnerMonitor.prototype.getCalibrationNode = function() {
  return this.nodeCalibration;
};


/**
 * @param {Event=} opt_event
 */
cwc.ui.RunnerMonitor.prototype.showIntro = function(opt_event) {
  goog.style.setElementShown(this.nodeIntro, true);
  goog.style.setElementShown(this.nodeMonitor, false);
  goog.style.setElementShown(this.nodeControl, false);
  goog.style.setElementShown(this.nodeCalibration, false);
};


/**
 * @param {Event=} opt_event
 */
cwc.ui.RunnerMonitor.prototype.showMonitor = function(opt_event) {
  goog.style.setElementShown(this.nodeIntro, false);
  goog.style.setElementShown(this.nodeMonitor, true);
  goog.style.setElementShown(this.nodeControl, false);
  goog.style.setElementShown(this.nodeCalibration, false);
};


/**
 * @param {Event=} opt_event
 */
cwc.ui.RunnerMonitor.prototype.showControl = function(opt_event) {
  goog.style.setElementShown(this.nodeIntro, false);
  goog.style.setElementShown(this.nodeMonitor, false);
  goog.style.setElementShown(this.nodeControl, true);
  goog.style.setElementShown(this.nodeCalibration, false);
};


/**
 * @param {Event=} opt_event
 */
cwc.ui.RunnerMonitor.prototype.showCalibration = function(opt_event) {
  goog.style.setElementShown(this.nodeIntro, false);
  goog.style.setElementShown(this.nodeMonitor, false);
  goog.style.setElementShown(this.nodeControl, false);
  goog.style.setElementShown(this.nodeCalibration, true);
};


/**
 * @private
 */
cwc.ui.RunnerMonitor.prototype.updateButtons_ = function() {

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
