/**
 * @fileoverview Toolbar of the Code Editor.
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
goog.provide('cwc.ui.EditorToolbar');

goog.require('cwc.ui.Helper');

goog.require('goog.ui.Container');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.PopupMenu');
goog.require('goog.ui.Select');
goog.require('goog.ui.Toolbar');
goog.require('goog.ui.ToolbarButton');
goog.require('goog.ui.ToolbarSeparator');
goog.require('goog.ui.ToolbarToggleButton');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.ui.EditorToolbar = function(helper) {
  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeEditor = null;

  /** @type {Element} */
  this.nodeSelectView = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = 'toolbar-';

  /** @type {string} */
  this.generalPrefix = this.helper.getPrefix();

  /** @type {!goog.ui.Toolbar} */
  this.toolbar = new goog.ui.Toolbar();

  /** @type {goog.ui.ToolbarButton} */
  this.saveButton = cwc.ui.Helper.getIconToolbarButton('save',
      'Save the project', this.save.bind(this));

  /** @type {goog.ui.ToolbarButton} */
  this.undoButton = cwc.ui.Helper.getIconToolbarButton('undo',
      'Undo last change.', this.editorUndo.bind(this));

  /** @type {goog.ui.ToolbarButton} */
  this.redoButton = cwc.ui.Helper.getIconToolbarButton('redo',
      'Redo last change.', this.editorRedo.bind(this));

  /** @type {goog.ui.ToolbarButton} */
  this.mediaButton = cwc.ui.Helper.getIconToolbarButton('perm_media',
      'Insert Image …', this.insertMedia.bind(this));

  /** @type {goog.ui.ToolbarToggleButton} */
  this.debugButton = cwc.ui.Helper.getIconToolbarToogleButton(
      'bug_report', 'Check Syntax', this.editorSetSyntaxCheck.bind(this));

  /** @type {goog.ui.ToolbarToggleButton} */
  this.autocompleteButton = cwc.ui.Helper.getIconToolbarToogleButton(
      'edit', 'Autocomplete', this.editorSetAutocomplete.bind(this));

  /** @type {goog.ui.ToolbarButton} */
  this.expandButton = cwc.ui.Helper.getIconToolbarButton('fullscreen',
      'Expand Code editor.', this.toggleExpand.bind(this));

  /** @type {!goog.ui.Select} */
  this.selectView = new goog.ui.Select();

  /** @type {number} */
  this.undoUsage = 0;

  /** @type {number} */
  this.redoUsage = 0;

  /** @type {string} */
  this.currentView = '';

  /** @type {boolean} */
  this.expandState = false;
};


/**
 * @param {Element} node
 * @param {Element} node_editor
 * @param {Element} node_select_view
 * @param {string=} opt_prefix
 */
cwc.ui.EditorToolbar.prototype.decorate = function(node, node_editor,
    node_select_view, opt_prefix) {
  this.node = node;
  this.nodeEditor = node_editor;
  this.nodeSelectView = node_select_view;
  this.undoUsage = 0;
  this.redoUsage = 0;

  this.prefix = (opt_prefix || '') + this.prefix;

  this.expandButton.addClassName('floaty_right');

  this.undoButton.setEnabled(false);
  this.redoButton.setEnabled(false);
  this.mediaButton.setEnabled(false);
  this.debugButton.setChecked(false);
  this.autocompleteButton.setChecked(false);

  this.selectView.setTooltip('Change view');
  this.selectView.render(this.nodeSelectView);

  this.nodeExpand = goog.dom.getElement(this.prefix + 'expand');
  this.nodeExpandExit = goog.dom.getElement(this.prefix + 'expand-exit');
  this.nodeMoreList = goog.dom.getElement(this.prefix + 'menu-more-list');
  this.nodeSave = goog.dom.getElement(this.prefix + 'save');

  goog.style.showElement(this.nodeExpandExit, false);

  // Events
  goog.events.listen(this.nodeExpand, goog.events.EventType.CLICK,
    this.expand.bind(this));
  goog.events.listen(this.nodeExpandExit, goog.events.EventType.CLICK,
    this.collapse.bind(this));
  goog.events.listen(this.nodeSave, goog.events.EventType.CLICK,
    this.save.bind(this));

  this.toolbar.setOrientation(goog.ui.Container.Orientation.HORIZONTAL);
  this.toolbar.addChild(this.saveButton, true);
  this.toolbar.addChild(this.undoButton, true);
  this.toolbar.addChild(this.redoButton, true);
  this.toolbar.addChild(this.mediaButton, true);
  this.toolbar.addChild(new goog.ui.ToolbarSeparator(), true);
  this.toolbar.addChild(this.debugButton, true);
  this.toolbar.addChild(this.autocompleteButton, true);
  this.toolbar.addChild(this.expandButton, true);
  this.toolbar.render(this.node);

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
    var item = cwc.ui.Helper.getMenuItem(name, opt_tooltip, func);
    this.nodeMoreList.appendChild(item);
    cwc.ui.Helper.mdlRefresh();
  }
};


/**
 * @param {!goog.ui.ToolbarButton} button
 * @param {boolean=} opt_seperator
 */
