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
 * Add tile sprite.
 */
Blockly.JavaScript['phaser_tile_sprite_add'] = function(block) {
  var number_width = block.getFieldValue('width');
  var number_height = block.getFieldValue('height');
  var text_sprite = block.getFieldValue('sprite');
  var variable = Blockly.JavaScript.valueToCode(
    block, 'variable', Blockly.JavaScript.ORDER_ATOMIC);
  var value_x = Blockly.JavaScript.valueToCode(
    block, 'x', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  var value_y = Blockly.JavaScript.valueToCode(
    block, 'y', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  return variable + ' = game.add.tileSprite(' + value_x + ', ' + value_y +
    ', ' + number_width + ', ' + number_height + ', \'' + text_sprite +
    '\');\n';
};


/**
 * Adjust sprite.
 */
Blockly.JavaScript['phaser_tile_sprite_adjust'] = function(block) {
  var value_sprite = Blockly.JavaScript.valueToCode(block,
    'sprite', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_property = block.getFieldValue('property');
  var value_value = Blockly.JavaScript.valueToCode(block,
    'value', Blockly.JavaScript.ORDER_ATOMIC);
  switch (dropdown_property) {
    case 'anchor.set':
      return value_sprite + '.' + dropdown_property +
        '(' + value_value + ');\n';
    case 'visible':
      return value_sprite + '.' + dropdown_property +
      ' = ' + (value_value ? true : false) + ';\n';
    default:
      return value_sprite + '.' + dropdown_property +
      ' = ' + value_value + ';\n';
  }
};


/**
 * Destroy tile sprite.
 */
Blockly.JavaScript['phaser_tile_sprite_destroy'] = function(block) {
  var value_sprite = Blockly.JavaScript.valueToCode(
    block, 'sprite', Blockly.JavaScript.ORDER_ATOMIC);
  return  value_sprite + '.destroy();\n';
};


/**
 * Auto scroll tile sprite.
 */
Blockly.JavaScript['phaser_tile_sprite_autoScroll'] = function(block) {
  var value_sprite = Blockly.JavaScript.valueToCode(block,
    'sprite', Blockly.JavaScript.ORDER_ATOMIC);
  var value_x = Blockly.JavaScript.valueToCode(block,
    'x', Blockly.JavaScript.ORDER_ATOMIC);
  var value_y = Blockly.JavaScript.valueToCode(block,
    'y', Blockly.JavaScript.ORDER_ATOMIC);
  return value_sprite + '.autoScroll(' + value_x + ', ' + value_y + ');\n';
};
