/**
 * @fileoverview Toolbar of the Code Editor.
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
goog.provide('cwc.ui.EditorToolbar');

goog.require('cwc.utils.mime.Type');
goog.require('cwc.utils.mime.Type');
goog.require('cwc.soy.ui.EditorToolbar');
goog.require('cwc.ui.Helper');

goog.require('goog.dom.classlist');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.Select');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.ui.EditorToolbar = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('editor-toolbar');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeSelectView = null;

  /** @type {Element} */
  this.nodeDebug = null;

  /** @type {Element} */
  this.nodeExpand = null;

  /** @type {Element} */
  this.nodeExpandExit = null;

  /** @type {Element} */
  this.nodeMore= null;

  /** @type {Element} */
  this.nodeMoreList = null;

  /** @type {Element} */
  this.nodeSave = null;

  /** @type {Element} */
  this.nodePublish = null;

  /** @type {Element} */
  this.nodeUndo = null;

  /** @type {Element} */
  this.nodeRedo = null;

  /** @type {!goog.ui.Select} */
  this.selectView = new goog.ui.Select();

  /** @type {string} */
  this.currentView = '';

  /** @type {boolean} */
  this.expandState = false;

  /** @private {cwc.utils.Dialog} */
  this.dialog_ = null;
};


/**
 * @param {Element} node
 * @param {Element} node_select_view
 */
cwc.ui.EditorToolbar.prototype.decorate = function(node, node_select_view) {
  this.node = node;
  this.nodeSelectView = node_select_view;

  // Render editor toolbar.
  goog.soy.renderElement(
    this.node,
    cwc.soy.ui.EditorToolbar.template, {
      experimental: this.helper.experimentalEnabled(),
      prefix: this.prefix,
    }
  );

  this.selectView.setTooltip('Change view');
  this.selectView.render(this.nodeSelectView);
  this.nodeDebug = goog.dom.getElement(this.prefix + 'debug');
  this.nodeExpand = goog.dom.getElement(this.prefix + 'expand');
  this.nodeExpandExit = goog.dom.getElement(this.prefix + 'expand-exit');
  this.nodeMore = goog.dom.getElement(this.prefix + 'menu-more');
  this.nodeMoreList = goog.dom.getElement(this.prefix + 'menu-more-list');
  this.nodeRedo = goog.dom.getElement(this.prefix + 'redo');
  this.nodeSave = goog.dom.getElement(this.prefix + 'save');
  this.nodeUndo = goog.dom.getElement(this.prefix + 'undo');

  // Default status of options
  cwc.ui.Helper.enableElement(this.nodeUndo, false);
  cwc.ui.Helper.enableElement(this.nodeRedo, false);
  goog.style.setElementShown(this.nodeExpandExit, false);
  goog.style.setElementShown(this.nodeMore, false);

  if (this.helper.experimentalEnabled()) {
    this.nodePublish = goog.dom.getElement(this.prefix + 'publish');
    goog.events.listen(this.nodePublish, goog.events.EventType.CLICK,
      this.publish.bind(this));
  }

  // Events
  goog.events.listen(this.nodeDebug, goog.events.EventType.CLICK,
    this.setSyntaxCheck.bind(this));
  goog.events.listen(this.nodeExpand, goog.events.EventType.CLICK,
    this.expand.bind(this));
  goog.events.listen(this.nodeExpandExit, goog.events.EventType.CLICK,
    this.collapse.bind(this));
  goog.events.listen(this.nodeRedo, goog.events.EventType.CLICK,
    this.redo.bind(this));
  goog.events.listen(this.nodeSave, goog.events.EventType.CLICK,
    this.save.bind(this));
  goog.events.listen(this.nodeUndo, goog.events.EventType.CLICK,
    this.undo.bind(this));

  goog.events.listen(this.selectView, goog.ui.Component.EventType.ACTION,
      this.editorChangeViewEvent, false, this);
};


/**
 * @param {!string} name
 * @param {!function()} func
 * @param {string=} opt_tooltip
 */
cwc.ui.EditorToolbar.prototype.addOption = function(name, func, opt_tooltip) {
  if (this.nodeMoreList) {
    let item = cwc.ui.Helper.getMenuItem(name, opt_tooltip, func);
    this.nodeMoreList.appendChild(item);
    goog.style.setElementShown(this.nodeMore, true);
    cwc.ui.Helper.mdlRefresh();
  }
};


/**
 * Saves the currently open file.
 */
cwc.ui.EditorToolbar.prototype.save = function() {
  let fileSaverInstance = this.helper.getInstance('fileSaver');
  if (fileSaverInstance) {
    fileSaverInstance.saveFile(true);
  }
};


/**
 * Undo change to the editor.
 */
cwc.ui.EditorToolbar.prototype.undo = function() {
  let editorInstance = this.helper.getInstance('editor');
  if (editorInstance) {
    let history = editorInstance.undoChange();
    this.enableUndoButton(history['undo'] > 0);
    this.enableRedoButton(history['redo'] > 0);
  }
};


