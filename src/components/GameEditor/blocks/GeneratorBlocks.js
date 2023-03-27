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
 * Vertical obstacle generator.
 */
Blocks['phaser_generator_vertical_obstacle'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.point())
      .appendField(i18next.t('BLOCKS_PHASER_GENERATOR_VERTICAL_OBSTACLE'))
      .appendField(
        new Blockly.FieldDropdown(BlocksHelper.phaserImage('obstacles')),
        'sprite'
      );
    this.appendValueInput('obstacles')
      .setCheck('Number')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(i18next.t('number of obstacles'));
    this.appendValueInput('spaces')
      .setCheck('Number')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(i18next.t('number of spaces'));
    this.appendValueInput('x')
      .setCheck('Number')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField('x');
    this.appendValueInput('y')
      .setCheck('Number')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField('y');
    this.appendValueInput('sprite_top')
      .setCheck('String')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(i18next.t('top sprite'));
    this.appendValueInput('sprite_bottom')
      .setCheck('String')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(i18next.t('bottom sprite'));
    this.appendValueInput('group')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(i18next.t('BLOCKS_GROUP'));
    this.appendStatementInput('CODE').setCheck('GeneratorArcadeAttribute');
    this.setInputsInline(false);
    this.setPreviousStatement(true, ['Create']);
    this.setNextStatement(true, ['Create']);
    this.setColour(105);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Vertical obstacle generator.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_generator_vertical_obstacle'] = function (block) {
  const text_sprite = block.getFieldValue('sprite');
  const value_obstacles = javascriptGenerator.valueToCode(
    block,
    'obstacles',
    javascriptGenerator.ORDER_ATOMIC
  );
  const value_spaces = javascriptGenerator.valueToCode(
    block,
    'spaces',
    javascriptGenerator.ORDER_ATOMIC
  );
  const value_sprite_top = javascriptGenerator.valueToCode(
    block,
    'sprite_top',
    javascriptGenerator.ORDER_ATOMIC
  );
  const value_sprite_bottom = javascriptGenerator.valueToCode(
    block,
    'sprite_bottom',
    javascriptGenerator.ORDER_ATOMIC
  );
  const value_group = javascriptGenerator.valueToCode(
    block,
    'group',
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
  const statements_code = javascriptGenerator.statementToCode(block, 'CODE');

  return (
    'if (typeof ' +
    value_group +
    " === 'undefined' || !" +
    value_group +
    ') {\n  ' +
    value_group +
    ' = game.add.group(undefined, ' +
    "'obstacle_group');\n" +
    '}\n' +
    'cwc.framework.Phaser.VerticalObstacleGenerator(\n  ' +
    value_x +
    ', ' +
    value_y +
    ', ' +
    value_obstacles +
    ', ' +
    value_spaces +
    ", '" +
    text_sprite +
    "', " +
    value_sprite_top +
    ', ' +
    value_sprite_bottom +
    ', ' +
    value_group +
    ', ' +
    (statements_code
      ? 'function(arcadeSpriteCustom) {\n' + statements_code + '}'
      : '') +
    ');\n'
  );
};

/**
 * Random vertical obstacle generator.
 */
