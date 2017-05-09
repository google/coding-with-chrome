/**
 * @fileoverview Custom File format for Coding with Chrome.
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
goog.provide('cwc.fileFormat.AdvancedFile');
goog.provide('cwc.fileFormat.BlocklyFile');
goog.provide('cwc.fileFormat.CoffeeScriptFile');
goog.provide('cwc.fileFormat.CustomFile');
goog.provide('cwc.fileFormat.JavaScriptFile');
goog.provide('cwc.fileFormat.RawFile');


goog.require('cwc.file.Type');
goog.require('cwc.fileFormat.File');


/**
 * @param {string=} content
 * @param {cwc.file.Type=} type
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.AdvancedFile = function(content = '',
    type = cwc.file.Type.ADVANCED) {
  return new cwc.fileFormat.File()
    .setType(type)
    .setTitle('Untitled advanced file')
    .setContent(cwc.file.ContentType.JAVASCRIPT,
       '// Put your JavaScript code here\n')
    .setContent(cwc.file.ContentType.HTML,
       '<!-- Put your HTML code here -->\n')
    .setContent(cwc.file.ContentType.CSS,
       '/* Put your CSS code here */\n')
    .setMode('advanced');
};


/**
 * @param {string=} content
 * @param {cwc.file.Type=} type
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.BlocklyFile = function(content = '',
    type = cwc.file.Type.BLOCKLY) {
  return new cwc.fileFormat.File()
    .setType(type)
    .setTitle('Untitled Blockly file')
    .setContent(cwc.file.ContentType.BLOCKLY, content)
    .setContent(cwc.file.ContentType.JAVASCRIPT, '')
    .setMode('blockly')
    .setUi('blockly');
};


/**
 * @param {string=} content
 * @param {cwc.file.Type=} type
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.CoffeeScriptFile = function(content = '',
    type = cwc.file.Type.COFFEESCRIPT) {
  return new cwc.fileFormat.File()
    .setType(type)
    .setTitle('Untitled CoffeeScript file')
    .setContent(cwc.file.ContentType.COFFEESCRIPT, content);
};


/**
 * @param {string=} content
 * @param {cwc.file.Type=} type
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.CustomFile = function(content = '',
    type = cwc.file.Type.CUSTOM) {
  return new cwc.fileFormat.File()
    .setType(type)
    .setContent(cwc.file.ContentType.CUSTOM, content)
    .setTitle('Untitled custom file');
};


/**
 * @param {string=} content
 * @param {cwc.file.Type=} type
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.JavaScriptFile = function(
    content = '// Put your JavaScript code here\n',
    type = cwc.file.Type.JAVASCRIPT) {
  return new cwc.fileFormat.File()
    .setType(type)
    .setTitle('Untitled JavaScript file')
    .setContent(cwc.file.ContentType.JAVASCRIPT, content)
    .setMode('simple');
};


/**
 * @param {string=} content
 * @param {cwc.file.Type=} type
 * @param {cwc.file.ContentType=} contentType
 * @param {string=} filename
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.RawFile = function(content = '',
    type = cwc.file.Type.RAW, contentType = cwc.file.ContentType.RAW,
    filename = 'Untitled raw file') {
  return new cwc.fileFormat.File()
    .setType(type)
    .setTitle(filename)
    .setContent(contentType, content)
    .setRaw(true);
};
