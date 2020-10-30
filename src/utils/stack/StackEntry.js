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
 * @fileoverview Stack Entry.
 */

import { StackType } from './StackType';

/**
 * Represents the single stack entry for the stack queue.
 */
export class StackEntry {
  /**
   * @param {!StackType} type
   * @param {?Function=} func
   * @param {string|number=} value
   * @param {?Function=} callback
   */
  constructor(type, func = undefined, value = '', callback = undefined) {
    /** @private {!StackType} */
    this.type_ = type || StackType.UNKNOWN;

    /** @private {?Function|undefined} */
    this.func_ = func || undefined;

    /** @private {string|number} */
    this.value_ = value;

    /** @private {?Function|undefined} */
    this.callback_ = callback;
  }

  /**
   * @return {!StackType}
   */
  getType() {
    return this.type_;
  }

  /**
   * @return {?Function|undefined}
   */
  getFunc() {
    return this.func_;
  }

  /**
   * @return {?Function|undefined}
   */
  getCallback() {
    return this.callback_;
  }

  /**
   * @return {string|number}
   */
  getValue() {
    return this.value_;
  }

  /**
   * @param {*} args
   * @return {*}
   */
  execute(args = undefined) {
    if (this.func_) {
      return this.func_(args);
    }
    return undefined;
  }
}
