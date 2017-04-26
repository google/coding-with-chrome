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
 * Auto scroll tile sprite background.
 */
Blockly.JavaScript['phaser_tile_sprite_background'] = function(block) {
  var text_sprite = block.getFieldValue('sprite');
  var value_x = Blockly.JavaScript.valueToCode(block,
    'x', Blockly.JavaScript.ORDER_ATOMIC);
  var value_y = Blockly.JavaScript.valueToCode(block,
    'y', Blockly.JavaScript.ORDER_ATOMIC);
  return 'game.add.tileSprite(0, 0, game.world.width, game.world.height,' +
    '\'' + text_sprite + '\').autoScroll(' + value_x + ', ' + value_y + ');\n';
};


/**
 * Auto scroll tile sprite background.
 */
Blockly.JavaScript['phaser_tile_sprite_ground_add'] = function(block) {
  var variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  var text_sprite = block.getFieldValue('sprite');
  var value_x = Blockly.JavaScript.valueToCode(block,
    'x', Blockly.JavaScript.ORDER_ATOMIC);
  var value_y = Blockly.JavaScript.valueToCode(block,
    'y', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + ' = game.add.tileSprite(0, (game.world.height - 50), ' +
    'game.world.width, 50, \'' + text_sprite + '\');\n' +
    variable + '.autoScroll(' + value_x + ', ' + value_y + ');\n' +
    'game.physics.arcade.enable(' + variable + ');\n' +
    variable + '.body.immovable = true;\n';
};



/**
 * Add tile sprite.
 */
Blockly.JavaScript['phaser_tile_sprite_add'] = function(block) {
  var number_width = block.getFieldValue('width');
  var number_height = block.getFieldValue('height');
  var text_sprite = block.getFieldValue('sprite');
  var variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  var value_x = Blockly.JavaScript.valueToCode(
    block, 'x', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  var value_y = Blockly.JavaScript.valueToCode(
    block, 'y', Blockly.JavaScript.ORDER_ATOMIC) || 0;
  return variable + ' = game.add.tileSprite(' + value_x + ', ' + value_y +
    ', ' + number_width + ', ' + number_height + ', \'' + text_sprite +
    '\');\n';
};


/**
 * Adjust tile sprite.
 */
Blockly.JavaScript['phaser_tile_sprite_adjust'] = function(block) {
  var variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_property = block.getFieldValue('property');
  var value_value = Blockly.JavaScript.valueToCode(block,
    'value', Blockly.JavaScript.ORDER_ATOMIC);
  switch (dropdown_property) {
    case 'anchor.set':
      return variable + '.' + dropdown_property + '(' + value_value + ');\n';
    case 'visible':
      return variable + '.' + dropdown_property + ' = ' +
        (value_value ? true : false) + ';\n';
    default:
      return variable + '.' + dropdown_property + ' = ' + value_value + ';\n';
  }
};


/**
 * Crop tile sprite.
 */
Blockly.JavaScript['phaser_tile_sprite_crop'] = function(block) {
  var variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  var number_top = block.getFieldValue('top');
  var number_right = block.getFieldValue('right');
  var number_bottom = block.getFieldValue('bottom');
  var number_left = block.getFieldValue('left');
  var crop_width = Number(number_right) + Number(number_left);
  var crop_height = Number(number_bottom)  + Number(number_top);

  return variable + '.tilePosition.y = -' + number_top + ';\n' +
    variable + '.width -= ' + crop_width + ';\n' +
    variable + '.height -= ' + crop_height + ';\n' +
    variable + '.tilePosition.x = -' + number_left + ';\n';
};


/**
 * Destroy tile sprite.
 */
Blockly.JavaScript['phaser_tile_sprite_destroy'] = function(block) {
  var variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return  variable + '.destroy();\n';
};


/**
 * Auto scroll tile sprite.
 */
Blockly.JavaScript['phaser_tile_sprite_autoScroll'] = function(block) {
  var variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  var value_x = Blockly.JavaScript.valueToCode(block,
    'x', Blockly.JavaScript.ORDER_ATOMIC);
  var value_y = Blockly.JavaScript.valueToCode(block,
    'y', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + '.autoScroll(' + value_x + ', ' + value_y + ');\n';
};


/**
 * Immovable title sprite.
 */
Blockly.JavaScript['phaser_tile_sprite_immovable'] = function(block) {
  var variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return 'game.physics.arcade.enable(' + variable + ');\n' +
    variable + '.body.immovable = true;\n';
};
