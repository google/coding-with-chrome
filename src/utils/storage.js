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
  NONE: '',
};


/**
 * @constructor
 */
cwc.utils.StorageCustom = function() {
  /** @type {Object} */
  this.storage_ = {};
};


/**
 * @param {string} keys
 * @param {Function=} optCallback
 * @return {Object}
 * @export
 */
cwc.utils.StorageCustom.prototype.get = function(keys, optCallback) {
  let result = {};
  if (!keys) {
    result = this.storage_;
  } else if (this.storage_[keys]) {
    result[keys] = this.storage_[keys];
  }
  if (optCallback) {
    optCallback(result);
  }
  return result;
};


/**
 * @param {Object} items
 * @param {Function=} optCallback
 * @export
 */
cwc.utils.StorageCustom.prototype.set = function(items, optCallback) {
  goog.object.extend(this.storage_, items);
  if (optCallback) {
    optCallback();
  }
};


/**
 * @export
 */
cwc.utils.StorageCustom.prototype.clear = function() {
  this.storage_ = {};
};


/**
 * @param {cwc.utils.StorageType=} storageType
 * @constructor
 * @final
 * @export
 */
cwc.utils.Storage = function(storageType = cwc.utils.StorageType.NONE) {
  /** @type {!string} */
  this.name = 'Storage';

  /** @private {!cwc.utils.LogLevel} */
  this.loglevel_ = cwc.utils.LogLevel.NOTICE;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.loglevel_, this.name);

  /** @private {!Object} */
  this.storage_ = {};

  /** @private {!cwc.utils.StorageType} */
  this.storageType_ = storageType || this.getStorageType();

  /** @private {string} */
  this.prefix_ = 'cwc__storage__';

  /** @private {string} */
  this.defaultType_ = '__default__';

  /** @type {!boolean} */
  this.syncChrome = false;
};


/**
 * @param {Function=} optCallback
 * @return {!cwc.utils.Storage}
 */
cwc.utils.Storage.prototype.prepare = function(optCallback) {
  this.log_.info('Preparing', this.storageType_, 'storage ...');
  switch (this.storageType_) {
    case cwc.utils.StorageType.LOCAL_STORAGE:
      if (localStorage) {
        this.storage_ = localStorage;
      } else {
        this.log_.error('Local storage is undefined!');
      }
      break;
    case cwc.utils.StorageType.SESSION_STORAGE:
      if (sessionStorage) {
        this.storage_ = sessionStorage;
      } else {
        this.log_.error('Session storage is undefined!');
      }
      this.log_.warn('Only un-synced sessionStorage is supported!');
      break;
    case cwc.utils.StorageType.CHROME_STORAGE:
      if (sessionStorage) {
        this.storage_ = sessionStorage;
      } else {
        this.log_.error('Sessions storage is undefined!');
      }
      this.syncChrome = true;
      this.loadChromeStorage(undefined, optCallback);
      break;
    default:
      this.log_.warn('Local storage is unsupported !');
  }

  if (optCallback &&
      this.storageType_ !== cwc.utils.StorageType.CHROME_STORAGE) {
    optCallback(this);
  }

  return this;
};


/**
 * @return {!cwc.utils.StorageType}
 * @export
 */
cwc.utils.Storage.prototype.getStorageType = function() {
  if ((typeof chrome === 'undefined' || (
       typeof chrome !== 'undefined' &&
       typeof chrome.storage === 'undefined')) &&
      typeof localStorage !== 'undefined') {
    return cwc.utils.StorageType.LOCAL_STORAGE;
  } else if (typeof sessionStorage !== 'undefined') {
    if (typeof chrome !== 'undefined' &&
        typeof chrome.storage !== 'undefined' &&
        typeof chrome.storage.local !== 'undefined') {
      return cwc.utils.StorageType.CHROME_STORAGE;
    } else {
      return cwc.utils.StorageType.SESSION_STORAGE;
    }
  }
  return cwc.utils.StorageType.NONE;
};


/**
 * Loads user config from local Chrome storage.
 * @param {string=} optType
 * @param {Function=} optCallback
 */
cwc.utils.Storage.prototype.loadChromeStorage = function(optType,
    optCallback) {
  this.log_.info('Loading Chrome storage ...');
  let storageKey = optType ? this.getKeyname('', optType) : null;
  let callback = function(data) {
    this.handleLoadChromeStorage_(data, storageKey, optCallback);
  };
  chrome.storage.local.get(storageKey, callback.bind(this));
};


/**
 * Converts the local Chrome storage to session storage.
 * @param {!Object} data
 * @param {string=} storageKey
 * @param {Function=} optCallback
 * @private
 */
