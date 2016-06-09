/**
 * @fileoverview Sphero blocks for Blockly.
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.provide('cwc.blocks.sphero.Blocks');

goog.require('Blockly');

goog.require('cwc.blocks');
goog.require('cwc.blocks.sphero.JavaScript');


/**
 * @private {string}
 */
cwc.blocks.sphero.Blocks.prefix_ = 'sphero_';


/**
 * Sphero roll.
 */
cwc.blocks.addBlock('roll', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendValueInput('speed').setCheck('Number').appendField('roll speed(');
  this.appendDummyInput().appendField(')');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Move the Sphero in a direction');
}, cwc.blocks.sphero.Blocks.prefix_);


/**
 * Sphero roll step.
 */
cwc.blocks.addBlock('roll_step', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendValueInput('speed').setCheck('Number').appendField('roll with');
  this.appendDummyInput('heading')
    .appendField('speed and')
    .appendField(new Blockly.FieldAngle(0), 'heading')
    .appendField('heading');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Move the Sphero in a direction');
}, cwc.blocks.sphero.Blocks.prefix_);


/**
 * Sphero roll time.
 */
cwc.blocks.addBlock('roll_time', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendValueInput('time').setCheck('Number').appendField('roll for');
  this.appendValueInput('speed').setCheck('Number').appendField('sec with');
  this.appendDummyInput('heading')
    .appendField('speed and')
    .appendField(new Blockly.FieldAngle(0), 'heading')
    .appendField('heading');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Move the Sphero in a direction for the given seconds');
}, cwc.blocks.sphero.Blocks.prefix_);


/**
 * Sphero heading.
 */
cwc.blocks.addBlock('heading', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendValueInput('heading')
    .setCheck('Number')
    .appendField('set heading(')
    .appendField(new Blockly.FieldAngle(0), 'heading')
    .appendField(')');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Move the Sphero in a direction');
}, cwc.blocks.sphero.Blocks.prefix_);


/**
 * Sphero rgb.
 */
cwc.blocks.addBlock('rgb', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
      .appendField(i18t('set color('))
      .appendField(new Blockly.FieldColour('#ff0000'), 'colour')
      .appendField(')');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Sets the leds on the Sphero ball.');
}, cwc.blocks.sphero.Blocks.prefix_);


/**
 * Sphero backlight.
 */
cwc.blocks.addBlock('backlight', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
      .appendField(i18t('set backlight ('))
      .appendField(new Blockly.FieldTextInput('254'), 'brightness')
      .appendField(i18t('(0 - 254)'))
      .appendField(')');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Sets the back-light on the Sphero ball.');
}, cwc.blocks.sphero.Blocks.prefix_);


/**
 * Sphero stop.
 */
cwc.blocks.addBlock('stop', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
      .appendField(i18t('stop motors('))
      .appendField(new Blockly.FieldDropdown(
          [[i18t('when finished'), 'when finished'],
           [i18t('immediately'), 'immediately']]), 'immediately')
      .appendField(')');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Stop all motors immediately or after the last command ' +
        'has finished.');
}, cwc.blocks.sphero.Blocks.prefix_);


/**
 * Collision detected.
 */
cwc.blocks.addBlock('collision', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendDummyInput()
    .appendField(i18t('on collision'));
  this.appendStatementInput('CODE')
    .setAlign(Blockly.ALIGN_CENTRE);
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Detect collision.');
}, cwc.blocks.sphero.Blocks.prefix_);
