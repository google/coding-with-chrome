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
export class BlocksBuilder {
  /**
   * @param {string} name
   * @param {string} filename
   * @return {Promise}
   */
  static getAsDataURL(name, filename) {
    return fetch(filename).then((response) => {
      return response.blob().then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () =>
              resolve({
                name,
                filename,
                dataURL: reader.result,
              });
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );
    });
  }
}
