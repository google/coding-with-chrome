/**
 * @fileoverview Lego WeDo 2.0 blocks for Blockly.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
 * Rotate power.
 */
Blockly.Blocks['lego_wedo2_rotate_power'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('set rotate power('))
      .appendField(new Blockly.FieldDropdown([
        [i18t('right'), 'right'],
        [i18t('left'), 'left'],
      ]), 'direction')
      .appendField(', ')
      .appendField(new Blockly.FieldTextInput('8'), 'power')
      .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Set the power of the motors to a certain power.' +
        'This setting remains until the program is complete or is updated.'));
  },
};


/**
 * Play tone.
 */
Blockly.Blocks['lego_wedo2_play_tone'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('play tone('))
      .appendField(new Blockly.FieldTextInput('400'), 'frequency')
      .appendField('Hz, ')
      .appendField(new Blockly.FieldTextInput('200'), 'duration')
      .appendField('ms, ')
      .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Play a tone with a certain frequency (32-13000Hz),' +
        'duration (milliseconds).'));
  },
};


/**
 * Led.
 */
Blockly.Blocks['lego_wedo2_led'] = {
  init: function() {
    let colourPicker = new Blockly
      .FieldColour('#32cd32')
      .setColours([
        '#000000',
        '#ffc0cb',
        '#800080',
        '#0000ff',
        '#00ffff',
        '#32cd32',
        '#00ff00',
        '#ffff00',
        '#ffa500',
        '#ff0000',
        '#add8e6',
      ])
      .setColumns(3);
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('set LED('))
      .appendField(colourPicker, 'color')
      .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Sets the leds on the Sphero ball.'));
  },
};

