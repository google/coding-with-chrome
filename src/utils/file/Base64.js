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
 * @fileoverview Blocks builder.
 * @author mbordihn@google.com (Markus Bordihn)
 */

/**
 * Blocks Builder.
 */
export class Base64 {
  /**
   * @param {String} base64String
   * @param {boolean} addFilePrefix
   * @return {Promise}
   */
  static generateIdFromBase64(base64String, addFilePrefix = true) {
    return new Promise((resolve, reject) => {
      const fileType = Base64.getFileTypeFromBase64(base64String);
      // Remove prefix from base64 string, if exists.
      const data = base64String.includes(',')
        ? base64String.substring(base64String.indexOf(',') + 1)
        : base64String;
      try {
        crypto.subtle
          .digest('SHA-256', new TextEncoder().encode(atob(data)))
          .then((hashBuffer) => {
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashBase64 = btoa(String.fromCharCode(...hashArray));
            resolve(
              hashBase64
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '') +
                (addFilePrefix && fileType ? '.' + fileType : '')
            );
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @param {String} base64String
   * @return {String}
   */
  static getFileTypeFromBase64(base64String) {
    let fileType = base64String.split(';')[0].split('/')[1];

    // Replace generic file extension with common one.
    if (fileType) {
      fileType = fileType.replace('x-m4a', 'm4a');
    }
    return fileType || '';
  }
}
