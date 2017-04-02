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
 * Input keyboard create cursor keys.
 */
Blockly.Blocks['phaser_input_keyboard_create_cursor_keys'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Capture keyboard cursors keys');
    this.setOutput(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Input keyboard add key.
 */
Blockly.Blocks['phaser_input_keyboard_add_key'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('input.keyboard.addKey');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [i18t('spacebar'), 'Phaser.KeyCode.SPACEBAR']
        ]), 'keycode');
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Input keyboard is pressed.
 */
Blockly.Blocks['phaser_input_keyboard_is_pressed'] = {
  init: function() {
    this.appendValueInput('cursors')
        .setCheck(null);
    this.appendDummyInput()
        .appendField(i18t('is pressed'))
        .appendField(new Blockly.FieldDropdown([
          [i18t('up'), 'up.isDown'],
          [i18t('down'), 'down.isDown'],
          [i18t('left'), 'left.isDown'],
          [i18t('right'), 'right.isDown'],
          [i18t('key pressed'), 'isDown']
        ]), 'direction');
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * World wrap.
 */
Blockly.Blocks['phaser_world_wrap'] = {
  init: function() {
    this.appendValueInput('sprite')
        .setCheck(null)
        .appendField(Blockly.BlocksTemplate.point())
        .appendField(i18t('World wrap sprite'));
    this.appendValueInput('value')
        .setCheck('Number')
        .appendField(i18t('padding'));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
