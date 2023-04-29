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
 * @fileoverview Blockly Toolbox.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import DefaultColorsToolbox from './ColorsToolbox';
import DefaultListsToolbox from './ListsToolbox';
import DefaultLogicToolbox from './LogicToolbox';
import DefaultLoopToolbox from './LoopToolbox';
import DefaultMathToolbox from './MathToolbox';
import DefaultTextToolbox from './TextToolbox';

/**
 * ToolBox for the game editor.
 */
export class Toolbox {
  /**
   * @return {object}
   */
  static getToolbox() {
    return {
      kind: 'categoryToolbox',
      contents: [
        DefaultColorsToolbox.defaultBlocks,
        DefaultListsToolbox.defaultBlocks,
        DefaultLogicToolbox.defaultBlocks,
        DefaultLoopToolbox.defaultBlocks,
        DefaultMathToolbox.defaultBlocks,
        DefaultTextToolbox.defaultBlocks,
      ],
    };
  }
}

export default Toolbox;
