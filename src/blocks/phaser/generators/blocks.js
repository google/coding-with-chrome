/**
 * @fileoverview Phaser Blocks for Blockly.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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


Blockly.Blocks['phaser_generator_obstacle_vertical'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.point())
        .appendField(i18t('generate vertical obstacles'));
    this.appendValueInput('obstacles')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('number of obstacles');
    this.appendValueInput('spaces')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('number of spaces');
    this.appendValueInput('x')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('x');
    this.appendValueInput('y')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('y');
    this.appendValueInput('sprite')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('sprite');
    this.appendValueInput('sprite_top')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('top sprite');
    this.appendValueInput('sprite_bottom')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('bottom sprite');
    this.appendValueInput('group')
        .setCheck(null)
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('group');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(105);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
