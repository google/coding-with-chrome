/**
 * @fileoverview JavaScript for the EV3 blocks.
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



/**
 * Set robot model.
 */
Blockly.JavaScript['ev3_set_robot_model'] = function(block) {
  var dropdown_robot = block.getFieldValue('robot');
  return 'ev3.setRobotModel("' + dropdown_robot + '");\n';
};


/**
 * Set wheel diameter.
 */
Blockly.JavaScript['ev3_set_wheel_diameter'] = function(block) {
  var diameter = Number(block.getFieldValue('diameter') || 0);
  return 'ev3.setWheelDiameter(' + diameter + ');\n';
};


/**
 * Set wheel width.
 */
Blockly.JavaScript['ev3_set_wheel_width'] = function(block) {
  var width = Number(block.getFieldValue('width') || 0);
  return 'ev3.setWheelWidth(' + width + ');\n';
};


/**
 * Set wheelbase.
 */
Blockly.JavaScript['ev3_set_wheelbase'] = function(block) {
  var wheelbase = Number(block.getFieldValue('wheelbase') || 0);
  return 'ev3.setWheelbase(' + wheelbase + ');\n';
};


/**
 * Play tone.
 */
Blockly.JavaScript['ev3_play_tone'] = function(block) {
  var frequency = block.getFieldValue('frequency');
  var duration = block.getFieldValue('duration');
  var volume = block.getFieldValue('volume');
  return 'ev3.playTone(' + frequency + ', ' + duration + ', ' +
      volume + ', ' + (Number(duration)) + ');\n';
};


/**
 * Move.
 */
Blockly.JavaScript['ev3_move'] = function(block) {
  var dropdown_direction = block.getFieldValue('direction');
  var text_steps = block.getFieldValue('steps');
  var invert = dropdown_direction == 'backward';
  return 'ev3.moveSteps(' + text_steps + ', ' + (invert ? -50 : 50) +
    ', true);\n';
};


/**
 * Move distance.
 */
Blockly.JavaScript['ev3_move_distance'] = function(block) {
  var dropdown_direction = block.getFieldValue('direction');
  var text_distance = block.getFieldValue('distance');
  var invert = dropdown_direction == 'backward';
  return 'ev3.moveDistance(' + text_distance + ', ' + (invert ? -50 : 50) +
    ', true);\n';
};


/**
 * Move forward.
 */
Blockly.JavaScript['ev3_move_forward'] = function(block) {
  var text_steps = block.getFieldValue('steps');
  return 'ev3.moveSteps(' + text_steps + ', 50, true);\n';
};


/**
 * Move backward.
 */
Blockly.JavaScript['ev3_move_backward'] = function(block) {
  var text_steps = block.getFieldValue('steps');
  return 'ev3.moveSteps(' + text_steps + ', -50, true);\n';
};


/**
 * Move up.
 */
Blockly.JavaScript['ev3_move_up'] = function(block) {
  var text_steps = block.getFieldValue('steps');
  return 'ev3.customMoveSteps(' + text_steps + ', undefined, -50, true);\n';
};


/**
 * Move down.
 */
Blockly.JavaScript['ev3_move_down'] = function(block) {
  var text_steps = block.getFieldValue('steps');
  return 'ev3.customMoveSteps(' + text_steps + ', undefined, 50, true);\n';
};


/**
 * Move pen.
 */
Blockly.JavaScript['ev3_move_pen'] = function(block) {
  var colour = block.getFieldValue('colour');
  var dropdown_direction = block.getFieldValue('direction');
  var text_steps = block.getFieldValue('steps');
  var invert = dropdown_direction == 'up';
  var delay = Number(text_steps) * 5;
  return 'ev3.movePen(' + text_steps + ', ' + (invert ? -50 : 50) +
    ', \'' + colour + '\', ' + delay + ');\n';
};


/**
 * Move servo.
 */
