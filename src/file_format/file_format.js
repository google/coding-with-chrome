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
goog.require('cwc.file.MimeType');
goog.require('cwc.file.Type');
goog.require('cwc.ui.EditorFlags');
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
cwc.fileFormat.FILE_VERSION = 2.0;


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

  /** @private {string} */
  this.author_ = '';

  /** @private {!cwc.file.Files} */
  this.content_ = new cwc.file.Files();

  /** @private {string} */
  this.description_ = '';

  /** @private {string} */
  this.format_ = cwc.fileFormat.FILE_HEADER + ' ' + cwc.fileFormat.FILE_VERSION;

  /** @private {!string} */
  this.filename_ = '';

  /** @private {!cwc.file.Files} */
  this.files_ = new cwc.file.Files();

  /** @private {!Object.<string>|string} */
  this.flags_ = {};

  /** @private {!cwc.file.Files} */
  this.frameworks_ = new cwc.file.Files();

  /** @private {string} */
  this.history_ = '';

  /** @private {string} */
  this.mode_ = '';

  /** @private {string} */
  this.model_ = '';

  /** @private {string} */
  this.ui_ = '';

  /** @private {string} */
  this.title_ = '';

  /** @private {cwc.file.Type|string} */
  this.type_ = cwc.file.Type.UNKNOWN;

  /** @private {string} */
  this.version_ = '';

  /** @private {!Object} */
  this.metadata_ = {};

  if (content) {
    this.loadJSON(content);
  } else {
    this.init(true);
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
  this.author_ = 'Unknown';
  this.content_ = new cwc.file.Files();
  this.description_ = '';
  this.filename_ = '';
  this.files_ = new cwc.file.Files();
  this.flags_ = {};
  this.frameworks_ = new cwc.file.Files();
  this.history_ = '';
  this.mode_ = 'advanced';
  this.model_ = '';
  this.setFlag('__editor__', new cwc.ui.EditorFlags());
  this.title_ = 'Untitled file';
  this.type_ = cwc.file.Type.UNKNOWN;
  this.ui_ = 'default';
  this.version_ = '1.0';
  this.metadata_ = {};
};


/**
 * @param {!string} author
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.File.prototype.setAuthor = function(author) {
  this.log_.debug('setAuthor:', author);
  this.author_ = author;
  return this;
};


/**
 * @return {string}
 */
