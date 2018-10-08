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
    myFiles: cwc.ui.Helper.getListItem(
      'My files', this.getMyFiles.bind(this)),
    SharedFiles: cwc.ui.Helper.getListItem(
      'Shared with me', this.getSharedFiles.bind(this)),
    Starred: cwc.ui.Helper.getListItem(
      'Starred', this.getStarredFiles.bind(this)),
    Recent: cwc.ui.Helper.getListItem(
      'Recent', this.getLastOpenedFiles.bind(this)),
    Trash: cwc.ui.Helper.getListItem('Trash', this.getTrashFiles.bind(this)),
  };

  /** @type {Object} */
  this.dialogMenus = {
    'open': [
      this.menu.LastOpenedFiles,
      this.menu.MyFiles,
      this.menu.SharedFiles,
      this.menu.StarredFiles,
      this.menu.TrashFiles,
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
      fileInstance.setFilename(saveFilename);
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
  this.switchMenu(this.menu.MyFiles);
  this.parents = [{name: 'My files', id: 'root'}];
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
 * Fetches all related files from Google drive.
 */
cwc.ui.gapi.Drive.prototype.getFile = function() {
  let fileEvent = this.handleFileList.bind(this);
  this.getFiles_({
    'pageSize': cwc.config.GDrive.PAGE_SIZE,
    'q': 'mimeType = \'' + this.mimeType + '\'',
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
  console.log('Navigate to', name, 'folder');
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
 * Switch to the clicked on sidebar menu.
 * @param {element} node
 */
cwc.ui.gapi.Drive.prototype.switchMenu = function(node) {
  if (this.menuCurrent) {
    this.menuCurrent.classList.remove(this.prefix + 'menu-selected');
  }
  node.classList.add(this.prefix + 'menu-selected');
  this.menuCurrent = node;
};


/**
 * Returns all files which are shared with the user.
 */
cwc.ui.gapi.Drive.prototype.getSharedFiles = function() {
  this.switchMenu(this.menu.SharedFiles);
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
  this.switchMenu(this.menu.StarredFiles);
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
cwc.ui.gapi.Drive.prototype.getLastOpenedFiles = function() {
  this.switchMenu(this.menu.LastOpenedFiles);
  this.parents = [{
    name: 'Recent', callback: this.getLastOpenedFiles.bind(this)}];
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
  this.switchMenu(this.menu.TrashFiles);
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
  let fileList = goog.dom.getElement(this.prefix + 'file_list');
  goog.soy.renderElement(
    fileList,
    cwc.soy.GDrive.gDriveFileList,
    {prefix: this.prefix, files: files}
  );

  let fileParents = goog.dom.getElement(this.prefix + 'file_parents');
  goog.soy.renderElement(
    fileParents,
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
    let saveEvent = this.handleSaveFile.bind(this);
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
 * @param {Object} file
 */
cwc.ui.gapi.Drive.prototype.handleSaveFile = function(file) {
  let fileInstance = this.helper.getInstance('file');
  if (file) {
    this.helper.showInfo('Saved file ' + file['name'] + ' successful.');
    fileInstance.setGDriveId(file['id']);
    console.info('Saved gDrive file: ' + file['id']);
  } else {
    this.helper.showError('Was not able to save file!');
    console.error('Save failed!');
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
 * @param {string} fileId
 * @param {function(?)} callback
 * @return {Promise} to wait on the completion gdrive file request.
 */
cwc.ui.gapi.Drive.prototype.getFile = function(fileId, callback) {
  let gapiInstance = this.helper.getInstance('gapi');
  if (gapiInstance) {
    let opts = {
      path: '/drive/v3/files/' + fileId,
    };
    return gapiInstance.request(opts, callback);
  } else {
    console.error('GDrive.getFile missing account');
  }
};


/**
 * @private
 */
cwc.ui.gapi.Drive.prototype.cleanUp_ = function() {
  this.events_.clear();
};
