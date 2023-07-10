/**
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
 * @fileoverview Default Static Files Blocks.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import Blockly, { Blocks } from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

/**
 * Static audio block for default embedded audios.
 */
Blocks['static_audio_file'] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldImage('', 50, 50, ''),
      'urlData'
    );
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput(''), 'filename')
      .appendField(new Blockly.FieldTextInput(''), 'url')
      .setVisible(false);
    this.getField('urlData').EDITABLE = true;
    this.getField('url').SERIALIZABLE = true;
    this.getField('urlData').SERIALIZABLE = true;
    this.getField('filename').SERIALIZABLE = true;
    this.setInputsInline(false);
    this.setOutput(true, 'Image');
    this.setColour(150);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * @param {Blockly.Block} block
 * @return {any[]}
 */
javascriptGenerator.forBlock['static_audio_file'] = function (block) {
  return [
    block.getFieldValue('urlData') || block.getFieldValue('url'),
    javascriptGenerator.ORDER_NONE,
  ];
};

/**
 * Static image block for default embedded images.
 */
Blocks['static_image_file'] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldImage('', 50, 50, ''),
      'urlData'
    );
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput(''), 'filename')
      .appendField(new Blockly.FieldTextInput(''), 'url')
      .setVisible(false);
    this.getField('urlData').EDITABLE = true;
    this.getField('url').SERIALIZABLE = true;
    this.getField('urlData').SERIALIZABLE = true;
    this.getField('filename').SERIALIZABLE = true;
    this.setInputsInline(false);
    this.setOutput(true, 'Image');
    this.setColour(150);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * @param {Blockly.Block} block
 * @return {any[]}
 */
javascriptGenerator.forBlock['static_image_file'] = function (block) {
  return [
    block.getFieldValue('url') || block.getFieldValue('urlData'),
    javascriptGenerator.ORDER_NONE,
  ];
};
