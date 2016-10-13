/**
 * @fileoverview File saver for the file handler.
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
goog.provide('cwc.fileHandler.FileSaver');

goog.require('cwc.file.Extensions');
goog.require('cwc.fileHandler.Config');
goog.require('cwc.utils.Helper');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.fileHandler.FileSaver = function(helper) {
  /** @type {string} */
  this.name = 'FileSaver';

  /** @type {string} */
  this.fileData = '';

  /** @type {string} */
  this.fileName = '';

  /** @type {Object} */
  this.fileHandler = null;

  /** @type {string} */
  this.gDriveId = '';

  /** @type {cwc.utils.Helper} */
  this.helper = helper;
};


/**
 * @param {boolean=} opt_autodetect Auto detect where to save the file.
 * @export
 */
cwc.fileHandler.FileSaver.prototype.saveFile = function(
    opt_autodetect) {
  console.log('saveFile …');
  this.prepareContent();
  if (opt_autodetect && this.gDriveId) {
    this.saveGDriveFile(true);
  } else if (this.fileHandler) {
    this.prepareSaveFile(this.fileHandler, this.fileName, this.fileData);
  } else {
    this.selectFileToSave(this.fileName, this.fileData);
  }
  console.log(this.fileData);
};


/**
 * @export
 */
cwc.fileHandler.FileSaver.prototype.saveFileAs = function() {
  console.log('saveFileAs …');
  this.prepareContent();
  this.selectFileToSave(this.fileName, this.fileData);
};


/**
 * @param {boolean} save_file If true save file, otherwise open 'save as'
 *   file dialog.
 * @export
 */
cwc.fileHandler.FileSaver.prototype.saveGDriveFile = function(save_file) {
  console.log('Save file in Google Drive', this.gDriveId);
  var gDriveInstance = this.helper.getInstance('gdrive', true);
  this.prepareContent();
  if (save_file) {
    gDriveInstance.saveFile(this.fileName, this.fileData, this.gDriveId);
  } else {
    gDriveInstance.saveDialog(this.fileName, this.fileData, this.gDriveId);
  }
};


/**
 * Prepares file and ensures we have the latest editor content.
 */
cwc.fileHandler.FileSaver.prototype.prepareContent = function() {
  var fileInstance = this.helper.getInstance('file', true);
  var editorInstance = this.helper.getInstance('editor', true);
  var blocklyInstance = this.helper.getInstance('blockly', true);
  var editorFlags = editorInstance.getEditorFlags();
  var gDriveId = fileInstance.getGDriveId();

  var file = fileInstance.getFile();
  var fileType = fileInstance.getFileType();
  var fileName = fileInstance.getFileName();
  var fileTitle = fileInstance.getFileTitle();
  var fileHandler = fileInstance.getFileHandler();
  var fileUi = fileInstance.getUi();
  var fileConfig = cwc.fileHandler.Config.get(fileType);
  if (!fileConfig) {
    throw 'Filetype ' + fileType + ' is not supported!';
  }

  if (file.isRaw()) {
    let editorView = fileConfig.editor_views[0];
    this.fileData = editorInstance.getEditorContent(editorView);
    this.fileName = this.addFileExtension(fileName || fileTitle || 'untitled',
        fileConfig.extension);
  } else {
    if (fileConfig.blockly_views) {
      for (let i = 0; i < fileConfig.blockly_views.length; i++) {
        var blocklyView = fileConfig.blockly_views[i];
        var blocklyContent = blocklyInstance.getXML();
        file.setContent(blocklyView, blocklyContent);
      }
    }
    if (fileConfig.editor_views) {
      for (let i = 0; i < fileConfig.editor_views.length; i++) {
        let editorView = fileConfig.editor_views[i];
        var editorContent = editorInstance.getEditorContent(editorView);
        file.setContent(editorView, editorContent);
      }
    }
    if (fileTitle) {
      file.setTitle(fileTitle);
    }
    if (fileUi) {
      file.setUi(fileUi);
    }
    if (editorFlags) {
      file.setEditorFlags(editorFlags);
    }
    this.fileData = file.getJson();
    this.fileName = this.addFileExtension(fileName || fileTitle || 'untitled');
  }

  this.fileHandler = fileHandler;
  this.gDriveId = gDriveId;
};


/**
 * @param {!string} file_name
 * @param {cwc.file.Extensions=} opt_extension
 * @return {!string}
 */
cwc.fileHandler.FileSaver.prototype.addFileExtension = function(
    file_name, opt_extension) {
  var extension = opt_extension || cwc.file.Extensions.CWC;
  if (file_name.includes(extension)) {
    return file_name;
  }
  return file_name + extension;
};


/**
 * @param {!string} name
 * @param {!string} content
 * @param {function(?)=} opt_callback
 * @param {Object=} opt_callback_scope
 */
cwc.fileHandler.FileSaver.prototype.selectFileToSave = function(name,
    content, opt_callback, opt_callback_scope) {
  var prepareSaveFile = function(file_entry) {
    this.prepareSaveFile(file_entry, name, content, opt_callback,
        opt_callback_scope);
  }.bind(this);
  console.log('Select file to save content for', name);
  chrome.fileSystem.chooseEntry({
    'type': 'saveFile',
    'suggestedName': name
  }, prepareSaveFile);
};


/**
 * @param {Object} file_entry
 * @param {!string} name
 * @param {!string} content
 * @param {function()=} opt_callback
 * @param {Object=} opt_callback_scope
 */
cwc.fileHandler.FileSaver.prototype.prepareSaveFile = function(
    file_entry, name, content, opt_callback, opt_callback_scope) {
  if (!file_entry) {
    console.log('No file was selected for', name);
    return;
  }

  console.log('Prepare fileWriter for', name);
  var fileWriter = this.fileWriterHandler.bind(this);
  file_entry.createWriter(function(writer) {
    fileWriter(writer, name, content, file_entry, opt_callback,
      opt_callback_scope);
  });
};


/**
 * Saves a file.
 * @param {Object} writer
 * @param {!string} name
 * @param {!string} content
 * @param {Object} file_entry
 * @param {function()=} opt_callback
 * @param {Object=} opt_callback_scope
 */
cwc.fileHandler.FileSaver.prototype.fileWriterHandler = function(
    writer, name, content, file_entry, opt_callback, opt_callback_scope) {
  var fileInstance = this.helper.getInstance('file', true);
  var blobContent = new Blob([content]);
  var truncated = false;
  var helperInstance = this.helper;
  console.log('Writing file', name, 'with filesize', blobContent.size, ':',
      content);
  writer.onwriteend = function(opt_event) {
    if (!truncated) {
      this.truncate(this.position);
      truncated = true;
      return;
    }
    fileInstance.setFileHandler(file_entry);
    fileInstance.setUnsavedChange(false);
    helperInstance.showSuccess('Saved file ' + name + ' successful.');
  };
  writer.onerror = function(opt_event) {
    this.helper.showError('Unable to save file ' + name + '!');
  };
  writer.seek(0);
  writer.write(blobContent, {'type': 'text/plain'});
};