Blocks['phaser_generator_random_vertical_obstacle'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.point())
      .appendField(
        i18next.t('BLOCKS_PHASER_GENERATOR_RANDOM_VERTICAL_OBSTACLE')
      )
      .appendField(
        new Blockly.FieldDropdown(BlocksHelper.phaserImage('block')),
        'sprite'
      );
    this.appendValueInput('obstacles')
      .setCheck('Number')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(i18next.t('number of obstacles'));
    this.appendValueInput('x')
      .setCheck('Number')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField('x');
    this.appendValueInput('y')
      .setCheck('Number')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField('y');
    this.appendValueInput('sprite_optional')
      .setCheck('String')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(i18next.t('optional sprite'));
    this.appendValueInput('group')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(i18next.t('BLOCKS_GROUP'));
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(i18next.t('direction'))
      .appendField(
        new Blockly.FieldDropdown([
          [i18next.t('start from top'), 'top'],
          [i18next.t('start from bottom'), 'bottom'],
        ]),
        'direction'
      );
    this.appendStatementInput('CODE').setCheck('GeneratorArcadeAttribute');
    this.setInputsInline(false);
    this.setPreviousStatement(true, ['Create']);
    this.setNextStatement(true, ['Create']);
    this.setColour(105);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Random vertical obstacle generator.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_generator_random_vertical_obstacle'] = function (
  block
) {
  const text_sprite = block.getFieldValue('sprite');
  const value_obstacles = javascriptGenerator.valueToCode(
    block,
    'obstacles',
    javascriptGenerator.ORDER_ATOMIC
  );
  const value_sprite_optional = javascriptGenerator.valueToCode(
    block,
    'sprite_optional',
    javascriptGenerator.ORDER_ATOMIC
  );
  const value_group = javascriptGenerator.valueToCode(
    block,
    'group',
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
  const dropdown_direction = block.getFieldValue('direction');
  const statements_code = javascriptGenerator.statementToCode(block, 'CODE');

  return (
    'if (typeof ' +
    value_group +
    " === 'undefined' || !" +
    value_group +
    ') {\n  ' +
    value_group +
    ' = game.add.group(undefined, ' +
    "'obstacle_group');\n" +
    '}\n' +
    'cwc.framework.Phaser.RandomVerticalObstacleGenerator(\n  ' +
    value_x +
    ', ' +
    value_y +
    ', ' +
    value_obstacles +
    ", '" +
    text_sprite +
    "', " +
    value_sprite_optional +
    ', ' +
    value_group +
    ", '" +
    dropdown_direction +
    "', " +
    (statements_code
      ? 'function(arcadeSpriteCustom) {\n' + statements_code + '}'
      : '') +
    ');\n'
  );
};

/**
 * Obstacle generator matrix.
 */
Blocks['phaser_generator_matrix_block'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.point())
      .appendField(i18next.t('BLOCKS_PHASER_GENERATOR_OBSTACLE'))
      .appendField(
        new Blockly.FieldDropdown(BlocksHelper.phaserImage('block')),
        'sprite'
      );
    this.appendValueInput('x')
      .setCheck('Number')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField('x');
    this.appendValueInput('y')
      .setCheck('Number')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField('y');
    this.appendValueInput('padding')
      .setCheck('Number')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(i18next.t('BLOCKS_PADDING'));
    this.appendValueInput('group')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(i18next.t('BLOCKS_GROUP'));
    this.appendDummyInput()
      .appendField('  ')
      .appendField(' 0')
      .appendField('  1')
      .appendField(' 2')
      .appendField('  3')
      .appendField(' 4')
      .appendField('  5')
      .appendField(' 6')
      .appendField('  7');
    this.appendDummyInput()
      .appendField('0 ')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block0')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block1')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block2')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block3')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block4')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block5')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block6')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block7');
    this.appendDummyInput()
      .appendField('1 ')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block8')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block9')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block10')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block11')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block12')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block13')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block14')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block15');
    this.appendDummyInput()
      .appendField('2 ')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block16')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block17')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block18')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block19')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block20')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block21')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block22')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block23');
    this.appendDummyInput()
      .appendField('3 ')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block24')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block25')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block26')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block27')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block28')
      .appendField(new Blockly.FieldCheckbox('TRUE'), 'Block29')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block30')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block31');
    this.appendDummyInput()
      .appendField('4 ')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block32')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block33')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block34')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block35')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block36')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block37')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block38')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block39');
    this.appendDummyInput()
      .appendField('5 ')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block40')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block41')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block42')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block43')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block44')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block45')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block46')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block47');
    this.appendDummyInput()
      .appendField('6 ')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block48')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block49')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block50')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block51')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block52')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block53')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block54')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block55');
    this.appendDummyInput()
      .appendField('7 ')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block56')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block57')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block58')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block59')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block60')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block61')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block62')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'Block63');
    this.appendStatementInput('CODE').setCheck('GeneratorArcadeAttribute');
    this.setInputsInline(false);
    this.setPreviousStatement(true, ['Create']);
    this.setNextStatement(true, ['Create']);
    this.setColour(105);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Obstacle generator matrix.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_generator_matrix_block'] = function (block) {
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
  const value_padding = javascriptGenerator.valueToCode(
    block,
    'padding',
    javascriptGenerator.ORDER_ATOMIC
  );
  const value_group = javascriptGenerator.valueToCode(
    block,
    'group',
    javascriptGenerator.ORDER_ATOMIC
  );
  const statements_code = javascriptGenerator.statementToCode(block, 'CODE');
  const data = [];
  for (let i = 0; i < 63; i++) {
    data.push(block.getFieldValue('Block' + i) == 'TRUE' ? 1 : 0);
  }
  return (
    'if (typeof ' +
    value_group +
    " === 'undefined' || !" +
    value_group +
    ') {\n  ' +
    value_group +
    ' = game.add.group(undefined, ' +
    "'block_group');\n" +
    '}\n' +
    'cwc.framework.Phaser.MatrixBlockGenerator(\n  ' +
    "'" +
    text_sprite +
    "', " +
    '[' +
    data.toString() +
    '], ' +
    value_x +
    ', ' +
    value_y +
    ', ' +
    value_padding +
    ', ' +
    value_group +
    ', ' +
    (statements_code
      ? 'function(arcadeSpriteCustom) {\n' + statements_code + '}'
      : '') +
    ');\n'
  );
};

/**
 * Adjust arcade sprite.
 */
Blocks['phaser_generator_physics_arcade_attributes'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_SET'))
      .appendField(
        new Blockly.FieldDropdown([
          [i18next.t('acceleration'), 'acceleration.set'],
          [i18next.t('angle'), 'angle'],
          [i18next.t('angular velocity'), 'angularVelocity'],
          [i18next.t('bounce x'), 'bounce.x'],
          [i18next.t('bounce y'), 'bounce.y'],
          [i18next.t('bounce'), 'bounce.set'],
          [i18next.t('allow gravity'), 'allowGravity'],
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
          [i18next.t('collide world bounds'), 'collideWorldBounds'],
          [i18next.t('gravity x'), 'gravity.x'],
          [i18next.t('gravity y'), 'gravity.y'],
          [i18next.t('immovable'), 'immovable'],
          [i18next.t('velocity x'), 'velocity.x'],
          [i18next.t('velocity y'), 'velocity.y'],
          [i18next.t('velocity'), 'velocity'],
          [i18next.t('BLOCKS_WIDTH'), 'width'],
          [i18next.t('BLOCKS_HEIGHT'), 'height'],
        ]),
        'property'
      );
    this.appendValueInput('value')
      .setCheck('Number')
      .appendField(i18next.t('BLOCKS_TO'));
    this.setPreviousStatement(true, ['GeneratorArcadeAttribute']);
    this.setNextStatement(true, ['GeneratorArcadeAttribute']);
    this.setInputsInline(true);
    this.setColour(105);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Adjust arcade sprite.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_generator_physics_arcade_attributes'] = function (
  block
) {
  return javascriptGenerator['phaser_physics_arcade_sprite_adjust'](
    block,
    'arcadeSpriteCustom'
  );
};
