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
 * Add sprite.
 */
Blockly.Blocks['phaser_sprite_add'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.addCircle())
        .appendField(i18t('define'));
    this.appendDummyInput()
        .appendField(i18t('as sprite'))
        .appendField(new Blockly.FieldTextInput('name'), 'sprite')
        .appendField(i18t('position'));
    this.appendValueInput('x')
        .setCheck('Number');
    this.appendValueInput('y')
        .setCheck('Number');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Adjust sprite.
 */
Blockly.Blocks['phaser_sprite_adjust'] = {
  init: function() {
    this.appendValueInput('sprite')
        .setCheck(null)
        .appendField(Blockly.BlocksTemplate.adjust())
        .appendField(i18t('set sprite'));
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [i18t('alpha'), 'alpha'],
          [i18t('angle'), 'angle'],
          [i18t('anchor'), 'anchor.set'],
          [i18t('buttonMode'), 'buttonMode'],
          [i18t('height'), 'height'],
          [i18t('move down'), 'moveDown'],
          [i18t('move left'), 'moveLeft'],
          [i18t('move right'), 'moveRight'],
          [i18t('move up'), 'moveUp'],
          [i18t('rotation'), 'rotation'],
          [i18t('visible'), 'visible'],
          [i18t('width'), 'width'],
          [i18t('x'), 'x'],
          [i18t('y'), 'y'],
          [i18t('z'), 'y']
        ]), 'property');
    this.appendValueInput('value')
        .setCheck('Number')
        .appendField(i18t('to'));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(225);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Adjust sprite.
 */
Blockly.Blocks['phaser_sprite_get'] = {
  init: function() {
    this.appendValueInput('sprite')
        .setCheck(null)
        .appendField(i18t('get sprite'));
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [i18t('angle'), 'angle'],
          ['x', 'x'],
          ['y', 'y']
        ]), 'property');
    this.setOutput(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Destroy sprite.
 */
Blockly.Blocks['phaser_sprite_destroy'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.point())
        .appendField(i18t('destroy sprite'));
    this.appendValueInput('sprite')
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
