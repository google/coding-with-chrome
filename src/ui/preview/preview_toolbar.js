/**
 * @fileoverview Editor for the Coding with Chrome editor.
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

goog.provide('cwc.ui.PreviewToolbar');

goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Helper');

goog.require('goog.dom.classlist');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.ui.PreviewToolbar = function(helper) {
  /** @type {Element} */
  this.node = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('preview-toolbar');

  /** @type {boolean} */
  this.runStatus = false;

  /** @type {boolean} */
  this.loadStatus = false;

  /** @type {Element} */
  this.nodeAutoReload = null;

  /** @type {Element} */
  this.nodeExpand = null;

  /** @type {Element} */
  this.nodeExpandExit = null;

  /** @type {Element} */
  this.nodeOpenInBrowser = null;

  /** @type {Element} */
  this.nodeRefresh = null;

  /** @type {Element} */
  this.nodeReload = null;

  /** @type {Element} */
  this.nodeRun = null;

  /** @type {Element} */
  this.nodeStop = null;

  /** @type {boolean} */
  this.autoUpdateState = false;

  /** @type {boolean} */
  this.expandState = false;
};


/**
 * @param {Element} node
 */
cwc.ui.PreviewToolbar.prototype.decorate = function(node) {
  this.node = node;

  this.nodeAutoReload = goog.dom.getElement(this.prefix + 'auto-reload');
  this.nodeExpand = goog.dom.getElement(this.prefix + 'expand');
  this.nodeExpandExit = goog.dom.getElement(this.prefix + 'expand-exit');
  this.nodeOpenInBrowser = goog.dom.getElement(this.prefix + 'open-in-browser');
  this.nodeRefresh = goog.dom.getElement(this.prefix + 'refresh');
  this.nodeReload = goog.dom.getElement(this.prefix + 'reload');
  this.nodeRun = goog.dom.getElement(this.prefix + 'run');
  this.nodeStop = goog.dom.getElement(this.prefix + 'stop');

  cwc.ui.Helper.enableElement(this.nodeRefresh, false);
  cwc.ui.Helper.enableElement(this.nodeReload, false);
  cwc.ui.Helper.enableElement(this.nodeStop, false);
  goog.style.setElementShown(this.nodeExpandExit, false);
  goog.style.setElementShown(this.nodeReload, false);

  goog.events.listen(this.nodeAutoReload, goog.events.EventType.CLICK,
    this.autoUpdate.bind(this));
  goog.events.listen(this.nodeExpand, goog.events.EventType.CLICK,
    this.expand.bind(this));
  goog.events.listen(this.nodeExpandExit, goog.events.EventType.CLICK,
    this.collapse.bind(this));
  goog.events.listen(this.nodeOpenInBrowser, goog.events.EventType.CLICK,
    this.openInBrowser.bind(this));
  goog.events.listen(this.nodeRefresh, goog.events.EventType.CLICK,
    this.refreshPreview.bind(this));
  goog.events.listen(this.nodeReload, goog.events.EventType.CLICK,
    this.reloadPreview.bind(this));
  goog.events.listen(this.nodeRun, goog.events.EventType.CLICK,
    this.runPreview.bind(this));
  goog.events.listen(this.nodeStop, goog.events.EventType.CLICK,
    this.stopPreview.bind(this));
};


/**
 * Runs preview.
 */
cwc.ui.PreviewToolbar.prototype.runPreview = function() {
  let previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    previewInstance.run();
  }
};


/**
 * Stops preview.
 */
cwc.ui.PreviewToolbar.prototype.stopPreview = function() {
  let previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    previewInstance.stop();
  }
};


/**
 * Sets run status.
 * @param {!boolean} running
 * @export
 */
cwc.ui.PreviewToolbar.prototype.setRunStatus = function(running) {
  cwc.ui.Helper.enableElement(this.nodeStop, running);
  this.runStatus = running;
};


/**
 * Sets load status.
 * @param {!boolean} loaded
 * @export
 */
cwc.ui.PreviewToolbar.prototype.setLoadStatus = function(loaded) {
  cwc.ui.Helper.enableElement(this.nodeRefresh, !loaded);
  cwc.ui.Helper.enableElement(this.nodeReload, !loaded);
  cwc.ui.Helper.enableElement(this.nodeRun, !loaded);
  this.loadStatus = loaded;
};


/**
 * @param {!boolean} enable
 * @export
 */
cwc.ui.PreviewToolbar.prototype.enableSoftRefresh = function(enable) {
  console.log('Enable soft refresh:', enable);
  goog.style.setElementShown(this.nodeRefresh, enable);
  goog.style.setElementShown(this.nodeReload, !enable);
};


/**
 * Reloads the preview.
 */
cwc.ui.PreviewToolbar.prototype.refreshPreview = function() {
  let previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    previewInstance.refresh();
  }
};


/**
 * Reloads the preview.
 */
cwc.ui.PreviewToolbar.prototype.reloadPreview = function() {
  let previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    previewInstance.reload();
  }
};


/**
 * Sets auto update feature.
 */
cwc.ui.PreviewToolbar.prototype.autoUpdate = function() {
  let previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    previewInstance.setAutoUpdate(!this.autoUpdateState);
  }
};


/**
 * Sets auto update status.
 * @param {boolean} enable
 */
cwc.ui.PreviewToolbar.prototype.setAutoUpdate = function(enable) {
  this.autoUpdateState = enable;
  goog.dom.classlist.enable(this.nodeAutoReload, 'spin', enable);
};


/**
 * Toggles the current expand state.
 */
cwc.ui.PreviewToolbar.prototype.toggleExpand = function() {
  this.expandState = !this.expandState;
  this.setExpand(this.expandState);
};


/**
 * Toggles the current expand state.
 * @param {event} e
 */
cwc.ui.PreviewToolbar.prototype.expand = function(e) {
  this.setExpand(true, e.target.closest('.goog-splitpane-first-container'));
};


/**
 * Toggles the current expand state.
 * @param {event} e
 */
cwc.ui.PreviewToolbar.prototype.collapse = function(e) {
  this.setExpand(false, e.target.closest('.goog-splitpane-first-container'));
};


/**
 * Open preview in an new browser window.
 */
cwc.ui.PreviewToolbar.prototype.openInBrowser = function() {
  let previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    previewInstance.openInBrowser();
  }
};


/**
 * Expands or collapse the current window.
 * @param {boolean} expand
 * @param {boolean=} invert
 */
cwc.ui.PreviewToolbar.prototype.setExpand = function(expand, invert = false) {
  this.expandState = expand;
  let layoutInstance = this.helper.getInstance('layout', true);
  if (layoutInstance) {
    if (invert) {
      layoutInstance.setFullscreen(expand);
    } else {
      layoutInstance.setFullscreen(expand, 0);
    }
    goog.style.setElementShown(this.nodeExpand, !expand);
    goog.style.setElementShown(this.nodeExpandExit, expand);
  }
};


/**
 * Shows/Hide the expand button.
 * @param {boolean} visible
 */
cwc.ui.PreviewToolbar.prototype.showExpandButton = function(visible) {
  goog.style.setElementShown(this.nodeExpand, visible);
};


/**
 * @param {boolean} visible
 */
cwc.ui.PreviewToolbar.prototype.showRunButton = function(visible) {
  goog.style.setElementShown(this.nodeRun, visible);
};
