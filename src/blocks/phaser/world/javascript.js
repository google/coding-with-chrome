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
 * World resize.
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['phaser_world_resize'] = function(block) {
  let number_width = block.getFieldValue('width');
  let number_height = block.getFieldValue('height');
  return 'game.world.resize(' + number_width + ', ' + number_height + ');\n';
};


/**
 * World wrap.
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['phaser_world_wrap'] = function(block) {
  let variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  let value_value = Blockly.JavaScript.valueToCode(block,
    'value', Blockly.JavaScript.ORDER_ATOMIC);
  return 'game.world.wrap(' + variable + ', ' + (value_value || 0) +
    ');\n';
};


/**
 * World attributes.
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['phaser_world_attributes'] = function(block) {
  let dropdown_attribute = block.getFieldValue('attribute');
  let code = 'game.world.' + dropdown_attribute;
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * World Arcade Physics.
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['phaser_world_arcade_physics'] = function(block) {
  let dropdown_property = block.getFieldValue('property');
  let value_value = Blockly.JavaScript.valueToCode(block,
    'value', Blockly.JavaScript.ORDER_ATOMIC);
  return 'game.physics.arcade.' + dropdown_property + ' = ' + value_value +
    ';\n';
};


/**
 * World sort direction.
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['phaser_world_sort_direction'] = function(block) {
  let dropdown_property = block.getFieldValue('property');
  return 'game.physics.arcade.sortDirection = ' +
    Number(dropdown_property) || 0 + ';\n';
};
