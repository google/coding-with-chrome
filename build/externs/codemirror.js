/**
 * @fileoverview Code Mirror externs for Coding with Chrome.
 * @externs
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


/**
  * @param {Node} node
  * @constructor
  */
var CodeMirror = function(node) {};

/** @type {Object} */
CodeMirror.mimeModes = {};

/** @type {Function} */
CodeMirror.prototype.historySize = function() {};

/**
 * @param {string=} content
 * @constructor
 */
CodeMirror.Doc = function(content) {};

/** @type {Function} */
CodeMirror.Doc.prototype.isClean = function() {};

/** @type {Function} */
CodeMirror.Doc.prototype.setValue = function(value) {};

/** @type {Function} */
CodeMirror.Doc.prototype.getValue = function() {};

/** @type {Function} */
CodeMirror.Doc.prototype.historySize = function() {};

/** @type {Object} */
CodeMirror.fold = {};

/** @type {Function} */
CodeMirror.fold.combine = function() {};

/** @type {Function} */
CodeMirror.fold.brace = function() {};

/** @type {Function} */
CodeMirror.fold.comment = function() {};

/** @type {Function} */
CodeMirror.prototype.setOption = function() {};

/** @type {Function} */
CodeMirror.prototype.getOption = function() {};

/** @type {Function} */
CodeMirror.prototype.on = function() {};

/** @type {Function} */
CodeMirror.prototype.refresh = function() {};

/** @type {Function} */
CodeMirror.prototype.undo = function() {};

/** @type {Function} */
CodeMirror.prototype.redo = function() {};

/** @type {Function} */
CodeMirror.prototype.execCommand = function() {};

/** @type {Function} */
CodeMirror.prototype.getCursor = function() {};

/** @type {Function} */
CodeMirror.prototype.setCursor = function() {};

/** @type {Function} */
CodeMirror.prototype.getValue = function() {};

/** @type {Function} */
CodeMirror.prototype.replaceSelection = function() {};

/** @type {Function} */
CodeMirror.prototype.swapDoc = function() {};

/** @type {Function} */
CodeMirror.prototype.setSize = function() {};

/** @type {Function} */
CodeMirror.prototype.showHint = function() {};

/** @type {Function} */
CodeMirror.prototype.foldCode = function() {};

/** @type {Function} */
CodeMirror.prototype.setGutterMarker = function() {};

/** @type {Object} */
CodeMirror.lineInfo = function() {};

/** @type {Object} */
CodeMirror.lineInfo.prototype.gutterMarkers = null;

/** @type {Object} */
CodeMirror.hint = {};

/** @type {Function} */
CodeMirror.hint.html = function() {};

/** @type {Function} */
CodeMirror.hint.javascript = function() {};


/** @type {Object} */
var coffeelint = function() {};

/** @type {Object} */
var CSSLint = function() {};

/** @type {Object} */
var HTMLHint = function() {};

/** @type {Object} */
var JSHINT = function() {};

/** @type {Object} */
var jsonlint = function() {};

/** @type {Object} */
var jsyaml = function() {};
