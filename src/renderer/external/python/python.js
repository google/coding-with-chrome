/**
 * @fileoverview Renderer for Python 2.x and 3.x.
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
goog.provide('cwc.renderer.external.Python');

goog.require('cwc.file.Files');
goog.require('cwc.config.framework.External');
goog.require('cwc.config.framework.Internal');
goog.require('cwc.config.framework.StyleSheet');
goog.require('cwc.renderer.Helper');
goog.require('cwc.ui.EditorContent');
goog.require('cwc.utils.Helper');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.renderer.external.Python = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @private {cwc.Cache} */
  this.cache_ = this.helper.getInstance('cache');
};


/**
 * Initializes and defines the simple renderer.
 * @return {!Promise}
 */
cwc.renderer.external.Python.prototype.init = function() {
  let rendererInstance = this.helper.getInstance('renderer');
  rendererInstance.setServerMode(true);
  return rendererInstance.setRenderer(this.render.bind(this));
};


/**
 * @param {Object} editorContent
 * @param {!cwc.file.Files} libraryFiles
 * @param {cwc.renderer.Helper} rendererHelper
 * @return {string}
 * @export
 */
cwc.renderer.external.Python.prototype.render = function(
    editorContent,
    libraryFiles,
    rendererHelper) {
  let content = editorContent[cwc.ui.EditorContent.DEFAULT] || '';

  // Python 2.x handling.
  if (content.includes('#!/usr/bin/python2.') ||
      content.includes('print \'')) {
    return this.renderPython2(content, rendererHelper);
  }

  // Python 3.x as default
  let header = rendererHelper.getJavaScriptURLs([
    cwc.config.framework.External.BRYTHON.CORE,
    cwc.config.framework.External.BRYTHON.STDLIB,
    cwc.config.framework.Internal.PYTHON3,
  ]);
  header += rendererHelper.getStyleSheetURL(
    /** @type {string} */ (cwc.config.framework.StyleSheet.DIALOG));
  let body = '<div id="container"></div>' +
  // '<script>__BRYTHON__.has_indexedDB = false</script>' +
  '<script id="code" type="text/python">\n' + content +'\n</script>\n' +
  '<script>new cwc.framework.Python3().run();</script>';

  return rendererHelper.getHTML(body, header);
};


/**
 * @param {string} content
 * @param {cwc.renderer.Helper} rendererHelper
 * @return {string}
 * @export
 */
cwc.renderer.external.Python.prototype.renderPython2 = function(
    content, rendererHelper) {
  let header = rendererHelper.getJavaScriptURLs([
    cwc.config.framework.External.JQUERY.V2_2_4,
    cwc.config.framework.External.SKULPT.CORE,
    cwc.config.framework.External.SKULPT.STDLIB,
    cwc.config.framework.Internal.PYTHON2,
  ]);
  header += rendererHelper.getStyleSheetURL(
    /** @type {string} */ (cwc.config.framework.StyleSheet.DIALOG));
  let body = '<div id="content"></div>' +
  '<script id="code" type="text/python">\n' +
    content +
  '\n</script>\n<script>new cwc.framework.Python2().run();</script>';

  return rendererHelper.getHTML(body, header);
};
