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
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');
goog.require('cwc.utils.Resources');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.string.path');

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
  this.nodeSearchTerm = null;

  /** @type {Element} */
  this.nodeSearchError = null;

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix);

  /** @type {number} */
  this.numOfFiles_ = 0;

  /** @private {Shepherd.Tour} */
  this.tour_ = null;

  /** @private {!cwc.utils.Logger|null} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Decorates the file library.
 */
cwc.ui.Library.prototype.decorate = function() {
  let layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    let eventHandler = layoutInstance.getEventHandler();
    this.events_.listen(eventHandler, goog.events.EventType.UNLOAD,
        this.cleanUp, false, this);
  }

  let nodeAddFile = goog.dom.getElement(this.prefix + 'add-file');
  let nodeAll = goog.dom.getElement(this.prefix + 'all');
  let nodeAudio = goog.dom.getElement(this.prefix + 'audio');
  let nodeImages = goog.dom.getElement(this.prefix + 'images');
  let nodeSearchButton = goog.dom.getElement(this.prefix + 'search-button');
  let nodeSearchDrop = goog.dom.getElement(this.prefix + 'search-drop');
  this.nodeSearchTerm = goog.dom.getElement(this.prefix + 'search-term');
  this.nodeSearchError = goog.dom.getElement(this.prefix + 'search-error');

  // Drag and Drop events
  this.events_.listen(nodeAddFile, goog.events.EventType.DRAGLEAVE,
    this.handleDragLeave_, false, this);
  this.events_.listen(nodeAddFile, goog.events.EventType.DRAGOVER,
    this.handleDragOver_, false, this);
  this.events_.listen(nodeAddFile, goog.events.EventType.DROP,
    this.handleDrop_, false, this);
  this.events_.listen(nodeSearchDrop, goog.events.EventType.DRAGLEAVE,
    this.handleDragLeave_, false, this);
  this.events_.listen(nodeSearchDrop, goog.events.EventType.DRAGOVER,
    this.handleDragOver_, false, this);
  this.events_.listen(nodeSearchDrop, goog.events.EventType.DROP,
    this.handleDrop_, false, this);

  // Other events
  this.events_.listen(nodeAddFile, goog.events.EventType.CLICK,
    this.selectFileToAdd, false, this);
  this.events_.listen(nodeAll, goog.events.EventType.CLICK,
    this.handleFileClick_, false, this);
  this.events_.listen(nodeAudio, goog.events.EventType.CLICK,
    this.handleFileClick_, false, this);
  this.events_.listen(nodeImages, goog.events.EventType.CLICK,
    this.handleFileClick_, false, this);
  this.events_.listen(nodeSearchButton, goog.events.EventType.CLICK,
    this.handleSearch_, false, this);
  this.events_.listen(this.nodeSearchTerm, goog.events.EventType.KEYUP,
    this.handleSearchKey_, false, this);

  this.prepareTour_();
};


/**
 * Shows the library.
 */
cwc.ui.Library.prototype.showLibrary = function() {
  let dialogInstance = this.helper.getInstance('dialog', true);
  let title = {
    title: 'File library',
    icon: 'perm_media',
  };
  dialogInstance.showTemplate(title, cwc.soy.Library.library, {
    prefix: this.prefix,
    files: this.getFiles(),
  });
  this.decorate();
  this.syncFiles();

  if (this.helper.getAndSetFirstRun(this.name) && this.numOfFiles_ === 0) {
    this.startTour();
  }
};


/**
 * Starts an basic tour.
 */
cwc.ui.Library.prototype.startTour = function() {
  if (this.tour_) {
    this.tour_.start();
  }
};


/**
 * Update the visible library file list.
 * @param {Object=} files
 * @param {string=} mediaType
 */
cwc.ui.Library.prototype.updateLibraryFileList = function(files = null,
    mediaType = '') {
  this.log_.info('Updating library file list ...', mediaType);
  let dialogInstance = this.helper.getInstance('dialog', true);
  dialogInstance.updateTemplate(cwc.soy.Library.library, {
    prefix: this.prefix,
    files: files || this.getFiles(),
    opt_media_type: mediaType || '',
  });
  this.decorate();
};


/**
 * Syncs the files with the library.
 */
cwc.ui.Library.prototype.syncFiles = function() {
  let fileInstance = this.helper.getInstance('file');
  if (fileInstance) {
    this.numOfFiles_ = 0;
    let files = this.getFiles();
    if (files && fileInstance.getFiles().getSize() > 0) {
      this.log_.info('Syncing library ', fileInstance.getFiles().getSize(),
        ' files...');
      let blocklyInstance = this.helper.getInstance('blockly');
      if (blocklyInstance) {
        blocklyInstance.setToolboxFiles(files);
      }
      let editorInstance = this.helper.getInstance('editor');
      if (editorInstance) {
        editorInstance.updateLibraryButton(fileInstance.getFiles().hasFiles());
      }
      this.numOfFiles_ = fileInstance.getFiles().getSize();
    } else if (!goog.isObject(files)) {
      this.log_.error('Library data are in the wrong format!');
    }
  }
};


