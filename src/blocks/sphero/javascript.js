/**
 * @fileoverview JavaScript for the Sphero blocks.
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
goog.provide('cwc.blocks.sphero.JavaScript');

goog.require('cwc.blocks');
goog.require('Blockly.JavaScript');


/**
 * @private {string}
 */
cwc.blocks.sphero.JavaScript.prefix_ = 'sphero_';


/**
 * Sphero roll.
 */
cwc.blocks.addJavaScript('roll', function(block) {
  var value_speed = cwc.blocks.valueToInt(block, 'speed');
  var duration = 500 + (value_speed * 20);
  return 'sphero.roll(' + value_speed + ', undefined, undefined, ' +
    duration + ');\n';
}, cwc.blocks.sphero.JavaScript.prefix_);


/**
 * Sphero roll step.
 */
cwc.blocks.addJavaScript('roll_step', function(block) {
  var value_speed = cwc.blocks.valueToInt(block, 'speed');
  var value_heading = cwc.blocks.getFieldValueInt(block, 'heading');
  var duration = 500 + (value_speed * 20);
  return 'sphero.roll(' + value_speed + ', ' + value_heading + ', 0x01, ' +
    duration + ');\n';
}, cwc.blocks.sphero.JavaScript.prefix_);


/**
 * Sphero roll time.
 */
cwc.blocks.addJavaScript('roll_time', function(block) {
  var value_time = cwc.blocks.valueToInt(block, 'time');
  var value_speed = cwc.blocks.valueToInt(block, 'speed');
  var value_heading = cwc.blocks.getFieldValueInt(block, 'heading');
  return 'sphero.rollTime(' + value_time + ', ' + value_speed + ', ' +
    value_heading + ', true);\n';
}, cwc.blocks.sphero.JavaScript.prefix_);


/**
 * Sphero heading.
 */
cwc.blocks.addJavaScript('heading', function(block) {
  var angle_heading = cwc.blocks.getFieldValueInt(block, 'heading');
  var value_heading = cwc.blocks.valueToInt(block, 'heading');
  var duration = 500;
  return 'sphero.roll(0, ' + (angle_heading || value_heading || 0) +
    ', 0x01, ' + duration + ');\n';
}, cwc.blocks.sphero.JavaScript.prefix_);


/**
 * Sphero RGB.
 */
cwc.blocks.addJavaScript('rgb', function(block) {
  var colour_colour = cwc.blocks.getFieldValueColor(block, 'colour');
  var red = colour_colour >> 16;
  var green = colour_colour >> 8 & 0xFF;
  var blue = colour_colour & 0xFF;
  return 'sphero.setRGB(' + red + ', ' + green+ ', ' + blue + ', 1, 100' +
    ');\n';
}, cwc.blocks.sphero.JavaScript.prefix_);


/**
 * Sphero backlight.
 */
cwc.blocks.addJavaScript('backlight', function(block) {
  var text_brightness = cwc.blocks.getFieldValueMinMax(
    block, 'brightness', 0, 254);
  return 'sphero.setBackLed(' + text_brightness + ', 100);\n';
}, cwc.blocks.sphero.JavaScript.prefix_);


/**
 * Sphero stop.
 */
cwc.blocks.addJavaScript('stop', function(block) {
  var dropdown_immediately = cwc.blocks.getFieldValue(block, 'immediately');
  if (dropdown_immediately == 'when finished') {
    return 'sphero.stop(100);\n';
  }
  return 'sphero.stop();\n';
}, cwc.blocks.sphero.JavaScript.prefix_);


/**
 * Gyro sensor change.
 */
cwc.blocks.addJavaScript('collision', function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'CODE');
  return 'var collisionEvent = function(data) {\n' +
      statements_code + '};\nsphero.onCollision(collisionEvent);\n';
}, cwc.blocks.sphero.JavaScript.prefix_);
