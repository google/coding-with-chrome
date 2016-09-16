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
  this.dialog = null;

  /** @type {!string} */
  this.mimeType = 'application/cwc';

  /** @type {!goog.ui.MenuItem} */
  this.menuMyFiles = cwc.ui.Helper.getMenuItem('My files', '',
      this.getMyFiles);

  /** @type {!goog.ui.MenuItem} */
  this.menuSharedFiles = cwc.ui.Helper.getMenuItem('Shared with me', '',
      this.getSharedFiles);

  /** @type {!goog.ui.MenuItem} */
  this.menuStarredFiles = cwc.ui.Helper.getMenuItem('Starred', '',
      this.getStarredFiles);

  /** @type {!goog.ui.MenuItem} */
  this.menuLastOpenedFiles = cwc.ui.Helper.getMenuItem('Last opened', '',
      this.getLastOpenedFiles);

  /** @type {!goog.ui.MenuItem} */
  this.menuTrashFiles = cwc.ui.Helper.getMenuItem('Trash', '',
      this.getTrashFiles);
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

  console.log('Decorate', this.name, 'into node', this.node);
  goog.style.installStyles(
      cwc.soy.GDrive.gDriveStyle({ 'prefix': this.prefix })
  );

};


/**
 * Fetches all related files from Google drive.
 */
cwc.ui.GDrive.prototype.getFile = function() {
  var fileEvent = this.handleFileList.bind(this);
  this.getFiles({
    'maxResults': '100',
    'q': 'mimeType = \'' + this.mimeType + '\''
  }, fileEvent);
};


/**
 * Returns all files which are created by the user.
 */
cwc.ui.GDrive.prototype.getMyFiles = function() {
  var fileEvent = this.handleFileList.bind(this);
  this.getFiles({
    'maxResults': '100',
    'q': 'mimeType = \'' + this.mimeType + '\' and \'me\' in owners'
  }, fileEvent);
};


/**
 * Returns all files which are shared with the user.
 */
cwc.ui.GDrive.prototype.getSharedFiles = function() {
  var fileEvent = this.handleFileList.bind(this);
  this.getFiles({
    'maxResults': '100',
    'q': 'mimeType = \'' + this.mimeType + '\' and sharedWithMe = true'
  }, fileEvent);
};


/**
 * Returns als marked files from the user.
 */
cwc.ui.GDrive.prototype.getStarredFiles = function() {
  var fileEvent = this.handleFileList.bind(this);
  this.getFiles({
    'maxResults': '100',
    'q': 'mimeType = \'' + this.mimeType + '\' and starred = true'
  }, fileEvent);
};


/**
 * Returns all last opened files by the user.
 */
cwc.ui.GDrive.prototype.getLastOpenedFiles = function() {
  var fileEvent = this.handleFileList.bind(this);
  var lastDays = new Date().setDate(new Date().getDate() - 7);
  this.getFiles({
    'maxResults': '100',
    'q': 'mimeType = \'' + this.mimeType + '\' and lastViewedByMeDate >= ' +
        '\'' + lastDays.toISOString() + '\''
  }, fileEvent);
};


/**
 * Returns all trasthed files by the user.
 */
cwc.ui.GDrive.prototype.getTrashFiles = function() {
  var fileEvent = this.handleFileList.bind(this);
  this.getFiles({
    'maxResults': '100',
    'q': 'mimeType = \'' + this.mimeType + '\' and trashed = true'
  }, fileEvent);
};


/**
 * Updates the GDrive filelist with the new files.
 * @param {Object} files Filelist with the result of the search.
 */
cwc.ui.GDrive.prototype.updateFileList = function(files) {

  var fileList = goog.dom.getElement(this.prefix + 'filelist');
  goog.soy.renderElement(
      fileList,
      cwc.soy.GDrive.gDriveFileList,
      {'prefix': this.prefix, 'files': files}
  );

  var elements = goog.dom.getElementsByClass('gdrive-loader');
  for (let i2 = 0; i2 < elements.length; ++i2) {
    var element = elements[i2];
    var loaderEvent = function(event) {
      this.dialog.setVisible(false);
      var eventTarget = event.target;
      var fileId = goog.dom.dataset.get(eventTarget, 'id');
      var file = this.data[fileId];
      this.downloadFile(file);
    };
    goog.events.listen(element, goog.events.EventType.CLICK,
        loaderEvent, false, this);
  }
};


/**
 * Prepares and renders the GDrive result dialog.
 */
cwc.ui.GDrive.prototype.prepareDialog = function() {
  if (this.dialog) {
    return;
  }

  var dialog = new goog.ui.Dialog();
  dialog.setTitle('Google Drive');
  dialog.setSafeHtmlContent(cwc.soy.GDrive.gDriveTemplate({
    'prefix': this.prefix}).toSafeHtml());
  dialog.setButtonSet(goog.ui.Dialog.ButtonSet.createOk());
  dialog.setDisposeOnHide(true);
  dialog.render();
  dialog.setVisible(true);

  var menuNode = goog.dom.getElement(this.prefix + 'menu');
  var menu = new goog.ui.Menu();
  menu.addChild(this.menuMyFiles, true);
  menu.addChild(this.menuSharedFiles, true);
  menu.addChild(this.menuStarredFiles, true);
  menu.addChild(this.menuLastOpenedFiles, true);
  menu.addChild(this.menuTrashFiles, true);
  menu.render(menuNode);

  this.dialog = dialog;
};


/**
 * Renders the GDrive result dialog.
 * @param {Object} files Filelist with the result of the search.
 */
cwc.ui.GDrive.prototype.renderDialog = function(files) {
  var fileList = goog.dom.getElement(this.prefix + 'filelist');
  if (!fileList) {
    this.dialog = null;
    this.prepareDialog();
  }
  this.updateFileList(files);
};


/**
 * @param {Object} data List of files.
 */
cwc.ui.GDrive.prototype.handleFileList = function(data) {
  this.data = {};
  if ('items' in data) {
    var files = data['items'];
    for (let i = 0; i < files.length; ++i) {
      this.data[files[i]['id']] = files[i];
    }
    console.log('Google Drive files: ', JSON.stringify(files));
    this.renderDialog(files);
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
      'path': '/drive/v2/files',
      'params': params
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
    var path = '/upload/drive/v2/files';
    var contentType = this.mimeType;
    var saveEvent = this.handleSaveFile.bind(this);
    var method = 'POST';
    var metaData = {};
    metaData['title'] = name;
    metaData['mimeType'] = contentType;

    if (opt_id) {
      path = '/upload/drive/v2/files/' + opt_id;
      method = 'PUT';
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
    console.error('Save failed !!!');
  }
};


/**
 * @param {Object} file
 */
cwc.ui.GDrive.prototype.handleSaveFile = function(file) {
  var fileInstance = this.helper.getInstance('file');
  if (file) {
    this.helper.showInfo('Saved file ' + file.title + ' successful.');
    fileInstance.setGDriveId(file.id);
    console.info('Saved gDrive file: ' + file.id);
  } else {
    this.helper.showError('Was not able to save file ' + file.title + ' !');
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
    console.log('Downloading file ' + file.title);
    var path = file.downloadUrl;
    var method = 'GET';
    var loadEvent = function(content) {
      fileLoaderInstance.loadGDriveFileData(file.id, file.title, content);
    };

    accountInstance.request({
      'path': path,
      'method': method,
      'callback': loadEvent.bind(this),
      'raw': true
    });
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
    fileLoaderInstance.handleFileData(content, file.title, null, file.id);
  } else {
    this.helper.showWarn('Unable to open file ' + file.title + ' !');
  }
};
