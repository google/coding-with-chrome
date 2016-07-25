/**
 * @fileoverview Storage handler.
 *
 * @license Copyright 2016 The Coding with Chrome Authors.
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
goog.provide('cwc.utils.Storage');
goog.provide('cwc.utils.StorageCustom');
goog.provide('cwc.utils.StorageType');

goog.require('cwc.utils.Features');
goog.require('cwc.utils.Logger');

goog.require('goog.object');


/**
 * @enum {!string}
 * @export
 */
cwc.utils.StorageType = {
  LOCAL_STORAGE: 'local_storage',
  SESSION_STORAGE: 'session_storage',
  CHROME_STORAGE: 'chrome_storage',
  CWC_STORAGE: 'cwc_storage',
  NONE: ''
};



/**
 * @constructor
 */
cwc.utils.StorageCustom = function() {
  /** @type {object} */
  this.storage_ = {};
};


/**
 * @param {string} keys
 * @param {function(object)=} opt_callback
 * @return {object}
 * @export
 */
cwc.utils.StorageCustom.prototype.get = function(keys, opt_callback) {
  var result = {};
  if (!keys) {
    result = this.storage_;
  } else if (this.storage_[keys]) {
    result[keys] = this.storage_[keys];
  }
  if (opt_callback) {
    opt_callback(result);
  }
  return result;
};


/**
 * @param {object} items
 * @param {function(object)=} opt_callback
 * @export
 */
cwc.utils.StorageCustom.prototype.set = function(items, opt_callback) {
  goog.object.extend(this.storage_, items);
  if (opt_callback) {
    opt_callback();
  }
};


/**
 * @export
 */
cwc.utils.StorageCustom.prototype.clear = function() {
  this.storage_ = {};
};


/**
 * @param {cwc.utils.StorageType=} opt_storage_type
 * @constructor
 * @final
 * @export
 */
cwc.utils.Storage = function(opt_storage_type) {

  /** @type {!string} */
  this.name = 'Storage';

  /** @private {!cwc.utils.LogLevel} */
  this.loglevel_ = cwc.utils.LogLevel.NOTICE;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.loglevel_, this.name);

  /** @private {!cwc.utils.Features} */
  this.features_ = new cwc.utils.Features();

  /** @private {localStorage|sessionStorage} */
  this.storage_ = null;

  /** @private {!cwc.utils.StorageType} */
  this.storageType_ = opt_storage_type || this.getStorageType();

  /** @private {string} */
  this.prefix_ = 'cwc__storage__';

  /** @private {string} */
  this.defaultType_ = '__default__';

  /** @type {!boolean} */
  this.syncChrome = false;
};


/**
 * @param {Function=} opt_callback
 * @return {!cwc.utils.Storage}
 */
cwc.utils.Storage.prototype.prepare = function(opt_callback) {

  this.log_.info('Preparing', this.storageType_, 'storage ...');
  switch (this.storageType_) {
    case cwc.utils.StorageType.LOCAL_STORAGE:
      this.storage_ = localStorage;
      break;
    case cwc.utils.StorageType.SESSION_STORAGE:
      this.storage_ = sessionStorage;
      this.log_.warn('Only un-synced sessionStorage is supported!');
      break;
    case cwc.utils.StorageType.CHROME_STORAGE:
      this.storage_ = sessionStorage;
      this.syncChrome = true;
      this.loadChromeStorage(null, opt_callback);
      break;
    default:
      this.log_.warn('Local storage is unsupported !');
  }

  if (opt_callback &&
      this.storageType_ !== cwc.utils.StorageType.CHROME_STORAGE) {
    opt_callback(this);
  }

  return this;
};


/**
 * @return {!cwc.utils.StorageType}
 * @export
 */
cwc.utils.Storage.prototype.getStorageType = function() {
  if (this.features_.getBrowserFeature('localStorage')) {
    return cwc.utils.StorageType.LOCAL_STORAGE;
  } else if (this.features_.getBrowserFeature('sessionStorage')) {
    if (this.features_.getChromeFeature('storage.localStorage')) {
      return cwc.utils.StorageType.CHROME_STORAGE;
    } else {
      return cwc.utils.StorageType.SESSION_STORAGE;
    }
  }
  return cwc.utils.StorageType.NONE;
};


/**
 * Loads user config from local Chrome storage.
 * @param {string=} opt_type
 * @param {Function=} opt_callback
 */