cwc.ui.EditorToolbar.prototype.addToolbarButton = function(button,
    opt_seperator) {
  this.toolbar.addChild(new goog.ui.ToolbarSeparator(), opt_seperator);
  this.toolbar.addChild(button, true);
};


/**
 * Saves the currently open file.
 */
cwc.ui.EditorToolbar.prototype.save = function() {
  var fileSaverInstance = this.helper.getInstance('fileSaver');
  if (fileSaverInstance) {
    fileSaverInstance.saveFile(true);
  }
};


/**
 * Undo change to the editor.
 */
cwc.ui.EditorToolbar.prototype.editorUndo = function() {
  var editorInstance = this.helper.getInstance('editor');
  if (editorInstance) {
    editorInstance.undoChange();
    this.undoUsage++;
    this.redoButton.setEnabled(this.undoUsage > this.redoUsage);
  }
};


/**
 * Redo change to the editor.
 */
cwc.ui.EditorToolbar.prototype.editorRedo = function() {
  var editorInstance = this.helper.getInstance('editor');
  if (editorInstance) {
    editorInstance.redoChange();
    this.redoUsage++;
    this.redoButton.setEnabled(this.undoUsage > this.redoUsage);
  }
};


/**
 * Enable or disable debug.
 */
cwc.ui.EditorToolbar.prototype.editorSetSyntaxCheck = function() {
  var editorInstance = this.helper.getInstance('editor');
  if (editorInstance) {
    var enable = this.debugButton.isChecked();
    editorInstance.setSyntaxCheck(enable);
    this.debugButton.enableClassName('icon_24px', !enable);
    this.debugButton.enableClassName('icon_24px_red', enable);
  }
};


/**
 * Enable or disable autocomplete.
 */
cwc.ui.EditorToolbar.prototype.editorSetAutocomplete = function() {
  var editorInstance = this.helper.getInstance('editor');
  if (editorInstance) {
    var enable = this.autocompleteButton.isChecked();
    editorInstance.setAutocomplete(enable);
    this.autocompleteButton.enableClassName('icon_24px', !enable);
    this.autocompleteButton.enableClassName('icon_24px_red', enable);
  }
};


/**
 * Change editor view.
 * @param {Event} event
 */
cwc.ui.EditorToolbar.prototype.editorChangeViewEvent = function(event) {
  this.editorChangeView(event.target.getValue());
};


/**
 * Change editor view.
 * @param {string} name
 */
cwc.ui.EditorToolbar.prototype.editorChangeView = function(name) {
  var editorInstance = this.helper.getInstance('editor');
  if (editorInstance && name) {
    this.currentView = name;
    editorInstance.changeView(name);
  }
};


/**
 * Insert a media.
 */
cwc.ui.EditorToolbar.prototype.insertMedia = function() {
  var editorInstance = this.helper.getInstance('editor');
  var libraryInstance = this.helper.getInstance('library');
  if (editorInstance && libraryInstance) {
    libraryInstance.showLibrary();
  }
};


/**
 * @param {boolean} enable
 */
cwc.ui.EditorToolbar.prototype.enableUndoButton = function(enable) {
  if (this.undoButton) {
    this.undoButton.setEnabled(enable);
  }
};


/**
 * @param {boolean} enable
 */
cwc.ui.EditorToolbar.prototype.enableMediaButton = function(enable) {
  if (this.mediaButton) {
    this.mediaButton.setEnabled(enable);
  }
};


/**
 * @param {boolean} has_files
 */
cwc.ui.EditorToolbar.prototype.updateMediaButton = function(has_files) {
  if (this.mediaButton) {
    this.mediaButton.enableClassName('icon_24px', has_files);
    this.mediaButton.enableClassName('icon_24px_grey', !has_files);
  }
};


/**
 * Updates the options for the toolbar depending on the editor mode.
 * @param {string} editor_mode
 */
cwc.ui.EditorToolbar.prototype.updateToolbar = function(editor_mode) {
  if (editor_mode == 'text/html' ||
      editor_mode == 'text/javascript' ||
      editor_mode == 'text/coffeescript') {
    this.debugButton.setEnabled(true);
  } else {
    var editorInstance = this.helper.getInstance('editor');
    if (editorInstance) {
      editorInstance.setSyntaxCheck(false);
    }
    this.debugButton.setEnabled(false);
  }
};


/**
 * Add editor view.
 * @param {!string} name
 * @export
 */
cwc.ui.EditorToolbar.prototype.addView = function(name) {
  var selectedView = new goog.ui.MenuItem(name);
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
  var layoutInstance = this.helper.getInstance('layout', true);
  if (layoutInstance) {
    layoutInstance.setFullscreen(expand);
    goog.style.showElement(this.nodeExpand, !expand);
    goog.style.showElement(this.nodeExpandExit, expand);
  }
};


/**
 * Shows/Hide the expand button.
 * @param {boolean} visible
 */
cwc.ui.EditorToolbar.prototype.showExpandButton = function(visible) {
  goog.style.showElement(this.nodeExpand, visible);
};