Blockly.JavaScript['ev3_move_servo'] = function(block) {
  var dropdown_direction = block.getFieldValue('direction');
  var text_steps = block.getFieldValue('steps');
  var invert = dropdown_direction == 'inverted';
  var delay = Number(text_steps) * 5;
  return 'ev3.moveServo(' + text_steps + ', ' + (invert ? -50 : 50) +
    ', ' + delay + ');\n';
};


/**
 * Rotate.
 */
Blockly.JavaScript['ev3_rotate'] = function(block) {
  var angle_value = block.getFieldValue('angle');
  var dropdown_direction = block.getFieldValue('direction');
  var invert = dropdown_direction == 'left';
  var speed = invert ? -50 : 50;
  return 'ev3.rotateAngle(' + angle_value + ', ' + speed + ', true);\n';
};


/**
 * Rotate left.
 */
Blockly.JavaScript['ev3_rotate_left'] = function(block) {
  var angle_value = block.getFieldValue('angle');
  return 'ev3.rotateAngle(' + angle_value + ', -50, true);\n';
};


/**
 * Rotate right.
 */
Blockly.JavaScript['ev3_rotate_right'] = function(block) {
  var angle_value = block.getFieldValue('angle');
  return 'ev3.rotateAngle(' + angle_value + ', 50, true);\n';
};


/**
 * Stop.
 */
Blockly.JavaScript['ev3_stop'] = function(block) {
  var dropdown_immediately = block.getFieldValue('immediately');
  if (dropdown_immediately == 'when finished') {
    return 'ev3.stop(500);\n';
  }
  return 'ev3.stop();\n';
};


/**
 * Stop immediately.
 */
Blockly.JavaScript['ev3_stop_immediately'] = function(opt_block) {
  return 'ev3.stop();\n';
};


/**
 * Wait.
 */
Blockly.JavaScript['ev3_wait'] = function(block) {
  var time = block.getFieldValue('time');
  return 'ev3.wait(' + time + ');\n';
};


/**
 * Move power.
 */
Blockly.JavaScript['ev3_move_power'] = function(block) {
  var dropdown_direction = block.getFieldValue('direction');
  var value_power = block.getFieldValue('power');
  var invert = dropdown_direction == 'backward';
  return 'ev3.movePower(' + (invert ? -value_power : value_power) + ');\n';
};


/**
 * Rotate power.
 */
Blockly.JavaScript['ev3_rotate_power'] = function(block) {
  var dropdown_direction = block.getFieldValue('direction');
  var value_power = block.getFieldValue('power');
  var invert = dropdown_direction == 'left';
  var power = (invert ? -value_power : value_power);
  return 'ev3.rotatePower(' + power + ', ' + power + ');\n';
};


/**
 * Color sensor mode.
 */
Blockly.JavaScript['ev3_color_sensor_mode'] = function(block) {
  var dropdown_mode = block.getFieldValue('mode');
  var mode = 0;
  switch (dropdown_mode) {
    case 'reflection':
      mode = 0;
      break;
    case 'ambient light':
      mode = 1;
      break;
    case 'color':
      mode = 2;
      break;
  }
  return 'ev3.setColorSensorMode(' + mode + ');\n';
};


/**
 * Ir sensor mode.
 */
Blockly.JavaScript['ev3_ir_sensor_mode'] = function(block) {
  var dropdown_mode = block.getFieldValue('mode');
  var mode = 0;
  switch (dropdown_mode) {
    case 'proximity':
      mode = 0;
      break;
    case 'ir beacon':
      mode = 1;
      break;
    case 'ir remote':
      mode = 2;
      break;
  }
  return 'ev3.setIrSensorMode(' + mode + ');\n';
};


/**
 * Ultrasonic sensor mode.
 */
