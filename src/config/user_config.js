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
goog.provide('cwc.UserConfig');
goog.provide('cwc.userConfigName');
goog.provide('cwc.userConfigType');


/**
 * @enum {string}
 */
cwc.userConfigName = {
  ADVANCED_MODE: 'advanced_mode',
  COFFEESCRIPT: 'coffeescript',
  DEBUG_MODE: 'debug_mode',
  EV3: 'ev3',
  EXPERIMENTAL_MODE: 'experimental_mode',
  FULLSCREEN: 'fullscreen',
  HTML5: 'html5',
  JAVASCRIPT: 'javascript',
  LANGUAGE: 'language',
  MBOT_BLUE: 'mbot_blue',
  MBOT_RANGER: 'mbot_ranger',
  PENCIL_CODE: 'pencil_code',
  PYTHON: 'python',
  SKIP_WELCOME: 'skip_welcome',
  SPHERO: 'sphero',
  ZOOM: 'zoom',
};


/**
 * @enum {string}
 */
cwc.userConfigType = {
  BLOCKLY: 'blockly',
  GENERAL: 'general',
  MODULE: 'module',
};


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.UserConfig = function(helper) {
  /** @type {string} */
  this.name = 'User Config';

  /** @type {string} */
  this.prefix = 'user__config__';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

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
cwc.UserConfig.prototype.get = function(type, name) {
  return this.storage_.get(name, this.prefix + type);
};


/**
 * Gets the value for the named config type.
 * @param {!cwc.userConfigType|string} type Type of the config entry.
 * @return {!Object} Values of the config entry.
 */
cwc.UserConfig.prototype.getAll = function(type) {
  return this.storage_.getAll(this.prefix + type);
};


/**
 * Sets the name and config inside the config.
 * @param {!cwc.userConfigType|string} type Type of the config entry.
 * @param {!cwc.userConfigName|string} name Unique name of for the config entry.
 * @param {string} value Value of the config entry.
 */
cwc.UserConfig.prototype.set = function(type, name, value) {
  this.storage_.set(name, value, this.prefix + type);
};
