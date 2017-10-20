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
  this.filename = '';

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

  /** @type {Array} */
  this.currentFolders = [];

  /** @private {string} */
  this.storagePrefix = '';
};


/**
 * Displays a Google Cloud publish dialog.
 * @param {!string} name
 * @param {!string} content
 * @param {!string} type
 */
cwc.ui.GCloud.prototype.publishDialog = function(name, content, type) {
  let accountInstance = this.helper.getInstance('account', true);
  this.filename = name;
  this.fileContent = content;
  this.fileType = type;
  let callback = (response) => {
    response['projects'].sort((a, b) => {
      let aId = a['projectId'];
      let bId = b['projectId'];
      if (aId < bId) {
        return -1;
      }
      if (aId > bId) {
        return 1;
      }
      return 0;
    });
    this.selectProjectDialog(response['projects']);
  };
  accountInstance.request({
    subdomain: 'cloudresourcemanager',
    path: '/v1/projects',
    params: {
      'pageSize': 1000,
    },
  }, callback);
};


/**
 * Resets Google Cloud dialog.
 */
cwc.ui.GCloud.prototype.clear = function() {
  this.filename = '';
  this.fileContent = '';
  this.fileType = '';
  this.projectId = '';
  this.bucketName = '';
  this.publicUrlPath = '';
  this.currentFolders = [];
  this.storagePrefix = '';
};


/**
 * Populate the project select dropdown.
 * @param {Object} projects Google Cloud Storage project ids.
 */
cwc.ui.GCloud.prototype.selectProjectDialog = function(projects) {
  let dialogInstance = this.helper.getInstance('dialog');
  if (!dialogInstance) return;

  dialogInstance.showTemplate(
    'Publish to Google Cloud', cwc.soy.GCloud.gCloudTemplate, {
      prefix: this.prefix,
      projects: projects,
    });
  let projectsNode = goog.dom.getElement(this.prefix + 'projects');
  let projectChangeListener = (event) => {
    let projectId = event.target.value;
    this.selectProject(projectId);
  };
  goog.events.listen(projectsNode, goog.events.EventType.CHANGE,
    projectChangeListener, false, this);

  // Use last set project id if previously selected.
  if (this.projectId) {
    goog.dom.forms.setValue(projectsNode, this.projectId);
    this.selectProject(this.projectId);
  }
};


/**
 * Project dropdown selected callback. Gets a list of buckets to display.
 * @param {string} projectId The project id selected.
 */
cwc.ui.GCloud.prototype.selectProject = function(projectId) {
  let accountInstance = this.helper.getInstance('account');
  if (!accountInstance) return;
  console.log('Project id chosen: ' + projectId);
  this.projectId = projectId;
  let callback = (response) => {
    response['items'].sort((a, b) => {
      let aId = a['id'];
      let bId = b['id'];
      if (aId < bId) {
        return -1;
      }
      if (aId > bId) {
        return 1;
      }
      return 0;
    });
    this.selectBucketDialog(response['items']);
  };
  accountInstance.request({
    path: '/storage/v1/b',
    params: {
      'project': projectId,
    },
  }, callback);
};


/**
 * Populate the bucket select dropdown.
 * @param {Object} items List of bucket objects for selected project id.
 */
