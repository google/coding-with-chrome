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

import { BlocksHelper } from './BlocksHelper';
import { BlocksTemplate } from './BlocksTemplate';

import i18next from 'i18next';

/**
 * Phaser preload section.
 */
Blocks['phaser_preload'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.fileDownload())
      .appendField(i18next.t('BLOCKS_PHASER_ON_PRELOAD'));
    this.appendStatementInput('CODE')
      .appendField(i18next.t('BLOCKS_DO'))
      .setAlign(Blockly.ALIGN_CENTRE)
      .setCheck(['Preload']);
    this.setPreviousStatement(true, 'Preload_');
    this.setNextStatement(true, 'Create_');
    this.setColour(165);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Phaser preload section.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_preload'] = function (block) {
  const statements_code = javascriptGenerator.statementToCode(block, 'CODE');
  return 'preload: function(e) {\n' + statements_code + '},\n';
};

/**
 * Load Image
 */
Blocks['phaser_load_image'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.image())
      .appendField(i18next.t('BLOCKS_PHASER_LOAD_IMAGE'))
      .appendField(
        new Blockly.FieldTextInput('image', BlocksHelper['validate_text']),
        'name'
      );
    this.appendValueInput('image').setCheck('Image');
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'Preload');
    this.setNextStatement(true, 'Preload');
    this.setColour(165);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Load Image.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_load_image'] = function (block) {
  const text_name = block.getFieldValue('name');
  const value_image = javascriptGenerator.valueToCode(
    block,
    'image',
    javascriptGenerator.ORDER_NONE
  );
  return "game.load.image('" + text_name + "', '" + value_image + "');\n";
};

/**
 * Load Audio
 */
Blocks['phaser_load_audio'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.audio())
      .appendField(i18next.t('BLOCKS_PHASER_LOAD_AUDIO'))
      .appendField(
        new Blockly.FieldTextInput('sound', BlocksHelper['validate_text']),
        'name'
      );
    this.appendValueInput('audio').setCheck('Audio');
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'Preload');
    this.setNextStatement(true, 'Preload');
    this.setColour(165);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Load Audio.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_load_audio'] = function (block) {
  const text_name = block.getFieldValue('name');
  const value_audio = javascriptGenerator
    .valueToCode(block, 'audio', javascriptGenerator.ORDER_NONE)
    .replace('file:', 'url:/library/');
  return "game.load.audio('" + text_name + "', '" + value_audio + "');\n";
};
