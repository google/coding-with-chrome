/**
 * @fileoverview Simple file system.
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

import { MountPoint } from './MountPoint';

/**
 * Virtual file system class.
 */
export class FileSystem {
  /**
   * @constructor
   */
  constructor() {
    this.mountPoint = new MountPoint();
  }

  /**
   * @param {string} path
   */
  mkdir(path) {
    this.mountPoint.mkdir(path);
  }

  /**
   * @param {string} path
   * @param {*} target
   */
  mount(path, target = undefined) {
    this.mountPoint.mount(path, target);
  }

  /**
   * @param {string} path
   * @param {object} options
   */
  remount(path, options = {}) {
    this.mountPoint.remount(path, options);
  }

  /**
   * @param {string} path
   * @param {string|function} data
   * @param {Object} options
   * @return {*}
   */
  writeFile(path, data = '', options = {}) {
    return this.mountPoint.writeFile(path, data, options);
  }

  /**
   * @param {string} path
   * @param {Object} options
   * @return {boolean}
   */
  existFile(path, options = {}) {
    return this.mountPoint.existFile(path, options);
  }

  /**
   * @param {string} path
   * @param {Object} options
   * @return {*}
   */
  getFile(path, options = {}) {
    return this.mountPoint.getFile(path, options);
  }
}
