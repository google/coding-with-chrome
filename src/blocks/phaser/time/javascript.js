/**
 * @fileoverview JavaScript for the Phaser Time Blocks.
 *
 * @license Copyright 2019 The Coding with Chrome Authors.
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
 * Timer Event
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['phaser_time_event'] = function(block) {
  let value_time = Blockly.JavaScript.valueToCode(
    block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
  let statements_func = Blockly.JavaScript.statementToCode(block, 'func');
  return 'game.time.events.add(' + value_time + ', ' +
    'function() {\n' + statements_func + '}, this);\n';
};


/**
 * Timer Loop Event
 * @param {Blockly.Block} block
 * @return {string}
 */
Blockly.JavaScript['phaser_time_loop_event'] = function(block) {
  let value_time = Blockly.JavaScript.valueToCode(
    block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
  let statements_func = Blockly.JavaScript.statementToCode(block, 'func');
  return 'game.time.events.loop(' + value_time + ', ' +
    'function() {\n' + statements_func + '}, this);\n';
};
