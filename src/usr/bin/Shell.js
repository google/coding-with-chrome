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
 * @fileoverview /bin/shell for the Coding with Chrome suite.
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
    super(environment, terminal, 'shell');

    // Register FileSystem from kernel
    this.fileSystem = terminal ? terminal.kernel.requestFileSystem() : null;

    /** @type {string} */
    this.tty = terminal ? terminal.tty : 1000;
  }

  /**
   * @param {string} command
   * @param {string} userInput
   */
  handleCommand(command, userInput = '') {
    console.log('Command', command, userInput);
    const localCommand = this.getCommand(command);
    if (localCommand) {
      const { input, args, options } = this.handleInput(userInput);
      this.executeCommand(localCommand, input, args, options);
    } else {
      this.write(command + ': command not found');
    }
  }

  /**
   * @param {string} command
   * @param {string} userInput
   * @param {boolean} isDoubleTab
   */
  handleAutocomplete(command, userInput = '', isDoubleTab = false) {
    console.log('Autocomplete', command, isDoubleTab, userInput);
    let localCommand = this.getCommand(command);
    if (localCommand) {
      const { input, args, options } = this.handleInput(userInput);
      if (options && !args) {
        return;
      }
      this.executeAutocomplete(localCommand, input, args, isDoubleTab);
    } else if (command) {
      console.log('Looking for command started with', command);
      localCommand = this.getCommandStartedWith(command);
      console.log('Found possible command', localCommand);
    }
  }

  /**
   * @param {string} input
   * @return {*}
   */
  handleInput(input = '') {
    // Replace $... strings with ENV equivalent
    let normalizedInput = input;
    if (input.includes('$')) {
      normalizedInput = input.replace(/\$\w+/g, (match) => {
        return String(this.env.getEnv(match) || '');
      });
    }
    // Split arguments and options like --help
    const options = new Map();
    const args = [];
    const argsList = normalizedInput.split(/([^\s"]+|"[^"]*")+/g);
    for (const arg of argsList) {
      if (arg.trim() === '') {
        // Do nothing!
      } else if (arg.startsWith('--')) {
        // Handle options like --help, --version, --options=value
        const option = arg.split(/--(\w+)=?/);
        options.set(option[1], arg.includes('=') ? option[2] : true);
      } else {
        // Handle everything else as argument
        args.push(arg);
      }
    }
    return {
      input: normalizedInput,
      args: args,
      options: options,
    };
  }

  /**
   * @param {string} command
   * @return {null|string}
   */
  getCommand(command) {
    const searchPaths = this.env.getPath();
    if (!command || !this.fileSystem || !searchPaths) {
      return null;
    }
    for (const searchPath of searchPaths) {
      const searchCommand = Path.join(searchPath, command);
      if (this.fileSystem.existFile(searchCommand)) {
        return searchCommand;
      }
    }
    return null;
  }

  /**
   * @param {string} command
   * @return {null|string}
   */
  getCommandStartedWith(command) {
    const searchPaths = this.env.getPath();
    if (!command || !this.fileSystem || !searchPaths) {
      return null;
    }
    for (const searchPath of searchPaths) {
      const searchCommand = Path.join(searchPath, command);
      if (this.fileSystem.existFile(searchCommand)) {
        return searchCommand;
      }
    }
    return null;
  }

  /**
   * @param {string} path
   * @param {string} input
   * @param {Array} args
   * @param {Map} options
   */
  executeCommand(path, input = '', args = [], options = new Map()) {
    const FileExecutable = this.fileSystem.getFile(path).getExecutable();
    if (!FileExecutable) {
      return;
    }
    this.terminal.lock();
    const command = new FileExecutable(this.env, this.terminal);
    command
      .initHandler()
      .runHandler(input, args, options)
      .then(() => {
        this.terminal.unlock();
        this.prompt();
      })
      .catch((error) => {
        this.writeln(`${command.name}: Runtime Error => ${error}`);
        console.error(`${command.name}:`, error);
        this.terminal.unlock();
        this.prompt();
      });
  }

  /**
   * @param {string} path
   * @param {string} input
   * @param {Array} args
   * @param {boolean} isDoubleTab
   */
  executeAutocomplete(path, input = '', args = [], isDoubleTab = false) {
    const FileExecutable = this.fileSystem.getFile(path).getExecutable();
    if (!FileExecutable) {
      return;
    }
    this.terminal.lock();
    const options = new Map();
    options.set('doubleTab', isDoubleTab);
    const command = new FileExecutable(this.env, this.terminal);
    command
      .autocomplete(input, args, options)
      .then(() => {
        this.terminal.unlock();
        this.prompt();
      })
      .catch((error) => {
        this.writeln(`${command.name}: Runtime Error => ${error}`);
        console.error(`${command.name}:`, error);
        this.terminal.unlock();
        this.prompt();
      });
  }

  /**
   * @param {*} terminal
   * @return {this}
   */
  registerTerminal(terminal) {
    console.log('Register terminal', terminal, 'for', this.process.pid);
    this.terminal = terminal;
    if (!this.tty) {
      this.tty = terminal.tty;
    }
    if (terminal.process.pid) {
      this.updateProcessManager(terminal.process.pid);
    }
    return this;
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
   * Displays user prompt with username, hostname, current path and data.
   * @param {string} data
   */
  prompt(data = '') {
    const hostname = this.terminal.kernel.requestHostname();
    let path = this.env.PWD;
    if (path.startsWith(this.env.HOME)) {
      path = path.replace(this.env.HOME, '~');
    }
    this.write(
      `\x1B[1;32m${this.env.USER}@${hostname}\x1B[0m:\x1B[1;34m${path}\x1B[0m$ `
    );
    if (data) {
      this.write(data);
    }
  }
}
