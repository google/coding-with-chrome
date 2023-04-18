/**
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
 */

/**
 * @fileoverview Database handler.
 * @author mbordihn@google.com (Markus Bordihn)
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 * @hints Check status with chrome://indexeddb-internals/
 */

/**
 * Database class.
 */
export class Database {
  /**
   * @param {string} name
   * @param {string=} group
   * @param {number=} version
   * @constructor
   */
  constructor(name, group, version) {
    /** @private {!Object} */
    this.config_ = {};

    /** @private {IDBDatabase} */
    this.database_ = null;

    /** @private {string} */
    this.name_ = name;

    /** @private {string} */
    this.defaultObjectStore_ = group || '__data__';

    /** @private {array} */
    this.knownObjectStores_ = [this.defaultObjectStore_];

    /** @private {boolean} */
    this.upgradeNeeded_ = false;

    /** @private {number|undefined} */
    this.version_ = version;
  }

  /**
   * @param {Object} config
   * @return {Promise}
   */
  open(config = this.config_) {
    if (
      !('indexedDB' in window) ||
      typeof indexedDB === 'undefined' ||
      'TestIndexedDBDisabled' in window
    ) {
      return Promise.reject(
        new Error(`IndexedDB is disabled or not supported by this browser!`)
      );
    }
    const formerConfig = this.config_;
    let objectStoreNames = [this.defaultObjectStore_];
    if (config) {
      this.config_ = config;
      if (config.objectStoreNames) {
        objectStoreNames = objectStoreNames.concat(config.objectStoreNames);
      }
    }
    this.knownObjectStores_ = objectStoreNames;
    return new Promise((resolve, reject) => {
      if (
        this.database_ &&
        formerConfig === this.config_ &&
        !this.upgradeNeeded_
      ) {
        return resolve(this.database_);
      }

      // Open database and handle events.
      console.log(
        `Opening database ${this.name_} with ${
          this.version_ || 'auto version'
        } ...`
      );
      const dbRequest = indexedDB.open(this.name_, this.version_);
      dbRequest.onsuccess = (event) => {
        this.handleOnSuccess(event).then(resolve);
      };
      dbRequest.onblocked = (event) => {
        this.handleOnBlocked(event).then(reject);
      };
      dbRequest.onerror = (event) => {
        this.handleOnError(event).then(reject);
      };
      dbRequest.onupgradeneeded = this.handleOnUpgradeNeeded.bind(this);
    });
  }

  /**
   * @param {IDBVersionChangeEvent} event
   * @return {Promise}
   */
  handleOnBlocked(event) {
    return new Promise((resolve) => {
      console.error(`Database ${this.name_} is blocked!`, event);
      resolve(event);
    });
  }

  /**
   * @param {Event} event
   * @return {Promise}
   */
  handleOnSuccess(event) {
    return new Promise((resolve, reject) => {
      if (!event || !event.target) {
        return reject(new Error(`Unable to open database ${this.name_}!`));
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.database_ = event.target.result;
      this.version_ = this.database_.version;

      // Add onVersionChange event listener.
      this.database_.onversionchange = (event) => {
        console.warn(
          `Database ${this.name_} is outdated and will be closed!`,
          event
        );
        this.database_.close();
        reject(new Error('Database is outdated!'));
      };

      // Check if default object store is available.
      if (this.database_.objectStoreNames.contains(this.defaultObjectStore_)) {
        console.info(
          `Opened database ${this.name_} with version ${this.version_}.`
        );
        this.upgradeNeeded_ = false;
        return resolve(this.database_);
      }

      // Create default object store by forcing an upgrade.
      console.warn(
        `Opened database ${this.name_} with version ${this.version_} but ` +
          `default object store ${this.defaultObjectStore_} is missing!`
      );
      this.version_ = this.database_.version + 1;
      this.database_.close();
      this.upgradeNeeded_ = true;
      setTimeout(() => {
        this.open().then(resolve);
      }, 250);
    });
  }

  /**
   * @param {Event} error
   * @return {Promise}
   */
  handleOnError(error) {
    return new Promise((resolve) => {
      console.error(`Unable to open database ${this.name_} with error:`, error);
      resolve(error);
    });
  }

  /**
   * @param {IDBVersionChangeEvent} event
   * @return {Promise}
   */
  handleOnUpgradeNeeded(event) {
    return new Promise((resolve) => {
      if (event.target) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const database = event.target.result;
        console.log(
          `Upgrading database ${this.name_} to version ${database.version}`
        );
        this.knownObjectStores_.forEach((objetStoreName) => {
          if (!database.objectStoreNames.contains(objetStoreName)) {
            console.info('Create Object Store', objetStoreName);
            database.createObjectStore(objetStoreName);
          }
        });
        this.upgradeNeeded_ = false;
        resolve(database);
      }
    });
  }

