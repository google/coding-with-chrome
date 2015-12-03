/**
 * @fileoverview Config Handler for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Config');

goog.require('cwc.utils.Helper');
goog.require('cwc.utils.Logger');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 */
cwc.ui.Config = function(helper) {
  /** @type {string} */
  this.name = 'Config';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.utils.Logger} */
  this.log = this.helper.getLogger();

  /** @type {boolean} */
  this.synced = false;

  /** @type {Object} */
  this.config = {};

  /** @type {string} */
  this.config_type = 'cwc-config';
};


/**
 * Loads the config from the chrome storage.
 */
cwc.ui.Config.prototype.loadConfig = function() {
  var sync_event = this.syncConfig.bind(this);
  this.log.info('Try to load synced config ...');
  chrome.storage.sync.get('settings', sync_event);
};


/**
 * Stores the local config to the chrome storage.
 */
cwc.ui.Config.prototype.saveConfig = function() {
  if (!this.config) {
    this.log.error('Config is empty!');
    return;
  }

  if (!goog.isObject(this.config)) {
    this.log.error('Local config is not an object!');
    return;
  }

  this.config['config_type'] = this.config_type;
  var save_event = this.savedConfig.bind(this);
  chrome.storage.sync.set({'settings': this.config}, save_event);
};


/**
 * Saved config handler.
 */
cwc.ui.Config.prototype.savedConfig = function() {
  var messageInstance = this.helper.getInstance('message');
  if (messageInstance) {
    if (chrome.runtime.lastError) {
      messageInstance.error('Unable to save config!');
    } else {
      messageInstance.info('Config was saved successfully.');
    }
  }
};


/**
 * Syncs the chrome storage config with the local config.
 *
 * @param {Object} config Config object from the chrome storage.
 */
cwc.ui.Config.prototype.syncConfig = function(config) {
  if (!config) {
    this.log.error('Config is empty!');
    return;
  }

  if (!goog.isObject(config)) {
    this.log.error('Config is not an object!');
    return;
  }

  var config_data = config['settings'];
  if (!config_data) {
    this.log.warn('Config data are empty!');
    return;
  } else if (!('config_type' in config_data)) {
    this.log.error('Config seems to be invalid!');
    return;
  }

  if (config_data['config_type'] != this.config_type) {
    this.log.error('Syncing config locally failed!');
    this.log.error(chrome.runtime.lastError);
    this.synced = false;
    return;
  }

  this.log.info('Synced config locally.');
  this.config = config_data;
  this.synced = true;
};


/**
 * Gets the value for the named config value.
 * @param {!string} name Name of the config entry.
 * @return {!string} Value of the config entry.
 */
cwc.ui.Config.prototype.get = function(name) {
  if (!name in this.config) {
    this.log.warn('Failed to get config entry ' + name + '!');
    return '';
  }

  var value = this.config[name];
  this.log.info('Get config entry ' + name + ': ' + value);
  return value;
};


/**
 * Sets the name and config inside the config.
 * @param {!string} name Unique name of for the config entry.
 * @param {string} value Value of the config entry.
 */
cwc.ui.Config.prototype.set = function(name, value) {
  if (!name) {
    this.log.warn('Can not store value without a name!');
    return;
  }

  this.synced = false;
  this.log.info('Set config entry ' + name + ': ' + value);
  this.config[name] = value;
  this.saveConfig();
};
