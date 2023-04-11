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
 * @fileoverview Window data for the Window Manager.
 * @author mbordihn@google.com (Markus Bordihn)
 */

/**
 * Represents a single window for the window manager.
 */
export class WindowData {
  /**
   * @param {string} id
   * @param {string} title
   * @param {number} width
   * @param {number} height
   * @param {number} x
   * @param {number} y
   * @constructor
   */
  constructor(id, title, width = 500, height = 300, x = 200, y = 200) {
    this.id = id;
    this.title = title;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.noClose = false;
  }
}
