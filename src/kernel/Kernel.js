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
 * @fileoverview Kernel for the Coding with Chrome suite.
 */

import { Env } from './Env';
import { FileSystem } from './FileSystem';
import { Memory } from './Memory';
import { Shell } from '../usr/bin/Shell';
import { Terminal } from './Terminal';
import { processManager } from './Process';

/**
 * Kernel class.
 */
export class Kernel {
  /**
   * @constructor
   */
  constructor() {
    /** @type {Env} */
    this.env = new Env();

    /** @type {*} */
    this.process = processManager.registerProcess(this);

    /** @private {FileSystem} */
    this.fileSystem = new FileSystem(this);

    /** @private {Memory} */
    this.kernelMemory = new Memory();
    this.kernelMemory.add('tty', 0);

    /** @type {Terminal|null} */
    this.terminal = null;

    /** @type {Shell|null} */
    this.shell = null;

    /** @type {string} */
    this.version = '0.1';
  }

  /**
   * @return {promise}
   */
  boot() {
    return new Promise((resolve) => {
      console.log('Preparing kernel with version', this.version, '...');

      // Internal Kernel Memory
      this.kernelMemory.add('boot_time', new Date().getTime());
      this.kernelMemory.add('hostname', 'codingwithchromne');

      // Environment
      this.env.prepare();
      this.fileSystem.prepare();
      this.terminal = new Terminal(this);
      this.shell = new Shell(undefined, this.terminal);
      resolve();
    });
  }

  /**
   * @return {string}
   */
  requestTty() {
    const tty = this.kernelMemory.get('tty') || 0 + 1;
    this.kernelMemory.add('tty', tty);
    return 'tty' + Number(tty);
  }

  /**
   * @return {*}
   */
  requestFileSystem() {
    return this.fileSystem.fileSystem;
  }

  /**
   * @return {string}
   */
  requestHostname() {
    return String(this.kernelMemory.get('hostname'));
  }
}

export const kernel = new Kernel();
