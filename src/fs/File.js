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
 * @fileoverview File instance for virtual file system for the kernel.
 */

import { FileContent } from './FileContent';

/**
 * @return {string}
 */
const generateId = function () {
  let result = '';
  const ids = window.crypto.getRandomValues(new Uint32Array(4));
  ids.forEach((id) => {
    result += '-' + id.toString(16);
  });
  return result.substr(1);
};

/**
 * File types.
 */
export const FileType = {
  NONE: 0,
  BINARY: 1,
  FILE: 2,
  SYMBOLIC_LINK: 3,
  DEVICE: 4,
  SOCKET: 5,
};

/**
 * Virtual file class.
 */
export class File {
  /**
   * @param {Blob|Array|String|function=} data
   * @param {string=} name
   * @param {object=} options
   * @constructor
   */
  constructor(data = '', name = 'unnamed', options = {}) {
    /** @type {Blob} */
    this.data = FileContent.toBlob(data);

    /** @type {function=} */
    this.executable = typeof data == 'function' ? data : undefined;

    /** @type {string} */
    this.id = generateId();

    /** @type {string} */
    this.filename = name;

    /** @type {object} */
    this.options = options;

    /** @type {number} */
    this.lastModifiedDate = Date.now();

    /** @type {number} */
    this.version = 1;
  }

  /**
   * @return {number}
   */
  get size() {
    return this.data.size || 0;
  }

  /**
   * @return {string}
   */
  get name() {
    return this.filename;
  }

  /**
   * @return {string}
   */
  get type() {
    return this.data.type;
  }

  /**
   * @return {number}
   */
  get lastModified() {
    return this.lastModifiedDate;
  }

  /**
   * @return {string}
   */
  getId() {
    return this.id;
  }

  /**
   * @return {string}
   */
  getName() {
    return this.name;
  }

  /**
   * @return {Blob}
   */
  getData() {
    return this.data;
  }

  /**
   * @return {function|undefined}
   */
  getExecutable() {
    return this.executable;
  }

  /**
   * @param {!Blob|Array|string|function} data
   * @return {this}
   */
  setData(data) {
    if (typeof data == 'function') {
      this.executable = data;
    }
    this.data = FileContent.toBlob(data);
    this.lastModifiedDate = Date.now();
    return this;
  }

  /**
   * @param {!string} name
   */
  setName(name) {
    this.filename = name;
  }

  /**
   * @return {ReadableStream}
   */
  getAsStream() {
    return FileContent.blobToStream(this.data);
  }

  /**
   * @return {string}
   */
  getAsDataURL() {
    return '';
  }

  /**
   * @return {Promise}
   */
  getAsExecutable() {
    return new Promise((resolve) => {
      resolve(this.executable);
    });
  }

  /**
   * @return {Promise}
   */
  getAsText() {
    return FileContent.blobToText(this.data);
  }

  /**
   * @return {Promise}
   */
  getAsBinary() {
    return new Promise((resolve) => {
      resolve(this.data);
    });
  }

  /**
   * @return {Promise}
   */
  getAsBase64() {
    return FileContent.blobToBase64(this.data);
  }

  /**
   * @return {Promise}
   */
  async getObject() {
    const content = await this.getAsText();
    return {
      data: content,
      id: this.id,
      modified: this.lastModifiedDate,
      name: this.name,
      size: this.size,
      type: this.type,
      version: this.version,
    };
  }

  /**
   * @return {Promise}
   */
  async getJSON() {
    const data = await this.getObject();
    return JSON.stringify(data, null, 2);
  }
}
