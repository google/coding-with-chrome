/**
 * @fileoverview Text modifications.
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
goog.provide('cwc.mode.json.Mod');

goog.require('cwc.mode.json.Editor');
goog.require('cwc.mode.json.Layout');
goog.require('cwc.utils.Helper');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.json.Mod = function(helper) {
  /** @type {cwc.mode.json.Layout} */
  this.layout = new cwc.mode.json.Layout(helper);

  /** @type {cwc.mode.json.Editor} */
  this.editor = new cwc.mode.json.Editor(helper);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.json.Mod.prototype.decorate = function() {
  this.layout.decorate();
  this.editor.decorate();
};
