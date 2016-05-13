/**
 * @fileoverview File loader for the file handler.
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
goog.provide('cwc.fileHandler.FileLoader');

goog.require('cwc.file.ContentType');
goog.require('cwc.file.detector');
goog.require('cwc.fileHandler.Config');
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
 * @param {Function=} opt_callback
 */
cwc.fileHandler.FileLoader.prototype.requestLoadFile = function(opt_callback) {
  var loadFile = function() {
    this.loadFile();
    if (opt_callback) {
      opt_callback();
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
  var fileLoaderHandler = this.loadExampleFileData.bind(this);
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
  console.log('Loading GDrive file', id, ':', file_name);
  console.log(content);
  this.handleFileData(content, file_name, null, id);
};


/**
 * Handles the file data and sets the file instance accordingly.
 * @param {!string} content
 * @param {string=} opt_file_name
 * @param {Object=} opt_file_handler
 * @param {string=} opt_gdrive_id
 * @param {boolean=} opt_example
 */
cwc.fileHandler.FileLoader.prototype.handleFileData = function(content,
    opt_file_name, opt_file_handler, opt_gdrive_id, opt_example) {
  console.log('Handle file data:', content);
  var fileInstance = this.helper.getInstance('file', true);
  var modeInstance = this.helper.getInstance('mode', true);
  var fileType = cwc.file.detector.detectType(
      content, opt_file_name);
  console.log('Filetype', fileType);
  var fileConfig = cwc.fileHandler.Config.get(fileType, true);
  console.log('FileConfig:', fileConfig);
  var file = new fileConfig.file(content, fileType, fileConfig.contentType);

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

  var fileTitle = fileInstance.getFileTitle();
  if (!fileTitle && fileInstance.getFileName()) {
    fileTitle = fileInstance.getFileName();
  }

  if (fileTitle) {
    modeInstance.setTitle(fileTitle);
  }

  modeInstance.setMode(fileConfig.mode);
  if (fileConfig.blockly_views) {
    for (let i = 0; i < fileConfig.blockly_views.length; i++) {
      var blocklyView = fileConfig.blockly_views[i];
      var blocklyContent = file.getContent(blocklyView);
      modeInstance.addBlocklyView(blocklyContent);
    }
  }

  if (fileConfig.editor_views) {
    for (let i = 0; i < fileConfig.editor_views.length; i++) {
      var editorView = fileConfig.editor_views[i];
      var editorContent = file.getContent(editorView);
      var editorFlags = file.getEditorFlags();
      var editorType = '';
      switch (editorView) {
        case cwc.file.ContentType.CSS:
          editorType = cwc.ui.EditorType.CSS;
          break;
        case cwc.file.ContentType.HTML:
          editorType = cwc.ui.EditorType.HTML;
          break;
        case cwc.file.ContentType.JAVASCRIPT:
          editorType = cwc.ui.EditorType.JAVASCRIPT;
          break;
        case cwc.file.ContentType.COFFEESCRIPT:
          editorType = cwc.ui.EditorType.COFFEESCRIPT;
          break;
      }
      modeInstance.addEditorView(editorView, editorContent, editorType);
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
  if (editorFlags) {
    modeInstance.setEditorFlags(editorFlags);
  }

  var fileUi = fileInstance.getUi();
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
 * @param {Object=} opt_callback_scope
 */
cwc.fileHandler.FileLoader.prototype.selectFileToLoad = function(
    callback, opt_callback_scope) {
  console.log('Select file to load content …');
  chrome.fileSystem.chooseEntry({
    'accepts': [{ 'extensions': this.extensions }]
  }, function(file_entry, file_entries) {
    if (chrome.runtime.lastError) {
      var message = chrome.runtime.lastError.message;
      if (message != 'User cancelled') {
        this.helper.showWarning(message);
        return;
      }
    }
    if (file_entry && file_entry.isFile && !file_entries) {
      file_entry.file(function(file) {
        console.log('Load file: ' + file_entry.name);
        this.readFile(file, file_entry, callback, opt_callback_scope);
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
 * @param {Object=} opt_callback_scope
 */
cwc.fileHandler.FileLoader.prototype.readFile = function(file,
    file_entry, callback, opt_callback_scope) {
  console.log('Reading file', file.name, '…');
  var reader = new FileReader;
  var readerEvent = this.openFile.bind(this);
  reader.onload = function(event) {
    readerEvent(file, file_entry, event.target.result, callback,
        opt_callback_scope);
  };
  reader.readAsText(file);
};


/**
 * @param {!Blob} file
 * @param {Object} file_entry
 * @param {string} content
 * @param {!function(?)} callback
 * @param {Object=} opt_callback_scope
 */
cwc.fileHandler.FileLoader.prototype.openFile = function(file,
    file_entry, content, callback, opt_callback_scope) {
  if (file && content) {
    callback.call(opt_callback_scope, file, file_entry, content);
  } else {
    this.helper.error('Unable to open file ' + file + '!');
  }
};


/**
 * @param {string} file
 * @param {Function=} opt_callback
 * @param {Object=} opt_callback_scope
 */
cwc.fileHandler.FileLoader.prototype.getResourceFile = function(file,
    opt_callback, opt_callback_scope) {
  if (file) {
    console.log('Loading file', file, '...');
    var xhr = new goog.net.XhrIo();
    var xhrEvent = this.resourceFileHandler.bind(this);
    var filename = file.replace(/^.*(\\|\/|\:)/, '');
    goog.events.listen(xhr, goog.net.EventType.COMPLETE, function(e) {
      if (e.target.isSuccess()) {
        xhrEvent(e, filename, opt_callback, opt_callback_scope);
      } else {
        this.helper.error('Unable to open file ' + file + ':' +
            e.target.getLastError());
      }
    });
    xhr.send(file);
  }
};


/**
 * @param {Event} e
 * @param {string} filename
 * @param {function(?)=} opt_callback
 * @param {Object=} opt_callback_scope
 */
cwc.fileHandler.FileLoader.prototype.resourceFileHandler = function(e, filename,
    opt_callback, opt_callback_scope) {
  var xhr = e.target;
  var content = xhr.getResponseText() || '';
  if (goog.isFunction(opt_callback)) {
    opt_callback.call(opt_callback_scope || this, filename, content);
  } else {
    console.log('Received data for', filename, ':', content);
  }
};
