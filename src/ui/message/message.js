/**
 * @fileoverview Message pane.
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
goog.provide('cwc.ui.Message');

goog.require('cwc.soy.ui.Message');
goog.require('cwc.utils.Logger');


/**
 * Class represents the message pane inside the ui.
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Message = function(helper) {
  /** @type {string} */
  this.name = 'Message';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('message');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeMain = null;

  /** @type {Element} */
  this.nodeHelp = null;

  /** @type {Element} */
  this.nodeCalibration = null;

  /** @type {Element} */
  this.nodeCalibrationTab = null;

  /** @type {Element} */
  this.nodeMonitor = null;

  /** @type {Element} */
  this.nodeMonitorTab = null;

  /** @type {boolean} */
  this.decorated_ = false;

  /** @private {string} */
  this.active_ = 'is-active';

  /** @private {!cwc.utils.Logger|null} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * @param {Element=} node
 */
cwc.ui.Message.prototype.decorate = function(node) {
  if (this.decorated_) {
    return;
  }
  this.decorated_ = true;

  this.node = node || goog.dom.getElement(this.prefix + 'chrome');
  if (!this.node) {
    this.log_.error('Invalid Status node:', this.node);
    return;
  }

  goog.soy.renderElement(
      this.node,
      cwc.soy.ui.Message.template, {
        'prefix': this.prefix,
      }
  );

  this.nodeCalibration = goog.dom.getElement(this.prefix + 'calibration');
  this.nodeCalibrationTab = goog.dom.getElement(
    this.prefix + 'tab-calibration');
  this.nodeControl = goog.dom.getElement(this.prefix + 'control');
  this.nodeControlTab = goog.dom.getElement(this.prefix + 'tab-control');
  this.nodeMonitor = goog.dom.getElement(this.prefix + 'monitor');
  this.nodeMonitorTab = goog.dom.getElement(this.prefix + 'tab-monitor');

  this.show(false);
  this.showCalibration(false);
  this.showControl(false);
  this.showMonitor(false);
};


/**
 * @param {Function=} decorator
 */
cwc.ui.Message.prototype.decorateCalibration = function(decorator) {
  this.decorate();
  this.decorateContent_(
    this.nodeCalibration, this.nodeCalibrationTab, decorator);
};


/**
 * @param {Function=} decorator
 */
cwc.ui.Message.prototype.decorateControl = function(decorator) {
  this.decorate();
  this.decorateContent_(this.nodeControl, this.nodeControlTab, decorator);
};


/**
 * @param {Function=} decorator
 */
cwc.ui.Message.prototype.decorateMonitor = function(decorator) {
  this.decorate();
  this.decorateContent_(this.nodeMonitor, this.nodeMonitorTab, decorator);
};


/**
 * @return {boolean}
 */
cwc.ui.Message.prototype.isCalibrationActive = function() {
  return goog.dom.classlist.contains(this.nodeCalibrationTab, this.active_);
};

/**
 * @return {boolean}
 */
cwc.ui.Message.prototype.isControlActive = function() {
  return goog.dom.classlist.contains(this.nodeControlTab, this.active_);
};


/**
 * @return {boolean}
 */
cwc.ui.Message.prototype.isMonitorActive = function() {
  return goog.dom.classlist.contains(this.nodeMonitorTab, this.active_);
};


/**
 * @param {boolean} visible
 */
cwc.ui.Message.prototype.show = function(visible = true) {
  goog.style.setElementShown(this.node, visible);
  if (visible) {
    this.refresh_();
  }
};


/**
 * @param {boolean} visible
 */
cwc.ui.Message.prototype.showCalibration = function(visible = true) {
  this.showTab_(this.nodeCalibration, this.nodeCalibrationTab, visible);
};


/**
 * @param {boolean} visible
 */
cwc.ui.Message.prototype.showControl = function(visible = true) {
  this.showTab_(this.nodeControl, this.nodeControlTab, visible);
};


/**
 * @param {boolean} visible
 */
cwc.ui.Message.prototype.showMonitor = function(visible = true) {
  this.showTab_(this.nodeMonitor, this.nodeMonitorTab, visible);
};


/**
 * @private
 */
cwc.ui.Message.prototype.refresh_ = function() {
  if (typeof window.componentHandler !== 'undefined') {
    window.componentHandler.upgradeDom();
  }
};


/**
 * @param {!Element} nodeContent
 * @param {!Element} nodeTab
 * @param {Function=} decorator
 * @private
 */
cwc.ui.Message.prototype.decorateContent_ = function(
    nodeContent, nodeTab, decorator) {
  if (decorator && typeof decorator.decorate === 'function') {
    decorator.decorate(nodeContent);
  }
  this.showTab_(nodeContent, nodeTab, true);
  this.show();
};


/**
 * @param {!Element} nodeContent
 * @param {!Element} nodeTab
 * @param {boolean} visible
 * @private
 */
cwc.ui.Message.prototype.showTab_ = function(nodeContent, nodeTab, visible) {
  goog.style.setElementShown(nodeContent, visible);
  goog.style.setElementShown(nodeTab, visible);
  if (visible) {
    nodeTab.click();
  }
};
