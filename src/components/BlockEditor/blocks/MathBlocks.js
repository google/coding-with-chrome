/**
 * @license Copyright 2023 The Coding with Chrome Authors.
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
 * @fileoverview Default Math Blocks.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import Blockly, { Blocks } from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

/**
 * Phaser create section.
 */
Blocks['math_input_angle'] = {
  init: function () {
    this.setHelpUrl('');
    this.setColour(230);
    this.appendDummyInput().appendField(new Blockly.FieldAngle(0), 'angle');
    this.setOutput(true, 'Number');
    this.setTooltip('');
  },
};

/**
 * Phaser create section.
 * @param {Blockly.Block} block
 * @return {string[]}
 */
javascriptGenerator['math_input_angle'] = function (block) {
  const value_angle = block.getFieldValue('angle');
  const code = value_angle || 0;
  return [code, javascriptGenerator.ORDER_NONE];
};
