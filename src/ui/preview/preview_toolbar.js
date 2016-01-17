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

goog.provide('cwc.ui.PreviewToolbar');

goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Helper');

goog.require('goog.ui.Container');
goog.require('goog.ui.Dialog');
goog.require('goog.ui.KeyboardShortcutHandler');
goog.require('goog.ui.Separator');
goog.require('goog.ui.Toolbar');
goog.require('goog.ui.ToolbarButton');
goog.require('goog.ui.ToolbarRenderer');
goog.require('goog.ui.ToolbarSelect');
goog.require('goog.ui.ToolbarSeparator');
goog.require('goog.ui.ToolbarToggleButton');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {string} prefix
 * @struct
 * @final
 */
cwc.ui.PreviewToolbar = function(helper, prefix) {
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

  /** @type {!goog.ui.ToolbarButton} */
  this.runButton = cwc.ui.Helper.getIconToolbarButton('play_arrow',
      'Runs the code and update preview.', this.runPreview.bind(this));

  /** @type {!goog.ui.ToolbarButton} */
  this.stopButton = cwc.ui.Helper.getIconToolbarButton('stop',
      'Stops or terminate the preview.', this.stopPreview.bind(this));

  /** @type {!goog.ui.ToolbarButton} */
  this.reloadButton = cwc.ui.Helper.getIconToolbarButton('refresh',
      'Reloads preview.', this.reloadPreview.bind(this));

  /** @type {!goog.ui.ToolbarToggleButton} */
  this.autoReloadButton = cwc.ui.Helper.getIconToolbarToogleButton(
      'autorenew', 'Automatic reloads the preview after an ' +
      'change on the editor content.', this.autoUpdate.bind(this));
};


/**
 * @param {Element} node
 */
cwc.ui.PreviewToolbar.prototype.decorate = function(node) {
  this.node = node;

  this.reloadButton.setEnabled(false);
  this.autoReloadButton.setEnabled(true);
  this.autoReloadButton.setChecked(false);

  this.toolbar.setOrientation(goog.ui.Container.Orientation.HORIZONTAL);
  this.toolbar.addChild(this.runButton, true);
  this.toolbar.addChild(this.stopButton, true);
  this.toolbar.addChild(this.reloadButton, true);
  this.toolbar.addChild(new goog.ui.ToolbarSeparator(), true);
  this.toolbar.addChild(this.autoReloadButton, true);
  this.toolbar.render(this.node);
};


/**
 * Runs preview.
 */
cwc.ui.PreviewToolbar.prototype.runPreview = function() {
  var previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    previewInstance.run();
  }
};


/**
 * Stops preview.
 */
cwc.ui.PreviewToolbar.prototype.stopPreview = function() {
  var previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    previewInstance.stop();
  }
};


/**
 * Sets run status.
 * @param {boolean} running
 * @export
 */
cwc.ui.PreviewToolbar.prototype.setRunStatus = function(running) {
  this.stopButton.setEnabled(running);
  this.runStatus = running;
};


/**
 * Sets load status.
 * @param {boolean} loaded
 * @export
 */
cwc.ui.PreviewToolbar.prototype.setLoadStatus = function(loaded) {
  this.runButton.setEnabled(!loaded);
  this.reloadButton.setEnabled(!loaded);
  this.loadStatus = loaded;
};


/**
 * Reloads the preview.
 */
cwc.ui.PreviewToolbar.prototype.reloadPreview = function() {
  var previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    previewInstance.reload();
  }
};


/**
 * Sets auto update feature.
 */
cwc.ui.PreviewToolbar.prototype.autoUpdate = function() {
  var previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    previewInstance.setAutoUpdate(this.autoReloadButton.isChecked());
  }
};


/**
 * Sets auto update status.
 * @param {boolean} enabled
 */
cwc.ui.PreviewToolbar.prototype.setAutoUpdate = function(enabled) {
  this.autoReloadButton.setChecked(enabled);
};
