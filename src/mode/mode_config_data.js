/**
 * @fileoverview Editor mode config data for the Coding with Chrome editor.
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
goog.provide('cwc.mode.ConfigData');
goog.provide('cwc.mode.Mod');

goog.require('cwc.file.MimeType');
goog.require('cwc.mode.Type');
goog.require('cwc.mode.arduino.Mod');
goog.require('cwc.mode.basic.advanced.Mod');
goog.require('cwc.mode.basic.blockly.Mod');
goog.require('cwc.mode.basic.simple.Mod');
goog.require('cwc.mode.coffeescript.Mod');
goog.require('cwc.mode.ev3.advanced.Mod');
goog.require('cwc.mode.ev3.blockly.Mod');
goog.require('cwc.mode.html5.Mod');
goog.require('cwc.mode.json.Mod');
goog.require('cwc.mode.makeblock.mbot.blockly.Mod');
goog.require('cwc.mode.makeblock.mbotRanger.blockly.Mod');
goog.require('cwc.mode.pencilCode.advanced.Mod');
goog.require('cwc.mode.phaser.advanced.Mod');
goog.require('cwc.mode.phaser.blockly.Mod');
goog.require('cwc.mode.python.Mod');
goog.require('cwc.mode.raspberryPi.advanced.Mod');
goog.require('cwc.mode.sphero.advanced.Mod');
goog.require('cwc.mode.sphero.blockly.Mod');
goog.require('cwc.mode.text.Mod');
goog.require('cwc.mode.tts.Mod');


/**
 * Editor mod configuration.
 * @param {!Object} config_data
 * @constructor
 * @struct
 */
cwc.mode.Mod = function(config_data) {
  /** @type {!string} */
  this.name = config_data.name || '';

  /** @type {!cwc.mode.Type} */
  this.type = config_data.type || cwc.mode.Type.NONE;

  /** @type {!string} */
  this.description = config_data.description || '';

  /** @type {!string} */
  this.title = config_data.title || '';

  /** @type {!string} */
  this.icon = config_data.icon || '';

  /** @type {!Object} */
  this.Mod = config_data.mod || {};

  /** @type {!Array} */
  this.authors = config_data.authors || [];

  /** @type {cwc.file.Type} Primary file type*/
  this.fileType = config_data.file_type || cwc.file.Type.UNKNOWN;

  /** @type {!Array} Supported mime types */
  this.mimeTypes = config_data.mime_types || [];

  /** @type {!boolean} */
  this.runPreview = config_data.run_preview || false;

  /** @type {!boolean} */
  this.autoPreview = config_data.auto_preview || false;

  if (!goog.isFunction(config_data.mod)) {
    console.error('Mod for', this.name, 'is not a function!');
  }
};


/**
 * enum {Object}
 */
cwc.mode.ConfigData = {};


