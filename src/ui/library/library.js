/**
 * @fileoverview File library for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Library');

goog.require('cwc.file.File');
goog.require('cwc.soy.Library');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.events.EventType');

goog.require('soydata');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Library = function(helper) {

  /** @type {string} */
  this.name = 'Library';

  /** @type {Element} */
  this.nodeCounter = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('library');

  /** @type {Element} */
  this.nodeAddFile = null;

  /** @type {Element} */
  this.nodeAll = null;

  /** @type {Element} */
  this.nodeAudio = null;

  /** @type {Element} */
  this.nodeImages = null;

  /** @type {Element} */
  this.nodeSearchButton = null;

  /** @type {Element} */
  this.nodeSearchTerm = null;

  /** @type {Element} */
  this.nodePreview = null;

  /** @type {Array} */
  this.listener = [];

  /** @private {Object} */
  this.tour_ = null;
};


/**
 * Decorates the file library.
 */
cwc.ui.Library.prototype.decorate = function() {
  var layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    var eventHandler = layoutInstance.getEventHandler();
    this.addEventListener(eventHandler, goog.events.EventType.UNLOAD,
        this.cleanUp, false, this);
  }

  this.nodeAddFile = goog.dom.getElement(this.prefix + 'add-file');
  this.nodeAll = goog.dom.getElement(this.prefix + 'all');
  this.nodeAudio = goog.dom.getElement(this.prefix + 'audio');
  this.nodeImages = goog.dom.getElement(this.prefix + 'images');
  this.nodeSearchButton = goog.dom.getElement(this.prefix + 'search-button');
  this.nodeSearchTerm = goog.dom.getElement(this.prefix + 'search-term');

  this.addEventListener(this.nodeAddFile, goog.events.EventType.CLICK,
    this.selectFileToAdd, false, this);
  this.addEventListener(this.nodeAddFile, goog.events.EventType.DRAGLEAVE,
    this.handleDragLeave_, false, this);
  this.addEventListener(this.nodeAddFile, goog.events.EventType.DRAGOVER,
    this.handleDragOver_, false, this);
  this.addEventListener(this.nodeAddFile, goog.events.EventType.DROP,
    this.handleDrop_, false, this);
  this.addEventListener(this.nodeAll, goog.events.EventType.CLICK,
    this.handleFileClick_, false, this);
  this.addEventListener(this.nodeAudio, goog.events.EventType.CLICK,
    this.handleFileClick_, false, this);
  this.addEventListener(this.nodeImages, goog.events.EventType.CLICK,
    this.handleFileClick_, false, this);
  this.addEventListener(this.nodeSearchButton, goog.events.EventType.CLICK,
    this.handleSearch_, false, this);

  this.prepareTour_();
};


/**
 * Shows the library.
 */
cwc.ui.Library.prototype.showLibrary = function() {
  var dialogInstance = this.helper.getInstance('dialog', true);
  dialogInstance.showTemplate('File Library', cwc.soy.Library.template, {
    prefix: this.prefix,
    files: this.getFiles()
  });
  this.decorate();
  this.syncFiles();

  if (this.helper.getAndSetFirstRun(this.name)) {
    this.startTour();
  }
};


/**
 * Starts an basic tour.
 */
cwc.ui.Library.prototype.startTour = function() {
  if (this.tour_) {
    this.tour_['start']();
  }
};


/**
 * Update the visible library file list.
 * @param {Object=} opt_files
 * @param {string=} opt_media_type
 */
cwc.ui.Library.prototype.updateLibraryFileList = function(opt_files,
    opt_media_type) {
  console.log('Updating library file list ...', opt_media_type);
  var dialogInstance = this.helper.getInstance('dialog', true);
  dialogInstance.updateTemplate(cwc.soy.Library.template, {
    prefix: this.prefix,
    files: opt_files || this.getFiles(),
    opt_media_type: opt_media_type
  });
  this.decorate();
};


/**
 * Syncs the files with the library.
 */
cwc.ui.Library.prototype.syncFiles = function() {
  var blocklyInstance = this.helper.getInstance('blockly');
  var editorInstance = this.helper.getInstance('editor');
  var fileInstance = this.helper.getInstance('file');
  if (fileInstance) {
    var files = this.getFiles();
    if (files) {
      console.log('Syncing library ', fileInstance.getFiles().getSize(),
        ' files...');
      if (blocklyInstance) {
        blocklyInstance.updateFiles(files);
      }
      if (editorInstance) {
        editorInstance.updateMediaButton(fileInstance.getFiles().hasFiles());
      }
    } else if (!goog.isObject(files)) {
      console.error('Library data are in the wrong format!');
    }
  }
};


/**
 * Asks the user to select a file entry to add to the library.
 */
cwc.ui.Library.prototype.selectFileToAdd = function() {
  console.log('Select File to add...');
  var selectEventHandler = this.chooseEntry.bind(this);
  chrome.fileSystem.chooseEntry({}, selectEventHandler);
};


/**
 * Loads the selected file and adds it to the library.
 * @param {?} file_entry
 * @param {?} file_entries
 */
cwc.ui.Library.prototype.chooseEntry = function(file_entry,
    file_entries) {
  if (file_entry && file_entry.isFile && !file_entries) {
    file_entry.file(this.readFile.bind(this));
  } else if (file_entries) {
    console.error('Too many file entries.');
  } else {
    console.error('Invalid file entry!');
  }
};


/**
 * Reads file content as data URL and adds file to library.
 * @param {!Blob} file
 */
