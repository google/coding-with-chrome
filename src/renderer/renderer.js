/**
 * @fileoverview Renderer for the Coding with Chrome editor.
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
goog.provide('cwc.renderer.Renderer');

goog.require('cwc.file.Files');
goog.require('cwc.renderer.Helper');
goog.require('cwc.utils.Helper');

goog.require('goog.string');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.renderer.Renderer = function(helper) {
  /** @type {string} */
  this.name = 'Renderer';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {Function} */
  this.renderer = null;

  /** @type {!cwc.renderer.Helper} */
  this.rendererHelper = new cwc.renderer.Helper();

  /** @type {!cwc.file.Files} */
  this.frameworkFiles = new cwc.file.Files();

  /** @type {!cwc.file.Files} */
  this.libraryFiles = new cwc.file.Files();

  /** @type {!cwc.file.Files} */
  this.styleSheetFiles = new cwc.file.Files();
};


/**
 * Preloads frameworks into memory.
 * @param {!Object} frameworks Framework files.
 * @param {string=} opt_prefix_path
 */
cwc.renderer.Renderer.prototype.loadFrameworks = function(frameworks,
    opt_prefix_path = '') {
  let fileLoaderInstance = this.helper.getInstance('fileLoader', true);

  for (let framework of Object.keys(frameworks)) {
    if (goog.isString(frameworks[framework])) {
      fileLoaderInstance.getResourceFile(
        opt_prefix_path + frameworks[framework],
        this.addFramework.bind(this));
    } else {
      for (let file of Object.keys(frameworks[framework])) {
        fileLoaderInstance.getResourceFile(
          opt_prefix_path + frameworks[framework][file],
          this.addFramework.bind(this));
      }
    }
  }
};


/**
 * @param {string!} name
 * @param {string!} content
 * @param {string=} type
 */
cwc.renderer.Renderer.prototype.addFramework = function(name, content, type) {
  let fileContent = this.rendererHelper.getDataUrl(content, 'text/javascript');
  if (!fileContent) {
    console.error('Received empty content for framework', name);
    return;
  }

  let file = this.frameworkFiles.addFile(name, fileContent, type);
  if (!file) {
    console.error('Was not able to add File', file);
  } else {
    console.info('Add framework', name, file.getSize());
  }
};


/**
 * @return {!cwc.file.Files}
 * @export
 */
cwc.renderer.Renderer.prototype.getFrameworks = function() {
  return this.frameworkFiles;
};


/**
 * Preloads Style Sheets into memory.
 * @param {!Object} styleSheets
 * @param {string=} opt_prefix_path
 */
cwc.renderer.Renderer.prototype.loadStyleSheets = function(styleSheets,
    opt_prefix_path = '') {
  let fileLoaderInstance = this.helper.getInstance('fileLoader', true);

  for (let stylesheet of Object.keys(styleSheets)) {
    if (goog.isString(styleSheets[stylesheet])) {
      fileLoaderInstance.getResourceFile(
        opt_prefix_path + styleSheets[stylesheet],
        this.addStyleSheet.bind(this));
    } else {
      for (let file of Object.keys(styleSheets[stylesheet])) {
        fileLoaderInstance.getResourceFile(
          opt_prefix_path + styleSheets[stylesheet][file],
          this.addStyleSheet.bind(this));
      }
    }
  }
};


/**
 * @param {string!} name
 * @param {string!} content
 * @param {string=} type
 */
cwc.renderer.Renderer.prototype.addStyleSheet = function(name, content, type) {
  let fileContent = this.rendererHelper.getDataUrl(content, 'text/css');
  if (!fileContent) {
    console.error('Received empty content for Style Sheet', name);
    return;
  }

  let file = this.styleSheetFiles.addFile(name, fileContent, type);
  if (!file) {
    console.error('Was not able to add File', file);
  } else {
    console.info('Add framework', name, file.getSize());
  }
};


/**
 * @return {!cwc.file.Files}
 * @export
 */
cwc.renderer.Renderer.prototype.getStyleSheets = function() {
  return this.styleSheetFiles;
};


/**
 * @return {!cwc.renderer.Helper}
 * @export
 */
cwc.renderer.Renderer.prototype.getRendererHelper = function() {
  return this.rendererHelper;
};


/**
 * Sets the renderer for the content.
 * @param {Function} renderer
 * @export
 */
cwc.renderer.Renderer.prototype.setRenderer = function(renderer) {
  if (!goog.isFunction(renderer)) {
    console.error('Renderer is not an function !');
  }
  this.renderer = renderer;
};


/**
 * Renders the JavaScript, CSS and HTML content together with all settings.
 * @param {boolean=} opt_preview_mode
 * @return {string}
 * @export
 */
cwc.renderer.Renderer.prototype.getRenderedContent = function(
    opt_preview_mode) {
  let editorInstance = this.helper.getInstance('editor', true);
  let fileInstance = this.helper.getInstance('file');
  if (fileInstance) {
    this.libraryFiles = fileInstance.getFiles();
  }
  let content = editorInstance.getEditorContent();
  if (!content) {
    console.warn('Empty render content!');
  }

  return this.renderer(
      content,
      editorInstance.getEditorFlags(),
      this.libraryFiles,
      this.frameworkFiles,
      this.styleSheetFiles,
      this.rendererHelper
  );
};


/**
 * @return {string} Data URL with the rendered content.
 */
cwc.renderer.Renderer.prototype.getContentUrl = function() {
  let content = this.getRenderedContent();
  return this.rendererHelper.getDataUrl(content);
};


/**
 * Gets preview code.
 * @return {string}
 */
cwc.renderer.Renderer.prototype.getRenderedPreview = function() {
  return this.getRenderedContent(true);
};


/**
 * @return {string} Rendered content as data url.
 */
cwc.renderer.Renderer.prototype.getPreviewUrl = function() {
  let content = this.getRenderedPreview();
  if (content) {
    return this.rendererHelper.getDataUrl(content);
  } else {
    console.error('Was not able to get preview URL: ' + content);
  }
  return '';
};


/**
 * @return {string} Rendered content as object.
 * @export
 */
cwc.renderer.Renderer.prototype.getObjectTag = function() {
  return this.rendererHelper.getObjectTag(this.getContentUrl());
};
