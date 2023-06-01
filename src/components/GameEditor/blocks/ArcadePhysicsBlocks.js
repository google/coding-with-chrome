/**
 * @fileoverview Phaser Physics Blocks for Blockly.
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
 * Add arcade sprite.
 */
Blocks['phaser_physics_arcade_sprite_add'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('BLOCKS_DEFINE'));
    this.appendDummyInput()
      .appendField(i18next.t('AS_PHYSICS_SPRITE'))
      .appendField(
        new Blockly.FieldDropdown(() => {
          return BlocksHelper.phaserImage('player');
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
    this.setColour(5);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add arcade sprite.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_physics_arcade_sprite_add'] = function (block) {
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

  return `
    ${variable} = this.physics.add.sprite(${value_x}, ${value_y}, "${block.getFieldValue(
    'sprite'
  )}")
      .setOrigin(0)
      .setScrollFactor(0, 1);
  `;
};

/**
 * Add ball sprite with bounce.
 */
Blocks['phaser_physics_arcade_sprite_ball_add'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('BLOCKS_DEFINE'));
    this.appendDummyInput()
      .appendField(i18next.t('AS_BALL'))
      .appendField(
        new Blockly.FieldDropdown(() => {
          return BlocksHelper.phaserImage('ball');
        }),
        'sprite'
      )
      .appendField(BlocksTemplate.image())
      .appendField(i18next.t('WITH_POSITION'));
    this.appendValueInput('x').setCheck('Number');
    this.appendValueInput('y').appendField('x').setCheck('Number');
    this.appendDummyInput().appendField('y');
    this.appendStatementInput('CODE').setCheck('PhysicsArcadeAttribute');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(5);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add ball sprite with bounce.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_physics_arcade_sprite_ball_add'] = function (
  block
) {
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
  const statements_code = javascriptGenerator.statementToCode(block, 'CODE');
  return `
    ${variable} = this.physics.add.sprite(${value_x}, ${value_y}, "${block.getFieldValue(
    'sprite'
  )}")
      .setOrigin(0)
      .setScrollFactor(0, 1);
    (function(arcadeSpriteCustom) {
      ${statements_code}
    }(${variable}));
  `;
};

/**
 * Add player sprite.
 */
Blocks['phaser_physics_arcade_sprite_player_add'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('BLOCKS_DEFINE'));
    this.appendDummyInput()
      .appendField(i18next.t('AS_PLAYER'))
      .appendField(
        new Blockly.FieldDropdown(() => {
          return BlocksHelper.phaserImage('player');
        }),
        'sprite'
      )
      .appendField(BlocksTemplate.image())
      .appendField(i18next.t('WITH_POSITION'));
    this.appendValueInput('x').setCheck('Number');
    this.appendValueInput('y').appendField('x').setCheck('Number');
    this.appendDummyInput().appendField('y');
    this.appendStatementInput('CODE').setCheck('PhysicsArcadeAttribute');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(5);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add player sprite.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_physics_arcade_sprite_player_add'] = function (
  block
) {
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
  const statements_code = javascriptGenerator.statementToCode(block, 'CODE');
  return (
    variable +
    ' = this.add.sprite(' +
    value_x +
    ', ' +
    value_y +
    ", '" +
    text_sprite +
    "');\n" +
    'game.physics.arcade.enable(' +
    variable +
    ');\n' +
    '(function(arcadeSpriteCustom) {\n' +
    statements_code +
    '}(' +
    variable +
    '));\n'
  );
};

/**
 * Add paddle sprite.
 */
