/**
 * @fileoverview JavaScript for the general blocks.
 *
 * @license Copyright 2016 The Coding with Chrome Authors.
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
 * Infinity loop
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['general_infinity_loop'] = function(block) {
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'let infinity_loop = function() {\n' +
    '  try {\n' + statements_code + '  } catch (err) {\n    return;\n  }\n' +
    '  window.setTimeout(infinity_loop, 50);\n' +
  '};\ninfinity_loop();\n';
};


/**
 * Input angle block.
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['general_input_angle'] = function(block) {
  let value_angle = block.getFieldValue('angle');
  let code = value_angle || 0;
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Library file
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['general_file_library'] = function(block) {
  let value_filename = block.getFieldValue('filename').replace(/"/g, '');
  let code = '{{ file:' + value_filename + ' }}';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Library file image
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['general_file_library_image'] = function(block) {
  let value_filename = block.getFieldValue('filename').replace(/"/g, '');
  let code = '{{ file:' + value_filename + ' }}';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Library file audio
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['general_file_library_audio'] = function(block) {
  let value_filename = block.getFieldValue('filename').replace(/"/g, '');
  let code = '{{ file:' + value_filename + ' }}';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Library file text
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['general_file_library_text'] = function(block) {
  let value_filename = block.getFieldValue('filename').replace(/"/g, '');
  let code = '{{ file:' + value_filename + ' }}';
  return [code, Blockly.JavaScript.ORDER_NONE];
};
