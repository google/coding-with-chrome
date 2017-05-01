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

goog.require('cwc.file.ContentType');
goog.require('cwc.file.detector');
goog.require('cwc.fileHandler.Config');
goog.require('cwc.ui.EditorHint');
goog.require('cwc.ui.EditorType');
goog.require('cwc.utils.Helper');
goog.require('goog.net.XhrIo');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.fileHandler.FileLoader = function(helper) {
  /** @type {string} */
  this.name = 'FileLoader';

  /** @type {!Array} */
  this.extensions = helper.getFileExtensions() || [];

  /** @type {!Array} */
  this.acceptedFiles = [{
    'description': 'All supported files',
    'extensions': ['cwc', 'txt', 'html', 'htm', 'js', 'coffee', 'py'],
  }, {
    'description': 'Coding with Chrome file (.cwc)',
    'extensions': ['cwc'],
  },
    {'extensions': ['txt']},
    {'extensions': ['html']},
    {'extensions': ['htm']},
    {'extensions': ['js']},
    {'extensions': ['coffee']},
    {'extensions': ['py']},
  ];

  /** @type {!cwc.utils.Helper} **/
  this.helper = helper;
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
 * @param {!string} content
 */
cwc.fileHandler.FileLoader.prototype.loadFileData = function(file,
    file_entry, content) {
  this.handleFileData(content, file['name'], file_entry);
};


/**
 * @param {!string} file_name
 * @export
 */
cwc.fileHandler.FileLoader.prototype.loadExampleFile = function(
    file_name) {
  console.log('Getting example file:', file_name);
  let fileLoaderHandler = this.loadExampleFileData.bind(this);
  this.getResourceFile('examples/' + file_name, fileLoaderHandler);
};


/**
 * @param {!string} file_name
 * @param {!string} content
 * @export
 */
cwc.fileHandler.FileLoader.prototype.loadExampleFileData = function(
    file_name, content) {
  console.log('Loading example file:', file_name);
  this.handleFileData(content, file_name, null, null, true);
};


/**
 * @param {!string} id
 * @param {!string} file_name
 * @param {!string} content
 * @export
 */
cwc.fileHandler.FileLoader.prototype.loadGDriveFileData = function(id,
    file_name, content) {
  console.log(content);
  this.handleFileData(content, file_name, null, id);
};


/**
 * Handles the file data and sets the file instance accordingly.
 * @param {!string|Object} content
 * @param {string=} opt_file_name
 * @param {Object=} opt_file_handler
 * @param {string=} opt_gdrive_id
 * @param {boolean=} opt_example
 */
cwc.fileHandler.FileLoader.prototype.handleFileData = function(content,
    opt_file_name, opt_file_handler, opt_gdrive_id, opt_example) {
  console.log('Handle file data:', content);
  let fileInstance = this.helper.getInstance('file', true);
  let modeInstance = this.helper.getInstance('mode', true);
  let fileType = cwc.file.detector.detectType(content, opt_file_name);
  console.log('Filetype:', fileType);
  let fileConfig = cwc.fileHandler.Config.get(fileType, true);
  console.log('FileConfig:', fileConfig);
  let file = new fileConfig.file(
    content, fileType, fileConfig.contentType, opt_file_name);

  // If file was not loaded locally or from Google Drive, load default content.
  if (fileConfig.content && !opt_file_handler && !opt_gdrive_id &&
      !opt_example) {
    console.log('Loading default content.');
    file = new fileConfig.file(fileConfig.content, fileType,
        fileConfig.contentType);
  }
  console.log('File:', file, '(', opt_file_name, ')');
  console.log('Content Length:', content.length);

  fileInstance.setFile(file);
  if (opt_file_handler) {
    if (opt_file_handler.name) {
      fileInstance.setFileName(opt_file_handler.name);
    }
    fileInstance.setFileHandler(opt_file_handler);
  } else if (opt_gdrive_id) {
    fileInstance.setGDriveId(opt_gdrive_id);
  }

  // Clear Google Cloud publish settings.
  let gCloudInstance = this.helper.getInstance('gcloud');
  if (gCloudInstance) {
    gCloudInstance.clear();
  }

  // Settings file title.
  let fileTitle = fileInstance.getFileTitle();
  if (!fileTitle && fileInstance.getFileName()) {
    fileTitle = fileInstance.getFileName();
  }
  if (fileTitle) {
    modeInstance.setTitle(fileTitle);
  }

  // Loading mode and preparing UI parts.
  modeInstance.setMode(fileConfig.mode);

  // Adding Blocky content.
  if (fileConfig.blockly_views) {
    for (let i = 0; i < fileConfig.blockly_views.length; i++) {
      let blocklyView = fileConfig.blockly_views[i];
      let blocklyContent = file.getContent(blocklyView);
      modeInstance.addBlocklyView(blocklyContent);
    }
  }

  // Adding editor content.
  if (fileConfig.editor_views) {
    for (let i = 0; i < fileConfig.editor_views.length; i++) {
      let editorView = fileConfig.editor_views[i];
      let editorContent = file.getContent(editorView);
      let editorHint = '';
      let editorType = '';
      switch (editorView) {
        case cwc.file.ContentType.CSS:
          editorType = cwc.ui.EditorType.CSS;
          editorHint = cwc.ui.EditorHint.CSS;
          break;
        case cwc.file.ContentType.HTML:
          editorType = cwc.ui.EditorType.HTML;
          editorHint = cwc.ui.EditorHint.HTML;
          break;
        case cwc.file.ContentType.JAVASCRIPT:
          editorType = cwc.ui.EditorType.JAVASCRIPT;
          editorHint = cwc.ui.EditorHint.JAVASCRIPT;
          break;
        case cwc.file.ContentType.COFFEESCRIPT:
          editorType = cwc.ui.EditorType.COFFEESCRIPT;
          editorHint = cwc.ui.EditorHint.COFFEESCRIPT;
          break;
        case cwc.file.ContentType.TEXT:
          editorType = cwc.ui.EditorType.TEXT;
          break;
        case cwc.file.ContentType.PYTHON:
          editorType = cwc.ui.EditorType.PYTHON;
          break;
      }
      modeInstance.addEditorView(editorView, editorContent, editorType,
        editorHint);
    }
  }

  if (fileConfig.library) {
    modeInstance.syncLibrary();
  }
  if (fileConfig.preview) {
    modeInstance.runPreview();
  }
  if (fileConfig.auto_update) {
    modeInstance.setAutoUpdate(true);
  }

  let fileUi = fileInstance.getUi();
  if (fileUi) {
    if (fileUi == 'blockly') {
      modeInstance.showBlockly();
    } else if (fileUi == 'editor') {
      modeInstance.showEditor();
    }
  }
  this.helper.showSuccess('Loaded file ' + opt_file_name + ' successful.');
};


/**
 * @param {!function(?)} callback
 * @param {Object=} optCallback_scope
 */
cwc.fileHandler.FileLoader.prototype.selectFileToLoad = function(
    callback, optCallback_scope) {
  console.log('Select file to load content for the following types:',
    this.acceptedFiles);
  chrome.fileSystem.chooseEntry({
    'accepts': this.acceptedFiles,
  }, function(file_entry, file_entries) {
    if (chrome.runtime.lastError) {
      let message = chrome.runtime.lastError.message;
      if (message != 'User canceled') {
        this.helper.showWarning(message);
        return;
      }
    }
    if (file_entry && file_entry.isFile && !file_entries) {
      file_entry.file(function(file) {
        console.log('Load file: ' + file_entry.name);
        this.readFile(file, file_entry, callback, optCallback_scope);
      }.bind(this));
    } else if (file_entries) {
      this.helper.showError('Too many file entries.');
    } else {
      this.helper.showWarning('No file was selected!');
    }
  }.bind(this));
};


/**
 * Reads the file content and passes it to the callback.
 *
 * @param {!Blob} file
 * @param {!FileEntry} file_entry
 * @param {!function(?)} callback
 * @param {Object=} optCallback_scope
 */
cwc.fileHandler.FileLoader.prototype.readFile = function(file,
    file_entry, callback, optCallback_scope) {
  console.log('Reading file', file.name, '…');
  let reader = new FileReader;
  let readerEvent = this.openFile.bind(this);
  reader.onload = function(event) {
    readerEvent(file, file_entry, event.target.result, callback,
        optCallback_scope);
  };
  reader.readAsText(file);
};


/**
 * @param {!Blob} file
 * @param {Object} file_entry
 * @param {string} content
 * @param {!function(?, ?, ?)} callback
 * @param {Object=} optCallback_scope
 */
cwc.fileHandler.FileLoader.prototype.openFile = function(file,
    file_entry, content, callback, optCallback_scope) {
  if (file && content) {
    callback.call(optCallback_scope, file, file_entry, content);
  } else {
    this.helper.showError('Unable to open file ' + file + '!');
  }
};


/**
 * @param {string} file
 * @param {Function=} optCallback
 */
cwc.fileHandler.FileLoader.prototype.getResourceFile = function(file,
    optCallback) {
  if (file) {
    console.log('Loading file', file, '...');
    let xhr = new goog.net.XhrIo();
    let xhrEvent = this.resourceFileHandler.bind(this);
    let filename = file.replace(/^.*(\\|\/|\:)/, '');
    goog.events.listen(xhr, goog.net.EventType.SUCCESS, function(e) {
      xhrEvent(e, filename, optCallback);
    });
    goog.events.listen(xhr, goog.net.EventType.ERROR, function(e) {
      this.helper.showError('Unable to open file ' + file + ':' +
          e.target.getLastError());
    });
    xhr.send(file);
  }
};


/**
 * @param {Event} e
 * @param {string} filename
 * @param {function(string, string)=} optCallback
 * @param {Object=} optCallback_scope
 */
cwc.fileHandler.FileLoader.prototype.resourceFileHandler = function(e, filename,
    optCallback, optCallback_scope) {
  let xhr = e.target;
  let content = xhr.getResponseText() || '';
  if (goog.isFunction(optCallback)) {
    optCallback.call(optCallback_scope || this, filename, content);
  } else {
    console.log('Received data for', filename, ':', content);
  }
};
