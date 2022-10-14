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
 * @fileoverview App Wrapper for the Coding with Chrome suite.
 */

import { Env } from './Env';
import { processManager } from './Process';

/**
 * App class.
 */
export class App {
  /**
   * @param {*} environment
   * @param {*} terminal
   * @param {string} name
   * @constructor
   */
  constructor(environment = new Env(), terminal = null, name = '') {
    /** @type {Env} */
    this.env = environment || new Env();

    /** @type {*} */
    this.terminal = terminal;

    /** @type {*} */
    this.process = processManager.registerProcess(this);

    /** @type {boolean} */
    this.initialized = false;

    /** @type {boolean} */
    this.registered = false;

    /** @type {string} */
    this.name = name || `app${Math.floor(Math.random() * 9999)}`;

    /** @type {string} */
    this.help = `Usage: ${this.name} [OPTION]... [ARGS]...`;

    /** @type {string} */
    this.version = '1.0';
  }

  /**
   * @return {this}
   */
  initHandler() {
    if (this.initialized) {
      return this;
    }
    console.debug(`Initialize of ${this.name} ...`);
    this.init();
    this.initialized = true;
    return this;
  }

  /**
   * @return {this}
   */
  init() {
    return this;
  }

  /**
   * Register
   */
  register() {
    this.registered = true;
  }

  /**
   * @param {Env} env
   * @return {this}
   */
  registerEnv(env) {
    this.env = env;
    return this;
  }

  /**
   * @param {*} terminal
   * @return {this}
   */
  registerTerminal(terminal) {
    this.terminal = terminal;
    return this;
  }

  /**
   * @param {string} input
   * @param {Array} args
   * @param {Map} options
   * @return {Promise}
   */
  runHandler(input = '', args = [], options = new Map()) {
    if (options.has('help')) {
      return this.showHelp();
    } else if (options.has('version')) {
      return this.showVersion();
    } else {
      return this.run(input, args, options);
    }
  }

  /**
   * @param {string} input
   * @param {Array} args
   * @param {Map} options
   * @return {Promise}
   */
  run(input = '', args = [], options = new Map()) {
    return new Promise((resolve) => {
      this.write(`Run command with ${args} ${options} ${input}`);
      resolve({ input, args, options });
    });
  }

  /**
   * @param {string} input
   * @param {Array} args
   * @param {Map} options
   * @return {Promise}
   */
  autocomplete(input = '', args = [], options = new Map()) {
    return new Promise((resolve) => {
      this.write(
        `Autocomplete command ${this.name} with ${args} ${options} ${input}`
      );
      resolve({ input, args, options });
    });
  }

  /**
   * @return {Promise}
   */
  showHelp() {
    return new Promise((resolve) => {
      this.writeText(this.help);
      resolve(this.help);
    });
  }

  /**
   * @return {Promise}
   */
  showVersion() {
    return new Promise((resolve) => {
      const versionString = `Version: ${this.version}`;
      this.write(versionString);
      resolve(versionString);
    });
  }

  /**
   * @param {string} text
   */
  write(text) {
    if (this.terminal) {
      this.terminal.write(text);
    } else {
      console.log(text);
    }
  }

  /**
   * @param {string} text
   */
  append(text) {
    if (this.terminal) {
      this.terminal.append(text);
    } else {
      console.log(text);
    }
  }

  /**
   * @param {string} text
   */
  writeln(text) {
    this.write(`${text}\n`);
  }

  /**
   * @param {string} text
   */
  writeText(text) {
    this.write(text.replace(/\r?\n|\r/g, '\n\r'));
  }

  /**
   * @param {number} ppid
   */
  updateProcessManager(ppid) {
    this.process = processManager.updateProcess(this.process.pid, this, ppid);
  }
}
