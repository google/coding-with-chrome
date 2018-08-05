/**
 * @fileoverview JavaScript for the Lego WeDo 2.0 blocks.
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
 * Rotate power.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['lego_wedo2_rotate_power'] = function(block) {
  let dropdown_direction = block.getFieldValue('direction');
  let value_power = block.getFieldValue('power');
  let invert = dropdown_direction == 'left';
  let power = (invert ? -value_power : value_power);
  return 'wedo2.movePower(' + power + ', ' + power + ');\n';
};


/**
 * Play tone.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['lego_wedo2_play_tone'] = function(block) {
  let frequency = block.getFieldValue('frequency');
  let duration = block.getFieldValue('duration');
  return 'wedo2.playTone(' + frequency + ', ' + duration + ', ' +
    (Number(duration)) + ');\n';
};


/**
 * LED
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['lego_wedo2_led'] = function(block) {
  let color = block.getFieldValue('color');
  let colorMap = {
    '#000000': 0,
    '#ffc0cb': 1,
    '#800080': 2,
    '#0000ff': 3,
    '#00ffff': 4,
    '#32cd32': 5,
    '#00ff00': 6,
    '#ffff00': 7,
    '#ffa500': 8,
    '#ff0000': 9,
    '#add8e6': 10,
  };
  return 'wedo2.setLED(' + colorMap[color.toLowerCase()] + ', 100);\n';
};
