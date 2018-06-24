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

goog.require('cwc.ui.EditorContent');
goog.require('cwc.utils.mime.Type');
goog.require('cwc.utils.Logger');


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
  this.filename = '';

  /** @type {string} */
  this.mimeType = '';

  /** @type {Object} */
  this.fileHandler = null;

  /** @type {string} */
  this.gDriveId = '';

  /** @type {cwc.utils.Helper} */
  this.helper = helper;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * @param {boolean=} autoDetect Auto detect where to save the file.
 * @export
 */
cwc.fileHandler.FileSaver.prototype.saveFile = function(autoDetect = false) {
  this.log_.info('saveFile...');
  this.prepareContent();
  if (autoDetect && this.gDriveId) {
    this.saveGDriveFile(true);
  } else if (this.fileHandler) {
    this.prepareSaveFile(this.fileHandler, this.filename, this.fileData);
  } else {
    this.selectFileToSave(this.filename, this.fileData);
  }
};


/**
 * @export
 */
cwc.fileHandler.FileSaver.prototype.saveFileAs = function() {
  this.log_.info('saveFileAs...');
  this.prepareContent();
  this.selectFileToSave(this.filename, this.fileData);
};


/**
 * @param {boolean=} save_file If true save file, otherwise open 'save as'
 *   file dialog.
 * @export
 */
cwc.fileHandler.FileSaver.prototype.saveGDriveFile = function(save_file) {
  this.log_.info('Save file in Google Drive', this.gDriveId);
  let gDriveInstance = this.helper.getInstance('gdrive', true);
  this.prepareContent();
  if (save_file) {
    gDriveInstance.saveFile(this.filename, this.fileData, this.gDriveId);
  } else {
    gDriveInstance.saveDialog(this.filename, this.fileData, this.gDriveId);
  }
};


/**
 * @export
 */
cwc.fileHandler.FileSaver.prototype.saveGCloudFile = function() {
  this.log_.info('Save file in Google Cloud');
  let gCloudInstance = this.helper.getInstance('gcloud', true);
  this.prepareContent();
  gCloudInstance.publishDialog(this.filename, this.fileData, this.mimeType);
};


/**
 * Prepares file and ensures we have the latest editor content.
 */
cwc.fileHandler.FileSaver.prototype.prepareContent = function() {
  let editorInstance = this.helper.getInstance('editor');
  let fileInstance = this.helper.getInstance('file');
  let fileTitle = fileInstance.getFileTitle();
  let filename = fileInstance.getFilename();
  let mimeType = fileInstance.getMimeType();

  if (mimeType.type === cwc.utils.mime.Type.CWC.type) {
    // Handle CWC file format
    let file = fileInstance.getFile();

    let blocklyInstance = this.helper.getInstance('blockly');
    if (blocklyInstance) {
      let viewName = blocklyInstance.getViewName();
      if (viewName) {
        file.setContent(viewName, blocklyInstance.getXML());
      }
    }

    if (editorInstance) {
      let views = editorInstance.getViews();
      for (let entry in views) {
        if (Object.prototype.hasOwnProperty.call(views, entry)) {
          file.setContent(entry, views[entry].getContent());
        }
      }
    }

    this.fileData = file.getJSON();
    this.filename = this.addFileExtension(filename || fileTitle || 'untitled');
  } else {
    // Handle raw file format
    this.fileData = editorInstance.getEditorContent(
      cwc.ui.EditorContent.DEFAULT);
    this.filename = this.addFileExtension(
      filename || 'unnamed', mimeType.ext[0]);
  }

  this.fileHandler = fileInstance.getFileHandler();
  this.gDriveId = fileInstance.getGDriveId();
  this.mimeType = mimeType.type;
};


/**
 * @param {string} filename
 * @param {string=} extension
 * @return {string}
 */
cwc.fileHandler.FileSaver.prototype.addFileExtension = function(
    filename, extension = cwc.utils.mime.Type.CWC.ext[0]) {
  if (filename.includes(extension)) {
    return filename;
  }
  return filename + extension;
};


/**
 * @param {string} name
 * @param {string} content
 */
cwc.fileHandler.FileSaver.prototype.selectFileToSave = function(name, content) {
  let prepareSaveFile = function(file_entry, opt_file_entries) {
    if (chrome.runtime.lastError) {
      this.log_.error('Choose Entry error for', name, ':',
        chrome.runtime.lastError);
    } else if (file_entry) {
      this.prepareSaveFile(file_entry, name, content);
    } else {
      this.log_.error('Was unable to choose file entry to save.');
    }
  }.bind(this);
  this.log_.info('Select file to save content for', name);
  chrome.fileSystem.chooseEntry({
    'type': 'saveFile',
    'suggestedName': this.getSafeFilename_(name),
  }, prepareSaveFile);
};


/**
 * @param {Object} file_entry
 * @param {string} name
 * @param {string} content
 */
cwc.fileHandler.FileSaver.prototype.prepareSaveFile = function(
    file_entry, name, content) {
  if (!file_entry) {
    this.log_.info('No file was selected for', name, file_entry);
    return;
  }

  this.log_.info('Prepare fileWriter for', name);
  let fileWriter = this.fileWriterHandler.bind(this);
  file_entry.createWriter(function(writer) {
    fileWriter(writer, name, content, file_entry);
  });
};


/**
 * Saves a file.
 * @param {Object} writer
 * @param {string} name
 * @param {string} content
 * @param {Object} file_entry
 */
cwc.fileHandler.FileSaver.prototype.fileWriterHandler = function(
    writer, name, content, file_entry) {
  let fileInstance = this.helper.getInstance('file', true);
  let filename = file_entry['name'] || name;
  let blobContent = new Blob([content]);
  let truncated = false;
  let helperInstance = this.helper;
  this.log_.info('Writing file', filename, 'with file-size',
    blobContent['size'], ':', content);
  writer.onwriteend = function(opt_event) {
    if (!truncated) {
      this.truncate(this.position);
      truncated = true;
      return;
    }
    fileInstance.setFileHandler(file_entry);
    fileInstance.setUnsavedChange(false);
    helperInstance.showSuccess('Saved file ' + filename + ' successful.');
  };
  writer.onerror = function(opt_event) {
    this.helper.showError('Unable to save file ' + filename + '!');
  };
  writer.seek(0);
  writer.write(blobContent, {'type': 'text/plain'});
};


/**
 * Returns an OS safe filename.
 * @param {string} name
 * @return {string}
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
