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
import { BlocksTemplate } from '../../BlockEditor/blocks/BlocksTemplate';

import i18next from 'i18next';

/**
 * Add background tile sprite.
 */
Blocks['phaser_tile_sprite_background'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('add background image'))
      .appendField(
        new Blockly.FieldDropdown(BlocksHelper.phaserImage('bg_01')),
        'sprite'
      )
      .appendField(BlocksTemplate.image());
    this.appendValueInput('x')
      .setCheck('Number')
      .appendField(i18next.t('with'))
      .appendField(i18next.t('autoscroll to'));
    this.appendValueInput('y').setCheck('Number').appendField(i18next.t('x'));
    this.appendDummyInput().appendField(i18next.t('y'));
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(285);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add background tile sprite.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_tile_sprite_background'] = function (block) {
  const text_sprite = block.getFieldValue('sprite');
  const value_x = javascriptGenerator.valueToCode(
    block,
    'x',
    javascriptGenerator.ORDER_ATOMIC
  );
  const value_y = javascriptGenerator.valueToCode(
    block,
    'y',
    javascriptGenerator.ORDER_ATOMIC
  );
  return (
    'game.add.tileSprite(0, 0, game.world.width, game.world.height,' +
    "'" +
    text_sprite +
    "').autoScroll(" +
    value_x +
    ', ' +
    value_y +
    ');\n'
  );
};

/**
 * Add floor tile sprite.
 */
Blocks['phaser_tile_sprite_floor_add'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('BLOCKS_DEFINE'));
    this.appendDummyInput()
      .appendField(i18next.t('as floor'))
      .appendField(
        new Blockly.FieldDropdown(BlocksHelper.phaserImage('floor')),
        'sprite'
      )
      .appendField(BlocksTemplate.image());
    this.appendValueInput('x')
      .setCheck('Number')
      .appendField(i18next.t('with'))
      .appendField(i18next.t('autoscroll to'));
    this.appendValueInput('y').setCheck('Number').appendField(i18next.t('x'));
    this.appendDummyInput().appendField(i18next.t('y'));
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(285);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add floor tile sprite.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_tile_sprite_floor_add'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  const text_sprite = block.getFieldValue('sprite');
  const value_x = javascriptGenerator.valueToCode(
    block,
    'x',
    javascriptGenerator.ORDER_ATOMIC
  );
  const value_y = javascriptGenerator.valueToCode(
    block,
    'y',
    javascriptGenerator.ORDER_ATOMIC
  );
  return (
    variable +
    ' = game.add.tileSprite(0, (game.world.height - 50), ' +
    "game.world.width, 50, '" +
    text_sprite +
    "');\n" +
    variable +
    '.autoScroll(' +
    value_x +
    ', ' +
    value_y +
    ');\n' +
    'game.physics.arcade.enable(' +
    variable +
    ');\n' +
    variable +
    '.body.immovable = true;\n'
  );
};

/**
 * Add ceiling tile sprite.
 */
Blocks['phaser_tile_sprite_ceiling_add'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('BLOCKS_DEFINE'));
    this.appendDummyInput()
      .appendField(i18next.t('as ceiling'))
      .appendField(
        new Blockly.FieldDropdown(BlocksHelper.phaserImage('ceiling')),
        'sprite'
      )
      .appendField(BlocksTemplate.image());
    this.appendValueInput('x')
      .setCheck('Number')
      .appendField(i18next.t('with'))
      .appendField(i18next.t('autoscroll to'));
    this.appendValueInput('y').setCheck('Number').appendField(i18next.t('x'));
    this.appendDummyInput().appendField(i18next.t('y'));
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(285);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add ceiling tile sprite.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_tile_sprite_ceiling_add'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  const text_sprite = block.getFieldValue('sprite');
  const value_x = javascriptGenerator.valueToCode(
    block,
    'x',
    javascriptGenerator.ORDER_ATOMIC
  );
  const value_y = javascriptGenerator.valueToCode(
    block,
    'y',
    javascriptGenerator.ORDER_ATOMIC
  );
  return (
    variable +
    ' = game.add.tileSprite(0, 0, ' +
    "game.world.width, 50, '" +
    text_sprite +
    "');\n" +
    variable +
    '.autoScroll(' +
    value_x +
    ', ' +
    value_y +
    ');\n' +
    'game.physics.arcade.enable(' +
    variable +
    ');\n' +
    variable +
    '.body.immovable = true;\n'
  );
};

/**
 * Add tile sprite.
 */
Blocks['phaser_tile_sprite_add'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('BLOCKS_DEFINE'));
    this.appendDummyInput()
      .appendField(i18next.t('as tile sprite'))
      .appendField(
        new Blockly.FieldDropdown(BlocksHelper.phaserImage('tile_sprite')),
        'sprite'
      )
      .appendField(BlocksTemplate.image())
      .appendField(i18next.t('on position'));
    this.appendValueInput('x').setCheck('Number');
    this.appendValueInput('y').appendField('x').setCheck('Number');
    this.appendDummyInput()
      .appendField('y')
      .appendField(i18next.t('with size'))
      .appendField(new Blockly.FieldNumber(400), 'width')
      .appendField('x')
      .appendField(new Blockly.FieldNumber(50), 'height')
      .appendField(i18next.t('and group'))
      .appendField(
        new Blockly.FieldTextInput('', BlocksHelper.validateText),
        'group'
      );
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(290);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add tile sprite.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_tile_sprite_add'] = function (block) {
  const number_width = block.getFieldValue('width');
  const number_height = block.getFieldValue('height');
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
    ' = game.add.tileSprite(' +
    value_x +
    ', ' +
    value_y +
    ', ' +
    number_width +
    ', ' +
    number_height +
    ", '" +
    text_sprite +
    "');\n"
  );
};

