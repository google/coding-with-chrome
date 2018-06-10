/**
 * @fileoverview Status Bar for the Coding with Chrome editor.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
goog.provide('cwc.ui.StatusBar');

goog.require('cwc.soy.StatusBar');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');

goog.require('goog.dom');
goog.require('goog.soy');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.StatusBar = function(helper) {
  /** @type {string} */
  this.name = 'Status Bar';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('status-bar');

  /** @type {Element} */
  this.node = null;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix, this);

  /** @type {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Decorates the given node and adds the status bar.
 * @param {Element} node The target node to add the status bar.
 */
cwc.ui.StatusBar.prototype.decorate = function(node) {
  this.log_.info('Decorate into', node);
  this.node = node;

  goog.soy.renderElement(
    this.node,
    cwc.soy.StatusBar.template, {
      prefix: this.prefix,
      editor_modes: this.getEditorModes_(),
    }
  );

  // Render Terminal button
  let terminalInstance = this.helper.getInstance('terminal');
  let nodeTerminalButton = goog.dom.getElement(this.prefix + 'terminal-button');
  if (nodeTerminalButton && terminalInstance) {
    terminalInstance.decorateButton(nodeTerminalButton);
  }

  // Events.
  this.events_.listen('editor-modes', goog.events.EventType.CLICK,
    this.handleEditorModeChange_);
};


/**
 * Enables/Disables the editor type like "text/javascript" inside the info bar.
 * @param {boolean} enable
 */
cwc.ui.StatusBar.prototype.enableEditorModeSelect = function(enable) {
  this.enable_('editor-modes', enable);
};


/**
 * Shows/Hide the editor type like "text/javascript" inside the info bar.
 * @param {boolean} visible
 */
cwc.ui.StatusBar.prototype.showEditorMode = function(visible) {
  this.show_('editor-mode', visible);
};


/**
 * @param {!string} text
 */
cwc.ui.StatusBar.prototype.setEditorMode = function(text) {
  this.setText_('editor-mode-text', text);
};


/**
 * @return {!Array}
 * @private
 */
cwc.ui.StatusBar.prototype.getEditorModes_ = function() {
  let modeBlacklist = {
    'application/x-javascript': true,
    'application/x-json': true,
    'text/javascript': true,
    'text/x-coffeescript': true,
    'text-xml': true,
  };

  // Filter valid modes.
  let modes = [];
  for (let mode in CodeMirror.mimeModes) {
    if (Object.prototype.hasOwnProperty.call(CodeMirror.mimeModes, mode) &&
        !modeBlacklist[mode]) {
      modes.push(mode);
    }
  }
  return modes.sort();
};


/**
 * @param {!string} name
 * @param {!string} text
 * @private
 */
cwc.ui.StatusBar.prototype.setText_ = function(name, text) {
  let node = goog.dom.getElement(this.prefix + name);
  if (node) {
    node.firstChild.nodeValue = text;
  }
};


/**
 * @param {!string} name
 * @param {!boolean} visible
 * @private
 */
cwc.ui.StatusBar.prototype.show_ = function(name, visible) {
  let node = goog.dom.getElement(this.prefix + name);
  if (node) {
    goog.style.setElementShown(node, visible);
  }
};


/**
 * @param {!string} name
 * @param {!boolean} enable
 * @private
 */
cwc.ui.StatusBar.prototype.enable_ = function(name, enable) {
  let node = goog.dom.getElement(this.prefix + name);
  if (node) {
    cwc.ui.Helper.enableElement(node, enable);
  }
};


/**
 * @param {Object} e
 * @private
 */
cwc.ui.StatusBar.prototype.handleEditorModeChange_ = function(e) {
  let editorInstance = this.helper.getInstance('editor');
  if (editorInstance) {
    editorInstance.setEditorMode(e.target.firstChild.data);
  }
};
