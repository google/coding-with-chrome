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
 * @fileoverview Blockly Template for the Phaser Blockly modification.
 * @author mbordihn@google.com (Markus Bordihn)
 */

export const ContentType = {
  BLOCKLY: 'blockly',
};

/**
 * @class
 */
export class FileFormat {
  /** @type {string} */
  static FILE_HEADER = 'Coding with Chrome File Format';

  /** @type {number} */
  static FILE_VERSION = 4.0;

  /**
   * @param {string|ArrayBuffer} data
   * @constructor
   */
  constructor(data = '') {
    /** @type {string} */
    this.name = 'Coding with Chrome File';

    /** @type {string} */
    this.format = `${FileFormat.FILE_HEADER} ${FileFormat.FILE_VERSION}`;

    /** @type {Map} */
    this.content = new Map();

    /** @type {Map} */
    this.files = new Map();

    if (data) {
      if (data instanceof ArrayBuffer) {
        data = new TextDecoder('utf-8').decode(data);
      }
      this.load(data);
    }
  }

  /**
   * @param {string} data
   */
  load(data) {
    if (!data) {
      return;
    }

    // Parse data as JSON.
    let jsonData = data;
    if (typeof data != 'object') {
      try {
        jsonData = JSON.parse(data);
      } catch (error) {
        throw new Error(
          'Was not able to parse JSON: ' + error.message + '\ndata:' + data
        );
      }
    }

    // Check for file header.
    if (!jsonData || !FileFormat.hasFileHeader(jsonData['format'])) {
      throw new Error(
        'File format: ' + jsonData['format'] + ' is not support!'
      );
    }

    // Check for file version.
    const fileFormatVersion = FileFormat.getFileHeaderVersion(
      jsonData['format']
    );
    console.info(
      'Loading JSON data with',
      Object.keys(/** @type {Object} */ (jsonData)).length,
      'entries and file format version',
      fileFormatVersion
    );

    // Clear all data before processing.
    this.clear();

    // Load file content data.
    if (jsonData['content']) {
      for (const contentEntry in jsonData['content']) {
        if (
          Object.prototype.hasOwnProperty.call(
            jsonData['content'],
            contentEntry
          )
        ) {
          this.content.set(contentEntry, jsonData['content'][contentEntry]);
        }
      }
    }

    // Load file data.
    if (jsonData['files']) {
      for (const file in jsonData['files']) {
        if (Object.prototype.hasOwnProperty.call(jsonData['files'], file)) {
          this.files.set(file, jsonData['files'][file]);
        }
      }
    }
  }

  /**
   * Clear all data.
   */
  clear() {
    this.name = 'Coding with Chrome File';
    this.content = new Map();
    this.files = new Map();
  }

  /**
   * @param {string} name
   * @return {string}
   */
  getContent(name = '') {
    const data = this.content.get(name);
    if (data && data['content']) {
      return data['content'];
    }
    return data;
  }

  /**
   * @param {string} name
   * @param {string} data
   */
  setContent(name, data) {
    this.content.set(name, data);
  }

  /**
   * @param {string} name
   * @return {boolean}
   */
  hasContent(name) {
    return this.content.has(name);
  }

  /**
   * @return {Map}
   */
  getFiles() {
    return this.files;
  }

  /**
   * @param {Map} files
   */
  setFiles(files) {
    this.files = files;
  }

  /**
   * @return {boolean}
   */
  hasFiles() {
    return this.files && this.files.size > 0;
  }

  /**
   * @param {string} name
   * @return {string}
   */
  getFile(name) {
    return this.files.get(name);
  }

  /**
   * @param {string} name
   * @param {string} data
   */
  setFile(name, data) {
    this.files.set(name, data);
  }

  /**
   * @param {string} name
   * @return {boolean}
   */
  hasFile(name) {
    return this.files.has(name);
  }

  /**
   * @param {string} header
   * @return {boolean}
   */
  static hasFileHeader(header) {
    return header && header.includes(FileFormat.FILE_HEADER) ? true : false;
  }

  /**
   * @param {string} header
   * @return {number}
   */
  static getFileHeaderVersion(header) {
    let version = 0;
    if (FileFormat.hasFileHeader(header)) {
      version = Number(header.replace(FileFormat.FILE_HEADER + ' ', '')) || 0;
    }
    if (!version || version < 1) {
      throw new Error('Unknown file format version: ' + version);
    } else if (version < FileFormat.FILE_VERSION) {
      console.warn('Loading legacy file format version', version);
    } else if (version > FileFormat.FILE_VERSION) {
      console.error(
        'File format version',
        version,
        'is not supported by the current version. Please update ...'
      );
    }
    return version;
  }
}

export default FileFormat;
