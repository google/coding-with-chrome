/**
 * @fileoverview AIY renderer.
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
 * @author fstanis@google.com (Filip Stanis)
 */
goog.provide('cwc.renderer.external.AIY');

goog.require('cwc.file.Files');
goog.require('cwc.framework.Internal');
goog.require('cwc.renderer.Helper');
goog.require('cwc.ui.EditorContent');
goog.require('cwc.utils.Helper');

/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.renderer.external.AIY = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @private {!Array} */
  this.frameworks_ = [
    cwc.framework.Internal.AIY,
  ];
};


/**
 * Initializes and defines the AIY renderer.
 * @return {!Promise}
 */
cwc.renderer.external.AIY.prototype.init = function() {
  let rendererInstance = this.helper.getInstance('renderer', true);
  return rendererInstance.setRenderer(this.render.bind(this));
};


/**
 * AIY render logic.
 * @param {Object} editorContent
 * @param {cwc.file.Files} libraryFiles
 * @param {cwc.renderer.Helper} rendererHelper
 * @return {string}
 * @export
 */
cwc.renderer.external.AIY.prototype.render = function(
  editorContent,
  libraryFiles,
  rendererHelper) {
    let header = rendererHelper.getJavaScriptURLs(this.frameworks_);
    let body = '\n<script>' +
        '  let customCode = function(aiy) {\n' +
        editorContent[cwc.ui.EditorContent.DEFAULT] +
        '\n};\n' + '  let runner = new cwc.framework.Runner();\n' +
        '  let customFramework = new cwc.framework.AIY(runner);\n' +
        '  customFramework.listen(customCode);\n' +
        '</script>\n';
    return rendererHelper.getHTML(body, header);
};
