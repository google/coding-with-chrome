/**
 * @fileoverview Phaser Audio Blocks for Blockly.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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


/**
 * Add background music.
 */
Blockly.Blocks['phaser_audio_add_bgm'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.addCircle())
        .appendField(i18t('@@BLOCKS__DEFINE'));
    this.appendDummyInput()
        .appendField(i18t('@@BLOCKS_PHASER__AUDIO_ADD_BGM'))
        .appendField(new Blockly.FieldTextInput(
            'bgm', Blockly.BlocksHelper['phaser_validate_text']), 'audio')
        .appendField(Blockly.BlocksTemplate.audio())
        .appendField(i18t('with volume'))
        .appendField(new Blockly.FieldNumber(100, 0, 200), 'volume')
        .appendField('%')
        .appendField(new Blockly.FieldDropdown([
          ['no loop', false],
          ['loop', true],
        ]), 'loop');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(255);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * Add audio.
 */
Blockly.Blocks['phaser_audio_add'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.addCircle())
        .appendField(i18t('@@BLOCKS__DEFINE'));
    this.appendDummyInput()
        .appendField(i18t('as audio'))
        .appendField(new Blockly.FieldTextInput(
            'audio', Blockly.BlocksHelper['phaser_validate_text']), 'audio')
        .appendField(Blockly.BlocksTemplate.audio())
        .appendField(i18t('with volume'))
        .appendField(new Blockly.FieldNumber(100, 0, 200), 'volume')
        .appendField('%')
        .appendField(new Blockly.FieldDropdown([
          ['no loop', false],
          ['loop', true],
        ]), 'loop');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(250);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * Play audio.
 */
Blockly.Blocks['phaser_audio_play'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.audio())
        .appendField(i18t('play audio'));
    this.setPreviousStatement(true, ['Create', 'Update', 'Input']);
    this.setNextStatement(true, ['Create', 'Update', 'Input']);
    this.setColour(245);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * Pause audio.
 */
Blockly.Blocks['phaser_audio_pause'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.audio())
        .appendField(i18t('@@BLOCKS_PHASER__AUDIO_PAUSE'));
    this.setPreviousStatement(true, ['Create', 'Update', 'Input']);
    this.setNextStatement(true, ['Create', 'Update', 'Input']);
    this.setColour(245);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * Resume audio.
 */
Blockly.Blocks['phaser_audio_resume'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.audio())
        .appendField(i18t('resume audio'));
    this.setPreviousStatement(true, ['Create', 'Update', 'Input']);
    this.setNextStatement(true, ['Create', 'Update', 'Input']);
    this.setColour(245);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * Stop audio.
 */
Blockly.Blocks['phaser_audio_stop'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.audio())
        .appendField(i18t('stop audio'));
    this.setPreviousStatement(true, ['Create', 'Update', 'Input']);
    this.setNextStatement(true, ['Create', 'Update', 'Input']);
    this.setColour(245);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};
