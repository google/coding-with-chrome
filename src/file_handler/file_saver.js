/**
 * @fileoverview File saver for the file handler.
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
goog.provide('cwc.fileHandler.FileSaver');

goog.require('cwc.file.Extensions');
goog.require('cwc.file.Type');
goog.require('cwc.fileFormat.File');
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
  console.log('saveFile ...');
  this.prepareContent();
  if (opt_autodetect && this.gDriveId) {
    this.saveGDriveFile();
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
  console.log('saveFileAs ...');
  this.prepareContent();
  this.selectFileToSave(this.fileName, this.fileData);
};


/**
 * @export
 */
cwc.fileHandler.FileSaver.prototype.saveGDriveFile = function() {
  console.log('Save file in Google Drive', this.gDriveId);
  var gDriveInstance = this.helper.getInstance('gDrive', true);
  this.prepareContent();
  gDriveInstance.saveFile(this.fileName, this.fileData, this.gDriveId);
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
  var supportedFileType = true;

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
    var editorView = fileConfig.editor_views[0];
    this.fileData = editorInstance.getEditorContent(editorView);
    this.fileName = this.addFileExtension(fileName || fileTitle || 'untitled',
        fileConfig.extension);
  } else {
    if (fileConfig.blockly_views) {
      for (var i = 0; i < fileConfig.blockly_views.length; i++) {
        var blocklyView = fileConfig.blockly_views[i];
        var blocklyContent = blocklyInstance.getXML();
        file.setContent(blocklyView, blocklyContent);
      }
    }
    if (fileConfig.editor_views) {
      for (var i = 0; i < fileConfig.editor_views.length; i++) {
        var editorView = fileConfig.editor_views[i];
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
  if (file_name.indexOf(extension) != -1) {
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
  };
  var selectFileHandler = prepareSaveFile.bind(this);
  console.log('Select file to save content for', name);
  chrome.fileSystem.chooseEntry({
    'type': 'saveFile',
    'suggestedName': name
  }, selectFileHandler);
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
  var fileWriter = this.fileWriterHandler.bind(this);
  console.log('Prepare fileWriter for', name);
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
  var messageInstance = this.helper.getInstance('message');
  var blobContent = new Blob([content]);
  var truncated = false;
  console.log('Writing file', name, 'with filesize', blobContent.size, ':',
      content);
  writer.onwriteend = function(event) {
    if (!truncated) {
      this.truncate(this.position);
      truncated = true;
      return;
    }
    fileInstance.setFileHandler(file_entry);
    if (messageInstance) {
      messageInstance.info('Saved file ' + name + ' successful.');
    }
    console.log('Saved file', name, 'successful.');
  };
  writer.onerror = function(event) {
    if (messageInstance) {
      messageInstance.error('Was not able to save file ' + name + '!');
    }
    console.error('Was not able to save file', name);
  };
  writer.seek(0);
  writer.write(blobContent, {'type': 'text/plain'});
};
