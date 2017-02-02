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
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.TableSorter');



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
  this.node = null;

  /** @type {Element} */
  this.nodeCounter = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('library');

  /** @type {Element} */
  this.nodeAddFile = null;

  /** @type {Element} */
  this.nodeFile = null;

  /** @type {Element} */
  this.nodePreview = null;

  /** @type {Element} */
  this.nodeEntries = null;

  /** @type {Element} */
  this.nodeContentTable = null;

  /** @type {Array} */
  this.listener = [];
};


/**
 * Decorates the given node and adds the file library.
 * @param {!Element} opt_node The target node to add the file library.
 */
cwc.ui.Library.prototype.decorate = function(node) {
  this.node = node;

  var layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    var eventHandler = layoutInstance.getEventHandler();
    this.addEventListener(eventHandler, goog.events.EventType.UNLOAD,
        this.cleanUp, false, this);
  }
};


/**
 * Decorates the library content.
 */
cwc.ui.Library.prototype.decorateLibrary = function() {
  this.nodeContentTable = goog.dom.getElement(this.prefix +
      'content-table');
  this.nodeEntries = goog.dom.getElement(this.prefix + 'entries');
  this.nodeFile = goog.dom.getElement(this.prefix + 'file');
  this.nodePreview = goog.dom.getElement(this.prefix + 'preview');
  this.syncFiles();

  this.nodeAddFile = goog.dom.getElement(this.prefix + 'add-file');
  this.addEventListener(this.nodeAddFile, goog.events.EventType.CLICK,
    this.selectFileToAdd, false, this);
  this.addEventListener(this.nodeAddFile, goog.events.EventType.DRAGOVER,
    this.handleDragOver_, false, this);
  this.addEventListener(this.nodeAddFile, goog.events.EventType.DROP,
    this.handleDrop_, false, this);

  if (this.nodeContentTable) {
    var tableSorter = new goog.ui.TableSorter();
    tableSorter.decorate(this.nodeContentTable);
    tableSorter.setSortFunction(0, goog.ui.TableSorter.alphaSort);
    tableSorter.setSortFunction(1, goog.ui.TableSorter.alphaSort);
    tableSorter.setSortFunction(2,
        goog.ui.TableSorter.createReverseSort(goog.ui.TableSorter.numericSort));
  }
};


/**
 * @private
 */
cwc.ui.Library.prototype.handleDragOver_ = function(e) {
  e.stopPropagation();
  e.preventDefault();
};


/**
 * @private
 */
cwc.ui.Library.prototype.handleDrop_ = function(e) {
  var file = e.getBrowserEvent().dataTransfer.files[0];
  if (file) {
    this.readFile(file);
  }
  e.stopPropagation();
  e.preventDefault();
};


/**
 * Shows the library.
 */
cwc.ui.Library.prototype.showLibrary = function() {
  var dialogInstance = this.helper.getInstance('dialog', true);
  dialogInstance.showTemplate('File Library', cwc.soy.Library.template, {
    'prefix': this.prefix
  });
  this.decorateLibrary();
};


/**
 * Syncs the files with the library.
 */
cwc.ui.Library.prototype.syncFiles = function() {
  var editorInstance = this.helper.getInstance('editor');
  var fileInstance = this.helper.getInstance('file');
  if (fileInstance && this.nodeEntries) {
    var files = fileInstance.getFiles().getFiles();
    if (files && goog.isObject(files)) {
      this.clearData();
      for (let file in files) {
        if (files.hasOwnProperty(file)) {
          var fileData = files[file];
          this.addLibraryEntry(fileData.getName(), fileData.getType(),
              fileData.getSize());
        }
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
 * Clears library data.
 */
cwc.ui.Library.prototype.clearData = function() {
  console.info('Clearing library …');
  if (this.nodeEntries) {
    goog.dom.removeChildren(this.nodeEntries);
  }
};


/**
 * Asks the user to select a file entry to add to the library.
 */
cwc.ui.Library.prototype.selectFileToAdd = function() {
  console.log('Select File to add …');
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
 * Displays file content for the selected file.
 * @param {Event} event
 */
cwc.ui.Library.prototype.previewFile = function(event) {
  var fileName = event.target.innerText;
  var file = this.getFile(fileName);
  if (file) {
    this.setFileName(file.getName());
    this.nodePreview.src = file.getContent();
  }
};


/**
 * Inserts file macro at the current cursor position into the editor.
 * @param {Event} event
 */
cwc.ui.Library.prototype.insertFileMacro = function(event) {
  var file = this.getFile(event.target.innerText);
  var editorInstance = this.helper.getInstance('editor');
  if (file && editorInstance) {
    var fileMacro = '{{ file:' + file.getName() + ' }}';
    editorInstance.insertText(fileMacro);
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
    }
  }
};


/**
 * Adds file to library overview.
 * @param {string} file_name
 * @param {string} file_type
 * @param {number} file_size
 */
cwc.ui.Library.prototype.addLibraryEntry = function(file_name,
    file_type, file_size) {
  var fileEntry = document.createElement('tr');
  var fileName = document.createElement('td');
  var fileType = document.createElement('td');
  var fileSize = document.createElement('td');
  fileName.innerText = file_name;
  fileType.innerText = file_type;
  fileSize.innerText = file_size;
  fileEntry.appendChild(fileName);
  fileEntry.appendChild(fileType);
  fileEntry.appendChild(fileSize);
  goog.events.listen(fileEntry, goog.events.EventType.CLICK,
      this.previewFile, false, this);
  goog.events.listen(fileEntry, goog.events.EventType.DBLCLICK,
      this.insertFileMacro, false, this);
  this.nodeEntries.appendChild(fileEntry);
};


/**
 * @param {string} file_name
 */
cwc.ui.Library.prototype.setFileName = function(file_name) {
  var fileName = file_name || 'No file selected.';

  if (this.nodeFile) {
    goog.dom.setTextContent(this.nodeFile, fileName);
  } else {
    console.log('Set filename to:', file_name);
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
  this.clearData();
  this.listener = this.helper.removeEventListeners(this.listener, this.name);
};