/**
 * Adjust tile sprite.
 */
Blocks['phaser_tile_sprite_adjust'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.adjust())
      .appendField(i18next.t('set title sprite'));
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        [i18next.t('alpha transparent'), 'alpha'],
        [i18next.t('angle'), 'angle'],
        [i18next.t('anchor'), 'anchor.set'],
        [i18next.t('buttonMode'), 'buttonMode'],
        [i18next.t('frame'), 'frame'],
        [i18next.t('BLOCKS_HEIGHT'), 'height'],
        [i18next.t('rotation'), 'rotation'],
        [i18next.t('visible'), 'visible'],
        [i18next.t('BLOCKS_WIDTH'), 'width'],
        [i18next.t('tile position x'), 'tilePosition.y'],
        [i18next.t('tile position y'), 'tilePosition.y'],
        [i18next.t('x'), 'x'],
        [i18next.t('y'), 'y'],
        [i18next.t('z'), 'y'],
      ]),
      'property'
    );
    this.appendValueInput('value')
      .setCheck('Number')
      .appendField(i18next.t('BLOCKS_TO'));
    this.setPreviousStatement(true, ['Create', 'Update', 'Input']);
    this.setNextStatement(true, ['Create', 'Update', 'Input']);
    this.setColour(285);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Adjust tile sprite.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_tile_sprite_adjust'] = function (block) {
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
    case 'visible':
      return (
        variable +
        '.' +
        dropdown_property +
        ' = ' +
        (value_value ? true : false) +
        ';\n'
      );
    default:
      return variable + '.' + dropdown_property + ' = ' + value_value + ';\n';
  }
};

/**
 * Crop tile sprite.
 */
Blocks['phaser_tile_sprite_crop'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.adjust())
      .appendField(i18next.t('crop sprite with'));
    this.appendDummyInput()
      .appendField(i18next.t('top'))
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(new Blockly.FieldNumber(0, 0), 'top');
    this.appendDummyInput()
      .appendField(i18next.t('right'))
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(new Blockly.FieldNumber(0, 0), 'right');
    this.appendDummyInput()
      .appendField(i18next.t('bottom'))
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(new Blockly.FieldNumber(0, 0), 'bottom');
    this.appendDummyInput()
      .appendField(i18next.t('left'))
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(new Blockly.FieldNumber(0, 0), 'left');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(285);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Crop tile sprite.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_tile_sprite_crop'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  const number_top = block.getFieldValue('top');
  const number_right = block.getFieldValue('right');
  const number_bottom = block.getFieldValue('bottom');
  const number_left = block.getFieldValue('left');
  const crop_width = Number(number_right) + Number(number_left);
  const crop_height = Number(number_bottom) + Number(number_top);

  return (
    variable +
    '.tilePosition.y = -' +
    number_top +
    ';\n' +
    variable +
    '.width -= ' +
    crop_width +
    ';\n' +
    variable +
    '.height -= ' +
    crop_height +
    ';\n' +
    variable +
    '.tilePosition.x = -' +
    number_left +
    ';\n'
  );
};

/**
 * Destroy tile sprite.
 */
Blocks['phaser_tile_sprite_destroy'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.point())
      .appendField(i18next.t('BLOCKS_DESTROY'))
      .appendField(i18next.t('tile sprite'));
    this.appendValueInput('variable');
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['Create', 'Update', 'Input']);
    this.setNextStatement(true, ['Create', 'Update', 'Input']);
    this.setColour(285);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Destroy tile sprite.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_tile_sprite_destroy'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  return variable + '.destroy();\n';
};

/**
 * Auto scroll tile sprite.
 */
Blocks['phaser_tile_sprite_autoScroll'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.point())
      .appendField(i18next.t('set tile sprite'));
    this.appendValueInput('x')
      .setCheck('Number')
      .appendField(i18next.t('autoscroll to'));
    this.appendValueInput('y').setCheck('Number').appendField(i18next.t('x'));
    this.appendDummyInput().appendField(i18next.t('y'));
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(285);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Auto scroll tile sprite.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_tile_sprite_autoScroll'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  const value_x = javascriptGenerator.valueToCode(
    block,
    'x',
    javascriptGenerator.ORDER_ATOMIC
  );
  const value_y = javascriptGenerator.valueToCode(
    block,
    'y',
    javascriptGenerator.ORDER_ATOMIC
  );
  return variable + '.autoScroll(' + value_x + ', ' + value_y + ');\n';
};

/**
 * Immovable tile sprite.
 */
Blocks['phaser_tile_sprite_immovable'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.point())
      .appendField(i18next.t('set tile sprite'));
    this.appendDummyInput().appendField(
      i18next.t('as immovable by other objects')
    );
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(285);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Immovable title sprite.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_tile_sprite_immovable'] = function (block) {
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
