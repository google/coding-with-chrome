/**
 * @fileoverview Layout for the Arduino modification.
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
goog.provide('cwc.mode.arduino.Layout');

goog.require('cwc.soy.mode.Arduino');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.arduino.Layout = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;
};


/**
 * Decorates the Arduino layout.
 */
cwc.mode.arduino.Layout.prototype.decorate = function() {
  let layoutInstance = this.helper.getInstance('layout', true);
  layoutInstance.decorateDefault(500);
  layoutInstance.renderMainContent(
    cwc.soy.mode.Arduino.editor, this.helper.getPrefix('arduino-editor'));
  layoutInstance.renderRightContent(
    cwc.soy.mode.Arduino.runner, this.helper.getPrefix('arduino-runner'));
};
