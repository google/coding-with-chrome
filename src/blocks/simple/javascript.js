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
 * Write text.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['simple_text_write'] = function(block) {
  let text = Blockly.JavaScript.valueToCode(block, 'text',
      Blockly.JavaScript.ORDER_ATOMIC);
  return 'command.write(' + text + ');\n';
};


/**
 * Write line.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['simple_text_write_line'] = function(block) {
  let text = Blockly.JavaScript.valueToCode(block, 'text',
      Blockly.JavaScript.ORDER_ATOMIC);
  return 'command.writeLine(' + text + ');\n';
};


/**
 * Draw circle.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['simple_draw_circle'] = function(block) {
  let x = Blockly.JavaScript.valueToCode(block, 'x',
    Blockly.JavaScript.ORDER_ATOMIC);
  let y = Blockly.JavaScript.valueToCode(block, 'y',
    Blockly.JavaScript.ORDER_ATOMIC);
  let radius = Blockly.JavaScript.valueToCode(block, 'radius',
    Blockly.JavaScript.ORDER_ATOMIC);
  let fillColor = Blockly.JavaScript.valueToCode(block, 'fillColor',
    Blockly.JavaScript.ORDER_ATOMIC);
  let borderColor = Blockly.JavaScript.valueToCode(block, 'borderColor',
    Blockly.JavaScript.ORDER_ATOMIC);
  let borderSize = Blockly.JavaScript.valueToCode(block, 'borderSize',
    Blockly.JavaScript.ORDER_ATOMIC);
  return 'draw.circle(' + x + ', ' + y + ', ' + radius + ', ' + fillColor +
    ', ' + borderColor + ', ' + borderSize + ');\n';
};


/**
 * Clear screen.
 * @return {string}
 */
Blockly.JavaScript['simple_draw_clear'] = function() {
  return 'draw.clear();\n';
};


