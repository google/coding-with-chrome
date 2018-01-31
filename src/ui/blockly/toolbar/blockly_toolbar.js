/**
 * @fileoverview Toolbar of the Blockly Editor.
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
goog.provide('cwc.ui.BlocklyToolbar');

goog.require('cwc.soy.ui.BlocklyToolbar');
goog.require('cwc.ui.Helper');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.ui.BlocklyToolbar = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('blockly-toolbar');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeExpand = null;

  /** @type {Element} */
  this.nodeExpandExit = null;

  /** @type {Element} */
  this.nodeLibrary = null;

  /** @type {Element} */
  this.nodeMedia = null;

  /** @type {Element} */
  this.nodeMore = null;

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

  /** @type {Element} */
  this.nodeVariable = null;

  /** @type {boolean} */
  this.expandState = false;
};


/**
 * @param {!Element} node
 */
cwc.ui.BlocklyToolbar.prototype.decorate = function(node) {
  this.node = node;

  // Render blockly toolbar.
  goog.soy.renderElement(
    this.node,
    cwc.soy.ui.BlocklyToolbar.template, {
      experimental: this.helper.experimentalEnabled(),
      prefix: this.prefix,
    }
  );

  this.nodeExpand = goog.dom.getElement(this.prefix + 'expand');
  this.nodeExpandExit = goog.dom.getElement(this.prefix + 'expand-exit');
  this.nodeLibrary = goog.dom.getElement(this.prefix + 'library');
  this.nodeMedia = goog.dom.getElement(this.prefix + 'media');
  this.nodeMore = goog.dom.getElement(this.prefix + 'menu-more');
  this.nodeMoreList = goog.dom.getElement(this.prefix + 'menu-more-list');
  this.nodeRedo = goog.dom.getElement(this.prefix + 'redo');
  this.nodeSave = goog.dom.getElement(this.prefix + 'save');
  this.nodeUndo = goog.dom.getElement(this.prefix + 'undo');
  this.nodeVariable = goog.dom.getElement(this.prefix + 'variable');

  cwc.ui.Helper.enableElement(this.nodeRedo, false);

  goog.style.setElementShown(this.nodeExpandExit, false);
  goog.style.setElementShown(this.nodeMore, false);
  goog.style.setElementShown(this.nodeMedia, false);

  if (this.helper.experimentalEnabled()) {
    this.nodePublish = goog.dom.getElement(this.prefix + 'publish');
    goog.events.listen(this.nodePublish, goog.events.EventType.CLICK,
      this.publish.bind(this));
  }

  // Events
  goog.events.listen(this.nodeExpand, goog.events.EventType.CLICK,
    this.expand.bind(this));
  goog.events.listen(this.nodeExpandExit, goog.events.EventType.CLICK,
    this.collapse.bind(this));
  goog.events.listen(this.nodeLibrary, goog.events.EventType.CLICK,
    this.showLibrary.bind(this));
  goog.events.listen(this.nodeMedia, goog.events.EventType.CLICK,
    this.insertMedia.bind(this));
  goog.events.listen(this.nodeRedo, goog.events.EventType.CLICK,
    this.redo.bind(this));
  goog.events.listen(this.nodeSave, goog.events.EventType.CLICK,
    this.save.bind(this));
  goog.events.listen(this.nodeUndo, goog.events.EventType.CLICK,
    this.undo.bind(this));
  goog.events.listen(this.nodeVariable, goog.events.EventType.CLICK,
    this.createVariable.bind(this));
};


/**
 * @param {!string} name
 * @param {!function()} func
 * @param {string=} opt_tooltip
 */
cwc.ui.BlocklyToolbar.prototype.addOption = function(name, func, opt_tooltip) {
  if (this.nodeMoreList) {
    let item = cwc.ui.Helper.getMenuItem(name, opt_tooltip, func);
    this.nodeMoreList.appendChild(item);
    goog.style.setElementShown(this.nodeMore, true);
    cwc.ui.Helper.mdlRefresh();
  }
};


/**
 * Create a new variable.
 */
cwc.ui.BlocklyToolbar.prototype.createVariable = function() {
  let blocklyInstance = this.helper.getInstance('blockly');
  if (blocklyInstance) {
    blocklyInstance.createVariable();
  }
};


/**
 * Saves the currently open file.
 */
cwc.ui.BlocklyToolbar.prototype.save = function() {
  let fileSaverInstance = this.helper.getInstance('fileSaver');
  if (fileSaverInstance) {
    fileSaverInstance.saveFile(true);
  }
};


