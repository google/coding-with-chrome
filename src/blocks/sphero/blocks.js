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

goog.require('cwc.blocks.sphero.JavaScript');

goog.require('Blockly');
goog.require('Blockly.Blocks');



Blockly.Blocks['sphero_roll'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendValueInput('speed')
      .setCheck('Number')
      .appendField('roll Sphero with');
    this.appendDummyInput('heading')
      .appendField('speed and')
      .appendField(new Blockly.FieldAngle(0), 'heading')
      .appendField('heading');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Move the sphero in a direction');
  }
};


Blockly.Blocks['sphero_rgb'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField(i18n.get('set Sphero color'))
        .appendField(new Blockly.FieldColour('#ff0000'), 'colour');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Sets the leds on the Sphero ball.');
  }
};


Blockly.Blocks['sphero_backlight'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField(i18n.get('set Sphero backlight brightness'))
        .appendField(new Blockly.FieldTextInput('254'), 'brightness')
        .appendField(i18n.get('(0 - 254)'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Sets the leds on the Sphero ball.');
  }
};


Blockly.Blocks['sphero_stop'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField(i18n.get('stop motors('))
        .appendField(new Blockly.FieldDropdown(
            [[i18n.get('when finished'), 'when finished'],
             [i18n.get('immediately'), 'immediately']]), 'immediately')
        .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Stop all motors immediately or after the last command ' +
          'has finished.');
  }
};
