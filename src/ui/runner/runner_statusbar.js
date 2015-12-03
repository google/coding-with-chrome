/**
 * @fileoverview Statusbar for the runner.
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
goog.provide('cwc.ui.RunnerStatusbar');

goog.require('cwc.soy.RunnerStatusbar');
goog.require('cwc.utils.Helper');
goog.require('goog.dom');
goog.require('goog.soy');
goog.require('goog.style');



/**
 * Class represents the statusbar inside the ui.
 * @param {!cwc.utils.Helper} helper
 * @param {!string} prefix
 * @constructor
 * @struct
 * @final
 */
cwc.ui.RunnerStatusbar = function(helper, prefix) {
  /** @type {string} */
  this.name = 'RunnerStatusbar';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.generalPrefix = '';

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeStatus = null;

  /** @type {string} */
  this.prefix = prefix;

  /** @type {string} */
  this.status = '';

  /** @type {Element|StyleSheet} */
  this.styleSheet = null;
};


/**
 * Decorates the given node and adds the editor status to the ui.
 * @param {Element} node The target node to add the status bar.
 * @param {string=} opt_prefix Additional prefix for the ids of the
 *    inserted elements and style definitions.
 */
cwc.ui.RunnerStatusbar.prototype.decorate = function(node,
    opt_prefix) {
  this.node = node;
  this.prefix = (opt_prefix || '') + this.prefix;

  goog.soy.renderElement(
      this.node,
      cwc.soy.RunnerStatusbar.template,
      {'prefix': this.prefix}
  );

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(
        cwc.soy.RunnerStatusbar.style({ 'prefix': this.prefix }));
  }

  this.nodeStatus = goog.dom.getElement(this.prefix + 'statusbar');
  this.setStatus('...');
};


/**
 * Sets the status message.
 * @param {!string} status
 */
cwc.ui.RunnerStatusbar.prototype.setStatus = function(status) {
  this.status = status;
  if (this.nodeStatus) {
    this.show();
    goog.dom.setTextContent(this.nodeStatus, status);
    goog.Timer.callOnce(this.hide.bind(this), 500);
  } else {
    console.log(status);
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
