/**
 * @fileoverview Layout for the Arduino modification.
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
  var layoutInstance = this.helper.getInstance('layout', true);
  layoutInstance.decorateSimpleTwoColumnLayout(500);

  goog.soy.renderElement(
      layoutInstance.getNode('content-left'),
      cwc.soy.mode.Arduino.editor,
      {'prefix': this.helper.getPrefix('arduino-editor')}
  );

  goog.soy.renderElement(
      layoutInstance.getNode('content-right'),
      cwc.soy.mode.Arduino.runner,
      {'prefix': this.helper.getPrefix('arduino-runner')}
  );

};
