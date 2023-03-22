/**
 * @fileoverview Phaser Blocks for Blockly.
 *
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
 *
 * @author mbordihn@google.com (Markus Bordihn)
 */

import Blockly from 'blockly';
import { Blocks } from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

import { BlocksTemplate } from './BlocksTemplate';

import i18next from 'i18next';

/**
 * Phaser render section.
 */
Blocks['phaser_render'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.point())
      .appendField(i18next.t('on render'));
    this.appendStatementInput('CODE')
      .appendField(i18next.t('BLOCKS_DO'))
      .setAlign(Blockly.ALIGN_CENTRE)
      .setCheck(['Render']);
    this.setPreviousStatement(true, 'Render_');
    this.setNextStatement(false);
    this.setColour(195);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Phaser render section.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_render'] = function (block) {
  const statements_code = javascriptGenerator.statementToCode(block, 'CODE');
  return 'render: function(e) {\n' + statements_code + '},\n';
};
