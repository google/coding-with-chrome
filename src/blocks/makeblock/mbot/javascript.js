/**
 * @fileoverview JavaScript for mBot blocks in blockly.
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
 * @return {string}
 */
Blockly.JavaScript['mbot_move_forward'] = function(block) {
  let speed = Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC);
  return 'mBot.movePower(' + speed + ');\n';
};


/**
 * mBot move forward time.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['mbot_move_forward_time'] = function(block) {
  let time = parseInt(Blockly.JavaScript.valueToCode(
    block, 'time', Blockly.JavaScript.ORDER_ATOMIC));
  let speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));

  return 'mBot.movePowerTime(' + (time * 1000) + ', ' + speed + ', true);\n';
};


/**
 * mBot move backwards.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['mbot_move_backward'] = function(block) {
  let speed = Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC);
  return 'mBot.movePower(' + (-speed) + ');\n';
};


/**
 * mBot move forward time.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['mbot_move_backward_time'] = function(block) {
  let time = parseInt(Blockly.JavaScript.valueToCode(
    block, 'time', Blockly.JavaScript.ORDER_ATOMIC));
  let speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));

  return 'mBot.movePowerTime(' + (time * 1000) + ', ' + (-speed) + ', true);\n';
};


/**
 * Rotate left.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['mbot_rotate_left'] = function(block) {
  let speed = Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC);
  return 'mBot.rotatePower(' + speed + ');\n';
};


/**
 * Rotate left time.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['mbot_rotate_left_time'] = function(block) {
  let time = parseInt(Blockly.JavaScript.valueToCode(
    block, 'time', Blockly.JavaScript.ORDER_ATOMIC));
  let speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));

  return 'mBot.rotatePowerTime(' + (time * 1000) + ', ' + speed + ', true);\n';
};


/**
 * Rotate right.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['mbot_rotate_right'] = function(block) {
  let speed = Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC);
  return 'mBot.rotatePower(' + (-speed) + ');\n';
};


/**
 * Rotate right time.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['mbot_rotate_right_time'] = function(block) {
  let time = parseInt(Blockly.JavaScript.valueToCode(
    block, 'time', Blockly.JavaScript.ORDER_ATOMIC));
  let speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));

  return 'mBot.rotatePowerTime(' + (time * 1000) + ', ' + (-speed) +
    ', true);\n';
};


/**
 * Stop Moving.
 * @return {string}
 */
Blockly.JavaScript['mbot_stop_moving'] = function() {
  return 'mBot.stop(true);\n';
};


/**
 * Button change.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['mbot_button_change'] = function(block) {
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var buttonEvent = function(pressed) {\n' +
      statements_code +
    '};\nmBot.onButtonChange(buttonEvent);\n';
};


/**
 * Lightness sensor change.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['mbot_lightness_sensor_change'] = function(block) {
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var lightnessSensorEvent = function(lightness) {\n' +
      statements_code +
    '};\nmBot.onLightnessSensorChange(lightnessSensorEvent);\n';
};


/**
 * Linefollower sensor change.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['mbot_linefollower_sensor_change'] = function(block) {
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var linefollowerSensorEvent = function(left, right, raw) {\n' +
      statements_code +
    '};\nmBot.onLinefollowerSensorChange(linefollowerSensorEvent);\n';
};


/**
 * Ultrasonic sensor change.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['mbot_ultrasonic_sensor_change'] = function(block) {
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var ultrasonicSensorEvent = function(distance) {\n' +
      statements_code +
    '};\nmBot.onUltrasonicSensorChange(ultrasonicSensorEvent);\n';
};


Blockly.JavaScript['mbot_play_tone'] = function(block) {
  let text_frequency = block.getFieldValue('frequency');
  let text_duration = block.getFieldValue('duration');
  return 'mBot.playTone(' + text_frequency + ', ' + text_duration + ', ' +
       Number(text_duration) + ');\n';
};


/**
 * Beep.
 * @return {string}
 */
Blockly.JavaScript['mbot_beep_buzzer'] = function() {
  return 'mBot.playTone(524, 240, 240);';
};


/**
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['mbot_rgb'] = function(block) {
  let position = parseInt(block.getFieldValue('position') || 0);
  let colour = parseInt(Blockly.JavaScript.valueToCode(
    block, 'colour', Blockly.JavaScript.ORDER_ATOMIC)
    .replace('#', '')
    .replace('\'', '')
    .replace('"', ''), 16);
  let red = colour >> 16;
  let green = colour >> 8 & 0xFF;
  let blue = colour & 0xFF;
  return 'mBot.setRGBLED(' + red + ', ' + green + ', ' + blue + ', ' +
    position + ', 50);\n';
};


/**
 * @return {!array}
 */
Blockly.JavaScript['mbot_ultrasonic_sensor_value'] = function() {
  let code = 'mBot.getUltrasonicSensorValue()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * @return {!array}
 */
Blockly.JavaScript['mbot_lightness_sensor_value'] = function() {
  let code = 'mBot.getLightnessSensorValue()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Wait.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['mbot_wait'] = function(block) {
  let time = block.getFieldValue('time');
  return 'mBot.wait(' + time + ');\n';
};
