/**
 * @fileoverview JavaScript for the Simple blocks.
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
goog.provide('cwc.blocks.simple.JavaScript');

goog.require('Blockly');
goog.require('Blockly.JavaScript');



Blockly.JavaScript['text_write'] = function(block) {
  var text = Blockly.JavaScript.valueToCode(block, 'TEXT',
      Blockly.JavaScript.ORDER_NONE) || '\'\'';
  return 'write(' + text + ');\n';
};


Blockly.JavaScript['draw_circle'] = function(block) {
  var text_x = block.getFieldValue('x');
  var text_y = block.getFieldValue('y');
  var text_radius = block.getFieldValue('radius');
  var fillColor = block.getFieldValue('fillColor');
  var borderColor = block.getFieldValue('borderColor');
  var text_bordersize = block.getFieldValue('borderSize');
  return 'draw.circle(' + text_x + ', ' + text_y + ', ' + text_radius + ', "' +
      fillColor + '", "' + borderColor + '", ' + text_bordersize + ');\n';
};


Blockly.JavaScript['draw_rectangle'] = function(block) {
  var start_x = block.getFieldValue('start_x');
  var start_y = block.getFieldValue('start_y');
  var end_x = block.getFieldValue('end_x');
  var end_y = block.getFieldValue('end_y');
  var fillColor = block.getFieldValue('fillColor');
  var borderColor = block.getFieldValue('borderColor');
  var text_bordersize = block.getFieldValue('borderSize');
  return 'draw.rectangle(' + start_x + ', ' + start_y + ', ' +
      end_x + ', ' + end_y + ', "' + fillColor + '", "' + borderColor +
      '", ' + text_bordersize + ');\n';
};


Blockly.JavaScript['draw_line'] = function(block) {
  var start_x = block.getFieldValue('start_x');
  var start_y = block.getFieldValue('start_y');
  var end_x = block.getFieldValue('end_x');
  var end_y = block.getFieldValue('end_y');
  var fillColor = block.getFieldValue('fillColor');
  var text_bordersize = block.getFieldValue('borderSize');
  return 'draw.line(' + start_x + ', ' + start_y + ', ' +
      end_x + ', ' + end_y + ', "' + fillColor + '", ' +
      text_bordersize + ');\n';
};


Blockly.JavaScript['draw_point'] = function(block) {
  var x = block.getFieldValue('x');
  var y = block.getFieldValue('y');
  var fillColor = block.getFieldValue('fillColor');
  var text_bordersize = block.getFieldValue('borderSize');
  return 'draw.point(' + x + ', ' + y + ', "' + fillColor + '", ' +
      text_bordersize + ');\n';
};
