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
 * @fileoverview Window Manager Events.
 * @author mbordihn@google.com (Markus Bordihn)
 */

/**
 * Custom window close event.
 */
export class WindowCloseEvent extends CustomEvent {
  /**
   * @param {string} windowId
   * @constructor
   */
  constructor(windowId) {
    super('windowClose');
    this.windowId = windowId;
  }

  /**
   * @return {string}
   */
  getWindowId() {
    return this.windowId;
  }
}

/**
 * Custom window resize event.
 */
export class WindowResizeEvent extends CustomEvent {
  /**
   * @param {string} windowId
   * @constructor
   */
  constructor(windowId) {
    super('windowResize');
    this.windowId = windowId;
  }

  /**
   * @return {string}
   */
  getWindowId() {
    return this.windowId;
  }
}
