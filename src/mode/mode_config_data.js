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

goog.require('cwc.utils.mime.Type');
goog.require('cwc.mode.Type');
goog.require('cwc.mode.basic.Mod');
goog.require('cwc.mode.coffeescript.Mod');
goog.require('cwc.mode.lego.ev3.Mod');
goog.require('cwc.mode.lego.weDo2.Mod');
goog.require('cwc.mode.html5.Mod');
goog.require('cwc.mode.javascript.Mod');
goog.require('cwc.mode.json.Mod');
goog.require('cwc.mode.makeblock.mBot.Mod');
goog.require('cwc.mode.makeblock.mBotRanger.Mod');
goog.require('cwc.mode.pencilCode.Mod');
goog.require('cwc.mode.phaser.Mod');
goog.require('cwc.mode.python.Mod');
// goog.require('cwc.mode.raspberryPi.advanced.Mod');
goog.require('cwc.mode.sphero.bb8.Mod');
goog.require('cwc.mode.sphero.sphero2.Mod');
goog.require('cwc.mode.sphero.ollie.blockly.Mod');
goog.require('cwc.mode.sphero.sprkPlus.Mod');
goog.require('cwc.mode.text.Mod');


/**
 * Editor mod configuration.
 * @param {!Object} config_data
 * @constructor
 * @struct
 */
cwc.mode.Mod = function(config_data) {
  /** @type {!Array} */
  this.authors = config_data.authors || [];

  /** @type {boolean} */
  this.autoPreview = config_data.auto_preview || false;

  /** @type {boolean} */
  this.showBlockly = config_data.show_blockly || false;

  /** @type {boolean} */
  this.runPreview = config_data.run_preview || false;

  /** @type {string} */
  this.name = config_data.name || '';

  /** @type {string} */
  this.template = config_data.template || '';

  /** @type {string} */
  this.icon = config_data.icon || '';

  /** @type {!Object} */
  this.mod = config_data.mod || {};

  /** @type {!Array} Supported mime types */
  this.mimeTypes = config_data.mime_types || [];
};


/**
 * @param {cwc.utils.Helper=} helper
 * @return {!Object}
 */
cwc.mode.Mod.prototype.getMod = function(helper) {
  if (!goog.isFunction(this.mod)) {
    console.error('Mod for', this.name, 'is not a function!');
  }
  let Mod = this.mod;
  return new Mod(helper, this.showBlockly);
};


/**
 * enum {Object}
 */
cwc.mode.ConfigData = {};

/**
 * Basic mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.BASIC] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  icon: 'school',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.basic.Mod,
  name: 'Basic',
  template: 'basic/blank.cwc',
});


/**
 * Basic blockly mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.BASIC_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  icon: 'school',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.basic.Mod,
  show_blockly: true,
  name: 'Basic Blockly',
  template: 'basic/blank-blocks.cwc',
});


/**
 * Coffeescript mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.COFFEESCRIPT] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  icon: 'local_cafe',
  mime_types: [cwc.utils.mime.Type.COFFEESCRIPT.type],
  mod: cwc.mode.coffeescript.Mod,
  name: 'Coffeescript',
  template: 'coffeescript/blank.coffee',
});


/**
 * Mindstorms EV3 advanced mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.EV3] = new cwc.mode.Mod({
  authors: ['Markus Bordihn, Stefan Sauer'],
  icon: 'adb',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.lego.ev3.Mod,
  name: 'EV3',
  template: 'lego/ev3/blank.cwc',
});


/**
 * Mindstorms EV3 blockly mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.EV3_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Markus Bordihn, Stefan Sauer'],
  icon: 'adb',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.lego.ev3.Mod,
  show_blockly: true,
  name: 'EV3 blockly',
  template: 'lego/ev3/blank-blocks.cwc',
});


/**
 * HTML5 mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.HTML5] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  icon: 'public',
  mime_types: [cwc.utils.mime.Type.HTML.type],
  mod: cwc.mode.html5.Mod,
  name: 'HTML 5',
  template: 'html5/blank.html',
});


/**
 * JavaScript mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.JAVASCRIPT] = new cwc.mode.Mod({
  authors: ['Adam Carheden'],
  auto_preview: true,
  icon: 'local_cafe',
  mime_types: [cwc.utils.mime.Type.JAVASCRIPT.type],
  mod: cwc.mode.javascript.Mod,
  name: 'JavaScript',
  template: 'javascript/blank.js',
});


/**
 * JSON mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.JSON] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  mime_types: [cwc.utils.mime.Type.JSON.type],
  mod: cwc.mode.json.Mod,
  name: 'JSON',
  template: 'json/blank.json',
});


/**
 * Lego WeDo 2.0 blockly mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.LEGO_WEDO2_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  icon: 'adb',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.lego.weDo2.Mod,
  show_blockly: true,
  name: 'Lego WeDo 2.0 blockly',
  template: 'lego/wedo2/blank-blocks.cwc',
});


/**
 * mBot blockly mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.MBOT_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Yu Wang', 'Markus Bordihn'],
  icon: 'adjust',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.makeblock.mBot.Mod,
  show_blockly: true,
  name: 'mBot blockly',
  template: 'makeblock/mbot/blank-blocks.cwc',
});


/**
 * mBot Ranger blockly mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.MBOT_RANGER_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Yu Wang', 'Markus Bordihn'],
  icon: 'adjust',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.makeblock.mBotRanger.Mod,
  show_blockly: true,
  name: 'mBot Ranger blockly',
  template: 'makeblock/mbot_ranger/blank-blocks.cwc',
});


/**
 * Pencilcode mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.PENCIL_CODE] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  icon: 'mode_edit',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.pencilCode.Mod,
  name: 'Pencil Code',
  template: 'pencil_code/blank.cwc',
});


/**
 * Phaser mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.PHASER] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  icon: 'mode_edit',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.phaser.Mod,
  name: 'Phaser',
  template: 'phaser/blank.cwc',
});


/**
 * Phaser blockly mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.PHASER_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  icon: 'mode_edit',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.phaser.Mod,
  show_blockly: true,
  name: 'Phaser blockly',
  template: 'phaser/blank-blocks.cwc',
});


/**
 * Python mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.PYTHON] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  icon: 'mode_edit',
  mime_types: [cwc.utils.mime.Type.PYTHON.type],
  mod: cwc.mode.python.Mod,
  name: 'Python',
  template: 'python/blank.py',
});


/**
 * Python 2.7 mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.PYTHON27] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  auto_preview: true,
  icon: 'mode_edit',
  mime_types: [cwc.utils.mime.Type.PYTHON.type],
  mod: cwc.mode.python.Mod,
  name: 'Python 2.7',
  template: 'python27/blank.py',
});


/**
 * Raspberry Pi mode.
 */
