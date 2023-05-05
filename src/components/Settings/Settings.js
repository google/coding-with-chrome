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
 * @fileoverview Setting.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import { Database } from '../../utils/db/Database';

const DATABASE_NAME = 'Settings';

/**
 * @class
 */
export class Settings {
  /**
   * @type {Database}
   */
  static DATABASE = new Database(DATABASE_NAME);

  /**
   * @return {Promise}
   */
  static getLanguage() {
    return Settings.DATABASE.get('language');
  }

  /**
   * @param {string} language
   * @return {Promise}
   */
  static setLanguage(language) {
    return Settings.DATABASE.put('language', language);
  }

  /**
   * @return {Promise}
   */
  static getVersion() {
    return Settings.DATABASE.get('version');
  }

  /**
   * @param {string} version
   * @return {Promise}
   */
  static setVersion(version) {
    return Settings.DATABASE.put('version', version);
  }
}

export default Settings;
