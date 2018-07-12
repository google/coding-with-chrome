/**
 * @fileoverview Database handler.
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
goog.provide('cwc.utils.Database');

goog.require('cwc.utils.Logger');


/**
 * @param {string} name
 * @param {number=} version
 * @param {string=} objectStoreName
 * @constructor
 */
cwc.utils.Database = function(name, version) {
  /** @type {string} */
  this.name = 'Database';

  /** @private {!Object} */
  this.config_ = {};

  /** @private {*} */
  this.database_ = null;

  /** @private {string} */
  this.name_ = name;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name + '::' + this.name_);

  /** @private {string} */
  this.defaultObjectStore_ = '__data__';

  /** @private {number|undefined} */
  this.version_ = version;
};


/**
 * @param {Object} config
 * @return {Promise}
 * @export
 */
cwc.utils.Database.prototype.open = function(config = this.config_) {
  let formerConfig = this.config_;
  let objectStoreNames = [this.defaultObjectStore_];
  if (config) {
    this.config_ = config;
    if (config['objectStoreNames']) {
      objectStoreNames = objectStoreNames.concat(config['objectStoreNames']);
    }
  }
  return new Promise((resolve, reject) => {
    if (this.database_ && formerConfig === this.config_) {
      return resolve(this.database_);
    }

    if (typeof indexedDB === 'undefined') {
      this.log_.error('IndexDB is unsupported!');
      return reject();
    }

    let dbRequest = indexedDB.open(this.name_, this.version_);
    dbRequest['onsuccess'] = () => {
      if (this.database_) {
        return resolve(this.database_);
      }
      this.database_ = dbRequest.result;
      this.version_ = this.database_.version;
      this.log_.info('Open database with version', this.version_);
      resolve(this.database_);
    };
    dbRequest['onerror'] = (e) => {
      this.log_.error(e);
      reject(e);
    };
    dbRequest['onupgradeneeded'] = (e) => {
      let database = e.target.result;
      objectStoreNames.forEach((objetStoreName) => {
        if (!database['objectStoreNames'].contains(objetStoreName)) {
          this.log_.info('Create Object Store', objetStoreName);
          database['createObjectStore'](objetStoreName);
        }
      });
    };
  });
};


/**
 * Adds a new record, if not already exists.
 * @param {string} name
 * @param {!string|number} content
 * @param {string=} group
 * @return {Promise}
 */
cwc.utils.Database.prototype.add = function(name, content, group) {
  return new Promise((resolve, reject) => {
    this.open().then(() => {
      this.log_.info('Add', name, group ? ' in group ' + group : '');
      let request = this.getObjectStore_(group)['add'](content, name);
      request.onsuccess = resolve;
      request.onerror = () => {
        this.log_.error('Failed to add', name, 'to group', group);
        reject();
      };
    });
  });
};


/**
 * Updates given record, or inserts a new record if not already exist.
 * @param {string=} group
 * @return {Promise}
 */
cwc.utils.Database.prototype.clear = function(
    group = this.defaultObjectStore_) {
  return new Promise((resolve, reject) => {
    this.open().then(() => {
      if (this.existObjectStore_(group)) {
        this.log_.info('Clear group', group);
        let request = this.getObjectStore_(group)['clear']();
        request.onsuccess = resolve;
        request.onerror = () => {
          this.log_.warn('Failed to clear database');
          reject();
        };
      } else {
        this.log_.warn('ObjectStore', group, 'does not exists!');
        resolve();
      }
    });
  });
};


/**
 * Updates given record, or inserts a new record if not already exist.
 * @param {string} name
 * @param {string} content
 * @param {string=} group
 * @return {Promise}
 */
cwc.utils.Database.prototype.put = function(name, content, group) {
  return new Promise((resolve, reject) => {
    this.open().then(() => {
      this.log_.info('Put', name, group ? ' in group ' + group : '');
      let request = this.getObjectStore_(group)['put'](content, name);
      request.onsuccess = resolve;
      request.onerror = () => {
        this.log_.error('Failed to put', name, 'to group', group);
        reject();
      };
    });
  });
};


