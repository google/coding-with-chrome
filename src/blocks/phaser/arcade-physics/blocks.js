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
 * Physics arcade enable.
 */
Blockly.Blocks['phaser_physics_arcade_enable'] = {
  init: function() {
    this.appendValueInput('sprite')
        .setCheck(null)
        .appendField('enable arcade physics for');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
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
        .appendField('on collision between');
    this.appendValueInput('object1')
        .setCheck(null);
    this.appendValueInput('object2')
        .setCheck(null)
        .appendField('and');
    this.appendStatementInput('func')
        .setCheck(null)
        .appendField('do');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Adjust arcade sprite.
 */
Blockly.Blocks['phaser_pyhsics_arcade_sprite'] = {
  init: function() {
    this.appendValueInput('sprite')
        .setCheck(null)
        .appendField(i18t('set physics sprite'));
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [i18t('acceleration'), 'body.acceleration.set'],
          [i18t('angle'), 'angle'],
          [i18t('angular velocity'), 'body.angularVelocity'],
          [i18t('bounce x'), 'body.bounce.x'],
          [i18t('bounce y'), 'body.bounce.y'],
          [i18t('collide world bounds'), 'body.collideWorldBounds'],
          [i18t('gravity x'), 'body.gravity.x'],
          [i18t('gravity y'), 'body.gravity.y'],
          [i18t('velocity x'), 'body.velocity.x'],
          [i18t('velocity y'), 'body.velocity.y'],
          [i18t('velocity'), 'body.velocity'],
        ]), 'property');
    this.appendValueInput('value')
        .setCheck('Number')
        .appendField(i18t('to'));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
