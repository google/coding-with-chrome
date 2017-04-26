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
 * Add text.
 */
Blockly.Blocks['phaser_text_add'] = {
  init: function() {
    this.appendValueInput('text')
        .appendField(Blockly.BlocksTemplate.addCircle())
        .appendField(i18t('add text'))
        .setCheck('String');
    this.appendValueInput('x')
        .setCheck('Number')
        .appendField(i18t('on'));
    this.appendValueInput('y')
        .appendField('x')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField('y')
        .appendField(i18t('with style'))
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
    this.setColour(260);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Add dynamic text.
 */
Blockly.Blocks['phaser_dynamic_text_add'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.addCircle())
        .appendField(i18t('define'));
    this.appendDummyInput()
         .appendField(i18t('as dynamic text'));
    this.appendValueInput('text')
        .setCheck('String');
    this.appendValueInput('x')
        .setCheck('Number')
        .appendField(i18t('on'));
    this.appendValueInput('y')
        .appendField('x')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField('y')
        .appendField(i18t('with style'))
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
    this.setColour(260);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Add action text.
 */
Blockly.Blocks['phaser_action_text_add'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.addCircle())
        .appendField(i18t('define'));
    this.appendDummyInput()
         .appendField(i18t('as action text'));
    this.appendValueInput('text')
        .setCheck('String');
    this.appendValueInput('x')
        .setCheck('Number')
        .appendField(i18t('on'));
    this.appendValueInput('y')
        .appendField('x')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField('y')
        .appendField(i18t('with style'))
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
    this.setColour(260);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Adjust text.
 */
Blockly.Blocks['phaser_text_change'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.adjust())
        .appendField(i18t('change'));
    this.appendValueInput('text')
        .appendField(i18t('text to'));
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['Create', 'Update', 'Input']);
    this.setNextStatement(true, ['Create', 'Update', 'Input']);
    this.setColour(255);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Get text.
 */
Blockly.Blocks['phaser_text_get'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(i18t('get text'));
    this.setOutput(true, null);
    this.setColour(255);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Text clicked.
 */
Blockly.Blocks['phaser_text_clicked'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.runningMan())
        .appendField(i18t('on click on action text'));
    this.appendStatementInput('func')
        .appendField(i18t('do'));
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(255);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
