/**
 * @fileoverview Cache for the Coding with Chrome editor.
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
goog.provide('cwc.Cache');

goog.require('cwc.framework.External');
goog.require('cwc.framework.Internal');
goog.require('cwc.framework.StyleSheet');
goog.require('cwc.renderer.Helper');
goog.require('cwc.utils.Database');
goog.require('cwc.utils.Logger');
goog.require('cwc.utils.Resources');
goog.require('cwc.utils.mime.getTypeByExtension');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.Cache = function(helper) {
  /** @type {string} */
  this.name = 'Cache';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.renderer.Helper} */
  this.rendererHelper = new cwc.renderer.Helper();

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
cwc.Cache.prototype.prepare = function() {
  return this.cache_.open().then(() => {
    this.cache_.getFile('__version__').then((version) => {
      this.update(version);
    });
  });
};


/**
 * @param {!string|number} version
 */
cwc.Cache.prototype.update = function(version) {
  if (this.version_ >= version) {
    this.log_.info('No need for updates ...');
  }
  this.log_.info('Updating Cache to version', this.version_);

  this.log_.info('Loading external frameworks ...');
  this.loadFiles(cwc.framework.External);

  this.log_.info('Loading internal frameworks ...');
  this.loadFiles(cwc.framework.Internal);

  this.log_.info('Loading Style Sheets ...');
  this.loadFiles(cwc.framework.StyleSheet);

  this.cache_.addFile('__version__', this.version_);
};


/**
 * Loads files into cache.
 * @param {!Object} files
 */
cwc.Cache.prototype.loadFiles = function(files) {
  let fileFiles = [];
  for (let file of Object.keys(files)) {
    if (goog.isString(files[file])) {
      fileFiles.push(files[file]);
    } else {
      for (let subFile of Object.keys(files[file])) {
        fileFiles.push(files[file][subFile]);
      }
    }
  }
  fileFiles.forEach((file) => {
    cwc.utils.Resources.getUriAsText('../' + file).then((content) => {
      this.addFile(file, content);
    });
  });
};


/**
 * @param {string!} name
 * @param {string!} content
 * @param {boolean=} optimize
 */
cwc.Cache.prototype.addFile = function(name, content, optimize = false) {
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
    content = cwc.Cache.optimizeContent(content);
    if (originalContentLength > content.length) {
      let optimized = Math.ceil(((originalContentLength - content.length) /
          originalContentLength) * 100);
      if (optimized >= 5) {
        this.log_.info('Optimized content from', originalContentLength, 'to',
          content.length, 'by', optimized, '%');
      }
    }
  }
  let mimeType = cwc.utils.mime.getTypeByExtension(name);
  let fileContent = this.rendererHelper.getDataUrl(content, mimeType);
  if (!fileContent) {
    this.log_.error('Received empty file for', name);
    return;
  }
  this.cache_.addFile(name, fileContent);
};


/**
 * @param {string} name
 * @return {Promise}
 */
cwc.Cache.prototype.getFile = function(name) {
  return this.cache_.getFile(name);
};


/**
 * @param {!string} content
 * @return {!string}
 */
cwc.Cache.optimizeContent = function(content) {
  if (content && content instanceof String) {
      return content.replace(/\\n\\n/g, '\\n')
        .replace(/ {4}/g, '  ')
        .replace(/[ \t]?\/\/.+?\\n/g, '')
        .replace(/[ \t]?\/\*.+?\*\/\\n/g, '')
        .replace(/[ \t]+\\n/g, '\\n')
        .replace(/(\\n){2,}/g, '\\n');
  }
  return content;
};
