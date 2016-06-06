/**
 * @fileoverview JavaScript for the general blocks.
 *
 * @license Copyright 2016 Google Inc. All Rights Reserved.
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
goog.provide('cwc.blocks.general.JavaScript');

goog.require('Blockly');
goog.require('Blockly.JavaScript');

goog.require('cwc.blocks');


/**
 * @private {string}
 */
cwc.blocks.general.JavaScript.prefix_ = 'general_';


/**
 * Infinity loop
 */
cwc.blocks.addJavaScript('infinity_loop', function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var infinity_loop = function() {\n' +
    '  try {\n' + statements_code + '  } catch (err) {\n    return;\n  }\n' +
    '  window.setTimeout(infinity_loop, 50);\n' +
  '}\ninfinity_loop();\n';
}, cwc.blocks.general.JavaScript.prefix_);
