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
 * @fileoverview Default Loop Blocks.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import Blockly, { Blocks } from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

import i18next from 'i18next';

/**
 * Phaser create section.
 */
Blocks['controls_infinity_loop'] = {
  init: function () {
    this.setHelpUrl('');
    this.setColour(120);
    this.appendDummyInput().appendField(i18next.t('BLOCKS_REPEAT_FOREVER'));
    this.appendStatementInput('CODE').setAlign(Blockly.ALIGN_CENTRE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  },
};

/**
 * Phaser create section.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['controls_infinity_loop'] = function (block) {
  const statements_code = javascriptGenerator.statementToCode(block, 'CODE');
  return `
  let infinity_loop = function() {
    try {
      ${statements_code}
    } catch (err) {
      return;
    }
    window.setTimeout(infinity_loop, 50);
  };
  infinity_loop();
  `;
};