cwc.fileFormat.File.prototype.getAuthor = function() {
  return this.author_;
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
 * @return {cwc.fileFormat.File}
 */
cwc.fileFormat.File.prototype.setDescription = function(description) {
  this.description_ = description;
  this.log_.debug('setDescription:', description);
  return this;
};


/**
 * @return {string}
 */
cwc.fileFormat.File.prototype.getDescription = function() {
  return this.description_;
};


/**
 * @return {cwc.ui.EditorFlags}
 */
cwc.fileFormat.File.prototype.getEditorFlags = function() {
  return /** @type {cwc.ui.EditorFlags} */ (this.getFlag('__editor__'));
};


/**
 * @param {cwc.ui.EditorFlags} flags
 */
cwc.fileFormat.File.prototype.setEditorFlags = function(flags) {
  this.setFlag('__editor__', flags);
};


/**
 * @param {!string} name
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.File.prototype.setFilename = function(name) {
  this.log_.debug('setFilename:', name);
  this.filename_ = name;
  return this;
};


/**
 * @return {string}
 */
cwc.fileFormat.File.prototype.getFilename = function() {
  return this.filename_;
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
 * @return {Object.<string>|string|cwc.ui.EditorFlags}
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
 * @param {Object.<string>|string|cwc.ui.EditorFlags} value
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
 * @param {!string} mode
 * @param {boolean=} opt_no_overwrite
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.File.prototype.setMode = function(mode, opt_no_overwrite) {
  if (!opt_no_overwrite || (opt_no_overwrite && !this.mode_)) {
    this.mode_ = mode;
    this.log_.debug('setMode:', mode);
  }
  return this;
};


/**
 * @return {string}
 */
cwc.fileFormat.File.prototype.getMode = function() {
  return this.mode_;
};


/**
 * @param {!string} model
 * @param {boolean=} opt_no_overwrite
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.File.prototype.setModel = function(model, opt_no_overwrite) {
  if (!opt_no_overwrite || (opt_no_overwrite && !this.model_)) {
    this.model_ = model;
    this.log_.debug('setModel:', model);
  }
  return this;
};


/**
 * @return {string}
 */
cwc.fileFormat.File.prototype.getModel = function() {
  return this.model_;
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
  if (this.title_) {
    this.log_.debug('Overwriting title:', title);
  } else {
    this.log_.debug('Set title:', title);
  }
  this.title_ = title;
  return this;
};


/**
 * @return {string}
 */
cwc.fileFormat.File.prototype.getTitle = function() {
  return this.title_;
};


/**
 * @param {!cwc.file.Type|string} type
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.File.prototype.setType = function(type) {
  if (this.type_ == type || !type) {
    return this;
  }
  if (this.type_ !== cwc.file.Type.UNKNOWN) {
    this.log_.warn('Overwriting existing type', this.type_, 'with', type);
  }
  this.log_.debug('setType:', type);
  this.type_ = type;
  return this;
};


/**
 * @return {string}
 */
cwc.fileFormat.File.prototype.getType = function() {
  return this.type_;
};


/**
 * @param {!string} version
 * @return {cwc.fileFormat.File}
 */
cwc.fileFormat.File.prototype.setVersion = function(version) {
  this.log_.debug('setVersion:', version);
  this.version_ = version;
  return this;
};


/**
 * @return {string}
 */
cwc.fileFormat.File.prototype.getVersion = function() {
  return this.version_;
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
 * @param {!string} name
 * @param {!string} namespace
 * @return {*}
 */
cwc.fileFormat.File.prototype.getMetadata = function(name,
  namespace = 'default') {
  if (!(namespace in this.metadata_) || !(name in this.metadata_[namespace])) {
    return null;
  }
  return this.metadata_[namespace][name];
};

/**
 * @param {!string} name
 * @param {*} value
 * @param {!string} namespace
 */
cwc.fileFormat.File.prototype.setMetadata = function(name, value,
  namespace = 'default') {
  if (!(namespace in this.metadata_)) {
    this.metadata_[namespace] = {};
  }
  this.metadata_[namespace][name] = value;
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
 * @return {Object}
 */
cwc.fileFormat.File.prototype.getMetaData = function() {
  return {
    'title': this.title_,
    'description': this.description_,
    'author': this.author_,
    'version': this.version_,
  };
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
  file.log_.info('Loading JSON data with', jsonData.length, 'size ...');
  file.init(true);

  // Handle content entries.
  if (jsonData['content']) {
    // Handle legacy file format 1.0
    if (fileFormatVersion === 1) {
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

    // Handle current file format
    } else {
      file.setContentData(jsonData['content']);
    }
  }

  if (jsonData['flags']) {
    for (let flag in jsonData['flags']) {
      if (Object.prototype.hasOwnProperty.call(jsonData['flags'], flag)) {
        file.setFlag(flag, jsonData['flags'][flag]);
      }
    }
  }

  if (jsonData['title']) {
    file.setTitle(decodeURIComponent(jsonData['title']));
  }

  if (jsonData['author']) {
    file.setAuthor(decodeURIComponent(jsonData['author']));
  }

  if (jsonData['version']) {
    file.setVersion(decodeURIComponent(jsonData['version']));
  }

  if (jsonData['description']) {
    file.setDescription(decodeURIComponent(jsonData['description']));
  }

  if (jsonData['type']) {
    file.setType(decodeURIComponent(jsonData['type']));
  }

  if (jsonData['mode']) {
    file.setMode(decodeURIComponent(jsonData['mode']));
  }

  if (jsonData['model']) {
    file.setModel(decodeURIComponent(jsonData['model']));
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
};


/**
 * @param {!cwc.fileFormat.File} file
 * @return {!Object}
 */
cwc.fileFormat.File.toJSON = function(file) {
  return {
    'metadata': file.metadata_.toJSON(),
    'author': file.author_,
    'content': file.content_.toJSON(),
    'description': file.description_,
    'files': file.files_.toJSON(),
    'flags': file.flags_,
    'format': file.format_,
    'frameworks': file.frameworks_,
    'history': file.history_,
    'mode': file.mode_,
    'model': file.model_,
    'title': file.title_,
    'type': file.type_,
    'ui': file.ui_,
    'version': file.version_,
  };
};
