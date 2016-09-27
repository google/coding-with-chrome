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

goog.provide('cwc.ui.GDrive');

goog.require('cwc.soy.GDrive');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Helper');
goog.require('goog.dom.dataset');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.Dialog');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuItem');


var PAGE_SIZE = 1000;
var ORDER_BY = 'folder,modifiedTime desc,name';
var FILE_FIELDS = (
    'files(id,mimeType,parents,iconLink,modifiedTime,name,owners)');
var FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';
var EXT_TO_MIME_TYPE = {
  'py':   'text/python',
  'html': 'text/html',
  'cwc':  'application/cwc',
};

var MIME_TYPES = [];
var ACCEPTED_MIME_TYPE_QUERY = '(';
for (var ext in EXT_TO_MIME_TYPE) {
  var mimeType = EXT_TO_MIME_TYPE[ext];
  ACCEPTED_MIME_TYPE_QUERY += (
    'mimeType = \'' + mimeType + '\' or ');
  MIME_TYPES.push(mimeType);
}
ACCEPTED_MIME_TYPE_QUERY += (
  'mimeType = \'application/vnd.google-apps.folder\')');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.GDrive = function(helper) {
  /** @type {string} */
  this.name = 'GDrive';

  /** @type {string} */
  this.prefix = 'gdrive-';

  /** @type {Element} */
  this.node = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {Object} */
  this.data = null;

  /** @type {goog.ui.Dialog} */
  this.openDialog = null;

  /** @type {!string} */
  this.mimeType = 'application/cwc';

  /** @type {!goog.ui.MenuItem} */
  this.menuMyFiles = cwc.ui.Helper.getListItem(
    'My files', this.getMyFiles.bind(this));

  /** @type {!goog.ui.MenuItem} */
  this.menuSharedFiles = cwc.ui.Helper.getListItem(
    'Shared with me', this.getSharedFiles.bind(this));

  /** @type {!goog.ui.MenuItem} */
  this.menuStarredFiles = cwc.ui.Helper.getListItem(
    'Starred', this.getStarredFiles.bind(this));

  /** @type {!goog.ui.MenuItem} */
  this.menuLastOpenedFiles = cwc.ui.Helper.getListItem(
    'Last opened', this.getLastOpenedFiles.bind(this));

  /** @type {!goog.ui.MenuItem} */
  this.menuTrashFiles = cwc.ui.Helper.getListItem(
    'Trash', this.getTrashFiles.bind(this));

};


/**
 * Decorates the given node and adds the code editor.
 * @param {Element} node The target node.
 * @param {string=} opt_prefix Additional prefix for the ids of the
 *    inserted elements and style definitions.
 */
cwc.ui.GDrive.prototype.decorate = function(node, opt_prefix) {
  this.node = node;
  this.prefix = opt_prefix + this.prefix;

  console.log(
    'Decorate', this.name, 'into node', this.node, 'with prefix', this.prefix);
  var gdriveStyles = cwc.soy.GDrive.gDriveStyle({ 'prefix': this.prefix });
  console.log('gdriveStyles: ' + gdriveStyles);
  goog.style.installStyles(gdriveStyles);
};


/**
 * Fetches all related files from Google drive.
 */
cwc.ui.GDrive.prototype.getFile = function() {
  var fileEvent = this.handleFileList.bind(this);
  this.getFiles({
    'pageSize': PAGE_SIZE,
    'q': 'mimeType = \'' + this.mimeType + '\''
  }, fileEvent);
};


/**
 * Returns all files which are created by the user.
 */
cwc.ui.GDrive.prototype.getMyFiles = function() {
  this.switchMenu(this.menuMyFiles);
  var fileEvent = this.handleFileList.bind(this);
  this.getFiles({
    'pageSize': PAGE_SIZE,
    'orderBy': ORDER_BY,
    'fields': FILE_FIELDS,
    'q': (ACCEPTED_MIME_TYPE_QUERY + ' and \'me\' in owners and \'root\' ' +
       'in parents and trashed = false')
  }, fileEvent);
};


cwc.ui.GDrive.prototype.getSubFolder = function(parentId, trashed) {
  var fileEvent = this.handleFileList.bind(this);
  var query = ACCEPTED_MIME_TYPE_QUERY + ' and \'' + parentId + '\' in parents';
  if (typeof trashed === 'boolean') {
    query += ' and trashed = ' + trashed;
  }
  this.getFiles({
    'pageSize': PAGE_SIZE,
    'orderBy': ORDER_BY,
    'fields': FILE_FIELDS,
    'q': query
  }, fileEvent);
};

