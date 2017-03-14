/**
 * @fileoverview File creator, loader and saver configurations.
 *
 * @license Copyright 2015 The Coding with Chrome Authors.
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
goog.provide('cwc.fileHandler.Config');
goog.provide('cwc.fileHandler.ConfigData');

goog.require('cwc.file.ContentType');
goog.require('cwc.file.Extensions');
goog.require('cwc.file.Type');
goog.require('cwc.fileFormat.File');
goog.require('cwc.mode.Type');


/**
 * enum {Object}
 */
cwc.fileHandler.ConfigData = {};



/**
 * @constructor
 * @struct
 * @final
 */
cwc.fileHandler.Config = function() {};


/**
 * @param {!string} name
 * @param {!cwc.fileFormat.File} file
 * @param {!cwc.file.Type} type
 * @param {!cwc.mode.Type} mode
 * @param {cwc.file.Extensions=} opt_extension
 * @param {cwc.file.ContentType=} opt_content_type
 * @param {string=} opt_content
 * @param {Object=} opt_config
 */
cwc.fileHandler.Config.add = function(name, file, type, mode, opt_extension,
    opt_content_type, opt_content, opt_config) {
  var config = opt_config || {};
  config.name = name;
  config.file = file;
  config.type = type;
  config.mode = mode;
  config.extension = opt_extension || cwc.file.Extensions.CWC;
  config.contentType = opt_content_type;
  config.content = opt_content || '';
  config.title = 'Untitled ' + name;
  if (!('editor_views' in config)) {
    if (file == cwc.fileFormat.File.getBlocklyFile ||
        file == cwc.fileFormat.File.getSimpleFile) {
      config.editor_views = [cwc.file.ContentType.JAVASCRIPT];
    } else if (file == cwc.fileFormat.File.getAdvancedFile) {
      config.editor_views = [
        cwc.file.ContentType.JAVASCRIPT,
        cwc.file.ContentType.HTML,
        cwc.file.ContentType.CSS
      ];
    } else if (file == cwc.fileFormat.File.getPencilCodeFile) {
      config.editor_views = [cwc.file.ContentType.COFFEESCRIPT];
    } else if (file == cwc.fileFormat.File.getRawFile && opt_content_type) {
      config.editor_views = [opt_content_type];
    } else {
      config.editor_views = [cwc.file.ContentType.CUSTOM];
    }
  }
  if (!('blockly_views' in config)) {
    if (file == cwc.fileFormat.File.getBlocklyFile) {
      config.blockly_views = [cwc.file.ContentType.BLOCKLY];
    }
  }
  cwc.fileHandler.ConfigData[type] = config;
};


/**
 * @param {!cwc.file.Type} type
 * @param {boolean=} opt_required
 * @return {Object}
 */
cwc.fileHandler.Config.get = function(type, opt_required) {
  if (type in cwc.fileHandler.ConfigData) {
    return cwc.fileHandler.ConfigData[type];
  } else {
    var error = 'File config for ' + type + ' is not defined!';
    if (opt_required) {
      throw 'Required ' + error;
    }
    console.warn(error);
    console.info('Supported file types:', cwc.fileHandler.ConfigData);
    return null;
  }
};


/**
 * Arduino file config.
 */
cwc.fileHandler.Config.add('Arduino file',
    cwc.fileFormat.File.getCustomFile,
    cwc.file.Type.ARDUINO,
    cwc.mode.Type.ARDUINO);


/**
 * Basic simple file config.
 */
cwc.fileHandler.Config.add('Basic file',
    cwc.fileFormat.File.getSimpleFile,
    cwc.file.Type.BASIC,
    cwc.mode.Type.BASIC,
    cwc.file.Extensions.CWC,
    null,
    null, {
      library: true,
      preview: true,
      auto_update: true });


/**
 * Basic blockly file config.
 */
cwc.fileHandler.Config.add('Basic blockly file',
    cwc.fileFormat.File.getBlocklyFile,
    cwc.file.Type.BASIC_BLOCKLY,
    cwc.mode.Type.BASIC_BLOCKLY,
    cwc.file.Extensions.CWC,
    null,
    null, {
      library: true,
      preview: true });


/**
 * Basic advanced file config.
 */
cwc.fileHandler.Config.add('Basic advanced file',
    cwc.fileFormat.File.getAdvancedFile,
    cwc.file.Type.BASIC_ADVANCED,
    cwc.mode.Type.BASIC_ADVANCED,
    cwc.file.Extensions.CWC,
    null,
    null, {
      library: true,
      preview: true,
      auto_update: true });


/**
 * EV3 file config.
 */
cwc.fileHandler.Config.add('EV3 file',
    cwc.fileFormat.File.getSimpleFile,
    cwc.file.Type.EV3,
    cwc.mode.Type.EV3);


/**
 * EV3 blockly file config.
 */