/**
 * Draw rectangle.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['simple_draw_rectangle'] = function(block) {
  let x = Blockly.JavaScript.valueToCode(block, 'x',
    Blockly.JavaScript.ORDER_ATOMIC);
  let y = Blockly.JavaScript.valueToCode(block, 'y',
    Blockly.JavaScript.ORDER_ATOMIC);
  let width = Blockly.JavaScript.valueToCode(block, 'width',
    Blockly.JavaScript.ORDER_ATOMIC);
  let height = Blockly.JavaScript.valueToCode(block, 'height',
    Blockly.JavaScript.ORDER_ATOMIC);
  let fillColor = Blockly.JavaScript.valueToCode(block, 'fillColor',
    Blockly.JavaScript.ORDER_ATOMIC);
  let borderColor = Blockly.JavaScript.valueToCode(block, 'borderColor',
    Blockly.JavaScript.ORDER_ATOMIC);
  let borderSize = Blockly.JavaScript.valueToCode(block, 'borderSize',
    Blockly.JavaScript.ORDER_ATOMIC);
  return 'draw.rectangle(' + x + ', ' + y + ', ' +
      width + ', ' + height + ', ' + fillColor + ', ' + borderColor +
      ', ' + borderSize + ');\n';
};


/**
 * Draw line.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['simple_draw_line'] = function(block) {
  let startX = Blockly.JavaScript.valueToCode(block, 'start_x',
    Blockly.JavaScript.ORDER_ATOMIC);
  let startY = Blockly.JavaScript.valueToCode(block, 'start_y',
    Blockly.JavaScript.ORDER_ATOMIC);
  let endX = Blockly.JavaScript.valueToCode(block, 'end_x',
    Blockly.JavaScript.ORDER_ATOMIC);
  let endY = Blockly.JavaScript.valueToCode(block, 'end_y',
    Blockly.JavaScript.ORDER_ATOMIC);
  let fillColor = Blockly.JavaScript.valueToCode(block, 'fillColor',
    Blockly.JavaScript.ORDER_ATOMIC);
  let borderSize = Blockly.JavaScript.valueToCode(block, 'borderSize',
    Blockly.JavaScript.ORDER_ATOMIC);
  return 'draw.line(' + startX + ', ' + startY + ', ' +
      endX + ', ' + endY + ', ' + fillColor + ', ' + borderSize + ');\n';
};


/**
 * Draw point.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['simple_draw_point'] = function(block) {
  let x = Blockly.JavaScript.valueToCode(block, 'x',
    Blockly.JavaScript.ORDER_ATOMIC);
  let y = Blockly.JavaScript.valueToCode(block, 'y',
    Blockly.JavaScript.ORDER_ATOMIC);
  let fillColor = Blockly.JavaScript.valueToCode(block, 'fillColor',
    Blockly.JavaScript.ORDER_ATOMIC);
  let borderSize = Blockly.JavaScript.valueToCode(block, 'borderSize',
    Blockly.JavaScript.ORDER_ATOMIC);
  return 'draw.point(' + x + ', ' + y + ', ' + fillColor + ', ' +
      borderSize + ');\n';
};


/**
 * Draw ellipse.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['simple_draw_ellipse'] = function(block) {
  let x = Blockly.JavaScript.valueToCode(block, 'x',
    Blockly.JavaScript.ORDER_ATOMIC);
  let y = Blockly.JavaScript.valueToCode(block, 'y',
    Blockly.JavaScript.ORDER_ATOMIC);
  let width = Blockly.JavaScript.valueToCode(block, 'width',
    Blockly.JavaScript.ORDER_ATOMIC);
  let height = Blockly.JavaScript.valueToCode(block, 'height',
    Blockly.JavaScript.ORDER_ATOMIC);
  let fillColor = Blockly.JavaScript.valueToCode(block, 'fillColor',
    Blockly.JavaScript.ORDER_ATOMIC);
  let borderColor = Blockly.JavaScript.valueToCode(block, 'borderColor',
    Blockly.JavaScript.ORDER_ATOMIC);
  let borderSize = Blockly.JavaScript.valueToCode(block, 'borderSize',
    Blockly.JavaScript.ORDER_ATOMIC);
  return 'draw.ellipse(' + x + ', ' + y + ', ' + width + ', ' + height +
      ', ' + fillColor + ', ' + borderColor + ', ' + borderSize + ');\n';
};


/**
 * Draw triangle.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['simple_draw_triangle'] = function(block) {
  let x1 = Blockly.JavaScript.valueToCode(block, 'x1',
    Blockly.JavaScript.ORDER_ATOMIC);
  let y1 = Blockly.JavaScript.valueToCode(block, 'y1',
    Blockly.JavaScript.ORDER_ATOMIC);
  let x2 = Blockly.JavaScript.valueToCode(block, 'x2',
    Blockly.JavaScript.ORDER_ATOMIC);
  let y2 = Blockly.JavaScript.valueToCode(block, 'y2',
    Blockly.JavaScript.ORDER_ATOMIC);
  let x3 = Blockly.JavaScript.valueToCode(block, 'x3',
    Blockly.JavaScript.ORDER_ATOMIC);
  let y3 = Blockly.JavaScript.valueToCode(block, 'y3',
    Blockly.JavaScript.ORDER_ATOMIC);
  let fillColor = Blockly.JavaScript.valueToCode(block, 'fillColor',
    Blockly.JavaScript.ORDER_ATOMIC);
  let borderColor = Blockly.JavaScript.valueToCode(block, 'borderColor',
    Blockly.JavaScript.ORDER_ATOMIC);
  let borderSize = Blockly.JavaScript.valueToCode(block, 'borderSize',
    Blockly.JavaScript.ORDER_ATOMIC);
  return 'draw.triangle(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 +
      ', ' + x3 + ', ' + y3 + ', ' + fillColor + ', ' + borderColor + ', ' +
      borderSize + ');\n';
};


/**
 * Draw text.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['simple_draw_text'] = function(block) {
  let text = Blockly.JavaScript.valueToCode(block, 'text',
    Blockly.JavaScript.ORDER_ATOMIC);
  let x = Blockly.JavaScript.valueToCode(block, 'x',
    Blockly.JavaScript.ORDER_ATOMIC);
  let y = Blockly.JavaScript.valueToCode(block, 'y',
    Blockly.JavaScript.ORDER_ATOMIC);
  let fillColor = Blockly.JavaScript.valueToCode(block, 'fillColor');
  return 'draw.text(' + text + ', ' + x + ', ' + y + ', ' + fillColor + ');\n';
};
