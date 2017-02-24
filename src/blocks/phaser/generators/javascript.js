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


Blockly.JavaScript['phaser_generator_obstacle_vertical'] = function(block) {
  var number_x = block.getFieldValue('x');
  var number_y = block.getFieldValue('y');
  var number_num_blocks = block.getFieldValue('num_obstacle');
  var number_num_space = block.getFieldValue('num_space');
  var value_sprite = Blockly.JavaScript.valueToCode(
    block, 'sprite', Blockly.JavaScript.ORDER_ATOMIC);
  var value_sprite_top = Blockly.JavaScript.valueToCode(
    block, 'sprite_top', Blockly.JavaScript.ORDER_ATOMIC);
  var value_sprite_bottom = Blockly.JavaScript.valueToCode(
    block, 'sprite_bottom', Blockly.JavaScript.ORDER_ATOMIC);
  var value_group = Blockly.JavaScript.valueToCode(
    block, 'group', Blockly.JavaScript.ORDER_ATOMIC);
  //var number_velocity = block.getFieldValue('velocity');

  return 'cwc.framework.Phaser.VerticalObstacleGenerator(' +
    number_x + ', ' + number_y + ', ' + number_num_blocks + ', ' +
    number_num_space + ', ' + value_sprite + ', ' + value_sprite_top + ', ' +
    value_sprite_bottom + ', ' + value_group + ');\n';
};
