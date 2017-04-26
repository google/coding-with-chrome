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
Blockly.Blocks['phaser_pyhsics_arcade_sprite_add'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.addCircle())
        .appendField(i18t('define'));
    this.appendDummyInput()
        .appendField(i18t('as physics sprite'))
        .appendField(new Blockly.FieldTextInput('player'), 'sprite')
        .appendField(i18t('position'));
    this.appendValueInput('x')
        .setCheck('Number');
    this.appendValueInput('y')
        .setCheck('Number');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(5);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Adjust arcade sprite.
 */
Blockly.Blocks['phaser_pyhsics_arcade_sprite_adjust'] = {
  init: function() {
    this.appendValueInput('variable')
        .setCheck(null)
        .appendField(Blockly.BlocksTemplate.adjust())
        .appendField(i18t('set physics sprite'));
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [i18t('acceleration'), 'acceleration.set'],
          [i18t('angle'), 'angle'],
          [i18t('angular velocity'), 'angularVelocity'],
          [i18t('bounce x'), 'bounce.x'],
          [i18t('bounce y'), 'bounce.y'],
          [i18t('bounce'), 'bounce.set'],
          [i18t('allow gravity'), 'allowGravity'],
          [i18t('checkCollision down'), 'checkCollision.down'],
          [i18t('checkCollision up'), 'checkCollision.up'],
          [i18t('collide world bounds'), 'collideWorldBounds'],
          [i18t('gravity x'), 'gravity.x'],
          [i18t('gravity y'), 'gravity.y'],
          [i18t('immovable'), 'immovable'],
          [i18t('velocity x'), 'velocity.x'],
          [i18t('velocity y'), 'velocity.y'],
          [i18t('velocity'), 'velocity'],
        ]), 'property');
    this.appendValueInput('value')
        .setCheck('Number')
        .appendField(i18t('to'));
    this.setPreviousStatement(true, ['Create', 'Update', 'Input']);
    this.setNextStatement(true, ['Create', 'Update', 'Input']);
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Adjust arcade sprite dimension.
 */
Blockly.Blocks['phaser_pyhsics_arcade_sprite_adjust_dimension'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.adjust())
        .appendField(i18t('set physics sprite'));
    this.appendDummyInput()
        .appendField(i18t('dimension to'));
    this.appendValueInput('width')
        .setCheck('Number');
    this.appendValueInput('height')
        .setCheck('Number');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Physics arcade enable.
 */
Blockly.Blocks['phaser_physics_arcade_enable'] = {
  init: function() {
    this.appendValueInput('variable')
        .setCheck(null)
        .appendField(Blockly.BlocksTemplate.point())
        .appendField(i18t('enable arcade physics for'));
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Physics arcade overlap.
 */
Blockly.Blocks['phaser_physics_arcade_overlap'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.runningMan())
        .appendField(i18t('on collision between'));
    this.appendValueInput('object1')
        .setCheck(null);
    this.appendDummyInput()
        .appendField(i18t('and'));
    this.appendValueInput('object2')
        .setCheck(null);
    this.appendStatementInput('func')
        .setCheck(null)
        .appendField(i18t('do'));
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'Update');
    this.setNextStatement(true, 'Update');
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Physics arcade collide.
 */
Blockly.Blocks['phaser_physics_arcade_collide'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(i18t('collide between'));
    this.appendValueInput('object1')
        .setCheck(null);
    this.appendDummyInput()
        .appendField(i18t('and'));
    this.appendValueInput('object2')
        .setCheck(null);
    this.setPreviousStatement(true, 'Update');
    this.setNextStatement(true, 'Update');
    this.setColour(0);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