cwc.ui.GDrive.prototype.switchMenu = function(node) {
  if (this.menuCurrent) {
    this.menuCurrent.classList.remove(this.prefix + 'menu-selected');
  }
  node.classList.add(this.prefix + 'menu-selected');
  this.menuCurrent = node;
};

/**
 * Returns all files which are shared with the user.
 */
cwc.ui.GDrive.prototype.getSharedFiles = function() {
  this.switchMenu(this.menuSharedFiles);
  var fileEvent = this.handleFileList.bind(this);
  this.getFiles({
    'pageSize': PAGE_SIZE,
    'orderBy': ORDER_BY,
    'fields': FILE_FIELDS,
    'q': (ACCEPTED_MIME_TYPE_QUERY + ' and sharedWithMe = true and ' +
       'trashed = false')
  }, fileEvent);
};


/**
 * Returns als marked files from the user.
 */
cwc.ui.GDrive.prototype.getStarredFiles = function() {
  this.switchMenu(this.menuStarredFiles);
  var fileEvent = this.handleFileList.bind(this);
  this.getFiles({
    'pageSize': PAGE_SIZE,
    'orderBy': ORDER_BY,
    'fields': FILE_FIELDS,
    'q': (ACCEPTED_MIME_TYPE_QUERY + ' and starred = true and ' +
      'trashed = false')
  }, fileEvent);
};


/**
 * Returns all last opened files by the user.
 */
cwc.ui.GDrive.prototype.getLastOpenedFiles = function() {
  this.switchMenu(this.menuLastOpenedFiles);
  var fileEvent = this.handleFileList.bind(this);
  var lastDays = new Date().setDate(new Date().getDate() - 7);
  this.getFiles({
    'pageSize': PAGE_SIZE,
    'orderBy': ORDER_BY,
    'fields': FILE_FIELDS,
    'q': (ACCEPTED_MIME_TYPE_QUERY + ' and lastViewedByMeDate >= ' +
        '\'' + lastDays.toISOString() + '\' and trashed = false')
  }, fileEvent);
};


/**
 * Returns all trasthed files by the user.
 */
cwc.ui.GDrive.prototype.getTrashFiles = function() {
  this.switchMenu(this.menuTrashFiles);
  var fileEvent = this.handleFileList.bind(this);
  this.getFiles({
    'pageSize': PAGE_SIZE,
    'orderBy': ORDER_BY,
    'fields': FILE_FIELDS,
    'q': ACCEPTED_MIME_TYPE_QUERY + ' and trashed = true'
  }, fileEvent);
};


/**
 * Updates the GDrive filelist with the new files.
 * @param {Object} files Filelist with the result of the search.
 */
cwc.ui.GDrive.prototype.updateOpenFileList = function(files) {

  var fileList = goog.dom.getElement(this.prefix + 'filelist');
  goog.soy.renderElement(
      fileList,
      cwc.soy.GDrive.gDriveFileList,
      {'prefix': this.prefix, 'files': files}
  );

  var elements = goog.dom.getElementsByClass('gdrive-loader');
  for (let i2 = 0; i2 < elements.length; ++i2) {
    (function() {
      var element = elements[i2];
      var loaderEvent = function() {
        this.openDialog.setVisible(false);
        var fileId = goog.dom.dataset.get(element, 'id');
        var file = this.data[fileId];
        if (MIME_TYPES.indexOf(file['mimeType']) > -1) {
          this.downloadFile(file);
        } else if (file['mimeType'] === FOLDER_MIME_TYPE) {
          this.getSubFolder(file['id'], false);
        }
      };
      goog.events.listen(element, goog.events.EventType.CLICK,
        loaderEvent, false, this);
    }).bind(this)();
  }
};


/**
 * Prepares and renders the GDrive result dialog.
 * @param {Array} menus List of menus to render on the sidebar.
 */
cwc.ui.GDrive.prototype.prepareDialog = function(menus) {

  var dialog = new goog.ui.Dialog();
  dialog.setTitle('Google Drive');
  dialog.setSafeHtmlContent(cwc.soy.GDrive.gDriveTemplate({
    'prefix': this.prefix}).toSafeHtml());
  dialog.setButtonSet(goog.ui.Dialog.ButtonSet.createOk());
  dialog.setDisposeOnHide(true);
  dialog.render();
  dialog.setVisible(true);

  var menuNode = goog.dom.getElement(this.prefix + 'menu');
  this.menuCurrent = menus[0];
  for (var i = 0; i < menus.length; i++) {
    menuNode.appendChild(menus[i]);
  }
  cwc.ui.Helper.mdlRefresh();

  return dialog;
};


