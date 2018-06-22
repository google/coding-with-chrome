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
goog.provide('cwc.ui.Debug');

goog.require('cwc.config.Debug');
goog.require('cwc.utils.Logger');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 */
cwc.ui.Debug = function(helper) {
  /** @type {string} */
  this.name = 'Debug';

  /** @type {boolean} */
  this.enabled = false;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Prepares the debug screen.
 */
cwc.ui.Debug.prototype.prepare = function() {
  let userConfigInstance = this.helper.getInstance('userConfig');
  if (userConfigInstance) {
    this.enabled = userConfigInstance.get(cwc.userConfigType.GENERAL,
        cwc.userConfigName.DEBUG_MODE) || false;
  }
  this.log_.info('Enabled:', this.enabled);

  if (!this.enabled) {
    return;
  }

  // Show Developer Tools for native application.
  if (typeof window['nw'] !== 'undefined') {
    this.log_.info('Show developer tools...');
    window['nw']['Window']['get']()['showDevTools']();
  }
};


/**
 * @param {string=} optName
 * @return {boolean}
 * @export
 */
cwc.ui.Debug.prototype.isEnabled = function(optName) {
  if (!optName) {
    return this.enabled;
  }

  let name = optName || 'ENABLED';
  if (name in cwc.config.Debug) {
    return cwc.config.Debug[name];
  }
  return false;
};
