/**
 * @fileoverview JavaScript for the general messenger display blocks.
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
 * Delay actions.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['general_messenger_delay'] = function(block) {
  let time = block.getFieldValue('time') * 1000;
  return 'cwcMessengerCommand.delay(' + time + ');\n';
};


/**
 * Display text on local screen.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['general_messenger_display_text'] = function(block) {
  let value_text = Blockly.JavaScript.valueToCode(
    block, 'text', Blockly.JavaScript.ORDER_ATOMIC) || '';
  return 'cwcMessengerDisplay.displayText(String(' + value_text + '));\n';
};


/**
 * Clear displayed text on local screen.
 * @return {string}
 */
Blockly.JavaScript['general_messenger_display_clear'] = function() {
  return 'cwcMessengerDisplay.clear();\n';
};
