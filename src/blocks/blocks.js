/**
 * @fileoverview Blocky Blocks for the Coding with Chrome editor.
 * @suppress {extraRequire}
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
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
goog.provide('cwc.blocks');



/**
 * Adds a specific block to Blockly.
 * @param {!string} name
 * @param {!Function} block_definition
 * @param {string=} opt_prefix
 */
cwc.blocks.addBlock = function(name, block_definition, opt_prefix) {
  var blockName = opt_prefix + name;
  if (blockName in Blockly['Blocks']) {
    console.warn('Block with the name', blockName, 'is already defined !');
  }
  Blockly.Blocks[blockName] = { init: block_definition };
};


/**
 * Adds a specific block to Blockly.
 * @param {!string} name
 * @param {!Function} block_javascript
 * @param {string=} opt_prefix
 */
cwc.blocks.addJavaScript = function(name, block_javascript, opt_prefix) {
  var blockName = opt_prefix + name;
  if (blockName in Blockly['JavaScript']) {
    console.warn('JavaScript for ', blockName, ' Block is already defined !');
  }
  Blockly['JavaScript'][blockName] = block_javascript;
};


/**
 * @param {Object} block
 * @param {string} name
 * @param {Blockly.JavaScript.ORDER_ATOMIC} opt_order
 */
cwc.blocks.valueToCode = function(block, name, opt_order) {
  return Blockly['JavaScript'].valueToCode(block, name,
      opt_order || Blockly['JavaScript']['ORDER_ATOMIC']);
};


/**
 * @param {Object} block
 * @param {string} name
 * @param {Blockly.JavaScript.ORDER_ATOMIC} opt_order
 * @param {number=} opt_base int base
 */
cwc.blocks.valueToInt = function(block, name, opt_order, opt_base) {
  return parseInt(cwc.blocks.valueToCode(block, name, opt_order) || 0,
    opt_base);
};


/**
 * @param {Object} block
 * @param {string} name
 */
cwc.blocks.getFieldValue = function(block, name) {
  return block.getFieldValue(name);
};


/**
 * @param {Object} block
 * @param {string} name
 * @param {number=} opt_base int base
 */
cwc.blocks.getFieldValueInt = function(block, name, opt_base) {
  return parseInt(cwc.blocks.getFieldValue(block, name) || 0, opt_base);
};


/**
 * @param {Object} block
 * @param {string} name
 */
cwc.blocks.getFieldValueNumber = function(block, name) {
  return Number(cwc.blocks.getFieldValue(block, name) || 0);
};


/**
 * @param {Object} block
 * @param {string} name
 */
cwc.blocks.getFieldValueColor = function(block, name) {
  return parseInt(cwc.blocks.getFieldValue(block, name).replace('#', ''), 16);
};


/**
 * @param {Object} block
 * @param {string} name
 */
cwc.blocks.getFieldValueMinMax = function(block, name, opt_min, opt_max) {
  return Math.min(Math.max(
      parseInt(block.getFieldValue(name)), opt_min || 0), opt_max || 100);
};


