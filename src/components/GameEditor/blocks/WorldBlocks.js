/**
 * @fileoverview Phaser Blocks for Blockly.
 *
 * @license Copyright 2020 The Coding with Chrome Authors.
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
 */

/**
 * @author mbordihn@google.com (Markus Bordihn)
 */

import Blockly, { Blocks } from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

import { BlocksTemplate } from '../../BlockEditor/blocks/BlocksTemplate';

import i18next from 'i18next';

/**
 * World resize.
 */
Blocks['phaser_world_resize'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.adjust())
      .appendField(i18next.t('BLOCKS_PHASER_WORLD_SET_SIZE'))
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
 * World resize.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_world_resize'] = function (block) {
  const number_width = block.getFieldValue('width');
  const number_height = block.getFieldValue('height');
  return 'game.world.resize(' + number_width + ', ' + number_height + ');\n';
};

/**
 * World wrap.
 */
Blocks['phaser_world_wrap'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.point())
      .appendField(i18next.t('BLOCKS_PHASER_WORLD_WRAP_SPRITE'));
    this.appendValueInput('value')
      .setCheck('Number')
      .appendField(i18next.t('BLOCKS_PADDING'));
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'Update');
    this.setNextStatement(true, 'Update');
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * World wrap.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_world_wrap'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  const value_value = javascriptGenerator.valueToCode(
    block,
    'value',
    javascriptGenerator.ORDER_ATOMIC
  );
  return (
    'this.physics.world.wrap(' + variable + ', ' + (value_value || 0) + ');\n'
  );
};

/**
 * World attributes.
 */
Blocks['phaser_world_attributes'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_PHASER_WORLD_GET'))
      .appendField(
        new Blockly.FieldDropdown([
          [i18next.t('CENTER_X'), 'centerX'],
          [i18next.t('CENTER_Y'), 'centerY'],
          [i18next.t('BLOCKS_WIDTH'), 'width'],
          [i18next.t('BLOCKS_HEIGHT'), 'height'],
        ]),
        'attribute'
      );
    this.setOutput(true, null);
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * World attributes.
 * @param {Blockly.Block} block
 * @return {any[]}
 */
javascriptGenerator['phaser_world_attributes'] = function (block) {
  const dropdown_attribute = block.getFieldValue('attribute');
  const code = 'game.world.' + dropdown_attribute;
  return [code, javascriptGenerator.ORDER_NONE];
};

/**
 * World Arcade Physics.
 */
Blocks['phaser_world_arcade_physics'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.adjust())
      .appendField(i18next.t('BLOCKS_PHASER_WORLD_ARCADE_PHYSICS_CHANGE'))
      .appendField(
        new Blockly.FieldDropdown([
          [
            i18next.t('BLOCKS_PHASER_CHECK_COLLISION_DOWN'),
            'checkCollision.down',
          ],
          [i18next.t('BLOCKS_PHASER_CHECK_COLLISION_UP'), 'checkCollision.up'],
          [
            i18next.t('BLOCKS_PHASER_CHECK_COLLISION_LEFT'),
            'checkCollision.left',
          ],
          [
            i18next.t('BLOCKS_PHASER_CHECK_COLLISION_RIGHT'),
            'checkCollision.right',
          ],
          [i18next.t('GRAVITY_X'), 'gravity.x'],
          [i18next.t('GRAVITY_Y'), 'gravity.y'],
          [i18next.t('PAUSED'), 'isPaused'],
        ]),
        'property'
      );
    this.appendValueInput('value')
      .setCheck('Number')
      .appendField(i18next.t('BLOCKS_TO'));
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setInputsInline(true);
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * World Arcade Physics.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_world_arcade_physics'] = function (block) {
  const dropdown_property = block.getFieldValue('property');
  const value_value = javascriptGenerator.valueToCode(
    block,
    'value',
    javascriptGenerator.ORDER_ATOMIC
  );
  return (
    'game.physics.arcade.' + dropdown_property + ' = ' + value_value + ';\n'
  );
};

/**
 * World sort direction.
 */
Blocks['phaser_world_sort_direction'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.adjust())
      .appendField(i18next.t('BLOCKS_PHASER_WORLD_SORT_DIRECTION_CHANGE'))
      .appendField(
        new Blockly.FieldDropdown([
          [i18next.t('NONE'), '0'],
          [i18next.t('LEFT_TO_RIGHT'), '1'],
          [i18next.t('RIGHT_TO_LEFT'), '2'],
          [i18next.t('TOP_TO_BOTTOM'), '3'],
          [i18next.t('BOTTOM_TO_TOP'), '4'],
        ]),
        'property'
      );
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
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_world_sort_direction'] = function (block) {
  const dropdown_property = block.getFieldValue('property');
  return (
    'game.physics.arcade.sortDirection = ' + Number(dropdown_property) ||
    0 + ';\n'
  );
};
