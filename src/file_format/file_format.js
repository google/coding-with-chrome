/**
 * @fileoverview Custom File format for Coding with Chrome.
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
goog.provide('cwc.fileFormat.FILE_HEADER');
goog.provide('cwc.fileFormat.FILE_VERSION');
goog.provide('cwc.fileFormat.File');

goog.require('cwc.file.Files');
goog.require('cwc.mode.Type');
goog.require('cwc.ui.EditorContent');
goog.require('cwc.utils.Logger');


/**
 * The cwc format header for identification.
 * @const {!string}
 */
cwc.fileFormat.FILE_HEADER = 'Coding with Chrome File Format';


/**
 * The cwc format header for identification.
 * @const {!number}
 */
cwc.fileFormat.FILE_VERSION = 3.0;


/**
 * @constructor
 * @param {string=} content
 * @struct
 * @final
 */
cwc.fileFormat.File = function(content = '') {
  /** @type {string} */
  this.name = 'Chrog format';

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {!cwc.file.Files} */
  this.content_ = new cwc.file.Files();

  /** @private {string} */
  this.format_ = cwc.fileFormat.FILE_HEADER + ' ' + cwc.fileFormat.FILE_VERSION;

  /** @private {!cwc.file.Files} */
  this.files_ = new cwc.file.Files();

  /** @private {!Object.<string>|string} */
  this.flags_ = {};

  /** @private {!cwc.file.Files} */
  this.frameworks_ = new cwc.file.Files();

  /** @private {string} */
  this.history_ = '';

  /** @private {!Object} */
  this.metadata_ = {};

  /** @private {!cwc.mode.Type} */
  this.mode_ = cwc.mode.Type.NONE;

  /** @private {string} */
  this.ui_ = 'default';

  /** @private {!cwc.ui.EditorContent} */
  this.view_ = cwc.ui.EditorContent.NONE;

  /** @private {!string} */
  this.metedataNamespace_ = '__default__';

  if (content) {
    this.loadJSON(content);
  }
};


/**
 * Initializes the file data with default values.
 * @param {boolean=} silent
 */
cwc.fileFormat.File.prototype.init = function(silent = false) {
  if (!silent) {
    this.log_.info('Clearing existing file information...');
  }
  this.content_ = new cwc.file.Files();
  this.files_ = new cwc.file.Files();
  this.flags_ = {};
  this.frameworks_ = new cwc.file.Files();
  this.history_ = '';
  this.metadata_ = {};
  this.mode_ = cwc.mode.Type.NONE;
  this.ui_ = 'default';
  this.view_ = cwc.ui.EditorContent.NONE;
};


/**
 * @param {!string} author
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.File.prototype.setAuthor = function(author) {
  return this.setMetadata('author', author);
};


/**
 * @return {string}
 */
cwc.fileFormat.File.prototype.getAuthor = function() {
  return this.getMetadata('author');
};


/**
 * @param {string} name
 * @param {string=} group
 * @return {boolean}
 */
cwc.fileFormat.File.prototype.hasContent = function(name, group) {
  if (name) {
    return this.content_.hasFile(name, group);
  }
  return this.content_.hasFiles();
};


/**
 * @param {string} name
 * @param {string=} group
 * @return {string}
 */
cwc.fileFormat.File.prototype.getContent = function(name, group) {
  return this.content_.getFileContent(name, group) || '';
};


/**
 * @param {!string} name
 * @param {!string} content
 * @param {string=} type
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.File.prototype.setContent = function(name, content, type) {
  this.content_.addFile(name, content, type);
  return this;
};


/**
 * @param {!Object} data
 */
cwc.fileFormat.File.prototype.setContentData = function(data) {
  this.log_.debug('setContentData:', data);
  this.content_.setData(data);
};


/**
 * @return {Object}
 */
cwc.fileFormat.File.prototype.getContentData = function() {
  return this.content_.getFiles();
};


/**
 * @param {!string} description
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.File.prototype.setDescription = function(description) {
  return this.setMetadata('description', description);
};


/**
 * @return {string}
 */
