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

import i18next from 'i18next';

/**
 * Set dynamic arcade_sprite variable
 */
Blocks['phaser_variable_arcade_sprite_set'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_PHASER_VARIABLE_ARCADE_SPRITE'))
      .appendField(new Blockly.FieldTextInput('default'), 'VAR');
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setOnChange(() => {
      BlocksHelper.checkVariableName(this);
    });
  },
};

/**
 * Set dynamic arcade_sprite variable
 * @param {Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_variable_arcade_sprite_set'] = function (
  block,
) {
  return BlocksHelper.getVariableName(block);
};

/**
 * Get dynamic arcade_sprite variable
 */
Blocks['phaser_variable_arcade_sprite_get'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_PHASER_VARIABLE_ARCADE_SPRITE'))
      .appendField(
        new Blockly.FieldDropdown(() => {
          return BlocksHelper.phaserVariable(
            this,
            'phaser_variable_arcade_sprite_set',
            'default_arcade_sprite',
            'default_arcade_sprite',
          );
        }),
        'VAR',
      );
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Get dynamic arcade_sprite variable
 * @param {Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_variable_arcade_sprite_get'] = function (
  block,
) {
  return BlocksHelper.getVariableName(block);
};

/**
 * Set dynamic audio variable
 */
Blocks['phaser_variable_audio_set'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_PHASER_VARIABLE_AUDIO'))
      .appendField(new Blockly.FieldTextInput('default'), 'VAR');
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setOnChange(() => {
      BlocksHelper.checkVariableName(this);
    });
  },
};

/**
 * Set dynamic audio variable
 * @param {Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_variable_audio_set'] = function (block) {
  return BlocksHelper.getVariableName(block);
};

/**
 * Get dynamic audio variable
 */
Blocks['phaser_variable_audio_get'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_PHASER_VARIABLE_AUDIO'))
      .appendField(
        new Blockly.FieldDropdown(() => {
          return BlocksHelper.phaserVariable(
            this,
            'phaser_variable_audio_set',
            'default_audio',
            'default_audio',
          );
        }),
        'VAR',
      );
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Get dynamic audio variable
 * @param {Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_variable_audio_get'] = function (block) {
  return BlocksHelper.getVariableName(block);
};

/**
 * Set dynamic group variable
 */
Blocks['phaser_variable_group_set'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_PHASER_VARIABLE_GROUP'))
      .appendField(new Blockly.FieldTextInput('default'), 'VAR');
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setOnChange(() => {
      BlocksHelper.checkVariableName(this);
    });
  },
};

/**
 * Set dynamic group variable
 * @param {Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_variable_group_set'] = function (block) {
  return BlocksHelper.getVariableName(block);
};

/**
 * Get dynamic group variable
 */
Blocks['phaser_variable_group_get'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_PHASER_VARIABLE_GROUP'))
      .appendField(
        new Blockly.FieldDropdown(() => {
          return BlocksHelper.phaserVariable(
            this,
            'phaser_variable_group_set',
            'default_group',
            'default_group',
          );
        }),
        'VAR',
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
  return BlocksHelper.getVariableName(block);
};

/**
 * Set dynamic input variable
 */
Blocks['phaser_variable_input_set'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_PHASER_VARIABLE_INPUT'))
      .appendField(new Blockly.FieldTextInput('default'), 'VAR');
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setOnChange(() => {
      BlocksHelper.checkVariableName(this);
    });
  },
};

/**
 * Set dynamic input variable
 * @param {Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_variable_input_set'] = function (block) {
  return BlocksHelper.getVariableName(block);
};

/**
 * Get dynamic input variable
 */
