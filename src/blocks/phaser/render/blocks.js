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
 * Phaser render section.
 */
Blockly.Blocks['phaser_render'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(Blockly.BlocksTemplate.point())
      .appendField(i18t('on render'));
    this.appendStatementInput('CODE')
      .appendField(i18t('do'))
      .setAlign(Blockly.ALIGN_CENTRE)
      .setCheck(['Render']);
    this.setPreviousStatement(true, 'Render');
    this.setNextStatement(false);
    this.setColour(195);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
