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
 * Phaser input section.
 */
Blockly.JavaScript['phaser_input'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'input_: function(e) {\n' + statements_code + '},\n';
};


/**
 * Keyboard cursor is pressed.
 */
Blockly.JavaScript['phaser_input_keyboard_cursor_is_pressed'] = function(
    block) {
  var value_cursors = Blockly.JavaScript.valueToCode(
    block, 'cursors', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_direction = block.getFieldValue('direction');
  var code = value_cursors + '.' + dropdown_direction;
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Keyboard key is pressed.
 */
Blockly.JavaScript['phaser_input_keyboard_key_is_pressed'] = function(block) {
  var value_key = Blockly.JavaScript.valueToCode(
    block, 'key', Blockly.JavaScript.ORDER_ATOMIC);
  var code = value_key + '.isDown';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Mouse button is pressed.
 */
Blockly.JavaScript['phaser_input_mouse_key_is_pressed'] = function(
    block) {
  var value_mouse = Blockly.JavaScript.valueToCode(
    block, 'mouse', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_direction = block.getFieldValue('direction');
  var code = value_mouse + '.activePointer.' + dropdown_direction;
  return [code, Blockly.JavaScript.ORDER_NONE];
};
