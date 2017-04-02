/**
 * @fileoverview EV3 blocks for Blockly.
 *
 * @license Copyright 2015 The Coding with Chrome Authors.
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
 * Set robot model.
 */
Blockly.Blocks['ev3_set_robot_model'] = {
  init: function() {
    var robots = [
      ['custom', 'custom'],
      ['EDUCATOR', 'EDUCATOR'],
      ['TRACK3R', 'TRACK3R'],
      ['GRYO BOY', 'GRYO BOY'],
      ['ROBOT ARM H25', 'ROBOT ARM H25']
    ];
    this.setHelpUrl('');
    this.setColour(65);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('set robot model('))
      .appendField(new Blockly.FieldDropdown(robots), 'robot')
      .appendField(')');
    this.setNextStatement(true);
    this.setTooltip(i18t('Sets the EV3 robot model'));
  }
};


/**
 * Set wheel diameter.
 */
Blockly.Blocks['ev3_set_wheel_diameter'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(65);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('set wheel diameter('))
      .appendField(new Blockly.FieldTextInput('32'), 'diameter')
      .appendField('mm)');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Sets the wheel diameter'));
  }
};


/**
 * Set wheel width.
 */
Blockly.Blocks['ev3_set_wheel_width'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(65);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('set wheel width('))
      .appendField(new Blockly.FieldTextInput('20'), 'width')
      .appendField('mm)');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Sets the wheel width'));
  }
};


/**
 * Set wheelbase.
 */
Blockly.Blocks['ev3_set_wheelbase'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(65);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('set wheelbase('))
      .appendField(new Blockly.FieldTextInput('157'), 'wheelbase')
      .appendField('mm)');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Sets wheelbase'));
  }
};


/**
 * Play tone.
 */
Blockly.Blocks['ev3_play_tone'] = {
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
      .appendField(new Blockly.FieldTextInput('50'), 'volume')
      .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Play a tone with a certain frequency (32-13000Hz),' +
        'duration (milliseconds), and volume (0-100).'));
  }
};


/**
 * Move.
 */
Blockly.Blocks['ev3_move'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('move robot('))
      .appendField(new Blockly.FieldDropdown([
        [i18t('forward'), 'forward'],
        [i18t('backward'), 'backward']
      ]), 'direction')
      .appendField(', ')
      .appendField(new Blockly.FieldTextInput('200'), 'steps')
      .appendField(' steps)');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Move the robot in a direction for a specified ' +
        'number of steps.'));
  }
};


/**
 * Move distance.
 */
Blockly.Blocks['ev3_move_distance'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(120);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('move robot('))
      .appendField(new Blockly.FieldDropdown([
        [i18t('forward'), 'forward'],
        [i18t('backward'), 'backward']
      ]), 'direction')
      .appendField(', ')
      .appendField(new Blockly.FieldTextInput('10'), 'distance')
      .appendField(' cm)');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(
      i18t('Move the robot in a direction for the given distance'));
  }
};


/**
 * Move forward.
 */
Blockly.Blocks['ev3_move_forward'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(120);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('move forward('))
      .appendField(new Blockly.FieldTextInput('200'), 'steps')
      .appendField(i18t(' steps)'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(
      i18t('Move the robot forward by the given number of steps'));
  }
};


/**
 * Move backward.
 */
Blockly.Blocks['ev3_move_backward'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(120);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('move backward('))
      .appendField(new Blockly.FieldTextInput('200'), 'steps')
      .appendField(i18t(' steps)'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(
      i18t('Move the robot backward by the given number of steps'));
  }
};


/**
 * Move up.
 */
Blockly.Blocks['ev3_move_up'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(120);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('move up('))
      .appendField(new Blockly.FieldTextInput('200'), 'steps')
      .appendField(i18t(' steps)'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(
      i18t('Move the robot up for a specified number of steps.'));
  }
};


/**
 * Move down.
 */
Blockly.Blocks['ev3_move_down'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(120);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('move down('))
      .appendField(new Blockly.FieldTextInput('200'), 'steps')
      .appendField(i18t(' steps)'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(
      i18t('Move the robot down for a specified number of steps.'));
  }
};


/**
 * Rotate left.
 */
Blockly.Blocks['ev3_rotate_left'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(120);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('turn left('))
      .appendField(new Blockly.FieldAngle('90'), 'angle')
      .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(
      i18t('Turn the robot left by the given angle'));
  }
};


/**
 * Rotate right.
 */
