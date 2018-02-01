/**
 * @fileoverview Default Message panel.
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
goog.provide('cwc.mode.default.Message');

goog.require('cwc.ui.Message');
goog.require('cwc.utils.Helper');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.mode.default.Message = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.ui.Message} */
  this.message = new cwc.ui.Message(this.helper);
};


/**
 * Decorates the editor.
 */
cwc.mode.default.Message.prototype.decorate = function() {
  this.helper.setInstance('message', this.message);
  this.message.decorate();
};


/**
 * @return {!cwc.ui.Editor}
 */
cwc.mode.default.Message.prototype.getMessage = function() {
  return this.message;
};
