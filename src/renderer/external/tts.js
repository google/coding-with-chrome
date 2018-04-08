/**
 * @fileoverview Renderer for the TTS (Text To Speech).
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
goog.provide('cwc.renderer.external.TTS');

goog.require('cwc.ui.EditorContent');
goog.require('cwc.file.Files');
goog.require('cwc.renderer.Helper');
goog.require('cwc.utils.Helper');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.renderer.external.TTS = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;
};


/**
 * Initializes and defines the TTS renderer.
 */
cwc.renderer.external.TTS.prototype.init = function() {
  this.helper.getInstance('renderer').setRenderer(this.render.bind(this));
};


/**
 * @param {Object} editorContent
 * @param {cwc.file.Files} libraryFiles
 * @param {!cwc.file.Files} frameworks
 * @param {cwc.renderer.Helper} rendererHelper
 * @return {string}
 * @export
 */
cwc.renderer.external.TTS.prototype.render = function(
    editorContent,
    libraryFiles,
    frameworks,
    rendererHelper) {
  let header = '';
  let runnerFramework = frameworks.getFile(this.runnerFramework);
  if (runnerFramework) {
    let runner = runnerFramework.getContent();
    header += '<script src="' + runner + '"></script>';
  }

  let ttsFramework = frameworks.getFile(this.customFramework);
  if (ttsFramework) {
    let tts = ttsFramework.getContent();
    header += '<script src="' + tts + '"></script>';
  }

  let body = '\n<script>' +
      '  let ttsCode = function(tts) {\n' +
      editorContent[cwc.ui.EditorContent.JAVASCRIPT] +
      '\n};\n' + '  let runner = new cwc.framework.Runner();\n' +
      '  let ttsFramework = new cwc.framework.TTS(runner);\n' +
      '  ttsFramework.listen(ttsCode);\n' +
      '</script>\n';

  return rendererHelper.getHTML(body, header);
};