  /**
   * @param {!string} command
   * @param {string=} group
   * @param  {...any} params
   * @return {Promise}
   */
  execute(command, group, ...params) {
    return new Promise((resolve, reject) => {
      if (typeof group != 'undefined' && !this.existObjectStore_(group)) {
        return reject(
          new Error(`Object store group ${group} does not exists in database!`)
        );
      }
      this.open().then(() => {
        console.log(
          `[${this.name_}:${
            group || this.defaultObjectStore_
          }] Executing ${command}(${params})`
        );
        /* jshint -W014 */
        const objectStore = ['get', 'getAll', 'getAllKeys'].includes(command)
          ? this.getObjectStoreReadOnly_(group)
          : this.getObjectStore_(group);
        if (!objectStore) {
          return reject(
            new Error(
              `Object store ${objectStore} for group ${group} does not exists in database!`
            )
          );
        }
        if (typeof objectStore[command] !== 'function') {
          return reject(
            new Error(
              `Object store ${objectStore} for group ${group} does not support command ${command}!`
            )
          );
        }
        const request = objectStore[command](...params);
        request.onsuccess = () => {
          return resolve(request.result);
        };
        request.onerror = (error) => {
          reject(
            new Error(
              `Failed to execute transaction "${command}" for ${this.name_} with "${params}": ${error.target.error}`
            )
          );
        };
        request.onabort = () => {
          reject(
            new Error(`Transaction "${command}" for ${this.name_} aborted!`)
          );
        };
      });
    });
  }

  /**
   * Close database.
   */
  close() {
    if (this.database_) {
      this.database_.close();
    }
  }

  /**
   * Adds a new record, if not already exists.
   * @param {string} name
   * @param {!string|number} content
   * @param {string=} group
   * @return {Promise}
   */
  add(name, content, group) {
    return this.execute('add', group, content, name);
  }

  /**
   * Clearing all records of the given group.
   * @param {string=} group
   * @return {Promise}
   */
  clear(group = this.defaultObjectStore_) {
    return this.execute('clear', group, group);
  }

  /**
   * Updates given record, or inserts a new record if not already exist.
   * @param {string} name
   * @param {string} content
   * @param {string=} group
   * @return {Promise}
   */
  put(name, content, group) {
    return this.execute('put', group, content, name);
  }

  /**
   * @param {string} name
   * @param {string=} group
   * @return {Promise}
   */
  get(name, group) {
    return this.execute('get', group, name);
  }

  /**
   * @param {string=} group
   * @param {string=} query
   * @param {number=} count
   * @return {Promise}
   */
  getAll(group, query, count) {
    return this.execute('getAll', group, query, count);
  }

  /**
   * @param {string=} group
   * @param {string=} query
   * @param {number=} count
   * @return {Promise}
   */
  getAllKeys(group, query, count) {
    return this.execute('getAllKeys', group, query, count);
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
    return this.execute('delete', group, name);
  }

  /**
   * @param {string} objectStoreName
   * @return {Database}
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
   * @return {Database}
   */
  setVersion(version) {
    const versionNumber = Math.round(Number(version));
    if (Number.isInteger(versionNumber)) {
      this.version_ = versionNumber;
    }
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
   * @return {IDBObjectStore|undefined}
   * @private
   */
  getObjectStore_(group = this.defaultObjectStore_) {
    return this.database_?.transaction(group, 'readwrite').objectStore(group);
  }

  /**
   * @param {string=} group
   * @return {IDBObjectStore|undefined}
   * @private
   */
  getObjectStoreReadOnly_(group = this.defaultObjectStore_) {
    return this.database_?.transaction(group, 'readonly').objectStore(group);
  }

  /**
   * @param {string=} group
   * @return {boolean}
   * @private
   */
  existObjectStore_(group = this.defaultObjectStore_) {
    return this.database_ && this.database_.objectStoreNames.contains(group)
      ? true
      : false;
  }
}
