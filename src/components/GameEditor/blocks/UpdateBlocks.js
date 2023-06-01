/**
 * @fileoverview Phaser Blocks for Blockly.
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
 */

/**
 * @author mbordihn@google.com (Markus Bordihn)
 */

import Blockly, { Blocks } from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

import { BlocksTemplate } from '../../BlockEditor/blocks/BlocksTemplate';

import i18next from 'i18next';

/**
 * Phaser create section.
 */
Blocks['phaser_update'] = {
  init: function () {
    this.setHelpUrl('');
    this.setColour(315);
    this.appendDummyInput()
      .appendField(BlocksTemplate.repeat())
      .appendField(i18next.t('BLOCKS_PHASER_ON_UPDATE'));
    this.appendStatementInput('CODE')
      .appendField(i18next.t('BLOCKS_DO'))
      .setAlign(Blockly.ALIGN_CENTRE)
      .setCheck(['Update']);
    this.setPreviousStatement(true, 'Update_');
    this.setNextStatement(true, 'Render_');
    this.setTooltip('');
  },
};

/**
 * Phaser update section.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_update'] = function (block) {
  const statements_code = javascriptGenerator.statementToCode(block, 'CODE');
  return `
  update (event) {
    if (event && this.input_) {
      this.input_(event);
    }
    ${statements_code}
    PhaserHelper.updateHelper(this);
  }`;
};
