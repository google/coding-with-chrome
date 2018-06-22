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
 * Vertical obstacle generator.
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['phaser_generator_vertical_obstacle'] = function(block) {
  let text_sprite = block.getFieldValue('sprite');
  let value_obstacles = Blockly.JavaScript.valueToCode(
    block, 'obstacles', Blockly.JavaScript.ORDER_ATOMIC);
  let value_spaces = Blockly.JavaScript.valueToCode(
    block, 'spaces', Blockly.JavaScript.ORDER_ATOMIC);
  let value_sprite_top = Blockly.JavaScript.valueToCode(
    block, 'sprite_top', Blockly.JavaScript.ORDER_ATOMIC);
  let value_sprite_bottom = Blockly.JavaScript.valueToCode(
    block, 'sprite_bottom', Blockly.JavaScript.ORDER_ATOMIC);
  let value_group = Blockly.JavaScript.valueToCode(
    block, 'group', Blockly.JavaScript.ORDER_ATOMIC);
  let value_x = Blockly.JavaScript.valueToCode(
    block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  let value_y = Blockly.JavaScript.valueToCode(
    block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');

  return 'if (typeof ' + value_group + ' === \'undefined\' || !' + value_group +
    ') {\n  ' + value_group + ' = game.add.group(undefined, ' +
    '\'obstacle_group\');\n' + '}\n' +
    'cwc.framework.Phaser.VerticalObstacleGenerator(\n  ' +
    value_x + ', ' + value_y + ', ' + value_obstacles + ', ' +
    value_spaces + ', \'' + text_sprite + '\', ' + value_sprite_top + ', ' +
    value_sprite_bottom + ', ' + value_group + ', ' + (statements_code ?
      'function(arcadeSpriteCustom) {\n' + statements_code + '}' : '') + ');\n';
};


/**
 * Random vertical obstacle generator.
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['phaser_generator_random_vertical_obstacle'] = function(
    block) {
  let text_sprite = block.getFieldValue('sprite');
  let value_obstacles = Blockly.JavaScript.valueToCode(
    block, 'obstacles', Blockly.JavaScript.ORDER_ATOMIC);
  let value_sprite_optional = Blockly.JavaScript.valueToCode(
    block, 'sprite_optional', Blockly.JavaScript.ORDER_ATOMIC);
  let value_group = Blockly.JavaScript.valueToCode(
    block, 'group', Blockly.JavaScript.ORDER_ATOMIC);
  let value_x = Blockly.JavaScript.valueToCode(
    block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  let value_y = Blockly.JavaScript.valueToCode(
    block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  let dropdown_direction = block.getFieldValue('direction');
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');

  return 'if (typeof ' + value_group + ' === \'undefined\' || !' + value_group +
    ') {\n  ' + value_group + ' = game.add.group(undefined, ' +
    '\'obstacle_group\');\n' + '}\n' +
    'cwc.framework.Phaser.RandomVerticalObstacleGenerator(\n  ' +
    value_x + ', ' + value_y + ', ' + value_obstacles + ', \'' +
    text_sprite + '\', ' + value_sprite_optional + ', ' +
    value_group + ', \'' + dropdown_direction + '\', ' + (statements_code ?
      'function(arcadeSpriteCustom) {\n' + statements_code + '}' : '') + ');\n';
};


/**
 * Obstacle generator matrix.
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['phaser_generator_matrix_block'] = function(
  block) {
  let text_sprite = block.getFieldValue('sprite');
  let value_x = Blockly.JavaScript.valueToCode(
    block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  let value_y = Blockly.JavaScript.valueToCode(
    block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  let value_padding = Blockly.JavaScript.valueToCode(
    block, 'padding', Blockly.JavaScript.ORDER_ATOMIC);
  let value_group = Blockly.JavaScript.valueToCode(
    block, 'group', Blockly.JavaScript.ORDER_ATOMIC);
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  let data = [];
  for (let i = 0; i < 63; i++) {
    data.push(block.getFieldValue('Block' + i) == 'TRUE' ? 1 : 0);
  }
  return 'if (typeof ' + value_group + ' === \'undefined\' || !' + value_group +
    ') {\n  ' + value_group + ' = game.add.group(undefined, ' +
    '\'block_group\');\n' + '}\n' +
    'cwc.framework.Phaser.MatrixBlockGenerator(\n  ' + '\'' +
    text_sprite + '\', ' + '[' + data.toString() + '], ' +
    value_x + ', ' + value_y + ', ' + value_padding + ', ' + value_group +
    ', ' + (statements_code ?
      'function(arcadeSpriteCustom) {\n' + statements_code + '}' : '') + ');\n';
};


/**
 * Adjust arcade sprite.
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['phaser_generator_physics_arcade_attributes'] = function(
    block) {
  return Blockly.JavaScript['phaser_physics_arcade_sprite_adjust'](
    block, 'arcadeSpriteCustom');
};
