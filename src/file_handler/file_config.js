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
goog.require('cwc.fileFormat.AdvancedFile');
goog.require('cwc.fileFormat.BlocklyFile');
goog.require('cwc.fileFormat.CoffeeScriptFile');
goog.require('cwc.fileFormat.CustomFile');
goog.require('cwc.fileFormat.JavaScriptFile');
goog.require('cwc.fileFormat.RawFile');
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
 * @param {!cwc.fileFormat.AdvancedFile|
 *         cwc.fileFormat.BlocklyFile|
 *         cwc.fileFormat.CoffeeScriptFile|
 *         cwc.fileFormat.CustomFile|
 *         cwc.fileFormat.JavaScriptFile|
 *         cwc.fileFormat.RawFile|
 *         cwc.fileFormat.PhaserFile} file
 * @param {!cwc.file.Type} type
 * @param {!cwc.mode.Type} mode
 * @param {cwc.file.Extensions=} extension
 * @param {cwc.file.ContentType=} content_type
 * @param {string=} content
 * @param {Object=} config
 */
cwc.fileHandler.Config.add = function(name, file, type, mode,
    extension = cwc.file.Extensions.CWC, content_type, content = '',
    config = {}) {
  config.content = content;
  config.contentType = content_type;
  config.extension = extension;
  config.file = file;
  config.fileType = type;
  config.mode = mode;
  config.name = name;
  config.raw = file == cwc.fileFormat.RawFile;
  config.title = 'Untitled ' + name;
  if (!('editor_views' in config)) {
    if (file == cwc.fileFormat.BlocklyFile ||
        file == cwc.fileFormat.JavaScriptFile) {
      config.editor_views = [cwc.file.ContentType.JAVASCRIPT];
    } else if (file == cwc.fileFormat.AdvancedFile) {
      config.editor_views = [
        cwc.file.ContentType.JAVASCRIPT,
        cwc.file.ContentType.HTML,
        cwc.file.ContentType.CSS,
      ];
    } else if (file == cwc.fileFormat.CoffeeScriptFile) {
      config.editor_views = [cwc.file.ContentType.COFFEESCRIPT];
    } else if (file == cwc.fileFormat.RawFile && content_type) {
      config.editor_views = [content_type];
    } else {
      config.editor_views = [cwc.file.ContentType.CUSTOM];
    }
  }
  if (!('blockly_views' in config)) {
    if (file == cwc.fileFormat.BlocklyFile ||
        file == cwc.fileFormat.BlocklyFile) {
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
    let error = 'File config for ' + type + ' is not defined!';
    if (opt_required) {
      throw new Error('Required ' + error);
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
    cwc.fileFormat.CustomFile,
    cwc.file.Type.ARDUINO,
    cwc.mode.Type.ARDUINO
);


/**
 * Basic simple file config.
 */
cwc.fileHandler.Config.add('Basic file',
    cwc.fileFormat.JavaScriptFile,
    cwc.file.Type.BASIC,
    cwc.mode.Type.BASIC,
    cwc.file.Extensions.CWC,
    undefined,
    undefined, {
      library: true,
      preview: true,
      auto_update: true,
    }
);


/**
 * Basic blockly file config.
 */
cwc.fileHandler.Config.add('Basic blockly file',
    cwc.fileFormat.BlocklyFile,
    cwc.file.Type.BASIC_BLOCKLY,
    cwc.mode.Type.BASIC_BLOCKLY,
    cwc.file.Extensions.CWC,
    undefined,
    undefined, {
      library: true,
      preview: true,
    }
);


/**
 * Basic advanced file config.
 */
cwc.fileHandler.Config.add('Basic advanced file',
    cwc.fileFormat.AdvancedFile,
    cwc.file.Type.BASIC_ADVANCED,
    cwc.mode.Type.BASIC_ADVANCED,
    cwc.file.Extensions.CWC,
    undefined,
    undefined, {
      library: true,
      preview: true,
      auto_update: true,
    }
);


/**
 * EV3 file config.
 */
cwc.fileHandler.Config.add('EV3 file',
    cwc.fileFormat.JavaScriptFile,
    cwc.file.Type.EV3,
    cwc.mode.Type.EV3
);


/**
 * EV3 blockly file config.
 */
cwc.fileHandler.Config.add('EV3 blockly file',
    cwc.fileFormat.BlocklyFile,
    cwc.file.Type.EV3_BLOCKLY,
    cwc.mode.Type.EV3_BLOCKLY
);


/**
 * Sphero file config.
 */
cwc.fileHandler.Config.add('Sphero file',
    cwc.fileFormat.JavaScriptFile,
    cwc.file.Type.SPHERO,
    cwc.mode.Type.SPHERO
);


/**
 * Sphero blockly file config.
 */
cwc.fileHandler.Config.add('Sphero blockly file',
    cwc.fileFormat.BlocklyFile,
    cwc.file.Type.SPHERO_BLOCKLY,
    cwc.mode.Type.SPHERO_BLOCKLY
);


/**
 * mBot blockly file config.
 */
cwc.fileHandler.Config.add('mBot blockly file',
    cwc.fileFormat.BlocklyFile,
    cwc.file.Type.MBOT_BLOCKLY,
    cwc.mode.Type.MBOT_BLOCKLY
);


/**
 * mBot ranger blockly file config.
 */
cwc.fileHandler.Config.add('mBot Ranger blockly file',
    cwc.fileFormat.BlocklyFile,
    cwc.file.Type.MBOT_RANGER_BLOCKLY,
    cwc.mode.Type.MBOT_RANGER_BLOCKLY
);


/**
 * Coffeescript file config.
 */
cwc.fileHandler.Config.add('Coffeescript file',
    cwc.fileFormat.RawFile,
    cwc.file.Type.COFFEESCRIPT,
    cwc.mode.Type.COFFEESCRIPT,
    cwc.file.Extensions.COFFEESCRIPT,
    cwc.file.ContentType.COFFEESCRIPT,
    '# Untitled Coffeescript\n'
);


/**
 * Basic simple file config.
 */
cwc.fileHandler.Config.add('Pencil Code file',
    cwc.fileFormat.CoffeeScriptFile,
    cwc.file.Type.PENCIL_CODE,
    cwc.mode.Type.PENCIL_CODE,
    cwc.file.Extensions.CWC,
    cwc.file.ContentType.COFFEESCRIPT,
    'speed 2\n' +
    'pen red\n' +
    'for [1..45]\n' +
    '  fd 100\n' +
    '  rt 88\n', {
      library: true,
      preview: true,
      auto_update: true,
    }
);


/**
 * Phaser file config.
 */
cwc.fileHandler.Config.add('Phaser file',
    cwc.fileFormat.JavaScriptFile,
    cwc.file.Type.PHASER,
    cwc.mode.Type.PHASER,
    cwc.file.Extensions.CWC,
    cwc.file.ContentType.JAVASCRIPT,
    'var game = new Phaser.Game(800, 600, Phaser.AUTO, ' +
    '\'phaser-game\', {\n' +
    '  preload: preload,\n' +
    '  create: create,\n' +
    '  update: update,\n' +
    '  render: render\n' +
    '});\n\n' +
    'function preload() {\n\n}\n\n' +
    'function create() {\n\n}\n\n' +
    'function update() {\n\n}\n\n' +
    'function render() {\n\n}\n', {
      library: true,
      preview: true,
    }
);


/**
 * Phaser blockly file config.
 */
cwc.fileHandler.Config.add('Phaser blockly file',
    cwc.fileFormat.BlocklyFile,
    cwc.file.Type.PHASER_BLOCKLY,
    cwc.mode.Type.PHASER_BLOCKLY,
    cwc.file.Extensions.CWC,
    undefined,
    undefined, {
      library: true,
      preview: true,
    }
);


/**
 * Raspberry Pi file config.
 */
cwc.fileHandler.Config.add('Raspberry Pi',
    cwc.fileFormat.JavaScriptFile,
    cwc.file.Type.RASPBERRY_PI,
    cwc.mode.Type.RASPBERRY_PI
);


/**
 * JSON file config.
 */
cwc.fileHandler.Config.add('JSON file',
    cwc.fileFormat.RawFile,
    cwc.file.Type.JSON,
    cwc.mode.Type.JSON,
    cwc.file.Extensions.JSON
);


/**
 * Python file config.
 */
cwc.fileHandler.Config.add('Python file',
    cwc.fileFormat.RawFile,
    cwc.file.Type.PYTHON,
    cwc.mode.Type.PYTHON,
    cwc.file.Extensions.PYTHON,
    cwc.file.ContentType.PYTHON,
    '#!/usr/bin/python2.7\n'
);


/**
 * Text file config.
 */
cwc.fileHandler.Config.add('Text file',
    cwc.fileFormat.RawFile,
    cwc.file.Type.TEXT,
    cwc.mode.Type.TEXT,
    cwc.file.Extensions.TEXT,
    cwc.file.ContentType.TEXT
);


/**
 * HTML file config.
 */
cwc.fileHandler.Config.add('HTML file',
    cwc.fileFormat.RawFile,
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
    '</html>\n'
);
