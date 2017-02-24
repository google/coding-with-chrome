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
 */
Blockly.JavaScript['phaser_game'] = function(block) {
  var text_name = block.getFieldValue('name');
  var number_width = block.getFieldValue('width');
  var number_height = block.getFieldValue('height');

  return 'var game = new Phaser.Game(' +
    '  ' + number_width + ', ' + number_height + ', Phaser.AUTO, \'' +
    text_name + '\');\n' +
    'game.state.add(\'main\', {\n' +
    '  preload: typeof preload !== \'undefined\' ? preload : function() {},\n' +
    '  create: typeof create !== \'undefined\' ? create : null,\n' +
    '  update: typeof update !== \'undefined\' ? update : null,\n' +
    '  render: typeof render !== \'undefined\' ? render : null\n' +
    '});\n' +
    'game.state.start(\'main\');\n';
};


/**
 * Phaser Game block.
 */
Blockly.JavaScript['phaser_game_restart'] = function() {
  return 'game.state.start(\'main\');\n';
};