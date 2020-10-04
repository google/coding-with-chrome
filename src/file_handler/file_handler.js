/**
 * @fileoverview File handler for the Coding with Chrome editor.
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
goog.provide('cwc.fileHandler.File');

goog.require('cwc.fileFormat.File');
goog.require('cwc.fileHandler.File');
goog.require('cwc.utils.Helper');
goog.require('cwc.utils.Logger');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.fileHandler.File = function(helper) {
  /** @private {cwc.fileFormat.File|null} */
  this.file_ = null;

  /** @private {string|null} */
  this.rawFile_ = null;

  /** @private {string} */
  this.filename_ = '';

  /** @private {string} */
  this.fileContent_ = '';

  /** @private {cwc.utils.mime.Type|null} */
  this.mimeType_ = null;

  /** @private {Object} */
  this.fileHandler_ = null;

  /** @private {string} */
  this.gDriveId_ = '';

  /** @private {boolean} */
  this.hasUnsavedChange_ = false;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Clears the file instance.
 * @param {boolean=} silent
 */
cwc.fileHandler.File.prototype.clear = function(silent = false) {
  if (!silent) {
    this.log_.info('Clear File instance...');
  }
  this.fileHandler_ = null;
  this.file_ = null;
  this.filename_ = '';
  this.gDriveId_ = '';
  this.hasUnsavedChange_ = false;
  this.mimeType_ = null;
  this.rawFile_ = null;
};


/**
 * @param {!cwc.fileFormat.File} file
 */
cwc.fileHandler.File.prototype.setFile = function(file) {
  this.clear(true);
  this.file_ = file;
};


/**
 * @param {string} content
 * @param {string=} filename
 */
cwc.fileHandler.File.prototype.setRawFile = function(content, filename) {
  this.clear(true);
  this.rawFile_ = content;
  this.filename_ = filename || '';
};


/**
 * @return {cwc.fileFormat.File}
 */
cwc.fileHandler.File.prototype.getFile = function() {
  return this.file_;
};


/**
 * @return {cwc.file.Files}
 */
cwc.fileHandler.File.prototype.getFiles = function() {
  if (this.file_) {
    return this.file_.getFiles();
  }
  return null;
};


/**
 * @return {cwc.utils.mime.Type|null}
 */
cwc.fileHandler.File.prototype.getMimeType = function() {
  return this.mimeType_;
};


/**
 * @param {!cwc.utils.mime.Type} mimeType
 */
cwc.fileHandler.File.prototype.setMimeType = function(mimeType) {
  this.mimeType_ = mimeType;
};


/**
 * @param {string} name
 * @return {cwc.file.File}
 */
cwc.fileHandler.File.prototype.getLibraryFile = function(name) {
  if (this.file_) {
    return this.file_.getFiles().getFile(name);
  }
  return null;
};


/**
 * @param {string} name
 * @param {string} content
 * @param {string=} type
 * @param {number=} size
 * @return {cwc.file.File}
 */
cwc.fileHandler.File.prototype.addLibraryFile = function(name, content, type,
    size) {
  if (this.file_) {
    return this.file_.getFiles().addFile(name, content, type, size);
  }
  return null;
};


/**
 * @return {boolean}
 */
cwc.fileHandler.File.prototype.hasLibraryFiles = function() {
  if (this.file_) {
    return this.file_.hasFiles();
  }
  return false;
};


/**
 * @param {string!} file_content
 */
cwc.fileHandler.File.prototype.setFileContent = function(file_content) {
  this.fileContent_ = file_content;
};


/**
 * @return {string}
 */
cwc.fileHandler.File.prototype.getFileContent = function() {
  return this.fileContent_;
};


/**
 * @return {string}
 */
cwc.fileHandler.File.prototype.getFileDescription = function() {
  if (this.file_) {
    return this.file_.getDescription();
  }
  return '';
};


/**
 * @param {string=} language
 * @return {Array}
 */
cwc.fileHandler.File.prototype.getFileTour = function(language) {
  if (this.file_) {
    return this.file_.getTour(language || this.helper.getUserLanguage());
  }
  return null;
};


/**
 * @param {string} filename
 */
cwc.fileHandler.File.prototype.setFilename = function(filename) {
  this.filename_ = filename;
  // Non-CWC files don't have title metadata, so always set to filename.
  if (!this.file_) {
    this.setFileTitle(filename);
  }
};


/**
 * @return {string}
 */
