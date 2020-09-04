/**
 * @fileoverview usr/bin/env for the Coding with Chrome suite.
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

/**
 * Env class.
 */
export class Env extends App {
  /**
   * @param {?} environment
   * @param {?} terminal
   * @constructor
   */
  constructor(environment = null, terminal = null) {
    super(environment, terminal);
  }

  /**
   * @param {string} args
   * @return {Promise}
   */
  run(args) {
    return new Promise(resolve => {
      if (!args) {
        for (const [name, value] of Object.entries(this.env.environment)) {
          this.terminal.writeResponse(`${name}=${value}`);
        }
      }
      resolve();
    });
  }
}
