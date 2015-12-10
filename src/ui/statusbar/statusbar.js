/**
 * @fileoverview Statusbar for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Statusbar');

goog.require('cwc.soy.Statusbar');
goog.require('cwc.utils.Helper');
goog.require('goog.dom');
goog.require('goog.soy');
goog.require('goog.style');



/**
 * Class to represent the statusbar inside the ui.
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Statusbar = function(helper) {
  /** @type {string} */
  this.name = 'statusbar';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.generalPrefix = '';

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeStatus = null;

  /** @type {string} */
  this.prefix = 'statusbar-';

  /** @type {string} */
  this.status = '';
};


/**
 * Decorates the given node and adds the editor status to the ui.
 * @param {Element} node The status bar node.
 * @param {string=} opt_prefix Additional prefix for the ids of the
 *    inserted elements and style definitions.
 */
cwc.ui.Statusbar.prototype.decorate = function(node, opt_prefix) {
  this.node = node;
  this.prefix = (opt_prefix || '') + this.prefix;

  goog.soy.renderElement(
      this.node,
      cwc.soy.Statusbar.statusbarTemplate,
      {'prefix': this.prefix}
  );

  goog.style.installStyles(
      cwc.soy.Statusbar.statusbarStyle({ 'prefix': this.prefix })
  );

  this.nodeStatus = goog.dom.getElement(this.prefix + 'status');
  this.setStatus('…');
};


/**
 * Sets the status message.
 * @param {!string} status
 */
cwc.ui.Statusbar.prototype.setStatus = function(status) {
  this.status = status;
  if (this.nodeStatus) {
    this.show();
    goog.dom.setTextContent(this.nodeStatus, status);
    goog.Timer.callOnce(this.hide.bind(this), 5000);
  } else {
    console.log(status);
  }
};


/**
 * Shows status bar.
 */
cwc.ui.Statusbar.prototype.hide = function() {
  goog.Timer.callOnce(function() {
    goog.style.setElementShown(this.node, false);
  }.bind(this), 1000);
};


/**
 * Hides status bar.
 */
cwc.ui.Statusbar.prototype.show = function() {
  goog.style.setElementShown(this.node, true);
};
