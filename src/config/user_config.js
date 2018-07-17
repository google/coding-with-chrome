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

goog.require('cwc.utils.Database');
goog.require('cwc.utils.Logger');


/**
 * @enum {string}
 */
cwc.userConfigType = {
  BLOCKLY: 'blockly',
  EDITOR: 'editor',
  GENERAL: 'general',
  MODULE: 'module',
};


/**
 * @enum {string}
 */
cwc.userConfigName = {
  ADVANCED_MODE: 'advanced_mode',
  AUTO_COMPLETE: 'auto_complete',
  COFFEESCRIPT: 'coffeescript',
  DEBUG_MODE: 'debug_mode',
  EXPERIMENTAL_MODE: 'experimental_mode',
  FULLSCREEN: 'fullscreen',
  HTML5: 'html5',
  JAVASCRIPT: 'javascript',
  LANGUAGE: 'language',
  LEGO: 'lego',
  MAKEBLOCK: 'makeblock',
  PENCIL_CODE: 'pencil_code',
  PYTHON: 'python',
  SKIP_WELCOME: 'skip_welcome',
  SPHERO: 'sphero',
  WORKBENCH_FETCH: 'workbench_fetch',
  ZOOM: 'zoom',
};


/**
 * @constructor
 * @struct
 * @final
 */
cwc.UserConfig = function() {
  /** @type {string} */
  this.name = 'User Config';

  /** @private {Object} */
  this.cache_ = new Map();

  /** @private {!cwc.utils.Database} */
  this.database_ = new cwc.utils.Database(this.name)
    .setObjectStoreName('__general__');

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * @return {THIS}
 * @template THIS
 */
cwc.UserConfig.prototype.prepare = async function() {
  await this.database_.open();
  await this.syncCache_();
  return this;
};


/**
 * Gets the value for the named config value.
 * @param {!cwc.userConfigType|string} type Type of the config entry.
 * @param {!cwc.userConfigName|string} name Name of the config entry.
 * @return {string|boolean|null} Value of the config entry.
 */
cwc.UserConfig.prototype.get = function(type, name) {
  return this.cache_.get(type + '_' + name);
};


/**
 * Gets the value for the named config type.
 * @param {!cwc.userConfigType|string} type Type of the config entry.
 * @return {Object} Values of the config entry.
 */
cwc.UserConfig.prototype.getAll = function(type) {
  let result = new Map();
  for (let [key, value] of this.cache_) {
    if (key && String(key).startsWith(type)) {
      result.set(key.replace(type + '_', ''), value);
    }
  }
  return result;
};


/**
 * Sets the name and config inside the config.
 * @param {!cwc.userConfigType|string} type Type of the config entry.
 * @param {!cwc.userConfigName|string} name Unique name of for the config entry.
 * @param {string} value Value of the config entry.
 */
cwc.UserConfig.prototype.set = function(type, name, value) {
  this.cache_.set(type + '_' + name, value);
  this.database_.set(type + '_' + name, value);
};


/**
 * @private
 * @return {Promise}
 */
cwc.UserConfig.prototype.syncCache_ = function() {
  return new Promise((resolve, reject) => {
    this.log_.info('Syncing with local cache ...');
    this.database_.getAllWithKeys().then((result) => {
      this.cache_ = result;
      this.log_.info('Synced', result.size, 'entries');
      resolve();
    }, reject);
  });
};