cwc.fileFormat.File.prototype.getDescription = function() {
  return this.getMetadata('description');
};


/**
 * @param {string} name
 * @param {string=} group
 * @return {string}
 */
cwc.fileFormat.File.prototype.getFileContent = function(name, group) {
  return this.files_.getFileContent(name, group) || '';
};


/**
 * @param {!cwc.file.Files} files
 */
cwc.fileFormat.File.prototype.setFiles = function(files) {
  this.log_.debug('setFiles:', files);
  this.files_ = files;
};


/**
 * @param {!Object} data
 */
cwc.fileFormat.File.prototype.setFilesData = function(data) {
  this.log_.debug('setFilesData:', data);
  this.files_.setData(data);
};


/**
 * @return {Object}
 */
cwc.fileFormat.File.prototype.getFileData = function() {
  return this.files_.getFiles();
};


/**
 * @return {!cwc.file.Files}
 */
cwc.fileFormat.File.prototype.getFiles = function() {
  return this.files_;
};


/**
 * @return {!boolean}
 */
cwc.fileFormat.File.prototype.hasFiles = function() {
  return this.files_.hasFiles();
};


/**
 * @param {!string} name
 * @return {Object.<string>|string}
 */
cwc.fileFormat.File.prototype.getFlag = function(name) {
  return this.flags_[name] || '';
};


/**
 * @return {!Object.<string>|string}
 */
cwc.fileFormat.File.prototype.getFlags = function() {
  return this.flags_;
};


/**
 * @param {!string} name
 * @param {Object.<string>|string} value
 */
cwc.fileFormat.File.prototype.setFlag = function(name, value) {
  this.flags_[name] = value;
};


/**
 * @param {!cwc.file.Files} frameworks
 */
cwc.fileFormat.File.prototype.setFrameworks = function(frameworks) {
  this.frameworks_ = frameworks;
  this.log_.debug('setFrameworks:', frameworks);
};


/**
 * @return {cwc.file.Files}
 */
cwc.fileFormat.File.prototype.getFrameworks = function() {
  return this.frameworks_;
};


/**
 * @param {!string} name
 * @param {string=} namespace
 * @return {!string|Array}
 */
cwc.fileFormat.File.prototype.getMetadata = function(
    name, namespace = this.metedataNamespace_) {
  if (!(namespace in this.metadata_) ||
      (name && !(name in this.metadata_[namespace]))) {
    this.log_.warn('Unknown meta data', namespace + (name ? '.' + name : ''));
    return '';
  }
  if (name) {
    return this.metadata_[namespace][name];
  } else {
    return this.metadata_[namespace];
  }
};


/**
 * @param {!string} name
 * @param {!string} value
 * @param {string=} namespace
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.File.prototype.setMetadata = function(name, value,
    namespace = this.metedataNamespace_) {
  if (!(namespace in this.metadata_)) {
    this.metadata_[namespace] = {};
  }
  this.metadata_[namespace][name] = value;
  return this;
};


/**
 * @param {!cwc.mode.Type} mode
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.File.prototype.setMode = function(mode) {
  this.mode_ = mode;
  return this;
};


/**
 * @return {!cwc.mode.Type}
 */
cwc.fileFormat.File.prototype.getMode = function() {
  return this.mode_;
};


/**
 * @param {!string} model
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.File.prototype.setModel = function(model) {
  return this.setMetadata('model', model);
};


/**
 * @return {string}
 */
cwc.fileFormat.File.prototype.getModel = function() {
  return this.getMetadata('model');
};


/**
 * @param {!string} ui
 * @param {boolean=} opt_no_overwrite
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.File.prototype.setUi = function(ui, opt_no_overwrite) {
  if (!opt_no_overwrite || (opt_no_overwrite && !this.ui_)) {
    this.log_.debug('setUi:', ui);
    this.ui_ = ui;
  }
  return this;
};


/**
 * @return {string}
 */
cwc.fileFormat.File.prototype.getUi = function() {
  return this.ui_;
};


/**
 * @param {!string} title
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.File.prototype.setTitle = function(title) {
  return this.setMetadata('title', title);
};


/**
 * @return {string}
 */