cwc.utils.Storage.prototype.handleLoadChromeStorage_ = function(data,
    storageKey = '', optCallback) {
  for (let key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      if ((storageKey && key == storageKey) ||
          (!storageKey && key.startsWith(this.prefix_))) {
        if (goog.isObject(data[key])) {
          this.log_.info('Syncing', data[key].length, key,
            'items to session storage.');
          for (let item in data[key]) {
            if (Object.prototype.hasOwnProperty.call(data[key], item)) {
              this.storage_.setItem(key + item, data[key][item]);
            }
          }
        } else {
          this.log_.info('Syncing', key, 'to session storage.');
          this.storage_.setItem(key, data[key]);
        }
      }
    }
  }
  if (optCallback) {
    optCallback(this);
  }
};


/**
 * @param {!string} type Type of the storage entry.
 * Converts the sessions storage to the local Chrome storage.
 */
cwc.utils.Storage.prototype.saveChromeStorage = function(type) {
  let data = {};
  let storageLength = this.storage_.length;
  let storageKeyName = this.getKeyname('', type);
  this.log_.info('Syncing', storageLength, type, 'elements to Chrome storage.');
  for (let i = 0; i < storageLength; i++) {
    let sessionKey = this.storage_.key(i);
    if (sessionKey.includes(storageKeyName)) {
      let storageKey = sessionKey.replace(storageKeyName, '');
      data[storageKey] = this.storage_.getItem(sessionKey);
    }
  }
  let dataObject = {};
  dataObject[storageKeyName] = data;
  chrome.storage.local.set(dataObject);
};


/**
 * @param {string=} name
 * @param {string=} type
 * @return {!string} The key name
 */
cwc.utils.Storage.prototype.getKeyname = function(name = '', type = '') {
  return this.getTypename(type || this.defaultType_) + '__' + name;
};


/**
 * @param {string=} type
 * @return {!string} The type name
 */
cwc.utils.Storage.prototype.getTypename = function(type) {
  return this.prefix_ + type;
};


/**
 * Gets the value for the named storage value.
 * @param {!string} name Name of the storage entry.
 * @param {string=} type Type of the storage entry.
 * @return {string|boolean|null} Value of the storage entry.
 */
cwc.utils.Storage.prototype.get = function(name, type = '') {
  if (!type || !name) {
    this.log_.warn('Can\'t get value without a type and name!');
    return null;
  }
  if (!this.storage_) {
    this.log_.error('Storage is not available!');
    return null;
  }
  let keyName = this.getKeyname(name, type || this.defaultType_);
  let keyValue = this.storage_.getItem(keyName);
  this.log_.info('Get item', keyName, ':', keyValue);
  switch (keyValue) {
    case 'true':
      return true;
    case 'false':
      return false;
  }
  return keyValue;
};


/**
 * Gets all entries for the named storage type.
 * @param {!string} type Type of the storage entry.
 * @return {Object} Value of the storage entry.
 */
cwc.utils.Storage.prototype.getAll = function(type) {
  let result = {};
  let keys = Object.keys(this.storage_);
  keys.forEach((key) => {
    if (key.includes(type)) {
      let keyName = key.replace(this.getTypename(type) + '__', '');
      result[keyName] = this.get(keyName, type);
    }
  });
  return result;
};


/**
 * Sets the name and config inside the config.
 * @param {!string} name Name of the storage entry.
 * @param {string} value Value of the config entry.
 * @param {string=} type Type of the storage entry.
 */
cwc.utils.Storage.prototype.set = function(name, value, type = '') {
  if (!type || !name) {
    this.log_.warn('Can\'t store value without a type and name!');
    return;
  }
  if (!this.storage_) {
    this.log_.warn('No storage available!');
    return;
  }
  let keyName = this.getKeyname(name, type || this.defaultType_);
  if (value == this.storage_.getItem(keyName)) {
    return;
  }
  this.storage_.setItem(keyName, value);
  this.log_.info('Sets item', keyName, ':', value);
  if (this.syncChrome) {
    this.saveChromeStorage(type || this.defaultType_);
  }
};


/**
 * Removes the named entry.
 * @param {!string} name Name of the storage entry.
 * @param {string=} type Type of the storage entry.
 */
cwc.utils.Storage.prototype.remove = function(name, type = '') {
  if (!type || !name) {
    this.log_.warn('Can\'t remove entry without a type and name!');
    return;
  }
  if (!this.storage_) {
    this.log_.warn('No storage available!');
    return;
  }
  let keyName = this.getKeyname(name, type || this.defaultType_);
  this.storage_.removeItem(keyName);
  this.log_.info('Remove item', keyName);
  if (this.syncChrome) {
    this.saveChromeStorage(type || this.defaultType_);
  }
};
