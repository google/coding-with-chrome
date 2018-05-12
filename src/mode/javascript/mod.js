/**
 * @fileoverview JavaScript modifications.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
 * @author carheden@google.com (Adam Carheden)
 */
goog.provide('cwc.mode.javascript.Mod');

goog.require('cwc.mode.default.Mod');
goog.require('cwc.renderer.internal.Javascript');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.javascript.Mod = function(helper) {
  /** @type {!cwc.mode.default.Mod} */
  this.mod = new cwc.mode.default.Mod(helper);

  /** @type {!cwc.renderer.internal.Javascript} */
  this.renderer = new cwc.renderer.internal.Javascript(helper);
};


/**
 * Decorates the different parts of the modification.
 * @async
 */
cwc.mode.javascript.Mod.prototype.decorate = async function() {
  this.mod.setRenderer(this.renderer);
  await this.mod.decorate();
};