/**
 * Asks the user to select a file entry to add to the library.
 */
cwc.ui.Library.prototype.selectFileToAdd = function() {
  this.log_.info('Select File to add...');
  let selectEventHandler = this.chooseEntry.bind(this);
  chrome.fileSystem.chooseEntry({}, selectEventHandler);
};


/**
 * Loads the selected file and adds it to the library.
 * @param {?} file_entry
 * @param {?} file_entries
 */
cwc.ui.Library.prototype.chooseEntry = function(file_entry, file_entries) {
  if (file_entry && file_entry.isFile && !file_entries) {
    file_entry.file(this.readFile.bind(this));
  } else if (file_entries) {
    this.log_.error('Too many file entries.');
  } else {
    this.log_.error('Invalid file entry!');
  }
};


/**
 * Reads file content as data URL and adds file to library.
 * @param {!Blob} file
 */
cwc.ui.Library.prototype.readFile = function(file) {
  let reader = new FileReader();
  let readerEvent = this.addFile.bind(this);

  reader.onload = function(event) {
    readerEvent(file.name, event.target.result);
  };
  reader.readAsDataURL(file);
};


/**
 * Reads url content as data URL and adds content to library.
 * @param {!string} url
 */
cwc.ui.Library.prototype.readUrl = function(url) {
  let urlContent = url;

  // Google Image search
  if (url.startsWith('https://www.google.') &&
      url.includes('/imgres?') &&
      url.includes('imgurl=http')) {
    urlContent = decodeURIComponent(/imgurl=([^&]+)/.exec(url)[1]);
  }

  cwc.utils.Resources.getUriAsBase64(urlContent).then((content) => {
    let filename = goog.string.path.baseName(urlContent || '');
    this.addFile(filename, content);
  }).catch((error) => {
    goog.dom.classlist.enable(this.nodeSearchError, 'active', true);
    this.helper.showError(String(error));
  });
};


/**
 * Inserts file macro at the current cursor position into the editor.
 * @param {!string} name
 */
cwc.ui.Library.prototype.insertFileMacro = function(name) {
  let file = this.getFile(name);
  let editorInstance = this.helper.getInstance('editor');
  if (file && editorInstance && editorInstance.isVisible()) {
    editorInstance.insertText(file.getMacroName());
  }
};


/**
 * @param {!string} name
 * @return {cwc.file.File}
 */
cwc.ui.Library.prototype.getFile = function(name) {
  let fileInstance = this.helper.getInstance('file');
  if (fileInstance) {
    return fileInstance.getLibraryFile(name);
  }
  return null;
};


/**
 * @return {Object}
 */
cwc.ui.Library.prototype.getFiles = function() {
  let fileInstance = this.helper.getInstance('file');
  if (!fileInstance) {
    return {};
  }
  let files = fileInstance.getFiles().getFiles();
  let fileList = {};
  if (files && goog.isObject(files)) {
    for (let file in files) {
      if (files.hasOwnProperty(file)) {
        let fileData = files[file];
        let filename = fileData.getName();
        fileList[filename] = {};
        fileList[filename]['content'] = soydata.VERY_UNSAFE.ordainSanitizedUri(
          fileData.getContent());
        fileList[filename]['media_type'] = fileData.getMediaType();
        fileList[filename]['size'] = fileData.getSize();
        fileList[filename]['type'] = fileData.getType();
      }
    }
  }
  return fileList;
};


/**
 * Adds file to library.
 * @param {string} name
 * @param {string} content
 * @param {string=} optType
 */
cwc.ui.Library.prototype.addFile = function(name, content, optType) {
  let fileInstance = this.helper.getInstance('file');
  if (fileInstance) {
    let newFile = fileInstance.addLibraryFile(name, content, optType);
    if (!newFile) {
      this.log_.error('Was not able to add File: ' + newFile);
    } else {
      this.syncFiles();
      this.updateLibraryFileList(null, newFile.getMediaType());
    }
  }
};


/**
 * @private
 * @param {Object} e
 */
cwc.ui.Library.prototype.handleDragLeave_ = function(e) {
  e.stopPropagation();
  e.preventDefault();
  goog.dom.classlist.enable(e.target, 'active', false);
};


/**
 * @private
 * @param {Object} e
 */
cwc.ui.Library.prototype.handleDragOver_ = function(e) {
  e.stopPropagation();
  e.preventDefault();
  goog.dom.classlist.enable(e.target, 'active', true);
  goog.dom.classlist.enable(this.nodeSearchError, 'active', false);
};


