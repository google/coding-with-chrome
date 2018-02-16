/**
 * @fileoverview Renderer for HTML5 modification.
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
goog.provide('cwc.renderer.internal.HTML5');

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
cwc.renderer.internal.HTML5 = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;
};


/**
 * Initializes and defines the HTML5 renderer.
 */
cwc.renderer.internal.HTML5.prototype.init = function() {
  let renderer = this.render.bind(this);
  let rendererInstance = this.helper.getInstance('renderer', true);
  rendererInstance.setRenderer(renderer);
};


/**
 * @param {Object} editor_content
 * @param {Object} editor_flags
 * @param {!cwc.file.Files} libraryFiles
 * @param {!cwc.file.Files} frameworks
 * @param {!cwc.file.Files} styleSheets
 * @param {cwc.renderer.Helper} renderer_helper
 * @return {!string}
 * @export
 */
cwc.renderer.internal.HTML5.prototype.render = function(
    editor_content,
    editor_flags,
    libraryFiles,
    frameworks,
    styleSheets,
    renderer_helper) {
  let css = editor_content[cwc.ui.EditorContent.CSS] || '';
  let html = editor_content[cwc.ui.EditorContent.HTML] ||
    editor_content[cwc.ui.EditorContent.DEFAULT] || '';
  let javascript = editor_content[cwc.ui.EditorContent.JAVASCRIPT] || '';
  let headers = [];

  if (html) {
    // Library files.
    if (html.includes('{{ file:')) {
      html = renderer_helper.injectFiles(html, libraryFiles);
    }

    // Coffeescript framework.
    if (html.includes('text/coffeescript') ||
        html.includes('application/coffeescript')) {
      headers.push(cwc.framework.External.COFFEESCRIPT);
    }
  }

  if (javascript) {
    // Library files.
    if (javascript.includes('{{ file:')) {
      javascript = renderer_helper.injectFiles(javascript, libraryFiles);
    }
  }

  // Detect additional frameworks.
  let script = javascript || html || '';
  if (script) {
    // Simple framework.
    if (script.includes('draw.') || script.includes('command.')) {
      headers.push(cwc.framework.Internal.SIMPLE);
    }

    // jQuery framework.
    if (script.includes('jQuery.') ||
        script.includes('jQuery(') ||
        script.includes('$(document).ready')) {
      headers.push(cwc.framework.External.JQUERY.V3_X);
    }

    // phaser.js
    if (script.includes('new Phaser.Game(')) {
      headers.push(cwc.framework.External.PHASER);
      if (script.includes('cwc.framework.Phaser.')) {
        headers.push(cwc.framework.Internal.PHASER);
      }
    }

    // three.js
    if (script.includes('new THREE.')) {
      headers.push(cwc.framework.External.THREE_JS.CORE);
    }
  }

  let header = renderer_helper.getFrameworkHeaders(headers, frameworks);
  if (((css || javascript) && html) || (javascript && !html && !css)) {
    return renderer_helper.getHTML(html, header, css, javascript);
  }
  return renderer_helper.getRawHTML(html, header);
};
