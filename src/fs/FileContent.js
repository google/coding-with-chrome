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

/**
 * Virtual file content class.
 */
export class FileContent {
  /**
   * @param {Blob} blobObject
   * @return {Promise}
   */
  static blobToText(blobObject) {
    if (typeof blobObject.text === 'function') {
      return blobObject.text();
    }
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.readAsText(blobObject);
    });
  }

  /**
   * @param {Blob} blobObject
   * @return {Promise}
   */
  static blobToBase64(blobObject) {
    return new Promise(resolve => {
      FileContent.blobToText(blobObject).then(text => {
        resolve(btoa(text));
      });
    });
  }

  /**
   * @param {*} blobObject
   * @return {ReadableStream}
   */
  static blobToStream(blobObject) {
    return blobObject.stream();
  }

  /**
   * @param {Blob|String|Array|Number} data
   * @return {Blob}
   */
  static toBlob(data) {
    if (data instanceof Blob) {
      return data;
    }
    if (typeof data === 'string' && data.startsWith('data:')) {
      return FileContent.dataURLToBlob(data);
    }
    if (typeof data === 'string') {
      return new Blob([data], { type: 'text/plain' });
    }
    if (typeof data === 'number') {
      return new Blob([String(data)], { type: 'text/plain' });
    }
    return new Blob();
  }

  /**
   * @param {string} data
   * @return {Blob}
   */
  static dataURLToBlob(data) {
    const dataSegments = data.replace(';base64', '').split(',');
    const type = dataSegments[0].split(':')[1].split(',')[0];
    if (data.includes(';base64')) {
      return FileContent.base64ToBlob(dataSegments[1], type);
    }
    return FileContent.urlEncodedToBlob(dataSegments[1], type);
  }

  /**
   * @param {string} data
   * @param {string} type
   * @return {Blob}
   */
  static urlEncodedToBlob(data, type) {
    return new Blob([FileContent.textToArrayBuffer(decodeURIComponent(data))], {
      type: type
    });
  }

  /**
   * @param {string} data
   * @param {string} type
   * @return {Blob}
   */
  static base64ToBlob(data, type) {
    let content = '';
    try {
      content = atob(data);
    } catch (error) {
      console.error('Decoding error for', data, error);
      content = data;
    }
    return new Blob([FileContent.textToArrayBuffer(content)], {
      type: type
    });
  }

  /**
   * @param {string} text
   * @return {ArrayBuffer}
   */
  static textToArrayBuffer(text) {
    return new TextEncoder().encode(text);
  }

  /**
   * @param {ArrayBuffer} data
   * @return {string}
   */
  static arrayBufferToText(data) {
    return new TextDecoder().decode(new Uint8Array(data));
  }
}