// Disabled because needs re-implementation and used less than 0.1%.
//
// cwc.mode.ConfigData[cwc.mode.Type.RASPBERRY_PI] = new cwc.mode.Mod({
//  authors: ['Markus Bordihn'],
//  icon: 'mode_edit',
//  mime_types: [cwc.utils.mime.Type.CWC.type],
//  mod: cwc.mode.raspberryPi.advanced.Mod,
//  name: 'Raspberry Pi',
//  template: 'raspberry_pi/blank.cwc',
// });


/**
 * Sphero BB-8 blockly mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.SPHERO_BB8_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  icon: 'adjust',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.sphero.bb8.Mod,
  show_blockly: true,
  name: 'Sphero BB-8 blockly',
  template: 'sphero/bb_8/blank-blocks.cwc',
});


/**
 * Sphero 2.0 advanced mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.SPHERO] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  icon: 'adjust',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.sphero.sphero2.Mod,
  name: 'Sphero 2.0',
  template: 'sphero/classic/blank.cwc',
});


/**
 * Sphero 2.0 blockly mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.SPHERO_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  icon: 'adjust',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.sphero.sphero2.Mod,
  show_blockly: true,
  name: 'Sphero 2.0 blockly',
  template: 'sphero/classic/blank-blocks.cwc',
});


/**
 * Sphero Ollie blockly mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.SPHERO_OLLIE_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  icon: 'adjust',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.sphero.ollie.blockly.Mod,
  name: 'Sphero Ollie blockly',
  template: 'sphero/ollie/blank-blocks.cwc',
});


/**
 * Sphero SRPK+ mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.SPHERO_SPRK_PLUS] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  icon: 'adjust',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.sphero.sprkPlus.Mod,
  name: 'Sphero SPRK+',
  template: 'sphero/sprk_plus/blank.cwc',
});


/**
 * Sphero SPRK+ blockly mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.SPHERO_SPRK_PLUS_BLOCKLY] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  icon: 'adjust',
  mime_types: [cwc.utils.mime.Type.CWC.type],
  mod: cwc.mode.sphero.sprkPlus.Mod,
  show_blockly: true,
  name: 'Sphero SPRK+ blockly',
  template: 'sphero/sprk_plus/blank-blocks.cwc',
});


/**
 * Text mode.
 */
cwc.mode.ConfigData[cwc.mode.Type.TEXT] = new cwc.mode.Mod({
  authors: ['Markus Bordihn'],
  mime_types: [
    cwc.utils.mime.Type.TEXT.type,
    cwc.utils.mime.Type.CSS.type,
  ],
  mod: cwc.mode.text.Mod,
  name: 'Text',
  template: 'text/blank.txt',
});
