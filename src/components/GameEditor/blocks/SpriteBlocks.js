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

import { BlocksHelper } from './BlocksHelper';
import { BlocksTemplate } from '../../BlockEditor/blocks/BlocksTemplate';

import i18next from 'i18next';

/**
 * Add sprite.
 */
Blocks['phaser_sprite_add'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('BLOCKS_DEFINE'));
    this.appendDummyInput()
      .appendField(i18next.t('AS_SPRITE'))
      .appendField(
        new Blockly.FieldDropdown(() => {
          return BlocksHelper.phaserImage('sprite');
        }),
        'sprite'
      )
      .appendField(BlocksTemplate.image())
      .appendField(i18next.t('WITH_POSITION'));
    this.appendValueInput('x').setCheck('Number');
    this.appendValueInput('y').appendField('x').setCheck('Number');
    this.appendDummyInput().appendField('y');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add sprite.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_sprite_add'] = function (block) {
  const text_sprite = block.getFieldValue('sprite');
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  const value_x =
    javascriptGenerator.valueToCode(
      block,
      'x',
      javascriptGenerator.ORDER_ATOMIC
    ) || 0;
  const value_y =
    javascriptGenerator.valueToCode(
      block,
      'y',
      javascriptGenerator.ORDER_ATOMIC
    ) || 0;
  return `${variable} = this.add.sprite(${value_x}, ${value_y}, '${text_sprite}');`;
};

/**
 * Adjust sprite.
 */
Blocks['phaser_sprite_adjust'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.adjust())
      .appendField(i18next.t('BLOCKS_PHASER_SPRITE_CHANGE'));
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        [i18next.t('ALPHA_TRANSPARENT'), 'alpha'],
        [i18next.t('ANGLE'), 'angle'],
        [i18next.t('ANCHOR'), 'anchor.set'],
        [i18next.t('BUTTON_MODE'), 'buttonMode'],
        [i18next.t('BLOCKS_HEIGHT'), 'height'],
        [i18next.t('MOVE_DOWN'), 'moveDown'],
        [i18next.t('MOVE_LEFT'), 'moveLeft'],
        [i18next.t('MOVE_RIGHT'), 'moveRight'],
        [i18next.t('MOVE_UP'), 'moveUp'],
        [i18next.t('ROTATION'), 'rotation'],
        [i18next.t('VISIBLE'), 'visible'],
        [i18next.t('BLOCKS_WIDTH'), 'width'],
        ['x', 'x'],
        ['y', 'y'],
        ['z', 'y'],
      ]),
      'property'
    );
    this.appendValueInput('value')
      .setCheck('Number')
      .appendField(i18next.t('BLOCKS_TO'));
    this.setPreviousStatement(true, ['Create', 'Input', 'Update']);
    this.setNextStatement(true, ['Create', 'Input', 'Update']);
    this.setColour(225);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Adjust sprite.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_sprite_adjust'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  const dropdown_property = block.getFieldValue('property');
  const value_value = javascriptGenerator.valueToCode(
    block,
    'value',
    javascriptGenerator.ORDER_ATOMIC
  );
  switch (dropdown_property) {
    case 'anchor.set':
      return (
        variable + '.setOrigin(' + value_value + ', ' + value_value + ');\n'
      );
    case 'moveUp':
      return variable + '.y -= ' + value_value + ';\n';
    case 'moveDown':
      return variable + '.y += ' + value_value + ';\n';
    case 'moveLeft':
      return variable + '.x -= ' + value_value + ';\n';
    case 'moveRight':
      return variable + '.x += ' + value_value + ';\n';
    default:
      return variable + '.' + dropdown_property + ' = ' + value_value + ';\n';
  }
};

/**
 * Adjust sprite dimension.
 */
Blocks['phaser_sprite_adjust_dimension'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.adjust())
      .appendField(i18next.t('BLOCKS_PHASER_SPRITE_CHANGE'));
    this.appendDummyInput().appendField(i18next.t('TO_DIMENSION'));
    this.appendValueInput('width').setCheck('Number');
    this.appendValueInput('height').appendField('x').setCheck('Number');
    this.setPreviousStatement(true, ['Create', 'Input', 'Update']);
    this.setNextStatement(true, ['Create', 'Input', 'Update']);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Adjust sprite dimension.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_sprite_adjust_dimension'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  const value_width =
    javascriptGenerator.valueToCode(
      block,
      'width',
      javascriptGenerator.ORDER_ATOMIC
    ) || 50;
  const value_height =
    javascriptGenerator.valueToCode(
      block,
      'height',
      javascriptGenerator.ORDER_ATOMIC
    ) || 50;
  return `
    ${variable}.displayWidth = ${value_width};
    ${variable}.displayHeight = ${value_height};
  `;
};

/**
 * Get sprite.
 */
Blocks['phaser_sprite_get'] = {
  init: function () {
    this.appendValueInput('variable').appendField(
      i18next.t('BLOCKS_PHASER_SPRITE_CHANGE')
    );
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        [i18next.t('ANGLE'), 'angle'],
        ['x', 'x'],
        ['y', 'y'],
      ]),
      'property'
    );
    this.setOutput(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Get sprite.
 * @param {Blockly.Block} block
 * @return {any[]}
 */
javascriptGenerator.forBlock['phaser_sprite_get'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  const dropdown_property = block.getFieldValue('property');
  const code = variable + '.' + dropdown_property;
  return [code, javascriptGenerator.ORDER_NONE];
};

/**
 * Destroy sprite.
 */
Blocks['phaser_sprite_destroy'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.point())
      .appendField(i18next.t('BLOCKS_PHASER_SPRITE_DESTROY'));
    this.appendValueInput('variable');
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['Create', 'Input', 'Update']);
    this.setNextStatement(true, ['Create', 'Update', 'Input']);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Destroy sprite.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_sprite_destroy'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  return variable + '.destroy();\n';
};

/**
 * Immovable sprite.
 */
Blocks['phaser_sprite_immovable'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.point())
      .appendField(i18next.t('BLOCKS_PHASER_SPRITE_CHANGE'));
    this.appendDummyInput().appendField(
      i18next.t('AS_IMMOVABLE_BY_OTHER_OBJECTS')
    );
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Immovable sprite.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_sprite_immovable'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  return (
    'game.physics.arcade.enable(' +
    variable +
    ');\n' +
    variable +
    '.body.immovable = true;\n'
  );
};
