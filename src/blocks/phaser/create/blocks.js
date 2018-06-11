/**
 * @fileoverview Phaser Create Blocks for Blockly.
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
 * Phaser create section.
 */
Blockly.Blocks['phaser_create'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.addCircle())
      .appendField(i18t('@@BLOCKS_PHASER__ON_CREATE'));
    this.appendStatementInput('CODE')
      .appendField(i18t('@@BLOCKS__DO'))
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
 * Stage background color.
 */
Blockly.Blocks['phaser_stage_background_color'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.point())
        .appendField(i18t('set background color'))
        .appendField(new Blockly.FieldColour('#000000'), 'color');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * Add background.
 */
Blockly.Blocks['phaser_add_background'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.point())
        .appendField(i18t('add background image'))
        .appendField(new Blockly.FieldDropdown(
          Blockly.BlocksHelper['phaser_image']('bg_01')), 'sprite')
        .appendField(Blockly.BlocksTemplate.image());
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * Add background with specific size.
 */
Blockly.Blocks['phaser_add_background_scaled'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.point())
        .appendField(i18t('add background image'))
        .appendField(new Blockly.FieldDropdown(
          Blockly.BlocksHelper['phaser_image']('bg_01')), 'sprite')
        .appendField(Blockly.BlocksTemplate.image())
        .appendField(i18t('with size'))
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
 * Timer Loop Event
 */
Blockly.Blocks['phaser_time_loop_event'] = {
  init: function() {
    this.appendValueInput('time')
        .setCheck('Number')
        .appendField(Blockly.BlocksTemplate.repeat())
        .appendField(i18t('@@BLOCKS_PHASER__TIME_LOOP_EVENT'));
    this.appendDummyInput()
        .appendField(i18t('milliseconds'));
    this.appendStatementInput('func')
        .appendField(i18t('@@BLOCKS__DO'));
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};