Blocks['phaser_physics_arcade_sprite_paddle_add'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('BLOCKS_DEFINE'));
    this.appendDummyInput()
      .appendField(i18next.t('AS_PADDLE'))
      .appendField(
        new Blockly.FieldDropdown(() => {
          return BlocksHelper.phaserImage('paddle');
        }),
        'sprite'
      )
      .appendField(BlocksTemplate.image())
      .appendField(i18next.t('WITH_POSITION'));
    this.appendValueInput('x').setCheck('Number');
    this.appendValueInput('y').appendField('x').setCheck('Number');
    this.appendDummyInput().appendField('y');
    this.appendStatementInput('CODE').setCheck('PhysicsArcadeAttribute');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(5);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add paddle sprite.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_physics_arcade_sprite_paddle_add'] = function (
  block
) {
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
  const statements_code = javascriptGenerator.statementToCode(block, 'CODE');
  return (
    variable +
    ' = this.add.sprite(' +
    value_x +
    ', ' +
    value_y +
    ", '" +
    text_sprite +
    "');\n" +
    'game.physics.arcade.enable(' +
    variable +
    ');\n' +
    '(function(arcadeSpriteCustom) {\n' +
    statements_code +
    '}(' +
    variable +
    '));\n'
  );
};

/**
 * Adjust arcade sprite.
 */
Blocks['phaser_physics_arcade_sprite_adjust'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.adjust())
      .appendField(i18next.t('BLOCKS_PHASER_PHYSICS_SPRITE_CHANGE'));
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        [i18next.t('ACCELERATION'), 'acceleration.set'],
        [i18next.t('ANGLE'), 'angle'],
        [i18next.t('ANGULAR_VELOCITY'), 'angularVelocity'],
        [i18next.t('BOUNCE_X'), 'bounce.x'],
        [i18next.t('BOUNCE_Y'), 'bounce.y'],
        [i18next.t('BOUNCE'), 'bounce.set'],
        [i18next.t('ALLOW_GRAVITY'), 'allowGravity'],
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
        [i18next.t('COLLIDE_WORLD_BOUNDS'), 'collideWorldBounds'],
        [i18next.t('GRAVITY_X'), 'gravity.x'],
        [i18next.t('GRAVITY_Y'), 'gravity.y'],
        [i18next.t('IMMOVABLE'), 'immovable'],
        [i18next.t('VELOCITY_X'), 'velocity.x'],
        [i18next.t('VELOCITY_Y'), 'velocity.y'],
        [i18next.t('VELOCITY'), 'velocity'],
        [i18next.t('BLOCKS_WIDTH'), 'width'],
        [i18next.t('BLOCKS_HEIGHT'), 'height'],
        ['x', 'x'],
        ['y', 'y'],
        ['z', 'z'],
      ]),
      'property'
    );
    this.appendValueInput('value')
      .setCheck('Number')
      .appendField(i18next.t('BLOCKS_TO'));
    this.setPreviousStatement(true, ['Create', 'Update', 'Input']);
    this.setNextStatement(true, ['Create', 'Update', 'Input']);
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Adjust arcade sprite.
 * @param {Blockly.Block} block
 * @param {string=} variableName
 * @return {string}
 */
