/**
 * @fileoverview Basic modifications.
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
goog.provide('cwc.mode.basic.simple.Mod');

goog.require('cwc.mode.basic.Library');
goog.require('cwc.mode.basic.Preview');
goog.require('cwc.mode.basic.simple.Editor');
goog.require('cwc.mode.basic.simple.Layout');
goog.require('cwc.renderer.external.Simple');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.basic.simple.Mod = function(helper) {
  /** @type {cwc.mode.basic.simple.Layout} */
  this.layout = new cwc.mode.basic.simple.Layout(helper);

  /** @type {cwc.mode.basic.Library} */
  this.library = new cwc.mode.basic.Library(helper);

  /** @type {cwc.mode.basic.simple.Editor} */
  this.editor = new cwc.mode.basic.simple.Editor(helper);

  /** @type {cwc.mode.basic.Preview} */
  this.preview = new cwc.mode.basic.Preview(helper);

  /** @type {cwc.renderer.external.Simple} */
  this.renderer = new cwc.renderer.external.Simple(helper);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.basic.simple.Mod.prototype.decorate = function() {
  this.layout.decorate();
  this.library.decorate();
  this.editor.decorate();
  this.preview.decorate();
  this.preview.showConsole(true);
  this.renderer.init();
};
