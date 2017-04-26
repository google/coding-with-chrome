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
        .appendField(Blockly.BlocksTemplate.runningMan())
        .appendField(i18t('Create Game with name'))
        .appendField(new Blockly.FieldTextInput(i18t('Unnamed Game')), 'name')
        .appendField(i18t('and size'))
        .appendField(new Blockly.FieldNumber(400, 0, 5760), 'width')
        .appendField('x')
        .appendField(new Blockly.FieldNumber(600, 0, 2160), 'height');
    this.setNextStatement(true, null);
    this.setColour(75);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};


/**
 * Phaser Game state.
 */
Blockly.Blocks['phaser_game_state'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.storage())
        .appendField(i18t('game state'))
        .appendField(new Blockly.FieldTextInput('main'), 'name')
        .appendField(new Blockly.FieldDropdown([
            [i18t('no autostart'), 'false'],
            [i18t('autostart'), 'true']
        ]), 'autostart');
    this.appendStatementInput('state')
        .setCheck(['Preload', 'Create', 'Update', 'Render']);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(75);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Phaser Game state start.
 */
Blockly.Blocks['phaser_game_start'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.point())
        .appendField(i18t('start game state'))
        .appendField(new Blockly.FieldTextInput('main'), 'name');
    this.setPreviousStatement(true, ['Create', 'Update', 'Input']);
    this.setNextStatement(true, ['Create', 'Update', 'Input']);
    this.setColour(75);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Restart Phaser Game.
 */
Blockly.Blocks['phaser_game_restart'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.point())
        .appendField(i18t('Restart game'));
    this.setPreviousStatement(true, ['Create', 'Update', 'Input']);
    this.setNextStatement(true, ['Create', 'Update', 'Input']);
    this.setColour(75);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
