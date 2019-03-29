/**
 * @fileoverview Phaser Time Blocks for Blockly.
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
 */
Blockly.Blocks['phaser_time_event'] = {
  init: function() {
    this.appendValueInput('time')
        .setCheck('Number')
        .appendField(Blockly.BlocksTemplate.timelapse())
        .appendField(i18t('@@BLOCKS_PHASER__TIME_EVENT'));
    this.appendDummyInput()
        .appendField(i18t('milliseconds'));
    this.appendStatementInput('func')
        .appendField(i18t('@@BLOCKS__DO'));
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * Timer Loop Event
 */
Blockly.Blocks['phaser_time_loop_event'] = {
  init: function() {
    this.appendValueInput('time')
        .setCheck('Number')
        .appendField(Blockly.BlocksTemplate.repeat())
        .appendField(i18t('@@BLOCKS_PHASER__TIME_LOOP_EVENT'));
    this.appendDummyInput()
        .appendField(i18t('milliseconds'));
    this.appendStatementInput('func')
        .appendField(i18t('@@BLOCKS__DO'));
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};