javascriptGenerator['phaser_physics_arcade_sprite_adjust'] = function (
  block,
  variableName = ''
) {
  let variable =
    javascriptGenerator.valueToCode(
      block,
      'variable',
      javascriptGenerator.ORDER_ATOMIC
    ) || variableName;
  if (!variableName && !variable.startsWith('this.')) {
    variable = 'this.' + variable;
  }
  const dropdown_property = block.getFieldValue('property');
  const value_value = javascriptGenerator.valueToCode(
    block,
    'value',
    javascriptGenerator.ORDER_ATOMIC
  );
  switch (dropdown_property) {
    case 'angle':
    case 'height':
    case 'width':
    case 'x':
    case 'y':
    case 'z':
      return variable + '.' + dropdown_property + ' = ' + value_value + ';\n';
    case 'acceleration.set':
    case 'bounce.set':
      return (
        variable + '.body.' + dropdown_property + '(' + value_value + ');\n'
      );
    case 'allowGravity':
    case 'checkCollision.down':
    case 'checkCollision.up':
    case 'collideWorldBounds':
    case 'immovable':
      return (
        variable +
        '.body.' +
        dropdown_property +
        ' = ' +
        (value_value && value_value !== '0' ? true : false) +
        ';\n'
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
      return (
        variable + '.body.' + dropdown_property + ' = ' + value_value + ';\n'
      );
  }
};

/**
 * Adjust arcade sprite (custom).
 */
Blocks['phaser_physics_arcade_sprite_adjust_custom'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_SET'))
      .appendField(
        new Blockly.FieldDropdown([
          [i18next.t('ACCELERATION'), 'acceleration.set'],
          [i18next.t('ANGLE'), 'angle'],
          [i18next.t('ANGULAR_VELOCITY'), 'angularVelocity'],
          [i18next.t('BOUNCE_X'), 'bounce.x'],
          [i18next.t('BOUNCE_Y'), 'bounce.y'],
          [i18next.t('BOUNCE'), 'bounce.set'],
          [i18next.t('ALLOW_GRAVITY'), 'allowGravity'],
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
          [i18next.t('COLLIDE_WORLD_BOUNDS'), 'collideWorldBounds'],
          [i18next.t('GRAVITY_X'), 'gravity.x'],
          [i18next.t('GRAVITY_Y'), 'gravity.y'],
          [i18next.t('IMMOVABLE'), 'immovable'],
          [i18next.t('VELOCITY_X'), 'velocity.x'],
          [i18next.t('VELOCITY_Y'), 'velocity.y'],
          [i18next.t('VELOCITY'), 'velocity'],
          [i18next.t('BLOCKS_WIDTH'), 'width'],
          [i18next.t('BLOCKS_HEIGHT'), 'height'],
          ['x', 'x'],
          ['y', 'y'],
          ['z', 'z'],
        ]),
        'property'
      );
    this.appendValueInput('value')
      .setCheck('Number')
      .appendField(i18next.t('BLOCKS_TO'));
    this.setPreviousStatement(true, ['PhysicsArcadeAttribute']);
    this.setNextStatement(true, ['PhysicsArcadeAttribute']);
    this.setInputsInline(true);
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Adjust arcade sprite custom.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_physics_arcade_sprite_adjust_custom'] = function (
  block
) {
  return javascriptGenerator['phaser_physics_arcade_sprite_adjust'](
    block,
    'arcadeSpriteCustom'
  );
};

/**
 * Adjust arcade sprite dimension custom.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_physics_arcade_sprite_adjust_dimension_custom'] =
  function (block) {
    return javascriptGenerator['phaser_physics_arcade_sprite_adjust_dimension'](
      block,
      'arcadeSpriteCustom'
    );
  };

/**
 * Adjust arcade sprite dimension.
 */
Blocks['phaser_physics_arcade_sprite_adjust_dimension'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.adjust())
      .appendField(i18next.t('BLOCKS_PHASER_PHYSICS_SPRITE_CHANGE'));
    this.appendDummyInput().appendField(i18next.t('WITH_DIMENSION'));
    this.appendValueInput('width').setCheck('Number');
    this.appendValueInput('height').appendField('x').setCheck('Number');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Adjust arcade sprite dimension.
 * @param {Blockly.Block} block
 * @param {string=} variableName
 * @return {string}
 */
javascriptGenerator['phaser_physics_arcade_sprite_adjust_dimension'] =
  function (block, variableName = '') {
    const variable =
      javascriptGenerator.valueToCode(
        block,
        'variable',
        javascriptGenerator.ORDER_ATOMIC
      ) || variableName;
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
 * Adjust arcade sprite dimension (custom).
 */
Blocks['phaser_physics_arcade_sprite_adjust_dimension_custom'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_SET'))
      .appendField(i18next.t('WITH_DIMENSION'));
    this.appendValueInput('width').setCheck('Number');
    this.appendValueInput('height').appendField('x').setCheck('Number');
    this.setPreviousStatement(true, ['PhysicsArcadeAttribute']);
    this.setNextStatement(true, ['PhysicsArcadeAttribute']);
    this.setInputsInline(true);
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Destroys arcade sprite.
 */
Blocks['phaser_physics_arcade_sprite_destroy'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.point())
      .appendField(i18next.t('BLOCKS_PHASER_PHYSICS_SPRITE_DESTROY'));
    this.appendValueInput('variable');
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['Create', 'Update', 'Input']);
    this.setNextStatement(true, ['Create', 'Update', 'Input']);
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Destroys arcade sprite.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_physics_arcade_sprite_destroy'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  return `${variable}.destroy();`;
};

/**
 * Kills arcade sprite.
 */
Blocks['phaser_physics_arcade_sprite_kill'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.point())
      .appendField(i18next.t('BLOCKS_PHASER_PHYSICS_SPRITE_KILL'));
    this.appendValueInput('variable');
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['Create', 'Update', 'Input']);
    this.setNextStatement(true, ['Create', 'Update', 'Input']);
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Kills arcade sprite.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_physics_arcade_sprite_kill'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  return variable + '.kill();\n';
};

