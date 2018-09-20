/**
 * @fileoverview AIY modifications.
 *
 * @license Copyright 2018 Google Inc. All Rights Reserved.
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
 * @author fstanis@google.com (Filip Stanis)
 */
goog.provide('cwc.mode.aiy.Mod');

goog.require('cwc.mode.default.Mod');
goog.require('cwc.renderer.external.AIY');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.aiy.Mod = function(helper) {
  /** @type {!cwc.mode.default.Mod} */
  this.mod = new cwc.mode.default.Mod(helper);

  /** @type {!cwc.renderer.external.AIY} */
  this.renderer = new cwc.renderer.external.AIY(helper);
};


/**
 * Decorates the different parts of the modification.
 * @async
 */
cwc.mode.aiy.Mod.prototype.decorate = async function() {
  this.mod.setRenderer(this.renderer);
  await this.mod.decorate();
  this.mod.terminal.showTerminal(true);
};
