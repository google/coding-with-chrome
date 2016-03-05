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
goog.provide('cwc.blocks.ev3.JavaScript');

goog.require('Blockly');
goog.require('Blockly.JavaScript');
goog.require('cwc.config.sound');


/**
 * @private {string}
 */
cwc.blocks.ev3.JavaScript.prefix_ = 'ev3_';


/**
 * Play music note.
 */
cwc.blocks.addJavaScript('play_music_note', function(block) {
  var dropdown_note = block.getFieldValue('note');
  var text_duration = block.getFieldValue('duration');
  var text_volume = 100;
  var duration = Number(text_duration) * 1000 / cwc.config.sound.BPM;
  return 'ev3.playTone(' + Math.round(dropdown_note) + ', ' +
      Math.round(duration) + ', ' + text_volume + ');\n';
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Play tone.
 */
cwc.blocks.addJavaScript('play_tone', function(block) {
  var text_frequency = block.getFieldValue('frequency');
  var text_duration = block.getFieldValue('duration');
  var text_volume = block.getFieldValue('volume');
  return 'ev3.playTone(' + text_frequency + ', ' + text_duration + ', ' +
      text_volume + ', ' + (Number(text_duration)) + ');\n';
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Move.
 */
cwc.blocks.addJavaScript('move', function(block) {
  var dropdown_direction = block.getFieldValue('direction');
  var text_steps = block.getFieldValue('steps');
  var invert = dropdown_direction == 'backward';
  return 'ev3.moveSteps(' + text_steps + ', ' + (invert ? -50 : 50) +
    ', true);\n';
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Move distance.
 */
cwc.blocks.addJavaScript('move_distance', function(block) {
  var dropdown_direction = block.getFieldValue('direction');
  var text_distance = block.getFieldValue('distance');
  var invert = dropdown_direction == 'backward';
  return 'ev3.moveDistance(' + text_distance + ', ' + (invert ? -50 : 50) +
    ', true);\n';
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Move forward.
 */
cwc.blocks.addJavaScript('move_forward', function(block) {
  var text_steps = block.getFieldValue('steps');
  return 'ev3.moveSteps(' + text_steps + ', 50, true);\n';
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Move backward.
 */
cwc.blocks.addJavaScript('move_backward', function(block) {
  var text_steps = block.getFieldValue('steps');
  return 'ev3.moveSteps(' + text_steps + ', -50, true);\n';
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Move pen.
 */
cwc.blocks.addJavaScript('move_pen', function(block) {
  var colour = block.getFieldValue('colour');
  var dropdown_direction = block.getFieldValue('direction');
  var text_steps = block.getFieldValue('steps');
  var invert = dropdown_direction == 'up';
  var delay = Number(text_steps) * 5;
  return 'ev3.movePen(' + text_steps + ', ' + (invert ? -50 : 50) +
    ', \'' + colour + '\', ' + delay + ');\n';
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Move servo.
 */
cwc.blocks.addJavaScript('move_servo', function(block) {
  var dropdown_direction = block.getFieldValue('direction');
  var text_steps = block.getFieldValue('steps');
  var invert = dropdown_direction == 'inverted';
  var delay = Number(text_steps) * 5;
  return 'ev3.moveServo(' + text_steps + ', ' + (invert ? -50 : 50) +
    ', ' + delay + ');\n';
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Rotate.
 */
cwc.blocks.addJavaScript('rotate', function(block) {
  var angle_value = block.getFieldValue('angle');
  var dropdown_direction = block.getFieldValue('direction');
  var invert = dropdown_direction == 'left';
  var speed = invert ? -50 : 50;
  return 'ev3.rotateAngle(' + angle_value + ', ' + speed + ', true);\n';
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Rotate left.
 */
cwc.blocks.addJavaScript('rotate_left', function(block) {
  var angle_value = block.getFieldValue('angle');
  return 'ev3.rotateAngle(' + angle_value + ', -50, true);\n';
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Rotate right.
 */
cwc.blocks.addJavaScript('rotate_right', function(block) {
  var angle_value = block.getFieldValue('angle');
  return 'ev3.rotateAngle(' + angle_value + ', 50, true);\n';
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Stop.
 */
cwc.blocks.addJavaScript('stop', function(block) {
  var dropdown_immediately = block.getFieldValue('immediately');
  if (dropdown_immediately == 'when finished') {
    return 'ev3.stop(500);\n';
  }
  return 'ev3.stop();\n';
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Stop immediately.
 */
cwc.blocks.addJavaScript('stop_immediately', function(opt_block) {
  return 'ev3.stop();\n';
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Move power.
 */
cwc.blocks.addJavaScript('move_power', function(block) {
  var dropdown_direction = block.getFieldValue('direction');
  var value_power = block.getFieldValue('power');
  var invert = dropdown_direction == 'backward';
  return 'ev3.movePower(' + (invert ? -value_power : value_power) + ');\n';
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Rotate power.
 */
cwc.blocks.addJavaScript('rotate_power', function(block) {
  var dropdown_direction = block.getFieldValue('direction');
  var value_power = block.getFieldValue('power');
  var invert = dropdown_direction == 'left';
  var power = (invert ? -value_power : value_power);
  return 'ev3.rotatePower(' + power + ', ' + power + ');\n';
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Color sensor mode.
 */
cwc.blocks.addJavaScript('color_sensor_mode', function(block) {
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
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Sensor mode.
 */
cwc.blocks.addJavaScript('ir_sensor_mode', function(block) {
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
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Color sensor value.
 */
cwc.blocks.addJavaScript('color_sensor_value', function(opt_block) {
  var code = 'ev3.getColorSensorValue()';
  return [code, Blockly.JavaScript.ORDER_NONE];
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Touch sensor value.
 */
cwc.blocks.addJavaScript('touch_sensor_value', function(opt_block) {
  var code = 'ev3.getTouchSensorValue()';
  return [code, Blockly.JavaScript.ORDER_NONE];
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Ir sensor value.
 */
cwc.blocks.addJavaScript('ir_sensor_value', function(opt_block) {
  var code = 'ev3.getIrSensorValue()';
  return [code, Blockly.JavaScript.ORDER_NONE];
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Color sensor change.
 */
cwc.blocks.addJavaScript('color_sensor_change', function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var colorSensorEvent = function(value) {\n' +
      statements_code + '};\nev3.onColorSensorChange(colorSensorEvent);\n';
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Ir sensor change.
 */
cwc.blocks.addJavaScript('ir_sensor_change', function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var irSensorEvent = function(value) {\n' +
      statements_code + '};\nev3.onIrSensorChange(irSensorEvent);\n';
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Touch sensor change.
 */
cwc.blocks.addJavaScript('touch_sensor_change', function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var touchEvent = function(value) {\n' +
      statements_code +
      '};\nev3.onTouchSensorChange(touchEvent);\n';
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Ir collision.
 */
cwc.blocks.addJavaScript('on_collision_ir', function(block) {
  var statements_code1 = Blockly.JavaScript.statementToCode(block, 'CODE1');
  var statements_code2 = Blockly.JavaScript.statementToCode(block, 'CODE2');
  var value1 = block.getFieldValue('VALUE1');
  var value2 = block.getFieldValue('VALUE2');
  return 'var irSensorEvent = function(value) {\n' +
      'if(value > ' + value1 + ') {\n' +
      statements_code1 + '\n}\nelse if(value < ' +
      value2 + ') {\n' +
      statements_code2 + '\n}' +
      '};\nev3.onIrSensorChange(irSensorEvent);\n' +
      'ev3.setIrSensorMode(0);\n';
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Variable.
 */
cwc.blocks.addJavaScript('variable_value', function(opt_block) {
  var code = 'value';
  return [code, Blockly.JavaScript.ORDER_NONE];
}, cwc.blocks.ev3.JavaScript.prefix_);


/**
 * Led.
 */
cwc.blocks.addJavaScript('led', function(block) {
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
}, cwc.blocks.ev3.JavaScript.prefix_);
