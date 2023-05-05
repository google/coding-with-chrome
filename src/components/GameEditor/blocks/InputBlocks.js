/**
 * @fileoverview Phaser Blocks for Blockly.
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

import { BlocksTemplate } from '../../BlockEditor/blocks/BlocksTemplate';

import i18next from 'i18next';

/**
 * Phaser input section.
 */
Blocks['phaser_input'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.keyboard())
      .appendField(BlocksTemplate.mouse())
      .appendField(i18next.t('BLOCKS_PHASER_ON_INPUT'));
    this.appendStatementInput('CODE')
      .appendField(i18next.t('BLOCKS_DO'))
      .setAlign(Blockly.ALIGN_CENTRE)
      .setCheck(['Input']);
    this.setPreviousStatement(true, 'Input_');
    this.setNextStatement(true, 'Update_');
    this.setColour(135);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Phaser input section.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_input'] = function (block) {
  const statements_code = javascriptGenerator.statementToCode(block, 'CODE');
  return 'input_: function(e) {\n' + statements_code + '},\n';
};

/**
 * Input body block to separate input statements from normal statements.
 */
Blocks['phaser_input_body'] = {
  init: function () {
    this.appendStatementInput('CODE')
      .setCheck(['controls_if'])
      .appendField(BlocksTemplate.keyboard());
    this.setColour(135);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setPreviousStatement(true, 'Input');
    this.setNextStatement(true, 'Input');
  },
};

/**
 * Input body block.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_input_body'] = function (block) {
  const statements_code = javascriptGenerator.statementToCode(block, 'CODE');
  return statements_code;
};

/**
 * Add keyboard cursor keys.
 */
Blocks['phaser_input_keyboard_cursor_keys_add'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('BLOCKS_DEFINE'));
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_AS'))
      .appendField(i18next.t('BLOCKS_PHASER_KEYBOARD_CURSOR_KEYS'))
      .appendField(BlocksTemplate.keyboard());
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(135);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add keyboard cursor keys.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_input_keyboard_cursor_keys_add'] = function (
  block
) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  return (
    variable +
    ' = this.input.keyboard.createCursorKeys();\n' +
    variable +
    '.down.onDown.add(this.input_, this);\n' +
    variable +
    '.left.onDown.add(this.input_, this);\n' +
    variable +
    '.right.onDown.add(this.input_, this);\n' +
    variable +
    '.up.onDown.add(this.input_, this);\n'
  );
};

/**
 * Add keyboard WASD keys.
 */
Blocks['phaser_input_keyboard_wasd_keys_add'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('BLOCKS_DEFINE'));
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_AS'))
      .appendField(i18next.t('BLOCKS_PHASER_KEYBOARD_WASD_KEYS'))
      .appendField(BlocksTemplate.keyboard());
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(135);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add keyboard WASD keys.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_input_keyboard_wasd_keys_add'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  return (
    variable +
    ' = {\n' +
    '  up: this.input.keyboard.addKey(Phaser.Keyboard.W),\n' +
    '  down: this.input.keyboard.addKey(Phaser.Keyboard.S),\n' +
    '  left: this.input.keyboard.addKey(Phaser.Keyboard.A),\n' +
    '  right: this.input.keyboard.addKey(Phaser.Keyboard.D),\n' +
    '}\n'
  );
};

/**
 * Add keyboard spacebar.
 */
Blocks['phaser_input_keyboard_spacebar_add'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('BLOCKS_DEFINE'));
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_AS'))
      .appendField(i18next.t('BLOCKS_PHASER_KEYBOARD_SPACEBAR'))
      .appendField(BlocksTemplate.keyboard());
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(135);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add keyboard spacebar.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_input_keyboard_spacebar_add'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  return (
    variable +
    ' = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);\n' +
    variable +
    '.onDown.add(this.input_, this);\n'
  );
};

/**
 * Add keyboard shift keys (left/right).
 */
Blocks['phaser_input_keyboard_shift_add'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('BLOCKS_DEFINE'));
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_AS'))
      .appendField(i18next.t('BLOCKS_PHASER_KEYBOARD_SHIFT_KEYS'))
      .appendField(BlocksTemplate.keyboard());
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(135);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add keyboard shift keys (left/right).
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_input_keyboard_shift_add'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  return (
    variable +
    ' = this.input.keyboard.addKey(Phaser.KeyCode.SHIFT);\n' +
    variable +
    '.onDown.add(this.input_, this);\n'
  );
};

/**
 * Add keyboard key.
 */
