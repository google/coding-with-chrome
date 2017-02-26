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
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(i18t('on preload'));
    this.appendStatementInput('CODE')
      .setAlign(Blockly.ALIGN_CENTRE)
      .appendField('do');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};


/**
 * Load Image
 */
Blockly.Blocks['phaser_load_image'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('load image')
        .appendField(new Blockly.FieldTextInput('name'), 'name');
    this.appendValueInput('image')
        .setCheck('Image')
        .appendField('from file');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Load Audio
 */
Blockly.Blocks['phaser_load_audio'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('load audio')
        .appendField(new Blockly.FieldTextInput('name'), 'name');
    this.appendValueInput('audio')
        .setCheck('Audio')
        .appendField('from file');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
