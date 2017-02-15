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
  return 'function create() {\n' + statements_code + '};\n';
};


/**
 * Stage background color.
 */
Blockly.JavaScript['phaser_stage_background_color'] = function(block) {
  var colour_color = block.getFieldValue('color');
  return 'game.stage.backgroundColor = \'' + colour_color + '\';\n';
};


/**
 * Add audio.
 */
Blockly.JavaScript['phaser_add_audio'] = function(block) {
  var text_audio = block.getFieldValue('audio');
  var number_volume = block.getFieldValue('volume');
  var dropdown_loop = block.getFieldValue('loop');
  var code = 'game.add.audio(' + text_audio + ', ' + number_volume / 100
    + ', \'' + dropdown_loop + '\')';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Add sprite.
 */
Blockly.JavaScript['phaser_add_sprite'] = function(block) {
  var number_x = block.getFieldValue('x');
  var number_y = block.getFieldValue('y');
  var text_sprite = block.getFieldValue('sprite');
  var code = 'game.add.sprite(' + number_x + ', ' + number_y + ', \'' +
    text_sprite + '\')';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Add text.
 */
Blockly.JavaScript['phaser_add_text'] = function(block) {
  var number_x = block.getFieldValue('x');
  var number_y = block.getFieldValue('y');
  var text_text = block.getFieldValue('text');
  var code = 'game.add.text(' + number_x + ', ' + number_y + ', \'' +
    text_text + '\')';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Add group.
 */
Blockly.JavaScript['phaser_add_group'] = function(block) {
  var text_name = block.getFieldValue('name');
  var code = 'game.add.group(null, \'' + text_name + '\')';
  return [code, Blockly.JavaScript.ORDER_NONE];
};
