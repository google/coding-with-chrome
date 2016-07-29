/**
 * @fileoverview Editor Flags of the Code Editor.
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
goog.provide('cwc.ui.EditorFlags');

goog.require('cwc.config.interpreter');



/**
 * @constructor
 * @struct
 */
cwc.ui.EditorFlags = function() {
  /** @private {Object} */
  this.flags_ = {};
};


/**
 * @param {!string} name
 * @return {string}
 */
cwc.ui.EditorFlags.prototype.getFlag = function(name) {
  if (name in this.flags_) {
    return this.flags_[name];
  }
  return '';
};


/**
 * @param {!string} name
 * @param {!string} value
 */
cwc.ui.EditorFlags.prototype.setFlag = function(name, value) {
  console.log('setFlag: ' + name + ':' + value);
  this.flags_[name] = value;
};


/**
 * @param {!string} value
 */
cwc.ui.EditorFlags.prototype.setDebugFlag = function(value) {
  this.setFlag('editor.debug', value);
};


/**
 * @return {string}
 */
cwc.ui.EditorFlags.prototype.getDebugFlag = function() {
  return this.getFlag('editor.debug');
};


/**
 * @param {!cwc.config.interpreter.Flag.LOAD} value
 */
cwc.ui.EditorFlags.prototype.setLoadFlag = function(value) {
  this.setFlag('interpreter.load', value);
};


/**
 * @return {cwc.config.interpreter.Flag.LOAD}
 */
cwc.ui.EditorFlags.prototype.getLoadFlag = function() {
  return this.getFlag('interpreter.load');
};
