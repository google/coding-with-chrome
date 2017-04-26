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
 * Add tile sprite.
 */
Blockly.Blocks['phaser_tile_sprite_add'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.addCircle())
        .appendField(i18t('define'));
    this.appendDummyInput()
        .appendField(i18t('as tile sprite'))
        .appendField(new Blockly.FieldTextInput('blocks'), 'sprite')
        .appendField(i18t('position'));
    this.appendValueInput('x')
        .setCheck('Number');
    this.appendValueInput('y')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField(i18t('with size'))
        .appendField(new Blockly.FieldNumber(400), 'width')
        .appendField(new Blockly.FieldNumber(50), 'height')
        .appendField(i18t('and group'))
        .appendField(new Blockly.FieldTextInput(''), 'group');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(290);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};



/**
 * Adjust tile sprite.
 */
Blockly.Blocks['phaser_tile_sprite_adjust'] = {
  init: function() {
    this.appendValueInput('variable')
        .setCheck(null)
        .appendField(Blockly.BlocksTemplate.adjust())
        .appendField(i18t('set title sprite'));
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [i18t('alpha transparent'), 'alpha'],
          [i18t('angle'), 'angle'],
          [i18t('anchor'), 'anchor.set'],
          [i18t('buttonMode'), 'buttonMode'],
          [i18t('frame'), 'frame'],
          [i18t('height'), 'height'],
          [i18t('rotation'), 'rotation'],
          [i18t('visible'), 'visible'],
          [i18t('width'), 'width'],
          [i18t('tile position x'), 'tilePosition.y'],
          [i18t('tile position y'), 'tilePosition.y'],
          [i18t('x'), 'x'],
          [i18t('y'), 'y'],
          [i18t('z'), 'y']
        ]), 'property');
    this.appendValueInput('value')
        .setCheck('Number')
        .appendField(i18t('to'));
    this.setPreviousStatement(true, ['Create', 'Update', 'Input']);
    this.setNextStatement(true, ['Create', 'Update', 'Input']);
    this.setColour(285);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Crop tile sprite.
 */
Blockly.Blocks['phaser_tile_sprite_crop'] = {
  init: function() {
    this.appendValueInput('variable')
        .appendField(Blockly.BlocksTemplate.adjust())
        .appendField(i18t('crop sprite with'));
    this.appendDummyInput()
        .appendField(i18t('top'))
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(new Blockly.FieldNumber(0, 0), 'top');
    this.appendDummyInput()
        .appendField(i18t('right'))
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(new Blockly.FieldNumber(0, 0), 'right');
    this.appendDummyInput()
        .appendField(i18t('bottom'))
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(new Blockly.FieldNumber(0, 0), 'bottom');
    this.appendDummyInput()
        .appendField(i18t('left'))
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(new Blockly.FieldNumber(0, 0), 'left');
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(285);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Destroy tile sprite.
 */
Blockly.Blocks['phaser_tile_sprite_destroy'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.point())
        .appendField(i18t('destroy tile sprite'));
    this.appendValueInput('variable')
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['Create', 'Update', 'Input']);
    this.setNextStatement(true, ['Create', 'Update', 'Input']);
    this.setColour(285);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Auto scroll tile sprite.
 */
Blockly.Blocks['phaser_tile_sprite_autoScroll'] = {
  init: function() {
    this.appendValueInput('variable')
        .setCheck(null)
        .appendField(Blockly.BlocksTemplate.point())
        .appendField(i18t('set tile sprite'));
    this.appendValueInput('x')
        .setCheck('Number')
        .appendField(i18t('autoscroll to'));
    this.appendValueInput('y')
        .setCheck('Number')
        .appendField(i18t('x'));
    this.appendDummyInput()
        .appendField(i18t('y'));
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(285);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Immovable tile sprite.
 */
Blockly.Blocks['phaser_tile_sprite_immovable'] = {
  init: function() {
    this.appendValueInput('variable')
        .setCheck(null)
        .appendField(Blockly.BlocksTemplate.point())
        .appendField(i18t('set tile sprite'));
    this.appendDummyInput()
        .appendField(i18t('as immovable by other objects'));
    this.setPreviousStatement(true, 'Create');
    this.setNextStatement(true, 'Create');
    this.setColour(285);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
