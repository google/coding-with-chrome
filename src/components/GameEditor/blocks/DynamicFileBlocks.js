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
 * @fileoverview Default Dynamic Files Blocks.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import Blockly, { Blocks, Events } from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { Base64 } from '../../../utils/file/Base64';

/**
 * Dynamic image block for user-selected images.
 */
Blocks['dynamic_image_file'] = {
  /**
   * @param {!AbstractEvent} event
   */
  onchange: function (event) {
    // Block is deleted or is in a flyout.
    if (
      !this.workspace ||
      this.workspace.isFlyout ||
      event.type != Events.BLOCK_CREATE ||
      event.ids.indexOf(this.id) == -1
    ) {
      return;
    }

    // Generate ID from base64 data, if not set.
    const blockId = this.getField('id').getValue();
    const urlData = this.getField('urlData').getValue();
    if (!blockId && urlData) {
      Base64.generateIdFromBase64(urlData).then((id) => {
        this.getField('id').setValue(id);
      });
    }
  },
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldImage('', 50, 50, ''),
      'urlData'
    );
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput(''), 'id')
      .appendField(new Blockly.FieldTextInput(''), 'filename')
      .appendField(new Blockly.FieldTextInput(''), 'url')
      .setVisible(false);
    this.getField('urlData').EDITABLE = true;
    this.getField('id').SERIALIZABLE = true;
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
javascriptGenerator.forBlock['dynamic_image_file'] = function (block) {
  return [
    block.getFieldValue('id') ||
      block.getFieldValue('urlData') ||
      block.getFieldValue('url') ||
      '',
    javascriptGenerator.ORDER_NONE,
  ];
};

/**
 * Dynamic audio block for user-selected audios.
 */
Blocks['dynamic_audio_file'] = {
  /**
   * @param {!AbstractEvent} event
   */
  onchange: function (event) {
    // Block is deleted or is in a flyout.
    if (
      !this.workspace ||
      this.workspace.isFlyout ||
      event.type != Events.BLOCK_CREATE ||
      event.ids.indexOf(this.id) == -1
    ) {
      return;
    }

    // Generate ID from base64 data, if not set.
    const blockId = this.getField('id').getValue();
    const urlData = this.getField('urlData').getValue();
    if (!blockId && urlData) {
      Base64.generateIdFromBase64(urlData).then((id) => {
        this.getField('id').setValue(id);
      });
    }
  },
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldTextInput(''),
      'urlData'
    );
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput(''), 'id')
      .appendField(new Blockly.FieldTextInput(''), 'filename')
      .appendField(new Blockly.FieldTextInput(''), 'url')
      .setVisible(false);
    this.getField('urlData').EDITABLE = true;
    this.getField('id').SERIALIZABLE = true;
    this.getField('url').SERIALIZABLE = true;
    this.getField('urlData').SERIALIZABLE = true;
    this.getField('filename').SERIALIZABLE = true;
    this.setInputsInline(false);
    this.setOutput(true, 'Audio');
    this.setColour(150);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};

/**
 * @param {Blockly.Block} block
 * @return {any[]}
 */
javascriptGenerator.forBlock['dynamic_audio_file'] = function (block) {
  return [
    block.getFieldValue('id') ||
      block.getFieldValue('urlData') ||
      block.getFieldValue('url') ||
      '',
    javascriptGenerator.ORDER_NONE,
  ];
};
