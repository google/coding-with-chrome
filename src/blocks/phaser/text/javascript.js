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
 */
Blockly.JavaScript['phaser_text_add'] = function(block) {
  var text_color = block.getFieldValue('color');
  var text_font = block.getFieldValue('font');
  var text_size = block.getFieldValue('size');
  var variable = Blockly.JavaScript.valueToCode(
    block, 'variable', Blockly.JavaScript.ORDER_ATOMIC);
  var value_text = Blockly.JavaScript.valueToCode(
    block, 'text', Blockly.JavaScript.ORDER_ATOMIC) || '';
  var value_x = Blockly.JavaScript.valueToCode(
    block, 'x', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  var value_y = Blockly.JavaScript.valueToCode(
    block, 'y', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  return variable + ' = game.add.text(' + value_x + ', ' + value_y + ', ' +
    value_text + ', { font: \'' + text_size + ' ' +  text_font + '\', ' +
    'fill: \'' + text_color + '\'});\n';
};


/**
 * Add action text.
 */
Blockly.JavaScript['phaser_action_text_add'] = function(block) {
  var text_color = block.getFieldValue('color');
  var text_font = block.getFieldValue('font');
  var text_size = block.getFieldValue('size');
  var variable = Blockly.JavaScript.valueToCode(
    block, 'variable', Blockly.JavaScript.ORDER_ATOMIC);
  var value_text = Blockly.JavaScript.valueToCode(
    block, 'text', Blockly.JavaScript.ORDER_ATOMIC) || '';
  var value_x = Blockly.JavaScript.valueToCode(
    block, 'x', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  var value_y = Blockly.JavaScript.valueToCode(
    block, 'y', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  return variable + ' = game.add.text(' + value_x + ', ' + value_y + ', ' +
    value_text + ', { font: \'' + text_size + ' ' +  text_font + '\', ' +
    'fill: \'' + text_color + '\'});\n' +
    variable + '.inputEnabled = true;\n' +
    variable + '.input.useHandCursor = true;\n';
};


/**
 * Adjust text.
 */
Blockly.JavaScript['phaser_text_change'] = function(block) {
  var value_text = Blockly.JavaScript.valueToCode(
    block, 'text', Blockly.JavaScript.ORDER_ATOMIC);
  var variable = Blockly.JavaScript.valueToCode(
    block, 'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + '.text = ' + value_text + ';\n';
};


/**
 * Get text.
 */
Blockly.JavaScript['phaser_text_get'] = function(block) {
  var variable = Blockly.JavaScript.valueToCode(
    block, 'variable', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'isNaN(' + variable + '.text) ? ' + variable + '.text : Number(' +
    variable + '.text)';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Text clicked.
 */
Blockly.JavaScript['phaser_text_clicked'] = function(block) {
  var variable = Blockly.JavaScript.valueToCode(
    block, 'variable', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_func = Blockly.JavaScript.statementToCode(block, 'func');
  return variable + '.events.onInputDown.add(function() {\n' +
    statements_func + '}, this);\n';
};
