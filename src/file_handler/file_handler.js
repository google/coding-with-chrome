/**
 * @fileoverview File handler for the Coding with Chrome editor.
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
goog.provide('cwc.fileHandler.File');

goog.require('cwc.file.Type');
goog.require('cwc.fileFormat.File');
goog.require('cwc.fileHandler.File');
goog.require('cwc.utils.Helper');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.fileHandler.File = function(helper) {

  /** @private {!cwc.fileFormat.File} */
  this.file_ = new cwc.fileFormat.File();

  /** @private {Object} */
  this.fileHandler_ = null;

  /** @private {!string} */
  this.gDriveId_ = '';

  /** @private {!boolean} */
  this.hasUnsavedChange_ = false;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;
};


/**
 * Clears the file instance.
 */
cwc.fileHandler.File.prototype.clear = function() {
  console.log('Clear File instance …');
  this.file_ = new cwc.fileFormat.File();
  this.fileHandler_ = null;
  this.gDriveId_ = '';
  this.hasUnsavedChange_ = false;
};


/**
 * @param {!cwc.fileHandler.File} file
 */
cwc.fileHandler.File.prototype.setFile = function(file) {
  this.clear();
  console.log('Set instance file to:', file);
  this.file_ = file;
};


/**
 * @return {!cwc.fileHandler.File}
 */
cwc.fileHandler.File.prototype.getFile = function() {
  return this.file_;
};


/**
 * @return {!cwc.file.Files}
 */
cwc.fileHandler.File.prototype.getFiles = function() {
  return this.file_.getFiles();
};


/**
 * @param {!string} name
 * @param {string=} opt_group
 * @return {cwc.fileHandler.File}
 */
cwc.fileHandler.File.prototype.getLibraryFile = function(name, opt_group) {
  return this.file_.getFiles().getFile(name, opt_group);
};


/**
 * @param {!string} name
 * @param {!string} content
 * @param {string=} opt_type
 * @param {number=} opt_size
 * @param {string=} opt_group
 * @return {cwc.fileHandler.File}
 */
cwc.fileHandler.File.prototype.addLibraryFile = function(name, content,
    opt_type, opt_size, opt_group) {
  return this.file_.getFiles().addFile(name, content, opt_type, opt_size,
      opt_group);
};


/**
 * @param {string!} file_content
 */
cwc.fileHandler.File.prototype.setFileContent = function(
    file_content) {
  this.fileContent_ = file_content;
};


/**
 * @return {string}
 */
cwc.fileHandler.File.prototype.getFileContent = function() {
  return this.fileContent_;
};


/**
 * @param {cwc.file.Type} file_type
 */
cwc.fileHandler.File.prototype.setFileType = function(file_type) {
  this.file_.setType(file_type);
};


/**
 * @return {cwc.file.Type}
 */
cwc.fileHandler.File.prototype.getFileType = function() {
  return this.file_.getType();
};


/**
 * @param {string} file_name
 */
cwc.fileHandler.File.prototype.setFileName = function(file_name) {
  this.file_.setFileName(file_name);
};


/**
 * @return {string}
 */
cwc.fileHandler.File.prototype.getFileName = function() {
  return this.file_.getFileName();
};


/**
 * @param {!string} ui
 */
cwc.fileHandler.File.prototype.setUi = function(ui) {
  this.file_.setUi(ui);
};


/**
 * @return {!string}
 */
cwc.fileHandler.File.prototype.getUi = function() {
  return this.file_.getUi();
};

/**
 * @param {!string} name
 * @param {Object.<string>|string|cwc.ui.EditorFlags} value
 */
cwc.fileHandler.File.prototype.setFlag = function(name, value) {
  this.file_.setFlag(name, value);
};


/**
 * @param {!string} name
 * @return {Object.<string>|string|cwc.ui.EditorFlags}
 */
cwc.fileHandler.File.prototype.getFlag = function(name) {
  return this.file_.getFlag(name);
};


/**
 * @return {cwc.ui.EditorFlags}
 */
cwc.fileHandler.File.prototype.getEditorFlags = function() {
  return this.file_.getEditorFlags();
};


/**
 * @param {cwc.ui.EditorFlags} flags
 */
cwc.fileHandler.File.prototype.setEditorFlags = function(flags) {
  this.file_.setEditorFlags(flags);
};


/**
 * @param {string} file_title
 * @export
 */
cwc.fileHandler.File.prototype.setFileTitle = function(file_title) {
  var guiInstance = this.helper.getInstance('gui');
  if (guiInstance) {
    guiInstance.setTitle(file_title);
  }
  this.file_.setTitle(file_title);
};


/**
 * @return {string}
 */
cwc.fileHandler.File.prototype.getFileTitle = function() {
  return this.file_.getTitle();
};


/**
 * @param {!Object} file_handler
 */
cwc.fileHandler.File.prototype.setFileHandler = function(file_handler) {
  this.fileHandler_ = file_handler;
  this.gDriveId_ = '';
  console.log('setFileHandler:', file_handler);
};


/**
 * @return {Object}
 */
cwc.fileHandler.File.prototype.getFileHandler = function() {
  return this.fileHandler_;
};


/**
 * @param {!string} id
 */
cwc.fileHandler.File.prototype.setGDriveId = function(id) {
  this.gDriveId_ = id;
  this.fileHandler_ = null;
  console.log('setGDriveId:', id);
};


/**
 * @return {string}
 */
cwc.fileHandler.File.prototype.getGDriveId = function() {
  return this.gDriveId_;
};


/**
 * @param {string} model
 * @export
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
 * @param {boolean} unsaved_change
 */
cwc.fileHandler.File.prototype.setUnsavedChange = function(unsaved_change) {
  this.hasUnsavedChange_ = unsaved_change;

  var editorInstance = this.helper.getInstance('editor');
  if (editorInstance) {
    editorInstance.setModified(unsaved_change);
  }

  var blocklyInstance = this.helper.getInstance('blockly');
  if (blocklyInstance) {
    blocklyInstance.setModified(unsaved_change);
  }

  var guiInstance = this.helper.getInstance('gui');
  if (guiInstance) {
    guiInstance.setStatus(unsaved_change ? '*' : '');
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
  var editorInstance = this.helper.getInstance('editor');
  if (editorInstance) {
    if (editorInstance.isModified()) {
      return true;
    }
  }

  var blocklyInstance = this.helper.getInstance('blockly');
  if (blocklyInstance) {
    if (blocklyInstance.isModified()) {
      return true;
    }
  }

  return false;
};
