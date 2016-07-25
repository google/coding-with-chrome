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
goog.require('cwc.mode.pencilCode.advanced.Mod');
goog.require('cwc.mode.python.Mod');
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
  this.mod = config_data.mod || {};

  /** @type {array} */
  this.authors = config_data.authors || [];

  /** @type {cwc.file.Type} Primary file type*/
  this.fileType = config_data.file_type || cwc.file.Type.UNKNOWN;

  /** @type {array} Additional supported file types */
  this.fileTypes = config_data.file_types || [];

  /** @type {!Object} */
  this.config = config_data.config || {};

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
  name: 'Arduino',
  file_type: cwc.file.Type.ARDUINO,
  mod: cwc.mode.arduino.Mod,
  authors: ['Markus Bordihn']
});


/**
 * Basic mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.BASIC] = new cwc.mode.Mod({
  name: 'Basic',
  title: 'Simple',
  icon: 'school',
  file_type: cwc.file.Type.BASIC,
  mod: cwc.mode.basic.simple.Mod,
  authors: ['Markus Bordihn']
});


/**
 * Basic Blockly mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.BASIC_BLOCKLY] = new cwc.mode.Mod({
  name: 'Basic Blockly',
  title: 'Blocks',
  icon: 'school',
  file_type: cwc.file.Type.BASIC_BLOCKLY,
  mod: cwc.mode.basic.blockly.Mod,
  authors: ['Markus Bordihn']
});


/**
 * Basic advanced mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.BASIC_ADVANCED] = new cwc.mode.Mod({
  name: 'Basic advanced',
  file_type: cwc.file.Type.BASIC_ADVANCED,
  mod: cwc.mode.basic.advanced.Mod,
  authors: ['Markus Bordihn']
});


/**
 * Mindstorms EV3 advanced mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.EV3] = new cwc.mode.Mod({
  name: 'EV3',
  title: 'EV3',
  icon: 'adb',
  file_type: cwc.file.Type.EV3,
  mod: cwc.mode.ev3.advanced.Mod,
  authors: ['Markus Bordihn, Stefan Sauer']
});


/**
 * Mindstorms EV3 blockly mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.EV3_BLOCKLY] = new cwc.mode.Mod({
  name: 'EV3 blockly',
  title: 'EV3',
  icon: 'adb',
  file_type: cwc.file.Type.EV3_BLOCKLY,
  mod: cwc.mode.ev3.blockly.Mod,
  authors: ['Markus Bordihn, Stefan Sauer']
});


/**
 * Pencilcode mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.PENCIL_CODE] = new cwc.mode.Mod({
  name: 'Pencil Code',
  title: 'Pencil Code',
  icon: 'mode_edit',
  file_type: cwc.file.Type.PENCIL_CODE,
  mod: cwc.mode.pencilCode.advanced.Mod,
  authors: ['Markus Bordihn']
});


/**
 * Python mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.PYTHON] = new cwc.mode.Mod({
  name: 'Python',
  title: 'Python',
  icon: 'mode_edit',
  file_type: cwc.file.Type.PYTHON,
  mod: cwc.mode.python.Mod,
  authors: ['Markus Bordihn']
});


/**
 * Sphero advanced mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.SPHERO] = new cwc.mode.Mod({
  name: 'Sphero',
  title: 'Sphero',
  icon: 'adjust',
  file_type: cwc.file.Type.SPHERO,
  mod: cwc.mode.sphero.advanced.Mod,
  authors: ['Markus Bordihn']
});


/**
 * Sphero advanced mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.SPHERO_BLOCKLY] = new cwc.mode.Mod({
  name: 'Sphero blockly',
  title: 'Sphero',
  icon: 'adjust',
  file_type: cwc.file.Type.SPHERO_BLOCKLY,
  mod: cwc.mode.sphero.blockly.Mod,
  authors: ['Markus Bordihn']
});


/**
 * HTML5 mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.HTML5] = new cwc.mode.Mod({
  name: 'HTML 5',
  title: 'HTML5',
  icon: 'public',
  file_type: cwc.file.Type.HTML5,
  mod: cwc.mode.html5.Mod,
  authors: ['Markus Bordihn']
});


/**
 * JSON mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.JSON] = new cwc.mode.Mod({
  name: 'JSON',
  file_type: cwc.file.Type.JSON,
  mod: cwc.mode.json.Mod,
  authors: ['Markus Bordihn']
});


/**
 * Coffeescript mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.COFFEESCRIPT] = new cwc.mode.Mod({
  name: 'Coffeescript',
  title: 'CoffeeScript',
  icon: 'local_cafe',
  file_type: cwc.file.Type.COFFEESCRIPT,
  mod: cwc.mode.coffeescript.Mod,
  authors: ['Markus Bordihn']
});


/**
 * Text mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.TEXT] = new cwc.mode.Mod({
  name: 'Text',
  file_type: cwc.file.Type.TEXT,
  mod: cwc.mode.text.Mod,
  authors: ['Markus Bordihn']
});


/**
 * TTS mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.TTS] = new cwc.mode.Mod({
  name: 'Text to Speech',
  file_type: cwc.file.Type.TTS,
  mod: cwc.mode.tts.Mod,
  authors: ['Markus Bordihn']
});
