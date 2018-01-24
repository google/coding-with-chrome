/**
 * @fileoverview Layout for the Raspberry Pi modification.
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
goog.provide('cwc.mode.raspberryPi.advanced.Layout');

goog.require('cwc.soy.mode.raspberryPi.advanced');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 */
cwc.mode.raspberryPi.advanced.Layout = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;
};


/**
 * Decorates the Raspberry Pi layout.
 */
cwc.mode.raspberryPi.advanced.Layout.prototype.decorate = function() {
  let layoutInstance = this.helper.getInstance('layout', true);
  layoutInstance.decorateDefault();
  layoutInstance.setFixRightComponentSize(400);
  layoutInstance.setHandleSize(1);
  layoutInstance.renderMainContent(cwc.soy.mode.raspberryPi.advanced.editor);
  layoutInstance.renderRightContent(cwc.soy.mode.raspberryPi.advanced.runner);
};
