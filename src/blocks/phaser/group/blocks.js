/**
 * @fileoverview Phaser Group Blocks for Blockly.
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
 * Add group.
 */
Blockly.Blocks['phaser_group_add'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.addCircle())
        .appendField(i18t('@@BLOCKS__DEFINE'));
    this.appendDummyInput()
        .appendField(i18t('as group'))
        .appendField(new Blockly.FieldTextInput('group_name',
          Blockly.BlocksHelper['phaser_validate_text']), 'name');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(30);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * Add group.
 */
Blockly.Blocks['phaser_group_count_living'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(i18t('@@BLOCKS_PHASER__COUNT_LIVING_OBJECTS'))
        .appendField(i18t('@@BLOCKS__IN'));
    this.setOutput(true, null);
    this.setColour(255);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};
