/**
 * @fileoverview Sphero renderer.
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
goog.provide('cwc.renderer.external.Sphero');

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
cwc.renderer.external.Sphero = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;
};


/**
 * Initializes and defines the Sphero renderer.
 */
cwc.renderer.external.Sphero.prototype.init = function() {
  let rendererInstance = this.helper.getInstance('renderer', true);
  let renderer = this.render.bind(this);
  rendererInstance.setRenderer(renderer);
  rendererInstance.setServerMode(true);
};


/**
 * @param {Object} editorContent
 * @param {cwc.file.Files} libraryFiles
 * @param {!cwc.file.Files} frameworks
 * @param {cwc.renderer.Helper} rendererHelper
 * @return {string}
 * @export
 */
cwc.renderer.external.Sphero.prototype.render = function(
    editorContent,
    libraryFiles,
    frameworks,
    rendererHelper) {
  let content = editorContent[cwc.ui.EditorContent.JAVASCRIPT].trim();

  if (content.startsWith('#!/usr/bin/python')) {
    // Strip shebang
    content = content.replace(/^#!.*/, '');
    return this.renderPython(content, frameworks, rendererHelper);
  }

  return this.renderJavaScript(content, frameworks, rendererHelper);
};

/**
 * @param {string} content
 * @param {!cwc.file.Files} frameworks
 * @param {cwc.renderer.Helper} rendererHelper
 * @return {string}
 */
cwc.renderer.external.Sphero.prototype.renderJavaScript = function(
    content,
    frameworks,
    rendererHelper) {
  let header = rendererHelper.getJavaScriptURLs([
    cwc.framework.Internal.SPHERO
  ]);

  let body = `
<script>
let code = function(sphero) {
${content}
};
new cwc.framework.Sphero(code);
</script>
  `;

  return rendererHelper.getHTML(body, header);
};

/**
 * @param {string} content
 * @param {!cwc.file.Files} frameworks
 * @param {cwc.renderer.Helper} rendererHelper
 * @return {string}
 */
cwc.renderer.external.Sphero.prototype.renderPython = function(
    content,
    frameworks,
    rendererHelper) {
  let header = rendererHelper.getJavaScriptURLs([
    cwc.framework.Internal.SPHERO,
    cwc.framework.External.BRYTHON.CORE,
    cwc.framework.External.BRYTHON.STDLIB,
    cwc.framework.Internal.PYTHON3,
  ]);

  let body = `
<script id="code" type="text/python">
from browser import window
sphero = window.python.sphero
${content}
</script>
<script>
let code = function(sphero) {
  window.python = window.python || {};
  window.python.sphero = sphero;
  console.log(sphero);
  new cwc.framework.Python3().run();
};
new cwc.framework.Sphero(code);
</script>
  `;

  return rendererHelper.getHTML(body, header);
};
