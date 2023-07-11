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
 * Add background tile sprite.
 */
Blocks['phaser_tile_sprite_background'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('BLOCKS_PHASER_ADD_BACKGROUND_IMAGE'))
      .appendField(
        new Blockly.FieldDropdown(() => {
          return BlocksHelper.phaserImage('bg_01');
        }),
        'sprite',
      )
      .appendField(BlocksTemplate.image());
    this.appendValueInput('x')
      .setCheck('Number')
      .appendField(i18next.t('WITH_AUTOSCROLL'));
    this.appendValueInput('y').setCheck('Number').appendField('x');
    this.appendDummyInput().appendField('y');
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
javascriptGenerator.forBlock['phaser_tile_sprite_background'] = function (
  block,
) {
  const scrollFactorX = javascriptGenerator.valueToCode(
    block,
    'x',
    javascriptGenerator.ORDER_ATOMIC,
  );
  const scrollFactorY = javascriptGenerator.valueToCode(
    block,
    'y',
    javascriptGenerator.ORDER_ATOMIC,
  );
  return `
    this.background = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, "${block.getFieldValue(
      'sprite',
    )}")
      .setOrigin(0)
      .setScrollFactor(${scrollFactorX}, ${scrollFactorY});
  `;
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
      .appendField(i18next.t('AS_FLOOR'))
      .appendField(
        new Blockly.FieldDropdown(() => {
          return BlocksHelper.phaserImage('floor');
        }),
        'sprite',
      )
      .appendField(BlocksTemplate.image());
    this.appendValueInput('x')
      .setCheck('Number')
      .appendField(i18next.t('WITH_AUTOSCROLL'));
    this.appendValueInput('y').setCheck('Number').appendField('x');
    this.appendDummyInput().appendField('y');
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
javascriptGenerator.forBlock['phaser_tile_sprite_floor_add'] = function (
  block,
) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC,
  );
  const scrollFactorX = javascriptGenerator.valueToCode(
    block,
    'x',
    javascriptGenerator.ORDER_ATOMIC,
  );
  const scrollFactorY = javascriptGenerator.valueToCode(
    block,
    'y',
    javascriptGenerator.ORDER_ATOMIC,
  );
  return `
    ${variable} = this.add.tileSprite(0, (this.cameras.main.height - 50), this.cameras.main.width, 50, "${block.getFieldValue(
      'sprite',
    )}")
      .setOrigin(0)
      .setScrollFactor(${scrollFactorX}, ${scrollFactorY});
    this.physics.add.existing(${variable}, false);
    ${variable}.body.immovable = true;
  `;
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
      .appendField(i18next.t('AS_CEILING'))
      .appendField(
        new Blockly.FieldDropdown(() => {
          return BlocksHelper.phaserImage('ceiling');
        }),
        'sprite',
      )
      .appendField(BlocksTemplate.image());
    this.appendValueInput('x')
      .setCheck('Number')
      .appendField(i18next.t('WITH_AUTOSCROLL'));
    this.appendValueInput('y').setCheck('Number').appendField('x');
    this.appendDummyInput().appendField('y');
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
javascriptGenerator.forBlock['phaser_tile_sprite_ceiling_add'] = function (
  block,
) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC,
  );
  const scrollFactorX = javascriptGenerator.valueToCode(
    block,
    'x',
    javascriptGenerator.ORDER_ATOMIC,
  );
  const scrollFactorY = javascriptGenerator.valueToCode(
    block,
    'y',
    javascriptGenerator.ORDER_ATOMIC,
  );

  return `
    ${variable} = this.add.tileSprite(0, 0, this.cameras.main.width, 50, "${block.getFieldValue(
      'sprite',
    )}")
      .setOrigin(0)
      .setScrollFactor(${scrollFactorX}, ${scrollFactorY});
    this.physics.add.existing(${variable}, false);
    ${variable}.body.immovable = true;
  `;
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
      .appendField(i18next.t('AS_TILE_SPRITE'))
      .appendField(
        new Blockly.FieldDropdown(() => {
          return BlocksHelper.phaserImage('tile_sprite');
        }),
        'sprite',
      )
      .appendField(BlocksTemplate.image())
      .appendField(i18next.t('WITH_POSITION'));
    this.appendValueInput('x').setCheck('Number');
    this.appendValueInput('y').appendField('x').setCheck('Number');
    this.appendDummyInput()
      .appendField('y')
      .appendField(i18next.t('WITH_SIZE'))
      .appendField(new Blockly.FieldNumber(400), 'width')
      .appendField('x')
      .appendField(new Blockly.FieldNumber(50), 'height')
      .appendField(i18next.t('WITH_GROUP'))
      .appendField(
        new Blockly.FieldTextInput('', BlocksHelper.validateText),
        'group',
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
javascriptGenerator.forBlock['phaser_tile_sprite_add'] = function (block) {
  const number_width = block.getFieldValue('width');
  const number_height = block.getFieldValue('height');
  const text_sprite = block.getFieldValue('sprite');
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC,
  );
  const value_x =
    javascriptGenerator.valueToCode(
      block,
      'x',
      javascriptGenerator.ORDER_ATOMIC,
    ) || 0;
  const value_y =
    javascriptGenerator.valueToCode(
      block,
      'y',
      javascriptGenerator.ORDER_ATOMIC,
    ) || 0;
  return (
    variable +
    ' = this.add.tileSprite(' +
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
      .appendField(i18next.t('BLOCKS_PHASER_TILE_SPRITE_CHANGE'));
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        [i18next.t('ALPHA_TRANSPARENT'), 'alpha'],
        [i18next.t('ANGLE'), 'angle'],
        [i18next.t('ANCHOR'), 'anchor.set'],
        [i18next.t('BUTTON_MODE'), 'buttonMode'],
        [i18next.t('FRAME'), 'frame'],
        [i18next.t('BLOCKS_HEIGHT'), 'height'],
        [i18next.t('ROTATION'), 'rotation'],
        [i18next.t('VISIBLE'), 'visible'],
        [i18next.t('BLOCKS_WIDTH'), 'width'],
        [i18next.t('TILE_POSITION_X'), 'tilePosition.y'],
        [i18next.t('TILE_POSITION_Y'), 'tilePosition.y'],
        ['x', 'x'],
        ['y', 'y'],
        ['z', 'y'],
      ]),
      'property',
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
javascriptGenerator.forBlock['phaser_tile_sprite_adjust'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC,
  );
  const dropdown_property = block.getFieldValue('property');
  const value_value = javascriptGenerator.valueToCode(
    block,
    'value',
    javascriptGenerator.ORDER_ATOMIC,
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
      .appendField(i18next.t('BLOCKS_PHASER_TILE_SPRITE_CROP'));
    this.appendDummyInput()
      .appendField(i18next.t('TOP'))
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(new Blockly.FieldNumber(0, 0), 'top');
    this.appendDummyInput()
      .appendField(i18next.t('RIGHT'))
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(new Blockly.FieldNumber(0, 0), 'right');
    this.appendDummyInput()
      .appendField(i18next.t('BOTTOM'))
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(new Blockly.FieldNumber(0, 0), 'bottom');
    this.appendDummyInput()
      .appendField(i18next.t('LEFT'))
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
javascriptGenerator.forBlock['phaser_tile_sprite_crop'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC,
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
      .appendField(i18next.t('BLOCKS_PHASER_TILE_SPRITE_DESTROY'));
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
javascriptGenerator.forBlock['phaser_tile_sprite_destroy'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC,
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
      .appendField(i18next.t('BLOCKS_PHASER_TILE_SPRITE_CHANGE'));
    this.appendValueInput('x')
      .setCheck('Number')
      .appendField(i18next.t('WITH_AUTOSCROLL'));
    this.appendValueInput('y').setCheck('Number').appendField('x');
    this.appendDummyInput().appendField('y');
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
javascriptGenerator.forBlock['phaser_tile_sprite_autoScroll'] = function (
  block,
) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC,
  );
  const value_x = javascriptGenerator.valueToCode(
    block,
    'x',
    javascriptGenerator.ORDER_ATOMIC,
  );
  const value_y = javascriptGenerator.valueToCode(
    block,
    'y',
    javascriptGenerator.ORDER_ATOMIC,
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
      .appendField(i18next.t('BLOCKS_PHASER_TILE_SPRITE_CHANGE'));
    this.appendDummyInput().appendField(
      i18next.t('AS_IMMOVABLE_BY_OTHER_OBJECTS'),
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
javascriptGenerator.forBlock['phaser_tile_sprite_immovable'] = function (
  block,
) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC,
  );
  return (
    'game.physics.arcade.enable(' +
    variable +
    ');\n' +
    variable +
    '.body.immovable = true;\n'
  );
};
