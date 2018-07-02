/**
 * @fileoverview Lego WeDo 2.0 modifications.
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
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.provide('cwc.mode.lego.weDo2.Mod');

goog.require('cwc.mode.default.Mod');
goog.require('cwc.mode.lego.weDo2.Connection');
goog.require('cwc.mode.lego.weDo2.Monitor');
goog.require('cwc.renderer.external.lego.WeDo2');
goog.require('cwc.soy.lego.weDo2.Blocks');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @param {boolean=} enableBlockly
 */
cwc.mode.lego.weDo2.Mod = function(helper, enableBlockly = false) {
  /** @type {boolean} */
  this.enableBlockly = enableBlockly;

  /** @type {!cwc.mode.lego.weDo2.Connection} */
  this.connection = new cwc.mode.lego.weDo2.Connection(helper);

  /** @type {!cwc.mode.default.Mod} */
  this.mod = new cwc.mode.default.Mod(helper);

  /** @type {!cwc.mode.makeblock.mbot.Monitor} */
  this.monitor = new cwc.mode.lego.weDo2.Monitor(helper, this.connection);

  /** @type {!cwc.renderer.external.WEDO2} */
  this.renderer = new cwc.renderer.external.lego.WeDo2(helper);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.lego.weDo2.Mod.prototype.decorate = function() {
  if (this.enableBlockly) {
    this.mod.enableBlockly(cwc.soy.lego.weDo2.Blocks.toolbox);
  }
  this.mod.setConnection(this.connection);
  this.mod.setRenderer(this.renderer);
  this.mod.decorate();
  this.mod.message.decorateMonitor(this.monitor);
};