/**
 * Arduino mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.ARDUINO] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  file_type: cwc.file.Type.ARDUINO,
  mime_types: [cwc.file.MimeType.CWC.type],
  mod: cwc.mode.arduino.Mod,
  name: 'Arduino',
});


/**
 * Basic mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.BASIC] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  file_type: cwc.file.Type.BASIC,
  icon: 'school',
  mime_types: [cwc.file.MimeType.CWC.type],
  mod: cwc.mode.basic.simple.Mod,
  name: 'Basic',
  title: 'Simple',
});


/**
 * Basic blockly mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.BASIC_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  file_type: cwc.file.Type.BASIC_BLOCKLY,
  icon: 'school',
  mime_types: [cwc.file.MimeType.CWC.type],
  mod: cwc.mode.basic.blockly.Mod,
  name: 'Basic Blockly',
  title: 'Blocks',
});


/**
 * Basic advanced mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.BASIC_ADVANCED] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  file_type: cwc.file.Type.BASIC_ADVANCED,
  mime_types: [cwc.file.MimeType.CWC.type],
  mod: cwc.mode.basic.advanced.Mod,
  name: 'Basic advanced',
});


/**
 * Mindstorms EV3 advanced mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.EV3] = new cwc.mode.Mod({
  authors: ['Markus Bordihn, Stefan Sauer'],
  file_type: cwc.file.Type.EV3,
  icon: 'adb',
  mime_types: [cwc.file.MimeType.CWC.type],
  mod: cwc.mode.ev3.advanced.Mod,
  name: 'EV3',
  title: 'EV3',
});


/**
 * Mindstorms EV3 blockly mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.EV3_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Markus Bordihn, Stefan Sauer'],
  file_type: cwc.file.Type.EV3_BLOCKLY,
  icon: 'adb',
  mime_types: [cwc.file.MimeType.CWC.type],
  mod: cwc.mode.ev3.blockly.Mod,
  name: 'EV3 blockly',
  title: 'EV3',
});


/**
 * Pencilcode mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.PENCIL_CODE] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  file_type: cwc.file.Type.PENCIL_CODE,
  icon: 'mode_edit',
  mime_types: [cwc.file.MimeType.CWC.type],
  mod: cwc.mode.pencilCode.advanced.Mod,
  name: 'Pencil Code',
  title: 'Pencil Code',
});


/**
 * Phaser mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.PHASER] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  file_type: cwc.file.Type.PHASER,
  icon: 'mode_edit',
  mime_types: [cwc.file.MimeType.CWC.type],
  mod: cwc.mode.phaser.advanced.Mod,
  name: 'Phaser',
  title: 'Phaser',
});


/**
 * Phaser blockly mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.PHASER_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  file_type: cwc.file.Type.PHASER_BLOCKLY,
  icon: 'mode_edit',
  mime_types: [cwc.file.MimeType.CWC.type],
  mod: cwc.mode.phaser.blockly.Mod,
  name: 'Phaser blockly',
  title: 'Phaser',
});


/**
 * Raspberry Pi mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.RASPBERRY_PI] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  file_type: cwc.file.Type.RASPBERRY_PI,
  icon: 'mode_edit',
  mime_types: [cwc.file.MimeType.CWC.type],
  mod: cwc.mode.raspberryPi.advanced.Mod,
  name: 'Raspberry Pi',
  title: 'Raspberry Pi',
});


/**
 * Sphero advanced mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.SPHERO] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  file_type: cwc.file.Type.SPHERO,
  icon: 'adjust',
  mime_types: [cwc.file.MimeType.CWC.type],
  mod: cwc.mode.sphero.advanced.Mod,
  name: 'Sphero',
  title: 'Sphero',
});


/**
 * Sphero blockly mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.SPHERO_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  file_type: cwc.file.Type.SPHERO_BLOCKLY,
  icon: 'adjust',
  mime_types: [cwc.file.MimeType.CWC.type],
  mod: cwc.mode.sphero.blockly.Mod,
  name: 'Sphero blockly',
  title: 'Sphero',
});


/**
 * mBot blockly mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.MBOT_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Yu Wang', 'Markus Bordihn'],
  file_type: cwc.file.Type.MBOT_BLOCKLY,
  icon: 'adjust',
  mime_types: [cwc.file.MimeType.CWC.type],
  mod: cwc.mode.makeblock.mbot.blockly.Mod,
  name: 'mBot blockly',
  title: 'mBot',
});


/**
 * mBot Ranger blockly mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.MBOT_RANGER_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Yu Wang', 'Markus Bordihn'],
  file_type: cwc.file.Type.MBOT_RANGER_BLOCKLY,
  icon: 'adjust',
  mime_types: [cwc.file.MimeType.CWC.type],
  mod: cwc.mode.makeblock.mbotRanger.blockly.Mod,
  name: 'mBot Ranger blockly',
  title: 'mBot Ranger',
});


/**
 * Python mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.PYTHON] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  file_type: cwc.file.Type.PYTHON,
  icon: 'mode_edit',
  mime_types: [cwc.file.MimeType.PYTHON.type],
  mod: cwc.mode.python.Mod,
  name: 'Python',
  title: 'Python',
});


/**
 * HTML5 mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.HTML5] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  file_type: cwc.file.Type.HTML,
  icon: 'public',
  mime_types: [cwc.file.MimeType.HTML.type],
  mod: cwc.mode.html5.Mod,
  name: 'HTML 5',
  title: 'HTML5',
});


/**
 * JSON mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.JSON] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  file_type: cwc.file.Type.JSON,
  mime_types: [cwc.file.MimeType.JSON.type],
  mod: cwc.mode.json.Mod,
  name: 'JSON',
});


/**
 * Coffeescript mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.COFFEESCRIPT] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  file_type: cwc.file.Type.COFFEESCRIPT,
  icon: 'local_cafe',
  mime_types: [cwc.file.MimeType.COFFEESCRIPT.type],
  mod: cwc.mode.coffeescript.Mod,
  name: 'Coffeescript',
  title: 'CoffeeScript',
});


/**
 * Text mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.TEXT] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  file_type: cwc.file.Type.TEXT,
  mime_types: [
    cwc.file.MimeType.TEXT.type,
    cwc.file.MimeType.CSS.type,
  ],
  mod: cwc.mode.text.Mod,
  name: 'Text',
});


/**
 * TTS mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.TTS] = new cwc.mode.Mod({
  name: 'Text to Speech',
  file_type: cwc.file.Type.TTS,
  mod: cwc.mode.tts.Mod,
  authors: ['Markus Bordihn'],
});
