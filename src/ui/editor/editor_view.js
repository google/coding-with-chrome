/**
 * @fileoverview Editor View of the Code Editor.
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
goog.provide('cwc.ui.EditorView');

goog.require('cwc.ui.EditorFlags');
goog.require('cwc.ui.EditorType');



/**
 * @constructor
 * @struct
 * @param {string=} opt_content
 * @param {cwc.ui.EditorType=} opt_type
 * @param {cwc.ui.EditorFlags=} opt_flags
 * @final
 */
cwc.ui.EditorView = function(opt_content, opt_type, opt_flags) {
  /** @type {!CodeMirror.Doc} */
  this.doc = new CodeMirror.Doc(opt_content || '');

  /** @type {!cwc.ui.EditorType} */
  this.type = opt_type || cwc.ui.EditorType.UNKNOWN;

  /** @type {!cwc.ui.EditorFlags} */
  this.flags = opt_flags || new cwc.ui.EditorFlags();

  this.cursorPosition = null;
};


/**
 * @return {!CodeMirror.Doc}
 */
cwc.ui.EditorView.prototype.getDoc = function() {
  return this.doc;
};


/**
 * @param {!string} name
 * @return {string}
 */
cwc.ui.EditorView.prototype.getFlag = function(name) {
  return this.flags.getFlag(name);
};


/**
 * Returns whether the document is currently clean.
 * @return {boolean}
 */
cwc.ui.EditorView.prototype.isClean = function() {
  return this.doc.isClean();
};


/**
 * Sets the current editor content.
 * @param {!string} content
 */
cwc.ui.EditorView.prototype.setContent = function(content) {
  this.doc.setValue(content);
};


/**
 * Gets the current editor content.
 * @return {string}
 */
cwc.ui.EditorView.prototype.getContent = function() {
  return this.doc.getValue();
};


/**
 * Sets the current editor content type.
 * @param {!cwc.ui.EditorType} type
 */
cwc.ui.EditorView.prototype.setType = function(type) {
  this.type = type;
};


/**
 * Gets the current editor content type.
 * @return {cwc.ui.EditorType}
 */
cwc.ui.EditorView.prototype.getType = function() {
  return this.type;
};
