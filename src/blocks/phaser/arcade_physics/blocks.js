/**
 * @fileoverview Phaser Physics Blocks for Blockly.
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
 * Add arcade sprite.
 */
Blockly.Blocks['phaser_physics_arcade_sprite_add'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.addCircle())
        .appendField(i18t('@@BLOCKS__DEFINE'));
    this.appendDummyInput()
        .appendField(i18t('@@BLOCKS__AS'))
        .appendField(i18t('physics sprite'))
        .appendField(new Blockly.FieldDropdown(
          Blockly.BlocksHelper['phaser_image']('player')), 'sprite')
        .appendField(Blockly.BlocksTemplate.image())
        .appendField(i18t('position'));
    this.appendValueInput('x')
        .setCheck('Number');
    this.appendValueInput('y')
        .appendField('x')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField('y');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(5);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * Add ball sprite with bounce.
 */
Blockly.Blocks['phaser_physics_arcade_sprite_ball_add'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.addCircle())
        .appendField(i18t('@@BLOCKS__DEFINE'));
    this.appendDummyInput()
        .appendField(i18t('@@BLOCKS__AS'))
        .appendField(i18t('ball'))
        .appendField(new Blockly.FieldDropdown(
          Blockly.BlocksHelper['phaser_image']('ball')), 'sprite')
        .appendField(Blockly.BlocksTemplate.image())
        .appendField(i18t('position'));
    this.appendValueInput('x')
        .setCheck('Number');
    this.appendValueInput('y')
        .appendField('x')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField('y');
    this.appendStatementInput('CODE')
        .setCheck('PhysicsArcadeAttribute');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(5);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * Add player sprite.
 */
Blockly.Blocks['phaser_physics_arcade_sprite_player_add'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.addCircle())
        .appendField(i18t('@@BLOCKS__DEFINE'));
    this.appendDummyInput()
        .appendField(i18t('@@BLOCKS__AS'))
        .appendField(i18t('player'))
        .appendField(new Blockly.FieldDropdown(
          Blockly.BlocksHelper['phaser_image']('player')), 'sprite')
        .appendField(Blockly.BlocksTemplate.image())
        .appendField(i18t('position'));
    this.appendValueInput('x')
        .setCheck('Number');
    this.appendValueInput('y')
        .appendField('x')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField('y');
    this.appendStatementInput('CODE')
        .setCheck('PhysicsArcadeAttribute');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(5);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * Add paddle sprite.
 */
Blockly.Blocks['phaser_physics_arcade_sprite_paddle_add'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.addCircle())
        .appendField(i18t('@@BLOCKS__DEFINE'));
    this.appendDummyInput()
        .appendField(i18t('@@BLOCKS__AS'))
        .appendField(i18t('paddle'))
        .appendField(new Blockly.FieldDropdown(
          Blockly.BlocksHelper['phaser_image']('paddle')), 'sprite')
        .appendField(Blockly.BlocksTemplate.image())
        .appendField(i18t('position'));
    this.appendValueInput('x')
        .setCheck('Number');
    this.appendValueInput('y')
        .appendField('x')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField('y');
    this.appendStatementInput('CODE')
        .setCheck('PhysicsArcadeAttribute');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(5);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * Adjust arcade sprite.
 */
Blockly.Blocks['phaser_physics_arcade_sprite_adjust'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.adjust())
        .appendField(i18t('@@BLOCKS__SET'))
        .appendField(i18t('physics sprite'));
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [i18t('acceleration'), 'acceleration.set'],
          [i18t('angle'), 'angle'],
          [i18t('angular velocity'), 'angularVelocity'],
          [i18t('bounce x'), 'bounce.x'],
          [i18t('bounce y'), 'bounce.y'],
          [i18t('bounce'), 'bounce.set'],
          [i18t('allow gravity'), 'allowGravity'],
          [i18t('@@BLOCKS_PHASER__CHECK_COLLISION_DOWN'),
            'checkCollision.down'],
          [i18t('@@BLOCKS_PHASER__CHECK_COLLISION_UP'), 'checkCollision.up'],
          [i18t('@@BLOCKS_PHASER__CHECK_COLLISION_LEFT'),
            'checkCollision.left'],
          [i18t('@@BLOCKS_PHASER__CHECK_COLLISION_RIGHT'),
            'checkCollision.right'],
          [i18t('collide world bounds'), 'collideWorldBounds'],
          [i18t('gravity x'), 'gravity.x'],
          [i18t('gravity y'), 'gravity.y'],
          [i18t('immovable'), 'immovable'],
          [i18t('velocity x'), 'velocity.x'],
          [i18t('velocity y'), 'velocity.y'],
          [i18t('velocity'), 'velocity'],
          [i18t('@@BLOCKS__WIDTH'), 'width'],
          [i18t('@@BLOCKS__HEIGHT'), 'height'],
          [i18t('x'), 'x'],
          [i18t('y'), 'y'],
          [i18t('z'), 'z'],
        ]), 'property');
    this.appendValueInput('value')
        .setCheck('Number')
        .appendField(i18t('@@BLOCKS__TO'));
    this.setPreviousStatement(true, ['Create', 'Update', 'Input']);
    this.setNextStatement(true, ['Create', 'Update', 'Input']);
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * Adjust arcade sprite.
 */
