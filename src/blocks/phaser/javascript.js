/**
 * @fileoverview JavaScript for the Simple blocks.
 *
 * @license Copyright 2015 The Coding with Chrome Authors.
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
  var text_width = block.getFieldValue('width');
  var text_height = block.getFieldValue('height');
  return 'var game = new Phaser.Game(' +
    '  ' + text_width + ', ' + text_height + ', Phaser.CANVAS, \'' +
    text_name + '\' , {\n' +
    '  preload: typeof preload !== \'undefined\' ? preload : function() {},\n' +
    '  create: typeof create !== \'undefined\' ? create : null,\n' +
    '  update: typeof update !== \'undefined\' ? update : null,\n' +
    '  render: typeof render !== \'undefined\' ? render : null\n' +
    '});\n';
};


/**
 * Phaser preload section.
 */
Blockly.JavaScript['phaser_preload'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'function preload() {\n' + statements_code + '\n};';
};


/**
 * Load Image
 */
Blockly.JavaScript['phaser_load_image'] = function(block) {
  var text_name = block.getFieldValue('name');
  var text_image = block.getFieldValue('image');
  return 'game.load.image(\'' + text_name + '\', \'' + text_image + '\');';
};