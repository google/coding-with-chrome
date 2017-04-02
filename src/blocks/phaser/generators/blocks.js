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
        .appendField('Position:')
        .appendField('x')
        .appendField(new Blockly.FieldNumber(0, 0), 'x')
        .appendField('y')
        .appendField(new Blockly.FieldNumber(0, 0), 'y');
    this.appendDummyInput()
        .appendField('number of obstacle')
        .appendField(new Blockly.FieldNumber(8, 0), 'num_obstacle')
        .appendField('with space')
        .appendField(new Blockly.FieldNumber(2, 0), 'num_space');
    this.appendValueInput('sprite')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('Sprite');
    this.appendValueInput('sprite_top')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('Optional:')
        .appendField('Top sprite');
    this.appendValueInput('sprite_bottom')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('Optional:')
        .appendField('Bottom sprite');
    this.appendValueInput('group')
        .setCheck(null)
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('group');
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('Optional:')
        .appendField('velocity')
        .appendField(new Blockly.FieldNumber(-200), 'velocity');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
