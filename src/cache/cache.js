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

  /** @private {number} */
  this.version = 8;

  /** @private {Object} */
  this.cache_ = {};

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
 * @async
 */
cwc.Cache.prototype.prepare = async function() {
  await this.database_.open(this.databaseConfig_);
  let version = await this.database_.get('__version__');
  await this.update(version);
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
  this.database_.clear();

  this.log_.info('Loading external frameworks ...');
  this.loadFiles(cwc.framework.External);

  this.log_.info('Loading internal frameworks ...');
  this.loadFiles(cwc.framework.Internal);

  this.log_.info('Loading Style Sheets ...');
  this.loadFiles(cwc.framework.StyleSheet);

  this.database_.add('__version__', this.version);
};


/**
 * Loads files into cache.
 * @param {!Object} files
 */
cwc.Cache.prototype.loadFiles = function(files) {
  for (let file of Object.keys(files)) {
    if (goog.isString(files[file])) {
      cwc.utils.Resources.getUriAsText('..' + files[file]).then((content) => {
        this.addFile(files[file], content);
      });
    } else {
      for (let subFile of Object.keys(files[file])) {
        cwc.utils.Resources.getUriAsText('..' + files[file][subFile]).then(
          (content) => {
            this.addFile(files[file][subFile], content);
        });
      }
    }
  }
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
  this.database_.add(name, content);
};


/**
 * @param {string} name
 * @return {Promise}
 */
cwc.Cache.prototype.getFile = function(name) {
  return this.database_.get(name);
};


/**
 * @param {string} name
 * @return {string}
 */
cwc.Cache.prototype.getPreloadedFile = function(name) {
  if (this.cache_[name] === undefined) {
    return '';
  }
  return this.cache_[name];
};


/**
 * @param {string} name
 * @return {Promise}
 */
cwc.Cache.prototype.preloadFile = function(name) {
  return new Promise((resolve, reject) => {
    if (this.cache_[name] !== undefined) {
      resolve();
    }

    this.database_.get(name).then((content) => {
      this.addContentToCache(name, content);
      resolve();
    }, reject);
  });
};


/**
 * @param {!Array} files
 * @return {!Promise}
 */
cwc.Cache.prototype.preloadFiles = function(files) {
  let promises = files.map(this.preloadFile.bind(this));
  return Promise.all(promises);
};


/**
 * @param {string} name
 * @param {string} content
 */
cwc.Cache.prototype.addContentToCache = function(name, content) {
  if (!content) {
    return;
  }

  let dataType = 'text/plain';
  let dataContent = '';
  if (name.endsWith('.js')) {
    dataType = 'text/javascript';
  } else if (name.endsWith('.css')) {
    dataType = 'text/css';
  } else if (name.endsWith('.html')) {
    dataType = 'text/html';
  }

  try {
    dataContent = 'data:' + dataType + ';base64,' + btoa(content);
  } catch (err) {
    dataContent = 'data:' + dataType + ';charset=utf-8,' +
      encodeURIComponent(content);
  }
  this.log_.info('Preloaded file', name);
  this.cache_[name] = dataContent;
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
  this.database_.add(filename, content, '__library__');
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
  return this.database_.get(filename, '__library__');
};


cwc.Cache.prototype.clearLibraryFiles = function() {
  return this.database_.clear('__library__');
};


/**
 * @param {string} content
 * @return {string}
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
