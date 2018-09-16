/**
 * @fileoverview JavaScript for the Sphero SPRK+ blocks.
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
 * Sphero start Block.
 * @return {string}
 */
Blockly.JavaScript['sphero_sprk_plus_start'] = function() {
  return '// Start Sphero SPRK+\n';
};


/**
 * Sphero roll.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['sphero_sprk_plus_roll'] = function(block) {
  let speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));
  let duration = 500 + (speed * 20);
  return 'sprkPlus.roll(' + speed + ', undefined, undefined, ' +
    duration + ');\n';
};


/**
 * Sphero roll step.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['sphero_sprk_plus_roll_step'] = function(block) {
  let speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));
  let heading = Blockly.JavaScript.valueToCode(
    block, 'heading', Blockly.JavaScript.ORDER_ATOMIC);
  let duration = 500 + (speed * 20);
  return 'sprkPlus.roll(' + speed + ', ' + heading + ', 0x01, ' +
    duration + ');\n';
};


/**
 * Sphero roll time.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['sphero_sprk_plus_roll_time'] = function(block) {
  let time = parseInt(Blockly.JavaScript.valueToCode(
    block, 'time', Blockly.JavaScript.ORDER_ATOMIC));
  let speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));
  let heading = Blockly.JavaScript.valueToCode(
    block, 'heading', Blockly.JavaScript.ORDER_ATOMIC);
  return 'sprkPlus.rollTime(' + time + ', ' + speed + ', ' + heading +
    ', true);\n';
};


/**
 * Sphero rotate time.
 * @return {string}
 */
Blockly.JavaScript['sphero_sprk_plus_rotate_time'] = function() {
  return '//tbd';
};


/**
 * Sphero move raw.
 * @return {string}
 */
Blockly.JavaScript['sphero_sprk_plus_move_raw'] = function() {
  return '//tbd';
};


/**
 * Enable / disable stabilization.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['sphero_sprk_plus_stabilization'] = function(block) {
  let enable = block.getFieldValue('enable') === 'enable' ? true : false;
  return 'sprkPlus.setStabilization(' + enable + ');\n';
};


/**
 * Sphero heading.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['sphero_sprk_plus_heading'] = function(block) {
  let duration = 500;
  let heading = Blockly.JavaScript.valueToCode(
    block, 'heading', Blockly.JavaScript.ORDER_ATOMIC);
  return 'sprkPlus.roll(0, ' + heading + ', 0x01, ' + duration + ');\n';
};


/**
 * Sphero speed.
 * @return {string}
 */
Blockly.JavaScript['sphero_sprk_plus_speed'] = function() {
  return '//tbd';
};


/**
 * Sphero RGB.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['sphero_sprk_plus_rgb'] = function(block) {
  let colour = parseInt(Blockly.JavaScript.valueToCode(
    block, 'colour', Blockly.JavaScript.ORDER_ATOMIC)
    .replace('#', '')
    .replace('\'', '')
    .replace('"', ''), 16);
  let red = colour >> 16;
  let green = colour >> 8 & 0xFF;
  let blue = colour & 0xFF;
  return 'sprkPlus.setRGB(' + red + ', ' + green + ', ' + blue + ', 1, 100);\n';
};


/**
 * Sphero RGB blink.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['sphero_sprk_plus_blink'] = function(block) {
  let colour = parseInt(Blockly.JavaScript.valueToCode(
    block, 'colour', Blockly.JavaScript.ORDER_ATOMIC)
    .replace('#', '')
    .replace('\'', '')
    .replace('"', ''), 16);
  let red = colour >> 16;
  let green = colour >> 8 & 0xFF;
  let blue = colour & 0xFF;
  return 'sprkPlus.setRGB(' + red + ', ' + green + ', ' + blue +
    ', 1, 100);\n' + 'sprkPlus.setRGB(0, 0, 0, 1, 100);\n';
};


/**
 * Sphero backlight.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['sphero_sprk_plus_backlight'] = function(block) {
  let brightness = Math.min(Math.max(
      parseInt(block.getFieldValue('brightness')), 0), 254);
  return 'sprkPlus.setBackLed(' + brightness + ', 100);\n';
};


/**
 * Sphero stop.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['sphero_sprk_plus_stop'] = function(block) {
  let dropdown_immediately = block.getFieldValue('immediately');
  if (dropdown_immediately == 'when finished') {
    return 'sprkPlus.stop(100);\n';
  }
  return 'sprkPlus.stop();\n';
};


/**
 * Reset device position.
 * @return {string}
 */
Blockly.JavaScript['sphero_sprk_plus_reset'] = function() {
  return 'sprkPlus.reset();\n';
};


/**
 * Collision change.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['sphero_sprk_plus_collision'] = function(block) {
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var collisionEvent = function() {\n' +
      statements_code + '};\nsprkPlus.onCollision(collisionEvent);\n';
};


/**
 * Position change.
 * @param {!Blockly.block} block
 * @return {string}
 */
Blockly.JavaScript['sphero_sprk_plus_position_change'] = function(block) {
  let statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var positionEvent = function(position_x, position_y) {\n' +
      statements_code + '};\nsprkPlus.onPositionChange(positionEvent);\n';
};
