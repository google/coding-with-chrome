/**
 * @fileoverview Google Drive integration for the Coding with Chrome editor.
 *
 * @license Copyright 2016 The Coding with Chrome Authors.
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
 * @author efuquen@google.com (Edwin Fuquen)
 */

goog.provide('cwc.ui.GCloud');

goog.require('goog.dom');
goog.require('goog.dom.forms');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.style');

goog.require('cwc.soy.GCloud');
goog.require('cwc.utils.Helper');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.GCloud = function(helper) {
  /** @type {string} */
  this.name = 'GCloud';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = 'gcloud-';

  /** @type {string} */
  this.fileName = '';

  /** @type {string} */
  this.fileContent = '';

  /** @type {string} */
  this.fileType = '';

  /** @type {string} */
  this.projectId = '';

  /** @type {string} */
  this.bucketName = '';

  /** @type {string} */
  this.publicUrlPath = '';

  /** @type {string} */
  this.storagePrefix = '';

  /** @type {list} */
  this.currentFolders = [];
};


/**
 * Displays a Google Cloud publish dialog.
 */
cwc.ui.GCloud.prototype.publishDialog = function(name, content, type) {
  var accountInstance = this.helper.getInstance('account');
  if (!accountInstance) return;

  this.fileName = name;
  this.fileContent = content;
  this.fileType = type;
  var callback = (function(response) {
    response['projects'].sort(function(a, b) {
      var aId = a['projectId'];
      var bId = b['projectId'];
      if (aId < bId) {
        return -1;
      }
      if (aId > bId) {
        return 1;
      }
      return 0;
    });
    this.selectProjectDialog(response['projects']);
  }).bind(this);
  accountInstance.request({
    subdomain: 'cloudresourcemanager',
    path: '/v1/projects',
    params: {
      'pageSize': 1000
    }
  }, callback);
};


cwc.ui.GCloud.prototype.clear = function() {
  this.fileName = '';
  this.fileContent = '';
  this.fileType = '';
  this.projectId = '';
  this.bucketName = '';
  this.publicUrlPath = '';
};


cwc.ui.GCloud.prototype.selectProjectDialog = function(projects) {
  var dialogInstance = this.helper.getInstance('dialog');
  if (!dialogInstance) return;

  dialogInstance.showTemplate(
    'Publish to Google Cloud', cwc.soy.GCloud.gCloudTemplate, {
      prefix: this.prefix,
      projects: projects
    });
  var projectsNode = goog.dom.getElement(this.prefix + 'projects');
  var projectChangeListener = (function(event) {
    var projectId = event.target.value;
    this.selectProject(projectId);
  }).bind(this);
  goog.events.listen(projectsNode, goog.events.EventType.CHANGE,
    projectChangeListener, false, this);

  //Use last set project id if previously selected.
  if (this.projectId) {
    goog.dom.forms.setValue(projectsNode, this.projectId);
    this.selectProject(this.projectId);
  }
};


cwc.ui.GCloud.prototype.selectProject = function(projectId) {
  var accountInstance = this.helper.getInstance('account');
  if (!accountInstance) return;
  console.log('Project id chosen: ' + projectId);
  this.projectId = projectId;
  var callback = (function(response) {
    response['items'].sort(function(a, b) {
      var aId = a['id'];
      var bId = b['id'];
      if (aId < bId) {
        return -1;
      }
      if (aId > bId) {
        return 1;
      }
      return 0;
    });
    this.selectBucketDialog(response['items']);
  }).bind(this);
  accountInstance.request({
    path: '/storage/v1/b',
    params: {
      'project': projectId
    }
  }, callback);
};


cwc.ui.GCloud.prototype.selectBucketDialog = function(items) {
  var bucketsContainer = goog.dom.getElement(
    this.prefix + 'buckets-container');
  goog.soy.renderElement(
      bucketsContainer,
      cwc.soy.GCloud.gCloudBuckets,
      {prefix: this.prefix, items: items}
  );
  var bucketSelect = goog.dom.getElement(this.prefix + 'buckets');
  var bucketChangeListener = (function(event) {
    this.currentFolders = [];
    this.storagePrefix = '';
    this.bucketName = event.target.value;
    this.currentDirectory();
  }).bind(this);
  goog.events.listen(bucketSelect, goog.events.EventType.CHANGE,
    bucketChangeListener, false, this);
  goog.dom.append(bucketsContainer, bucketSelect);

  if (this.bucketName) {
    goog.dom.forms.setValue(bucketSelect, this.bucketName);
  } else {
    this.currentFolders = [];
    this.storagePrefix = '';
    this.bucketName = goog.dom.forms.getValue(bucketSelect);
  }
  this.currentDirectory();

  var dialogInstance = this.helper.getInstance('dialog');
  if (!dialogInstance) return;
  if (this.publicUrlPath) {
    this.setDialogPublicUrl();
    if (!dialogInstance.getButton('publish')) {
      dialogInstance.addButton('publish', 'Republish', this.publish.bind(this));
    }
  } else {
    if (!dialogInstance.getButton('publish')) {
      dialogInstance.addButton('publish', 'Publish', this.publish.bind(this));
    }
  }
};

