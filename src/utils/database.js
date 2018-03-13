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
 * @param {!string} name
 * @param {number=} version
 * @constructor
 */
cwc.utils.Database = function(name, version) {
  /** @type {!string} */
  this.name = 'Database';

  /** @private {*} */
  this.database_ = null;

  /** @private {!string} */
  this.name_ = name;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name + ':' + this.name_);

  /** @private {!string} */
  this.defaultObjectStore_ = '__files__';

  /** @private {number|undefined} */
  this.version_ = version;
};


/**
 * @export
 * @return {Promise}
 */
cwc.utils.Database.prototype.open = function() {
  return new Promise((resolve, reject) => {
    if (this.database_) {
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
      if (!database['objectStoreNames'].contains(this.defaultObjectStore_)) {
        database['createObjectStore'](this.defaultObjectStore_);
      }
    };
  });
};


/**
 * @param {!string} name
 * @param {!string} content
 */
cwc.utils.Database.prototype.addFile = function(name, content) {
  this.open().then(() => {
    let group = this.defaultObjectStore_;
    let objectStore =
      this.database_['transaction'](group, 'readwrite')['objectStore'](group);
    objectStore['add'](content, name);
  });
};


/**
 * @param {!string} name
 * @param {!string} content
 */
cwc.utils.Database.prototype.putFile = function(name, content) {
  this.open().then(() => {
    let group = this.defaultObjectStore_;
    let objectStore =
      this.database_['transaction'](group, 'readwrite')['objectStore'](group);
    objectStore['put'](content, name);
  });
};


/**
 * @param {!string} name
 * @return {Promise}
 */
cwc.utils.Database.prototype.getFile = function(name) {
  return new Promise((resolve, reject) => {
    let group = this.defaultObjectStore_;
    let objectStore =
      this.database_['transaction'](group, 'readonly')['objectStore'](group);
    let result = objectStore['get'](name);
    result['onsuccess'] = (e) => {
      resolve(e.target.result);
    };
    result['onerror'] = (e) => {
      reject(e);
    };
  });
};


/**
 * @return {number|undefined}
 */
cwc.utils.Database.prototype.getVersion = function() {
  return this.version_;
};
