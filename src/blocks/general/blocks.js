/**
 * @fileoverview General block definition.
 *
 * @license Copyright 2016 Google Inc. All Rights Reserved.
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
goog.provide('cwc.blocks.general.Blocks');

goog.require('Blockly');
goog.require('Blockly.Blocks');

goog.require('cwc.blocks');
goog.require('cwc.blocks.general.JavaScript');


/**
 * @private {string}
 */
cwc.blocks.general.Blocks.prefix_ = 'general_';


/**
 * Infinity loop
 */
cwc.blocks.addBlock('infinity_loop', function() {
  this.setHelpUrl('');
  this.setColour(120);
  this.appendDummyInput()
    .appendField(i18t('repeat forever'));
  this.appendStatementInput('CODE')
    .setAlign(Blockly.ALIGN_CENTRE);
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('');
}, cwc.blocks.general.Blocks.prefix_);