cwc.ui.Library.prototype.readFile = function(file) {
  var reader = new FileReader();
  var readerEvent = this.addFile.bind(this);

  reader.onload = function(event) {
    readerEvent(file.name, event.target.result);
    console.log(event);
    console.log(event.target);
  };
  reader.readAsDataURL(file);
};


/**
 * Inserts file macro at the current cursor position into the editor.
 * @param {!string} name
 */
cwc.ui.Library.prototype.insertFileMacro = function(name) {
  var file = this.getFile(name);
  var editorInstance = this.helper.getInstance('editor');
  if (file && editorInstance && editorInstance.isVisible()) {
    editorInstance.insertText(file.getMacroName());
  }
};


/**
 * @param {!string} name
 * @return {cwc.file.File}
 */
cwc.ui.Library.prototype.getFile = function(name) {
  var fileInstance = this.helper.getInstance('file');
  if (fileInstance) {
    return fileInstance.getLibraryFile(name);
  }
  return null;
};


/**
 * @return {Object}
 */
cwc.ui.Library.prototype.getFiles = function() {
  var fileInstance = this.helper.getInstance('file');
  if (!fileInstance) {
    return {};
  }
  var files = fileInstance.getFiles().getFiles();
  var fileList = {};
  if (files && goog.isObject(files)) {
    for (let file in files) {
      if (files.hasOwnProperty(file)) {
        var fileData = files[file];
        var fileName = fileData.getName();
        fileList[fileName] = {};
        fileList[fileName]['content'] = soydata.VERY_UNSAFE.ordainSanitizedUri(
          fileData.getContent());
        fileList[fileName]['media_type'] = fileData.getMediaType();
        fileList[fileName]['size'] = fileData.getSize();
        fileList[fileName]['type'] = fileData.getType();
      }
    }
  }
  return fileList;
};


/**
 * Adds file to library.
 * @param {string} name
 * @param {string} content
 * @param {string=} opt_type
 */
cwc.ui.Library.prototype.addFile = function(name, content, opt_type) {
  var fileInstance = this.helper.getInstance('file');
  if (fileInstance) {
    var newFile = fileInstance.addLibraryFile(name, content, opt_type);
    if (!newFile) {
      console.error('Was not able to add File: ' + newFile);
    } else {
      this.syncFiles();
      this.updateLibraryFileList(null, newFile.getMediaType());
    }
  }
};


/**
 * @private
 */
cwc.ui.Library.prototype.handleDragLeave_ = function(e) {
  e.stopPropagation();
  e.preventDefault();
  goog.dom.classlist.enable(e.target, 'active', false);
};


/**
 * @private
 */
cwc.ui.Library.prototype.handleDragOver_ = function(e) {
  e.stopPropagation();
  e.preventDefault();
  goog.dom.classlist.enable(e.target, 'active', true);
};


/**
 * @private
 */
cwc.ui.Library.prototype.handleDrop_ = function(e) {
  e.stopPropagation();
  e.preventDefault();
  var file = e.getBrowserEvent().dataTransfer.files[0];
  if (file) {
    this.readFile(file);
  }
  goog.dom.classlist.enable(e.target, 'active', false);
};


/**
 * @private
 */
cwc.ui.Library.prototype.handleSearch_ = function() {
  var searchTerm = this.nodeSearchTerm.value || '';
  var searchUrl = 'https://www.google.de/search?as_st=y&tbm=isch&as_q=' +
    searchTerm + '&safe=active&tbs=itp:clipart,sur:fmc';
  this.helper.openUrl(searchUrl);
};


/**
 * @private
 */
cwc.ui.Library.prototype.handleFileClick_ = function(e) {
  console.log(e);
  var fileName = e.target.dataset['fileName'];
  var fileAction = e.target.dataset['fileAction'];
  console.log(fileAction, ':', fileName);
  if (fileName && fileAction) {
    switch (fileAction) {
      case 'insertMacro':
        this.insertFileMacro(fileName);
        break;
    }
  }
};


/**
 * Adds an event listener for a specific event on a native event
 * target (such as a DOM element) or an object that has implemented
 * {@link goog.events.Listenable}.
 *
 * @param {EventTarget|goog.events.Listenable} src
 * @param {string} type
 * @param {function(?)} listener
 * @param {boolean=} opt_useCapture
 * @param {Object=} opt_listenerScope
 */
cwc.ui.Library.prototype.addEventListener = function(src, type,
    listener, opt_useCapture, opt_listenerScope) {
  var eventListener = goog.events.listen(src, type, listener, opt_useCapture,
      opt_listenerScope);
  goog.array.insert(this.listener, eventListener);
};


/**
 * Clean up the event listener and any other modification.
 */
cwc.ui.Library.prototype.cleanUp = function() {
  this.listener = this.helper.removeEventListeners(this.listener, this.name);
};


/**
 * @private
 */
cwc.ui.Library.prototype.prepareTour_ = function() {
  if (!this.helper.checkJavaScriptFeature('shepherd') || this.tour_) {
    return;
  }

  this.tour_ = new Shepherd['Tour']({
    'defaults': {
      'classes': 'shepherd-theme-arrows',
      'showCancelLink': true
    }
  });
  this.tour_['addStep']('upload', {
    'text': i18t('This tour will explain some UI parts.'),
    'attachTo': '#cwc-library-upload_tab bottom'
  });
  this.tour_['addStep']('upload', {
    'text': i18t('This tour will explain some UI parts.'),
    'attachTo': '#cwc-library-images_tab bottom'
  });
};
