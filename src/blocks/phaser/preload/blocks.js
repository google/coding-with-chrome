/**
 * @fileoverview Phaser Blocks for Blockly.
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
 * Phaser preload section.
 */
Blockly.Blocks['phaser_preload'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.fileDownload())
      .appendField(i18t('on preload'));
    this.appendStatementInput('CODE')
      .appendField(i18t('do'))
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
 * Load Image
 */
Blockly.Blocks['phaser_load_image'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.image())
        .appendField(i18t('load image'))
        .appendField(new Blockly.FieldTextInput('image'), 'name');
    this.appendValueInput('image')
        .setCheck('Image')
        .appendField(i18t('from file'));
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'Preload');
    this.setNextStatement(true, 'Preload');
    this.setColour(165);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * Load Audio
 */
Blockly.Blocks['phaser_load_audio'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.audio())
        .appendField(i18t('load audio'))
        .appendField(new Blockly.FieldTextInput('sound'), 'name');
    this.appendValueInput('audio')
        .setCheck('Audio')
        .appendField(i18t('from file'));
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'Preload');
    this.setNextStatement(true, 'Preload');
    this.setColour(165);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};
