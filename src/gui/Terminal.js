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
 * @fileoverview Terminal GUI for the Coding with Chrome suite.
 */

import { Shell } from '../usr/bin/Shell';
import { kernel } from '../kernel/Kernel';
import { Terminal } from '../kernel/Terminal';
import { Terminal as XTerminal } from 'xterm';
import 'xterm/css/xterm.css';

/**
 * Terminal class
 */
export class TerminalGui extends Terminal {
  /**
   * @constructor
   */
  constructor() {
    super(kernel);

    // Register default Shell
    this.shell = new Shell();
    this.shell.registerTerminal(this);
    this.shell.registerFileSystem(kernel.requestFileSystem());
    this.shell.registerTty(this.tty);

    // Register Terminal
    /** @type {XTerminal} */
    this.terminal = new XTerminal({
      cursorBlink: true,
      fontFamily: 'Ubuntu Mono, courier-new, courier, monospace',
      scrollback: 1000,
      tabStopWidth: 8,
    });

    /** @type {boolean} */
    this.isDoubleTab = false;
  }

  /**
   * Shows Terminal
   * @param {HTMLElement|null} targetElement
   */
  show(targetElement = document.getElementById('cwc-terminal')) {
    if (!targetElement) {
      console.error('Unable to find target element:', targetElement);
      return;
    }
    this.terminal.open(targetElement);
    this.terminal.writeln(
      `Hello \x1B[1;3;31m${this.shell.env.USER}\x1B[0m from ${this.tty}`
    );
    this.terminal.prompt = this.shell.prompt.bind(this.shell);
    this.terminal.onKey((key) => {
      this.input(key);
    });
    this.shell.prompt();
  }

  /**
   * @param {object} event
   */
  input(event) {
    if (this.locked) {
      return;
    }
    console.log('key', event);
    if (event.domEvent.key == 'Enter') {
      if (this.command == 'reset') {
        this.terminal.reset();
        this.shell.prompt();
      } else if (this.command.trim() == '') {
        this.shell.prompt();
      } else if (this.command) {
        const [command, args] = this.command.split(/ (.*)/);
        this.shell.handleCommand(command, args);
      }
      this.command = '';
      this.isDoubleTab = false;
    } else if (event.domEvent.key == 'Backspace') {
      if (this.command.length > 0) {
        this.terminal.write('\b \b');
        this.command = this.command.substring(0, this.command.length - 1);
      }
    } else if (event.domEvent.key == 'Tab') {
      const [command, args] = this.command.split(/ (.*)/);
      this.shell.handleAutocomplete(command, args, this.isDoubleTab);
      this.isDoubleTab = true;
    } else if (event.domEvent.key == 'ArrowUp') {
      // pass
    } else if (event.domEvent.key == 'ArrowDown') {
      // pass
    } else if (event.key) {
      this.command += event.key;
      this.terminal.write(event.key);
    }
  }

  /**
   * @param {string} text
   */
  write(text) {
    this.terminal.write('\r\n' + text);
  }

  /**
   * @param {string} text
   */
  append(text) {
    this.terminal.write(text);
  }
}