/**
 * Redo change to the editor.
 */
cwc.ui.EditorToolbar.prototype.redo = function() {
  let editorInstance = this.helper.getInstance('editor');
  if (editorInstance) {
    let history = editorInstance.redoChange();
    this.enableUndoButton(history['undo'] > 0);
    this.enableRedoButton(history['redo'] > 0);
  }
};


/**
 * Enable or disable debug.
 */
cwc.ui.EditorToolbar.prototype.setSyntaxCheck = function() {
  let editorInstance = this.helper.getInstance('editor');
  if (editorInstance) {
    let active = goog.dom.classlist.contains(this.nodeDebug, 'active');
    goog.dom.classlist.enable(this.nodeDebug, 'active', !active);
    goog.dom.classlist.enable(this.nodeDebug, 'icon_24px_red', !active);
    editorInstance.setSyntaxCheck(!active);
  }
};


/**
 * Change editor view.
 * @param {Event} event
 */
cwc.ui.EditorToolbar.prototype.editorChangeViewEvent = function(event) {
  let eventTarget = /** @type {CodeMirror} */ (event.target);
  this.editorChangeView(eventTarget.getValue());
};


/**
 * Change editor view.
 * @param {string} name
 */
cwc.ui.EditorToolbar.prototype.editorChangeView = function(name) {
  let editorInstance = this.helper.getInstance('editor');
  if (editorInstance && name) {
    this.currentView = name;
    editorInstance.changeView(name);
  }
};


/**
 * Publish file.
 */
cwc.ui.EditorToolbar.prototype.publish = function() {
  let fileExporterInstance = this.helper.getInstance('fileExporter');
  fileExporterInstance.exportHtmlToGoogleCloud();
};


/**
 * @param {boolean} enable
 */
cwc.ui.EditorToolbar.prototype.enablePublishButton = function(enable) {
  cwc.ui.Helper.enableElement(this.nodePublish, enable);
};


/**
 * @param {boolean} enable
 */
cwc.ui.EditorToolbar.prototype.enableDebugButton = function(enable) {
  cwc.ui.Helper.enableElement(this.nodeDebug, enable);
};


/**
 * @param {boolean} enable
 */
cwc.ui.EditorToolbar.prototype.enableUndoButton = function(enable) {
  cwc.ui.Helper.enableElement(this.nodeUndo, enable);
};


/**
 * @param {boolean} enable
 */
cwc.ui.EditorToolbar.prototype.enableRedoButton = function(enable) {
  cwc.ui.Helper.enableElement(this.nodeRedo, enable);
};


/**
 * Updates the options for the toolbar depending on the editor mode.
 * @param {string} editor_mode
 */
cwc.ui.EditorToolbar.prototype.updateToolbar = function(editor_mode) {
  if (editor_mode == cwc.utils.mime.Type.COFFEESCRIPT.type ||
      editor_mode == cwc.utils.mime.Type.CSS.type ||
      editor_mode == cwc.utils.mime.Type.HTML.type ||
      editor_mode == cwc.utils.mime.Type.JAVASCRIPT.type ||
      editor_mode == cwc.utils.mime.Type.JSON.type) {
    this.enableDebugButton(true);
  } else {
    let editorInstance = this.helper.getInstance('editor');
    if (editorInstance) {
      editorInstance.setSyntaxCheck(false);
    }
    this.enableDebugButton(false);
  }
  if (this.helper.experimentalEnabled()) {
    this.enablePublishButton(false);
  }
};


/**
 * Add editor view.
 * @param {!string} name
 * @export
 */
cwc.ui.EditorToolbar.prototype.addView = function(name) {
  let selectedView = new goog.ui.MenuItem(name);
  this.selectView.addItem(selectedView);

  if (!this.currentView) {
    this.editorChangeView(name);
    this.selectView.setSelectedItem(selectedView);
  }
};


/**
 * Toggles the current expand state.
 */
cwc.ui.EditorToolbar.prototype.expand = function() {
  this.setExpand(true);
};


/**
 * Toggles the current expand state.
 */
cwc.ui.EditorToolbar.prototype.collapse = function() {
  this.setExpand(false);
};


/**
 * Toggles the current expand state.
 */
cwc.ui.EditorToolbar.prototype.toggleExpand = function() {
  this.setExpand(!this.expandState);
};


/**
 * Expands or collapses the current window.
 * @param {boolean} expand
 */
cwc.ui.EditorToolbar.prototype.setExpand = function(expand) {
  this.expandState = expand;
  let layoutInstance = this.helper.getInstance('layout', true);
  if (layoutInstance) {
    layoutInstance.setFullscreenEditor(expand);
    goog.style.setElementShown(this.nodeExpand, !expand);
    goog.style.setElementShown(this.nodeExpandExit, expand);
  }
};


/**
 * Shows/Hide the expand button.
 * @param {boolean} visible
 */
cwc.ui.EditorToolbar.prototype.showExpandButton = function(visible) {
  goog.style.setElementShown(this.nodeExpand, visible);
};
