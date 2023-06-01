/**
 * @fileoverview Phaser Create Blocks for Blockly.
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

import { BlocksHelper } from './BlocksHelper';
import { BlocksTemplate } from '../../BlockEditor/blocks/BlocksTemplate';

import i18next from 'i18next';

/**
 * Phaser create section.
 */
Blocks['phaser_create'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('BLOCKS_PHASER_ON_CREATE'));
    this.appendStatementInput('CODE')
      .appendField(i18next.t('BLOCKS_DO'))
      .setAlign(Blockly.ALIGN_CENTRE)
      .setCheck(['Create']);
    this.setPreviousStatement(true, 'Create_');
    this.setNextStatement(true, ['Update_', 'Input_']);
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Phaser create section.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_create'] = function (block) {
  return `
  create (event) {
    // Empty generator groups to make sure game restarts works.
    this.block_group = null;
    this.obstacle_group = null;
    ${javascriptGenerator.statementToCode(block, 'CODE')}
  }`;
};

/**
 * Stage background color.
 */
Blocks['phaser_stage_background_color'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.point())
      .appendField(i18next.t('BLOCKS_PHASER_SET_BACKGROUND_COLOR'))
      .appendField(new Blockly.FieldColour('#000000'), 'color');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Stage background color.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_stage_background_color'] = function (block) {
  return `this.cameras.main.setBackgroundColor("${block.getFieldValue(
    'color'
  )}");`;
};

/**
 * Add background.
 */
Blocks['phaser_add_background'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.point())
      .appendField(i18next.t('BLOCKS_PHASER_ADD_BACKGROUND_IMAGE'))
      .appendField(
        new Blockly.FieldDropdown(() => {
          return BlocksHelper.phaserImage('bg_01');
        }),
        'sprite'
      )
      .appendField(BlocksTemplate.image());
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add background.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_add_background'] = function (block) {
  const text_sprite = block.getFieldValue('sprite');
  return "this.add.image(0, 0, '" + text_sprite + "');\n";
};

/**
 * Add background with specific size.
 */
Blocks['phaser_add_background_scaled'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.point())
      .appendField(i18next.t('BLOCKS_PHASER_ADD_BACKGROUND_IMAGE'))
      .appendField(
        new Blockly.FieldDropdown(() => {
          return BlocksHelper.phaserImage('bg_01');
        }),
        'sprite'
      )
      .appendField(BlocksTemplate.image())
      .appendField('with size')
      .appendField(new Blockly.FieldNumber(0, 0, 5760), 'width')
      .appendField('x')
      .appendField(new Blockly.FieldNumber(0, 0, 2160), 'height');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add background with specific size.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_add_background_scaled'] = function (block) {
  const text_sprite = block.getFieldValue('sprite');
  const number_width =
    Number(block.getFieldValue('width')) || 'this.cameras.main.width';
  const number_height =
    Number(block.getFieldValue('height')) || 'this.cameras.main.height';
  return (
    "let backgroundImage = game.add.image(0, 0, '" +
    text_sprite +
    "');\n" +
    'backgroundImage.dislplayWidth = ' +
    number_width +
    ';\n' +
    'backgroundImage.displayHeight = ' +
    number_height +
    ';\n'
  );
};