cwc.fileFormat.File.prototype.getTitle = function() {
  return this.getMetadata('title');
};


/**
 * @param {string=} language
 * @return {Object}
 */
cwc.fileFormat.File.prototype.getTour = function(language = 'eng') {
  let tour = this.getMetadata('', '__tour__');
  let userLanguage = language;
  if (tour) {
    if (!tour[userLanguage]) {
      this.log_.warn('Tour is not available in user\'s language', language);
      userLanguage = 'eng';
    }
    if (tour[userLanguage]) {
      return tour[userLanguage];
    }
  }
  return null;
};


/**
 * @param {string=} language
 * @return {Object}
 */
cwc.fileFormat.File.prototype.getTutorial = function(language = 'eng') {
  let tutorial = this.getMetadata('', '__tutorial__');
  let userLanguage = language;
  if (tutorial) {
    if (!tutorial[userLanguage]) {
      this.log_.warn('Tutorial is not available in user\'s language', language);
      userLanguage = 'eng';
    }
    if (tutorial[userLanguage]) {
      return tutorial[userLanguage];
    }
  }
  return null;
};


/**
 * @param {!string} version
 * @return {cwc.fileFormat.File}
 */
cwc.fileFormat.File.prototype.setVersion = function(version) {
  return this.setMetadata('version', version);
};


/**
 * @return {string}
 */
cwc.fileFormat.File.prototype.getVersion = function() {
  return this.getMetadata('version');
};


/**
 * @param {!string} history
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.File.prototype.setHistory = function(history) {
  this.history_ = history;
  return this;
};


/**
 * @return {string}
 */
cwc.fileFormat.File.prototype.getHistory = function() {
  return this.history_;
};


/**
 * @param {!cwc.ui.EditorContent} view
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.File.prototype.setView = function(view) {
  this.view_ = view;
  return this;
};


/**
 * @return {!cwc.ui.EditorContent}
 */
cwc.fileFormat.File.prototype.getView = function() {
  return this.view_;
};


/**
 * Loads the defined JSON data and sets the supported options.
 * @param {string} data JSON data.
 */
cwc.fileFormat.File.prototype.loadJSON = function(data) {
  cwc.fileFormat.File.loadJSON(this, data);
};


/**
 * @return {!Object}
 */
cwc.fileFormat.File.prototype.toJSON = function() {
  console.log(cwc.fileFormat.File.toJSON(this));
  return cwc.fileFormat.File.toJSON(this);
};


/**
 * @return {!string}
 */
cwc.fileFormat.File.prototype.getJSON = function() {
  return JSON.stringify(this.toJSON(), null, 2) || '';
};


/**
 * @return {!number}
 */
cwc.fileFormat.File.prototype.getFileFormatVersion = function() {
  return cwc.fileFormat.File.getFileHeaderVersion(this.format_);
};


/**
 * @param {!string} header
 * @return {boolean}
 */
cwc.fileFormat.File.hasFileHeader = function(header) {
  if (header && header.includes(cwc.fileFormat.FILE_HEADER)) {
    return true;
  }
  return false;
};


/**
 * @param {!string} header
 * @return {number}
 */
cwc.fileFormat.File.getFileHeaderVersion = function(header) {
  if (cwc.fileFormat.File.hasFileHeader(header)) {
    return Number(header.replace(cwc.fileFormat.FILE_HEADER + ' ', '')) || 0;
  }
  return 0;
};


/**
 * Loads the defined JSON data and sets the supported options.
 * @param {!cwc.fileFormat.File} file
 * @param {!string} data
 */
