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
goog.provide('cwc.fileFormat.File');

goog.require('cwc.file.ContentType');
goog.require('cwc.file.Files');
goog.require('cwc.file.Type');
goog.require('cwc.ui.EditorFlags');
goog.require('cwc.utils.Logger');


/**
 * The cwc format header for identification.
 * @const {string}
 */
cwc.fileFormat.FILE_HEADER = 'Coding with Chrome File Format 1.0';


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

  /** @private {!Object.<string>|string} */
  this.content_ = {};

  /** @private {string} */
  this.description_ = '';

  /** @private {string} */
  this.format_ = cwc.fileFormat.FILE_HEADER;

  /** @private {!string} */
  this.filename_ = '';

  /** @private {!cwc.file.Files} */
  this.files_ = new cwc.file.Files();

  /** @private {!Object.<string>|string} */
  this.flags_ = {};

  /** @private {cwc.file.Files} */
  this.frameworks_ = null;

  /** @private {boolean} */
  this.raw_ = false;

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

  if (content) {
    this.loadJson(content);
  } else {
    this.init();
  }
};


/**
 * Initializes the file data with default values.
 */
cwc.fileFormat.File.prototype.init = function() {
  this.log_.info('Clearing existing file information...');
  this.author_ = 'Unknown';
  this.content_ = {};
  this.description_ = '';
  this.filename_ = '';
  this.files_ = new cwc.file.Files();
  this.flags_ = {};
  this.frameworks_ = new cwc.file.Files();
  this.history_ = '';
  this.mode_ = 'advanced';
  this.model_ = '';
  this.raw_ = false;
  this.setFlag('__editor__', new cwc.ui.EditorFlags());
  this.title_ = 'Untitled file';
  this.type_ = cwc.file.Type.UNKNOWN;
  this.ui_ = 'default';
  this.version_ = '1.0';
};


/**
 * @param {!string} name
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.File.prototype.setFileName = function(name) {
  this.log_.debug('setFileName:', name);
  this.filename_ = name;
  return this;
};


/**
 * @return {string}
 */
cwc.fileFormat.File.prototype.getFileName = function() {
  return this.filename_;
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
 * @param {cwc.file.ContentType|string} name
 * @return {boolean}
 */
cwc.fileFormat.File.prototype.hasContent = function(name) {
  return name in this.content_;
};


/**
 * @param {cwc.file.ContentType|string} name
 * @return {string}
 */
cwc.fileFormat.File.prototype.getContent = function(name) {
  return this.content_[name] || '';
};


/**
 * @param {cwc.file.ContentType|string} name
 * @param {string} content
 * @param {boolean=} opt_no_overwrite
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.File.prototype.setContent = function(name, content,
    opt_no_overwrite) {
  if (!opt_no_overwrite || (opt_no_overwrite && !this.content_[name])) {
    this.log_.debug('setContent', name, ':', content);
    this.content_[name] = content;
  }
  return this;
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
 * @param {!cwc.file.Files} files
 */
cwc.fileFormat.File.prototype.setFiles = function(files) {
  this.files_ = files;
  this.log_.debug('setFiles:', files);
};


/**
 * @param {!Object} data
 */
cwc.fileFormat.File.prototype.setFilesData = function(data) {
  this.files_.setData(data);
  this.log_.debug('setFilesData:', data);
};


/**
 * @return {!cwc.file.Files}
 */
cwc.fileFormat.File.prototype.getFiles = function() {
  return this.files_;
};


/**
 * @return {boolean}
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
 * @param {boolean=} opt_no_overwrite
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.File.prototype.setTitle = function(title, opt_no_overwrite) {
  if (!opt_no_overwrite || (opt_no_overwrite && !this.title_)) {
    this.log_.debug('setTitle:', title);
    this.title_ = title;
  }
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
 * @param {!boolean} raw
 * @return {!cwc.fileFormat.File}
 */
cwc.fileFormat.File.prototype.setRaw = function(raw) {
  this.raw_ = raw;
  return this;
};


/**
 * @return {boolean}
 */
cwc.fileFormat.File.prototype.isRaw = function() {
  return this.raw_;
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
 * Loads the defined JSON data and sets the supported options.
 * @param {string} data JSON data.
 */
cwc.fileFormat.File.prototype.loadJson = function(data) {
  let jsonData = data;
  if (typeof data != 'object') {
    try {
      jsonData = JSON.parse(data);
    } catch (error) {
      throw new Error('Was not able to parse JSON: ' + error.message +
        '\ndata:' + data);
    }
  }
  if (!jsonData ||
      jsonData['format'] != cwc.fileFormat.FILE_HEADER) {
    throw new Error('File format: ' + jsonData['format'] + ' is not support!');
  }
  this.init();

  if (jsonData['content']) {
    for (let content in jsonData['content']) {
      if (Object.prototype.hasOwnProperty.call(jsonData['content'], content)) {
        this.setContent(content, jsonData['content'][content]);
      }
    }
  }

  if (jsonData['flags']) {
    for (let flag in jsonData['flags']) {
      if (Object.prototype.hasOwnProperty.call(jsonData['flags'], flag)) {
        this.setFlag(flag, jsonData['flags'][flag]);
      }
    }
  }

  if (jsonData['title']) {
    this.setTitle(decodeURIComponent(jsonData['title']));
  }

  if (jsonData['author']) {
    this.setAuthor(decodeURIComponent(jsonData['author']));
  }

  if (jsonData['version']) {
    this.setVersion(decodeURIComponent(jsonData['version']));
  }

  if (jsonData['description']) {
    this.setDescription(decodeURIComponent(jsonData['description']));
  }

  if (jsonData['type']) {
    this.setType(decodeURIComponent(jsonData['type']));
  }

  if (jsonData['mode']) {
    this.setMode(decodeURIComponent(jsonData['mode']));
  }

  if (jsonData['model']) {
    this.setModel(decodeURIComponent(jsonData['model']));
  }

  if (jsonData['ui']) {
    this.setUi(decodeURIComponent(jsonData['ui']));
  }

  if (jsonData['frameworks']) {
    this.setFrameworks(jsonData['frameworks']);
  }

  if (jsonData['files']) {
    this.setFilesData(jsonData['files']);
  }

  if (jsonData['history']) {
    this.setHistory(jsonData['history']);
  }

  if (jsonData['raw']) {
    this.setHistory(jsonData['raw']);
  }
};


/**
 * @return {!Object}
 */
cwc.fileFormat.File.prototype.toJSON = function() {
  return {
    'author': this.author_,
    'content': this.content_,
    'description': this.description_,
    'files': this.files_.toJSON(),
    'flags': this.flags_,
    'format': this.format_,
    'frameworks': this.frameworks_,
    'history': this.history_,
    'mode': this.mode_,
    'model': this.model_,
    'raw': this.raw_,
    'title': this.title_,
    'type': this.type_,
    'ui': this.ui_,
    'version': this.version_,
  };
};


/**
 * @return {string}
 */
cwc.fileFormat.File.prototype.getJson = function() {
  return JSON.stringify(this.toJSON(), null, 2);
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