Blocks['phaser_input_keyboard_key_add'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('BLOCKS_DEFINE'));
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_AS'))
      .appendField(i18next.t('BLOCKS_PHASER_KEYBOARD_KEY'))
      .appendField(
        new Blockly.FieldDropdown([
          [i18next.t('shift key'), 'Phaser.KeyCode.SHIFT'],
          [i18next.t('control key'), 'Phaser.KeyCode.CONTROL'],
          [i18next.t('spacebar'), 'Phaser.KeyCode.SPACEBAR'],
          ['w', 'Phaser.KeyCode.W'],
          ['a', 'Phaser.KeyCode.A'],
          ['s', 'Phaser.KeyCode.S'],
          ['d', 'Phaser.KeyCode.D'],
        ]),
        'keycode'
      )
      .appendField(BlocksTemplate.keyboard());
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(135);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add keyboard key.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_input_keyboard_key_add'] = function (block) {
  const dropdown_keycode = block.getFieldValue('keycode');
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  return (
    variable +
    ' = this.input.keyboard.addKey(' +
    dropdown_keycode +
    ');\n' +
    variable +
    '.onDown.add(this.input_, this);\n'
  );
};

/**
 * Add mouse keys.
 */
Blocks['phaser_input_mouse_keys_add'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.addCircle())
      .appendField(i18next.t('BLOCKS_DEFINE'));
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_AS'))
      .appendField(i18next.t('BLOCKS_PHASER_MOUSE_KEYS'))
      .appendField(BlocksTemplate.mouse());
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(135);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Add mouse keys.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator['phaser_input_mouse_keys_add'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );
  return (
    variable +
    ' = this.input.mouse.input;\n' +
    variable +
    '.onDown.add(this.input_, this);\n'
  );
};

/**
 * Keyboard cursor is pressed.
 */
