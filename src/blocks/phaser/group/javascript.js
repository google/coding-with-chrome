/**
 * @fileoverview JavaScript for the Phaser Group Blocks.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
 * Add group.
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['phaser_group_add'] = function(block) {
  let text_name = block.getFieldValue('name');
  let variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + ' = game.add.group(undefined, \'' + text_name + '\');\n';
};


/**
 * Get living objects.
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['phaser_group_count_living'] = function(block) {
  let variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  let code = variable + '.countLiving()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};
