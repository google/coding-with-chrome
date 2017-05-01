/**
 * @fileoverview JavaScript for the EV3 blocks.
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
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_set_robot_model'] = function(block) {
  let dropdown_robot = block.getFieldValue('robot');
  return 'ev3.setRobotModel("' + dropdown_robot + '");\n';
};


/**
 * Set wheel diameter.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_set_wheel_diameter'] = function(block) {
  let diameter = Number(block.getFieldValue('diameter') || 0);
  return 'ev3.setWheelDiameter(' + diameter + ');\n';
};


/**
 * Set wheel width.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_set_wheel_width'] = function(block) {
  let width = Number(block.getFieldValue('width') || 0);
  return 'ev3.setWheelWidth(' + width + ');\n';
};


/**
 * Set wheelbase.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_set_wheelbase'] = function(block) {
  let wheelbase = Number(block.getFieldValue('wheelbase') || 0);
  return 'ev3.setWheelbase(' + wheelbase + ');\n';
};


/**
 * Play tone.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_play_tone'] = function(block) {
  let frequency = block.getFieldValue('frequency');
  let duration = block.getFieldValue('duration');
  let volume = block.getFieldValue('volume');
  return 'ev3.playTone(' + frequency + ', ' + duration + ', ' +
      volume + ', ' + (Number(duration)) + ');\n';
};


/**
 * Move.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_move'] = function(block) {
  let dropdown_direction = block.getFieldValue('direction');
  let text_steps = block.getFieldValue('steps');
  let invert = dropdown_direction == 'backward';
  return 'ev3.moveSteps(' + text_steps + ', ' + (invert ? -50 : 50) +
    ', true);\n';
};


/**
 * Move distance.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_move_distance'] = function(block) {
  let dropdown_direction = block.getFieldValue('direction');
  let text_distance = block.getFieldValue('distance');
  let invert = dropdown_direction == 'backward';
  return 'ev3.moveDistance(' + text_distance + ', ' + (invert ? -50 : 50) +
    ', true);\n';
};


/**
 * Move forward.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_move_forward'] = function(block) {
  let text_steps = block.getFieldValue('steps');
  return 'ev3.moveSteps(' + text_steps + ', 50, true);\n';
};


/**
 * Move backward.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_move_backward'] = function(block) {
  let text_steps = block.getFieldValue('steps');
  return 'ev3.moveSteps(' + text_steps + ', -50, true);\n';
};


/**
 * Move up.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_move_up'] = function(block) {
  let text_steps = block.getFieldValue('steps');
  return 'ev3.customMoveSteps(' + text_steps + ', undefined, -50, true);\n';
};


/**
 * Move down.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_move_down'] = function(block) {
  let text_steps = block.getFieldValue('steps');
  return 'ev3.customMoveSteps(' + text_steps + ', undefined, 50, true);\n';
};


/**
 * Move pen.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_move_pen'] = function(block) {
  let colour = block.getFieldValue('colour');
  let dropdown_direction = block.getFieldValue('direction');
  let text_steps = block.getFieldValue('steps');
  let invert = dropdown_direction == 'up';
  let delay = Number(text_steps) * 5;
  return 'ev3.movePen(' + text_steps + ', ' + (invert ? -50 : 50) +
    ', \'' + colour + '\', ' + delay + ');\n';
};


/**
 * Move servo.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_move_servo'] = function(block) {
  let dropdown_direction = block.getFieldValue('direction');
  let text_steps = block.getFieldValue('steps');
  let invert = dropdown_direction == 'inverted';
  let delay = Number(text_steps) * 5;
  return 'ev3.moveServo(' + text_steps + ', ' + (invert ? -50 : 50) +
    ', ' + delay + ');\n';
};


/**
 * Rotate.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_rotate'] = function(block) {
  let angle_value = block.getFieldValue('angle');
  let dropdown_direction = block.getFieldValue('direction');
  let invert = dropdown_direction == 'left';
  let speed = invert ? -50 : 50;
  return 'ev3.rotateAngle(' + angle_value + ', ' + speed + ', true);\n';
};


/**
 * Rotate left.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_rotate_left'] = function(block) {
  let angle_value = block.getFieldValue('angle');
  return 'ev3.rotateAngle(' + angle_value + ', -50, true);\n';
};


/**
 * Rotate right.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_rotate_right'] = function(block) {
  let angle_value = block.getFieldValue('angle');
  return 'ev3.rotateAngle(' + angle_value + ', 50, true);\n';
};


/**
 * Stop.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_stop'] = function(block) {
  let dropdown_immediately = block.getFieldValue('immediately');
  if (dropdown_immediately == 'when finished') {
    return 'ev3.stop(500);\n';
  }
  return 'ev3.stop();\n';
};


/**
 * Stop immediately.
 * @return {!string}
 */
