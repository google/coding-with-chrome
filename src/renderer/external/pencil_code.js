/**
 * @fileoverview Renderer for Pencil Code modification.
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
goog.provide('cwc.renderer.external.PencilCode');

goog.require('cwc.ui.EditorContent');
goog.require('cwc.file.Files');
goog.require('cwc.framework.External');
goog.require('cwc.renderer.Helper');
goog.require('cwc.utils.Helper');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.renderer.external.PencilCode = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @private {cwc.Cache} */
  this.cache_ = this.helper.getInstance('cache');

  /** @private {!Array} */
  this.frameworks_ = [
    cwc.framework.External.COFFEESCRIPT,
    cwc.framework.External.JQUERY.V2_2_4,
    cwc.framework.External.JQUERY_TURTLE,
    cwc.framework.Internal.MESSENGER,
  ];
};


/**
 * Initializes and defines the simple renderer.
 * @return {!Promise}
 */
cwc.renderer.external.PencilCode.prototype.init = function() {
  this.helper.getInstance('renderer').setRenderer(this.render.bind(this));
  return this.cache_.preloadFiles(this.frameworks_);
};


/**
 * @param {Object} editorContent
 * @param {!cwc.file.Files} libraryFiles
 * @param {cwc.renderer.Helper} rendererHelper
 * @return {!string}
 * @export
 */
cwc.renderer.external.PencilCode.prototype.render = function(
    editorContent,
    libraryFiles,
    rendererHelper) {
  let header = rendererHelper.getCacheFilesHeader(
    this.frameworks_, this.cache_);
  let body = '\n<script type="text/coffeescript">\n' +
    '$.turtle();\n' + editorContent[cwc.ui.EditorContent.COFFEESCRIPT] +
    '\n</script>\n';
  return rendererHelper.getHTMLGrid(body, header);
};
