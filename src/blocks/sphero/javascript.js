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
 */
Blockly.JavaScript['sphero_roll'] = function(block) {
  var speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));
  var duration = 500 + (speed * 20);
  return 'sphero.roll(' + speed + ', undefined, undefined, ' +
    duration + ');\n';
};


/**
 * Sphero roll step.
 */
Blockly.JavaScript['sphero_roll_step'] = function(block) {
  var speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));
  var heading = parseInt(block.getFieldValue('heading'));
  var duration = 500 + (speed * 20);
  return 'sphero.roll(' + speed + ', ' +heading + ', 0x01, ' +
    duration + ');\n';
};


/**
 * Sphero roll time.
 */
Blockly.JavaScript['sphero_roll_time'] = function(block) {
  var time = parseInt(Blockly.JavaScript.valueToCode(
    block, 'time', Blockly.JavaScript.ORDER_ATOMIC));
  var speed = parseInt(Blockly.JavaScript.valueToCode(
    block, 'speed', Blockly.JavaScript.ORDER_ATOMIC));
  var heading = parseInt(block.getFieldValue('heading') || 0);
  return 'sphero.rollTime(' + time + ', ' + speed + ', ' + heading +
    ',true);\n';
};


/**
 * Sphero heading.
 */
Blockly.JavaScript['sphero_heading'] = function(block) {
  var angle_heading = parseInt(block.getFieldValue('heading'));
  var value_heading = parseInt(Blockly.JavaScript.valueToCode(
    block, 'heading', Blockly.JavaScript.ORDER_ATOMIC));
  var duration = 500;
  return 'sphero.roll(0, ' + (angle_heading || value_heading || 0) +
    ', 0x01, ' + duration + ');\n';
};


/**
 * Sphero RGB.
 */
Blockly.JavaScript['sphero_rgb'] = function(block) {
  var colour = parseInt(Blockly.JavaScript.valueToCode(
    block, 'colour', Blockly.JavaScript.ORDER_ATOMIC)
    .replace('#', '')
    .replace('\'', '')
    .replace('"', ''), 16);
  var red = colour >> 16;
  var green = colour >> 8 & 0xFF;
  var blue = colour & 0xFF;
  return 'sphero.setRGB(' + red + ', ' + green + ', ' + blue + ', 1, 100' +
    ');\n';
};


/**
 * Sphero backlight.
 */
Blockly.JavaScript['sphero_backlight'] = function(block) {
  var brightness = Math.min(Math.max(
      parseInt(block.getFieldValue('brightness')), 0), 254);
  return 'sphero.setBackLed(' + brightness + ', 100);\n';
};


/**
 * Sphero stop.
 */
Blockly.JavaScript['sphero_stop'] = function(block) {
  var dropdown_immediately = block.getFieldValue('immediately');
  if (dropdown_immediately == 'when finished') {
    return 'sphero.stop(100);\n';
  }
  return 'sphero.stop();\n';
};


/**
 * Gyro sensor change.
 */
Blockly.JavaScript['sphero_collision'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var collisionEvent = function(data) {\n' +
      statements_code + '};\nsphero.onCollision(collisionEvent);\n';
};
