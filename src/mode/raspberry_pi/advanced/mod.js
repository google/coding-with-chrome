/**
 * @fileoverview Raspberry Pi modifications.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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
goog.provide('cwc.mode.raspberryPi.advanced.Mod');

goog.require('cwc.mode.raspberryPi.Connection');
goog.require('cwc.mode.raspberryPi.Monitor');
goog.require('cwc.mode.raspberryPi.Runner');
goog.require('cwc.mode.raspberryPi.advanced.Editor');
goog.require('cwc.mode.raspberryPi.advanced.Layout');
goog.require('cwc.renderer.external.RaspberryPi');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.raspberryPi.advanced.Mod = function(helper) {
  /** @type {!cwc.mode.raspberryPi.Connection} */
  this.connection = new cwc.mode.raspberryPi.Connection(helper);

  /** @type {!cwc.mode.raspberryPi.Monitor} */
  this.monitor = new cwc.mode.raspberryPi.Monitor(helper);

  /** @type {!cwc.mode.raspberryPi.advanced.Editor} */
  this.editor = new cwc.mode.raspberryPi.advanced.Editor(helper);

  /** @type {!cwc.mode.raspberryPi.Runner} */
  this.runner = new cwc.mode.raspberryPi.Runner(helper, this.connection);

  /** @type {!cwc.mode.raspberryPi.advanced.Layout} */
  this.layout = new cwc.mode.raspberryPi.advanced.Layout(helper);

  /** @type {!cwc.renderer.external.RaspberryPi} */
  this.renderer = new cwc.renderer.external.RaspberryPi(helper);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.raspberryPi.advanced.Mod.prototype.decorate = function() {
  this.connection.init();
  this.layout.decorate();
  this.editor.decorate();
  this.runner.decorate();
  this.monitor.decorate();
  this.renderer.init();
};
