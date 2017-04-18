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
  var value_obstacles = Blockly.JavaScript.valueToCode(
    block, 'obstacles', Blockly.JavaScript.ORDER_ATOMIC);
  var value_spaces = Blockly.JavaScript.valueToCode(
    block, 'spaces', Blockly.JavaScript.ORDER_ATOMIC);
  var value_sprite = Blockly.JavaScript.valueToCode(
    block, 'sprite', Blockly.JavaScript.ORDER_ATOMIC);
  var value_sprite_top = Blockly.JavaScript.valueToCode(
    block, 'sprite_top', Blockly.JavaScript.ORDER_ATOMIC);
  var value_sprite_bottom = Blockly.JavaScript.valueToCode(
    block, 'sprite_bottom', Blockly.JavaScript.ORDER_ATOMIC);
  var value_group = Blockly.JavaScript.valueToCode(
    block, 'group', Blockly.JavaScript.ORDER_ATOMIC);
  var value_x = Blockly.JavaScript.valueToCode(
    block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  var value_y = Blockly.JavaScript.valueToCode(
    block, 'y', Blockly.JavaScript.ORDER_ATOMIC);

  return 'cwc.framework.Phaser.VerticalObstacleGenerator(' +
    value_x + ', ' + value_y + ', ' + value_obstacles + ', ' +
    value_spaces + ', ' + value_sprite + ', ' + value_sprite_top + ', ' +
    value_sprite_bottom + ', ' + value_group + ');\n';
};
