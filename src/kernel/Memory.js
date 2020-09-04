/**
 * @fileoverview Memory for kernel.
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

/**
 * Memory class.
 */
export class Memory {
  /**
   * @constructor
   */
  constructor() {
    this.memory = {};
  }

  /**
   * @param {string} key
   * @param {string|number} value
   * @param {number} time in seconds
   */
  add(key, value, time = 0) {
    this.memory[key] = {
      value: value,
      time: time ? new Date().getTime() + time * 1000 : 0
    };
    console.log('.add', this.memory[key]);
  }

  /**
   * @param {*} key
   * @return {string|number|null}
   */
  get(key) {
    if (
      this.memory[key].time &&
      this.memory[key].time <= new Date().getTime()
    ) {
      this.delete(key);
      return null;
    }
    return this.memory[key].value;
  }

  /**
   * @return {number}
   */
  getSize() {
    return Object.keys(this.memory).length;
  }

  /**
   * @param {*} key
   */
  delete(key) {
    delete this.memory[key];
  }
}
