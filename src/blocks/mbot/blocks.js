/**
 * @fileoverview mBot blocks for blockly.
 *
 * @license Copyright 2016 Shenzhen Maker Works Co, Ltd. All Rights Reserved.
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
 * @author wangyu@makeblock.cc (Yu Wang)
 */
goog.provide('cwc.blocks.mbot.Blocks');

goog.require('Blockly');

goog.require('cwc.blocks');
goog.require('cwc.blocks.mbot.JavaScript');


/**
 * @private {string}
 */
cwc.blocks.mbot.Blocks.prefix_ = 'mbot_';


/**
 * mbot roll.
 */
cwc.blocks.addBlock('beep_buzzer', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip('Beep the Buzzer');
}, cwc.blocks.mbot.Blocks.prefix_);
