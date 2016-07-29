/**
 * @fileoverview mBot blocks for blockly.
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
goog.provide('cwc.blocks.mbot.Blocks');

goog.require('Blockly');

goog.require('cwc.blocks');
goog.require('cwc.blocks.mbot.JavaScript');


/**
 * @private {string}
 */
cwc.blocks.mbot.Blocks.prefix_ = 'mbot_';


/**
 * Move forward.
 */
cwc.blocks.addBlock('move_forward', function() {
  this.setHelpUrl('');
  this.setColour(120);
  this.appendValueInput("steps").setCheck('Number').appendField('move forward');
  this.appendDummyInput().appendField(i18n.get('steps'))
      .appendField(new Blockly.FieldDropdown([['slowly','100'], ['quickly','180'], ['very quickly','255']]), 'speed');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Move the robot forward for a specified number of steps. ');
}, cwc.blocks.mbot.Blocks.prefix_);


/**
 * Move backward.
 */
cwc.blocks.addBlock('move_backward', function() {
  this.setHelpUrl('');
  this.setColour(120);
  this.appendValueInput("steps").setCheck('Number').appendField('move backward');
  this.appendDummyInput().appendField(i18n.get('steps'))
      .appendField(new Blockly.FieldDropdown([['slowly','100'], ['quickly','180'], ['very quickly','255']]), 'speed');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Move the robot backward for a specified number of steps.');
}, cwc.blocks.mbot.Blocks.prefix_);

/**
 * Rotate left.
 */
cwc.blocks.addBlock('turn_left', function() {
  this.setHelpUrl('');
  this.setColour(120);
  this.appendValueInput("steps").setCheck('Number').appendField('move left');
  this.appendDummyInput().appendField(i18n.get('steps'))
      .appendField(new Blockly.FieldDropdown([['slowly','100'], ['quickly','180'], ['very quickly','255']]), 'speed');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Turn the robot left by specific steps.');
}, cwc.blocks.mbot.Blocks.prefix_);


/**
 * Rotate right.
 */
cwc.blocks.addBlock('turn_right', function() {
  this.setHelpUrl('');
  this.setColour(120);
  this.appendValueInput("steps").setCheck('Number').appendField('turn right');
  this.appendDummyInput().appendField(i18n.get('steps'))
      .appendField(new Blockly.FieldDropdown([['slowly','100'], ['quickly','180'], ['very quickly','255']]), 'speed');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Turn the robot right by specific steps.');
}, cwc.blocks.mbot.Blocks.prefix_);

/**
 * Stop Moving.
 */
cwc.blocks.addBlock('stop_moving', function() {
  this.setHelpUrl('');
  this.setColour(120);
  this.appendDummyInput()
    .appendField(i18n.get('Stop moving'));
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Stop moving.');
}, cwc.blocks.mbot.Blocks.prefix_);


/**
 * Play music note.
 */
cwc.blocks.addBlock('play_tone', function() {
  var map = cwc.config.sound;
  var note_list = [];
  for (var note in map.NOTE) {
    note_list.push([note, map.NOTE[note]['f'].toString()]);
  }
  note_list = note_list.slice(36,85);
  var duration_list = [];
  for (var duration in map.DURATION) {
    duration_list.push([duration,
                        map.DURATION[duration]['d'].toString()]);
  }
  this.setHelpUrl('');
  this.setColour(65);
  this.appendDummyInput()
    .appendField('play music note')
    .appendField(new Blockly.FieldDropdown(note_list), 'frequency')
    .appendField('duration:')
    .appendField(new Blockly.FieldDropdown(duration_list), 'duration')
    .appendField('beats');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Play a music note with duration in beats');
}, cwc.blocks.mbot.Blocks.prefix_);

/**
 * mbot rgb.
 */
cwc.blocks.addBlock('rgb', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
      .appendField(i18n.get('set on board led '))
      .appendField(new Blockly.FieldDropdown([['both','both'], ['left','left'], ['right','right']]), 'position')
      .appendField(i18n.get('to color ('))
      .appendField(new Blockly.FieldColour('#ff0000'), 'colour')
      .appendField(')');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Sets the leds on the Sphero ball.');
}, cwc.blocks.mbot.Blocks.prefix_);

/**
 * mbot test command.
 */
cwc.blocks.addBlock('beep_buzzer', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
      .appendField('Beep Buzzer');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Beep the Buzzer');
}, cwc.blocks.mbot.Blocks.prefix_);

/**
 * Ultrasonic sensor change.
 */
cwc.blocks.addBlock('ultrasonic_sensor_change', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18n.get('on ultrasonic sensor change'));
  this.appendStatementInput('CODE')
    .setAlign(Blockly.ALIGN_CENTRE);
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Stores the output from the sensor in a variable named ' +
      '"value", when the ultrasonic sensor detects a change.');
}, cwc.blocks.mbot.Blocks.prefix_);

/**
 * Lightness sensor change.
 */
cwc.blocks.addBlock('lightness_sensor_change', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18n.get('on lightness sensor change'));
  this.appendStatementInput('CODE')
    .setAlign(Blockly.ALIGN_CENTRE);
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Stores the output from the sensor in a variable named ' +
      '"value", when the lightness sensor detects a change.');
}, cwc.blocks.mbot.Blocks.prefix_);

/**
 * Ultrasonic sensor value.
 */
cwc.blocks.addBlock('ultrasonic_sensor_value', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput().appendField('ultrasonic sensor value');
  this.setOutput(true, 'Number');
  this.setTooltip('Get the current value of the ultrasonic sensor.');
}, cwc.blocks.mbot.Blocks.prefix_);

/**
 * Lightness sensor value.
 */
cwc.blocks.addBlock('lightness_sensor_value', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput().appendField('lightness sensor value');
  this.setOutput(true, 'Number');
  this.setTooltip('Get the current value of the lightness sensor.');
}, cwc.blocks.mbot.Blocks.prefix_);

/**
 * Wait.
 */
cwc.blocks.addBlock('wait', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18n.get('wait ('))
    .appendField(new Blockly.FieldTextInput('2000'), 'time')
    .appendField('msec)');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Wait for the given milliseconds.');
}, cwc.blocks.mbot.Blocks.prefix_);