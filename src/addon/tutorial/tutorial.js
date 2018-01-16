/**
 * @fileoverview Tutorial addon.
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
goog.provide('cwc.addon.Tutorial');
goog.require('cwc.utils.Logger');



/**
 * @constructor
 * @struct
 * @final
 */
cwc.addon.Tutorial = function() {
  /** @type {!string} */
  this.name = 'Tutorial';

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


cwc.addon.Tutorial.prototype.prepare = function() {
  this.log_.info('Preparing addon', name);
};


cwc.addon.Tutorial.prototype.decorate = function() {

};