cwc.fileHandler.File.prototype.getFilename = function() {
  return this.filename_;
};


/**
 * @return {string}
 */
cwc.fileHandler.File.prototype.getSafeFilename = function() {
  return this.filename_.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};


/**
 * @param {string} ui
 */
cwc.fileHandler.File.prototype.setUi = function(ui) {
  if (this.file_) {
    this.file_.setUi(ui);
  }
};


/**
 * @return {string}
 */
cwc.fileHandler.File.prototype.getUi = function() {
  if (this.file_) {
    return this.file_.getUi();
  }
  return '';
};


/**
 * @param {string} name
 * @param {Object.<string>|string} value
 */
cwc.fileHandler.File.prototype.setFlag = function(name, value) {
  this.file_.setFlag(name, value);
};


/**
 * @param {string} name
 * @return {Object.<string>|string}
 */
cwc.fileHandler.File.prototype.getFlag = function(name) {
  return this.file_.getFlag(name);
};


/**
 * @param {string} title
 */
cwc.fileHandler.File.prototype.setFileTitle = function(title) {
  let guiInstance = this.helper.getInstance('gui');
  if (guiInstance) {
    guiInstance.setTitle(title);
  }
  if (this.file_) {
    this.file_.setTitle(title);
  }
};


/**
 * @return {string}
 */
cwc.fileHandler.File.prototype.getFileTitle = function() {
  if (this.file_) {
    return this.file_.getTitle();
  }
  return this.filename_;
};


/**
 * @return {string}
 */
cwc.fileHandler.File.prototype.getSafeFileTitle = function() {
  return this.getFileTitle().replace(/[^a-z0-9]/gi, '_').toLowerCase();
};


/**
 * @param {!Object} file_handler
 */
cwc.fileHandler.File.prototype.setFileHandler = function(file_handler) {
  this.fileHandler_ = file_handler;
  this.gDriveId_ = '';
  this.log_.info('setFileHandler:', file_handler);
};


/**
 * @return {Object}
 */
cwc.fileHandler.File.prototype.getFileHandler = function() {
  return this.fileHandler_;
};


/**
 * @param {string} id
 */
cwc.fileHandler.File.prototype.setGDriveId = function(id) {
  this.gDriveId_ = id;
  this.fileHandler_ = null;
  this.log_.info('setGDriveId:', id);
};


/**
 * @return {string}
 */
cwc.fileHandler.File.prototype.getGDriveId = function() {
  return this.gDriveId_;
};


/**
 * @return {string}
 */
cwc.fileHandler.File.prototype.getMode = function() {
  if (this.file_) {
    return this.file_.getMode();
  }
  return '';
};


/**
 * @param {string} model
 */
cwc.fileHandler.File.prototype.setModel = function(model) {
  this.file_.setModel(model);
};


/**
 * @return {string}
 */
cwc.fileHandler.File.prototype.getModel = function() {
  return this.file_.getModel();
};


/**
 * @param {boolean} unsavedChange
 */
cwc.fileHandler.File.prototype.setUnsavedChange = function(unsavedChange) {
  this.hasUnsavedChange_ = unsavedChange;

  let editorInstance = this.helper.getInstance('editor');
  if (editorInstance) {
    editorInstance.setModified(unsavedChange);
  }

  let blocklyInstance = this.helper.getInstance('blockly');
  if (blocklyInstance) {
    blocklyInstance.setModified(unsavedChange);
  }

  let guiInstance = this.helper.getInstance('gui');
  if (guiInstance) {
    guiInstance.setStatus(unsavedChange ? '*' : '');
  }
};


/**
 * @return {boolean}
 */
cwc.fileHandler.File.prototype.getUnsavedChange = function() {
  return this.hasUnsavedChange_;
};


/**
 * @return {boolean}
 */
cwc.fileHandler.File.prototype.isModified = function() {
  let editorInstance = this.helper.getInstance('editor');
  if (editorInstance) {
    if (editorInstance.isModified()) {
      return true;
    }
  }

  let blocklyInstance = this.helper.getInstance('blockly');
  if (blocklyInstance) {
    if (blocklyInstance.isModified()) {
      return true;
    }
  }

  return false;
};


/**
 * @param {!cwc.ui.EditorContent} view
 */
cwc.fileHandler.File.prototype.setView = function(view) {
  this.file_.setView(view);
};


/**
 * @return {cwc.ui.EditorContent}
 */
cwc.fileHandler.File.prototype.getView = function() {
  return this.file_.getView();
};
