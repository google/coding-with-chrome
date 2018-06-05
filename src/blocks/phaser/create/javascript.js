/**
 * @fileoverview JavaScript for the Phaser Create Blocks.
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
 * Phaser create section.
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_create'] = function(block) {
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'create: function(e) {\n' +
    '  if (navigator.userAgent == \'CwC sandbox\') {' +
    'game.time.desiredFps = 30;}\n' + statements_code +
    '  obstacle_group = game.add.group(undefined, \'obstacle_group\');\n},\n';
};


/**
 * Stage background color.
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_stage_background_color'] = function(block) {
  let colour_color = block.getFieldValue('color');
  return 'game.stage.backgroundColor = \'' + colour_color + '\';\n';
};


/**
 * Add background.
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_add_background'] = function(block) {
  let text_sprite = block.getFieldValue('sprite');
  return 'game.add.image(0, 0, \'' + text_sprite + '\');\n';
};


/**
 * Add background with specific size.
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_add_background_scaled'] = function(block) {
  let text_sprite = block.getFieldValue('sprite');
  let number_width = Number(block.getFieldValue('width')) || 'game.world.width';
  let number_height =
    Number(block.getFieldValue('height')) || 'game.world.height';
  return 'var backgroundImage = game.add.image(0, 0, \'' +
    text_sprite + '\');\n' +
    'backgroundImage.width = ' + number_width + ';\n' +
    'backgroundImage.height = ' + number_height + ';\n';
};


/**
 * Add group.
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_add_group'] = function(block) {
  let text_name = block.getFieldValue('name');
  let variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + ' = game.add.group(undefined, \'' + text_name + '\');\n';
};


/**
 * Timer Loop Event
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['phaser_time_loop_event'] = function(block) {
  let value_time = Blockly.JavaScript.valueToCode(
    block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
  let statements_func = Blockly.JavaScript.statementToCode(block, 'func');
  return 'game.time.events.loop(' + value_time + ', ' +
    'function() {\n' + statements_func + '}, this);\n';
};
