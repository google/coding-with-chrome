/**
 * @fileoverview Phaser Audio Blocks for Blockly.
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
 * Add background music.
 */
Blocks['phaser_audio_add_bgm'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('@@BLOCKS__DEFINE'));
    this.appendDummyInput()
      .appendField(i18next.t('@@BLOCKS_PHASER__AUDIO_ADD_BGM'))
      .appendField(
        new Blockly.FieldTextInput('bgm', BlocksHelper.validateText),
        'audio'
      )
      .appendField(BlocksTemplate.audio())
      .appendField(i18next.t('with volume'))
      .appendField(new Blockly.FieldNumber(100, 0, 200), 'volume')
      .appendField('%')
      .appendField(
        new Blockly.FieldDropdown([
          ['no loop', 'false'],
          ['loop', 'true'],
        ]),
        'loop'
      );
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(255);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add background music.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_audio_add_bgm'] = function (block) {
  const text_audio = block.getFieldValue('audio');
  const number_volume = block.getFieldValue('volume');
  const dropdown_loop = block.getFieldValue('loop');
  const variable = Blockly.JavaScript.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  return (
    'if (typeof ' +
    variable +
    " === 'undefined') {\n" +
    '  ' +
    variable +
    " = game.add.audio('" +
    text_audio +
    "', " +
    number_volume / 100 +
    ', ' +
    dropdown_loop +
    ');\n' +
    '} else {\n  ' +
    variable +
    '.stop();\n}\n' +
    variable +
    '.play();\n'
  );
};

/**
 * Add audio.
 */
Blocks['phaser_audio_add'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('@@BLOCKS__DEFINE'));
    this.appendDummyInput()
      .appendField(i18next.t('as audio'))
      .appendField(
        new Blockly.FieldTextInput('audio', BlocksHelper.validateText),
        'audio'
      )
      .appendField(BlocksTemplate.audio())
      .appendField(i18next.t('with volume'))
      .appendField(new Blockly.FieldNumber(100, 0, 200), 'volume')
      .appendField('%')
      .appendField(
        new Blockly.FieldDropdown([
          ['no loop', 'false'],
          ['loop', 'true'],
        ]),
        'loop'
      );
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(250);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add audio.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_audio_add'] = function (block) {
  const text_audio = block.getFieldValue('audio');
  const number_volume = block.getFieldValue('volume');
  const dropdown_loop = block.getFieldValue('loop');
  const variable = Blockly.JavaScript.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  return (
    variable +
    " = game.add.audio('" +
    text_audio +
    "', " +
    number_volume / 100 +
    ', ' +
    dropdown_loop +
    ');\n'
  );
};

/**
 * Play audio.
 */
Blocks['phaser_audio_play'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.audio())
      .appendField(i18next.t('play audio'));
    this.setPreviousStatement(true, ['Create', 'Update', 'Input']);
    this.setNextStatement(true, ['Create', 'Update', 'Input']);
    this.setColour(245);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Play audio.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_audio_play'] = function (block) {
  const variable = Blockly.JavaScript.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  return variable + '.play();\n';
};

/**
 * Pause audio.
 */
Blocks['phaser_audio_pause'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.audio())
      .appendField(i18next.t('@@BLOCKS_PHASER__AUDIO_PAUSE'));
    this.setPreviousStatement(true, ['Create', 'Update', 'Input']);
    this.setNextStatement(true, ['Create', 'Update', 'Input']);
    this.setColour(245);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Pause audio.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_audio_pause'] = function (block) {
  const variable = Blockly.JavaScript.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  return variable + '.pause();\n';
};

/**
 * Resume audio.
 */
Blocks['phaser_audio_resume'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.audio())
      .appendField(i18next.t('resume audio'));
    this.setPreviousStatement(true, ['Create', 'Update', 'Input']);
    this.setNextStatement(true, ['Create', 'Update', 'Input']);
    this.setColour(245);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Resume audio.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_audio_resume'] = function (block) {
  const variable = Blockly.JavaScript.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  return variable + '.resume();\n';
};

/**
 * Stop audio.
 */
Blocks['phaser_audio_stop'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.audio())
      .appendField(i18next.t('stop audio'));
    this.setPreviousStatement(true, ['Create', 'Update', 'Input']);
    this.setNextStatement(true, ['Create', 'Update', 'Input']);
    this.setColour(245);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Stop audio.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_audio_stop'] = function (block) {
  const variable = Blockly.JavaScript.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  return variable + '.stop();\n';
};
