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
 * @fileoverview Block Editor Setting.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import { Settings } from './Settings';

const PREFIX = 'blockEditor:';

/**
 * @class
 */
export class BlockEditorSettings {
  /**
   * @return {Promise}
   */
  static getZoomMouseWheel() {
    return Settings.DATABASE.get(PREFIX + 'zoomMouseWheel');
  }

  /**
   * @return {number}
   */
  static getZoomMouseWheelDefault() {
    return true;
  }

  /**
   * @param {boolean} enable
   * @return {Promise}
   */
  static setZoomMouseWheel(enable = this.getZoomMouseWheelDefault()) {
    return Settings.DATABASE.put(PREFIX + 'zoomMouseWheel', enable);
  }
}

export default BlockEditorSettings;
