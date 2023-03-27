/**
 * @fileoverview Phaser Blocks for Blockly.
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
 */

/**
 * @author mbordihn@google.com (Markus Bordihn)
 */

import Blockly, { Blocks } from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

import { BlocksHelper } from './BlocksHelper';
import { BlocksTemplate } from './BlocksTemplate';

import i18next from 'i18next';

/**
 * Add sprite.
 */
Blocks['phaser_sprite_add'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('BLOCKS__DEFINE'));
    this.appendDummyInput()
      .appendField(i18next.t('as sprite'))
      .appendField(
        new Blockly.FieldDropdown(BlocksHelper.phaserImage('sprite')),
        'sprite'
      )
      .appendField(BlocksTemplate.image())
      .appendField(i18next.t('with'))
      .appendField(i18next.t('position'));
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
javascriptGenerator['phaser_sprite_add'] = function (block) {
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
  return (
    variable +
    ' = game.add.sprite(' +
    value_x +
    ', ' +
    value_y +
    ", '" +
    text_sprite +
    "');\n"
  );
};

/**
 * Adjust sprite.
 */
Blocks['phaser_sprite_adjust'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.adjust())
      .appendField(i18next.t('set sprite'));
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        [i18next.t('alpha transparent'), 'alpha'],
        [i18next.t('angle'), 'angle'],
        [i18next.t('anchor'), 'anchor.set'],
        [i18next.t('buttonMode'), 'buttonMode'],
        [i18next.t('BLOCKS__HEIGHT'), 'height'],
        [i18next.t('move down'), 'moveDown'],
        [i18next.t('move left'), 'moveLeft'],
        [i18next.t('move right'), 'moveRight'],
        [i18next.t('move up'), 'moveUp'],
        [i18next.t('rotation'), 'rotation'],
        [i18next.t('visible'), 'visible'],
        [i18next.t('BLOCKS__WIDTH'), 'width'],
        [i18next.t('x'), 'x'],
        [i18next.t('y'), 'y'],
        [i18next.t('z'), 'y'],
      ]),
      'property'
    );
    this.appendValueInput('value')
      .setCheck('Number')
      .appendField(i18next.t('BLOCKS__TO'));
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
javascriptGenerator['phaser_sprite_adjust'] = function (block) {
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
      return variable + '.' + dropdown_property + '(' + value_value + ');\n';
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
      .appendField(i18next.t('set sprite'));
    this.appendDummyInput().appendField(i18next.t('dimension to'));
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
javascriptGenerator['phaser_sprite_adjust_dimension'] = function (block) {
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
  return (
    variable +
    '.width = ' +
    value_width +
    ';\n' +
    variable +
    '.height = ' +
    value_height +
    ';\n'
  );
};

/**
 * Get sprite.
 */
Blocks['phaser_sprite_get'] = {
  init: function () {
    this.appendValueInput('variable').appendField(i18next.t('get sprite'));
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        [i18next.t('angle'), 'angle'],
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
javascriptGenerator['phaser_sprite_get'] = function (block) {
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
      .appendField(i18next.t('BLOCKS__DESTROY'))
      .appendField(i18next.t('sprite'));
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
javascriptGenerator['phaser_sprite_destroy'] = function (block) {
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
      .appendField(i18next.t('set sprite'));
    this.appendDummyInput().appendField(
      i18next.t('as immovable by other objects')
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
javascriptGenerator['phaser_sprite_immovable'] = function (block) {
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
