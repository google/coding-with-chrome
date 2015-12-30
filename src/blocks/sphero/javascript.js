/**
 * @fileoverview JavaScript for the Sphero blocks.
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
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
goog.provide('cwc.blocks.sphero.JavaScript');

goog.require('Blockly');
goog.require('Blockly.JavaScript');



/**
 * @param {!Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['sphero_roll'] = function(block) {
  var value_speed = parseInt(Blockly.JavaScript.valueToCode(block, 'speed',
      Blockly.JavaScript.ORDER_ATOMIC));
  var value_heading = parseInt(block.getFieldValue('heading'));
  var duration = 500 + value_speed;
  var code = 'sphero.move(' + value_speed + ', ' + value_heading + ', 1, ' +
    duration + ');\n';
  return code;
};


/**
 * @param {!Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['sphero_rgb'] = function(block) {
  var colour_colour = parseInt(
      block.getFieldValue('colour').replace('#', ''), 16);
  var red = colour_colour >> 16;
  var green = colour_colour >> 8 & 0xFF;
  var blue = colour_colour & 0xFF;
  var code = 'sphero.setRGB(' + red + ', ' + green+ ', ' + blue + ', 1, 100' +
    ');\n';
  return code;
};


/**
 * @param {!Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['sphero_backlight'] = function(block) {
  var text_brightness = Math.min(Math.max(
      parseInt(block.getFieldValue('brightness')), 0), 254);
  var code = 'sphero.setBackLed(' + text_brightness + ', 100);\n';
  return code;
};


/**
 * @param {!Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['sphero_stop'] = function(block) {
  var dropdown_immediately = block.getFieldValue('immediately');
  var code = 'sphero.stop();\n';
  if (dropdown_immediately == 'when finished') {
    code = 'sphero.stop(100);\n';
  }
  return code;
};
