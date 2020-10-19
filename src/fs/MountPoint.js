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
 * @author mbordihn@google.com (Markus Bordihn)
 *
 * @fileoverview MountPoint for virtual file system.
 */

import { Files } from './Files';
import { MountEntry } from './MountEntry';
import { Path } from './Path';

/**
 * MountPoint class.
 */
export class MountPoint {
  /**
   * @constructor
   */
  constructor() {
    this.mounts = {};
  }

  /**
   * @param {string} path
   * @param {*} target
   * @param {Object} options
   */
  mount(path, target = new Files(), options = {}) {
    if (!path.startsWith('/')) {
      throw new Error('Mount point needs to start with /');
    }
    if (path == '/') {
      throw new Error('Mount point / is already reserved for root!');
    }
    if (this.exist(path)) {
      throw new Error('Mount point ' + path + ' already exist!');
    }
    if (this.get(path)) {
      console.log('Mounting child ...');
    }
    this.mounts[path] = new MountEntry(path, target, options);
    console.log('Mounted', path, 'to', this.mounts[path]);
  }

  /**
   * @param {string} path
   */
  umount(path) {
    console.log('Unmount mounpoint', this.mounts[path], 'for', path);
    delete this.mounts[path];
  }

  /**
   * @param {string} path
   * @param {object} options
   */
  remount(path, options) {
    this.mounts[path].setOptions(options);
  }

  /**
   * @param {string} path
   * @param {Object} options
   * @return {Promise}
   */
  mkdir(path, options = {}) {
    const mount = this.getMount(path);
    if (mount) {
      return mount.mkdir(mount.getPath(path), options);
    }
    return Promise.reject(new Error('No valid mount point for ' + path));
  }

  /**
   * @param {string} path
   * @param {Object} options
   * @return {Promise}
   */
  readFile(path, options = {}) {
    const mount = this.getMount(path);
    if (mount) {
      return mount.readFile(mount.getPath(path), options);
    }
    return Promise.reject(new Error('No valid mount point for ' + path));
  }

  /**
   * @param {string} path
   * @param {Object} options
   * @return {boolean}
   */
  existFile(path, options = {}) {
    const mount = this.get(path);
    if (mount) {
      const targetPath = mount.getPath(path);
      return mount.existFile(targetPath, options);
    }
    return false;
  }

  /**
   * @param {string} path
   * @param {object} options
   * @return {*}
   */
  getFile(path, options = {}) {
    const mount = this.getMount(path);
    if (mount) {
      const targetPath = mount.getPath(path);
      return mount.getFile(targetPath, options);
    }
    return null;
  }

  /**
   * @param {string} path
   * @param {string|function} data
   * @param {Object} options
   * @return {Promise}
   */
  writeFile(path, data = '', options = {}) {
    const mount = this.getMount(path);
    if (mount) {
      return mount.writeFile(mount.getPath(path), data, options);
    }
    return Promise.reject(new Error('No valid mount point for ' + path));
  }

  /**
   * @param {string} path
   * @param {Object} options
   * @return {*}
   */
  listFiles(path, options = {}) {
    if (path == '/') {
      return {};
    }
    const mount = this.get(path);
    if (mount) {
      const targetPath = mount.getPath(path);
      return mount.listFiles(targetPath, options);
    }
    return null;
  }

  /**
   * @param {string} path
   * @param {Object} options
   * @return {boolean}
   */
  existFolder(path, options = {}) {
    const mount = this.get(path);
    if (mount) {
      const targetPath = mount.getPath(path);
      return mount.existFolder(targetPath, options);
    }
    return false;
  }

  /**
   * @param {string} path
   * @param {Object} options
   * @return {*}
   */
  listFolders(path, options = {}) {
    if (path == '/') {
      return this.mounts;
    }
    const mount = this.get(path);
    if (mount) {
      const targetPath = mount.getPath(path);
      return mount.listFolders(targetPath, options);
    }
    return null;
  }

  /**
   * @param {string} path
   * @param {string} command
   * @param {string} args
   * @return {*}
   */
  exec(path, command, args = '') {
    const mount = this.getMount(path);
    if (mount) {
      const targetPath = mount.getPath(path);
      return mount.executeCommand(command, targetPath, args);
    }
    return null;
  }

  /**
   * Returns the closed matching mount point.
   * @param {string} path
   * @param {boolean} required
   * @return {MountEntry|null}
   */
  get(path, required = false) {
    const mount = Path.closest(path, Object.keys(this.mounts));
    if (required) {
      if (!mount) {
        throw new Error('No available mount point for:' + path);
      }
      if (!this.mounts[mount].getTarget()) {
        throw new Error('Target for mount point ' + mount + ' is not defined!');
      }
    }
    return mount ? this.mounts[mount] : null;
  }

  /**
   * @param {string} path
   * @return {MountEntry?}
   */
  getMount(path) {
    return this.get(path, true);
  }

  /**
   * @param {string} path
   * @return {function?}
   */
  getTarget(path) {
    const mount = this.getMount(path);
    return mount ? mount.getTarget() : null;
  }

  /**
   * @param {string} path
   * @return {boolean}
   */
  exist(path) {
    return path in this.mounts;
  }

  /**
   * @return {object}
   */
  list() {
    return this.mounts;
  }
}