Blockly.Blocks['ev3_rotate_right'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(120);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('turn right('))
      .appendField(new Blockly.FieldAngle('90'), 'angle')
      .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(
      i18t('Turn the robot right by the given angle'));
  }
};


/**
 * Move pen.
 */
Blockly.Blocks['ev3_move_pen'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(210);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('move pen('))
      .appendField(new Blockly.FieldDropdown([
        [i18t('down'), 'down'],
        [i18t('up'), 'up']
      ]), 'direction')
      .appendField(', ')
      .appendField(new Blockly.FieldTextInput('300'), 'steps')
      .appendField(')')
      .appendField(new Blockly.FieldColour('#cccccc'), 'colour');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(
      i18t('Move the pen up or down by the given number of steps'));
  }
};


/**
 * Move servo.
 */
Blockly.Blocks['ev3_move_servo'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(210);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('move servo('))
      .appendField(new Blockly.FieldDropdown([
        [i18t('normal'), 'normal'],
        [i18t('inverted'), 'inverted']
      ]), 'direction')
      .appendField(', ')
      .appendField(new Blockly.FieldTextInput('300'), 'steps')
      .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(
      i18t('Move the servo by the given number of steps'));
  }
};


/**
 * Rotate.
 */
Blockly.Blocks['ev3_rotate'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('rotate robot('))
      .appendField(new Blockly.FieldDropdown([
        [i18t('right'), 'right'],
        [i18t('left'), 'left']
      ]), 'direction')
      .appendField(', ')
      .appendField(new Blockly.FieldAngle('90'), 'angle')
      .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Turn the robot in a direction by amount of the ' +
        'specified angle.'));
  }
};


/**
 * Stop.
 */
Blockly.Blocks['ev3_stop'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('stop motors('))
      .appendField(new Blockly.FieldDropdown([
        [i18t('when finished'), 'when finished'],
        [i18t('immediately'), 'immediately']
      ]), 'immediately')
      .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Stop all motors immediately or after the last ' +
      'command has finished.'));
  }
};


/**
 * Stop immediately.
 */
Blockly.Blocks['ev3_stop_immediately'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('stop moving()'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Stop all motors immediately'));
  }
};


/**
 * Wait.
 */
Blockly.Blocks['ev3_wait'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('wait ('))
      .appendField(new Blockly.FieldTextInput('2000'), 'time')
      .appendField('msec)');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Wait for the given milliseconds'));
  }
};


/**
 * Move power.
 */
Blockly.Blocks['ev3_move_power'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('set motor power('))
      .appendField(new Blockly.FieldDropdown([
        [i18t('forward'), 'forward'],
        [i18t('backward'), 'backward']
      ]), 'direction')
      .appendField(', ')
      .appendField(new Blockly.FieldTextInput('10'), 'power')
      .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Set the power of the motors to a certain power.' +
        'This setting remains until the program is complete or is updated.'));
  }
};


/**
 * Rotate power.
 */
Blockly.Blocks['ev3_rotate_power'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('set rotate power('))
      .appendField(new Blockly.FieldDropdown([
        [i18t('right'), 'right'],
        [i18t('left'), 'left']
      ]), 'direction')
      .appendField(', ')
      .appendField(new Blockly.FieldTextInput('10'), 'power')
      .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Set the power of the motors to a certain power.' +
        'This setting remains until the program is complete or is updated.'));
  }
};


/**
 * Color sensor mode.
 */
Blockly.Blocks['ev3_color_sensor_mode'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('color sensor mode('))
      .appendField(new Blockly.FieldDropdown([
        [i18t('reflected red light'), 'reflection'],
        [i18t('ambient light intensity'), 'ambient light'],
        [i18t('color'), 'color']
      ]), 'mode')
      .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Sets the color sensor mode'));
  }
};


/**
 * Ir sensor mode.
 */
Blockly.Blocks['ev3_ir_sensor_mode'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('IR sensor mode('))
      .appendField(new Blockly.FieldDropdown([
        [i18t('proximity'), 'proximity'],
        [i18t('IR beacon'), 'IR beacon'],
        [i18t('IR remote'), 'IR remote']
      ]), 'mode')
      .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Sets the IR sensor mode'));
  }
};


/**
 * Ultrasonic sensor mode.
 */
Blockly.Blocks['ev3_ultrasonic_sensor_mode'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('ultrasonic sensor mode('))
      .appendField(new Blockly.FieldDropdown([
        [i18t('distance cm'), 'distance cm'],
        [i18t('distance inch'), 'distance inch'],
        [i18t('listen'), 'listen']
      ]), 'mode')
      .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Sets the ultrasonic sensor mode'));
  }
};


