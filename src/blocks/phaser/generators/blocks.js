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


/**
 * Obstacle generator matrix.
 */
Blockly.Blocks['phaser_generator_matrix_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.point())
        .appendField(i18t('erzeuge Hindernisse'))
        .appendField(new Blockly.FieldDropdown(
          Blockly.BlocksHelper['phaser_image']('block')), 'sprite');
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
        .appendField('padding');
    this.appendValueInput('group')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(i18t('group'));
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
    this.setInputsInline(false);
    this.setPreviousStatement(true, ['Create']);
    this.setNextStatement(true, ['Create']);
    this.setColour(105);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};