Blocks['phaser_input_keyboard_cursor_is_pressed'] = {
  init: function () {
    this.appendValueInput('cursors').appendField(BlocksTemplate.keyboard());
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_KEY_IS_PRESSED'))
      .appendField(
        new Blockly.FieldDropdown([
          [i18next.t('BLOCKS_UP'), '.up'],
          [i18next.t('BLOCKS_DOWN'), '.down'],
          [i18next.t('BLOCKS_LEFT'), '.left'],
          [i18next.t('BLOCKS_RIGHT'), '.right'],
          [i18next.t('BLOCKS_KEY_PRESSED'), ''],
        ]),
        'direction'
      );
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(135);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Keyboard cursor is pressed.
 * @param {Blockly.Block} block
 * @return {string[]}
 */
javascriptGenerator['phaser_input_keyboard_cursor_is_pressed'] = function (
  block
) {
  const value_cursors = javascriptGenerator.valueToCode(
    block,
    'cursors',
    javascriptGenerator.ORDER_ATOMIC
  );
  const dropdown_direction = block.getFieldValue('direction');
  const code =
    value_cursors +
    dropdown_direction +
    '.isDown && e === ' +
    value_cursors +
    dropdown_direction;
  return [code, javascriptGenerator.ORDER_NONE];
};

/**
 * Keyboard cursor is hold pressed.
 */
Blocks['phaser_input_keyboard_cursor_is_hold_pressed'] = {
  init: function () {
    this.appendValueInput('cursors').appendField(BlocksTemplate.keyboard());
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_KEY_IS_HOLD_PRESSED'))
      .appendField(
        new Blockly.FieldDropdown([
          [i18next.t('BLOCKS_UP'), '.up'],
          [i18next.t('BLOCKS_DOWN'), '.down'],
          [i18next.t('BLOCKS_LEFT'), '.left'],
          [i18next.t('BLOCKS_RIGHT'), '.right'],
          [i18next.t('BLOCKS_KEY_PRESSED'), ''],
        ]),
        'direction'
      );
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(135);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Keyboard cursor is hold pressed.
 * @param {Blockly.Block} block
 * @return {string[]}
 */
javascriptGenerator['phaser_input_keyboard_cursor_is_hold_pressed'] = function (
  block
) {
  const value_cursors = javascriptGenerator.valueToCode(
    block,
    'cursors',
    javascriptGenerator.ORDER_ATOMIC
  );
  const dropdown_direction = block.getFieldValue('direction');
  const code =
    value_cursors +
    dropdown_direction +
    '.isDown && e !== ' +
    value_cursors +
    dropdown_direction;
  return [code, javascriptGenerator.ORDER_NONE];
};

/**
 * Keyboard key is pressed.
 */
Blocks['phaser_input_keyboard_key_is_pressed'] = {
  init: function () {
    this.appendValueInput('key').appendField(BlocksTemplate.keyboard());
    this.appendDummyInput().appendField(i18next.t('BLOCKS_KEY_IS_PRESSED'));
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(135);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Keyboard key is pressed.
 * @param {Blockly.Block} block
 * @return {string[]}
 */
javascriptGenerator['phaser_input_keyboard_key_is_pressed'] = function (block) {
  const value_key = javascriptGenerator.valueToCode(
    block,
    'key',
    javascriptGenerator.ORDER_ATOMIC
  );
  const code = value_key + '.isDown && e === ' + value_key;
  return [code, javascriptGenerator.ORDER_NONE];
};

/**
 * Keyboard key hold is pressed.
 */
Blocks['phaser_input_keyboard_key_is_hold_pressed'] = {
  init: function () {
    this.appendValueInput('key').appendField(BlocksTemplate.keyboard());
    this.appendDummyInput().appendField(
      i18next.t('BLOCKS_KEY_IS_HOLD_PRESSED')
    );
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(135);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Keyboard key is hold pressed.
 * @param {Blockly.Block} block
 * @return {string[]}
 */
javascriptGenerator['phaser_input_keyboard_key_is_hold_pressed'] = function (
  block
) {
  const value_key = javascriptGenerator.valueToCode(
    block,
    'key',
    javascriptGenerator.ORDER_ATOMIC
  );
  const code = value_key + '.isDown && e !== ' + value_key;
  return [code, javascriptGenerator.ORDER_NONE];
};

/**
 * Keyboard code is pressed.
 */
Blocks['phaser_input_keyboard_code_is_pressed'] = {
  init: function () {
    this.appendValueInput('key').appendField(BlocksTemplate.keyboard());
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_KEY_IS_PRESSED_WITH'))
      .appendField(
        new Blockly.FieldDropdown([
          ['ShiftLeft', 'ShiftLeft'],
          ['ShiftRight', 'ShiftRight'],
        ]),
        'code'
      )
      .appendField(i18next.t('code'));
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(135);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Keyboard code is pressed.
 * @param {Blockly.Block} block
 * @return {string[]}
 */
javascriptGenerator['phaser_input_keyboard_code_is_pressed'] = function (
  block
) {
  const value_key = javascriptGenerator.valueToCode(
    block,
    'key',
    javascriptGenerator.ORDER_ATOMIC
  );
  const dropdown_code = block.getFieldValue('code');
  const code =
    value_key +
    '.isDown && e === ' +
    value_key +
    ' && e.event.code === "' +
    dropdown_code +
    '"';
  return [code, javascriptGenerator.ORDER_NONE];
};

/**
 * Mouse key is pressed.
 */
Blocks['phaser_input_mouse_key_is_pressed'] = {
  init: function () {
    this.appendValueInput('mouse').appendField(BlocksTemplate.mouse());
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_KEY_IS_PRESSED'))
      .appendField(
        new Blockly.FieldDropdown([
          [i18next.t('BLOCKS_LEFT'), 'leftButton.isDown'],
          [i18next.t('BLOCKS_RIGHT'), 'rightButton.isDown'],
          [i18next.t('BLOCKS_ALL'), 'isDown'],
        ]),
        'direction'
      );
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(135);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Mouse button is pressed.
 * @param {Blockly.Block} block
 * @return {string[]}
 */
javascriptGenerator['phaser_input_mouse_key_is_pressed'] = function (block) {
  const value_mouse = javascriptGenerator.valueToCode(
    block,
    'mouse',
    javascriptGenerator.ORDER_ATOMIC
  );
  const dropdown_direction = block.getFieldValue('direction');
  const code =
    value_mouse +
    '.activePointer.' +
    dropdown_direction +
    ' && ' +
    'e === ' +
    value_mouse +
    '.activePointer';
  return [code, javascriptGenerator.ORDER_NONE];
};

/**
 * Mouse key is pressed.
 */
Blocks['phaser_input_mouse_key_is_hold_pressed'] = {
  init: function () {
    this.appendValueInput('mouse').appendField(BlocksTemplate.mouse());
    this.appendDummyInput()
      .appendField(i18next.t('BLOCKS_KEY_IS_HOLD_PRESSED'))
      .appendField(
        new Blockly.FieldDropdown([
          [i18next.t('BLOCKS_LEFT'), 'leftButton.isDown'],
          [i18next.t('BLOCKS_RIGHT'), 'rightButton.isDown'],
          [i18next.t('BLOCKS_ALL'), 'isDown'],
        ]),
        'direction'
      );
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(135);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Mouse button is hold pressed.
 * @param {Blockly.Block} block
 * @return {string[]}
 */
javascriptGenerator['phaser_input_mouse_key_is_hold_pressed'] = function (
  block
) {
  const value_mouse = javascriptGenerator.valueToCode(
    block,
    'mouse',
    javascriptGenerator.ORDER_ATOMIC
  );
  const dropdown_direction = block.getFieldValue('direction');
  const code =
    value_mouse +
    '.activePointer.' +
    dropdown_direction +
    ' && ' +
    'e !== ' +
    value_mouse +
    '.activePointer';
  return [code, javascriptGenerator.ORDER_NONE];
};
