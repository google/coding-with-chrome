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
 * @fileoverview Phaser Variable Blocks for Blockly.
 * @author mbordihn@google.com (Markus Bordihn)
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import Blockly, { Block, Blocks } from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

import { BlocksHelper } from './BlocksHelper';

const reservedPhaserVariables = [
  'preload',
  'create',
  'update',
  'render',
  'game',
];

/**
 * Set dynamic variable
 */
Blocks['phaser_variable_set'] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldTextInput('default'),
      'VAR'
    );
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setOnChange(() => {
      const variableName = this.getFieldValue('VAR');
      if (reservedPhaserVariables.includes(variableName)) {
        this.setWarningText('Reserved variable name.');
      } else {
        this.setWarningText(null);
      }
    });
  },
};

/**
 * Set dynamic variable
 * @param {Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_variable_set'] = function (block) {
  const variable = block.getFieldValue('VAR').startsWith('this')
    ? block.getFieldValue('VAR')
    : 'this.' + block.getFieldValue('VAR');
  return [variable, javascriptGenerator.ORDER_ATOMIC];
};

/**
 * Get dynamic variable
 */
Blocks['phaser_variable_get'] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown(() => {
        return BlocksHelper.phaserVariable(this);
      }),
      'VAR'
    );
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Get dynamic variable
 * @param {Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_variable_get'] = function (block) {
  const variable = block.getFieldValue('VAR').startsWith('this')
    ? block.getFieldValue('VAR')
    : 'this.' + block.getFieldValue('VAR');
  return [variable, javascriptGenerator.ORDER_ATOMIC];
};

/**
 * Set dynamic group variable
 */
Blocks['phaser_variable_group_set'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('Group')
      .appendField(new Blockly.FieldTextInput('default'), 'VAR');
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setOnChange(() => {
      const variableName = this.getFieldValue('VAR');
      if (reservedPhaserVariables.includes(variableName)) {
        this.setWarningText('Reserved variable name.');
      } else {
        this.setWarningText(null);
      }
    });
  },
};

/**
 * Set dynamic group variable
 * @param {Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_variable_group_set'] = function (block) {
  const variable = block.getFieldValue('VAR').startsWith('this')
    ? block.getFieldValue('VAR')
    : 'this.' + block.getFieldValue('VAR');
  return [variable, javascriptGenerator.ORDER_ATOMIC];
};

/**
 * Get dynamic group variable
 */
Blocks['phaser_variable_group_get'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('Group')
      .appendField(
        new Blockly.FieldDropdown(() => {
          return BlocksHelper.phaserVariable(
            this,
            'phaser_variable_group_set',
            'default_group',
            'default_group'
          );
        }),
        'VAR'
      );
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Get dynamic group variable
 * @param {Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_variable_group_get'] = function (block) {
  const variable = block.getFieldValue('VAR').startsWith('this')
    ? block.getFieldValue('VAR')
    : 'this.' + block.getFieldValue('VAR');
  return [variable, javascriptGenerator.ORDER_ATOMIC];
};
