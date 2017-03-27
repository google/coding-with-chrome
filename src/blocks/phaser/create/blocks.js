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
      .appendField(i18t('on create do'));
    this.appendStatementInput('CODE')
      .setAlign(Blockly.ALIGN_CENTRE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};


/**
 * Stage background color.
 */
Blockly.Blocks['phaser_stage_background_color'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Set backgroundColor (')
        .appendField(new Blockly.FieldColour('#000000'), 'color')
        .appendField(')');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
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
        .appendField('audio')
        .appendField(new Blockly.FieldTextInput('name'), 'audio')
        .appendField('with volume')
        .appendField(new Blockly.FieldNumber(100, 0, 200), 'volume')
        .appendField('%')
        .appendField(new Blockly.FieldDropdown([
          ['no loop', 'false'],
          ['loop', 'true'],
        ]), 'loop');
    this.setOutput(true, null);
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
        .appendField('Add background')
        .appendField(new Blockly.FieldTextInput('name'), 'sprite');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
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
        .appendField('sprite')
        .appendField(new Blockly.FieldTextInput('name'), 'sprite')
        .appendField('on position')
        .appendField(new Blockly.FieldNumber(50), 'x')
        .appendField(new Blockly.FieldNumber(50), 'y');
    this.setOutput(true, null);
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
    this.appendValueInput('text')
        .appendField('text')
        .setCheck('String');
    this.appendDummyInput()
        .appendField(new Blockly.FieldColour('#000000'), 'color')
        .appendField('on')
        .appendField(new Blockly.FieldNumber(10), 'x')
        .appendField(new Blockly.FieldNumber(10), 'y')
        .appendField('with style')
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
    this.setOutput(true, null);
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
        .appendField('group')
        .appendField(new Blockly.FieldTextInput('text'), 'name');
    this.setOutput(true, null);
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
        .appendField('repeat every');
    this.appendDummyInput()
        .appendField('milliseconds');
    this.appendStatementInput('func')
        .setCheck(null)
        .appendField('do');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