Blockly.Blocks['phaser_physics_arcade_sprite_adjust_custom'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(i18t('@@BLOCKS__SET'))
        .appendField(new Blockly.FieldDropdown([
          [i18t('acceleration'), 'acceleration.set'],
          [i18t('angle'), 'angle'],
          [i18t('angular velocity'), 'angularVelocity'],
          [i18t('bounce x'), 'bounce.x'],
          [i18t('bounce y'), 'bounce.y'],
          [i18t('bounce'), 'bounce.set'],
          [i18t('allow gravity'), 'allowGravity'],
          [i18t('@@BLOCKS_PHASER__CHECK_COLLISION_DOWN'),
            'checkCollision.down'],
          [i18t('@@BLOCKS_PHASER__CHECK_COLLISION_UP'), 'checkCollision.up'],
          [i18t('@@BLOCKS_PHASER__CHECK_COLLISION_LEFT'),
            'checkCollision.left'],
          [i18t('@@BLOCKS_PHASER__CHECK_COLLISION_RIGHT'),
            'checkCollision.right'],
          [i18t('collide world bounds'), 'collideWorldBounds'],
          [i18t('gravity x'), 'gravity.x'],
          [i18t('gravity y'), 'gravity.y'],
          [i18t('immovable'), 'immovable'],
          [i18t('velocity x'), 'velocity.x'],
          [i18t('velocity y'), 'velocity.y'],
          [i18t('velocity'), 'velocity'],
          [i18t('@@BLOCKS__WIDTH'), 'width'],
          [i18t('@@BLOCKS__HEIGHT'), 'height'],
          [i18t('x'), 'x'],
          [i18t('y'), 'y'],
          [i18t('z'), 'z'],
        ]), 'property');
    this.appendValueInput('value')
        .setCheck('Number')
        .appendField(i18t('@@BLOCKS__TO'));
    this.setPreviousStatement(true, ['PhysicsArcadeAttribute']);
    this.setNextStatement(true, ['PhysicsArcadeAttribute']);
    this.setInputsInline(true);
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * Adjust arcade sprite dimension.
 */
Blockly.Blocks['phaser_physics_arcade_sprite_adjust_dimension'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.adjust())
        .appendField(i18t('@@BLOCKS__SET'))
        .appendField(i18t('physics sprite'));
    this.appendDummyInput()
        .appendField(i18t('dimension to'));
    this.appendValueInput('width')
        .setCheck('Number');
    this.appendValueInput('height')
        .appendField('x')
        .setCheck('Number');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * Destroys arcade sprite.
 */
Blockly.Blocks['phaser_physics_arcade_sprite_destroy'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.point())
        .appendField(i18t('@@BLOCKS__DESTROY'))
        .appendField(i18t('tile sprite'));
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
 */
Blockly.Blocks['phaser_physics_arcade_sprite_kill'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.point())
        .appendField(i18t('@@BLOCKS__KILL'))
        .appendField(i18t('tile sprite'));
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
 * Physics arcade enable.
 */
Blockly.Blocks['phaser_physics_arcade_enable'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.point())
        .appendField(i18t('@@BLOCKS_PHASER__PHYSICS_ARCADE_ENABLE'));
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * Physics arcade out of bounds.
 */
Blockly.Blocks['phaser_physics_arcade_out_of_bounds'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.collide())
        .appendField(i18t('@@BLOCKS_PHASER__ON_OUT_OF_BOUNDS'));
    this.appendValueInput('variable');
    this.appendStatementInput('CODE')
        .appendField(i18t('@@BLOCKS__DO'));
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * Physics arcade overlap.
 */
Blockly.Blocks['phaser_physics_arcade_overlap'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.collide())
        .appendField(i18t('on collision between'));
    this.appendValueInput('object1');
    this.appendDummyInput()
        .appendField(i18t('and'));
    this.appendValueInput('object2');
    this.appendStatementInput('CODE')
        .appendField(i18t('@@BLOCKS__DO'));
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'Update');
    this.setNextStatement(true, 'Update');
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * Physics arcade collide.
 */
Blockly.Blocks['phaser_physics_arcade_collide'] = {
  init: function() {
    this.appendValueInput('object1')
        .appendField(Blockly.BlocksTemplate.collide());
    this.appendDummyInput()
        .appendField(i18t('@@BLOCKS_PHASER__COLLIDE_WITH'));
    this.appendValueInput('object2');
    this.setPreviousStatement(true, 'Update');
    this.setNextStatement(true, 'Update');
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};
