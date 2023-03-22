/**
 * @fileoverview Phaser Time Blocks for Blockly.
 *
 * @license Copyright 2023 The Coding with Chrome Authors.
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { Block, Blocks } from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

import { BlocksTemplate } from './BlocksTemplate';

import i18next from 'i18next';

/**
 * Timer Event
 */
Blocks['phaser_time_event'] = {
  init: function () {
    this.appendValueInput('time')
      .setCheck('Number')
      .appendField(BlocksTemplate.timelapse())
      .appendField(i18next.t('BLOCKS_PHASER_TIME_EVENT'));
    this.appendDummyInput().appendField(i18next.t('milliseconds'));
    this.appendStatementInput('func').appendField(i18next.t('@@BLOCKS__DO'));
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Timer Event
 * @param {Block} block
 * @return {string}
 */
javascriptGenerator['phaser_time_event'] = function (block) {
  const value_time = javascriptGenerator.valueToCode(
    block,
    'time',
    javascriptGenerator.ORDER_ATOMIC
  );
  const statements_func = javascriptGenerator.statementToCode(block, 'func');
  return (
    'game.time.events.add(' +
    value_time +
    ', ' +
    'function() {\n' +
    statements_func +
    '}, this);\n'
  );
};

/**
 * Timer Loop Event
 */
Blocks['phaser_time_loop_event'] = {
  init: function () {
    this.appendValueInput('time')
      .setCheck('Number')
      .appendField(BlocksTemplate.repeat())
      .appendField(i18next.t('BLOCKS_PHASER_TIME_LOOP_EVENT'));
    this.appendDummyInput().appendField(i18next.t('milliseconds'));
    this.appendStatementInput('func').appendField(i18next.t('@@BLOCKS__DO'));
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Timer Loop Event
 * @param {Block} block
 * @return {string}
 */
javascriptGenerator['phaser_time_loop_event'] = function (block) {
  const value_time = javascriptGenerator.valueToCode(
    block,
    'time',
    javascriptGenerator.ORDER_ATOMIC
  );
  const statements_func = javascriptGenerator.statementToCode(block, 'func');
  return (
    'game.time.events.loop(' +
    value_time +
    ', ' +
    'function() {\n' +
    statements_func +
    '}, this);\n'
  );
};
