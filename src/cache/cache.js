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

  /** @private {!number} */
  this.version = 4;

  /** @private {!cwc.utils.Database} */
  this.database_ = new cwc.utils.Database(this.name, this.version);

  /** @private {!Object} */
  this.databaseConfig_ = {
    'objectStoreNames': ['__library__'],
  };

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * @return {Promise}
 */
cwc.Cache.prototype.prepare = function() {
  return this.database_.open(this.databaseConfig_).then(() => {
    this.database_.getFile('__version__').then((version) => {
      this.update(version);
    });
  });
};


/**
 * @param {!string|number} version
 */
cwc.Cache.prototype.update = function(version) {
  if (version && this.version <= version) {
    this.log_.info('No updates needed', version, '>=', this.version);
    return;
  }

  this.log_.info('Updating Cache to version', this.version);
  this.database_.clearFiles();

  this.log_.info('Loading external frameworks ...');
  this.loadFiles(cwc.framework.External);

  this.log_.info('Loading internal frameworks ...');
  this.loadFiles(cwc.framework.Internal);

  this.log_.info('Loading Style Sheets ...');
  this.loadFiles(cwc.framework.StyleSheet);

  this.database_.addFile('__version__', this.version);
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
    cwc.utils.Resources.getUriAsText('..' + file).then((content) => {
      this.addFile(file, content);
    });
  });
};


/**
 * @param {string!} name
 * @param {string!} content
 */
cwc.Cache.prototype.addFile = function(name, content) {
  if (!content) {
    this.log_.error('Received empty content for', name);
    return;
  }
  this.database_.addFile(name, content);
};


/**
 * @param {string} name
 * @return {Promise}
 */
cwc.Cache.prototype.getFile = function(name) {
  return this.database_.getFile(name);
};


/**
 * @param {string!} name
 * @param {string!} content
 */
cwc.Cache.prototype.addLibraryFile = function(name, content) {
  let filename = name.includes('/library/') ? name : '/library/' + name;
  if (content.includes('data:')) {
    content = atob(content.split(',')[1]);
  }
  this.database_.addFile(filename, content, '__library__');
};


/**
 * @param {string} name
 * @return {Promise}
 */
cwc.Cache.prototype.getLibraryFile = function(name) {
  let filename = name.includes('/library/') ? name : '/library/' + name;
  if (filename.includes('%20')) {
    filename = decodeURI(filename);
  }
  return this.database_.getFile(filename, '__library__');
};


cwc.Cache.prototype.clearLibraryFiles = function() {
  return this.database_.clearFiles('__library__');
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