/**
 * Led.
 */
Blockly.Blocks['ev3_led'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('set LED('))
      .appendField(new Blockly.FieldDropdown([
        [i18t('off'), 'off'],
        [i18t('green'), 'green'],
        [i18t('red'), 'red'],
        [i18t('orange'), 'orange']
      ]), 'color')
      .appendField(', ')
      .appendField(new Blockly.FieldDropdown([
        [i18t('normal'), 'normal'],
        [i18t('flash'), 'flash'],
        [i18t('pulse'), 'pulse']
      ]), 'mode')
      .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Sets the LEDs on the EV3 unit'));
  }
};


/**
 * Color sensor value.
 */
Blockly.Blocks['ev3_color_sensor_value'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(i18t('Color sensor value'));
    this.setOutput(true, 'Number');
    this.setTooltip(i18t('Get the current value of the color sensor'));
  }
};


/**
 * Touch sensor value.
 */
Blockly.Blocks['ev3_touch_sensor_value'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(i18t('Touch sensor value'));
    this.setOutput(true, 'Number');
    this.setTooltip(i18t('Get the current value of the touch sensor'));
  }
};


/**
 * Ir sensor value.
 */
Blockly.Blocks['ev3_ir_sensor_value'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(i18t('IR sensor value'));
    this.setOutput(true, 'Number');
    this.setTooltip(i18t('Get the current value of the IR sensor'));
  }
};


/**
 * Ultrasonic sensor value.
 */
Blockly.Blocks['ev3_ultrasonic_sensor_value'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(i18t('Ultrasonic sensor value'));
    this.setOutput(true, 'Number');
    this.setTooltip(i18t('Get the current value of the Ultrasonic sensor'));
  }
};


/**
 * Color sensor change.
 */
Blockly.Blocks['ev3_color_sensor_change'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('Color sensor change'));
    this.appendStatementInput('CODE')
      .setAlign(Blockly.ALIGN_CENTRE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Stores the output from the sensor in a variable ' +
        'named "value", when the color sensor detects a change'));
  }
};


/**
 * Gryro sensor change.
 */
Blockly.Blocks['ev3_gyro_sensor_change'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('Gyro sensor change'));
    this.appendStatementInput('CODE')
      .setAlign(Blockly.ALIGN_CENTRE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Stores the output from the sensor in a variable ' +
        'named "value", when the gyro sensor detects a change'));
  }
};


/**
 * Ir sensor change.
 */
Blockly.Blocks['ev3_ir_sensor_change'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('IR sensor change'));
    this.appendStatementInput('CODE')
      .setAlign(Blockly.ALIGN_CENTRE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Stores the output from the sensor in a variable ' +
        'named "value", when the infrared sensor detects a change in ' +
        'distance.'));
  }
};


/**
 * Touch sensor change.
 */
Blockly.Blocks['ev3_touch_sensor_change'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('on touch sensor change'));
    this.appendStatementInput('CODE')
      .setAlign(Blockly.ALIGN_CENTRE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Stores the output from the sensor in a variable ' +
        'named "value", when the touch sensor is pressed or released'));
  }
};


/**
 * Ultrasonic sensor change.
 */
Blockly.Blocks['ev3_ultrasonic_sensor_change'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('on ultrasonic sensor change'));
    this.appendStatementInput('CODE')
      .setAlign(Blockly.ALIGN_CENTRE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Stores the output from the sensor in a variable ' +
        'named "value", when the ultrasonic sensor detects a change'));
  }
};


/**
 * Stops the ultrasonic sensor event
 */
Blockly.Blocks['ev3_stop_ultrasonic_sensor_event'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('stop ultrasonic sensor event()'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(i18t('Stops the ultrasonic sensor event'));
  }
};


/**
 * Variable value.
 */
Blockly.Blocks['ev3_variable_value'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(i18t('value'));
    this.setOutput(true, 'String');
    this.setTooltip('');
  }
};


/**
 * Colors block.
 */
Blockly.Blocks['ev3_colors'] = {
  init: function() {
    var colour = new Blockly.FieldColour('#ff0000');
    colour.setColours(['#000000', '#0000ff', '#00ff00', '#ffff00', '#ff0000',
      '#ffffff', '#a52a2a']).setColumns(1);
    this.setHelpUrl('');
    this.setColour(0);
    this.appendDummyInput()
      .appendField(colour, 'color');
    this.setOutput(true, 'String');
    this.setTooltip('');
  }
};
