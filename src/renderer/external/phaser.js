/**
 * @fileoverview Renderer for Phaser modification.
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
goog.provide('cwc.renderer.external.Phaser');

goog.require('cwc.ui.EditorContent');
goog.require('cwc.file.Files');
goog.require('cwc.framework.External');
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
cwc.renderer.external.Phaser = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;
};


/**
 * Initializes and defines the HTML5 renderer.
 */
cwc.renderer.external.Phaser.prototype.init = function() {
  let rendererInstance = this.helper.getInstance('renderer', true);
  rendererInstance.setServerMode(true);
  rendererInstance.setRenderer(this.render.bind(this));
};


/**
 * @param {Object} editorContent
 * @param {!cwc.file.Files} libraryFiles
 * @param {!cwc.file.Files} frameworks
 * @param {cwc.renderer.Helper} rendererHelper
 * @param {Object=} environ
 * @return {!string}
 * @export
 */
cwc.renderer.external.Phaser.prototype.render = function(
    editorContent,
    libraryFiles,
    frameworks,
    rendererHelper,
    environ = {}) {
  let body = '';
  let javascript = editorContent[cwc.ui.EditorContent.JAVASCRIPT] || '';
  if (javascript) {
    // Library files.
    if (javascript.includes('{{ file:')) {
      javascript = rendererHelper.injectFiles(javascript, libraryFiles);
    }

    // Cache and inject Library urls.
    if (javascript.includes('{{ url:')) {
      // body = rendererHelper.cacheURLs(javascript);
      javascript = rendererHelper.injectURLs(javascript);
    }
  }

 let header = rendererHelper.getJavaScriptURLs([
    cwc.framework.Internal.PHASER,
    cwc.framework.External.PHASER,
  ], environ['baseURL']);

  return rendererHelper.getJavaScript(javascript, header, body);
};
