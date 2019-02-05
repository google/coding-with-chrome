/**
 * @fileoverview Google Drive integration for the Coding with Chrome editor.
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

goog.provide('cwc.ui.gapi.Drive');

goog.require('cwc.config.GDrive');
goog.require('cwc.soy.GDrive');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');

goog.require('goog.dom.dataset');
goog.require('goog.events.EventType');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.gapi.Drive = function(helper) {
  /** @type {string} */
  this.name = 'GDrive';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('gdrive');

  /** @type {Object} */
  this.data = null;

  /** @type {string} */
  this.dialogType = '';

  /** @type {string} */
  this.mimeType = 'application/cwc';

  /** @type {Element} */
  this.menuCurrent = null;

  /** @type {Object} */
  this.menu = {
    MyFiles: this.getListItem_('My files', this.getMyFiles),
    Recent: this.getListItem_('Recent', this.getRecentFiles),
    Shared: this.getListItem_('Shared with me', this.getSharedFiles),
    Starred: this.getListItem_('Starred', this.getStarredFiles),
    Trash: this.getListItem_('Trash', this.getTrashFiles),
  };

  /** @type {Object} */
  this.dialogMenus = {
    'open': [
      this.menu.MyFiles,
      this.menu.Recent,
      this.menu.Shared,
      this.menu.Starred,
      this.menu.Trash,
    ],
    'save': [
      this.menu.MyFiles,
    ],
  };

  /** @type {Array} */
  this.parents = [];

  /** @type {string} */
  this.saveFileName = '';

  /** @type {string} */
  this.saveFileContent = '';

  /** @type {string} */
  this.saveFileParentId = '';

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name);

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);
};


/**
 * Decorates the file library.
 */
cwc.ui.gapi.Drive.prototype.decorate = function() {
  let layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    let eventTarget = layoutInstance.getEventTarget();
    this.events_.listen(eventTarget, goog.events.EventType.UNLOAD,
        this.cleanUp_, false, this);
  }

  let menuNode = goog.dom.getElement(this.prefix + 'menu');
  let menus = this.dialogMenus[this.dialogType];
  this.menuCurrent = menus[0];
  for (let i = 0; i < menus.length; i++) {
    menuNode.appendChild(menus[i]);
  }
  if (this.dialogType === 'save') {
    let filename = goog.dom.getElement(this.prefix + 'filename');
    goog.soy.renderElement(
      filename,
      cwc.soy.GDrive.gDriveFileName, {
        filename: this.saveFileName,
        prefix: this.prefix,
      }
    );
    let saveButton = goog.dom.getElement(this.prefix + 'save_file');
    saveButton.addEventListener('click', function() {
      let dialogInstance = this.helper.getInstance('dialog', true);
      let fileInstance = this.helper.getInstance('file', true);
      let saveFilename = goog.dom.getElement(this.prefix + 'save_filename');
      fileInstance.setFilename(saveFilename.value || this.saveFileName);
      this.saveFile(saveFilename.value || this.saveFileName,
        this.saveFileContent, undefined, this.saveFileParentId);
      dialogInstance.close();
    }.bind(this));
  }
  cwc.ui.Helper.mdlRefresh();
};


/**
 * Prepares and renders the GDrive result dialog.
 */
cwc.ui.gapi.Drive.prototype.prepareDialog = function() {
  let dialogInstance = this.helper.getInstance('dialog', true);
  let title = {
    title: 'Google Drive',
    icon: 'folder_open',
  };
  dialogInstance.showTemplate(title, cwc.soy.GDrive.gDriveTemplate, {
    prefix: this.prefix,
    type: this.dialogType,
  });
  this.decorate();
};


/**
 * Renders the GDrive result dialog.
 * @param {Object} files Filelist with the result of the search.
 */
cwc.ui.gapi.Drive.prototype.renderDialog = function(files) {
  let fileList = goog.dom.getElement(this.prefix + 'file_list');
  if (!fileList) {
    this.prepareDialog();
  }
  this.updateFileList(files);
};


/**
 * Displays a Google Drive open dialog.
 */
cwc.ui.gapi.Drive.prototype.openDialog = function() {
  this.dialogType = 'open';
  this.getMyFiles();
};


/**
 * Displays a Google Drive save dialog.
 * @param {string} name
 * @param {string} content
 */
cwc.ui.gapi.Drive.prototype.saveDialog = function(name, content) {
  this.dialogType = 'save';
  this.saveFileName = name;
  this.saveFileContent = content;
  this.getMyFiles();
};


