/**
 * @fileoverview JavaScript for the Phaser Audio Blocks.
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
 * Add audio.
 */
Blockly.JavaScript['phaser_audio_add'] = function(block) {
  var text_audio = block.getFieldValue('audio');
  var number_volume = block.getFieldValue('volume');
  var dropdown_loop = block.getFieldValue('loop');
  var variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + ' = game.add.audio(\'' + text_audio + '\', ' +
    number_volume / 100 + ', ' + (dropdown_loop || 'false') + ');\n';
};


/**
 * Play audio.
 */
Blockly.JavaScript['phaser_audio_play'] = function(block) {
  var variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + '.play();\n';
};


/**
 * Pause audio.
 */
Blockly.JavaScript['phaser_audio_pause'] = function(block) {
  var variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + '.pause();\n';
};


/**
 * Resume audio.
 */
Blockly.JavaScript['phaser_audio_resume'] = function(block) {
  var variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + '.resume();\n';
};


/**
 * Stop audio.
 */
Blockly.JavaScript['phaser_audio_stop'] = function(block) {
  var variable = Blockly.JavaScript.valueToCode(block,
    'variable', Blockly.JavaScript.ORDER_ATOMIC);
  return variable + '.stop();\n';
};
