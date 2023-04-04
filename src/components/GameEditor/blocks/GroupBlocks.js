/**
 * @fileoverview Phaser Group Blocks for Blockly.
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
 */

/**
 * @author mbordihn@google.com (Markus Bordihn)
 */

import Blockly, { Blocks } from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

import { BlocksHelper } from './BlocksHelper';
import { BlocksTemplate } from './BlocksTemplate';

import i18next from 'i18next';

/**
 * Add group.
 */
Blocks['phaser_group_add'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('BLOCKS_DEFINE'));
    this.appendDummyInput()
      .appendField(i18next.t('as group'))
      .appendField(
        new Blockly.FieldTextInput('group_name', BlocksHelper.validateText),
        'name'
      );
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add group.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_group_add'] = function (block) {
  const text_name = block.getFieldValue('name');
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  return variable + " = game.add.group(undefined, '" + text_name + "');\n";
};

/**
 * Add group.
 */
Blocks['phaser_group_count_living'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(i18next.t('BLOCKS_PHASER_COUNT_LIVING_OBJECTS'))
      .appendField(i18next.t('BLOCKS_IN'));
    this.setOutput(true, null);
    this.setColour(255);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Get living objects.
 * @param {Blockly.Block} block
 * @return {string[]}
 */
javascriptGenerator['phaser_group_count_living'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  const code = variable + '.countLiving()';
  return [code, javascriptGenerator.ORDER_NONE];
};
