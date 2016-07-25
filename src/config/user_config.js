/**
 * @fileoverview General config for Coding in Chrome.
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
goog.provide('cwc.userConfig');
goog.provide('cwc.userConfigName');
goog.provide('cwc.userConfigType');


/**
 * @enum {string}
 */
cwc.userConfigName = {
  SKIP_WELCOME: 'skip_welcome',
  ADVANCED_MODE: 'advanced_mode',
  DEBUG_MODE: 'debug_mode',
  FULLSCREEN: 'fullscreen',
  LANGUAGE: 'language',
  ZOOM: 'zoom'
};


/**
 * @enum {string}
 */
cwc.userConfigType = {
  GENERAL: 'general',
  BLOCKLY: 'blockly'
};



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.userConfig = function(helper) {
  /** @type {string} */
  this.name = 'User Config';

  /** @type {string} */
  this.prefix = 'user__config__';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @private {!cwc.utils.Logger} */
  this.log_ = this.helper.getLogger();

  /** @private {!cwc.utils.Storage} */
  this.storage_ = this.helper.getInstance('storage', true);

  /** @type {!boolean} */
  this.syncChrome = false;
};


/**
 * Gets the value for the named config value.
 * @param {!cwc.userConfigType|string} type Type of the config entry.
 * @param {!cwc.userConfigName|string} name Name of the config entry.
 * @return {!string} Value of the config entry.
 */
cwc.userConfig.prototype.get = function(type, name) {
  return this.storage_.get(name, this.prefix + type);
};


/**
 * Sets the name and config inside the config.
 * @param {!cwc.userConfigType|string} type Type of the config entry.
 * @param {!cwc.userConfigName|string} name Unique name of for the config entry.
 * @param {string} value Value of the config entry.
 */
cwc.userConfig.prototype.set = function(type, name, value) {
  this.storage_.set(name, value, this.prefix + type);
};
