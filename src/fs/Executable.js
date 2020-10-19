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
 * @fileoverview Executable instance for virtual file system for the kernel.
 */

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
 * Virtual executable class.
 */
export class Executable {
  /**
   * @param {function} executable
   * @param {string} name
   * @param {object} options
   * @constructor
   */
  constructor(executable = new Function(), name = 'unnamed', options = {}) {
    /** @type {function} */
    this.executable = executable;

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

    /** @type {string} */
    this.binaryPlaceholder = '[binary data]';
  }

  /**
   * @return {number}
   */
  get size() {
    return this.executable.toString().length || 0;
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
    return 'application/x-binary';
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
   * @return {function}
   */
  getData() {
    return this.executable;
  }

  /**
   * @param {function} executable
   */
  setData(executable) {
    this.executable = executable;
    this.lastModifiedDate = Date.now();
  }

  /**
   * @param {string} name
   */
  setName(name) {
    this.filename = name;
  }

  /**
   * @return {Promise}
   */
  getAsBinary() {
    return new Promise((resolve) => {
      resolve(this.executable);
    });
  }

  /**
   * @return {Promise}
   */
  getAsBase64() {
    return new Promise((resolve) => {
      resolve(this.binaryPlaceholder);
    });
  }

  /**
   * @return {Promise}
   */
  getAsText() {
    return new Promise((resolve) => {
      resolve(this.binaryPlaceholder);
    });
  }

  /**
   * @return {Promise}
   */
  async getObject() {
    return {
      data: this.binaryPlaceholder,
      id: this.id,
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