Blockly.JavaScript['ev3_ultrasonic_sensor_mode'] = function(block) {
  var dropdown_mode = block.getFieldValue('mode');
  var mode = 0;
  switch (dropdown_mode) {
    case 'distance cm':
      mode = 0;
      break;
    case 'distance inch':
      mode = 1;
      break;
    case 'listen':
      mode = 2;
      break;
  }
  return 'ev3.setUltrasonicSensorMode(' + mode + ');\n';
};



/**
 * Color sensor value.
 */
Blockly.JavaScript['ev3_color_sensor_value'] = function(opt_block) {
  var code = 'ev3.getColorSensorValue()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Touch sensor value.
 */
Blockly.JavaScript['ev3_touch_sensor_value'] = function(opt_block) {
  var code = 'ev3.getTouchSensorValue()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Ir sensor value.
 */
Blockly.JavaScript['ev3_ir_sensor_value'] = function(opt_block) {
  var code = 'ev3.getIrSensorValue()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Ultrasonic sensor value.
 */
Blockly.JavaScript['ev3_ultrasonic_sensor_value'] = function(opt_block) {
  var code = 'distance === undefined ?' +
    ' ev3.getUltrasonicSensorValue() : distance';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Color sensor change.
 */
Blockly.JavaScript['ev3_color_sensor_change'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var colorSensorEvent = function(value) {\n' +
      statements_code + '};\nev3.onColorSensorChange(colorSensorEvent);\n';
};


/**
 * Gyro sensor change.
 */
Blockly.JavaScript['ev3_gyro_sensor_change'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var gyroSensorEvent = function(angle) {\n' +
      statements_code + '};\nev3.onGyroSensorChange(gyroSensorEvent);\n';
};


/**
 * Ir sensor change.
 */
Blockly.JavaScript['ev3_ir_sensor_change'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var irSensorEvent = function(value) {\n' +
      statements_code + '};\nev3.onIrSensorChange(irSensorEvent);\n';
};


/**
 * Touch sensor change.
 */
Blockly.JavaScript['ev3_touch_sensor_change'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var touchEvent = function(pressed) {\n' +
      statements_code +
    '};\nev3.onTouchSensorChange(touchEvent);\n';
};


/**
 * Ultrasonic sensor change.
 */
Blockly.JavaScript['ev3_ultrasonic_sensor_change'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var ultrasonicSensorEvent = function(distance) {\n' +
      statements_code +
    '};\nev3.onUltrasonicSensorChange(ultrasonicSensorEvent);\n';
};


/**
 * Stops the ultrasonic sensor event.
 */
Blockly.JavaScript['ev3_stop_ultrasonic_sensor_event'] = function(opt_block) {
  return 'ev3.stopUltrasonicSensorEvent();\n';
};


/**
 * Variable.
 */
Blockly.JavaScript['ev3_variable_value'] = function(opt_block) {
  var code = 'value';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Led.
 */
Blockly.JavaScript['ev3_led'] = function(block) {
  var dropdown_color = block.getFieldValue('color');
  var dropdown_mode = block.getFieldValue('mode');
  var color = 0;
  var mode = 0;
  switch (dropdown_color) {
    case 'green':
      color = 1;
      break;
    case 'red':
      color = 2;
      break;
    case 'orange':
      color = 3;
      break;
  }
  switch (dropdown_mode) {
    case 'flash':
      mode = 3;
      break;
    case 'pulse':
      mode = 6;
      break;
  }
  return 'ev3.setLed(' + color + ', ' + mode + ', 10);\n';
};


/**
 * Colors block.
 */
Blockly.JavaScript['ev3_colors'] = function(block) {
  var color = block.getFieldValue('color');
  var colorMapping = {
    '#000000': 1,
    '#0000ff': 2,
    '#00ff00': 3,
    '#ffff00': 4,
    '#ff0000': 5,
    '#ffffff': 6,
    '#a52a2a': 7
  };
  return [colorMapping[color] || 0, Blockly.JavaScript.ORDER_NONE];
};
