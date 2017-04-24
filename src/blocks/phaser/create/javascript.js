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
 */
Blockly.JavaScript['phaser_create'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'create: function () {\n' +
    '  if (navigator.userAgent == \'CwC sandbox\') {' +
    'game.time.desiredFps = 30;}\n' + statements_code + '},\n';
};


/**
 * Stage background color.
 */
Blockly.JavaScript['phaser_stage_background_color'] = function(block) {
  var colour_color = block.getFieldValue('color');
  return 'game.stage.backgroundColor = \'' + colour_color + '\';\n';
};


/**
 * Add background.
 */
Blockly.JavaScript['phaser_add_background'] = function(block) {
  var text_sprite = block.getFieldValue('sprite');
  return 'game.add.sprite(0, 0, \'' + text_sprite + '\')\n';
};


/**
 * Add group.
 */
Blockly.JavaScript['phaser_add_group'] = function(block) {
  var text_name = block.getFieldValue('name');
  var variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + ' = game.add.group(undefined, \'' + text_name + '\');\n';
};


/**
 * Timer Loop Event
 */
Blockly.JavaScript['phaser_time_loop_event'] = function(block) {
  var value_time = Blockly.JavaScript.valueToCode(
    block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_func = Blockly.JavaScript.statementToCode(block, 'func');
  return 'game.time.events.loop(' + value_time + ', ' +
    'function() {\n' + statements_func + '}, this);\n';
};
