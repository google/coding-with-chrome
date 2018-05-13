/**
 * @fileoverview Phaser Blocks for Blockly.
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
 * Vertical obstacle generator.
 */
Blockly.Blocks['phaser_generator_vertical_obstacle'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.point())
        .appendField(i18t('@@BLOCKS_PHASER__GENERATOR_VERTICAL_OBSTACLE'));
    this.appendValueInput('obstacles')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(i18t('number of obstacles'));
    this.appendValueInput('spaces')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(i18t('number of spaces'));
    this.appendValueInput('x')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('x');
    this.appendValueInput('y')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('y');
    this.appendValueInput('sprite')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(i18t('sprite'));
    this.appendValueInput('sprite_top')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(i18t('top sprite'));
    this.appendValueInput('sprite_bottom')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(i18t('bottom sprite'));
    this.appendValueInput('group')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(i18t('group'));
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(i18t('property'))
        .appendField(new Blockly.FieldDropdown([
          [i18t('acceleration'), 'acceleration.set'],
          [i18t('angular velocity'), 'angularVelocity'],
          [i18t('bounce x'), 'bounce.x'],
          [i18t('bounce y'), 'bounce.y'],
          [i18t('bounce'), 'bounce.set'],
          [i18t('gravity x'), 'gravity.x'],
          [i18t('gravity y'), 'gravity.y'],
          [i18t('velocity x'), 'velocity.x'],
          [i18t('velocity y'), 'velocity.y'],
          [i18t('velocity'), 'velocity'],
        ]), 'property');
    this.appendValueInput('value')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(i18t('value'));
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
 */
Blockly.Blocks['phaser_generator_random_vertical_obstacle'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.point())
        .appendField(i18t(
          '@@BLOCKS_PHASER__GENERATOR_RANDOM_VERTICAL_OBSTACLE'));
    this.appendValueInput('obstacles')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(i18t('number of obstacles'));
    this.appendValueInput('x')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('x');
    this.appendValueInput('y')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('y');
    this.appendValueInput('sprite')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(i18t('sprite'));
    this.appendValueInput('sprite_optional')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(i18t('optional sprite'));
    this.appendValueInput('group')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(i18t('group'));
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(i18t('direction'))
        .appendField(new Blockly.FieldDropdown([
          [i18t('start from top'), 'top'],
          [i18t('start from bottom'), 'bottom'],
        ]), 'direction');
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(i18t('property'))
        .appendField(new Blockly.FieldDropdown([
          [i18t('acceleration'), 'acceleration.set'],
          [i18t('angular velocity'), 'angularVelocity'],
          [i18t('bounce x'), 'bounce.x'],
          [i18t('bounce y'), 'bounce.y'],
          [i18t('bounce'), 'bounce.set'],
          [i18t('gravity x'), 'gravity.x'],
          [i18t('gravity y'), 'gravity.y'],
          [i18t('velocity x'), 'velocity.x'],
          [i18t('velocity y'), 'velocity.y'],
          [i18t('velocity'), 'velocity'],
        ]), 'property');
    this.appendValueInput('value')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(i18t('value'));
    this.setInputsInline(false);
    this.setPreviousStatement(true, ['Create']);
    this.setNextStatement(true, ['Create']);
    this.setColour(105);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};
