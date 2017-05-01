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

  /** @type {string} */
  this.fileType = '';

  /** @type {Object} */
  this.fileHandler = null;

  /** @type {string} */
  this.gDriveId = '';

  /** @type {cwc.utils.Helper} */
  this.helper = helper;
};


/**
 * @param {boolean=} autoDetect Auto detect where to save the file.
 * @export
 */
cwc.fileHandler.FileSaver.prototype.saveFile = function(autoDetect = false) {
  console.log('saveFile...');
  this.prepareContent();
  if (autoDetect && this.gDriveId) {
    this.saveGDriveFile(true);
  } else if (this.fileHandler) {
    this.prepareSaveFile(this.fileHandler, this.fileName, this.fileData);
  } else {
    this.selectFileToSave(this.fileName, this.fileData);
  }
};


/**
 * @export
 */
cwc.fileHandler.FileSaver.prototype.saveFileAs = function() {
  console.log('saveFileAs...');
  this.prepareContent();
  this.selectFileToSave(this.fileName, this.fileData);
};


/**
 * @param {boolean=} save_file If true save file, otherwise open 'save as'
 *   file dialog.
 * @export
 */
cwc.fileHandler.FileSaver.prototype.saveGDriveFile = function(save_file) {
  console.log('Save file in Google Drive', this.gDriveId);
  let gDriveInstance = this.helper.getInstance('gdrive', true);
  this.prepareContent();
  if (save_file) {
    gDriveInstance.saveFile(this.fileName, this.fileData, this.gDriveId);
  } else {
    gDriveInstance.saveDialog(this.fileName, this.fileData, this.gDriveId);
  }
};

/**
 * @param {boolean} save_file If true save file, otherwise open 'save as'
 *   file dialog.
 * @export
 */
cwc.fileHandler.FileSaver.prototype.saveGCloudFile = function() {
  console.log('Save file in Google Cloud');
  let gCloudInstance = this.helper.getInstance('gcloud', true);
  this.prepareContent();
  gCloudInstance.publishDialog(this.fileName, this.fileData, this.fileType);
};

/**
 * Prepares file and ensures we have the latest editor content.
 */
cwc.fileHandler.FileSaver.prototype.prepareContent = function() {
  let fileInstance = this.helper.getInstance('file', true);
  let editorInstance = this.helper.getInstance('editor', true);
  let blocklyInstance = this.helper.getInstance('blockly', true);
  let editorFlags = editorInstance.getEditorFlags();
  let gDriveId = fileInstance.getGDriveId();

  let file = fileInstance.getFile();
  let fileType = fileInstance.getFileType();
  let fileName = fileInstance.getFileName();
  let fileTitle = fileInstance.getFileTitle();
  let fileHandler = fileInstance.getFileHandler();
  let fileUi = fileInstance.getUi();
  let fileConfig = cwc.fileHandler.Config.get(fileType);
  if (!fileConfig) {
    throw new Error('Filetype ' + fileType + ' is not supported!');
  }

  if (file.isRaw()) {
    let editorView = fileConfig.editor_views[0];
    this.fileData = editorInstance.getEditorContent(editorView);
    this.fileName = this.addFileExtension(fileName || fileTitle || 'untitled',
        fileConfig.extension);
  } else {
    if (fileConfig.blockly_views) {
      for (let i = 0; i < fileConfig.blockly_views.length; i++) {
        let blocklyView = fileConfig.blockly_views[i];
        let blocklyContent = blocklyInstance.getXML();
        file.setContent(blocklyView, blocklyContent);
      }
    }
    if (fileConfig.editor_views) {
      for (let i = 0; i < fileConfig.editor_views.length; i++) {
        let editorView = fileConfig.editor_views[i];
        let editorContent = editorInstance.getEditorContent(editorView);
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
    this.fileType = fileType;
  }

  this.fileHandler = fileHandler;
  this.gDriveId = gDriveId;
};


/**
 * @param {!string} filename
 * @param {cwc.file.Extensions=} extension
 * @return {!string}
 */
cwc.fileHandler.FileSaver.prototype.addFileExtension = function(
    filename, extension = cwc.file.Extensions.CWC) {
  if (filename.includes(extension)) {
    return filename;
  }
  return filename + extension;
};


/**
 * @param {!string} name
 * @param {!string} content
 */
cwc.fileHandler.FileSaver.prototype.selectFileToSave = function(name, content) {
  let prepareSaveFile = function(file_entry, opt_file_entries) {
    if (chrome.runtime.lastError) {
      console.error('Choose Entry error for', name, ':',
        chrome.runtime.lastError);
    } else if (file_entry) {
      this.prepareSaveFile(file_entry, name, content);
    } else {
      console.error('Was unable to choose file entry to save.');
    }
  }.bind(this);
  console.log('Select file to save content for', name);
  chrome.fileSystem.chooseEntry({
    'type': 'saveFile',
    'suggestedName': this.getSafeFilename_(name),
  }, prepareSaveFile);
};


/**
 * @param {Object} file_entry
 * @param {!string} name
 * @param {!string} content
 */
cwc.fileHandler.FileSaver.prototype.prepareSaveFile = function(
    file_entry, name, content) {
  if (!file_entry) {
    console.log('No file was selected for', name, file_entry);
    return;
  }

  console.log('Prepare fileWriter for', name);
  let fileWriter = this.fileWriterHandler.bind(this);
  file_entry.createWriter(function(writer) {
    fileWriter(writer, name, content, file_entry);
  });
};


/**
 * Saves a file.
 * @param {Object} writer
 * @param {!string} name
 * @param {!string} content
 * @param {Object} file_entry
 */
cwc.fileHandler.FileSaver.prototype.fileWriterHandler = function(
    writer, name, content, file_entry) {
  let fileInstance = this.helper.getInstance('file', true);
  let fileName = file_entry['name'] || name;
  let blobContent = new Blob([content]);
  let truncated = false;
  let helperInstance = this.helper;
  console.log('Writing file', fileName, 'with file-size', blobContent['size'],
      ':', content);
  writer.onwriteend = function(opt_event) {
    if (!truncated) {
      this.truncate(this.position);
      truncated = true;
      return;
    }
    fileInstance.setFileHandler(file_entry);
    fileInstance.setUnsavedChange(false);
    helperInstance.showSuccess('Saved file ' + fileName + ' successful.');
  };
  writer.onerror = function(opt_event) {
    this.helper.showError('Unable to save file ' + fileName + '!');
  };
  writer.seek(0);
  writer.write(blobContent, {'type': 'text/plain'});
};


/**
 * Returns and OS safe filename.
 * @param {!string} name
 * @return {!string}
 * @private
 */
cwc.fileHandler.FileSaver.prototype.getSafeFilename_ = function(name) {
  return name
    .replace(':', '-')
    .replace('/', '_')
    .replace('>', '[')
    .replace('<', ']')
    .replace('*', 'x')
    .replace('|', ',')
    .replace('\\0', '')
    .replace('\\', '');
};
