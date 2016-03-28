/**
 * @fileoverview Toolbar of the Blockly Editor.
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
goog.provide('cwc.ui.BlocklyToolbar');

goog.require('cwc.ui.Helper');

goog.require('goog.ui.Container');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.PopupMenu');
goog.require('goog.ui.Toolbar');
goog.require('goog.ui.ToolbarButton');
goog.require('goog.ui.ToolbarSeparator');



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

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.generalPrefix = this.helper.getPrefix();

  /** @type {goog.ui.Toolbar} */
  this.toolbar = new goog.ui.Toolbar();

  /** @type {goog.ui.ToolbarButton} */
  this.saveButton = cwc.ui.Helper.getIconToolbarButton('save',
      'Save the project', this.blocklySave.bind(this));

  /** @type {goog.ui.ToolbarButton} */
  this.expandButton = cwc.ui.Helper.getIconToolbarButton('fullscreen',
      'Expand Code editor.', this.toggleExpand.bind(this));

  /** @type {goog.ui.ToolbarButton} */
  this.moreButton = cwc.ui.Helper.getIconToolbarButton('more_vert',
      'More options …');

  /** @type {goog.ui.PopupMenu} */
  this.moreMenu = new goog.ui.PopupMenu();

  /** @type {boolean} */
  this.expand = false;
};


/**
 * @param {!Element} node
 * @param {!Element} node_blockly
 */
cwc.ui.BlocklyToolbar.prototype.decorate = function(node,
    node_blockly) {
  this.node = node;
  this.nodeBlockly = node_blockly;

  this.moreButton.addClassName('floaty_right');
  this.expandButton.addClassName('floaty_right');

  this.toolbar.setOrientation(goog.ui.Container.Orientation.HORIZONTAL);
  this.toolbar.addChild(this.saveButton, true);
  this.toolbar.addChild(this.moreButton, true);
  this.toolbar.addChild(this.expandButton, true);
  this.toolbar.render(this.node);

  this.moreMenu.attach(this.moreButton.getElement(),
      goog.positioning.Corner.BOTTOM_START);
  this.moreMenu.setToggleMode(true);
  this.moreButton.setVisible(false);
  this.moreMenu.render();
};


/**
 * @param {!string} name
 * @param {!function()} func
 * @param {string=} opt_tooltip
 */
cwc.ui.BlocklyToolbar.prototype.addOption = function(name, func,
    opt_tooltip) {
  var newOption = new goog.ui.MenuItem(name);
  this.moreMenu.addChild(newOption, true);
  if (!this.moreButton.isVisible()) {
    this.moreButton.setVisible(true);
  }

  goog.events.listen(newOption, goog.ui.Component.EventType.ACTION,
      func, false, this);
};


/**
 * @param {!goog.ui.ToolbarButton} button
 * @param {boolean=} opt_seperator
 */
cwc.ui.BlocklyToolbar.prototype.addToolbarButton = function(button,
    opt_seperator) {
  this.toolbar.addChild(new goog.ui.ToolbarSeparator(), opt_seperator);
  this.toolbar.addChild(button, true);
};


/**
 * Saves the currently open file.
 */
cwc.ui.BlocklyToolbar.prototype.blocklySave = function() {
  var fileSaverInstance = this.helper.getInstance('fileSaver');
  if (fileSaverInstance) {
    fileSaverInstance.saveFile(true);
  }
};


/**
 * Toggles the current expand state.
 */
cwc.ui.BlocklyToolbar.prototype.toggleExpand = function() {
  this.expand = !this.expand;
  this.setExpand(this.expand);
};


/**
 * Expands or collapses the current window.
 * @param {boolean} expand
 */
cwc.ui.BlocklyToolbar.prototype.setExpand = function(expand) {
  var layoutInstance = this.helper.getInstance('layout', true);
  layoutInstance.setFullscreen(expand);
  this.expandButton.setTooltip((expand ? 'Collapse' : 'Expand') +
      ' Blockly editor.');
  this.expandButton.setContent('fullscreen' + (expand ? '_exit' : ''));
};
