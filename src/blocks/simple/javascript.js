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

goog.require('cwc.blocks');
goog.require('Blockly.JavaScript');


/**
 * @private {string}
 */
cwc.blocks.simple.JavaScript.drawPrefix_ = 'simple_draw_';


/**
 * @private {string}
 */
cwc.blocks.simple.JavaScript.textPrefix_ = 'simple_text_';


/**
 * Write text.
 */
cwc.blocks.addJavaScript('write', function(block) {
  var text = Blockly.JavaScript.valueToCode(block, 'TEXT',
      Blockly.JavaScript.ORDER_ATOMIC);
  return 'command.write(' + text + ');\n';
}, cwc.blocks.simple.JavaScript.textPrefix_);


/**
 * Draw circle.
 */
cwc.blocks.addJavaScript('circle', function(block) {
  var x = cwc.blocks.valueToCode(block, 'x');
  var y = cwc.blocks.valueToCode(block, 'y');
  var radius = cwc.blocks.valueToCode(block, 'radius');
  var fillColor = cwc.blocks.valueToCode(block, 'fillColor');
  var borderColor = cwc.blocks.valueToCode(block, 'borderColor');
  var borderSize = cwc.blocks.valueToCode(block, 'borderSize');
  return 'draw.circle(' + x + ', ' + y + ', ' + radius + ', ' + fillColor +
    ', ' + borderColor + ', ' + borderSize + ');\n';
}, cwc.blocks.simple.JavaScript.drawPrefix_);


/**
 * Clear screen.
 */
cwc.blocks.addJavaScript('clear', function(opt_block) {
  return 'draw.clear();\n';
}, cwc.blocks.simple.JavaScript.drawPrefix_);


/**
 * Draw rectangle.
 */
cwc.blocks.addJavaScript('rectangle', function(block) {
  var start_x = cwc.blocks.valueToCode(block, 'start_x');
  var start_y = cwc.blocks.valueToCode(block, 'start_y');
  var end_x = cwc.blocks.valueToCode(block, 'end_x');
  var end_y = cwc.blocks.valueToCode(block, 'end_y');
  var fillColor = cwc.blocks.valueToCode(block, 'fillColor');
  var borderColor = cwc.blocks.valueToCode(block, 'borderColor');
  var borderSize = cwc.blocks.valueToCode(block, 'borderSize');
  return 'draw.rectangle(' + start_x + ', ' + start_y + ', ' +
      end_x + ', ' + end_y + ', ' + fillColor + ', ' + borderColor +
      ', ' + borderSize + ');\n';
}, cwc.blocks.simple.JavaScript.drawPrefix_);


/**
 * Draw line.
 */
cwc.blocks.addJavaScript('line', function(block) {
  var start_x = cwc.blocks.valueToCode(block, 'start_x');
  var start_y = cwc.blocks.valueToCode(block, 'start_y');
  var end_x = cwc.blocks.valueToCode(block, 'end_x');
  var end_y = cwc.blocks.valueToCode(block, 'end_y');
  var fillColor = cwc.blocks.valueToCode(block, 'fillColor');
  var borderSize = cwc.blocks.valueToCode(block, 'borderSize');
  return 'draw.line(' + start_x + ', ' + start_y + ', ' +
      end_x + ', ' + end_y + ', ' + fillColor + ', ' +  borderSize + ');\n';
}, cwc.blocks.simple.JavaScript.drawPrefix_);


/**
 * Draw point.
 */
cwc.blocks.addJavaScript('point', function(block) {
  var x = cwc.blocks.valueToCode(block, 'x');
  var y = cwc.blocks.valueToCode(block, 'y');
  var fillColor = cwc.blocks.valueToCode(block, 'fillColor');
  var borderSize = cwc.blocks.valueToCode(block, 'borderSize');
  return 'draw.point(' + x + ', ' + y + ', ' + fillColor + ', ' +
      borderSize + ');\n';
}, cwc.blocks.simple.JavaScript.drawPrefix_);


/**
 * Draw ellipse.
 */
cwc.blocks.addJavaScript('ellipse', function(block) {
  var x = cwc.blocks.valueToCode(block, 'x');
  var y = cwc.blocks.valueToCode(block, 'y');
  var width = cwc.blocks.valueToCode(block, 'width');
  var height = cwc.blocks.valueToCode(block, 'height');
  var fillColor = cwc.blocks.valueToCode(block, 'fillColor');
  var borderColor = cwc.blocks.valueToCode(block, 'borderColor');
  var borderSize = cwc.blocks.valueToCode(block, 'borderSize');
  return 'draw.ellipse(' + x + ', ' + y + ', ' + width + ', ' + height +
      ', ' + fillColor + ', ' + borderColor + ', ' + borderSize + ');\n';
}, cwc.blocks.simple.JavaScript.drawPrefix_);
