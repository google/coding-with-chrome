/**
 * @fileoverview JavaScript for mBot Ranger blocks in blockly.
 *
 * @license Copyright 2016 Shenzhen Maker Works Co, Ltd. All Rights Reserved.
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
 * @author wangyu@makeblock.cc (Yu Wang)
 * @author mbordihn@google.com (Markus Bordihn)
 */



/**
 * mBot move forward.
 */
Blockly.JavaScript['mbot_ranger_move_forward'] = function(block) {
  var speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));
  return 'mBotRanger.movePower(' + speed + ');\n';
};


/**
 * mBot move forward time.
 */
Blockly.JavaScript['mbot_ranger_move_forward_time'] = function(block) {
  var time = parseInt(Blockly.JavaScript.valueToCode(
    block, 'time', Blockly.JavaScript.ORDER_ATOMIC));
  var speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));

  return 'mBotRanger.movePowerTime(' + (time * 1000) + ', ' + speed +
    ', true);\n';
};


/**
 * mBot move forward steps.
 */
Blockly.JavaScript['mbot_ranger_move_forward_steps'] = function(block) {
  var steps = parseInt(Blockly.JavaScript.valueToCode(
    block, 'steps', Blockly.JavaScript.ORDER_ATOMIC));
  var speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));

  return 'mBotRanger.moveSteps(' + steps + ', ' + speed + ');\n';
};


/**
 * mBot move backwards.
 */
Blockly.JavaScript['mbot_ranger_move_backward'] = function(block) {
  var speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));
  return 'mBotRanger.movePower(' + (-speed) + ');\n';
};


/**
 * mBot move forward time.
 */
Blockly.JavaScript['mbot_ranger_move_backward_time'] = function(block) {
  var time = parseInt(Blockly.JavaScript.valueToCode(
    block, 'time', Blockly.JavaScript.ORDER_ATOMIC));
  var speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));

  return 'mBotRanger.movePowerTime(' + (time * 1000) + ', ' + (-speed) +
    ', true);\n';
};


/**
 * mBot move backward steps.
 */
Blockly.JavaScript['mbot_ranger_move_backward_steps'] = function(block) {
  var steps = parseInt(Blockly.JavaScript.valueToCode(
    block, 'steps', Blockly.JavaScript.ORDER_ATOMIC));
  var speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));

  return 'mBotRanger.moveSteps(' + (-steps) + ', ' + speed + ');\n';
};


/**
 * Rotate left.
 */
Blockly.JavaScript['mbot_ranger_rotate_left'] = function(block) {
  var speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));
  return 'mBotRanger.rotatePower(' + (-speed) + ');\n';
};


/**
 * Rotate left time.
 */
Blockly.JavaScript['mbot_ranger_rotate_left_time'] = function(block) {
  var time = parseInt(Blockly.JavaScript.valueToCode(
    block, 'time', Blockly.JavaScript.ORDER_ATOMIC));
  var speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));

  return 'mBotRanger.rotatePowerTime(' + (time * 1000) + ', ' + (-speed) +
    ', true);\n';
};


/**
 * Rotate right.
 */
Blockly.JavaScript['mbot_ranger_rotate_right'] = function(block) {
  var speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));
  return 'mBotRanger.rotatePower(' + speed + ');\n';
};


/**
 * Rotate right time.
 */
Blockly.JavaScript['mbot_ranger_rotate_right_time'] = function(block) {
  var time = parseInt(Blockly.JavaScript.valueToCode(
    block, 'time', Blockly.JavaScript.ORDER_ATOMIC));
  var speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));

  return 'mBotRanger.rotatePowerTime(' + (time * 1000) + ', ' + speed +
    ', true);\n';
};


/**
 * Stop Moving.
 */
Blockly.JavaScript['mbot_ranger_stop_moving'] = function(opt_block) {
  return 'mBotRanger.stop(true);\n';
};


/**
 * Lightness sensor change.
 */
Blockly.JavaScript['mbot_ranger_lightness_sensor_change'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var lightnessSensorEvent = function(sensor_1, sensor_2) {\n' +
    '  var lightness = sensor_1;\n' + statements_code +
    '};\nmBotRanger.onLightnessSensorChange(lightnessSensorEvent);\n';
};


/**
 * Linefollower sensor change.
 */
Blockly.JavaScript['mbot_ranger_linefollower_sensor_change'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var lineFollowerSensorEvent = function(left, right, raw) {\n' +
      statements_code +
    '};\nmBotRanger.onLineFollowerSensorChange(lineFollowerSensorEvent);\n';
};


/**
 * Temperature sensor change.
 */
Blockly.JavaScript['mbot_ranger_temperature_sensor_change'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var temperatureSensorEvent = function(temperature) {\n' +
      statements_code +
    '};\nmBotRanger.onTemperatureSensorChange(temperatureSensorEvent);\n';
};


/**
 * Ultrasonic sensor change.
 */
Blockly.JavaScript['mbot_ranger_ultrasonic_sensor_change'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var ultrasonicSensorEvent = function(distance) {\n' +
      statements_code +
    '};\nmBotRanger.onUltrasonicSensorChange(ultrasonicSensorEvent);\n';
};


Blockly.JavaScript['mbot_ranger_play_tone'] = function(block) {
  var text_frequency = block.getFieldValue('frequency');
  var text_duration = block.getFieldValue('duration');
  return 'mBotRanger.playTone(' + text_frequency + ', ' + text_duration + ', ' +
       Number(text_duration) + ');\n';
};


Blockly.JavaScript['mbot_ranger_rgb'] = function(block) {
  var index = parseInt(block.getFieldValue('position') || 0);
  var colour = parseInt(Blockly.JavaScript.valueToCode(
    block, 'colour', Blockly.JavaScript.ORDER_ATOMIC)
    .replace('#', '')
    .replace('\'', '')
    .replace('"', ''), 16);
  var red = colour >> 16;
  var green = colour >> 8 & 0xFF;
  var blue = colour & 0xFF;
  return 'mBotRanger.setRGBLED(' + red + ', ' + green + ', ' + blue + ', ' +
    index + ', 100);\n';
};


Blockly.JavaScript['mbot_ranger_ultrasonic_sensor_value'] = function(
    opt_block) {
  var code = 'mBotRanger.getUltrasonicSensorValue()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


Blockly.JavaScript['mbot_ranger_lightness_sensor_value'] = function(opt_block) {
  var code = 'mBotRanger.getLightnessSensorValue()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Wait.
 */
Blockly.JavaScript['mbot_ranger_wait'] = function(block) {
  var time = block.getFieldValue('time');
  return 'mBotRanger.wait(' + time + ');\n';
};
