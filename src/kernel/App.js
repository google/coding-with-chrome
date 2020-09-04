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
   * @constructor
   */
  constructor(environment = new Env(), terminal = null) {
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
   * @param {string} args
   */
  run(args) {
    console.log('Run command with', args);
  }

  /**
   * @param {number} ppid
   */
  updateProcessManager(ppid) {
    this.process = processManager.updateProcess(this.process.pid, this, ppid);
  }
}
