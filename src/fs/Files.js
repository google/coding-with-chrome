/**
 * @fileoverview Virtual file system for the kernel.
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

import { Executable } from './Executable';
import { File } from './File';
import { Path } from './Path';

/**
 * Virtual file class.
 */
export class Files {
  /**
   * @constructor
   */
  constructor() {
    /** @type {Object} */
    this.dirs = {
      '/': {
        ___files___: {}
      }
    };

    /** @type {Map} */
    this.files = new Map();

    /** @type {number} */
    this.size = 0;
  }

  /**
   * @param {string} path
   */
  addFolder(path) {
    if (!path.startsWith('/')) {
      throw new Error('Folder path needs to start with /');
    }
    if (path == '/') {
      throw new Error('Folder / is reserved for root!');
    }
    if (this.existFolder(path)) {
      throw new Error('Folder ' + path + ' already exist!');
    }
    if (this.existFile(path)) {
      throw new Error('File ' + path + ' already exist!');
    }
    const folderName = Path.basename(path);
    if (folderName == '___files___') {
      throw new Error('Folder ___files___ is reserved for internal usage!');
    }
    if (path.lastIndexOf('/') <= 0) {
      this.getRoot()[folderName] = {
        ___files___: {}
      };
      return;
    }
    this.getParentPath(path, true)[folderName] = {
      ___files___: {}
    };
  }

  /**
   * @param {string} path
   * @return {boolean}
   */
  exist(path) {
    if (this.existFolder(path)) {
      return true;
    }
    if (this.existFile(path)) {
      return true;
    }
    return false;
  }

  /**
   * @param {string} path
   * @return {boolean}
   */
  existFolder(path) {
    return Path.findPathInObject(path, this.dirs) ? true : false;
  }

  /**
   * @param {string} path
   * @return {boolean}
   */
  existFile(path) {
    const parentPath = this.getParentPath(path);
    return parentPath && Path.basename(path) in parentPath.___files___;
  }

  /**
   * @param {string} path
   * @param {Object} options
   * @return {Promise|ReadableStream}
   */
  readFile(path, options = { type: 'text' }) {
    const file = this.getFile(path);
    if (file.type === 'application/x-binary') {
      return file.getAsBinary();
    }
    switch (options.type) {
      case 'stream':
        return file.getAsStream();
      case 'base64':
        return file.getAsBase64();
      case 'binary':
        return file.getAsBinary();
      default:
        return file.getAsText();
    }
  }

  /**
   * @param {string} path
   * @param {string|function} data
   * @param {Object} options
   * @return {File|Executable}
   */
  writeFile(path, data = '', options = { overwrite: true, append: false }) {
    if (!path.startsWith('/')) {
      throw new Error('File path needs to start with /');
    }
    if (path == '/') {
      throw new Error('File / is reserved for root!');
    }
    if (this.existFolder(path)) {
      throw new Error('Folder ' + path + ' already exist!');
    }
    if (this.existFile(path)) {
      if (!options.overwrite) {
        throw new Error('File ' + path + ' already exist!');
      }
      const file = this.getFile(path);
      file.setData(data);
      return file;
    }

    // Create new executable or file entry.
    const fileName = Path.basename(path);
    const file =
      typeof data === 'function'
        ? new Executable(data, fileName)
        : new File(data, fileName);
    if (path.lastIndexOf('/') <= 0) {
      this.getRoot()['___files___'][fileName] = file.getId();
      this.files.set(file.getId(), file);
    } else {
      this.getParentPath(path, true)['___files___'][fileName] = file.getId();
      this.files.set(file.getId(), file);
    }
    return file;
  }

  /**
   * @param {*} path
   * @return {*}
   */
  listFiles(path) {
    if (this.existFolder(path)) {
      return Path.findPathInObject(path, this.dirs)['___files___'];
    } else if (this.existFile(path)) {
      return this.getParentPath(path, true)['___files___'];
    }
    return null;
  }

  /**
   * @param {string} path
   * @return {File|Executable}
   */
  getFile(path) {
    if (!this.existFile(path)) {
      throw new Error('No such file or directory: ' + path);
    }
    const fileId = this.getParentPath(path).___files___[Path.basename(path)];
    return this.files.get(fileId);
  }

  /**
   * @param {string} fileId
   * @return {File|Executable}
   */
  getFileById(fileId) {
    if (!this.files.has(fileId)) {
      throw new Error('No such file with id ' + fileId);
    }
    return this.files.get(fileId);
  }

  /**
   * @param {*} path
   * @return {*}
   */
  listFolders(path) {
    let folderList = null;
    if (this.existFolder(path)) {
      folderList = Path.findPathInObject(path, this.dirs);
    } else if (this.existFile(path)) {
      folderList = this.getParentPath(path, true);
    } else {
      return null;
    }
    if (folderList) {
      const filteredFolderList = Object.assign({}, folderList);
      delete filteredFolderList['___files___'];
      return filteredFolderList;
    }
    return null;
  }

  /**
   * @param {string} path
   * @param {boolean} required
   * @return {Object}
   */
  getParentPath(path, required = false) {
    const parentPath = Path.findPathInObject(Path.dirname(path), this.dirs);
    if (!parentPath && required) {
      throw new Error(
        'Missing parent folder ' + Path.dirname(path) + ' for ' + path
      );
    }
    return parentPath;
  }

  /**
   * @return {Object}
   */
  getRoot() {
    return this.dirs['/'];
  }
}
