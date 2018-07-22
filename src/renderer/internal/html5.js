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
goog.require('cwc.config.framework.External');
goog.require('cwc.config.framework.Internal');
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

  /** @private {cwc.Cache} */
  this.cache_ = this.helper.getInstance('cache');

  /** @private {!Array} */
  this.frameworks_ = [
    cwc.config.framework.External.COFFEESCRIPT,
    cwc.config.framework.External.JQUERY.V3_X,
    cwc.config.framework.External.PHASER,
    cwc.config.framework.External.THREE_JS.CORE,
    cwc.config.framework.Internal.MESSENGER,
    cwc.config.framework.Internal.PHASER,
    cwc.config.framework.Internal.SIMPLE,
  ];
};


/**
 * Initializes and defines the HTML5 renderer.
 * @return {!Promise}
 */
cwc.renderer.internal.HTML5.prototype.init = function() {
  this.helper.getInstance('renderer').setRenderer(this.render.bind(this));
  return this.cache_.preloadFiles(this.frameworks_);
};


/**
 * @param {Object} editorContent
 * @param {!cwc.file.Files} libraryFiles
 * @param {cwc.renderer.Helper} rendererHelper
 * @param {Object=} environ
 * @return {string}
 * @export
 */
cwc.renderer.internal.HTML5.prototype.render = function(
    editorContent,
    libraryFiles,
    rendererHelper,
    environ = {}) {
  let css = editorContent[cwc.ui.EditorContent.CSS] || '';
  let html = editorContent[cwc.ui.EditorContent.HTML] ||
    editorContent[cwc.ui.EditorContent.DEFAULT] || '';
  let javascript = editorContent[cwc.ui.EditorContent.JAVASCRIPT] || '';
  let frameworks = [cwc.config.framework.Internal.MESSENGER];

  if (html) {
    // Library files.
    if (html.includes('{{ file:')) {
      html = rendererHelper.injectFiles(html, libraryFiles);
    }

    // Library urls.
    if (html.includes('{{ url:')) {
      html = rendererHelper.injectURLs(html, environ['baseURL']);
    }

    // Coffeescript framework.
    if (html.includes('text/coffeescript') ||
        html.includes('application/coffeescript')) {
      frameworks.push(cwc.config.framework.External.COFFEESCRIPT);
    }
  }

  if (javascript) {
    // Library files.
    if (javascript.includes('{{ file:')) {
      javascript = rendererHelper.injectFiles(javascript, libraryFiles);
    }

    // Library urls.
    if (javascript.includes('{{ url:')) {
      javascript = rendererHelper.injectURLs(javascript, environ['baseURL']);
    }
  }

  // Detect additional frameworks.
  let script = javascript || html || '';
  if (script) {
    // C64 screen
    if (script.startsWith('10 ')) {
      css = 'body {color: #6076c5; background: #20398d; font-size: 24px;' +
        'font-family: "Lucida Console"; padding: 20px;}';
      html = ' **** COMMODORE 64 BASIC V2 ****<br>' +
        '64K RAM SYSTEM  38911 BASIC BYTES FREE<br>' +
        'READY.<br><br>Nice try, clever clogs.<br>';
      javascript = '';
    }

    // Simple framework.
    if (script.includes('draw.') || script.includes('command.')) {
      frameworks.push(cwc.config.framework.Internal.SIMPLE);
    }

    // jQuery framework.
    if (script.includes('jQuery.') ||
        script.includes('jQuery(') ||
        script.includes('$(document).ready')) {
      frameworks.push(cwc.config.framework.External.JQUERY.V3_X);
    }

    // phaser.js
    if (script.includes('new Phaser.Game(')) {
      frameworks.push(cwc.config.framework.External.PHASER);
      if (script.includes('cwc.framework.Phaser.')) {
        frameworks.push(cwc.config.framework.Internal.PHASER);
      }
    }

    // three.js
    if (script.includes('new THREE.')) {
      frameworks.push(cwc.config.framework.External.THREE_JS.CORE);
    }
  }

  let header = rendererHelper.getCacheFilesHeader(frameworks, this.cache_);
  if (((css || javascript) && html) || (javascript && !html && !css)) {
    return rendererHelper.getHTML(html, header, css, javascript);
  }
  return rendererHelper.getRawHTML(html, header);
};
