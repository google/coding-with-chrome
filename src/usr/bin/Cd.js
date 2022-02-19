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
 * @fileoverview /bin/cd for the Coding with Chrome suite.
 */

import { App } from '../../kernel/App';
import { Path } from '../../fs/Path';

/**
 * Cd class.
 */
export class Cd extends App {
  /**
   * @param {?} environment
   * @param {?} terminal
   * @constructor
   */
  constructor(environment = null, terminal = null) {
    super(environment, terminal, 'cd');

    // Register FileSystem from kernel
    this.fileSystem = terminal ? terminal.kernel.requestFileSystem() : null;
  }

  /**
   * @param {string} input
   * @param {Array} args
   * @param {Map} options
   * @return {Promise}
   */
  run(input = '', args = [], options = new Map()) {
    return new Promise((resolve) => {
      if (!args[0]) {
        this.env.setPWD(this.env.HOME);
      } else if (args[0] == '/') {
        this.env.setPWD('/');
      } else if (args[0] == '~' || args[0] == '') {
        this.env.setPWD(this.env.HOME);
      } else if (args[0] == '-' && this.env.OLDPWD) {
        this.env.setPWD(this.env.OLDPWD);
      } else {
        const path = args[0].startsWith('/')
          ? args[0]
          : Path.join(this.env.PWD, args[0]);
        if (path == '/') {
          this.env.setPWD('/');
        } else if (this.fileSystem.existMount(path)) {
          this.env.setPWD(path);
        } else if (this.fileSystem.existFolder(path)) {
          this.env.setPWD(path);
        } else if (this.fileSystem.existFile(path)) {
          this.write(`cd: '${args[0]}': Not a directory`);
        } else {
          this.write(`cd: '${args[0]}': No such file or directory`);
        }
      }
      resolve();
    });
  }
}
