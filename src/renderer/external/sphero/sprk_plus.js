/**
 * @fileoverview Sphero SPRK+ renderer.
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
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.provide('cwc.renderer.external.sphero.SprkPlus');

goog.require('cwc.ui.EditorContent');
goog.require('cwc.file.Files');
goog.require('cwc.config.framework.Internal');
goog.require('cwc.renderer.Helper');
goog.require('cwc.utils.Helper');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.renderer.external.sphero.SprkPlus = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!Array} */
  this.pythonMapping = [
    'sprkPlus = window.sprkPlus',
  ];

  /** @private {!Array} */
  this.frameworks_ = [cwc.config.framework.Internal.SPHERO_SPRK_PLUS];
};


/**
 * Initializes and defines the Sphero renderer.
 * @return {!Promise}
 */
cwc.renderer.external.sphero.SprkPlus.prototype.init = function() {
  return this.helper.getInstance('renderer')
    .setServerMode(true)
    .setRenderer(this.render.bind(this));
};


/**
 * @param {Object} editorContent
 * @param {cwc.file.Files} libraryFiles
 * @param {cwc.renderer.Helper} rendererHelper
 * @param {Object=} environ
 * @return {string}
 * @export
 */
cwc.renderer.external.sphero.SprkPlus.prototype.render = function(
    editorContent,
    libraryFiles,
    rendererHelper,
    environ = {}) {
  let content = '';
  if (environ['currentView'] === '__python__') {
    content = this.pythonMapping.join('\n') + '\n';
    content += editorContent[cwc.ui.EditorContent.PYTHON];
  } else {
    content = editorContent[cwc.ui.EditorContent.JAVASCRIPT];
  }
  return rendererHelper.getRunner(content, this.frameworks_, environ);
};
