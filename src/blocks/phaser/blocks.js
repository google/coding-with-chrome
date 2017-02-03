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
 * Phaser Game block.
 */
Blockly.Blocks['phaser_game'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Game Name:')
        .appendField(new Blockly.FieldTextInput('Unnamed Game'), 'name');
    this.appendDummyInput()
        .appendField('Size:')
        .appendField(new Blockly.FieldTextInput('800'), 'width')
        .appendField('x')
        .appendField(new Blockly.FieldTextInput('600'), 'height');
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};


/**
 * Phaser preload section.
 */
Blockly.Blocks['phaser_preload'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(260);
    this.appendDummyInput()
      .appendField(i18t('Preload'));
    this.appendStatementInput('CODE')
      .setAlign(Blockly.ALIGN_CENTRE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  }
};


/**
 * Load Image
 */
Blockly.Blocks['phaser_load_image'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Load Image')
        .appendField(new Blockly.FieldTextInput('name'), 'name')
        .appendField(new Blockly.FieldTextInput('image'), 'image');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