/**
 * Returns all files which are created by the user.
 */
cwc.ui.gapi.Drive.prototype.getMyFiles = function() {
  this.switchMenu_(this.menu.MyFiles);
  this.parents = [{name: 'My files', id: 'root'}];
  this.saveFileParentId = 'root';
  let fileEvent = this.handleFileList.bind(this);
  this.getFiles_({
    'pageSize': cwc.config.GDrive.PAGE_SIZE,
    'orderBy': cwc.config.GDrive.ORDER_BY,
    'fields': cwc.config.GDrive.FILE_FIELDS,
    'q': (cwc.config.GDrive.ACCEPTED_MIME_TYPE_QUERY +
       ' and \'me\' in owners and \'root\' ' +
       'in parents and trashed = false'),
  }, fileEvent);
};


/**
 * Navigate down a sub-folder in the Google Drive file browser.
 * @param {string} file
 * @param {boolean=} trashed
 */
cwc.ui.gapi.Drive.prototype.getFolder = function(file, trashed = false) {
  let name = file['name'];
  let id = file ['id'];
  console.log('Navigate to', name, 'folder', id);

  let fileListNode = goog.dom.getElement(this.prefix + 'file_list');
  if (fileListNode) {
    goog.soy.renderElement(
      fileListNode,
      cwc.soy.GDrive.gDriveWait, {
        prefix: this.prefix,
      }
    );
  }
  cwc.ui.Helper.mdlRefresh();

  this.saveFileParentId = id;
  this.parents.push({name: name, id: id});
  let fileEvent = this.handleFileList.bind(this);
  let query = cwc.config.GDrive.ACCEPTED_MIME_TYPE_QUERY + ' and \'' + (
    id + '\' in parents');
  if (trashed) {
    query += ' and trashed = ' + trashed;
  }
  this.getFiles_({
    'pageSize': cwc.config.GDrive.PAGE_SIZE,
    'orderBy': cwc.config.GDrive.ORDER_BY,
    'fields': cwc.config.GDrive.FILE_FIELDS,
    'q': query,
  }, fileEvent);
};


/**
 * Returns all files which are shared with the user.
 */
cwc.ui.gapi.Drive.prototype.getSharedFiles = function() {
  this.switchMenu_(this.menu.Shared);
  this.parents = [{
    name: 'Shared with me', callback: this.getSharedFiles.bind(this)}];
  let fileEvent = this.handleFileList.bind(this);
  this.getFiles_({
    'pageSize': cwc.config.GDrive.PAGE_SIZE,
    'orderBy': cwc.config.GDrive.ORDER_BY,
    'fields': cwc.config.GDrive.FILE_FIELDS,
    'q': (cwc.config.GDrive.ACCEPTED_MIME_TYPE_QUERY +
       ' and sharedWithMe = true and trashed = false'),
  }, fileEvent);
};


/**
 * Returns all marked files from the user.
 */
cwc.ui.gapi.Drive.prototype.getStarredFiles = function() {
  this.switchMenu_(this.menu.Starred);
  this.parents = [{
    name: 'Starred', callback: this.getStarredFiles.bind(this)}];
  let fileEvent = this.handleFileList.bind(this);
  this.getFiles_({
    'pageSize': cwc.config.GDrive.PAGE_SIZE,
    'orderBy': cwc.config.GDrive.ORDER_BY,
    'fields': cwc.config.GDrive.FILE_FIELDS,
    'q': (cwc.config.GDrive.ACCEPTED_MIME_TYPE_QUERY +
      ' and starred = true and trashed = false'),
  }, fileEvent);
};


/**
 * Returns all last opened files by the user.
 */
cwc.ui.gapi.Drive.prototype.getRecentFiles = function() {
  this.switchMenu_(this.menu.Recent);
  this.parents = [{
    name: 'Recent', callback: this.getRecentFiles.bind(this)}];
  let fileEvent = this.handleFileList.bind(this);
  let lastDays = new Date();
  lastDays.setDate(new Date().getDate() - 7);
  this.getFiles_({
    'pageSize': cwc.config.GDrive.PAGE_SIZE,
    'orderBy': cwc.config.GDrive.ORDER_BY,
    'fields': cwc.config.GDrive.FILE_FIELDS,
    'q': (cwc.config.GDrive.ACCEPTED_MIME_TYPE_QUERY +
      ' and viewedByMeTime >= ' +
      '\'' + lastDays.toISOString() + '\' and trashed = false'),
  }, fileEvent);
};


