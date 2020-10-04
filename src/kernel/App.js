/**
 * @fileoverview App Wrapper for the Coding with Chrome suite.
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
    this.env = environment;

    /** @type {*} */
    this.terminal = terminal;

    /** @type {*} */
    this.process = processManager.registerProcess(this);

    /** @type {boolean} */
    this.initialized = false;

    /** @type {boolean} */
    this.registered = false;

    /** @type {string} */
    this.name = name;

    /** @type {string} */
    this.help = `Usage: ${this.name} [OPTION]... [ARGS]...`;

    /** @type {string} */
    this.version = '1.0';
  }

  /**
   * Init
   */
  init() {
    this.initialized = true;
  }

  /**
   * Register
   */
  register() {
    this.registered = true;
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
    return new Promise(resolve => {
      this.write(`Run command with ${args} ${options} ${input}`);
      resolve();
    });
  }

  /**
   * @param {string} input
   * @param {Array} args
   * @param {boolean} isDoubleTab
   * @return {Promise}
   */
  autocompleteHandler(input = '', args = [], isDoubleTab = false) {
    return new Promise(resolve => {
      this.append('a');
      this.write(`Autocomplete command with ${args} ${isDoubleTab} ${input}`);
      resolve();
    });
  }

  /**
   * @return {Promise}
   */
  showHelp() {
    return new Promise(resolve => {
      this.writeText(this.help);
      resolve();
    });
  }

  /**
   * @return {Promise}
   */
  showVersion() {
    return new Promise(resolve => {
      this.write('Version: ...');
      resolve();
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
