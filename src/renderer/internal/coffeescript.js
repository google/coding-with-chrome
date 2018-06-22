/**
 * @fileoverview Renderer for Coffeescript modification.
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
goog.provide('cwc.renderer.internal.Coffeescript');

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
cwc.renderer.internal.Coffeescript = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @private {cwc.Cache} */
  this.cache_ = this.helper.getInstance('cache');

  /** @private {!Array} */
  this.frameworks_ = [
    cwc.framework.Internal.MESSENGER,
    cwc.framework.External.COFFEESCRIPT,
  ];
};


/**
 * Initializes and defines the Coffeescript renderer.
 * @return {!Promise}
 */
cwc.renderer.internal.Coffeescript.prototype.init = function() {
  this.helper.getInstance('renderer').setRenderer(this.render.bind(this));
  return this.cache_.preloadFiles(this.frameworks_);
};


/**
 * @param {Object} editorContent
 * @param {!cwc.file.Files} libraryFiles
 * @param {cwc.renderer.Helper} rendererHelper
 * @return {string}
 * @export
 */
cwc.renderer.internal.Coffeescript.prototype.render = function(
    editorContent,
    libraryFiles,
    rendererHelper) {
  let header = rendererHelper.getCacheFilesHeader(
    this.frameworks_, this.cache_);
  let body = '\n<script type="text/coffeescript">\n' +
    editorContent[cwc.ui.EditorContent.DEFAULT] + '\n</script>\n';
  return rendererHelper.getHTML(body, header);
};