/**
 * Returns all trashed files by the user.
 */
cwc.ui.gapi.Drive.prototype.getTrashFiles = function() {
  this.switchMenu_(this.menu.Trash);
  this.parents = [{
    name: 'Trash', callback: this.getTrashFiles.bind(this)}];
  let fileEvent = this.handleFileList.bind(this);
  this.getFiles_({
    'pageSize': cwc.config.GDrive.PAGE_SIZE,
    'orderBy': cwc.config.GDrive.ORDER_BY,
    'fields': cwc.config.GDrive.FILE_FIELDS,
    'q': (cwc.config.GDrive.ACCEPTED_MIME_TYPE_QUERY + ' and trashed = true'),
  }, fileEvent);
};


/**
 * Updates the GDrive filelist with the new files.
 * @param {Object} files Filelist with the result of the search.
 */
cwc.ui.gapi.Drive.prototype.updateFileList = function(files) {
  goog.soy.renderElement(
    goog.dom.getElement(this.prefix + 'file_list'),
    cwc.soy.GDrive.gDriveFileList,
    {prefix: this.prefix, files: files}
  );
  goog.soy.renderElement(
    goog.dom.getElement(this.prefix + 'file_parents'),
    cwc.soy.GDrive.gDriveParentFolders,
    {prefix: this.prefix, parents: this.parents}
  );

  let elements = goog.dom.getElementsByClass('gdrive-loader');
  for (let i = 0; i < elements.length; ++i) {
    (function() {
      let element = elements[i];
      let loaderEvent = function() {
        let fileId = goog.dom.dataset.get(element, 'id');
        let file = this.data[fileId];
        if (cwc.config.GDrive.MIME_TYPES.indexOf(file['mimeType']) > -1) {
          let dialogInstance = this.helper.getInstance('dialog', true);
          dialogInstance.close();
          this.downloadFile(file);
        } else if (file['mimeType'] === cwc.config.GDrive.FOLDER_MIME_TYPE) {
          this.getFolder(file, false);
        } else {
          console.error('Unsupported file', file);
        }
      };
      this.events_.listen(element, goog.events.EventType.CLICK,
        loaderEvent, false, this);
    }).bind(this)();
  }

  elements = goog.dom.getElementsByClass('cwc-gdrive-parentfolder');
  for (let i = 0; i < elements.length; ++i) {
    (function() {
      let element = elements[i];
      let loaderEvent = function(e) {
        let folderId = e.target.getAttribute('data-gdrive-id');
        let currentParent = null;
        console.log('click file:', JSON.stringify(folderId),
            'parents:', JSON.stringify(this.parents));
        for (let i2 = this.parents.length - 1; i2 >= 0; i2--) {
          currentParent = this.parents[i2];
          this.parents.splice(i2, 1);
          if (currentParent.id === folderId || i2 === 0) {
            break;
          }
        }
        if (currentParent.callback) {
          currentParent.callback();
        } else {
          this.getFolder(
              {'id': currentParent.id, 'name': currentParent.name},
              false);
        }
      };
      this.events_.listen(element, goog.events.EventType.CLICK,
        loaderEvent, false, this);
    }).bind(this)();
  }
};


/**
 * @param {Object} data List of files.
 */
cwc.ui.gapi.Drive.prototype.handleFileList = function(data) {
  this.data = {};
  if ('files' in data) {
    let files = data['files'];
    for (let i = 0; i < files.length; ++i) {
      this.data[files[i]['id']] = files[i];
    }
    this.renderDialog(files);
  }
};


/**
 * @param {string} name
 * @param {string} content
 * @param {string=} id
 * @param {string=} parent_id
 */
