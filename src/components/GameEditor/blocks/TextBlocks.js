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
 */

/**
 * @author mbordihn@google.com (Markus Bordihn)
 */

import Blockly, { Blocks } from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

import { BlocksHelper } from './BlocksHelper';
import { BlocksTemplate } from '../../BlockEditor/blocks/BlocksTemplate';

import i18next from 'i18next';

/**
 * Add text.
 */
Blocks['phaser_text_add'] = {
  init: function () {
    this.appendValueInput('text')
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('add text'))
      .setCheck('String');
    this.appendValueInput('x').setCheck('Number').appendField(i18next.t('on'));
    this.appendValueInput('y').appendField('x').setCheck('Number');
    this.appendDummyInput()
      .appendField('y')
      .appendField(i18next.t('with style'))
      .appendField(new Blockly.FieldColour('#AAAAAA'), 'color')
      .appendField(
        new Blockly.FieldTextInput('16px', BlocksHelper.validateText),
        'size'
      )
      .appendField(
        new Blockly.FieldDropdown([
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
        ]),
        'font'
      );
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(260);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add text.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_text_add'] = function (block) {
  const text_color = block.getFieldValue('color');
  const text_font = block.getFieldValue('font');
  let text_size = block.getFieldValue('size');
  const value_text =
    javascriptGenerator.valueToCode(
      block,
      'text',
      javascriptGenerator.ORDER_ATOMIC
    ) || '';
  const value_x =
    javascriptGenerator.valueToCode(
      block,
      'x',
      javascriptGenerator.ORDER_ATOMIC
    ) || 0;
  const value_y =
    javascriptGenerator.valueToCode(
      block,
      'y',
      javascriptGenerator.ORDER_ATOMIC
    ) || 0;
  if (/^\d+$/.test(text_size)) {
    text_size = text_size + 'px';
  }
  return (
    'game.add.text(' +
    value_x +
    ', ' +
    value_y +
    ', ' +
    value_text +
    ", { font: '" +
    text_size +
    ' ' +
    text_font +
    "', " +
    "fill: '" +
    text_color +
    "'});\n"
  );
};

/**
 * Add dynamic text.
 */
Blocks['phaser_dynamic_text_add'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('BLOCKS_DEFINE'));
    this.appendDummyInput().appendField(i18next.t('as dynamic text'));
    this.appendValueInput('text').setCheck('String');
    this.appendValueInput('x').setCheck('Number').appendField(i18next.t('on'));
    this.appendValueInput('y').appendField('x').setCheck('Number');
    this.appendDummyInput()
      .appendField('y')
      .appendField(i18next.t('with style'))
      .appendField(new Blockly.FieldColour('#AAAAAA'), 'color')
      .appendField(
        new Blockly.FieldTextInput('16px', BlocksHelper.validateText),
        'size'
      )
      .appendField(
        new Blockly.FieldDropdown([
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
        ]),
        'font'
      );
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(260);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add dynamic text.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_dynamic_text_add'] = function (block) {
  const text_color = block.getFieldValue('color');
  const text_font = block.getFieldValue('font');
  let text_size = block.getFieldValue('size');
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  const value_text =
    javascriptGenerator.valueToCode(
      block,
      'text',
      javascriptGenerator.ORDER_ATOMIC
    ) || '';
  const value_x =
    javascriptGenerator.valueToCode(
      block,
      'x',
      javascriptGenerator.ORDER_ATOMIC
    ) || 0;
  const value_y =
    javascriptGenerator.valueToCode(
      block,
      'y',
      javascriptGenerator.ORDER_ATOMIC
    ) || 0;
  if (/^\d+$/.test(text_size)) {
    text_size = text_size + 'px';
  }
  return (
    variable +
    ' = game.add.text(' +
    value_x +
    ', ' +
    value_y +
    ', ' +
    value_text +
    ", { font: '" +
    text_size +
    ' ' +
    text_font +
    "', " +
    "fill: '" +
    text_color +
    "'});\n"
  );
};

/**
 * Add dynamic text.
 */
Blocks['phaser_dynamic_text_highscore_add'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('BLOCKS_DEFINE'));
    this.appendDummyInput().appendField(
      i18next.t('BLOCKS_PHASER_DYNAMIC_TEXT_ADD_HIGHSCORE')
    );
    this.appendValueInput('score').setCheck('Number');
    this.appendValueInput('x').setCheck('Number').appendField(i18next.t('on'));
    this.appendValueInput('y').appendField('x').setCheck('Number');
    this.appendDummyInput()
      .appendField('y')
      .appendField(i18next.t('with style'))
      .appendField(new Blockly.FieldColour('#AAAAAA'), 'color')
      .appendField(
        new Blockly.FieldTextInput('16px', BlocksHelper.validateText),
        'size'
      )
      .appendField(
        new Blockly.FieldDropdown([
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
        ]),
        'font'
      );
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(260);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add a dynamic high-score.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_dynamic_text_highscore_add'] = function (block) {
  const text_color = block.getFieldValue('color');
  const text_font = block.getFieldValue('font');
  let text_size = block.getFieldValue('size');
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  const value_score =
    javascriptGenerator.valueToCode(
      block,
      'score',
      javascriptGenerator.ORDER_ATOMIC
    ) || 0;
  const value_x =
    javascriptGenerator.valueToCode(
      block,
      'x',
      javascriptGenerator.ORDER_ATOMIC
    ) || 0;
  const value_y =
    javascriptGenerator.valueToCode(
      block,
      'y',
      javascriptGenerator.ORDER_ATOMIC
    ) || 0;
  if (/^\d+$/.test(text_size)) {
    text_size = text_size + 'px';
  }
  return (
    variable +
    ' = game.add.text(' +
    value_x +
    ', ' +
    value_y +
    ', ' +
    String(value_score) +
    ', ' +
    "{ font: '" +
    text_size +
    ' ' +
    text_font +
    "', " +
    "fill: '" +
    text_color +
    "'});\n"
  );
};