cwc.fileHandler.Config.add('EV3 blockly file',
    cwc.fileFormat.File.getBlocklyFile,
    cwc.file.Type.EV3_BLOCKLY,
    cwc.mode.Type.EV3_BLOCKLY);


/**
 * Sphero file config.
 */
cwc.fileHandler.Config.add('Sphero file',
    cwc.fileFormat.File.getSimpleFile,
    cwc.file.Type.SPHERO,
    cwc.mode.Type.SPHERO);


/**
 * Sphero blockly file config.
 */
cwc.fileHandler.Config.add('Sphero blockly file',
    cwc.fileFormat.File.getBlocklyFile,
    cwc.file.Type.SPHERO_BLOCKLY,
    cwc.mode.Type.SPHERO_BLOCKLY);


/**
 * mBot blockly file config.
 */
cwc.fileHandler.Config.add('mBot blockly file',
    cwc.fileFormat.File.getBlocklyFile,
    cwc.file.Type.MBOT_BLOCKLY,
    cwc.mode.Type.MBOT_BLOCKLY);


/**
 * mBot ranger blockly file config.
 */
cwc.fileHandler.Config.add('mBot Ranger blockly file',
    cwc.fileFormat.File.getBlocklyFile,
    cwc.file.Type.MBOT_RANGER_BLOCKLY,
    cwc.mode.Type.MBOT_RANGER_BLOCKLY);


/**
 * Coffeescript file config.
 */
cwc.fileHandler.Config.add('Coffeescript file',
    cwc.fileFormat.File.getRawFile,
    cwc.file.Type.COFFEESCRIPT,
    cwc.mode.Type.COFFEESCRIPT,
    cwc.file.Extensions.COFFEESCRIPT,
    cwc.file.ContentType.COFFEESCRIPT,
    '# Untitled Coffeescript\n');


/**
 * Basic simple file config.
 */
cwc.fileHandler.Config.add('Pencil Code file',
    cwc.fileFormat.File.getPencilCodeFile,
    cwc.file.Type.PENCIL_CODE,
    cwc.mode.Type.PENCIL_CODE,
    cwc.file.Extensions.CWC,
    cwc.file.ContentType.COFFEESCRIPT,
    null, {
      library: true,
      preview: true,
      auto_update: true });


/**
 * Phaser file config.
 */
cwc.fileHandler.Config.add('Phaser file',
    cwc.fileFormat.File.getSimpleFile,
    cwc.file.Type.PHASER,
    cwc.mode.Type.PHASER,
    cwc.file.Extensions.CWC,
    null,
    null, {
      library: true,
      preview: true });


/**
 * Phaser blockly file config.
 */
cwc.fileHandler.Config.add('Phaser blockly file',
    cwc.fileFormat.File.getBlocklyFile,
    cwc.file.Type.PHASER_BLOCKLY,
    cwc.mode.Type.PHASER_BLOCKLY,
    cwc.file.Extensions.CWC,
    null,
    null, {
      library: true,
      preview: true });


/**
 * Raspberry Pi file config.
 */
cwc.fileHandler.Config.add('Raspberry Pi',
    cwc.fileFormat.File.getSimpleFile,
    cwc.file.Type.RASPBERRY_PI,
    cwc.mode.Type.RASPBERRY_PI);


/**
 * JSON file config.
 */
cwc.fileHandler.Config.add('JSON file',
    cwc.fileFormat.File.getRawFile,
    cwc.file.Type.JSON,
    cwc.mode.Type.JSON,
    cwc.file.Extensions.JSON);


/**
 * Python file config.
 */
cwc.fileHandler.Config.add('Python file',
    cwc.fileFormat.File.getRawFile,
    cwc.file.Type.PYTHON,
    cwc.mode.Type.PYTHON,
    cwc.file.Extensions.PYTHON,
    cwc.file.ContentType.PYTHON,
    '#!/usr/bin/python2.7\n');


/**
 * Text file config.
 */
cwc.fileHandler.Config.add('Text file',
    cwc.fileFormat.File.getRawFile,
    cwc.file.Type.TEXT,
    cwc.mode.Type.TEXT,
    cwc.file.Extensions.TEXT,
    cwc.file.ContentType.TEXT,
    '');


/**
 * HTML file config.
 */
cwc.fileHandler.Config.add('HTML file',
    cwc.fileFormat.File.getRawFile,
    cwc.file.Type.HTML,
    cwc.mode.Type.HTML5,
    cwc.file.Extensions.HTML,
    cwc.file.ContentType.HTML,
    '<!doctype html>\n' +
    '<html lang="en">\n' +
    '  <head>\n' +
    '    <meta charset="utf-8">\n' +
    '    <title>Untitled HTML</title>\n' +
    '  </head>\n' +
    '  <body>\n\n' +
    '  </body>\n' +
    '</html>\n');