Blockly.JavaScript['ev3_stop_immediately'] = function() {
  return 'ev3.stop();\n';
};


/**
 * Wait.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_wait'] = function(block) {
  let time = block.getFieldValue('time');
  return 'ev3.wait(' + time + ');\n';
};


/**
 * Move power.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_move_power'] = function(block) {
  let dropdown_direction = block.getFieldValue('direction');
  let value_power = block.getFieldValue('power');
  let invert = dropdown_direction == 'backward';
  return 'ev3.movePower(' + (invert ? -value_power : value_power) + ');\n';
};


/**
 * Rotate power.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_rotate_power'] = function(block) {
  let dropdown_direction = block.getFieldValue('direction');
  let value_power = block.getFieldValue('power');
  let invert = dropdown_direction == 'left';
  let power = (invert ? -value_power : value_power);
  return 'ev3.rotatePower(' + power + ', ' + power + ');\n';
};


/**
 * Color sensor mode.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_color_sensor_mode'] = function(block) {
  let dropdown_mode = block.getFieldValue('mode');
  let mode = 0;
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
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_ir_sensor_mode'] = function(block) {
  let dropdown_mode = block.getFieldValue('mode');
  let mode = 0;
  switch (dropdown_mode) {
    case 'proximity':
      mode = 0;
      break;
    case 'IR beacon':
      mode = 1;
      break;
    case 'IR remote':
      mode = 2;
      break;
  }
  return 'ev3.setIrSensorMode(' + mode + ');\n';
};


/**
 * Ultrasonic sensor mode.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_ultrasonic_sensor_mode'] = function(block) {
  let dropdown_mode = block.getFieldValue('mode');
  let mode = 0;
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
 * @return {!string}
 */
Blockly.JavaScript['ev3_color_sensor_value'] = function() {
  let code = 'ev3.getColorSensorValue()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Touch sensor value.
 * @return {!string}
 */
Blockly.JavaScript['ev3_touch_sensor_value'] = function() {
  let code = 'ev3.getTouchSensorValue()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Ir sensor value.
 * @return {!string}
 */
Blockly.JavaScript['ev3_ir_sensor_value'] = function() {
  let code = 'ev3.getIrSensorValue()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Ultrasonic sensor value.
 * @return {!string}
 */
Blockly.JavaScript['ev3_ultrasonic_sensor_value'] = function() {
  let code = 'distance === undefined ?' +
    ' ev3.getUltrasonicSensorValue() : distance';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Color sensor change.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_color_sensor_change'] = function(block) {
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var colorSensorEvent = function(value) {\n' +
      statements_code + '};\nev3.onColorSensorChange(colorSensorEvent);\n';
};


/**
 * Gyro sensor change.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_gyro_sensor_change'] = function(block) {
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var gyroSensorEvent = function(angle) {\n' +
      statements_code + '};\nev3.onGyroSensorChange(gyroSensorEvent);\n';
};


/**
 * Ir sensor change.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_ir_sensor_change'] = function(block) {
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var irSensorEvent = function(value) {\n' +
      statements_code + '};\nev3.onIrSensorChange(irSensorEvent);\n';
};


/**
 * Touch sensor change.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_touch_sensor_change'] = function(block) {
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var touchEvent = function(pressed) {\n' +
      statements_code +
    '};\nev3.onTouchSensorChange(touchEvent);\n';
};


/**
 * Ultrasonic sensor change.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_ultrasonic_sensor_change'] = function(block) {
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var ultrasonicSensorEvent = function(distance) {\n' +
      statements_code +
    '};\nev3.onUltrasonicSensorChange(ultrasonicSensorEvent);\n';
};


/**
 * Stops the ultrasonic sensor event
 * @return {!string}
 */
Blockly.JavaScript['ev3_stop_ultrasonic_sensor_event'] = function() {
  return 'ev3.stopUltrasonicSensorEvent();\n';
};


/**
 * Variable.
 * @return {!string}
 */
Blockly.JavaScript['ev3_variable_value'] = function() {
  let code = 'value';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Led.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_led'] = function(block) {
  let dropdown_color = block.getFieldValue('color');
  let dropdown_mode = block.getFieldValue('mode');
  let color = 0;
  let mode = 0;
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
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['ev3_colors'] = function(block) {
  let color = block.getFieldValue('color');
  let colorMapping = {
    '#000000': 1,
    '#0000ff': 2,
    '#00ff00': 3,
    '#ffff00': 4,
    '#ff0000': 5,
    '#ffffff': 6,
    '#a52a2a': 7,
  };
  return [colorMapping[color] || 0, Blockly.JavaScript.ORDER_NONE];
};
