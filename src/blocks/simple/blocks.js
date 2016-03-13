/**
 * @fileoverview Simple Blocks for Blockly.
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
goog.provide('cwc.blocks.simple.Blocks');

goog.require('Blockly');

goog.require('cwc.blocks');
goog.require('cwc.blocks.simple.JavaScript');


/**
 * @private {string}
 */
cwc.blocks.simple.Blocks.drawPrefix_ = 'draw_';


/**
 * @private {string}
 */
cwc.blocks.simple.Blocks.textPrefix_ = 'text_';


/**
 * Write text.
 */
cwc.blocks.addBlock('write', function() {
  this.setHelpUrl(Blockly.Msg.Simple.TEXT_WRITE_HELPURL);
  this.setColour(160);
  this.interpolateMsg(Blockly.Msg.Simple.TEXT_WRITE_TITLE,
                      ['TEXT', null, Blockly.ALIGN_RIGHT],
                      Blockly.ALIGN_RIGHT);
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip(Blockly.Msg.Simple.TEXT_WRITE_TOOLTIP);
}, cwc.blocks.simple.Blocks.textPrefix_);


/**
 * Draw circle.
 */
cwc.blocks.addBlock('circle', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendValueInput('circle')
    .appendField('circle')
    .appendField('x')
    .appendField(new Blockly.FieldTextInput('50'), 'x')
    .appendField('y')
    .appendField(new Blockly.FieldTextInput('50'), 'y')
    .appendField('radius')
    .appendField(new Blockly.FieldTextInput('25'), 'radius')
    .appendField('fill color')
    .appendField(new Blockly.FieldColour('#ff0000'), 'fillColor');
  this.appendValueInput('NAME')
    .appendField('border color')
    .appendField(new Blockly.FieldColour('#123456'), 'borderColor')
    .appendField('border size')
    .appendField(new Blockly.FieldTextInput('2'), 'borderSize');
  this.setPreviousStatement(true, ['Number', 'String']);
  this.setNextStatement(true, ['Number', 'String']);
  this.setTooltip('');
}, cwc.blocks.simple.Blocks.drawPrefix_);


/**
 * Draw rectangle.
 */
cwc.blocks.addBlock('rectangle', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendValueInput('NAME')
    .appendField('Draw Rectangle:');
  this.appendValueInput('NAME')
    .appendField('start x')
    .appendField(new Blockly.FieldTextInput('10'), 'start_x')
    .appendField('start y')
    .appendField(new Blockly.FieldTextInput('10'), 'start_y');
  this.appendValueInput('NAME')
    .appendField('end x')
    .appendField(new Blockly.FieldTextInput('100'), 'end_x')
    .appendField('end y')
    .appendField(new Blockly.FieldTextInput('200'), 'end_y');
  this.appendValueInput('NAME')
    .appendField('fill color')
    .appendField(new Blockly.FieldColour('#00cc00'), 'fillColor');
  this.appendValueInput('NAME')
    .appendField('border color')
    .appendField(new Blockly.FieldColour('#ff0000'), 'borderColor');
  this.appendValueInput('NAME')
    .appendField('border size')
    .appendField(new Blockly.FieldTextInput('2'), 'borderSize');
  this.setPreviousStatement(true, ['Number', 'String']);
  this.setNextStatement(true, ['Number', 'String']);
  this.setTooltip('');
}, cwc.blocks.simple.Blocks.drawPrefix_);


/**
 * Draw line.
 */
cwc.blocks.addBlock('line', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendValueInput('NAME')
    .appendField('Draw Line:');
  this.appendValueInput('NAME')
    .appendField('start x')
    .appendField(new Blockly.FieldTextInput('10'), 'start_x')
    .appendField('start y')
    .appendField(new Blockly.FieldTextInput('10'), 'start_y');
  this.appendValueInput('NAME')
    .appendField('end x')
    .appendField(new Blockly.FieldTextInput('100'), 'end_x')
    .appendField('end y')
    .appendField(new Blockly.FieldTextInput('200'), 'end_y');
  this.appendValueInput('NAME')
    .appendField('fill color')
    .appendField(new Blockly.FieldColour('#00cc00'), 'fillColor');
  this.appendValueInput('NAME')
    .appendField('border size')
    .appendField(new Blockly.FieldTextInput('2'), 'borderSize');
  this.setPreviousStatement(true, ['Number', 'String']);
  this.setNextStatement(true, ['Number', 'String']);
  this.setTooltip('');
}, cwc.blocks.simple.Blocks.drawPrefix_);


/**
 * Draw point.
 */
cwc.blocks.addBlock('point', function() {
  this.setHelpUrl('');
  this.setColour(260);
  this.appendValueInput('NAME')
    .appendField('Draw Point:');
  this.appendValueInput('NAME')
    .appendField('x')
    .appendField(new Blockly.FieldTextInput('10'), 'x')
    .appendField('y')
    .appendField(new Blockly.FieldTextInput('10'), 'y');
  this.appendValueInput('NAME')
    .appendField('fill color')
    .appendField(new Blockly.FieldColour('#00cc00'), 'fillColor');
  this.appendValueInput('NAME')
    .appendField('border size')
    .appendField(new Blockly.FieldTextInput('2'), 'borderSize');
  this.setPreviousStatement(true, ['Number', 'String']);
  this.setNextStatement(true, ['Number', 'String']);
  this.setTooltip('');
}, cwc.blocks.simple.Blocks.drawPrefix_);