/**
 * @private
 * @param {Object} e
 */
cwc.ui.Library.prototype.handleDrop_ = function(e) {
  e.stopPropagation();
  e.preventDefault();
  let dataTransfer = e.getBrowserEvent().dataTransfer;
  if (dataTransfer.files[0]) {
    // Handle files
    this.readFile(dataTransfer.files[0]);
  } else if (dataTransfer.items[0]) {
    // Handle urls
    dataTransfer.items[0].getAsString(this.readUrl.bind(this));
  } else {
    this.log_.info('Unknown data transfer type', dataTransfer);
  }
  goog.dom.classlist.enable(e.target, 'active', false);
};


/**
 * @param {!goog.events.BrowserEvent} e
 * @private
 */
cwc.ui.Library.prototype.handleSearchKey_ = function(e) {
  if (e.key === 'Enter') {
    this.handleSearch_();
  }
};


/**
 * @private
 */
cwc.ui.Library.prototype.handleSearch_ = function() {
  let searchTerm = this.nodeSearchTerm.value || '';
  let searchUrl = 'https://www.google.de/search?as_st=y&tbm=isch&as_q=' +
    searchTerm + '&safe=active&tbs=itp:clipart,sur:fmc';
  this.helper.openUrl(searchUrl);
};


/**
 * @private
 * @param {Object} e
 */
cwc.ui.Library.prototype.handleFileClick_ = function(e) {
  let filename = e.target.dataset['fileName'];
  let fileAction = e.target.dataset['fileAction'];
  this.log_.info('Click action', fileAction, 'for file', filename);
  if (filename && fileAction) {
    switch (fileAction) {
      case 'insertMacro':
        this.insertFileMacro(filename);
        break;
    }
  }
};


/**
 * Clean up the event listener and any other modification.
 */
cwc.ui.Library.prototype.cleanUp = function() {
  this.events_.clear();
};


/**
 * @private
 */
cwc.ui.Library.prototype.prepareTour_ = function() {
  if (!this.helper.checkJavaScriptFeature('shepherd') || this.tour_) {
    return;
  }

  this.tour_ = new Shepherd.Tour({
    'defaults': {
      'classes': 'shepherd-theme-arrows',
      'showCancelLink': true,
    },
  });
  this.tour_.addStep('intro', {
    'title': i18t('File library'),
    'text': this.i18t_('intro', 'The file library is used to managed all of ' +
      'your files for your project.'),
    'attachTo': '#' + this.prefix + 'chrome center',
    'buttons': [{
      'text': i18t('Exit'),
      'action': this.tour_.cancel,
      'classes': 'shepherd-button-secondary',
    }, {
      'text': i18t('Next'),
      'action': this.tour_.next,
      'classes': 'shepherd-button-example-primary',
    }],
  });
  this.tour_.addStep('upload', {
    'title': i18t('File library'),
    'text': this.i18t_('upload_button',
      'Click here to upload a file to your library.'),
    'attachTo': '#' + this.prefix + 'upload-button left',
    'advanceOn': '#' + this.prefix + 'upload-button click',
  });
  this.tour_.addStep('images', {
    'text': this.i18t_('image_tab', 'You will find all image files here.'),
    'attachTo': '#' + this.prefix + 'images_tab bottom',
    'advanceOn': '#' + this.prefix + 'images_tab click',
  });
  this.tour_.addStep('audio', {
    'text': this.i18t_('audio_tab', 'All audio files will be here.'),
    'attachTo': '#' + this.prefix + 'audio_tab bottom',
    'advanceOn': '#' + this.prefix + 'audio_tab click',
  });
  this.tour_.addStep('all', {
    'text': this.i18t_('all_tab', 'All of your files will be here.'),
    'attachTo': '#' + this.prefix + 'all_tab bottom',
    'advanceOn': '#' + this.prefix + 'all_tab click',
  });
  this.tour_.addStep('search', {
    'text': this.i18t_('search_tab',
      'This search will help you to find additional images for your project.'),
    'attachTo': '#' + this.prefix + 'search_tab bottom',
    'advanceOn': '#' + this.prefix + 'search_tab click',
  });
  this.tour_.addStep('close', {
    'text': this.i18t_('close_dialog',
      'To close this window, click the close button.'),
    'attachTo': '#cwc-dialog-close left',
    'buttons': [{
      'text': i18t('Exit'),
      'action': this.tour_.cancel,
      'classes': 'shepherd-button-example-primary',
    }],
  });
};


/**
 * @param {!string} key
 * @param {string=} text
 * @return {string}
 */
cwc.ui.Library.prototype.i18t_ = function(key, text = '') {
  if (text) {
    return i18t(this.name + '__' + key, text);
  }
  return i18t(key);
};
