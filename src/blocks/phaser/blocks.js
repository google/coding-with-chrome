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
 * Phaser Game block.
 */
Blockly.Blocks['phaser_game'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Create Game with name')
        .appendField(new Blockly.FieldTextInput('Unnamed Game'), 'name')
        .appendField('and size')
        .appendField(new Blockly.FieldNumber(800), 'width')
        .appendField('x')
        .appendField(new Blockly.FieldNumber(600), 'height');
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};


/**
 * Restart Phaser Game.
 */
Blockly.Blocks['phaser_game_restart'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Restart game');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Phaser preload section.
 */
Blockly.Blocks['phaser_preload'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(i18t('Preload'));
    this.appendStatementInput('CODE')
      .setAlign(Blockly.ALIGN_CENTRE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};


/**
 * Load Image
 */
Blockly.Blocks['phaser_load_image'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Load Image')
        .appendField(new Blockly.FieldTextInput('name'), 'name');
    this.appendValueInput('image')
        .setCheck('Image')
        .appendField('from file');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Load Audio
 */
Blockly.Blocks['phaser_load_audio'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Load Audio')
        .appendField(new Blockly.FieldTextInput('name'), 'name');
    this.appendValueInput('audio')
        .setCheck('Audio')
        .appendField('from file');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Phaser create section.
 */
Blockly.Blocks['phaser_update'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(280);
    this.appendDummyInput()
      .appendField(i18t('Update'));
    this.appendStatementInput('CODE')
      .setAlign(Blockly.ALIGN_CENTRE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};


/**
 * Phaser render section.
 */
Blockly.Blocks['phaser_render'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(280);
    this.appendDummyInput()
      .appendField(i18t('Render'));
    this.appendStatementInput('CODE')
      .setAlign(Blockly.ALIGN_CENTRE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};


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
 * Adjust sprite.
 */
Blockly.Blocks['phaser_sprite_adjust'] = {
  init: function() {
    this.appendValueInput('sprite')
        .setCheck(null)
        .appendField(i18t('Set sprite'));
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
        .appendField(i18t('Get sprite'));
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
 * World wrap.
 */
Blockly.Blocks['phaser_world_wrap'] = {
  init: function() {
    this.appendValueInput('sprite')
        .setCheck(null)
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
