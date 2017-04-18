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
 * World wrap.
 */
Blockly.JavaScript['phaser_world_wrap'] = function(block) {
  var value_sprite = Blockly.JavaScript.valueToCode(block,
    'sprite', Blockly.JavaScript.ORDER_ATOMIC);
  var value_value = Blockly.JavaScript.valueToCode(block,
    'value', Blockly.JavaScript.ORDER_ATOMIC);
  return 'game.world.wrap(' + value_sprite + ', ' + (value_value || 0) + ');\n';
};


/**
 * World attributes.
 */
Blockly.JavaScript['phaser_world_attributes'] = function(block) {
  var dropdown_attribute = block.getFieldValue('attribute');
  var code = 'game.world.' + dropdown_attribute;
  return [code, Blockly.JavaScript.ORDER_NONE];
};
