/**
 * @fileoverview mBot Ranger blocks for Blockly.
 *
 * @license Copyright 2016 Shenzhen Maker Works Co, Ltd. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author wangyu@makeblock.cc (Yu Wang)
 * @author mbordihn@google.com (Markus Bordihn)
 */



/**
 * Move forward.
 */
Blockly.Blocks['mbot_ranger_move_forward'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(120);
    this.appendValueInput('speed')
      .setCheck('Number')
      .appendField('move forward');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Move the robot forward with the specific speed.');
  }
};


/**
 * Move forward time.
 */
Blockly.Blocks['mbot_ranger_move_forward_time'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendValueInput('time').setCheck('Number')
      .appendField('move forward for');
    this.appendValueInput('speed').setCheck('Number').appendField('sec with');
    this.appendDummyInput().appendField('speed');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Move the mBot forward for the given seconds.');
  }
};


/**
 * Move forward steps.
 */
Blockly.Blocks['mbot_ranger_move_forward_steps'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendValueInput('steps').setCheck('Number')
      .appendField('move forward for');
    this.appendValueInput('speed').setCheck('Number').appendField('steps with');
    this.appendDummyInput().appendField('speed');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Move the robot forward for the specific steps.');
  }
};


/**
 * Move backward.
 */
Blockly.Blocks['mbot_ranger_move_backward'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(120);
    this.appendValueInput('speed')
      .setCheck('Number')
      .appendField('move backward');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Move the robot backward with the specific speed.');
  }
};


/**
 * Move forward time.
 */
Blockly.Blocks['mbot_ranger_move_backward_time'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendValueInput('time').setCheck('Number')
      .appendField('move backward for');
    this.appendValueInput('speed').setCheck('Number').appendField('sec with');
    this.appendDummyInput().appendField('speed');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Move the mBot backward for the given seconds.');
  }
};


/**
 * Move backward steps.
 */
Blockly.Blocks['mbot_ranger_move_backward_steps'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendValueInput('steps').setCheck('Number')
      .appendField('move backward for');
    this.appendValueInput('speed').setCheck('Number').appendField('steps with');
    this.appendDummyInput().appendField('speed');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Move the robot backward for the specific steps.');
  }
};


/**
 * Rotate left.
 */
Blockly.Blocks['mbot_ranger_rotate_left'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(120);
    this.appendValueInput('speed')
      .setCheck('Number')
      .appendField('rotate left');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('rotate the robot left with the specific speed.');
  }
};


/**
 * Rotate left time.
 */
Blockly.Blocks['mbot_ranger_rotate_left_time'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendValueInput('time').setCheck('Number')
      .appendField('rotate left for');
    this.appendValueInput('speed').setCheck('Number').appendField('sec with');
    this.appendDummyInput().appendField('speed');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Rotate the mBot left for the given seconds.');
  }
};


/**
 * Rotate right.
 */
Blockly.Blocks['mbot_ranger_rotate_right'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(120);
    this.appendValueInput('speed')
      .setCheck('Number')
      .appendField('rotate right');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('rotate the robot right with the specific speed.');
  }
};


/**
 * Rotate right time.
 */
Blockly.Blocks['mbot_ranger_rotate_right_time'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendValueInput('time').setCheck('Number')
      .appendField('rotate right for');
    this.appendValueInput('speed').setCheck('Number').appendField('sec with');
    this.appendDummyInput().appendField('speed');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Rotate the mBot right for the given seconds.');
  }
};


/**
 * Stop Moving.
 */
