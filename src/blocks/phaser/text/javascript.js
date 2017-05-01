/**
 * @fileoverview JavaScript for the Phaser Blocks.
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
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_text_add'] = function(block) {
  let text_color = block.getFieldValue('color');
  let text_font = block.getFieldValue('font');
  let text_size = block.getFieldValue('size');
  let value_text = Blockly.JavaScript.valueToCode(
    block, 'text', Blockly.JavaScript.ORDER_ATOMIC) || '';
  let value_x = Blockly.JavaScript.valueToCode(
    block, 'x', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  let value_y = Blockly.JavaScript.valueToCode(
    block, 'y', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  if (/^\d+$/.test(text_size)) {
    text_size = text_size + 'px';
  }
  return 'game.add.text(' + value_x + ', ' + value_y + ', ' + value_text +
    ', { font: \'' + text_size + ' ' + text_font + '\', ' +
    'fill: \'' + text_color + '\'});\n';
};


/**
 * Add dynamic text.
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_dynamic_text_add'] = function(block) {
  let text_color = block.getFieldValue('color');
  let text_font = block.getFieldValue('font');
  let text_size = block.getFieldValue('size');
  let variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  let value_text = Blockly.JavaScript.valueToCode(
    block, 'text', Blockly.JavaScript.ORDER_ATOMIC) || '';
  let value_x = Blockly.JavaScript.valueToCode(
    block, 'x', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  let value_y = Blockly.JavaScript.valueToCode(
    block, 'y', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  if (/^\d+$/.test(text_size)) {
    text_size = text_size + 'px';
  }
  return variable + ' = game.add.text(' + value_x + ', ' + value_y + ', ' +
    value_text + ', { font: \'' + text_size + ' ' + text_font + '\', ' +
    'fill: \'' + text_color + '\'});\n';
};


/**
 * Add action text.
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_action_text_add'] = function(block) {
  let text_color = block.getFieldValue('color');
  let text_font = block.getFieldValue('font');
  let text_size = block.getFieldValue('size');
  let variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  let value_text = Blockly.JavaScript.valueToCode(
    block, 'text', Blockly.JavaScript.ORDER_ATOMIC) || '';
  let value_x = Blockly.JavaScript.valueToCode(
    block, 'x', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  let value_y = Blockly.JavaScript.valueToCode(
    block, 'y', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  if (/^\d+$/.test(text_size)) {
    text_size = text_size + 'px';
  }
  return variable + ' = game.add.text(' + value_x + ', ' + value_y + ', ' +
    value_text + ', { font: \'' + text_size + ' ' + text_font + '\', ' +
    'fill: \'' + text_color + '\'});\n' +
    variable + '.inputEnabled = true;\n' +
    variable + '.input.useHandCursor = true;\n';
};


/**
 * Adjust text.
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_text_change'] = function(block) {
  let value_text = Blockly.JavaScript.valueToCode(
    block, 'text', Blockly.JavaScript.ORDER_ATOMIC);
  let variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + '.text = ' + value_text + ';\n';
};


/**
 * Get text.
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_text_get'] = function(block) {
  let variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  let code = 'isNaN(' + variable + '.text) ? ' + variable + '.text : Number(' +
    variable + '.text)';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Text clicked.
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_text_clicked'] = function(block) {
  let variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  let statements_func = Blockly.JavaScript.statementToCode(block, 'func');
  return variable + '.events.onInputDown.add(function() {\n' +
    statements_func + '}, this);\n';
};
