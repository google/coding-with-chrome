/**
 * @fileoverview JavaScript for the Sphero blocks.
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
 * Sphero roll.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['sphero_roll'] = function(block) {
  let speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));
  let duration = 500 + (speed * 20);
  return 'sphero.roll(' + speed + ', undefined, undefined, ' +
    duration + ');\n';
};


/**
 * Sphero roll step.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['sphero_roll_step'] = function(block) {
  let speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));
  let heading = parseInt(block.getFieldValue('heading'));
  let duration = 500 + (speed * 20);
  return 'sphero.roll(' + speed + ', ' +heading + ', 0x01, ' +
    duration + ');\n';
};


/**
 * Sphero roll time.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['sphero_roll_time'] = function(block) {
  let time = parseInt(Blockly.JavaScript.valueToCode(
    block, 'time', Blockly.JavaScript.ORDER_ATOMIC));
  let speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));
  let heading = parseInt(block.getFieldValue('heading') || 0);
  return 'sphero.rollTime(' + time + ', ' + speed + ', ' + heading +
    ',true);\n';
};


/**
 * Sphero heading.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['sphero_heading'] = function(block) {
  let angle_heading = parseInt(block.getFieldValue('heading'));
  let value_heading = parseInt(Blockly.JavaScript.valueToCode(
    block, 'heading', Blockly.JavaScript.ORDER_ATOMIC));
  let duration = 500;
  return 'sphero.roll(0, ' + (angle_heading || value_heading || 0) +
    ', 0x01, ' + duration + ');\n';
};


/**
 * Sphero RGB.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['sphero_rgb'] = function(block) {
  let colour = parseInt(Blockly.JavaScript.valueToCode(
    block, 'colour', Blockly.JavaScript.ORDER_ATOMIC)
    .replace('#', '')
    .replace('\'', '')
    .replace('"', ''), 16);
  let red = colour >> 16;
  let green = colour >> 8 & 0xFF;
  let blue = colour & 0xFF;
  return 'sphero.setRGB(' + red + ', ' + green + ', ' + blue + ', 1, 100' +
    ');\n';
};


/**
 * Sphero backlight.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['sphero_backlight'] = function(block) {
  let brightness = Math.min(Math.max(
      parseInt(block.getFieldValue('brightness')), 0), 254);
  return 'sphero.setBackLed(' + brightness + ', 100);\n';
};


/**
 * Sphero stop.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['sphero_stop'] = function(block) {
  let dropdown_immediately = block.getFieldValue('immediately');
  if (dropdown_immediately == 'when finished') {
    return 'sphero.stop(100);\n';
  }
  return 'sphero.stop();\n';
};


/**
 * Gyro sensor change.
 * @param {!Blockly.block} block
 * @return {!string}
 */
Blockly.JavaScript['sphero_collision'] = function(block) {
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var collisionEvent = function(data) {\n' +
      statements_code + '};\nsphero.onCollision(collisionEvent);\n';
};
