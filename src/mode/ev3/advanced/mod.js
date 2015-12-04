/**
 * @fileoverview EV3 modifications.
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
goog.provide('cwc.mode.ev3.advanced.Mod');

goog.require('cwc.mode.ev3.Connection');
goog.require('cwc.mode.ev3.Monitor');
goog.require('cwc.mode.ev3.Runner');
goog.require('cwc.mode.ev3.advanced.Editor');
goog.require('cwc.mode.ev3.advanced.Layout');
goog.require('cwc.renderer.external.EV3');



/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.ev3.advanced.Mod = function(helper) {
  /** @type {cwc.mode.ev3.Connection} */
  this.connection = new cwc.mode.ev3.Connection(helper);

  /** @type {cwc.mode.ev3.advanced.Editor} */
  this.editor = new cwc.mode.ev3.advanced.Editor(helper);

  /** @type {cwc.mode.ev3.Layout} */
  this.layout = new cwc.mode.ev3.advanced.Layout(helper);

  /** @type {cwc.mode.ev3.Monitor} */
  this.monitor = new cwc.mode.ev3.Monitor(helper,
      this.bluetoothSocket);

  /** @type {cwc.renderer.external.EV3} */
  this.renderer = new cwc.renderer.external.EV3(helper);

  /** @type {cwc.mode.ev3.Runner} */
  this.runner = new cwc.mode.ev3.Runner(helper,
      this.bluetoothSocket);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.ev3.advanced.Mod.prototype.decorate = function() {
  this.connection.init();
  this.layout.decorate();
  this.editor.decorate();
  this.monitor.decorate();
  this.runner.decorate();
  this.renderer.init();
};
