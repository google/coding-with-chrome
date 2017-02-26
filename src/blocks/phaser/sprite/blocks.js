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
 * Adjust sprite.
 */
Blockly.Blocks['phaser_sprite_adjust'] = {
  init: function() {
    this.appendValueInput('sprite')
        .setCheck(null)
        .appendField(i18t('set sprite'));
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [i18t('angle'), 'angle'],
          [i18t('archor'), 'anchor.set'],
          [i18t('move up'), 'moveUp'],
          [i18t('move down'), 'moveDown'],
          [i18t('move left'), 'moveLeft'],
          [i18t('move right'), 'moveRight'],
          ['x', 'x'],
          ['y', 'y']
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
        .appendField('destroy sprite');
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
