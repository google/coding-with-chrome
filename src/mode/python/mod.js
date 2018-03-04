/**
 * @fileoverview Python modifications.
 *
 * @license Copyright 2016 Google Inc. All Rights Reserved.
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
goog.provide('cwc.mode.python.Mod');

goog.require('cwc.mode.default.Mod');
goog.require('cwc.renderer.external.Python');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.python.Mod = function(helper) {
  /** @type {!cwc.mode.default.Mod} */
  this.mod = new cwc.mode.default.Mod(helper);

  /** @type {cwc.renderer.external.Python} */
  this.renderer = new cwc.renderer.external.Python(helper);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.python.Mod.prototype.decorate = function() {
  this.mod.setRenderer(this.renderer);
  this.mod.decorate();
  this.mod.preview.showConsole(true);
};
