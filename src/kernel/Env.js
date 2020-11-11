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
 * @fileoverview ENV for the Coding with Chrome suite.
 */

/**
 * Env class.
 */
export class Env {
  /**
   * @param {string} user
   * @constructor
   */
  constructor(user = 'guest') {
    /** @type {!Object} */
    this.features = {};

    /** @type {!Object} */
    this.environment = {};

    this.prepare(user);
  }

  /**
   * @return {Object}
   */
  get feature() {
    return this.features;
  }

  /**
   * @return {string}
   */
  get PWD() {
    return this.environment.PWD;
  }

  /**
   * @return {string}
   */
  get OLDPWD() {
    return this.environment.OLDPWD;
  }

  /**
   * @return {string}
   */
  get USER() {
    return this.environment.USER;
  }

  /**
   * @return {string}
   */
  get HOME() {
    return this.environment.HOME;
  }

  /**
   * @param {string} name
   * @param {string|number|boolean} value
   */
  setFeature(name, value) {
    this.features[name] = value;
  }

  /**
   * @param {string} name
   * @param {string|number} value
   */
  setEnv(name, value) {
    this.environment[name] = value;
  }

  /**
   * @param {string} name
   * @return {string|number}
   */
  getEnv(name) {
    if (name.startsWith('$')) {
      return this.environment[name.substring(1)];
    }
    return this.environment[name];
  }

  /**
   * @param {string} path
   */
  setPWD(path) {
    if (this.environment.PWD) {
      this.setEnv('OLDPWD', this.environment.PWD);
    }
    this.setEnv('PWD', path);
  }

  /**
   * @return {null|array}
   */
  getPath() {
    const path = this.environment.PATH;
    if (path) {
      return path.split(':');
    }
    return null;
  }

  /**
   * @param {string} user
   * @return {Promise}
   */
  prepare(user = 'guest') {
    return new Promise((resolve) => {
      console.log('Gathering system information ...');
      this.setFeature('serviceWorker', 'serviceWorker' in navigator);
      console.log('Detected Features', this.feature);

      this.setEnv('HOME', `/home/${user}`);
      this.setEnv('LANG', navigator['language'] || 'en-EN');
      this.setEnv('OLDPWD', '');
      this.setEnv('PATH', '/sbin:/bin');
      this.setEnv('PWD', `/home/${user}`);
      this.setEnv('SHELL', '/bin/shell');
      this.setEnv('TERM', 'xterm-256color');
      this.setEnv('USER', `${user}`);
      console.log('Detected Environment', this.environment);
      resolve();
    });
  }
}
