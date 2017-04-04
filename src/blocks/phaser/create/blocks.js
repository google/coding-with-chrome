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
    this.setHelpUrl('');
    this.setColour(280);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('on create do'));
    this.appendStatementInput('CODE')
      .setAlign(Blockly.ALIGN_CENTRE)
      .setCheck(['Create']);
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Update');
    this.setTooltip('');
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
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Add sprite.
 */
Blockly.Blocks['phaser_add_audio'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.point())
        .appendField('set')
        .appendField(new Blockly.FieldVariable('sound'), 'variable')
        .appendField('as audio')
        .appendField(new Blockly.FieldTextInput('name'), 'audio')
        .appendField('with volume')
        .appendField(new Blockly.FieldNumber(100, 0, 200), 'volume')
        .appendField('%')
        .appendField(new Blockly.FieldDropdown([
          ['no loop', 'false'],
          ['loop', 'true'],
        ]), 'loop');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(230);
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
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Add sprite.
 */
Blockly.Blocks['phaser_add_sprite'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.point())
        .appendField('set')
        .appendField(new Blockly.FieldVariable('player'), 'variable')
        .appendField('as sprite')
        .appendField(new Blockly.FieldTextInput('name'), 'sprite')
        .appendField('on position')
        .appendField(new Blockly.FieldNumber(50), 'x')
        .appendField(new Blockly.FieldNumber(50), 'y');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Add text.
 */
Blockly.Blocks['phaser_add_text'] = {
  init: function() {
    this.appendDummyInput()
         .appendField(Blockly.BlocksTemplate.point())
         .appendField('set')
         .appendField(new Blockly.FieldVariable('title'), 'variable')
         .appendField('as text');
    this.appendValueInput('text')
        .setCheck('String');
    this.appendDummyInput()
        .appendField('on')
        .appendField(new Blockly.FieldNumber(10), 'x')
        .appendField(new Blockly.FieldNumber(10), 'y')
        .appendField('with style')
        .appendField(new Blockly.FieldColour('#AAAAAA'), 'color')
        .appendField(new Blockly.FieldTextInput('16px'), 'size')
        .appendField(new Blockly.FieldDropdown([
          ['Arial Black', 'Arial Black'],
          ['Arial Narrow', 'Arial Narrow'],
          ['Arial', 'Arial'],
          ['Comic Sans MS', 'Comic Sans MS'],
          ['Courier New', 'Courier New'],
          ['Georgia', 'Georgia'],
          ['Helvetica', 'Helvetica'],
          ['Impact', 'Impact'],
          ['Lucida Console', 'Lucida Console'],
          ['Tahoma', 'Tahoma'],
          ['Times New Roman', 'Times New Roman'],
          ['Verdana', 'Verdana'],
          ['Webdings', 'Webdings'],
          ['Wingdings', 'Wingdings'],
          ['sans-serif', 'sans-serif'],
        ]), 'font');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Add tile sprite.
 */
Blockly.Blocks['phaser_add_tile_sprite'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.point())
        .appendField('set')
        .appendField(new Blockly.FieldVariable('blocks'), 'variable')
        .appendField('as tile sprite')
        .appendField(new Blockly.FieldTextInput('name'), 'sprite')
        .appendField('on position')
        .appendField(new Blockly.FieldNumber(50), 'x')
        .appendField(new Blockly.FieldNumber(50), 'y')
        .appendField('with size')
        .appendField(new Blockly.FieldNumber(50), 'width')
        .appendField(new Blockly.FieldNumber(50), 'height')
        .appendField('and group')
        .appendField(new Blockly.FieldTextInput('group'), 'group');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Add group.
 */
Blockly.Blocks['phaser_add_group'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.point())
        .appendField('set')
        .appendField(new Blockly.FieldVariable('objects'), 'variable')
        .appendField('as group')
        .appendField(new Blockly.FieldTextInput('text'), 'name');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(230);
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
        .appendField('milliseconds');
    this.appendStatementInput('func')
        .setCheck(null)
        .appendField('do');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
