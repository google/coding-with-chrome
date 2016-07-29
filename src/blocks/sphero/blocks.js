/**
 * @fileoverview Sphero blocks for Blockly.
 *
 * @license Copyright 2015 The Coding with Chrome Authors.
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



/**
 * Sphero roll.
 */
Blockly.Blocks['sphero_roll'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendValueInput('speed')
      .setCheck('Number')
      .appendField('roll speed(');
    this.appendDummyInput().appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Move the Sphero in a direction');
  }
};


/**
 * Sphero roll step.
 */
Blockly.Blocks['sphero_roll_step'] = {
  init: function() {
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
  }
};


/**
 * Sphero roll time.
 */
Blockly.Blocks['sphero_roll_time'] = {
  init: function() {
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
  }
};


/**
 * Sphero heading.
 */
Blockly.Blocks['sphero_heading'] = {
  init: function() {
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
  }
};


/**
 * Sphero rgb.
 */
Blockly.Blocks['sphero_rgb'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendValueInput('colour')
      .appendField(i18t('set color ('));
    this.appendDummyInput().appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Sets the leds on the Sphero ball.');
  }
};


/**
 * Sphero backlight.
 */
Blockly.Blocks['sphero_backlight'] = {
  init: function() {
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
  }
};


/**
 * Sphero stop.
 */
Blockly.Blocks['sphero_stop'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(i18t('stop motors('))
      .appendField(new Blockly.FieldDropdown([
        [i18t('when finished'), 'when finished'],
        [i18t('immediately'), 'immediately']
      ]), 'immediately')
      .appendField(')');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Stop all motors immediately or after the last command ' +
          'has finished.');
  }
};


/**
 * Collision detected.
 */
Blockly.Blocks['sphero_collision'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(i18t('on collision'));
    this.appendStatementInput('CODE')
      .setAlign(Blockly.ALIGN_CENTRE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Detect collision.');
  }
};
