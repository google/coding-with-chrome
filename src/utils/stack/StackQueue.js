/**
 * @fileoverview Stack Queue.
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

import { StackType } from './StackType';
import { StackEntry } from './StackEntry';

/**
 * A FIFO (first-in, first-out) stack queue.
 */
export class StackQueue {
  /**
   * @param {?boolean=} autostart
   */
  constructor(autostart = true) {
    /** @type {number|string} */
    this.default_group = 'default';

    /** @type {boolean} */
    this.autoStart = Boolean(autostart);

    /** @type {boolean} */
    this.active = false;

    /** @type {boolean} */
    this.run = false;

    /** @private {!Object} */
    this.stack_ = {};
  }

  /**
   * Add command to the stack queue.
   * @param {!Function} command
   * @param {number|string=} group
   * @export
   */
  addCommand(command, group) {
    if (command && command instanceof Function) {
      this.addStack_(new StackEntry(StackType.CMD, command), group);
    }
  }

  /**
   * Pause the stack queue for the given delay.
   * @param {number} delay in ms
   * @param {number|string=} group
   * @export
   */
  addDelay(delay, group) {
    this.addStack_(new StackEntry(StackType.DELAY, null, delay), group);
  }

  /**
   * Add promise command to the stack queue.
   * @param {!Function} command
   * @param {?Function=} callback
   * @param {number|string=} group
   * @export
   */
  addPromise(command, callback, group) {
    if (command && command instanceof Function) {
      this.addStack_(
        new StackEntry(StackType.PROMISE, command, '', callback),
        group
      );
    }
  }

  /**
   * Clears the default Stack with queued commands.
   * @export
   */
  clear() {
    this.stack_[this.default_group] = [];
    this.run = false;
  }

  /**
   * Starts the stack queue timer.
   * @export
   */
  start() {
    if (!this.active) {
      this.active = true;
      this.autoStart = true;
      this.run = false;
      this.handleQueue_();
    }
  }

  /**
   * Stops the stack queue timer.
   * @param {?Function=} callback
   * @export
   */
  stop(callback) {
    if (this.active) {
      this.active = false;
      this.autoStart = false;
      this.run = false;
      if (callback && typeof callback === 'function') {
        callback();
      }
    }
  }

  /**
   * Gets the next entry of the stack queue.
   * @param {number|string=} group
   * @return {?StackEntry}
   * @export
   */
  getNext(group = this.default_group) {
    if (this.getSize(group) > 0) {
      return this.stack_[group].shift();
    }
    return null;
  }

  /**
   * @param {number|string=} group
   * @return {number}
   */
  getSize(group = this.default_group) {
    return this.stack_[group] && this.stack_[group].length;
  }

  /**
   * Adds the entry to the stack queue.
   * @param {!StackEntry} stackEntry
   * @param {number|string=} group
   * @private
   */
  addStack_(stackEntry, group = this.default_group) {
    if (!(group in this.stack_)) {
      this.stack_[group] = [];
    }
    this.stack_[group].push(stackEntry);
    if (this.autoStart) {
      this.start();
    }
  }

  /**
   * Handles the stack queue ticks.
   * @private
   */
  handleQueue_() {
    if (!this.active || this.run) {
      return;
    }
    if (
      !(this.default_group in this.stack_) ||
      this.stack_[this.default_group].length <= 0
    ) {
      this.active = false;
      return;
    }
    const task = this.stack_[this.default_group].shift();
    const func = task.getFunc();
    switch (task.getType()) {
      // Normal command handling.
      case StackType.CMD:
        this.run = true;
        func();
        this.run = false;
        this.handleQueue_();
        break;

      // Delay command handling.
      case StackType.DELAY:
        this.run = true;
        setTimeout(
          function() {
            this.run = false;
            this.handleQueue_();
          }.bind(this),
          task.getValue()
        );
        break;

      // Promise command handling.
      case StackType.PROMISE:
        this.run = true;
        func()
          .then(e => {
            const callback = task.getCallback();
            if (callback) {
              callback(e);
            }
            this.run = false;
            this.handleQueue_();
          })
          .catch(() => {
            this.run = false;
            this.handleQueue_();
          });
        break;

      default:
        console.error('Unknown Stack Type', task.getType());
    }
  }
}