/**
 * Add action text.
 */
Blocks['phaser_action_text_add'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('BLOCKS_DEFINE'));
    this.appendDummyInput().appendField(i18next.t('as action text'));
    this.appendValueInput('text').setCheck('String');
    this.appendValueInput('x').setCheck('Number').appendField(i18next.t('on'));
    this.appendValueInput('y').appendField('x').setCheck('Number');
    this.appendDummyInput()
      .appendField('y')
      .appendField(i18next.t('with style'))
      .appendField(new Blockly.FieldColour('#AAAAAA'), 'color')
      .appendField(
        new Blockly.FieldTextInput('16px', BlocksHelper.validateText),
        'size'
      )
      .appendField(
        new Blockly.FieldDropdown([
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
        ]),
        'font'
      );
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(260);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add action text.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_action_text_add'] = function (block) {
  const text_color = block.getFieldValue('color');
  const text_font = block.getFieldValue('font');
  let text_size = block.getFieldValue('size');
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  const value_text =
    javascriptGenerator.valueToCode(
      block,
      'text',
      javascriptGenerator.ORDER_ATOMIC
    ) || '';
  const value_x =
    javascriptGenerator.valueToCode(
      block,
      'x',
      javascriptGenerator.ORDER_ATOMIC
    ) || 0;
  const value_y =
    javascriptGenerator.valueToCode(
      block,
      'y',
      javascriptGenerator.ORDER_ATOMIC
    ) || 0;
  if (/^\d+$/.test(text_size)) {
    text_size = text_size + 'px';
  }
  return (
    variable +
    ' = game.add.text(' +
    value_x +
    ', ' +
    value_y +
    ', ' +
    value_text +
    ", { font: '" +
    text_size +
    ' ' +
    text_font +
    "', " +
    "fill: '" +
    text_color +
    "'});\n" +
    variable +
    '.inputEnabled = true;\n' +
    variable +
    '.input.useHandCursor = true;\n'
  );
};

/**
 * Adjust text.
 */
Blocks['phaser_text_change'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.adjust())
      .appendField(i18next.t('BLOCKS_CHANGE'));
    this.appendValueInput('text').appendField(i18next.t('text to'));
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['Create', 'Update', 'Input']);
    this.setNextStatement(true, ['Create', 'Update', 'Input']);
    this.setColour(255);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Adjust text.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_text_change'] = function (block) {
  const value_text = javascriptGenerator.valueToCode(
    block,
    'text',
    javascriptGenerator.ORDER_ATOMIC
  );
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  return variable + '.text = ' + value_text + ';\n';
};

/**
 * Get text.
 */
Blocks['phaser_text_get'] = {
  init: function () {
    this.appendValueInput('variable').appendField(i18next.t('BLOCKS_GET_TEXT'));
    this.setOutput(true, null);
    this.setColour(255);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Get text.
 * @param {Blockly.Block} block
 * @return {any[]}
 */
javascriptGenerator['phaser_text_get'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  const code = variable + '.text';
  return [code, javascriptGenerator.ORDER_NONE];
};

/**
 * Get text number.
 */
Blocks['phaser_text_get_number'] = {
  init: function () {
    this.appendValueInput('variable').appendField(
      i18next.t('BLOCKS_GET_NUMBER')
    );
    this.setOutput(true, null);
    this.setColour(255);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Get text number.
 * @param {Blockly.Block} block
 * @return {any[]}
 */
javascriptGenerator['phaser_text_get_number'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  const code = 'Number(' + variable + '.text)';
  return [code, javascriptGenerator.ORDER_NONE];
};

/**
 * Text clicked.
 */
Blocks['phaser_text_clicked'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.runningMan())
      .appendField(i18next.t('on click on action text'));
    this.appendStatementInput('func').appendField(i18next.t('BLOCKS_DO'));
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(255);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Text clicked.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_text_clicked'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  const statements_func = javascriptGenerator.statementToCode(block, 'func');
  return (
    variable +
    '.events.onInputDown.add(function() {\n' +
    statements_func +
    '}, this);\n'
  );
};