cwc.ui.gapi.Drive.prototype.saveFile = function(name, content, id, parent_id) {
  let gapiInstance = this.helper.getInstance('gapi');
  if (name && content && gapiInstance) {
    let path = '/upload/drive/v3/files';
    let contentType = null;
    for (let ext in cwc.config.GDrive.EXT_TO_MIME_TYPE) {
      if (name.endsWith(ext)) {
        contentType = cwc.config.GDrive.EXT_TO_MIME_TYPE[ext];
      }
    }
    if (!contentType) {
      console.error('Unknown filetype: ' + name);
      return;
    }
    let saveEvent = this.handleSaveFile_.bind(this);
    let method = 'POST';
    let metaData = {};
    metaData['name'] = name;
    metaData['mimeType'] = contentType;
    if (parent_id) {
      metaData['parents'] = [parent_id];
    }

    if (id) {
      path = '/upload/drive/v3/files/' + id;
      method = 'PATCH';
    }

    let multipart = [];
    let boundary = '314159265358979323846';
    let delimiter = '--' + boundary;
    let close_delim = '--' + boundary + '--';
    multipart.push(delimiter);
    multipart.push('Content-Type: application/json');
    multipart.push('');
    multipart.push(JSON.stringify(metaData));
    multipart.push(delimiter);
    multipart.push('Content-Type: ' + contentType);
    multipart.push('Content-Transfer-Encoding: base64');
    multipart.push('');
    multipart.push(btoa(content));
    multipart.push(close_delim);

   gapiInstance.request({
      path: path,
      method: method,
      params: {
        'uploadType': 'multipart',
      },
      header: {
        'Content-Type': 'multipart/mixed; boundary=' + boundary,
      },
      content: multipart.join('\r\n'),
    }, saveEvent);
  } else {
    console.error('Save failed for ' + name);
  }
};


/**
 * Downloads and loads the content form the given file instance.
 * @param {Object} file File instance.
 */
cwc.ui.gapi.Drive.prototype.downloadFile = function(file) {
  let gapiInstance = this.helper.getInstance('gapi');
  let fileLoaderInstance = this.helper.getInstance('fileLoader');

  if (file && gapiInstance && fileLoaderInstance) {
    let id = file['id'];
    let name = file['name'];
    console.log('Downloading file: ' + name);
    let loadEvent = function(content) {
      fileLoaderInstance.loadGDriveFileData(id, name, content);
    };

    gapiInstance.request({
      path: '/drive/v3/files/' + id,
      method: 'GET',
      params: {
        'alt': 'media',
      },
    }, loadEvent.bind(this));
  }
};


/**
 * Switch to the clicked on sidebar menu.
 * @param {element} node
 * @private
 */
cwc.ui.gapi.Drive.prototype.switchMenu_ = function(node) {
  if (!node) {
    this.log_.error('Invalid Menu entry point', node);
    return;
  }
  if (this.menuCurrent) {
    this.menuCurrent.classList.remove(this.prefix + 'menu-selected');
  }
  node.classList.add(this.prefix + 'menu-selected');
  this.menuCurrent = node;

  let fileListNode = goog.dom.getElement(this.prefix + 'file_list');
  if (fileListNode) {
    goog.soy.renderElement(
      fileListNode,
      cwc.soy.GDrive.gDriveWait, {
        prefix: this.prefix,
      }
    );
  }
  cwc.ui.Helper.mdlRefresh();
};


/**
 * @param {Object} params
 * @param {function(?)} callback
 * @private
 */
cwc.ui.gapi.Drive.prototype.getFiles_ = function(params, callback) {
  let gapiInstance = this.helper.getInstance('gapi');
  if (gapiInstance) {
    let opts = {
      path: '/drive/v3/files',
      params: params,
    };
    gapiInstance.request(opts, callback);
  }
};


/**
 * @param {string} name
 * @param {!function()} func
 * @return {!Element}
 * @private
 */
cwc.ui.gapi.Drive.prototype.getListItem_ = function(name, func) {
  let text = document.createTextNode(i18t(name));
  let item = goog.dom.createDom(goog.dom.TagName.LI, 'mdl-list__item');
  let primaryContent = goog.dom.createDom(
    goog.dom.TagName.SPAN, 'mdl-list__item-primary-content');
  primaryContent.appendChild(text);
  item.appendChild(primaryContent);
  goog.events.listen(item, goog.events.EventType.CLICK, func.bind(this));
  return item;
};


/**
 * @param {Object} file
 * @private
 */
cwc.ui.gapi.Drive.prototype.handleSaveFile_ = function(file) {
  let fileInstance = this.helper.getInstance('file');
  if (file) {
    this.helper.showInfo('Saved file ' + file['name'] + ' successful.');
    fileInstance.setGDriveId(file['id']);
    this.log_.info('Saved file', file['id']);
  } else {
    this.helper.showError('Was not able to save file!');
    this.log_.error('Save failed for', file);
  }
};


/**
 * @private
 */
cwc.ui.gapi.Drive.prototype.cleanUp_ = function() {
  this.events_.clear();
};
