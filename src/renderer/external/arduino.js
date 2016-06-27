/**
 * @fileoverview Arduino renderer.
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
goog.provide('cwc.renderer.external.Arduino');

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
cwc.renderer.external.Arduino = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.customFramework = 'arduino_framework.js';

  /** @type {string} */
  this.runnerFramework = 'runner_framework.js';
};


/**
 * Initializes and defines the Arduino renderer.
 */
cwc.renderer.external.Arduino.prototype.init = function() {
  var rendererInstance = this.helper.getInstance('renderer', true);
  var renderer = this.render.bind(this);
  rendererInstance.setRenderer(renderer);
};


/**
 * Arduino render logic.
 * @param {Object} editor_content
 * @param {Object} editor_flags
 * @param {cwc.file.Files} library_files
 * @param {cwc.file.Files} frameworks
 * @param {cwc.renderer.Helper} renderer_helper
 * @return {string}
 * @export
 */
cwc.renderer.external.Arduino.prototype.render = function(
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

  var customFramework = frameworks.getFile(this.customFramework);
  if (customFramework) {
    header += '<script src="' + customFramework.getContent() + '"></script>';
  }

  var body = '\n<script>' +
      '  var customCode = function(arduino) {\n' +
      editor_content[cwc.file.ContentType.CUSTOM] +
      '\n};\n' + '  var runner = new cwc.framework.Runner();\n' +
      '  var customFramework = new cwc.framework.Arduino(runner);\n' +
      '  customFramework.listen(customCode);\n' +
      '</script>\n';

  return renderer_helper.getHTML(body, header);
};
