/**
 * @fileoverview Database handler.
 *
 * @license Copyright 2020 The Coding with Chrome Authors.
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

/**
 * Database class.
 */
export class Database {
  /**
   * @param {string} name
   * @param {number=} version
   * @constructor
   */
  constructor(name, version) {
    /** @private {!Object} */
    this.config_ = {};

    /** @private {*} */
    this.database_ = null;

    /** @private {string} */
    this.name_ = name;

    /** @private {string} */
    this.defaultObjectStore_ = '__data__';

    /** @private {number|undefined} */
    this.version_ = version;
  }

  /**
   * @param {Object} config
   * @return {Promise}
   */
  open(config = this.config_) {
    const formerConfig = this.config_;
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
        console.error('IndexDB is unsupported!');
        return reject(Error('IndexDB is unsupported!'));
      }

      const dbRequest = indexedDB.open(this.name_, this.version_);
      dbRequest['onsuccess'] = () => {
        if (this.database_) {
          return resolve(this.database_);
        }
        this.database_ = dbRequest.result;
        this.version_ = this.database_.version;
        console.info('Open database with version', this.version_);
        resolve(this.database_);
      };
      dbRequest['onerror'] = e => {
        console.error(e);
        reject(e);
      };
      dbRequest['onupgradeneeded'] = e => {
        const database = e.target.result;
        objectStoreNames.forEach(objetStoreName => {
          if (!database['objectStoreNames'].contains(objetStoreName)) {
            console.info('Create Object Store', objetStoreName);
            database['createObjectStore'](objetStoreName);
          }
        });
      };
    });
  }

  /**
   * Adds a new record, if not already exists.
   * @param {string} name
   * @param {!string|number} content
   * @param {string=} group
   * @return {Promise}
   */
  add(name, content, group) {
    return new Promise((resolve, reject) => {
      this.open().then(() => {
        console.info('Add', name, group ? ' in group ' + group : '');
        const request = this.getObjectStore_(group)['add'](content, name);
        request.onsuccess = resolve;
        request.onerror = () => {
          console.error('Failed to add', name, 'to group', group);
          reject(Error(`Failed to add ${name} to group ${group} group`));
        };
      });
    });
  }

  /**
   * Updates given record, or inserts a new record if not already exist.
   * @param {string=} group
   * @return {Promise}
   */
  clear(group = this.defaultObjectStore_) {
    return new Promise((resolve, reject) => {
      this.open().then(() => {
        if (this.existObjectStore_(group)) {
          console.info('Clear group', group);
          const request = this.getObjectStore_(group)['clear']();
          request.onsuccess = resolve;
          request.onerror = () => {
            console.warn('Failed to clear database');
            reject(Error('Failed to clear database'));
          };
        } else {
          console.warn('ObjectStore', group, 'does not exists!');
          resolve();
        }
      });
    });
  }

  /**
   * Updates given record, or inserts a new record if not already exist.
   * @param {string} name
   * @param {string} content
   * @param {string=} group
   * @return {Promise}
   */
  put(name, content, group) {
    return new Promise((resolve, reject) => {
      this.open().then(() => {
        console.info('Put', name, group ? ' in group ' + group : '');
        const request = this.getObjectStore_(group)['put'](content, name);
        request.onsuccess = resolve;
        request.onerror = () => {
          console.error('Failed to put', name, 'to group', group);
          reject(Error(`'Failed to put ${name} to group ${group}!`));
        };
      });
    });
  }

  /**
   * @param {string} name
   * @param {string=} group
   * @return {Promise}
   */
  get(name, group) {
    if (!name) {
      console.error('Invalid name', name, '!');
    }
    return new Promise((resolve, reject) => {
      this.open().then(() => {
        const result = this.getObjectStoreReadOnly_(group)['get'](name);
        result['onsuccess'] = e => {
          resolve(e.target.result);
        };
        result['onerror'] = e => {
          reject(e);
        };
      });
    });
  }

  /**
   * @param {string=} group
   * @param {string=} query
   * @param {number=} count
   * @return {Promise}
   */
  getAll(group, query, count) {
    return new Promise((resolve, reject) => {
      const result = this.getObjectStoreReadOnly_(group)['getAll'](
        query,
        count
      );
      result['onsuccess'] = e => {
        resolve(e.target.result);
      };
      result['onerror'] = e => {
        reject(e);
      };
    });
  }

  /**
   * @param {string=} group
   * @param {string=} query
   * @param {number=} count
   * @return {Promise}
   */
  getAllKeys(group, query, count) {
    return new Promise((resolve, reject) => {
      const result = this.getObjectStoreReadOnly_(group)['getAllKeys'](
        query,
        count
      );
      result['onsuccess'] = e => {
        resolve(e.target.result);
      };
      result['onerror'] = e => {
        reject(e);
      };
    });
  }

  /**
   * @param {string=} group
   * @param {string=} query
   * @param {number=} count
   * @return {Promise}
   */
  async getAllWithKeys(group, query, count) {
    const keys = await this.getAllKeys(group, query, count);
    const data = await this.getAll(group, query, count);
    const result = new Map();
    const dataLength = data.length;
    for (let i = 0; i < dataLength; i++) {
      if (keys[i]) {
        result.set(keys[i], data[i]);
      }
    }
    return result;
  }

  /**
   * @param {string} name
   * @param {string=} group
   * @return {Promise}
   */
  delete(name, group) {
    return new Promise((resolve, reject) => {
      const result = this.getObjectStore_(group)['delete'](name);
      result['onsuccess'] = e => {
        resolve(e.target.result);
      };
      result['onerror'] = e => {
        reject(e);
      };
    });
  }

  /**
   * @param {string} objectStoreName
   * @return {THIS}
   * @template THIS
   */
  setObjectStoreName(objectStoreName) {
    this.defaultObjectStore_ = objectStoreName;
    return this;
  }

  /**
   * @return {string}
   */
  getObjectStoreName() {
    return this.defaultObjectStore_;
  }

  /**
   * @param {number!} version
   * @return {THIS}
   * @template THIS
   */
  setVersion(version) {
    this.version_ = version;
    return this;
  }

  /**
   * @return {number|undefined}
   */
  getVersion() {
    return this.version_;
  }

  /**
   * @param {string=} group
   * @return {!IDBObjectStore}
   * @private
   */
  getObjectStore_(group = this.defaultObjectStore_) {
    return this.database_['transaction'](group, 'readwrite')['objectStore'](
      group
    );
  }

  /**
   * @param {string=} group
   * @return {!IDBObjectStore}
   * @private
   */
  getObjectStoreReadOnly_(group = this.defaultObjectStore_) {
    return this.database_['transaction'](group, 'readonly')['objectStore'](
      group
    );
  }

  /**
   * @param {string=} group
   * @return {boolean}
   * @private
   */
  existObjectStore_(group = this.defaultObjectStore_) {
    return this.database_ && this.database_['objectStoreNames'].contains(group);
  }
}
