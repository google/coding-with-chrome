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

goog.require('cwc.blocks');
goog.require('cwc.blocks.ev3.JavaScript');
goog.require('cwc.config.sound');
goog.require('cwc.protocol.ev3.Robots');



/**
 * @private {string}
 */
cwc.blocks.ev3.Blocks.prefix_ = 'ev3_';


/**
 * Set robot model.
 */
cwc.blocks.addBlock('set_robot_model', function() {
  var robots = [['custom', 'custom']];
  for (var robot in cwc.protocol.ev3.Robots) {
    robots.push([robot, robot]);
  }
  this.setHelpUrl('');
  this.setColour(65);
  this.appendDummyInput()
    .appendField('set robot model(')
    .appendField(new Blockly.FieldDropdown(robots), 'robot')
    .appendField(')');
  this.setNextStatement(true);
  this.setTooltip('Sets the EV3 robot model.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Set wheel diameter.
 */
cwc.blocks.addBlock('set_wheel_diameter', function() {
  this.setHelpUrl('');
  this.setColour(65);
  this.appendDummyInput()
    .appendField('set wheel diameter(')
    .appendField(new Blockly.FieldTextInput('32'), 'diameter')
    .appendField('mm)');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Sets the wheel diameter.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Set wheel width.
 */
cwc.blocks.addBlock('set_wheel_width', function() {
  this.setHelpUrl('');
  this.setColour(65);
  this.appendDummyInput()
    .appendField('set wheel width(')
    .appendField(new Blockly.FieldTextInput('20'), 'width')
    .appendField('mm)');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Sets the wheel width.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Set wheelbase.
 */
cwc.blocks.addBlock('set_wheelbase', function() {
  this.setHelpUrl('');
  this.setColour(65);
  this.appendDummyInput()
    .appendField('set wheelbase(')
    .appendField(new Blockly.FieldTextInput('157'), 'wheelbase')
    .appendField('mm)');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Sets wheelbase.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Play music note.
 */
cwc.blocks.addBlock('play_music_note', function() {
  var map = cwc.config.sound;
  var note_list = [];
  for (var note in map.NOTE) {
    note_list.push([note, map.NOTE[note]['f'].toString()]);
  }
  var duration_list = [];
  for (var duration in map.DURATION) {
    duration_list.push([duration,
                        map.DURATION[duration]['d'].toString()]);
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
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Play tone.
 */
cwc.blocks.addBlock('play_tone', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18t('play tone('))
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
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Move.
 */
cwc.blocks.addBlock('move', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18t('move robot('))
    .appendField(new Blockly.FieldDropdown(
        [['forward', 'forward'], ['backward', 'backward']]), 'direction')
    .appendField(', ')
    .appendField(new Blockly.FieldTextInput('200'), 'steps')
    .appendField(' steps)');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Move the robot in a direction for a specified number ' +
      'of steps. ');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Move distance.
 */
cwc.blocks.addBlock('move_distance', function() {
  this.setHelpUrl('');
  this.setColour(120);
  this.appendDummyInput()
    .appendField(i18t('move robot('))
    .appendField(new Blockly.FieldDropdown(
        [['forward', 'forward'], ['backward', 'backward']]), 'direction')
    .appendField(', ')
    .appendField(new Blockly.FieldTextInput('10'), 'distance')
    .appendField(' cm)');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Move the robot in a direction for a specified distance');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Move forward.
 */
cwc.blocks.addBlock('move_forward', function() {
  this.setHelpUrl('');
  this.setColour(120);
  this.appendDummyInput()
    .appendField(i18t('move forward('))
    .appendField(new Blockly.FieldTextInput('200'), 'steps')
    .appendField(' steps)');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Move the robot forward for a specified number of steps. ');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Move backward.
 */
cwc.blocks.addBlock('move_backward', function() {
  this.setHelpUrl('');
  this.setColour(120);
  this.appendDummyInput()
    .appendField(i18t('move backward('))
    .appendField(new Blockly.FieldTextInput('200'), 'steps')
    .appendField(' steps)');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Move the robot backward for a specified number of steps.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Move up.
 */
cwc.blocks.addBlock('move_up', function() {
  this.setHelpUrl('');
  this.setColour(120);
  this.appendDummyInput()
    .appendField(i18t('move up('))
    .appendField(new Blockly.FieldTextInput('200'), 'steps')
    .appendField(' steps)');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Move the robot up for a specified number of steps. ');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Move down.
 */
cwc.blocks.addBlock('move_down', function() {
  this.setHelpUrl('');
  this.setColour(120);
  this.appendDummyInput()
    .appendField(i18t('move down('))
    .appendField(new Blockly.FieldTextInput('200'), 'steps')
    .appendField(' steps)');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Move the robot down for a specified number of steps.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Rotate left.
 */
cwc.blocks.addBlock('rotate_left', function() {
  this.setHelpUrl('');
  this.setColour(120);
  this.appendDummyInput()
    .appendField(i18t('turn left('))
    .appendField(new Blockly.FieldAngle('90'), 'angle')
    .appendField(')');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Turn the robot left by amount of the specified angle.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Rotate right.
 */
cwc.blocks.addBlock('rotate_right', function() {
  this.setHelpUrl('');
  this.setColour(120);
  this.appendDummyInput()
    .appendField(i18t('turn right('))
    .appendField(new Blockly.FieldAngle('90'), 'angle')
    .appendField(')');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Turn the robot right by amount of the specified angle.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Move pen.
 */
cwc.blocks.addBlock('move_pen', function() {
  this.setHelpUrl('');
  this.setColour(210);
  this.appendDummyInput()
    .appendField(i18t('move pen('))
    .appendField(new Blockly.FieldDropdown(
      [['down', 'down'], ['up', 'up']]), 'direction')
    .appendField(', ')
    .appendField(new Blockly.FieldTextInput('300'), 'steps')
    .appendField(')')
    .appendField(new Blockly.FieldColour('#cccccc'), 'colour');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Move the pen up or down by a certain number of steps.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Move servo.
 */
cwc.blocks.addBlock('move_servo', function() {
  this.setHelpUrl('');
  this.setColour(210);
  this.appendDummyInput()
    .appendField(i18t('move servo('))
    .appendField(new Blockly.FieldDropdown(
      [['normal', 'normal'], ['inverted', 'inverted']]), 'direction')
    .appendField(', ')
    .appendField(new Blockly.FieldTextInput('300'), 'steps')
    .appendField(')');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Move the servo by a certain number of steps.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Rotate.
 */
cwc.blocks.addBlock('rotate', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18t('rotate robot('))
    .appendField(new Blockly.FieldDropdown(
      [['right', 'right'], ['left', 'left']]), 'direction')
    .appendField(', ')
    .appendField(new Blockly.FieldAngle('90'), 'angle')
    .appendField(')');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Turn the robot in a direction by amount of the ' +
      'specified angle.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Stop.
 */
cwc.blocks.addBlock('stop', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18t('stop motors('))
    .appendField(new Blockly.FieldDropdown(
        [['when finished', 'when finished'],
         ['immediately', 'immediately']]), 'immediately')
    .appendField(')');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Stop all motors immediately or after the last command ' +
      'has finished.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Stop immediately.
 */
cwc.blocks.addBlock('stop_immediately', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18t('stop moving()'));
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Stop all motors immediately');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Wait.
 */
cwc.blocks.addBlock('wait', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18t('wait ('))
    .appendField(new Blockly.FieldTextInput('2000'), 'time')
    .appendField('msec)');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Wait for the given milliseconds.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Move power.
 */
cwc.blocks.addBlock('move_power', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18t('set motor power('))
    .appendField(new Blockly.FieldDropdown(
        [['forward', 'forward'], ['backward', 'backward']]), 'direction')
    .appendField(', ')
    .appendField(new Blockly.FieldTextInput('10'), 'power')
    .appendField(')');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Set the power of the motors to a certain power.' +
      'This setting remains until the program is complete or is updated.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Rotate power.
 */
cwc.blocks.addBlock('rotate_power', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18t('set rotate power('))
    .appendField(new Blockly.FieldDropdown(
        [['right', 'right'], ['left', 'left']]), 'direction')
    .appendField(', ')
    .appendField(new Blockly.FieldTextInput('10'), 'power')
    .appendField(')');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Set the power of the motors to a certain power.' +
      'This setting remains until the program is complete or is updated.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Color sensor mode.
 */
cwc.blocks.addBlock('color_sensor_mode', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18t('color sensor mode('))
    .appendField(new Blockly.FieldDropdown(
        [['reflected light of red light', 'reflection'],
         ['ambient light intensity', 'ambient light'],
         ['color', 'color']]), 'mode')
    .appendField(')');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Sets the colors sensor mode.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Ir sensor mode.
 */
cwc.blocks.addBlock('ir_sensor_mode', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18t('ir sensor mode('))
    .appendField(new Blockly.FieldDropdown(
        [['proximity', 'proximity'],
         ['ir beacon', 'ir beacon'],
         ['ir remote', 'ir remote']]), 'mode')
    .appendField(')');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Sets the ir sensor mode.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Ultrasonic sensor mode.
 */
cwc.blocks.addBlock('ultrasonic_sensor_mode', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18t('ultrasonic sensor mode('))
    .appendField(new Blockly.FieldDropdown(
        [['distance cm', 'distance cm'],
         ['distance inch', 'distance inch'],
         ['listen', 'listen']]), 'mode')
    .appendField(')');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Sets the ultrasonic sensor mode.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Led.
 */
cwc.blocks.addBlock('led', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18t('set led('))
    .appendField(new Blockly.FieldDropdown(
        [['off', 'off'],
         ['green', 'green'],
         ['red', 'red'],
         ['orange', 'orange']]), 'color')
    .appendField(', ')
    .appendField(new Blockly.FieldDropdown(
        [['normal', 'normal'],
         ['flash', 'flash'],
         ['pulse', 'pulse']]), 'mode')
        .appendField(')');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Sets the leds on the EV3 unit.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Color sensor value.
 */
cwc.blocks.addBlock('color_sensor_value', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18t('Color sensor value'));
  this.setOutput(true, 'Number');
  this.setTooltip('Get the current value of the color sensor.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Touch sensor value.
 */
cwc.blocks.addBlock('touch_sensor_value', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18t('Touch sensor value'));
  this.setOutput(true, 'Number');
  this.setTooltip('Get the current value of the touch sensor.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Ir sensor value.
 */
cwc.blocks.addBlock('ir_sensor_value', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18t('IR sensor value'));
  this.setOutput(true, 'Number');
  this.setTooltip('Get the current value of the IR sensor.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Ultrasonic sensor value.
 */
cwc.blocks.addBlock('ultrasonic_sensor_value', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18t('Ultrasonic sensor value'));
  this.setOutput(true, 'Number');
  this.setTooltip('Get the current value of the Ultrasonic sensor.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Color sensor change.
 */
cwc.blocks.addBlock('color_sensor_change', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18t('Color Sensor Change'));
  this.appendStatementInput('CODE')
    .setAlign(Blockly.ALIGN_CENTRE);
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Stores the output from the sensor in a variable named ' +
      '"value", when the color sensor detects a change.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Gryro sensor change.
 */
cwc.blocks.addBlock('gyro_sensor_change', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18t('Gyro Sensor Change'));
  this.appendStatementInput('CODE')
    .setAlign(Blockly.ALIGN_CENTRE);
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Stores the output from the sensor in a variable named ' +
      '"value", when the gyro sensor detects a change.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Ir sensor change.
 */
cwc.blocks.addBlock('ir_sensor_change', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18t('Ir Sensor Change'));
  this.appendStatementInput('CODE')
    .setAlign(Blockly.ALIGN_CENTRE);
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Stores the output from the sensor in a variable named ' +
      '"value", when the infrared sensor detects a change in distance.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Touch sensor change.
 */
cwc.blocks.addBlock('touch_sensor_change', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18t('on touch sensor change'));
  this.appendStatementInput('CODE')
    .setAlign(Blockly.ALIGN_CENTRE);
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Stores the output from the sensor in a variable named ' +
      '"value", when the touch sensor is pressed or released.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Ultrasonic sensor change.
 */
cwc.blocks.addBlock('ultrasonic_sensor_change', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18t('on ultrasonic sensor change'));
  this.appendStatementInput('CODE')
    .setAlign(Blockly.ALIGN_CENTRE);
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Stores the output from the sensor in a variable named ' +
      '"value", when the ultrasonic sensor detects a change.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Stops the ultrasonic sensor event.
 */
cwc.blocks.addBlock('stop_ultrasonic_sensor_event', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18t('stop ultrasonic sensor event()'));
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Stops the ultrasonic sensor event.');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Variable value.
 */
cwc.blocks.addBlock('variable_value', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField('value');
  this.setOutput(true, 'String');
  this.setTooltip('');
}, cwc.blocks.ev3.Blocks.prefix_);


/**
 * Colors block.
 */
cwc.blocks.addBlock('colors', function() {
  var colour = new Blockly.FieldColour('#ff0000');
  colour.setColours(['#000000', '#0000ff', '#00ff00', '#ffff00', '#ff0000',
      '#ffffff', '#a52a2a']).setColumns(1);
  this.setHelpUrl('');
  this.setColour(0);
  this.appendDummyInput()
    .appendField(colour, 'color');
  this.setOutput(true, 'String');
  this.setTooltip('');
}, cwc.blocks.ev3.Blocks.prefix_);