cwc.ui.GCloud.prototype.currentDirectory = function() {
  var accountInstance = this.helper.getInstance('account');
  if (!accountInstance) return;
  var callback = (function(response) {
    var foldersContainer = goog.dom.getElement(
        this.prefix + 'folders-container');
    if ('prefixes' in response) {
      var prefixes = response['prefixes'];
      var nextFolders = [];
      for (var i in prefixes) {
        var folderList = prefixes[i].split('/');
        var folder = folderList[folderList.length - 2];
        nextFolders.push(folder);
      }
      goog.soy.renderElement(
        foldersContainer, cwc.soy.GCloud.gCloudFolders,
        {prefix: this.prefix, currentFolders: this.currentFolders,
          nextFolders: nextFolders}
      );
      var selectFolderEvent = (function(event) {
        var selectedFolder = event.target.value;
        this.storagePrefix += selectedFolder + '/';
        this.currentFolders.push(selectedFolder);
        this.currentDirectory();
      }).bind(this);
      var folderPicker = goog.dom.getElement(this.prefix + 'folders-picker');
      goog.events.listenOnce(folderPicker, goog.events.EventType.CHANGE,
        selectFolderEvent, false, this);
    } else {
      goog.soy.renderElement(
        foldersContainer, cwc.soy.GCloud.gCloudFolders,
        {prefix: this.prefix, currentFolders: this.currentFolders,
          nextFolders: []}
      );
    }

    var folderNavButtonClickEvent = (function(event) {
      var folderNavButtonId = event.target.id;
      var rootOrIndex = folderNavButtonId.split(
        this.prefix + 'folders-path-')[1];
      if (rootOrIndex === 'root') {
        this.storagePrefix = '';
        this.currentFolders = [];
      } else {
        var clickedIndex = parseInt(rootOrIndex);
        this.storagePrefix = '';
        for (var index = 0; index < clickedIndex + 1; index++) {
          this.storagePrefix += this.currentFolders[index] + '/';
        }
        this.currentFolders = this.currentFolders.splice(0, clickedIndex + 1);
      }
      this.currentDirectory();
    }).bind(this);
    var folderNavElement = goog.dom.getElement(this.prefix + 'folders-nav');
    var folderNavButtons = folderNavElement.getElementsByTagName('button');
    for (var index= 0; index < folderNavButtons.length; index++) {
      var folderNavButton = folderNavButtons[index];
      goog.events.listen(folderNavButton, goog.events.EventType.CLICK,
        folderNavButtonClickEvent, false, this);
    }
  }).bind(this);
  var params = {
    'delimiter': '/'
  };
  if (this.storagePrefix) {
    params['prefix'] = this.storagePrefix;
  }
  accountInstance.request({
    path: '/storage/v1/b/' + this.bucketName + '/o',
    params: params
  }, callback);
};

cwc.ui.GCloud.prototype.publish = function() {
  var accountInstance = this.helper.getInstance('account');
  if (!accountInstance) return;
  accountInstance.request({
    path: '/upload/storage/v1/b/' + this.bucketName + '/o',
    method: 'POST',
    params: {
      'uploadType': 'media',
      'name': this.storagePrefix + this.fileName
    },
    content: this.fileContent,
    header: {
      'Content-Type': 'text/html'
    }
  }, this.makePublic.bind(this));
};

cwc.ui.GCloud.prototype.makePublic = function() {
  var accountInstance = this.helper.getInstance('account');
  var dialogInstance = this.helper.getInstance('dialog');
  if (!accountInstance) return;
  if (!dialogInstance) return;

  var callback = (function(response) {
    this.publicUrlPath = response['bucket'] + '/' + response['name'];
    this.setDialogPublicUrl();
    dialogInstance.setButtonText('publish', 'Republish');
  }).bind(this);
  accountInstance.request({
    path: '/storage/v1/b/' + this.bucketName + '/o/' + encodeURIComponent(
        this.storagePrefix + this.fileName),
    method: 'PUT',
    params: {
      'predefinedAcl': 'publicRead'
    },
    header: {
      'Content-Type': 'application/json'
    },
    content: JSON.stringify({
      'contentType': 'text/html'
    })
  }, callback);
};

cwc.ui.GCloud.prototype.setDialogPublicUrl = function() {
  var publicUrlContainer = goog.dom.getElement(this.prefix + 'public-url');
  goog.soy.renderElement(
    publicUrlContainer, cwc.soy.GCloud.gCloudPublicURL,
    {prefix: this.prefix, path: this.publicUrlPath,
      encodedPath: encodeURIComponent(this.publicUrlPath)}
  );
};
