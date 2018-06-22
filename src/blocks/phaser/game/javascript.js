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
 * Phaser Game block.
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['phaser_game'] = function(block) {
  let text_name = block.getFieldValue('name');
  let number_width =
    Number(block.getFieldValue('width')) || 'window.innerWidth';
  let number_height =
    Number(block.getFieldValue('height')) || 'window.innerHeight';
  return 'let game = new Phaser.Game(' + number_width + ', ' + number_height +
      ', Phaser.AUTO, \'' + text_name + '\');\n';
};


/**
 * Phaser Game state.
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['phaser_game_state'] = function(block) {
  let text_name = block.getFieldValue('name');
  let dropdown_autostart = block.getFieldValue('autostart');
  let statements_state = Blockly.JavaScript.statementToCode(block, 'state');
  return 'game.state.add(\'' + text_name + '\', {\n' +
    statements_state +
    '}, ' + (dropdown_autostart == 'true' ? true : false) + ');\n';
};


/**
 * Phaser Game start.
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['phaser_game_start'] = function(block) {
  let text_name = block.getFieldValue('name');
  return 'game.state.start(\'' + text_name + '\');\n';
};


/**
 * Phaser Game block.
 * @return {string}
 */
Blockly.JavaScript['phaser_game_restart'] = function() {
  return 'game.state.start(game.state.current);\n';
};
