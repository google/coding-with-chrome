/**
 * @fileoverview Infobar of the Code Editor.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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
goog.provide('cwc.ui.EditorInfobar');

goog.require('cwc.soy.ui.EditorInfobar');
goog.require('cwc.ui.Helper');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.ui.EditorInfobar = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('editor-infobar');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeLineText = null;

  /** @type {Element} */
  this.nodeMode = null;

  /** @type {Element} */
  this.nodeModes = null;

  /** @type {Element} */
  this.nodeModeSelect = null;

  /** @type {Element} */
  this.nodeModeText = null;
};


/**
 * @param {Element} node
 */
cwc.ui.EditorInfobar.prototype.decorate = function(node) {
  this.node = node;

  goog.soy.renderElement(
      this.node,
      cwc.soy.ui.EditorInfobar.template, {
        prefix: this.prefix,
        modes: CodeMirror.mimeModes || {},
      }
  );

  this.nodeLineText = goog.dom.getElement(this.prefix +'line-text');
  this.nodeMode = goog.dom.getElement(this.prefix + 'mode');
  this.nodeModeSelect = goog.dom.getElement(this.prefix + 'mode-select');
  this.nodeModeText = goog.dom.getElement(this.prefix +'mode-text');
  this.nodeModes = goog.dom.getElement(this.prefix + 'modes');

  // Decorate editor mode select.
  goog.events.listen(this.nodeModes, goog.events.EventType.CLICK,
    this.handleModeChange_, false, this);
};


/**
 * Enables/Disables the editor type like "text/javascript" inside the info bar.
 * @param {boolean} enable
 */
cwc.ui.EditorInfobar.prototype.enableModeSelect = function(enable) {
  if (this.nodeModeSelect) {
    cwc.ui.Helper.enableElement(this.nodeModeSelect, enable);
  }
};


/**
 * Shows/Hide the editor type like "text/javascript" inside the info bar.
 * @param {boolean} visible
 */
cwc.ui.EditorInfobar.prototype.showMode = function(visible) {
  if (this.nodeMode) {
    goog.style.setElementShown(this.nodeMode, visible);
  }
};


/**
 * @param {!string} text
 */
cwc.ui.EditorInfobar.prototype.setMode = function(text) {
  if (this.nodeModeText) {
    this.nodeModeText.textContent = text;
  }
};


/**
 * @param {!Object} position
 */
cwc.ui.EditorInfobar.prototype.setLineInfo = function(position) {
  if (this.nodeLineText) {
    this.nodeLineText.textContent = 'Line ' + (position['line'] + 1) +
      ', Column ' + (position['ch'] + 1);
  }
};


/**
 * @param {Object} e
 * @private
 */
cwc.ui.EditorInfobar.prototype.handleModeChange_ = function(e) {
  let editorInstance = this.helper.getInstance('editor');
  if (editorInstance) {
    editorInstance.setEditorMode(e.target.firstChild.data);
  }
};
