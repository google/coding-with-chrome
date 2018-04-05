/**
 * @fileoverview File loader for the file handler.
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
goog.provide('cwc.fileHandler.FileLoader');

goog.require('cwc.utils.mime.Type');
goog.require('cwc.utils.mime.getTypeByNameAndContent');
goog.require('cwc.fileFormat.File');
goog.require('cwc.mode.Config');
goog.require('cwc.ui.EditorHint');
goog.require('cwc.utils.Logger');
goog.require('cwc.utils.Resources');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.fileHandler.FileLoader = function(helper) {
  /** @type {string} */
  this.name = 'File Loader';

  /** @type {!Array} */
  this.acceptedFiles = [{
    'description': 'All supported files',
    'extensions': ['cwc', 'txt', 'html', 'htm', 'js', 'coffee', 'py', 'css'],
  }, {
    'description': 'Coding with Chrome file (.cwc)',
    'extensions': ['cwc'],
  },
    {'extensions': ['coffee']},
    {'extensions': ['css']},
    {'extensions': ['htm', 'html']},
    {'extensions': ['js']},
    {'extensions': ['py']},
    {'extensions': ['txt']},
  ];

  /** @type {!cwc.utils.Helper} **/
  this.helper = helper;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * @export
 */
cwc.fileHandler.FileLoader.prototype.loadFile = function() {
  this.selectFileToLoad(this.loadFileData, this);
};


/**
 * Creates a request to load file.
 * @param {Function=} optCallback
 */
cwc.fileHandler.FileLoader.prototype.requestLoadFile = function(optCallback) {
  let loadFile = function() {
    this.loadFile();
    if (optCallback) {
      optCallback();
    }
  }.bind(this);
  this.helper.handleUnsavedChanges(loadFile);
};


/**
 * @param {!Object} file
 * @param {!Object} file_entry
 * @param {!string} data
 */
cwc.fileHandler.FileLoader.prototype.loadFileData = function(file,
    file_entry, data) {
  this.handleFileData(data, file['name'], file_entry);
};


/**
 * @param {!string} file
 * @return {Promise}
 * @export
 */
cwc.fileHandler.FileLoader.prototype.loadLocalFile = function(file) {
  this.log_.info('Loading file', file, '...');
  return new Promise((resolve, reject) => {
    let filename = file.replace(/^.*(\\|\/|:)/, '');
    return cwc.utils.Resources.getUriAsText(file).then((content) => {
      return this.handleFileData(content, filename, null, undefined)
        .then(resolve).catch(reject);
    }).catch((e) => {
      this.helper.showError(String(e));
      throw e;
    });
  });
};


/**
 * @param {!string} id
 * @param {!string} filename
 * @param {!string} data
 * @export
 */
cwc.fileHandler.FileLoader.prototype.loadGDriveFileData = function(id,
    filename, data) {
  this.log_.debug(data);
  this.handleFileData(data, filename, null, id);
};


/**
 * Handles the file data and sets the file instance accordingly.
 * @param {!string} data
 * @param {string=} filename
 * @param {Object=} fileHandler
 * @param {string=} gDriveId
 * @return {Promise}
 */
cwc.fileHandler.FileLoader.prototype.handleFileData = function(data,
    filename = '', fileHandler = null, gDriveId = undefined) {
  return new Promise((resolve) => {
    let mimeType = cwc.utils.mime.getTypeByNameAndContent(filename || '', data);
    this.log_.info('Handle file data ... (', data.length, ') with MIME-type:',
      mimeType);

    // Load compatible file mode.
    if (mimeType === cwc.utils.mime.Type.CWC.type) {
      this.loadCWCFile(new cwc.fileFormat.File(data), filename);
    } else {
      this.loadRawFile(data, filename);
    }

    // Sets file handler for local or gDrive files
    let fileInstance = this.helper.getInstance('file');
    if (fileHandler) {
      if (fileHandler.name) {
        fileInstance.setFilename(fileHandler.name);
      }
      fileInstance.setFileHandler(fileHandler);
    } else if (gDriveId) {
      fileInstance.setGDriveId(gDriveId);
    }

    this.helper.showSuccess('Loaded file ' + filename + ' successful.');
    resolve();
  });
};


/**
 * @param {!cwc.fileFormat.File} file
 * @param {string=} filename
 */
