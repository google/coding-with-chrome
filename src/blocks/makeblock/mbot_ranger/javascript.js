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
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['mbot_ranger_move_forward'] = function(block) {
  let speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));
  return 'mBotRanger.movePower(' + speed + ');\n';
};


/**
 * mBot move forward time.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['mbot_ranger_move_forward_time'] = function(block) {
  let time = parseInt(Blockly.JavaScript.valueToCode(
    block, 'time', Blockly.JavaScript.ORDER_ATOMIC));
  let speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));

  return 'mBotRanger.movePowerTime(' + (time * 1000) + ', ' + speed +
    ', true);\n';
};


/**
 * mBot move forward steps.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['mbot_ranger_move_forward_steps'] = function(block) {
  let steps = parseInt(Blockly.JavaScript.valueToCode(
    block, 'steps', Blockly.JavaScript.ORDER_ATOMIC));
  let speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));

  return 'mBotRanger.moveSteps(' + steps + ', ' + speed + ');\n';
};


/**
 * mBot move backwards.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['mbot_ranger_move_backward'] = function(block) {
  let speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));
  return 'mBotRanger.movePower(' + (-speed) + ');\n';
};


/**
 * mBot move forward time.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['mbot_ranger_move_backward_time'] = function(block) {
  let time = parseInt(Blockly.JavaScript.valueToCode(
    block, 'time', Blockly.JavaScript.ORDER_ATOMIC));
  let speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));

  return 'mBotRanger.movePowerTime(' + (time * 1000) + ', ' + (-speed) +
    ', true);\n';
};


/**
 * mBot move backward steps.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['mbot_ranger_move_backward_steps'] = function(block) {
  let steps = parseInt(Blockly.JavaScript.valueToCode(
    block, 'steps', Blockly.JavaScript.ORDER_ATOMIC));
  let speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));

  return 'mBotRanger.moveSteps(' + (-steps) + ', ' + speed + ');\n';
};


/**
 * Rotate left.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['mbot_ranger_rotate_left'] = function(block) {
  let speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));
  return 'mBotRanger.rotatePower(' + (-speed) + ');\n';
};


/**
 * Rotate left time.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['mbot_ranger_rotate_left_time'] = function(block) {
  let time = parseInt(Blockly.JavaScript.valueToCode(
    block, 'time', Blockly.JavaScript.ORDER_ATOMIC));
  let speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));

  return 'mBotRanger.rotatePowerTime(' + (time * 1000) + ', ' + (-speed) +
    ', true);\n';
};


/**
 * Rotate right.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['mbot_ranger_rotate_right'] = function(block) {
  let speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));
  return 'mBotRanger.rotatePower(' + speed + ');\n';
};


/**
 * Rotate right time.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['mbot_ranger_rotate_right_time'] = function(block) {
  let time = parseInt(Blockly.JavaScript.valueToCode(
    block, 'time', Blockly.JavaScript.ORDER_ATOMIC));
  let speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));

  return 'mBotRanger.rotatePowerTime(' + (time * 1000) + ', ' + speed +
    ', true);\n';
};


/**
 * Stop Moving.
 * @return {!string}
 */
Blockly.JavaScript['mbot_ranger_stop_moving'] = function() {
  return 'mBotRanger.stop(true);\n';
};


/**
 * Lightness sensor change.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['mbot_ranger_lightness_sensor_change'] = function(block) {
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var lightnessSensorEvent = function(sensor_1, sensor_2) {\n' +
    '  let lightness = sensor_1;\n' + statements_code +
    '};\nmBotRanger.onLightnessSensorChange(lightnessSensorEvent);\n';
};


/**
 * Linefollower sensor change.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['mbot_ranger_linefollower_sensor_change'] = function(block) {
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var lineFollowerSensorEvent = function(left, right, raw) {\n' +
      statements_code +
    '};\nmBotRanger.onLineFollowerSensorChange(lineFollowerSensorEvent);\n';
};


/**
 * Temperature sensor change.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['mbot_ranger_temperature_sensor_change'] = function(block) {
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var temperatureSensorEvent = function(temperature) {\n' +
      statements_code +
    '};\nmBotRanger.onTemperatureSensorChange(temperatureSensorEvent);\n';
};


/**
 * Ultrasonic sensor change.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['mbot_ranger_ultrasonic_sensor_change'] = function(block) {
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var ultrasonicSensorEvent = function(distance) {\n' +
      statements_code +
    '};\nmBotRanger.onUltrasonicSensorChange(ultrasonicSensorEvent);\n';
};


/**
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['mbot_ranger_play_tone'] = function(block) {
  let text_frequency = block.getFieldValue('frequency');
  let text_duration = block.getFieldValue('duration');
  return 'mBotRanger.playTone(' + text_frequency + ', ' + text_duration + ', ' +
       Number(text_duration) + ');\n';
};


/**
 * @param {Blockly.Block} block
 * @return {!string}
 */
Blockly.JavaScript['mbot_ranger_rgb'] = function(block) {
  let index = parseInt(block.getFieldValue('position') || 0);
  let colour = parseInt(Blockly.JavaScript.valueToCode(
    block, 'colour', Blockly.JavaScript.ORDER_ATOMIC)
    .replace('#', '')
    .replace('\'', '')
    .replace('"', ''), 16);
  let red = colour >> 16;
  let green = colour >> 8 & 0xFF;
  let blue = colour & 0xFF;
  return 'mBotRanger.setRGBLED(' + red + ', ' + green + ', ' + blue + ', ' +
    index + ', 100);\n';
};


/**
 * @return {!string}
 */
Blockly.JavaScript['mbot_ranger_ultrasonic_sensor_value'] = function() {
  let code = 'mBotRanger.getUltrasonicSensorValue()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * @return {string}
 */
Blockly.JavaScript['mbot_ranger_lightness_sensor_value'] = function() {
  let code = 'mBotRanger.getLightnessSensorValue()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Wait.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['mbot_ranger_wait'] = function(block) {
  let time = block.getFieldValue('time');
  return 'mBotRanger.wait(' + time + ');\n';
};