/**
 * Undo change to the editor.
 */
cwc.ui.BlocklyToolbar.prototype.undo = function() {
  let blocklyInstance = this.helper.getInstance('blockly');
  if (blocklyInstance) {
    let history = blocklyInstance.undoChange();
    this.enableUndoButton(history['undo'] > 0);
    this.enableRedoButton(history['redo'] > 0);
  }
};


/**
 * Redo change to the editor.
 */
cwc.ui.BlocklyToolbar.prototype.redo = function() {
  let blocklyInstance = this.helper.getInstance('blockly');
  if (blocklyInstance) {
    let history = blocklyInstance.redoChange();
    this.enableUndoButton(history['undo'] > 0);
    this.enableRedoButton(history['redo'] > 0);
  }
};


/**
 * Insert a media.
 */
cwc.ui.BlocklyToolbar.prototype.insertMedia = function() {
  let blocklyInstance = this.helper.getInstance('blockly');
  let libraryInstance = this.helper.getInstance('library');
  if (blocklyInstance && libraryInstance) {
    libraryInstance.showLibrary();
  }
};


/**
 * Publish file.
 */
cwc.ui.BlocklyToolbar.prototype.publish = function() {
  let fileExporterInstance = this.helper.getInstance('fileExporter');
  fileExporterInstance.exportHtmlToGoogleCloud();
};


/**
 * @param {boolean} enable
 */
cwc.ui.BlocklyToolbar.prototype.enableUndoButton = function(enable) {
  cwc.ui.Helper.enableElement(this.nodeUndo, enable);
};


/**
 * @param {boolean} enable
 */
cwc.ui.BlocklyToolbar.prototype.enableRedoButton = function(enable) {
  cwc.ui.Helper.enableElement(this.nodeRedo, enable);
};


/**
 * @param {boolean} enable
 */
cwc.ui.BlocklyToolbar.prototype.enableMediaButton = function(enable) {
  if (this.nodeMedia) {
    cwc.ui.Helper.enableElement(this.nodeMedia, enable);
  }
};


/**
 * @param {boolean} enable
 */
cwc.ui.BlocklyToolbar.prototype.showLibraryButton = function(enable) {
  if (this.nodeLibrary) {
    goog.style.setElementShown(this.nodeLibrary, enable);
  }
};


/**
 * @param {boolean} enable
 */
cwc.ui.BlocklyToolbar.prototype.showMediaButton = function(enable) {
  if (this.nodeMedia) {
    goog.style.setElementShown(this.nodeMedia, enable);
  }
};


/**
 * Insert a media.
 */
cwc.ui.BlocklyToolbar.prototype.showLibrary = function() {
  let editorInstance = this.helper.getInstance('editor');
  let libraryInstance = this.helper.getInstance('library');
  if (editorInstance && libraryInstance) {
    libraryInstance.showLibrary();
  }
};


/**
 * @param {boolean} has_files
 */
cwc.ui.BlocklyToolbar.prototype.updateLibraryButton = function(has_files) {
  if (this.nodeMedia) {
    goog.dom.classlist.enable(this.nodeMedia, 'icon_24px', has_files);
    goog.dom.classlist.enable(this.nodeMedia, 'icon_24px_grey', !has_files);
  }
};


/**
 * Toggles the current expand state.
 * @param {goog.events.EventLike} e
 */
cwc.ui.BlocklyToolbar.prototype.expand = function(e) {
  this.setExpand(true, e.target.closest('.goog-splitpane-second-container'));
};


/**
 * Toggles the current expand state.
 * @param {goog.events.EventLike} e
 */
cwc.ui.BlocklyToolbar.prototype.collapse = function(e) {
  this.setExpand(false, e.target.closest('.goog-splitpane-second-container'));
};


/**
 * Toggles the current expand state.
 */
cwc.ui.BlocklyToolbar.prototype.toggleExpand = function() {
  this.setExpand(!this.expandState);
};


/**
 * Expands or collapses the current window.
 * @param {boolean} expand
 * @param {boolean=} invert
 */
cwc.ui.BlocklyToolbar.prototype.setExpand = function(expand, invert = false) {
  this.expandState = expand;
  let layoutInstance = this.helper.getInstance('layout', true);
  if (layoutInstance) {
    if (invert) {
      layoutInstance.setFullscreen(expand, 0);
    } else {
      layoutInstance.setFullscreen(expand);
    }
    goog.style.setElementShown(this.nodeExpand, !expand);
    goog.style.setElementShown(this.nodeExpandExit, expand);
  }
};
