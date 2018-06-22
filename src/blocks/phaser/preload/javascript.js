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
 * Phaser preload section.
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['phaser_preload'] = function(block) {
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'preload: function(e) {\n' + statements_code + '},\n';
};


/**
 * Load Audio.
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['phaser_load_audio'] = function(block) {
  let text_name = block.getFieldValue('name');
  let value_audio = Blockly.JavaScript.valueToCode(block, 'audio',
    Blockly.JavaScript.ORDER_NONE).replace('file:', 'url:/library/');
  return 'game.load.audio(\'' + text_name + '\', \'' + value_audio + '\');\n';
};


/**
 * Load Image.
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['phaser_load_image'] = function(block) {
  let text_name = block.getFieldValue('name');
  let value_image = Blockly.JavaScript.valueToCode(block, 'image',
    Blockly.JavaScript.ORDER_NONE);
  return 'game.load.image(\'' + text_name + '\', \'' + value_image + '\');\n';
};