/**
 * Physics arcade enable.
 */
Blocks['phaser_physics_arcade_enable'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.point())
      .appendField(i18next.t('BLOCKS_PHASER_PHYSICS_ARCADE_ENABLE'));
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Physics arcade enable.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_physics_arcade_enable'] = function (block) {
  const value_variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  return 'game.physics.arcade.enable(' + value_variable + ');\n';
};

/**
 * Physics arcade out of bounds.
 */
Blocks['phaser_physics_arcade_out_of_bounds'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.collide())
      .appendField(i18next.t('BLOCKS_PHASER_ON_OUT_OF_BOUNDS'));
    this.appendValueInput('variable');
    this.appendStatementInput('CODE').appendField(i18next.t('BLOCKS_DO'));
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Physics arcade out of bounds.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_physics_arcade_out_of_bounds'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  const statements_code = javascriptGenerator.statementToCode(block, 'CODE');
  return (
    variable +
    '.checkWorldBounds = true;\n' +
    variable +
    '.events.onOutOfBounds.add(function() {\n' +
    statements_code +
    '}, this);\n'
  );
};

/**
 * Physics arcade overlap.
 */
Blocks['phaser_physics_arcade_overlap'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.collide())
      .appendField(i18next.t('ON_COLLISION_BETWEEN'));
    this.appendValueInput('object1');
    this.appendDummyInput().appendField(i18next.t('AND'));
    this.appendValueInput('object2');
    this.appendStatementInput('CODE').appendField(i18next.t('BLOCKS_DO'));
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'Update');
    this.setNextStatement(true, 'Update');
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Physics arcade overlap.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_physics_arcade_overlap'] = function (block) {
  const value_object1 = javascriptGenerator.valueToCode(
    block,
    'object1',
    javascriptGenerator.ORDER_ATOMIC
  );
  const value_object2 = javascriptGenerator.valueToCode(
    block,
    'object2',
    javascriptGenerator.ORDER_ATOMIC
  );
  const statements_code = javascriptGenerator.statementToCode(block, 'CODE');
  return (
    'game.physics.arcade.overlap(' +
    value_object1 +
    ', ' +
    value_object2 +
    ', function(object1, object2) {\n' +
    statements_code +
    '}, null, this);\n'
  );
};

/**
 * Physics arcade collide.
 */
Blocks['phaser_physics_arcade_collide'] = {
  init: function () {
    this.appendValueInput('object1').appendField(BlocksTemplate.collide());
    this.appendDummyInput().appendField(
      i18next.t('BLOCKS_PHASER_COLLIDE_WITH')
    );
    this.appendValueInput('object2');
    this.setPreviousStatement(true, 'Update');
    this.setNextStatement(true, 'Update');
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Physics arcade collide.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_physics_arcade_collide'] = function (block) {
  const object1 = javascriptGenerator.valueToCode(
    block,
    'object1',
    javascriptGenerator.ORDER_ATOMIC
  );
  const object2 = javascriptGenerator.valueToCode(
    block,
    'object2',
    javascriptGenerator.ORDER_ATOMIC
  );
  return `
    this.physics.add.collider(${object1}, ${object2});
  `;
};
