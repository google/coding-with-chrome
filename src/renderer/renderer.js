/**
 * @fileoverview Renderer for the Coding with Chrome editor.
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
};


/**
 * Loads framework into memory.
 * @param {!string} file Filename of the framework file.
 */
cwc.renderer.Renderer.prototype.loadFramework = function(file) {
  var fileLoaderInstance = this.helper.getInstance('fileLoader', true);
  fileLoaderInstance.getResourceFile(file, this.addFramework, this);
};


/**
 * @param {string!} name
 * @param {string!} content
 * @param {string=} opt_type
 */
cwc.renderer.Renderer.prototype.addFramework = function(name, content,
    opt_type) {
  var frameworkContent = this.rendererHelper.getDataUrl(content,
      'text/javascript');
  if (!frameworkContent) {
    console.error('Received empty content for framework', name);
    return;
  }

  var frameworkFile = this.frameworkFiles.addFile(name, frameworkContent,
      opt_type);
  if (!frameworkFile) {
    console.error('Was not able to add File', frameworkFile);
  } else {
    console.info('Add framework', name, frameworkFile.getSize());
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
  var editorInstance = this.helper.getInstance('editor', true);
  var fileInstance = this.helper.getInstance('file');
  if (fileInstance) {
    this.libraryFiles = fileInstance.getFiles();
  }

  return this.renderer(
      editorInstance.getEditorContent(),
      editorInstance.getEditorFlags(),
      this.libraryFiles,
      this.frameworkFiles,
      this.rendererHelper
  );
};


/**
 * @return {string} Data URL with the rendered content.
 */
cwc.renderer.Renderer.prototype.getContentUrl = function() {
  var content = this.getRenderedContent();
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
  var content = this.getRenderedPreview();
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
