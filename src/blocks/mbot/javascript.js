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
 */



/**
 * mbot move.
 */
Blockly.JavaScript['mbot_move_forward'] = function(block) {
  var steps = Number(block.getFieldValue('steps') || 0);
  var speed = block.getFieldValue('speed');
  return 'mbot.moveSteps(' + speed + ',' + steps + ');\n';
};


Blockly.JavaScript['mbot_move_backward'] = function(block) {
  var steps = Number(block.getFieldValue('steps') || 0);
  var speed = -block.getFieldValue('speed');
  return 'mbot.moveSteps(' + speed + ',' + steps + ');\n';
};


Blockly.JavaScript['mbot_turn_left'] = function(block) {
  var steps = Number(block.getFieldValue('steps') || 0);
  var speed = block.getFieldValue('speed');
  return 'mbot.turn(' + speed + ',' + steps + ');\n';
};


Blockly.JavaScript['mbot_turn_right'] = function(block) {
  var steps = Number(block.getFieldValue('steps') || 0);
  var speed = -block.getFieldValue('speed');
  return 'mbot.turn(' + speed + ',' + steps + ');\n';
};


Blockly.JavaScript['mbot_beep_buzzer'] = function(opt_block) {
  return 'mbot.beepBuzzer();\n';
};


Blockly.JavaScript['mbot_stop_moving'] = function(opt_block) {
  return 'mbot.stop(true);\n';
};


/**
 * Ultrasonic sensor change.
 */
Blockly.JavaScript['mbot_ultrasonic_sensor_change'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var ultrasonicSensorEvent = function(distance) {\n' +
      statements_code +
    '};\nmbot.onUltrasonicSensorChange(ultrasonicSensorEvent);\n';
};


/**
 * Lightness sensor change.
 */
Blockly.JavaScript['mbot_lightness_sensor_change'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var lightnessSensorEvent = function(lightness) {\n' +
      statements_code +
    '};\nmbot.onLightnessSensorChange(lightnessSensorEvent);\n';
};


Blockly.JavaScript['mbot_play_tone'] = function(block) {
  var text_frequency = block.getFieldValue('frequency');
  var text_duration = block.getFieldValue('duration');
  return 'mbot.playNote(' + text_frequency + ', ' + text_duration + ', ' +
       (Number(text_duration)) + ',1);\n';
};


Blockly.JavaScript['mbot_rgb'] = function(block) {
  var position = block.getFieldValue('position');
  var color = block.getFieldValue('colour');
  return 'mbot.setLEDColor("' + position +'", "' + color + '",1);\n';
};


Blockly.JavaScript['mbot_ultrasonic_sensor_value'] = function(opt_block) {
  var code = 'mbot.getUltrasonicSensorValue()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


Blockly.JavaScript['mbot_lightness_sensor_value'] = function(opt_block) {
  var code = 'mbot.getLightnessSensorValue()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


/**
 * Wait.
 */
Blockly.JavaScript['mbot_wait'] = function(block) {
  var time = block.getFieldValue('time');
  return 'mbot.wait(' + time + ');\n';
};
