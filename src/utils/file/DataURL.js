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
 * @fileoverview DataURL specific conversions and parser.
 * @author mbordihn@google.com (Markus Bordihn)
 */

/**
 * Blocks Builder.
 */
export class DataURL {
  /**
   * @param {String} dataURLString
   * @param {boolean} addFilePrefix
   * @return {Promise}
   */
  static generateIdFromDataURL(dataURLString, addFilePrefix = true) {
    return new Promise((resolve, reject) => {
      const fileType = DataURL.getFileTypeFromDataURL(dataURLString);
      // Remove prefix from base64 string, if exists.
      const data = dataURLString.includes(',')
        ? dataURLString.substring(dataURLString.indexOf(',') + 1)
        : dataURLString;
      try {
        crypto.subtle
          .digest('SHA-256', new TextEncoder().encode(atob(data)))
          .then((hashBuffer) => {
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashDataURL = btoa(String.fromCharCode(...hashArray));
            resolve(
              hashDataURL
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '') +
                (addFilePrefix && fileType ? '.' + fileType : ''),
            );
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @param {String} dataURLString
   * @return {String}
   */
  static getFileTypeFromDataURL(dataURLString) {
    let fileType = dataURLString.split(';')[0].split('/')[1];

    // Replace generic file extension with common one.
    if (fileType) {
      if (fileType.startsWith('x-')) {
        fileType = fileType.substring(2);
      }
      fileType = fileType
        .replace('mpeg3 ', 'mp3')
        .replace('mpeg4-generic', 'mp4')
        .replace('jpeg', 'jpg');
    }
    return fileType || '';
  }
}
