/**
 * @fileoverview Editor View of the Code Editor.
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
goog.provide('cwc.ui.EditorView');

goog.require('cwc.ui.EditorFlags');
goog.require('cwc.ui.EditorHint');
goog.require('cwc.ui.EditorType');


/**
 * @constructor
 * @struct
 * @param {string=} content
 * @param {cwc.ui.EditorType=} type
 * @param {cwc.ui.EditorHint=} hints
 * @param {cwc.ui.EditorFlags=} flags
 * @final
 */
cwc.ui.EditorView = function(content, type, hints, flags) {
  /** @type {!CodeMirror.Doc} */
  this.doc = new CodeMirror.Doc(content || '');

  /** @type {!cwc.ui.EditorType} */
  this.type = type || cwc.ui.EditorType.UNKNOWN;

  /** @type {!cwc.ui.EditorHint} */
  this.hints = hints || cwc.ui.EditorHint.UNKNOWN;

  /** @type {!cwc.ui.EditorFlags} */
  this.flags = flags || new cwc.ui.EditorFlags();

  /** @type {number} */
  this.cursorPosition = 0;
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
 * Sets the current editor content hints.
 * @param {!cwc.ui.EditorHint} hints
 */
cwc.ui.EditorView.prototype.setHints = function(hints) {
  this.hints = hints;
};


/**
 * Gets the current editor content hints.
 * @return {cwc.ui.EditorHint}
 */
cwc.ui.EditorView.prototype.getHints = function() {
  return this.hints;
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