Blocks['phaser_variable_input_get'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_PHASER_VARIABLE_INPUT'))
      .appendField(
        new Blockly.FieldDropdown(() => {
          return BlocksHelper.phaserVariable(
            this,
            'phaser_variable_input_set',
            'default_input',
            'default_input',
          );
        }),
        'VAR',
      );
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Get dynamic input variable
 * @param {Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_variable_input_get'] = function (block) {
  return BlocksHelper.getVariableName(block);
};

/**
 * Set dynamic sprite variable
 */
Blocks['phaser_variable_sprite_set'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_PHASER_VARIABLE_SPRITE'))
      .appendField(new Blockly.FieldTextInput('default'), 'VAR');
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setOnChange(() => {
      BlocksHelper.checkVariableName(this);
    });
  },
};

/**
 * Set dynamic sprite variable
 * @param {Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_variable_sprite_set'] = function (block) {
  return BlocksHelper.getVariableName(block);
};

/**
 * Get dynamic sprite variable
 */
Blocks['phaser_variable_sprite_get'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_PHASER_VARIABLE_SPRITE'))
      .appendField(
        new Blockly.FieldDropdown(() => {
          return BlocksHelper.phaserVariables(
            this,
            [
              'phaser_variable_sprite_set',
              'phaser_variable_arcade_sprite_set',
              'phaser_variable_tile_sprite_set',
            ],
            'default_sprite',
            'default_sprite',
          );
        }),
        'VAR',
      );
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Get dynamic sprite variable
 * @param {Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_variable_sprite_get'] = function (block) {
  return BlocksHelper.getVariableName(block);
};

/**
 * Set dynamic text variable
 */
Blocks['phaser_variable_text_set'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_PHASER_VARIABLE_TEXT'))
      .appendField(new Blockly.FieldTextInput('default'), 'VAR');
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setOnChange(() => {
      BlocksHelper.checkVariableName(this);
    });
  },
};

/**
 * Set dynamic text variable
 * @param {Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_variable_text_set'] = function (block) {
  return BlocksHelper.getVariableName(block);
};

/**
 * Get dynamic text variable
 */
Blocks['phaser_variable_text_get'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_PHASER_VARIABLE_TEXT'))
      .appendField(
        new Blockly.FieldDropdown(() => {
          return BlocksHelper.phaserVariable(
            this,
            'phaser_variable_text_set',
            'default_text',
            'default_text',
          );
        }),
        'VAR',
      );
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Get dynamic text variable
 * @param {Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_variable_text_get'] = function (block) {
  return BlocksHelper.getVariableName(block);
};

/**
 * Set dynamic tile_sprite variable
 */
Blocks['phaser_variable_tile_sprite_set'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_PHASER_VARIABLE_TILE_SPRITE'))
      .appendField(new Blockly.FieldTextInput('default'), 'VAR');
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setOnChange(() => {
      BlocksHelper.checkVariableName(this);
    });
  },
};

/**
 * Set dynamic tile_sprite variable
 * @param {Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_variable_tile_sprite_set'] = function (
  block,
) {
  return BlocksHelper.getVariableName(block);
};

/**
 * Get dynamic tile_sprite variable
 */
Blocks['phaser_variable_tile_sprite_get'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_PHASER_VARIABLE_TILE_SPRITE'))
      .appendField(
        new Blockly.FieldDropdown(() => {
          return BlocksHelper.phaserVariable(
            this,
            'phaser_variable_tile_sprite_set',
            'default_tile_sprite',
            'default_tile_sprite',
          );
        }),
        'VAR',
      );
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Get dynamic tile_sprite variable
 * @param {Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_variable_tile_sprite_get'] = function (
  block,
) {
  return BlocksHelper.getVariableName(block);
};

/**
 * Set dynamic variable
 */
Blocks['phaser_variable_set'] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldTextInput('default'),
      'VAR',
    );
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setOnChange(() => {
      BlocksHelper.checkVariableName(this);
    });
  },
};

/**
 * Set dynamic variable
 * @param {Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_variable_set'] = function (block) {
  return BlocksHelper.getVariableName(block);
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
      'VAR',
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
  return BlocksHelper.getVariableName(block);
};