cwc.fileFormat.File.loadJSON = function(file, data) {
  let jsonData = data;
  if (typeof data != 'object') {
    try {
      jsonData = JSON.parse(data);
    } catch (error) {
      throw new Error('Was not able to parse JSON: ' + error.message +
        '\ndata:' + data);
    }
  }
  if (!jsonData || !cwc.fileFormat.File.hasFileHeader(jsonData['format'])) {
    throw new Error('File format: ' + jsonData['format'] + ' is not support!');
  }

  // File format version handling
  let fileFormatVersion = cwc.fileFormat.File.getFileHeaderVersion(
    jsonData['format']);
  if (fileFormatVersion === 0) {
    throw new Error('Unknown file format version', fileFormatVersion);
  } else if (fileFormatVersion < cwc.fileFormat.FILE_VERSION) {
    file.log_.warn('Loading legacy file format version', fileFormatVersion);
  } else if (fileFormatVersion > cwc.fileFormat.FILE_VERSION) {
    file.log_.error('File format version', fileFormatVersion,
      'is not supported by the current version. Please update ...');
  }
  file.log_.info('Loading JSON data with', Object.keys(jsonData).length,
    'entries');
  file.init(true);

  // Handle content entries.
  if (jsonData['content']) {
    if (fileFormatVersion === 1) {
      // Handle legacy file format 1.0
      for (let entry in jsonData['content']) {
        if (Object.prototype.hasOwnProperty.call(
            jsonData['content'], entry)) {
          let name = entry;
          switch (entry) {
            case 'coffeescript':
              name = cwc.ui.EditorContent.COFFEESCRIPT;
              break;
            case 'css':
              name = cwc.ui.EditorContent.CSS;
              break;
            case 'html':
              name = cwc.ui.EditorContent.HTML;
              break;
            case 'javascript':
              name = cwc.ui.EditorContent.JAVASCRIPT;
              break;
            case 'pencil_code':
              name = cwc.ui.EditorContent.PENCIL_CODE;
              break;
            case 'python':
              name = cwc.ui.EditorContent.PYTHON;
              break;
          }
          file.log_.info('Convert legacy content', entry, 'to', name);
          file.setContent(name, jsonData['content'][entry]);
        }
      }
    } else {
      // Handle current file format
      file.setContentData(jsonData['content']);
    }
  }

  /**
   * Handling of additional fields.
   */
  if (jsonData['flags']) {
    for (let flag in jsonData['flags']) {
      if (Object.prototype.hasOwnProperty.call(jsonData['flags'], flag)) {
        file.setFlag(flag, jsonData['flags'][flag]);
      }
    }
  }
  if (jsonData['mode']) {
    file.setMode(
      /** @type {cwc.mode.Type} */ (decodeURIComponent(jsonData['mode'])));
  }
  if (jsonData['ui']) {
    file.setUi(decodeURIComponent(jsonData['ui']));
  }
  if (jsonData['frameworks']) {
    file.setFrameworks(jsonData['frameworks']);
  }
  if (jsonData['files']) {
    file.setFilesData(jsonData['files']);
  }
  if (jsonData['history']) {
    file.setHistory(jsonData['history']);
  }
  if (jsonData['metadata']) {
    file.metadata_ = jsonData['metadata'];
  }
  if (jsonData['view']) {
    file.setView(jsonData['view']);
  }

  /**
   * Handling of deprecated fields for file format < 3.0
   */
  if (fileFormatVersion < 3) {
    if (jsonData['author']) {
      file.setAuthor(decodeURIComponent(jsonData['author']));
    }
    if (jsonData['description']) {
      file.setDescription(decodeURIComponent(jsonData['description']));
    }
    if (jsonData['model']) {
      file.setModel(decodeURIComponent(jsonData['model']));
    }
    if (jsonData['title']) {
      file.setTitle(decodeURIComponent(jsonData['title']));
    }
    if (jsonData['version']) {
      file.setVersion(decodeURIComponent(jsonData['version']));
    }
  }
};


/**
 * @param {!cwc.fileFormat.File} file
 * @return {!Object}
 */
cwc.fileFormat.File.toJSON = function(file) {
  return {
    'content': file.content_.toJSON(),
    'files': file.files_.toJSON(),
    'flags': file.flags_,
    'format': file.format_,
    'frameworks': file.frameworks_,
    'history': file.history_,
    'metadata': file.metadata_,
    'mode': file.mode_,
    'ui': file.ui_,
    'view': file.view_,
  };
};
