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
 * @fileoverview /bin/ls for the Coding with Chrome suite.
 */

import { App } from '../../kernel/App';
import { Path } from '../../fs/Path';

/**
 * Ls class.
 */
export class Ls extends App {
  /**
   * @param {?} environment
   * @param {?} terminal
   * @constructor
   */
  constructor(environment = null, terminal = null) {
    super(environment, terminal, 'ls');

    // Register FileSystem from kernel
    this.fileSystem = terminal ? terminal.kernel.requestFileSystem() : null;

    this.help = `Usage: ls [OPTION]... [FILE]...

    --help     display this help and exit
    --version  output version information and exit`;
  }

  /**
   * @param {string} input
   * @param {Array} args
   * @param {Map} options
   * @return {Promise}
   */
  run(input = '', args = [], options = new Map()) {
    return new Promise((resolve) => {
      const path = args[0];
      const { fileList, folderList } = this.list(path);
      console.log(fileList, folderList);
      if (fileList == null && folderList == null) {
        this.write(`ls: cannot access '${path}': No such file or directory`);
      } else {
        const formatedList = this.formatList(fileList, folderList);
        if (formatedList) {
          this.write(formatedList);
        }
      }
      resolve();
    });
  }

  /**
   * @param {string} path
   * @return {Object}
   */
  list(path = this.env.PWD) {
    const listPath = path.startsWith('/')
      ? path
      : Path.join(this.env.PWD, path);
    const fileList = this.fileSystem.listFiles(listPath);
    const folderList = this.fileSystem.listFolders(listPath);
    return {
      fileList: fileList,
      folderList: folderList,
    };
  }

  /**
   * @param {Object} fileList
   * @param {Object} folderList
   * @return {string}
   */
  formatList(fileList, folderList) {
    const folderNames = [];
    for (const [key, value] of Object.entries(folderList)) {
      folderNames.push(`\x1B[1;34m${key}\x1B[0m`);
    }
    const fileNames = [];
    for (const [key, value] of Object.entries(fileList)) {
      fileNames.push(key);
    }
    return folderNames.concat(fileNames).join('\t');
  }
}
