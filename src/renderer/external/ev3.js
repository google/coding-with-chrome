/**
 * @fileoverview EV3 renderer.
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
goog.provide('cwc.renderer.external.EV3');

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
cwc.renderer.external.EV3 = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;
};


/**
 * Initializes and defines the EV3 renderer.
 */
cwc.renderer.external.EV3.prototype.init = function() {
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
cwc.renderer.external.EV3.prototype.render = function(
    editorContent,
    libraryFiles,
    frameworks,
    rendererHelper,
    environ = {}) {
  let jsFrameworks = [cwc.framework.Internal.EV3];
  let body = '';
  if (environ['currentView'] === '__python__') {
    jsFrameworks.push(cwc.framework.External.BRYTHON.CORE);
    jsFrameworks.push(cwc.framework.External.BRYTHON.STDLIB);
    body = '<script type="text/python">\n' +
      'from browser import window\n' +
      'ev3 = window.ev3\n' +
        editorContent[cwc.ui.EditorContent.PYTHON] + '\n' +
      '</script>' +
      '<script>' +
      '  window.ev3 = new cwc.framework.Ev3(function() {brython();});' +
      '</script>';
  } else {
    body = '\n<script>' +
      '  let code = function(ev3) {\n' +
      editorContent[cwc.ui.EditorContent.JAVASCRIPT] +
      '\n};\n' +
      '  new cwc.framework.Ev3(code);\n' +
      '</script>\n';
  }
  let header = rendererHelper.getJavaScriptURLs(
    jsFrameworks, environ['baseURL']);
  return rendererHelper.getHTMLRunner(body, header, environ);
};
