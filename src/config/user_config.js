/**
 * @fileoverview General config for Coding in Chrome.
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
  FULLSCREEN: 'fullscreen'
};


/**
 * @enum {string}
 */
cwc.userConfigType = {
  GENERAL: 'general'
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

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @private {!cwc.utils.Logger} */
  this.log_ = this.helper.getLogger();

  /** @private {localStorage|sessionStorage} */
  this.storage_ = null;

  /** @type {!boolean} */
  this.syncChrome = false;
};


/**
 * Preparing User config.
 * @param {Function=} opt_callback
 */
cwc.userConfig.prototype.prepare = function(opt_callback) {
  this.log_.info('Prepare user config …');
  if (this.helper.checkBrowserFeature('localStorage')) {
    this.storage_ = localStorage;
  } else if (this.helper.checkBrowserFeature('sessionStorage')) {
    this.storage_ = sessionStorage;
    if (this.helper.checkChromeFeature('localStorage')) {
      this.syncChrome = true;
      this.loadChromeStorage(opt_callback);
    } else {
      this.log_.warn('Only un-synced sessionStorage is supported!');
    }
  } else {
    this.log_.warn('Local storage is unsupported !');
  }
  if (!this.syncChrome && opt_callback) {
    opt_callback();
  }
};


/**
 * Loads user config from local Chrome storage.
 * @param {Function=} opt_callback
 */
cwc.userConfig.prototype.loadChromeStorage = function(opt_callback) {
  var callback = function(data) {
    this.handleLoadChromeStorage_(data, opt_callback);
  };
  chrome.storage.local.get('settings', callback.bind(this));
};


/**
 * Converts the local Chrome storage to session storage.
 * @param {Object} data
 * @param {Function=} opt_callback
 * @private
 */
cwc.userConfig.prototype.handleLoadChromeStorage_ = function(data,
    opt_callback) {
  var userData = data['settings'];
  this.log_.info('Syncing', userData, 'elements to session storage.');
  for (var key in userData) {
    this.storage_.setItem(key, userData[key]);
  }
  if (opt_callback) {
    opt_callback();
  }
};


/**
 * Converts the sessions storage to the local Chrome storage.
 */
cwc.userConfig.prototype.saveChromeStorage = function() {
  var data = {};
  var storageLength = this.storage_.length;
  this.log_.info('Syncing', storageLength, 'elements to Chrome storage.');
  for (var i = 0; i < storageLength; i++) {
    var sessionKey = this.storage_.key(i);
    data[sessionKey] = this.storage_.getItem(sessionKey);
  }
  chrome.storage.local.set({'settings': data});
};


/**
 * Gets the value for the named config value.
 * @param {!cwc.userConfigType|string} type Type of the config entry.
 * @param {!cwc.userConfigName|string} name Name of the config entry.
 * @return {!string} Value of the config entry.
 */
cwc.userConfig.prototype.get = function(type, name) {
  if (!type || !name) {
    this.log_.warn('Can\'t get value without a type and name!');
    return;
  }
  if (!this.storage_) {
    return null;
  }
  var keyName = type + '__' + name;
  var keyValue = this.storage_.getItem(keyName);
  this.log_.info('Get user config for', keyName, ':', keyValue);
  switch (keyValue) {
    case 'true':
      return true;
    case 'false':
      return false;
  }
  return keyValue;
};


/**
 * Sets the name and config inside the config.
 * @param {!cwc.userConfigType|string} type Type of the config entry.
 * @param {!cwc.userConfigName|string} name Unique name of for the config entry.
 * @param {string} value Value of the config entry.
 */
cwc.userConfig.prototype.set = function(type, name, value) {
  if (!type || !name) {
    this.log_.warn('Can\'t store value without a type and name!');
    return;
  }
  if (!this.storage_) {
    return;
  }
  var keyName = type + '__' + name;
  if (value == this.storage_.getItem(keyName)) {
    return;
  }
  this.storage_.setItem(keyName, value);
  this.log_.info('Set user config for', keyName, ':', value);
  if (this.syncChrome) {
    this.saveChromeStorage();
  }
};
