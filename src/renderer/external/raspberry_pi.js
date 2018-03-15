/**
 * @fileoverview Raspberry Pi renderer.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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
goog.provide('cwc.renderer.external.RaspberryPi');

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
cwc.renderer.external.RaspberryPi = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;
};


/**
 * Initializes and defines the RaspberryPi renderer.
 */
cwc.renderer.external.RaspberryPi.prototype.init = function() {
  let rendererInstance = this.helper.getInstance('renderer', true);
  let renderer = this.render.bind(this);
  rendererInstance.setRenderer(renderer);
};


/**
 * @param {Object} editorContent
 * @param {cwc.file.Files} libraryFiles
 * @param {!cwc.file.Files} frameworks
 * @param {cwc.renderer.Helper} rendererHelper
 * @return {string}
 * @export
 */
cwc.renderer.external.RaspberryPi.prototype.render = function(
    editorContent,
    libraryFiles,
    frameworks,
    rendererHelper) {
  let header = rendererHelper.getFrameworkHeader(
    /** @type {string} */ (cwc.framework.Internal.RASPBERRY_PI), frameworks);
  let body = '\n<script>' +
      '  let code = function(pi) {\n' +
      editorContent[cwc.ui.EditorContent.JAVASCRIPT] +
      '\n};\n' +
      '  new cwc.framework.RaspberryPi(code);\n' +
      '</script>\n';

  return rendererHelper.getHTML(body, header);
};