/**
 * Renders the GDrive result dialog.
 * @param {Object} files Filelist with the result of the search.
 */
cwc.ui.GDrive.prototype.renderOpenDialog = function(files) {
  var fileList = goog.dom.getElement(this.prefix + 'filelist');
  if (!fileList) {
    this.openDialog = this.prepareDialog([
      this.menuMyFiles, this.menuSharedFiles, this.menuStarredFiles,
      this.menuLastOpenedFiles, this.menuTrashFiles]);
  }
  this.updateOpenFileList(files);
};


/**
 * @param {Object} data List of files.
 */
cwc.ui.GDrive.prototype.handleFileList = function(data) {
  this.data = {};
  if ('files' in data) {
    var files = data['files'];
    for (let i = 0; i < files.length; ++i) {
      this.data[files[i]['id']] = files[i];
    }
    this.renderOpenDialog(files);
  }
};


/**
 * @param {Object} params
 * @param {function(?)} callback
 */
cwc.ui.GDrive.prototype.getFiles = function(params, callback) {
  var accountInstance = this.helper.getInstance('account');
  console.log('Requesting Google Drive files: ' + params['q']);
  if (accountInstance) {
    var opts = {
      path: '/drive/v3/files',
      params: params
    };
    accountInstance.request(opts, callback);
  }
};


/**
 * @param {!string} name
 * @param {!string} content
 * @param {string=} opt_id
 */
cwc.ui.GDrive.prototype.saveFile = function(name, content, opt_id) {
  var accountInstance = this.helper.getInstance('account');
  if (name && content && accountInstance) {
    var path = '/upload/drive/v3/files';
    var contentType = null;
    for (var ext in EXT_TO_MIME_TYPE) {
      if (name.endsWith(ext)) {
        contentType = EXT_TO_MIME_TYPE[ext];
      }
    }
    if (!contentType) {
      console.error('Unknown filetype: ' + name);
      return;
    }
    var saveEvent = this.handleSaveFile.bind(this);
    var method = 'POST';
    var metaData = {};
    metaData['title'] = name;
    metaData['mimeType'] = contentType;

    if (opt_id) {
      path = '/upload/drive/v3/files/' + opt_id;
      method = 'PATCH';
    }

    var multipart = [];
    var boundary = '314159265358979323846';
    var delimiter = '--' + boundary;
    var close_delim = '--' + boundary + '--';
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

    accountInstance.request({
      path: path,
      method: method,
      params: {
        'uploadType': 'multipart'
      },
      header: {
        'Content-Type': 'multipart/mixed; boundary=' + boundary
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
cwc.ui.GDrive.prototype.handleSaveFile = function(file) {
  var fileInstance = this.helper.getInstance('file');
  if (file) {
    this.helper.showInfo('Saved file ' + file['name'] + ' successful.');
    fileInstance.setGDriveId(file['id']);
    console.info('Saved gDrive file: ' + file['id']);
  } else {
    this.helper.showError('Was not able to save file ' + file['name'] + ' !');
    console.error('Save failed!');
  }
};


/**
 * Downloads and loads the content form the given file instance.
 * @param {Object} file File instance.
 */
cwc.ui.GDrive.prototype.downloadFile = function(file) {
  var accountInstance = this.helper.getInstance('account');
  var fileLoaderInstance = this.helper.getInstance('fileLoader');

  if (file && accountInstance && fileLoaderInstance) {
    var id = file['id'];
    var name = file['name'];
    console.log('Downloading file: ' + name);
    var loadEvent = function(content) {
      fileLoaderInstance.loadGDriveFileData(id, name, content);
    };

    accountInstance.request({
      path: '/drive/v3/files/' + id,
      method: 'GET',
      params: {
        'alt': 'media'
      }
    }, loadEvent.bind(this));
  }
};


/**
 * @param {Object} file The file instance.
 * @param {string} content The file content.
 * @param {function(?)=} opt_callback
 * @param {Object=} opt_callback_scope
 */
cwc.ui.GDrive.prototype.loadFileContent = function(file, content,
    opt_callback, opt_callback_scope) {
  var fileLoaderInstance = this.helper.getInstance('fileLoader');
  if (content) {
    console.log('Load file content …');
    console.log(content);
    fileLoaderInstance.handleFileData(content, file['name'], null, file['id']);
  } else {
    this.helper.showWarn('Unable to open file ' + file['title'] + ' !');
  }
};
