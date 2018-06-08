/**
 * @fileoverview Phaser Blocks for Blockly.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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
 * World resize.
 */
Blockly.Blocks['phaser_world_resize'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.adjust())
        .appendField(i18t('set world size'))
        .appendField(new Blockly.FieldNumber(400, 0, 10000), 'width')
        .appendField('x')
        .appendField(new Blockly.FieldNumber(600, 0, 10000), 'height');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * World wrap.
 */
Blockly.Blocks['phaser_world_wrap'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.point())
        .appendField(i18t('World wrap sprite'));
    this.appendValueInput('value')
        .setCheck('Number')
        .appendField(i18t('padding'));
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'Update');
    this.setNextStatement(true, 'Update');
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * World attributes.
 */
Blockly.Blocks['phaser_world_attributes'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(i18t('get world'))
        .appendField(new Blockly.FieldDropdown([
          ['center x', 'centerX'],
          ['center y', 'centerY'],
          ['width', 'width'],
          ['height', 'height'],
        ]), 'attribute');
    this.setOutput(true, null);
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * World Arcade Physics.
 */
Blockly.Blocks['phaser_world_arcade_physics'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.adjust())
        .appendField(i18t('@@BLOCKS__SET'))
        .appendField(i18t('world arcade physics'))
        .appendField(new Blockly.FieldDropdown([
          [i18t('@@BLOCKS_PHASER__CHECK_COLLISION_DOWN'),
            'checkCollision.down'],
          [i18t('@@BLOCKS_PHASER__CHECK_COLLISION_UP'), 'checkCollision.up'],
          [i18t('@@BLOCKS_PHASER__CHECK_COLLISION_LEFT'),
            'checkCollision.left'],
          [i18t('@@BLOCKS_PHASER__CHECK_COLLISION_RIGHT'),
            'checkCollision.right'],
          [i18t('gravity x'), 'gravity.x'],
          [i18t('gravity y'), 'gravity.y'],
          [i18t('pause'), 'isPaused'],
        ]), 'property');
    this.appendValueInput('value')
        .setCheck('Number')
        .appendField(i18t('to'));
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setInputsInline(true);
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * World sort direction.
 */
Blockly.Blocks['phaser_world_sort_direction'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.adjust())
        .appendField(i18t('@@BLOCKS__SET'))
        .appendField(i18t('world sort direction'))
        .appendField(new Blockly.FieldDropdown([
          [i18t('none'), 0],
          [i18t('left to right'), 1],
          [i18t('right to left'), 2],
          [i18t('top to bottom'), 3],
          [i18t('bottom to top'), 4],
        ]), 'property');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setInputsInline(true);
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};
