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

goog.require('cwc.ui.Helper');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.ui.BlocklyToolbar = function(helper) {
  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeBlockly = null;

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
  this.nodeUndo = null;

  /** @type {Element} */
  this.nodeRedo = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = 'toolbar-';

  /** @type {string} */
  this.generalPrefix = this.helper.getPrefix();

  /** @type {boolean} */
  this.expandState = false;
};


/**
 * @param {!Element} node
 * @param {!Element} node_blockly
 * @param {string=} opt_prefix
 */
cwc.ui.BlocklyToolbar.prototype.decorate = function(node,
    node_blockly, opt_prefix) {
  this.node = node;
  this.nodeBlockly = node_blockly;
  this.prefix = (opt_prefix || '') + this.prefix;

  this.nodeExpand = goog.dom.getElement(this.prefix + 'expand');
  this.nodeExpandExit = goog.dom.getElement(this.prefix + 'expand-exit');
  this.nodeMore = goog.dom.getElement(this.prefix + 'menu-more');
  this.nodeMoreList = goog.dom.getElement(this.prefix + 'menu-more-list');
  this.nodeRedo = goog.dom.getElement(this.prefix + 'redo');
  this.nodeSave = goog.dom.getElement(this.prefix + 'save');
  this.nodeUndo = goog.dom.getElement(this.prefix + 'undo');
  this.nodePublish = goog.dom.getElement(this.prefix + 'publish');

  goog.style.showElement(this.nodeExpandExit, false);
  goog.style.showElement(this.nodeMore, false);

  //cwc.ui.Helper.enableElement(this.nodeUndo, false);
  cwc.ui.Helper.enableElement(this.nodeRedo, false);

  // Events
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
  goog.events.listen(this.nodePublish, goog.events.EventType.CLICK,
    this.publish.bind(this));
};


/**
 * @param {!string} name
 * @param {!function()} func
 * @param {string=} opt_tooltip
 */
cwc.ui.BlocklyToolbar.prototype.addOption = function(name, func, opt_tooltip) {
  if (this.nodeMoreList) {
    var item = cwc.ui.Helper.getMenuItem(name, opt_tooltip, func);
    this.nodeMoreList.appendChild(item);
    goog.style.showElement(this.nodeMore, true);
    cwc.ui.Helper.mdlRefresh();
  }
};


/**
 * Saves the currently open file.
 */
cwc.ui.BlocklyToolbar.prototype.save = function() {
  var fileSaverInstance = this.helper.getInstance('fileSaver');
  if (fileSaverInstance) {
    fileSaverInstance.saveFile(true);
  }
};


/**
 * Undo change to the editor.
 */
cwc.ui.BlocklyToolbar.prototype.undo = function() {
  var blocklyInstance = this.helper.getInstance('blockly');
  if (blocklyInstance) {
    var history = blocklyInstance.undoChange();
    this.enableUndoButton(history['undo'] > 0);
    this.enableRedoButton(history['redo'] > 0);
  }
};


/**
 * Redo change to the editor.
 */
cwc.ui.BlocklyToolbar.prototype.redo = function() {
  var blocklyInstance = this.helper.getInstance('blockly');
  if (blocklyInstance) {
    var history = blocklyInstance.redoChange();
    this.enableUndoButton(history['undo'] > 0);
    this.enableRedoButton(history['redo'] > 0);
  }
};


/**
 * Publish file.
 */
cwc.ui.BlocklyToolbar.prototype.publish = function() {
  var fileExporterInstance = this.helper.getInstance('fileExporter');
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
 * Toggles the current expand state.
 */
cwc.ui.BlocklyToolbar.prototype.expand = function() {
  this.setExpand(true);
};


/**
 * Toggles the current expand state.
 */
cwc.ui.BlocklyToolbar.prototype.collapse = function() {
  this.setExpand(false);
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
 */
cwc.ui.BlocklyToolbar.prototype.setExpand = function(expand) {
  this.expandState = expand;
  var layoutInstance = this.helper.getInstance('layout', true);
  if (layoutInstance) {
    layoutInstance.setFullscreen(expand);
    goog.style.showElement(this.nodeExpand, !expand);
    goog.style.showElement(this.nodeExpandExit, expand);
  }
};
