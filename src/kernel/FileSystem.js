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

import { FileSystem as FileSystemHandler } from '../fs/FileSystem';
import { processManager as StaticProcessManager } from './Process';

import { Cd } from '../usr/bin/Cd';
import { Echo } from '../usr/bin/Echo';
import { Env } from '../usr/bin/Env';
import { Ls } from '../usr/bin/Ls';
import { Pwd } from '../usr/bin/Pwd';
import { Tty } from '../usr/bin/Tty';

/**
 * Virtual file system class.
 */
export class FileSystem {
  /**
   * @param {object} kernel
   * @param {object} processManager
   * @constructor
   */
  constructor(kernel, processManager = StaticProcessManager) {
    this.process = processManager.registerProcess(
      this,
      kernel ? kernel.process.pid : 1000
    );

    this.fileSystem = new FileSystemHandler();
  }

  /**
   * @return {Promise}
   */
  prepare() {
    return new Promise((resolve) => {
      console.log('Preparing virtual file system with pid', this.process.pid);
      this.prepareTemps();
      this.prepareSystemBinaries();
      this.prepareHomes();
      resolve();
    });
  }

  /**
   * Prepare essential system binaries under /sbin and /bin
   */
  prepareSystemBinaries() {
    this.fileSystem.mount('/sbin');
    this.fileSystem.remount('/sbin', { readwrite: false });

    this.fileSystem.mount('/bin');
    this.fileSystem.writeFile('/bin/cd', Cd);
    this.fileSystem.writeFile('/bin/echo', Echo);
    this.fileSystem.writeFile('/bin/env', Env);
    this.fileSystem.writeFile('/bin/ls', Ls);
    this.fileSystem.writeFile('/bin/pwd', Pwd);
    this.fileSystem.writeFile('/bin/tty', Tty);
  }

  /**
   * Prepare user home under /home
   */
  prepareHomes() {
    this.fileSystem.mount('/home');
    this.fileSystem.mkdir('/home/guest');
    this.fileSystem.mkdir('/home/guest/documents');
    this.fileSystem.writeFile('/home/guest/README');
  }

  /**
   * Prepare temporary directory /tmp
   */
  prepareTemps() {
    this.fileSystem.mount('/tmp');
    this.fileSystem.mkdir('/tmp/test1');
    this.fileSystem.mkdir('/tmp/test2');
    this.fileSystem.mkdir('/tmp/test3');
  }
}
