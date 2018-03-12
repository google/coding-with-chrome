/**
 * @fileoverview Arduino modifications.
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
goog.provide('cwc.mode.arduino.Mod');

goog.require('cwc.mode.arduino.Connect');
goog.require('cwc.mode.arduino.Editor');
goog.require('cwc.mode.arduino.Layout');
goog.require('cwc.mode.arduino.Runner');
goog.require('cwc.renderer.external.Arduino');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.arduino.Mod = function(helper) {
  /** @type {!cwc.mode.arduino.Connect} */
  this.connect = new cwc.mode.arduino.Connect(helper);

  /** @type {!cwc.mode.arduino.Editor} */
  this.editor = new cwc.mode.arduino.Editor(helper);

  /** @type {!cwc.mode.arduino.Layout} */
  this.layout = new cwc.mode.arduino.Layout(helper);

  /** @type {!cwc.renderer.external.Arduino} */
  this.renderer = new cwc.renderer.external.Arduino(helper);

  /** @type {!cwc.mode.arduino.Runner} */
  this.runner = new cwc.mode.arduino.Runner(helper);
};


/**
 * Decorates the different parts of the modification.
 */
cwc.mode.arduino.Mod.prototype.decorate = function() {
  this.layout.decorate();
  this.editor.decorate();
  this.runner.decorate();
  this.renderer.init();
  this.connect.init();
};
