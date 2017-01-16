/**
 * @fileoverview Show an debug screen for simple testing.
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
goog.provide('cwc.ui.Experimental');

goog.require('cwc.config.Experimental');
goog.require('cwc.utils.Helper');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 */
cwc.ui.Experimental = function(helper) {
  /** @type {string} */
  this.name = 'Experimental';

  /** @type {!boolean} */
  this.enabled = false;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;
};


/**
 * Prepares the debug screen.
 */
cwc.ui.Experimental.prototype.prepare = function() {
  var userConfigInstance = this.helper.getInstance('userConfig');
  if (userConfigInstance) {
    this.enabled = userConfigInstance.get(cwc.userConfigType.GENERAL,
        cwc.userConfigName.EXPERIMENTAL_MODE) || false;
  }
  console.log('Experimental mode:', this.enabled);
};


/**
 * @param {string=} opt_name
 * @return {!boolean}
 * @export
 */
cwc.ui.Experimental.prototype.isEnabled = function(opt_name) {
  if (!opt_name) {
    return this.enabled;
  }

  var name = opt_name || 'ENABLED';
  if (name in cwc.config.Experimental) {
    return cwc.config.Experimental[name];
  }
  return false;
};
