/**
 * @fileoverview Sphero modifications.
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
goog.provide('cwc.mode.sphero.classic.advanced.Mod');

goog.require('cwc.mode.default.Mod');
goog.require('cwc.mode.sphero.Hints');
goog.require('cwc.mode.sphero.Monitor');
goog.require('cwc.mode.sphero.Runner');
goog.require('cwc.mode.sphero.classic.Connection');
goog.require('cwc.renderer.external.Sphero');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.sphero.classic.advanced.Mod = function(helper) {
  /** @type {!cwc.mode.default.Mod} */
  this.mod = new cwc.mode.default.Mod(helper);

  /** @type {!cwc.mode.sphero.Connection} */
  this.connection = new cwc.mode.sphero.classic.Connection(helper);

  /** @type {!cwc.mode.sphero.Monitor} */
  this.monitor = new cwc.mode.sphero.Monitor(helper, this.connection);

  /** @type {!cwc.renderer.external.Sphero} */
  this.renderer = new cwc.renderer.external.Sphero(helper);

  /** @type {!cwc.mode.sphero.Runner} */
  this.runner = new cwc.mode.sphero.Runner(helper, this.connection);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.sphero.classic.advanced.Mod.prototype.decorate = function() {
  this.mod.setConnection(this.connection);
  this.mod.setMonitor(this.monitor);
  this.mod.setRenderer(this.renderer);
  this.mod.setRunner(this.runner);
  this.mod.decorate();
  this.mod.editor.setLocalHints(cwc.mode.sphero.Hints);
};
