/**
 * @fileoverview Shell for the Coding with Chrome suite.
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

import { App } from '../../kernel/App';
import { Env } from '../../kernel/Env';
import { Path } from '../../fs/Path';

/**
 * Shell class
 */
export class Shell extends App {
  /**
   * @param {?} environment
   * @param {?} terminal
   * @constructor
   */
  constructor(environment = new Env(), terminal = null) {
    super(environment, terminal);

    // Register FileSystem from kernel
    this.fileSystem = terminal ? terminal.kernel.requestFileSystem() : null;

    /** @type {string} */
    this.tty = terminal ? terminal.tty : 1000;
  }

  /**
   * Prepare Terminal
   */
  init() {
    this.terminal.writeResponse('Preparing Shell ...');
  }

  /**
   * @param {string} command
   * @param {string} args
   */
  handleCommand(command, args = '') {
    console.log('Command', command, args);
    const localCommand = this.searchCommand(command);
    if (localCommand) {
      this.executeCommand(localCommand, this.handleArgs(args));
    } else {
      this.terminal.writeResponse(command + ': command not found');
    }
  }

  /**
   * @param {string} args
   * @return {string}
   */
  handleArgs(args = '') {
    if (!args || !args.includes('$')) {
      return args;
    }
    return args.replace(/\$\w+/g, match => {
      return this.env.getEnv(match) || '';
    });
  }

  /**
   * @param {string} command
   * @return {null|string}
   */
  searchCommand(command) {
    const searchPaths = this.env.getPath();
    if (!command || !this.fileSystem || !searchPaths) {
      return null;
    }
    for (const searchPath of searchPaths) {
      const searchCommand = Path.join(searchPath, command);
      console.log(searchCommand);
      if (this.fileSystem.existFile(searchCommand)) {
        return searchCommand;
      }
    }
    return null;
  }

  /**
   * @param {string} path
   * @param {string} args
   */
  executeCommand(path, args = '') {
    const file = this.fileSystem.getFile(path);
    if (file) {
      this.terminal.lock();
      const Command = file.getData();
      new Command(this.env, this.terminal).run(args).finally(() => {
        this.terminal.unlock();
      });
    }
  }

  /**
   * @param {*} terminal
   */
  registerTerminal(terminal) {
    console.log('Register terminal', terminal, 'for', this.process.pid);
    this.terminal = terminal;
    if (!this.tty) {
      this.tty = terminal.tty;
    }
    if (this.process.pid) {
      this.updateProcessManager(terminal.process.pid);
    }
  }

  /**
   * @param {*} fileSystem
   */
  registerFileSystem(fileSystem) {
    console.log('Register fileSystem', fileSystem, 'for', this.process.pid);
    this.fileSystem = fileSystem;
    if (this.env.getEnv('PATH')) {
      console.log('Adding search path', this.env.getEnv('PATH'));
    }
  }

  /**
   * @param {string} tty
   */
  registerTty(tty) {
    console.log('Register tty', tty, 'for', this.process.pid);
    this.tty = tty;
  }

  /**
   * Displays user prompt.
   */
  prompt() {
    const hostname = this.terminal.kernel.requestHostname();
    this.terminal.writeResponse(
      `\x1B[1;32m${this.env.USER}@${hostname}:\x1B[1;34m${this.env.PWD}\x1B[0m$ `
    );
  }
}