/**
 * Set alias to be align with the Map() object.
 */
cwc.utils.Database.prototype.set = cwc.utils.Database.prototype.put;


/**
 * @param {string} name
 * @param {string=} group
 * @return {Promise}
 */
cwc.utils.Database.prototype.get = function(name, group) {
  if (!name) {
    this.log_.error('Invalid name', name, '!');
  }
  return new Promise((resolve, reject) => {
    this.open().then(() => {
      let result = this.getObjectStoreReadOnly_(group)['get'](name);
      result['onsuccess'] = (e) => {
        resolve(e.target.result);
      };
      result['onerror'] = (e) => {
        reject(e);
      };
    });
  });
};


/**
 * @param {string=} group
 * @param {string=} query
 * @param {number=} count
 * @return {Promise}
 */
cwc.utils.Database.prototype.getAll = function(group, query, count) {
  return new Promise((resolve, reject) => {
    let result = this.getObjectStoreReadOnly_(group)['getAll'](query, count);
    result['onsuccess'] = (e) => {
      resolve(e.target.result);
    };
    result['onerror'] = (e) => {
      reject(e);
    };
  });
};


/**
 * @param {string=} group
 * @param {string=} query
 * @param {number=} count
 * @return {Promise}
 */
cwc.utils.Database.prototype.getAllKeys = function(group, query, count) {
  return new Promise((resolve, reject) => {
    let result = this.getObjectStoreReadOnly_(group)['getAllKeys'](
      query, count);
    result['onsuccess'] = (e) => {
      resolve(e.target.result);
    };
    result['onerror'] = (e) => {
      reject(e);
    };
  });
};


/**
 * @param {string=} group
 * @param {string=} query
 * @param {number=} count
 * @return {Promise}
 */
cwc.utils.Database.prototype.getAllWithKeys = async function(group, query,
    count) {
  let keys = await this.getAllKeys(group, query, count);
  let data = await this.getAll(group, query, count);
  let result = new Map();
  let dataLength = data.length;
  for (let i = 0; i < dataLength; i++) {
    if (keys[i]) {
      result.set(keys[i], data[i]);
    }
  }
  return result;
};


/**
 * @param {string} name
 * @param {string=} group
 * @return {Promise}
 */
cwc.utils.Database.prototype.delete = function(name, group) {
  return new Promise((resolve, reject) => {
    let result = this.getObjectStore_(group)['delete'](name);
    result['onsuccess'] = (e) => {
      resolve(e.target.result);
    };
    result['onerror'] = (e) => {
      reject(e);
    };
  });
};


/**
 * @param {string} objectStoreName
 * @return {THIS}
 * @template THIS
 */
cwc.utils.Database.prototype.setObjectStoreName = function(objectStoreName) {
  this.defaultObjectStore_ = objectStoreName;
  return this;
};


/**
 * @param {number!} version
 * @return {THIS}
 * @template THIS
 */
cwc.utils.Database.prototype.setVersion = function(version) {
  this.version_ = version;
  return this;
};


/**
 * @return {number|undefined}
 */
cwc.utils.Database.prototype.getVersion = function() {
  return this.version_;
};


/**
 * @param {string=} group
 * @return {!IDBObjectStore}
 * @private
 */
cwc.utils.Database.prototype.getObjectStore_ = function(
    group = this.defaultObjectStore_) {
  return this.database_['transaction'](group, 'readwrite')['objectStore'](
    group);
};


/**
 * @param {string=} group
 * @return {!IDBObjectStore}
 * @private
 */
cwc.utils.Database.prototype.getObjectStoreReadOnly_ = function(
    group = this.defaultObjectStore_) {
  return this.database_['transaction'](group, 'readonly')['objectStore'](group);
};


/**
 * @param {string=} group
 * @return {boolean}
 * @private
 */
cwc.utils.Database.prototype.existObjectStore_ = function(
    group = this.defaultObjectStore_) {
  return this.database_ && this.database_['objectStoreNames'].contains(group);
};
