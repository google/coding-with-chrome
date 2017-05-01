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
goog.require('cwc.utils.Helper');
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

  /** @type {string} */
  this.status = '';
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
  this.setStatus('…');
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
