/**
 * @fileoverview Phaser Blocks for Blockly.
 *
 * @license Copyright 2020 The Coding with Chrome Authors.
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
 */

/**
 * @author mbordihn@google.com (Markus Bordihn)
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import Blockly, { Blocks } from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

import { BlocksTemplate } from '../../BlockEditor/blocks/BlocksTemplate';

import i18next from 'i18next';

/**
 * Debug camera.
 */
Blocks['phaser_debug_camera'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.point())
      .appendField(i18next.t('BLOCKS_PHASER_DEBUG_CAMERA'));
    this.setPreviousStatement(true, 'Render');
    this.setNextStatement(true, 'Render');
    this.setColour(195);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Debug camera.
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_debug_camera'] = function () {
  return 'game.debug.cameraInfo(game.camera, 32, 32);\n';
};

/**
 * Debug pointer.
 */
Blocks['phaser_debug_pointer'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(BlocksTemplate.point())
      .appendField(i18next.t('BLOCKS_PHASER_DEBUG_POINTER'));
    this.setPreviousStatement(true, 'Render');
    this.setNextStatement(true, 'Render');
    this.setColour(195);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Debug pointer.
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_debug_pointer'] = function () {
  return 'game.debug.pointer(game.input.activePointer);\n';
};

/**
 * Debug sprite.
 */
Blocks['phaser_debug_sprite'] = {
  init: function () {
    this.appendValueInput('variable')
      .appendField(BlocksTemplate.point())
      .appendField(i18next.t('BLOCKS_PHASER_DEBUG_SPRITE'));
    this.setPreviousStatement(true, 'Render');
    this.setNextStatement(true, 'Render');
    this.setColour(195);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * Debug sprite.
 * @param {Blockly.Block} block
 * @return {string}
 */
javascriptGenerator.forBlock['phaser_debug_sprite'] = function (block) {
  const variable = javascriptGenerator.valueToCode(
    block,
    'variable',
    javascriptGenerator.ORDER_ATOMIC
  );

  return 'game.debug.spriteInfo(' + variable + ', 32, 32);\n';
};
