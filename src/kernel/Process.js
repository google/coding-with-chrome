/**
 * @fileoverview Process for the Coding with Chrome suite.
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
 * Process class.
 */
export class Process {
  /**
   * @param {function} process
   * @param {number} pid
   * @param {number} ppid
   * @constructor
   */
  constructor(process, pid, ppid = 0) {
    /** @type {function} */
    this.process = process;

    /** @type {number} */
    this.pid = pid;

    /** @type {number} */
    this.ppid = ppid;
  }
}

/**
 * Process Manager class.
 */
export class ProcessManager {
  /**
   * @constructor
   */
  constructor() {
    /** @private {!Object} */
    this.process = {};

    /** @private {!number} */
    this.lastPid = 0;
  }

  /**
   * @param {?} process
   * @param {number} parentPid
   * @return {Process}
   */
  registerProcess(process, parentPid = 0) {
    const pid = this.lastPid + 1;
    this.process[pid] = new Process(process, pid, parentPid);
    this.lastPid = pid;
    return this.process[pid];
  }

  /**
   * @param {number} processId
   * @param {?} process
   * @param {number} parentPid
   * @return {Process}
   */
  updateProcess(processId, process, parentPid) {
    this.process[processId] = new Process(process, processId, parentPid);
    return this.process[processId];
  }
}

export const processManager = new ProcessManager();