cwc.fileHandler.FileLoader.prototype.loadCWCFile = function(file,
    filename = '') {
  let modeType = cwc.mode.Config.getMode(
    /** @type {cwc.mode.Type} */ (file.getMode()));
  this.log_.info('Loading CWC file with mode', modeType, '...');

  let fileInstance = this.helper.getInstance('file');
  fileInstance.setFile(file);
  fileInstance.setMimeType(cwc.utils.mime.Type.CWC);

  let modeInstance = this.helper.getInstance('mode');
  modeInstance.setMode(modeType);
  modeInstance.setFilename(filename);

  // Handling Blockly and normal Editor content.
  let editorContent = file.getContentData();
  for (let entry in editorContent) {
    if (Object.prototype.hasOwnProperty.call(editorContent, entry)) {
      let content = editorContent[entry];
      let contentType = content.getType();
      switch (contentType) {
        case cwc.utils.mime.Type.BLOCKLY.type:
          modeInstance.addBlocklyView(
            content.getName(), content.getContent());
          break;
        case cwc.utils.mime.Type.COFFEESCRIPT.type:
        case cwc.utils.mime.Type.CSS.type:
        case cwc.utils.mime.Type.HTML.type:
        case cwc.utils.mime.Type.JAVASCRIPT.type:
          modeInstance.addEditorView(
            content.getName(), content.getContent(), contentType);
          break;
        default:
          this.log_.warn('Unknown content type:', contentType);
      }
    }
  }

  // Handle library files
  // let cacheInstance = this.helper.getInstance('cache');

  modeInstance.postMode();
};


/**
 * @param {!string} content
 * @param {string=} filename
 */
cwc.fileHandler.FileLoader.prototype.loadRawFile = function(content,
    filename = '') {
  let mimeType = cwc.utils.mime.getTypeByNameAndContent(filename, content);
  let modeType = cwc.mode.Config.getModeByMimeType(mimeType);
  this.log_.info('Loading', mimeType, 'file with mode', modeType, '...');

  let fileInstance = this.helper.getInstance('file');
  fileInstance.setRawFile(content, filename);
  fileInstance.setMimeType(cwc.utils.mime.getByType(mimeType));

  let modeInstance = this.helper.getInstance('mode');
  modeInstance.setMode(modeType);
  modeInstance.setFilename(filename);
  modeInstance.addEditorView('__default__', content, mimeType);
  modeInstance.postMode();
};


/**
 * @param {!Function} callback
 * @param {Object=} scope
 */
cwc.fileHandler.FileLoader.prototype.selectFileToLoad = function(callback,
    scope) {
  this.log_.info('Select file to load content for the following types:',
    this.acceptedFiles);
  chrome.fileSystem.chooseEntry({
    'accepts': this.acceptedFiles,
  }, function(file_entry, file_entries) {
    if (chrome.runtime.lastError) {
      let message = chrome.runtime.lastError.message;
      if (message && message !== 'User cancelled') {
        this.helper.showWarning(message);
        return;
      }
    } else if (file_entry && file_entry.isFile && !file_entries) {
      file_entry.file(function(file) {
        this.log_.info('Load file: ' + file_entry.name);
        this.readFile(file, file_entry, callback, scope);
      }.bind(this));
    } else if (file_entries) {
      this.helper.showError('Too many file entries.');
    }
  }.bind(this));
};


/**
 * Reads the file content and passes it to the callback.
 *
 * @param {!Blob} file
 * @param {!FileEntry} file_entry
 * @param {!function(?)} callback
 * @param {Object=} scope
 */
cwc.fileHandler.FileLoader.prototype.readFile = function(file, file_entry,
    callback, scope) {
  this.log_.info('Reading file', file.name, '…');
  let reader = new FileReader;
  let readerEvent = this.openFile.bind(this);
  reader.onload = function(e) {
    readerEvent(file, file_entry, e.target.result, callback, scope);
  };
  reader.readAsText(file);
};


/**
 * @param {!Blob} file
 * @param {Object} file_entry
 * @param {string} content
 * @param {!function(?, ?, ?)} callback
 * @param {Object=} scope
 */
cwc.fileHandler.FileLoader.prototype.openFile = function(file, file_entry,
    content, callback, scope) {
  if (file) {
    callback.call(scope, file, file_entry, content);
  } else {
    this.helper.showError('Unable to open file ' + file + '!');
  }
};
