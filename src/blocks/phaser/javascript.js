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
 * Phaser render section.
 */
Blockly.JavaScript['phaser_render'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'function render() {\n' + statements_code + '};\n';
};


/**
 * Input keyboard create cursor keys.
 */
Blockly.JavaScript['phaser_input_keyboard_create_cursor_keys'] = function() {
  var code = 'this.input.keyboard.createCursorKeys()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Input keyboard add key.
 */
Blockly.JavaScript['phaser_input_keyboard_add_key'] = function(block) {
  var dropdown_keycode = block.getFieldValue('keycode');
  var code = 'this.input.keyboard.addKey(' + dropdown_keycode + ')';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Input keyboard is pressed.
 */
Blockly.JavaScript['phaser_input_keyboard_is_pressed'] = function(block) {
  var value_cursors = Blockly.JavaScript.valueToCode(
    block, 'cursors', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_direction = block.getFieldValue('direction');
  var code = value_cursors + '.' + dropdown_direction;
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * World wrap.
 */
Blockly.JavaScript['phaser_world_wrap'] = function(block) {
  var value_sprite = Blockly.JavaScript.valueToCode(block,
    'sprite', Blockly.JavaScript.ORDER_ATOMIC);
  var value_value = Blockly.JavaScript.valueToCode(block,
    'value', Blockly.JavaScript.ORDER_ATOMIC);
  return 'game.world.wrap(' + value_sprite + ', ' + (value_value || 0) + ');\n';
};
