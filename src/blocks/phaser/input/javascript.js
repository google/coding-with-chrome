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
 * Add keyboard cursor keys.
 */
Blockly.JavaScript['phaser_input_keyboard_cursor_keys_add'] = function(block) {
  var variable = Blockly.JavaScript.valueToCode(
    block, 'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + ' = this.input.keyboard.createCursorKeys();\n' +
    variable + '.down.onDown.add(this.input_, this);\n' +
    variable + '.left.onDown.add(this.input_, this);\n' +
    variable + '.right.onDown.add(this.input_, this);\n' +
    variable + '.up.onDown.add(this.input_, this);\n';
};


/**
 * Add keyboard spacebar.
 */
Blockly.JavaScript['phaser_input_keyboard_spacebar_add'] = function(block) {
  var variable = Blockly.JavaScript.valueToCode(
    block, 'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable +
    ' = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);\n' +
    variable + '.onDown.add(this.input_, this);\n';
};


/**
 * Add keyboard key.
 */
Blockly.JavaScript['phaser_input_keyboard_key_add'] = function(block) {
  var dropdown_keycode = block.getFieldValue('keycode');
  var variable = Blockly.JavaScript.valueToCode(
    block, 'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + ' = this.input.keyboard.addKey(' + dropdown_keycode +
    ');\n' +
    variable + '.onDown.add(this.input_, this);\n';
};


/**
 * Add mouse keys.
 */
Blockly.JavaScript['phaser_input_mouse_keys_add'] = function(block) {
  var variable = Blockly.JavaScript.valueToCode(
    block, 'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + ' = this.input.mouse.input;\n';
};


/**
 * Keyboard cursor is pressed.
 */
Blockly.JavaScript['phaser_input_keyboard_cursor_is_pressed'] = function(
    block) {
  var value_cursors = Blockly.JavaScript.valueToCode(
    block, 'cursors', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_direction = block.getFieldValue('direction');
  var code = value_cursors + dropdown_direction + '.isDown && e === ' +
    value_cursors + dropdown_direction;
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Keyboard cursor is hold pressed.
 */
Blockly.JavaScript['phaser_input_keyboard_cursor_is_hold_pressed'] = function(
    block) {
  var value_cursors = Blockly.JavaScript.valueToCode(
    block, 'cursors', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_direction = block.getFieldValue('direction');
  var code = value_cursors + dropdown_direction + '.isDown && e !== ' +
    value_cursors + dropdown_direction;
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Keyboard key is pressed.
 */
Blockly.JavaScript['phaser_input_keyboard_key_is_pressed'] = function(block) {
  var value_key = Blockly.JavaScript.valueToCode(
    block, 'key', Blockly.JavaScript.ORDER_ATOMIC);
  var code = value_key + '.isDown && e === ' + value_key;
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Keyboard key is hold pressed.
 */
Blockly.JavaScript['phaser_input_keyboard_key_is_hold_pressed'] = function(
    block) {
  var value_key = Blockly.JavaScript.valueToCode(
    block, 'key', Blockly.JavaScript.ORDER_ATOMIC);
  var code = value_key + '.isDown && e !== ' + value_key;
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
