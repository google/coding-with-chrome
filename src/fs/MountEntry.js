/**
 * @fileoverview MountEntry for virtual file system.
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

import { MountEntryOptions } from './MountEntryOptions';

/**
 * MountEntry class
 */
export class MountEntry {
  /**
   * @param {string} path
   * @param {function} target
   * @param {object} options
   * @constructor
   */
  constructor(path, target, options = {}) {
    /** @type {string} */
    this.path = path;

    /** @type {function} */
    this.target = target;

    /** @type {object} */
    this.options = { ...MountEntryOptions, ...options };
  }

  /**
   * @param {string} command
   * @param {string} path
   * @param {string} args
   * @return {*}
   */
  executeCommand(command, path, args = '') {
    return this.getCommand(command)(path, args);
  }

  /**
   * @return {object}
   */
  getOptions() {
    return this.options;
  }

  /**
   * @param {object} options
   */
  setOptions(options) {
    console.log('Changing mount options for', this.path, 'to', options);
    this.options = { ...this.options, options };
  }

  /**
   * @return {object}
   */
  getTarget() {
    return this.target;
  }

  /**
   * @param {string} command
   * @return {function}
   */
  getCommand(command) {
    if (typeof this.target[command] !== 'function') {
      throw new Error('No mount point handler defined for command: ' + command);
    }
    return this.target[command].bind(this.target);
  }

  /**
   * @param {string} path
   * @param {string} args
   * @param {Object} options
   * @return {*}
   */
  executeFile(path, args = '', options = {}) {
    if (!this.options.exec) {
      throw new Error('Permission denied');
    }
    return this.getCommand('executeFile')(path, args, options);
  }

  /**
   * @param {*} path
   * @param {*} options
   * @return {boolean}
   */
  existFile(path, options = {}) {
    return this.getCommand('existFile')(path, options);
  }

  /**
   * @param {string} path
   * @param {Object} options
   * @return {*}
   */
  readFile(path, options = {}) {
    return this.getCommand('readFile')(path, options);
  }

  /**
   * @param {string} path
   * @param {Object} options
   * @return {*}
   */
  getFile(path, options = {}) {
    return this.getCommand('getFile')(path, options);
  }

  /**
   * @param {string} path
   * @param {string|function} data
   * @param {Object} options
   * @return {*}
   */
  writeFile(path, data, options = {}) {
    if (!this.options.readwrite) {
      throw new Error('Permission denied');
    }
    return this.getCommand('writeFile')(path, data, options);
  }

  /**
   * @param {string} path
   * @param {Object} options
   * @return {*}
   */
  listFiles(path, options = {}) {
    return this.getCommand('listFiles')(path, options);
  }

  /**
   * @param {*} path
   * @param {*} options
   * @return {boolean}
   */
  existFolder(path, options = {}) {
    return this.getCommand('existFolder')(path, options);
  }

  /**
   * @param {string} path
   * @param {Object} options
   * @return {*}
   */
  listFolders(path, options = {}) {
    return this.getCommand('listFolders')(path, options);
  }

  /**
   * @param {string} path
   * @param {Object} options
   * @return {*}
   */
  mkdir(path, options = {}) {
    if (!this.options.readwrite) {
      throw new Error('Permission denied');
    }
    return this.getCommand('addFolder')(path, options);
  }

  /**
   * @param {string} path
   * @param {Object} options
   * @return {*}
   */
  rmdir(path, options = {}) {
    if (!this.options.readwrite) {
      throw new Error('Permission denied');
    }
    return this.getCommand('removeFolder')(path, options);
  }

  /**
   * @param {string} path
   * @return {string}
   */
  getPath(path) {
    let result = '';
    if (path == this.path) {
      result = '/';
    } else if (path.startsWith(this.path)) {
      result = path.substring(this.path.length);
    }
    if (!result) {
      throw new Error(
        `Unable to resolve target path for ${path} within ${this.path}`
      );
    }
    return result;
  }
}
