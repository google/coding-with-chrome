/**
 * @fileoverview General block definition.
 *
 * @license Copyright 2016 The Coding with Chrome Authors.
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
 * Infinity loop
 */
Blockly.Blocks['general_infinity_loop'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(120);
    this.appendDummyInput()
      .appendField(i18t('@@BLOCKS__REPEAT_FOREVER'));
    this.appendStatementInput('CODE')
      .setAlign(Blockly.ALIGN_CENTRE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
  },
};


/**
 * Input angle block.
 */
Blockly.Blocks['general_input_angle'] = {
  init: function() {
    this.setHelpUrl('');
    this.setColour(230);
    this.appendDummyInput()
        .appendField(new Blockly.FieldAngle(0), 'angle');
    this.setOutput(true, 'Number');
    this.setTooltip('');
  },
};


/**
 * Library file
 */
Blockly.Blocks['general_file_library'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(i18t('file'))
        .appendField('...', 'filename');
    this.getField('filename').EDITABLE = true;
    this.setOutput(true, null);
    this.setColour(150);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * Library file image
 */
Blockly.Blocks['general_file_library_image'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(i18t('image file'))
        .appendField('...', 'filename');
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage('', 150, 50, ''), 'preview');
    this.getField('filename').EDITABLE = true;
    this.getField('preview').EDITABLE = true;
    this.setInputsInline(false);
    this.setOutput(true, 'Image');
    this.setColour(150);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * Library file audio
 */
Blockly.Blocks['general_file_library_audio'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(i18t('audio file'))
        .appendField('...', 'filename');
    this.getField('filename').EDITABLE = true;
    this.setOutput(true, 'Audio');
    this.setColour(150);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};


/**
 * Library file text
 */
Blockly.Blocks['general_file_library_text'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(i18t('text file'))
        .appendField('...', 'filename');
    this.getField('filename').EDITABLE = true;
    this.setOutput(true, 'Text');
    this.setColour(150);
    this.setTooltip('');
    this.setHelpUrl('');
  },
};
