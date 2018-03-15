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
goog.require('cwc.framework.External');
goog.require('cwc.framework.Internal');
goog.require('cwc.framework.StyleSheet');
goog.require('cwc.renderer.Helper');
goog.require('cwc.utils.Database');
goog.require('cwc.utils.Helper');
goog.require('cwc.utils.Logger');
goog.require('cwc.utils.Resources');


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
  this.styleSheetFiles = new cwc.file.Files();

  /** @type {!cwc.file.Files} */
  this.files = new cwc.file.Files();

  /** @type {!boolean} */
  this.serverMode_ = false;

  /** @private {cwc.utils.Database} */
  this.cache_ = new cwc.utils.Database(this.name);

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {!string} */
  this.version_ = '2';
};


/**
 * @return {Promise}
 */
cwc.renderer.Renderer.prototype.prepare = function() {
  return this.cache_.open().then(() => {
    this.cache_.getFile('__version__').then((version) => {
      this.updateCache(version);
    });
  });
};


/**
 * @param {!string|number} version
 */
cwc.renderer.Renderer.prototype.updateCache = function(version) {
  if (this.version_ >= version) {
    this.log_.info('No need for updates ...');
  }
  this.log_.info('Updating Cache to version', this.version_);

  this.log_.info('Loading external frameworks ...');
  this.loadFiles(cwc.framework.External);

  this.log_.info('Loading internal frameworks ...');
  this.loadFiles(cwc.framework.Internal);

  this.log_.info('Loading Style Sheets ...');
  this.loadStyleSheets(cwc.framework.StyleSheet);

  this.cache_.addFile('__version__', this.version_);
};


/**
 * Basic cache test.
 */
cwc.renderer.Renderer.prototype.test = function() {
  this.cache_.addFile('test', 'Hello World');
  this.cache_.getFile('test').then((result) => {
    console.log('db test', result);
  });
};


/**
 * Loads frameworks into cache.
 * @param {!Object} frameworks
 */
cwc.renderer.Renderer.prototype.loadFiles = function(frameworks) {
  let frameworkFiles = [];
  for (let framework of Object.keys(frameworks)) {
    if (goog.isString(frameworks[framework])) {
      frameworkFiles.push(frameworks[framework]);
    } else {
      for (let file of Object.keys(frameworks[framework])) {
        frameworkFiles.push(frameworks[framework][file]);
      }
    }
  }
  frameworkFiles.forEach((frameworkFile) => {
    cwc.utils.Resources.getUriAsText('../' + frameworkFile).then((content) => {
      this.addFile(frameworkFile, content, 'text/javascript');
    });
  });
};


/**
 * @param {string!} name
 * @param {string!} content
 * @param {string=} type
 * @param {boolean=} optimize
 */
cwc.renderer.Renderer.prototype.addFile = function(name, content,
    type = 'text/javascript', optimize = false) {
  if (!content) {
    this.log_.error('Received empty content for', name);
    return;
  }

  // Add file to server instance if available.
  let serverInstance = this.helper.getInstance('server');
  if (serverInstance) {
    serverInstance.addFile(name, content);
  }

  if (optimize && !name.includes('.min.') && content.length > 1000) {
    // Try to optimize unminimized code by removing comments and white-spaces.
    let originalContentLength = content.length;
    content = content.replace(/\\n\\n/g, '\\n')
      .replace(/ {4}/g, '  ')
      .replace(/[ \t]?\/\/.+?\\n/g, '')
      .replace(/[ \t]?\/\*.+?\*\/\\n/g, '')
      .replace(/[ \t]+\\n/g, '\\n')
      .replace(/(\\n){2,}/g, '\\n');
    if (originalContentLength > content.length) {
      let optimized = Math.ceil(((originalContentLength - content.length) /
          originalContentLength) * 100);
      if (optimized >= 5) {
        this.log_.info('Optimized content from', originalContentLength, 'to',
          content.length, 'by', optimized, '%');
      }
    }
  }

  let fileContent = this.rendererHelper.getDataUrl(content, type);
  if (!fileContent) {
    this.log_.error('Received empty file for', name);
    return;
  }
  this.cache_.addFile(name, fileContent);

  let file = this.files.addFile(name, fileContent);
  if (!file) {
    this.log_.error('Was not able to add File', file);
  } else {
    this.log_.info('Add framework', name, file.getSize());
  }
};


/**
 * @return {!cwc.file.Files}
 * @export
 */
cwc.renderer.Renderer.prototype.getFrameworks = function() {
  return this.files;
};


/**
 * Preloads Style Sheets into memory.
 * @param {!Object} frameworks
 */
cwc.renderer.Renderer.prototype.loadStyleSheets = function(frameworks) {
  let frameworkFiles = [];
  for (let framework of Object.keys(frameworks)) {
    if (goog.isString(frameworks[framework])) {
      frameworkFiles.push(frameworks[framework]);
    } else {
      for (let file of Object.keys(frameworks[framework])) {
        frameworkFiles.push(frameworks[framework][file]);
      }
    }
  }
  frameworkFiles.forEach((frameworkFile) => {
    cwc.utils.Resources.getUriAsText('../' + frameworkFile).then((content) => {
      this.addFile(frameworkFile, content, 'text/css');
    });
  });
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
    this.log_.error('Renderer is not an function !');
  }
  this.renderer = renderer;
};


/**
 * @param {!boolean} enable
 */
cwc.renderer.Renderer.prototype.setServerMode = function(enable) {
  this.serverMode_ = enable;
};


/**
 * Renders the JavaScript, CSS and HTML content together with all settings.
 * @return {!string}
 * @export
 */
cwc.renderer.Renderer.prototype.getRenderedContent = function() {
  let fileInstance = this.helper.getInstance('file');
  let libraryFiles = fileInstance ?
    fileInstance.getFiles() : new cwc.file.Files();
  let editorInstance = this.helper.getInstance('editor');
  let content = editorInstance.getEditorContent();
  if (!content) {
    this.log_.warn('Empty render content!');
  }

  let html = this.renderer(
      content,
      editorInstance.getEditorFlags(),
      libraryFiles,
      this.files,
      this.files,
      this.rendererHelper
  );

  if (this.serverMode_) {
    let serverInstance = this.helper.getInstance('server');
    if (serverInstance) {
      serverInstance.setPreview(html);
    }
  }

  return html || '';
};


/**
 * @return {string} Data URL with the rendered content.
 */
cwc.renderer.Renderer.prototype.getContentUrl = function() {
  let content = this.getRenderedContent();
  if (this.serverMode_) {
    let serverInstance = this.helper.getInstance('server');
    if (serverInstance) {
      return serverInstance.getPreviewURL();
    }
  }
  return this.rendererHelper.getDataUrl(content);
};


/**
 * @return {string} Rendered content as object.
 * @export
 */
cwc.renderer.Renderer.prototype.getObjectTag = function() {
  return this.rendererHelper.getObjectTag(this.getContentUrl());
};
