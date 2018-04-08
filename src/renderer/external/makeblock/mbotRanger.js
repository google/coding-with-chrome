/**
 * @fileoverview mBot Ranger renderer.
 *
 * @license Copyright 2016 Shenzhen Maker Works Co, Ltd. All Rights Reserved.
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
 * @author wangyu@makeblock.cc (Yu Wang)
 */
goog.provide('cwc.renderer.external.makeblock.MBotRanger');

goog.require('cwc.ui.EditorContent');
goog.require('cwc.file.Files');
goog.require('cwc.framework.Internal');
goog.require('cwc.renderer.Helper');
goog.require('cwc.utils.Helper');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.renderer.external.makeblock.MBotRanger = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;
};


/**
 * Initializes and defines the mbot renderer.
 */
cwc.renderer.external.makeblock.MBotRanger.prototype.init = function() {
  this.helper.getInstance('renderer').setRenderer(this.render.bind(this));
};


/**
 * @param {Object} editorContent
 * @param {cwc.file.Files} libraryFiles
 * @param {!cwc.file.Files} frameworks
 * @param {cwc.renderer.Helper} rendererHelper
 * @param {Object=} environ
 * @return {string}
 * @export
 */
cwc.renderer.external.makeblock.MBotRanger.prototype.render = function(
    editorContent,
    libraryFiles,
    frameworks,
    rendererHelper,
    environ = {}) {
  let header = rendererHelper.getJavaScriptURLs([
    cwc.framework.Internal.MBOT_RANGER,
  ], environ['baseURL']);
  let body = '\n<script>' +
      '  let code = function(mBotRanger) {\n' +
      editorContent[cwc.ui.EditorContent.JAVASCRIPT] +
      '\n};\n'+
      '  new cwc.framework.makeblock.mBotRanger(code);\n' +
      '</script>\n';
  return rendererHelper.getHTMLRunner(body, header, environ);
};
