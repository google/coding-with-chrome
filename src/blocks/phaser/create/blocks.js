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
      .appendField(i18t('on create do'));
    this.appendStatementInput('CODE')
      .setAlign(Blockly.ALIGN_CENTRE)
      .setCheck(['Create']);
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Update');
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Stage background color.
 */
Blockly.Blocks['phaser_stage_background_color'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.point())
        .appendField('set background color (')
        .appendField(new Blockly.FieldColour('#000000'), 'color')
        .appendField(')');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Add background.
 */
Blockly.Blocks['phaser_add_background'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.point())
        .appendField('add background')
        .appendField(new Blockly.FieldTextInput('name'), 'sprite');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Add keyboard cursor keys.
 */
Blockly.Blocks['phaser_add_input_keyboard_cursor_keys'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.addCircle())
        .appendField('define');
    this.appendDummyInput()
        .appendField('as capture keyboard cursors keys');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Add keyboard spacebar.
 */
Blockly.Blocks['phaser_add_input_keyboard_spacebar'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.addCircle())
        .appendField('define');
    this.appendDummyInput()
        .appendField('as capture keyboard spacebar');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Add keyboard key.
 */
Blockly.Blocks['phaser_add_input_keyboard_key'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.addCircle())
        .appendField('define');
    this.appendDummyInput()
        .appendField('as capture keyboard key')
        .appendField(new Blockly.FieldDropdown([
          [i18t('shift'), 'Phaser.KeyCode.SHIFT'],
          [i18t('control'), 'Phaser.KeyCode.CONTROL'],
          [i18t('spacebar'), 'Phaser.KeyCode.SPACEBAR'],
          ['w', 'Phaser.KeyCode.W'],
          ['a', 'Phaser.KeyCode.A'],
          ['s', 'Phaser.KeyCode.S'],
          ['d', 'Phaser.KeyCode.D']
        ]), 'keycode');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Add mouse keys.
 */
Blockly.Blocks['phaser_add_input_mouse_keys'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.addCircle())
        .appendField('define');
    this.appendDummyInput()
        .appendField('as capture mouse keys');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Add group.
 */
Blockly.Blocks['phaser_add_group'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.addCircle())
        .appendField('define');
    this.appendDummyInput()
        .appendField('as group')
        .appendField(new Blockly.FieldTextInput('text'), 'name');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Timer Loop Event
 */
Blockly.Blocks['phaser_time_loop_event'] = {
  init: function() {
    this.appendValueInput('time')
        .setCheck('Number')
        .appendField(Blockly.BlocksTemplate.point())
        .appendField('repeat every');
    this.appendDummyInput()
        .appendField('milliseconds do');
    this.appendStatementInput('func')
        .setCheck(null);
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
