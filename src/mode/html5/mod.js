/**
 * @fileoverview HTML5 modifications.
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
goog.provide('cwc.mode.html5.Mod');

goog.require('cwc.mode.html5.Editor');
goog.require('cwc.mode.html5.Layout');
goog.require('cwc.mode.html5.Preview');
goog.require('cwc.renderer.internal.HTML5');
goog.require('cwc.utils.Helper');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.html5.Mod = function(helper) {
  /** @type {cwc.mode.html5.Editor} */
  this.editor = new cwc.mode.html5.Editor(helper);

  /** @type {cwc.mode.html5.Layout} */
  this.layout = new cwc.mode.html5.Layout(helper);

  /** @type {cwc.mode.html5.Preview} */
  this.preview = new cwc.mode.html5.Preview(helper);

  /** @type {cwc.renderer.internal.HTML5} */
  this.renderer = new cwc.renderer.internal.HTML5(helper);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.html5.Mod.prototype.decorate = function() {
  this.layout.decorate();
  this.editor.decorate();
  this.preview.decorate();
  this.renderer.init();
};
