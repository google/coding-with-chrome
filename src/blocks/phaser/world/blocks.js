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


/**
 * World wrap.
 */
Blockly.Blocks['phaser_world_wrap'] = {
  init: function() {
    this.appendValueInput('sprite')
        .setCheck(null)
        .appendField(Blockly.BlocksTemplate.point())
        .appendField(i18t('World wrap sprite'));
    this.appendValueInput('value')
        .setCheck('Number')
        .appendField(i18t('padding'));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * World attributes.
 */
Blockly.Blocks['phaser_world_attributes'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('get world')
        .appendField(new Blockly.FieldDropdown([
          ['center x', 'centerX'],
          ['center y', 'centerY'],
          ['width', 'width'],
          ['height', 'height'],
        ]), 'attribute');
    this.setOutput(true, null);
    this.setColour(345);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