cwc.ui.GCloud.prototype.selectBucketDialog = function(items) {
  let bucketsContainer = goog.dom.getElement(
    this.prefix + 'buckets-container');
  goog.soy.renderElement(
      /** @type {Element} */ (bucketsContainer),
      cwc.soy.GCloud.gCloudBuckets,
      {prefix: this.prefix, items: items}
  );
  let bucketSelect = goog.dom.getElement(this.prefix + 'buckets');
  let bucketChangeListener = (event) => {
    this.currentFolders = [];
    this.storagePrefix = '';
    this.bucketName = event.target.value;
    this.currentDirectory();
  };
  goog.events.listen(bucketSelect, goog.events.EventType.CHANGE,
    bucketChangeListener, false, this);
  goog.dom.append(/** @type {!Node} */ (bucketsContainer), bucketSelect);

  if (this.bucketName) {
    goog.dom.forms.setValue(bucketSelect, this.bucketName);
  } else {
    this.currentFolders = [];
    this.storagePrefix = '';
    this.bucketName = String(goog.dom.forms.getValue(bucketSelect));
  }
  this.currentDirectory();

  let dialogInstance = this.helper.getInstance('dialog');
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


/**
 * Gets folders present with the current storage prefix.
 */
cwc.ui.GCloud.prototype.currentDirectory = function() {
  let accountInstance = this.helper.getInstance('account');
  if (!accountInstance) return;
  let callback = (response) => {
    let foldersContainer = goog.dom.getElement(
        this.prefix + 'folders-container');
    if ('prefixes' in response) {
      let prefixes = response['prefixes'];
      let nextFolders = [];
      for (let i in prefixes) {
        if (Object.prototype.hasOwnProperty.call(prefixes, i)) {
          let folderList = prefixes[i].split('/');
          let folder = folderList[folderList.length - 2];
          nextFolders.push(folder);
        }
      }
      goog.soy.renderElement(
        foldersContainer, cwc.soy.GCloud.gCloudFolders,
        {prefix: this.prefix, currentFolders: this.currentFolders,
          nextFolders: nextFolders}
      );
      let selectFolderEvent = (event) => {
        let selectedFolder = event.target.value;
        this.storagePrefix += selectedFolder + '/';
        this.currentFolders.push(selectedFolder);
        this.currentDirectory();
      };
      let folderPicker = goog.dom.getElement(this.prefix + 'folders-picker');
      goog.events.listenOnce(folderPicker, goog.events.EventType.CHANGE,
        selectFolderEvent, false, this);
    } else {
      goog.soy.renderElement(
        foldersContainer, cwc.soy.GCloud.gCloudFolders,
        {prefix: this.prefix, currentFolders: this.currentFolders,
          nextFolders: []}
      );
    }

    let folderNavButtonClickEvent = (event) => {
      let folderNavButtonId = event.target.id;
      let rootOrIndex = folderNavButtonId.split(
        this.prefix + 'folders-path-')[1];
      if (rootOrIndex === 'root') {
        this.storagePrefix = '';
        this.currentFolders = [];
      } else {
        let clickedIndex = parseInt(rootOrIndex, 10);
        this.storagePrefix = '';
        for (let index = 0; index < clickedIndex + 1; index++) {
          this.storagePrefix += this.currentFolders[index] + '/';
        }
        this.currentFolders = this.currentFolders.splice(0, clickedIndex + 1);
      }
      this.currentDirectory();
    };
    let folderNavElement = goog.dom.getElement(this.prefix + 'folders-nav');
    let folderNavButtons = folderNavElement.getElementsByTagName('button');
    for (let index= 0; index < folderNavButtons.length; index++) {
      let folderNavButton = folderNavButtons[index];
      goog.events.listen(folderNavButton, goog.events.EventType.CLICK,
        folderNavButtonClickEvent, false, this);
    }
  };
  let params = {
    'delimiter': '/',
  };
  if (this.storagePrefix) {
    params['prefix'] = this.storagePrefix;
  }
  accountInstance.request({
    path: '/storage/v1/b/' + this.bucketName + '/o',
    params: params,
  }, callback);
};


/**
 * Publish file in currently selected project, bucket, and folder.
 */
cwc.ui.GCloud.prototype.publish = function() {
  let accountInstance = this.helper.getInstance('account');
  if (!accountInstance) return;
  accountInstance.request({
    path: '/upload/storage/v1/b/' + this.bucketName + '/o',
    method: 'POST',
    params: {
      'uploadType': 'media',
      'name': this.storagePrefix + this.filename,
    },
    content: this.fileContent,
    header: {
      'Content-Type': 'text/html',
    },
  }, this.makePublic.bind(this));
};


/**
 * Makes the published file public.
 */
cwc.ui.GCloud.prototype.makePublic = function() {
  let accountInstance = this.helper.getInstance('account');
  let dialogInstance = this.helper.getInstance('dialog');
  if (!accountInstance) return;
  if (!dialogInstance) return;

  let callback = (response) => {
    this.publicUrlPath = response['bucket'] + '/' + response['name'];
    this.setDialogPublicUrl();
    dialogInstance.setButtonText('publish', 'Republish');
  };
  accountInstance.request({
    path: '/storage/v1/b/' + this.bucketName + '/o/' + encodeURIComponent(
        this.storagePrefix + this.filename),
    method: 'PUT',
    params: {
      'predefinedAcl': 'publicRead',
    },
    header: {
      'Content-Type': 'application/json',
    },
    content: JSON.stringify({
      'contentType': 'text/html',
    }),
  }, callback);
};


/**
 * Display the public url of the published file.
 */
cwc.ui.GCloud.prototype.setDialogPublicUrl = function() {
  let publicUrlContainer = goog.dom.getElement(this.prefix + 'public-url');
  goog.soy.renderElement(publicUrlContainer, cwc.soy.GCloud.gCloudPublicURL, {
    prefix: this.prefix, path: this.publicUrlPath,
    encodedPath: encodeURI(this.publicUrlPath),
  });
};