cwc.utils.Storage.prototype.loadChromeStorage = function(opt_type,
    opt_callback) {
  var storageKeyName = opt_type ? this.getKeyname('', opt_type) : null;
  var callback = function(data) {
    this.handleLoadChromeStorage_(data, storageKeyName, opt_callback);
  };
  chrome.storage.local.get(storageKeyName, callback.bind(this));
};


/**
 * Converts the local Chrome storage to session storage.
 * @param {!Object} data
 * @param {string=} opt_storage_key
 * @param {Function=} opt_callback
 * @private
 */
cwc.utils.Storage.prototype.handleLoadChromeStorage_ = function(data,
    opt_storage_key, opt_callback) {
  for (let storageKey in data) {
    if ((opt_storage_key && storageKey == opt_storage_key) ||
        (!opt_storage_key && storageKey.startsWith(this.prefix_))) {
      if (goog.isObject(data[storageKey])) {
        this.log_.info('Syncing', data[storageKey].length,
          'items to session storage.');
        for (let item in data[storageKey]) {
          this.storage_.setItem(storageKey + item, data[storageKey][item]);
        }
      } else {
        this.log_.info('Syncing', storageKey, 'to session storage.');
        this.storage_.setItem(storageKey, data[storageKey]);
      }
    }
  }
  if (opt_callback) {
    opt_callback(this);
  }
};


/**
 * @param {!string} type Type of the storage entry.
 * Converts the sessions storage to the local Chrome storage.
 */
cwc.utils.Storage.prototype.saveChromeStorage = function(type) {
  var data = {};
  var storageLength = this.storage_.length;
  var storageKeyName = this.getKeyname('', type);
  this.log_.info('Syncing', type, 'elements to Chrome storage.');
  for (let i = 0; i < storageLength; i++) {
    var sessionKey = this.storage_.key(i);
    if (sessionKey.includes(storageKeyName)) {
      var storageKey = sessionKey.replace(storageKeyName, '');
      data[storageKey] = this.storage_.getItem(sessionKey);
    }
  }
  var dataObject = {};
  dataObject[storageKeyName] = data;
  chrome.storage.local.set(dataObject);
};


/**
 * @param {string=} opt_type
 * @param {string=} opt_name
 * @return {!string} The key name
 */
cwc.utils.Storage.prototype.getKeyname = function(opt_name, opt_type) {
  var type = opt_type || this.defaultType_;
  return this.prefix_ + type + '__' + opt_name;
};


/**
 * Gets the value for the named storage value.
 * @param {!string} name Name of the storage entry.
 * @param {string=} opt_type Type of the storage entry.
 * @return {!string} Value of the storage entry.
 */
cwc.utils.Storage.prototype.get = function(name, opt_type) {
  var type = opt_type || this.defaultType_;
  if (!type || !name) {
    this.log_.warn('Can\'t get value without a type and name!');
    return;
  }
  if (!this.storage_) {
    return null;
  }
  var keyName = this.getKeyname(name, type);
  var keyValue = this.storage_.getItem(keyName);
  this.log_.info('Gets item', keyName, ':', keyValue);
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
 * @param {!string} name Name of the storage entry.
 * @param {string} value Value of the config entry.
 * @param {string=} opt_type Type of the storage entry.
 */
cwc.utils.Storage.prototype.set = function(name, value, opt_type) {
  var type = opt_type || this.defaultType_;
  if (!type || !name) {
    this.log_.warn('Can\'t store value without a type and name!');
    return;
  }
  if (!this.storage_) {
    this.log_.warn('No storage available!');
    return;
  }
  var keyName = this.getKeyname(name, type);
  if (value == this.storage_.getItem(keyName)) {
    return;
  }
  this.storage_.setItem(keyName, value);
  this.log_.info('Sets item', keyName, ':', value);
  if (this.syncChrome) {
    this.saveChromeStorage(type);
  }
};


/**
 * Removes the named entry.
 * @param {!string} name Name of the storage entry.
 * @param {string=} opt_type Type of the storage entry.
 */
cwc.utils.Storage.prototype.remove = function(name, opt_type) {
  var type = opt_type || this.defaultType_;
  if (!type || !name) {
    this.log_.warn('Can\'t remove entry without a type and name!');
    return;
  }
  if (!this.storage_) {
    this.log_.warn('No storage available!');
    return;
  }
  var keyName = this.getKeyname(name, type);
  this.storage_.removeItem(keyName);
  this.log_.info('Remove item', keyName);
  if (this.syncChrome) {
    this.saveChromeStorage(type);
  }
};
