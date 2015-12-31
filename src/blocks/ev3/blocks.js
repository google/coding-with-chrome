/**
 * @fileoverview EV3 blocks for Blockly.
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
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
goog.provide('cwc.blocks.ev3.Blocks');

goog.require('cwc.blocks.ev3.JavaScript');
goog.require('cwc.config.sound');

goog.require('Blockly');
goog.require('Blockly.Blocks');



Blockly.Blocks['ev3_play_music_note'] = {
  init: function() {
    var sound_map = cwc.config.sound;
    var note_list = [];
    for (var note in sound_map.NOTE) {
      note_list.push([note, sound_map.NOTE[note]['f'].toString()]);
    }
    var duration_list = [];
    for (var duration in sound_map.DURATION) {
      duration_list.push([duration,
                          sound_map.DURATION[duration]['d'].toString()]);
    }
    this.setHelpUrl('');
    this.setColour(65);
    this.appendDummyInput()
        .appendField('play music note')
        .appendField(new Blockly.FieldDropdown(note_list), 'note')
        .appendField('duration:')
        .appendField(new Blockly.FieldDropdown(duration_list), 'duration')
        .appendField('beats');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Play a music note with duration in beats');
  }
};


Blockly.Blocks['ev3_play_tone'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField(i18n.get('play tone('))
        .appendField(new Blockly.FieldTextInput('400'), 'frequency')
        .appendField('Hz, ')
        .appendField(new Blockly.FieldTextInput('200'), 'duration')
        .appendField('ms, ')
        .appendField(new Blockly.FieldTextInput('50'), 'volume')
        .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Play a tone with a certain frequency (32-13000Hz),' +
        'duration (milliseconds), and volume (0-100).');
  }
};


Blockly.Blocks['ev3_move'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField(i18n.get('move robot('))
        .appendField(new Blockly.FieldDropdown(
            [['forward', 'forward'], ['backward', 'backward']]), 'direction')
        .appendField('by')
        .appendField(new Blockly.FieldTextInput('200'), 'steps')
        .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Move the robot in a direction for a specified number ' +
        'of steps. ');
  }
};


Blockly.Blocks['ev3_move_forward'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(120);
    this.appendDummyInput()
              .appendField(i18n.get('move forward by'))
              .appendField(new Blockly.FieldTextInput('200'), 'steps');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Move the robot forward for a specified number of steps. ');
  }
};


Blockly.Blocks['ev3_move_backward'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(120);
    this.appendDummyInput()
              .appendField(i18n.get('move backward by'))
              .appendField(new Blockly.FieldTextInput('200'), 'steps');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Move the robot backward for a specified number of steps.');
  }
};


Blockly.Blocks['ev3_rotate_left'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(120);
    this.appendDummyInput()
              .appendField(i18n.get('turn left by'))
              .appendField(new Blockly.FieldAngle('90'), 'angle');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Turn the robot left by amount of the specified angle.');
  }
};


Blockly.Blocks['ev3_rotate_right'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(120);
    this.appendDummyInput()
              .appendField(i18n.get('turn right by'))
              .appendField(new Blockly.FieldAngle('90'), 'angle');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Turn the robot right by amount of the specified angle.');
  }
};


Blockly.Blocks['ev3_move_pen'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField(i18n.get('move pen('))
        .appendField(new Blockly.FieldDropdown(
            [['down', 'down'], ['up', 'up']]), 'direction')
        .appendField(new Blockly.FieldTextInput('300'), 'steps')
        .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Move the pen up or down by a certain number of steps.');
  }
};


Blockly.Blocks['ev3_move_servo'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField(i18n.get('move servo('))
        .appendField(new Blockly.FieldDropdown(
            [['normal', 'normal'], ['inverted', 'inverted']]), 'direction')
        .appendField(new Blockly.FieldTextInput('300'), 'steps')
        .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Move the servo by a certain number of steps.');
  }
};


Blockly.Blocks['ev3_rotate'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField(i18n.get('rotate robot('))
        .appendField(new Blockly.FieldDropdown(
            [['right', 'right'], ['left', 'left']]), 'direction')
        .appendField('by')
        .appendField(new Blockly.FieldAngle('90'), 'angle')
        .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Turn the robot in a direction by amount of the ' +
        'specified angle.');
  }
};


Blockly.Blocks['ev3_stop'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField(i18n.get('stop motors('))
        .appendField(new Blockly.FieldDropdown(
            [['when finished', 'when finished'],
             ['immediately', 'immediately']]), 'immediately')
        .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Stop all motors immediately or after the last command ' +
        'has finished.'); }
};


Blockly.Blocks['ev3_stop_immediately'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(120);
    this.appendDummyInput()
              .appendField(i18n.get('stop moving'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Stop all motors immediately'); }
};


Blockly.Blocks['ev3_move_power'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField(i18n.get('set motor power('))
        .appendField(new Blockly.FieldDropdown(
            [['forward', 'forward'], ['backward', 'backward']]), 'direction')
        .appendField('at')
        .appendField(new Blockly.FieldTextInput('10'), 'power')
        .appendField('% power)');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Set the power of the motors to a certain power.' +
        'This setting remains until the program is complete or is updated.');
  }
};


Blockly.Blocks['ev3_rotate_power'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField(i18n.get('set rotate power('))
        .appendField(new Blockly.FieldDropdown(
            [['right', 'right'], ['left', 'left']]), 'direction')
        .appendField('at')
        .appendField(new Blockly.FieldTextInput('10'), 'power')
        .appendField('% power)');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Set the power of the motors to a certain power.' +
        'This setting remains until the program is complete or is updated.');
  }
};


Blockly.Blocks['ev3_color_sensor_mode'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField(i18n.get('color sensor mode ('))
        .appendField(new Blockly.FieldDropdown(
            [['reflected light of red light', 'reflection'],
             ['ambient light intensity', 'ambient light'],
             ['color', 'color']]), 'mode').appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Sets the colors sensor mode.');
  }
};


Blockly.Blocks['ev3_ir_sensor_mode'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField(i18n.get('ir sensor mode ('))
        .appendField(new Blockly.FieldDropdown(
            [['proximity', 'proximity'],
             ['ir beacon', 'ir beacon'],
             ['ir remote', 'ir remote']]), 'mode').appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Sets the ir sensor mode.'); }
};


Blockly.Blocks['ev3_led'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField(i18n.get('set led ('))
        .appendField(new Blockly.FieldDropdown(
            [['off', 'off'],
             ['green', 'green'],
             ['red', 'red'],
             ['orange', 'orange']]), 'color')
        .appendField(new Blockly.FieldDropdown(
            [['normal', 'normal'],
             ['flash', 'flash'],
             ['pulse', 'pulse']]), 'mode')
        .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Sets the leds on the EV3 unit.'); }
};


Blockly.Blocks['ev3_color_sensor_value'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField(i18n.get('Color sensor value'));
    this.setOutput(true, 'Number');
    this.setTooltip('Get the current value of the color sensor.');
  }
};


Blockly.Blocks['ev3_touch_sensor_value'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField(i18n.get('Touch sensor value'));
    this.setOutput(true, 'Number');
    this.setTooltip('Get the current value of the touch sensor.');
  }
};


Blockly.Blocks['ev3_ir_sensor_value'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField(i18n.get('IR sensor value'));
    this.setOutput(true, 'Number');
    this.setTooltip('Get the current value of the IR sensor.');
  }
};


Blockly.Blocks['ev3_color_sensor_change'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField(i18n.get('Color Sensor Change'))
        .appendField(new Blockly.FieldVariable('value'), 'VALUE');
    this.appendStatementInput('CODE')
        .setAlign(Blockly.ALIGN_CENTRE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Stores the output from the sensor in a variable named ' +
        '"value", when the color sensor detects a change in color.');
  }
};


Blockly.Blocks['ev3_ir_sensor_change'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField(i18n.get('Ir Sensor Change'))
        .appendField(new Blockly.FieldVariable('value'), 'VALUE');
    this.appendStatementInput('CODE')
        .setAlign(Blockly.ALIGN_CENTRE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Stores the output from the sensor in a variable named ' +
        '"value", when the infrared sensor detects a change in distance.');
  }
};


Blockly.Blocks['ev3_touch_sensor_change'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField(i18n.get('Touch Sensor Change'))
        .appendField(new Blockly.FieldVariable('value'), 'VALUE');
    this.appendStatementInput('CODE')
        .setAlign(Blockly.ALIGN_CENTRE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Stores the output from the sensor in a variable named ' +
        '"value", when the touch sensor is pressed or released.');
  }
};

Blockly.Blocks['ev3_on_collision_ir'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField(i18n.get('If distance >'))
        .appendField(new Blockly.FieldTextInput('50'), 'VALUE1');
    this.appendStatementInput('CODE1');
    this.appendDummyInput()
        .appendField(i18n.get('If distance <'))
        .appendField(new Blockly.FieldTextInput('25'), 'VALUE2');
    this.appendStatementInput('CODE2')
        .setAlign(Blockly.ALIGN_CENTRE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Performs different commands depending on proximity to' +
        'nearby objects using IR sensor');
  }
};


Blockly.Blocks['ev3_variable_value'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField('value');
    this.setOutput(true, 'String');
    this.setTooltip('');
  }
};


Blockly.Blocks['ev3_touch_sensor_change'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField(i18n.get('On Touch Sensor Change'))
        .appendField(new Blockly.FieldVariable('value'), 'VALUE');
    this.appendStatementInput('CODE')
        .setAlign(Blockly.ALIGN_CENTRE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Stores the output from the sensor in a variable named ' +
      '"value", when the touch sensor is pressed or released.');
  }
};