Blockly.Blocks['mbot_ranger_stop_moving'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(120);
    this.appendDummyInput()
      .appendField(i18t('Stop moving'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Stop moving.');
  }
};


/**
 * Play music note.
 */
Blockly.Blocks['mbot_ranger_play_tone'] = {
  init: function() {
    var note_list = [
      ['C3', '130.81'], ['C#3/Db3', '138.59'], ['D3', '146.83'],
      ['D#3/Eb3', '155.56'], ['E3', '164.81'], ['F3', '174.61'],
      ['F#3/Gb3', '185'], ['G3', '196'], ['G#3/Ab3', '207.65'], ['A3', '220'],
      ['A#3/Bb3', '233.08'], ['B3', '246.94'], ['C4', '261.63'],
      ['C#4/Db4', '277.18'], ['D4', '293.66'], ['D#4/Eb4', '311.13'],
      ['E4', '329.63'], ['F4', '349.23'], ['F#4/Gb4', '369.99'], ['G4', '392'],
      ['G#4/Ab4', '415.3'], ['A4', '440'], ['A#4/Bb4', '466.16'],
      ['B4', '493.88'], ['C5', '523.25'], ['C#5/Db5', '554.37'],
      ['D5', '587.33'], ['D#5/Eb5', '622.25'], ['E5', '659.25'],
      ['F5', '698.46'], ['F#5/Gb5', '739.99'], ['G5', '783.99'],
      ['G#5/Ab5', '830.61'], ['A5', '880'], ['A#5/Bb5', '932.33'],
      ['B5', '987.77'], ['C6', '1046.5'], ['C#6/Db6', '1108.73'],
      ['D6', '1174.66'], ['D#6/Eb6', '1244.51'], ['E6', '1318.51'],
      ['F6', '1396.91'], ['F#6/Gb6', '1479.98'], ['G6', '1567.98'],
      ['G#6/Ab6', '1661.22'], ['A6', '1760'], ['A#6/Bb6', '1864.66'],
      ['B6', '1975.53'], ['C7', '2093']];
    var duration_list = [
      ['1/1', '240'], ['1/2', '120'], ['1/4', '60'], ['1/8', '30'],
      ['1/16', '15'], ['1/1 dotted', '360'], ['1/2 dotted', '180'],
      ['1/4 dotted', '90'], ['1/8 dotted', '45'], ['1/16 dotted', '22.5'],
      ['1/4 triplet', '40'], ['1/8 triplet', '20'], ['1/16 triplet', '10']];
    this.setHelpUrl('');
    this.setColour(65);
    this.appendDummyInput()
      .appendField('play music note')
      .appendField(new Blockly.FieldDropdown(note_list), 'frequency')
      .appendField('duration:')
      .appendField(new Blockly.FieldDropdown(duration_list), 'duration')
      .appendField('beats');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Play a music note with duration in beats');
  }
};


/**
 * mbot rgb.
 */
Blockly.Blocks['mbot_ranger_rgb'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(i18t('set on board led '))
      .appendField(new Blockly.FieldDropdown([
        ['all', '0'],
        ['port 1', '1'],
        ['port 2', '2'],
        ['port 3', '3'],
        ['port 4', '4'],
        ['port 5', '5'],
        ['port 6', '6'],
        ['port 7', '7'],
        ['port 8', '8'],
        ['port 9', '9'],
        ['port 10', '10'],
        ['port 11', '11'],
        ['port 12', '12'],
      ]), 'position');
    this.appendValueInput('colour')
      .appendField(i18t('to color ('));
    this.appendDummyInput().appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Sets the leds on the mbotRanger.');
  }
};


/**
 * Lightness sensor change.
 */
Blockly.Blocks['mbot_ranger_lightness_sensor_change'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(i18t('on lightness sensor change'));
    this.appendStatementInput('CODE')
      .setAlign(Blockly.ALIGN_CENTRE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Stores the output from the sensor in a variable named ' +
        '\'value\', when the lightness sensor detects a change.');
  }
};


/**
 * LineFollower sensor change.
 */
Blockly.Blocks['mbot_ranger_linefollower_sensor_change'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(i18t('on linefollower sensor change'));
    this.appendStatementInput('CODE')
      .setAlign(Blockly.ALIGN_CENTRE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Stores the output from the sensor in a variable named ' +
        '\'value\', when the lightness sensor detects a change.');
  }
};


/**
 * Temperature sensor change.
 */
Blockly.Blocks['mbot_ranger_temperature_sensor_change'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(i18t('on temperature sensor change'));
    this.appendStatementInput('CODE')
      .setAlign(Blockly.ALIGN_CENTRE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Stores the output from the sensor in a variable named ' +
        '\'temperature\', when the temperature sensor detects a change.');
  }
};


/**
 * Ultrasonic sensor change.
 */
Blockly.Blocks['mbot_ranger_ultrasonic_sensor_change'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(i18t('on ultrasonic sensor change'));
    this.appendStatementInput('CODE')
      .setAlign(Blockly.ALIGN_CENTRE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Stores the output from the sensor in a variable named ' +
        '\'distance\', when the ultrasonic sensor detects a change');
  }
};


/**
 * Ultrasonic sensor value.
 */
Blockly.Blocks['mbot_ranger_ultrasonic_sensor_value'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput().appendField('ultrasonic sensor value');
    this.setOutput(true, 'Number');
    this.setTooltip('Get the current value of the Ultrasonic sensor');
  }
};


/**
 * Lightness sensor value.
 */
Blockly.Blocks['mbot_ranger_lightness_sensor_value'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput().appendField('lightness sensor value');
    this.setOutput(true, 'Number');
    this.setTooltip('Get the current value of the lightness sensor.');
  }
};


/**
 * Wait.
 */
Blockly.Blocks['mbot_ranger_wait'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(i18t('wait ('))
      .appendField(new Blockly.FieldTextInput('2000'), 'time')
      .appendField('msec)');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Wait for the given milliseconds');
  }
};
