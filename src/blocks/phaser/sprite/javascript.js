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
 * Add sprite.
 */
Blockly.JavaScript['phaser_sprite_add'] = function(block) {
  var text_sprite = block.getFieldValue('sprite');
  var variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  var value_x = Blockly.JavaScript.valueToCode(
    block, 'x', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  var value_y = Blockly.JavaScript.valueToCode(
    block, 'y', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  return variable + ' = game.add.sprite(' + value_x + ', ' + value_y +
    ', \'' + text_sprite + '\');\n';
};


/**
 * Adjust sprite.
 */
Blockly.JavaScript['phaser_sprite_adjust'] = function(block) {
  var variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_property = block.getFieldValue('property');
  var value_value = Blockly.JavaScript.valueToCode(block,
    'value', Blockly.JavaScript.ORDER_ATOMIC);
  switch (dropdown_property) {
    case 'anchor.set':
      return variable + '.' + dropdown_property + '(' + value_value + ');\n';
    case 'moveUp':
      return variable + '.y -= ' + value_value + ';\n';
    case 'moveDown':
      return variable + '.y += ' + value_value + ';\n';
    case 'moveLeft':
      return variable + '.x -= ' + value_value + ';\n';
    case 'moveRight':
      return variable + '.x += ' + value_value + ';\n';
    default:
      return variable + '.' + dropdown_property + ' = ' + value_value + ';\n';
  }
};


/**
 * Adjust sprite dimension.
 */
Blockly.JavaScript['phaser_sprite_adjust_dimension'] = function(block) {
  var variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  var value_width = Blockly.JavaScript.valueToCode(
    block, 'width', Blockly.JavaScript.ORDER_ATOMIC) || 50;
  var value_height = Blockly.JavaScript.valueToCode(
    block, 'height', Blockly.JavaScript.ORDER_ATOMIC) || 50;
  return variable + '.width = ' + value_width + ';\n' +
    variable + '.height = ' + value_height + ';\n';
};


/**
 * Get sprite.
 */
Blockly.JavaScript['phaser_sprite_get'] = function(block) {
  var variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_property = block.getFieldValue('property');
  var code = variable + '.' + dropdown_property;
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Destroy sprite.
 */
Blockly.JavaScript['phaser_sprite_destroy'] = function(block) {
  var variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return  variable + '.destroy();\n';
};


/**
 * Immovable sprite.
 */
Blockly.JavaScript['phaser_sprite_immovable'] = function(block) {
  var variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return 'game.physics.arcade.enable(' + variable + ');\n' +
    variable + '.body.immovable = true;\n';
};

