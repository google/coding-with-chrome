/**
 * @fileoverview Renderer for the TTS (Text To Speech).
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
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

goog.require('cwc.file.ContentType');
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
  var rendererInstance = this.helper.getInstance('renderer', true);
  var renderer = this.render.bind(this);
  rendererInstance.setRenderer(renderer);
};


/**
 * @param {Object} editor_content
 * @param {Object} editor_flags
 * @param {cwc.file.Files} library_files
 * @param {cwc.file.Files} frameworks
 * @param {cwc.renderer.Helper} renderer_helper
 * @return {string}
 * @export
 */
cwc.renderer.external.TTS.prototype.render = function(
    editor_content,
    editor_flags,
    library_files,
    frameworks,
    renderer_helper) {

  var header = '';
  var runnerFramework = frameworks.getFile(this.runnerFramework);
  if (runnerFramework) {
    var runner = runnerFramework.getContent();
    header += '<script src="' + runner + '"></script>';
  }

  var ttsFramework = frameworks.getFile(this.customFramework);
  if (ttsFramework) {
    var tts = ttsFramework.getContent();
    header += '<script src="' + tts + '"></script>';
  }

  var body = '\n<script>' +
      '  var ttsCode = function(tts) {\n' +
      editor_content[cwc.file.ContentType.JAVASCRIPT] +
      '\n};\n' + '  var ttsRunner = new cwc.framework.Runner();\n' +
      '  var ttsFramework = new cwc.framework.TTS(spheroRunner);\n' +
      '  ttsFramework.listen(ttsCode);\n' +
      '</script>\n';

  var html = renderer_helper.getHTML(body, header);
  return html;
};
