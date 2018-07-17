/**
 * @fileoverview Coffeescript modifications.
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
goog.provide('cwc.mode.coffeescript.Mod');

goog.require('cwc.mode.default.Mod');
goog.require('cwc.renderer.internal.Coffeescript');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.coffeescript.Mod = function(helper) {
  /** @type {!cwc.mode.default.Mod} */
  this.mod = new cwc.mode.default.Mod(helper);

  /** @type {!cwc.renderer.internal.Coffeescript} */
  this.renderer = new cwc.renderer.internal.Coffeescript(helper);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.coffeescript.Mod.prototype.decorate = async function() {
  this.mod.setRenderer(this.renderer);
  await this.mod.decorate();
};
