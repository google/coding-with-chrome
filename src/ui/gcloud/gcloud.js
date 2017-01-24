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

  /** @type {string} */
  this.prefix = 'gcloud-';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

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
    'Publish to Google Cloud', cwc.soy.GCloud.projects, {
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
  var bucketSelect = goog.dom.createDom('select', {
    'id': this.prefix + 'buckets'
  });

  for (let i = 0; i < items.length; i++) {
    var item = items[i];
    bucketSelect.appendChild(goog.dom.createDom(
       'option', {'value': item['id']}, item['id']));
  }
  var bucketsContainer = goog.dom.getElement(
    this.prefix + 'buckets-container');
  goog.dom.removeChildren(bucketsContainer);
  goog.dom.append(bucketsContainer,
    goog.dom.createDom(
      'label', {'for': this.prefix + 'buckets'}, 'Bucket Id: '
  ));
  goog.dom.append(bucketsContainer, bucketSelect);

  var dialogInstance = this.helper.getInstance('dialog');
  if (!dialogInstance) return;
  if (this.bucketName) {
    goog.dom.forms.setValue(bucketSelect, this.bucketName);
  }
  if (this.publicUrlPath) {
    this.setDialogPublicUrl(this.publicUrlPath);
    if (!dialogInstance.getButton('publish')) {
      dialogInstance.addButton('publish', 'Republish', this.publish.bind(this));
    }
  } else {
    if (!dialogInstance.getButton('publish')) {
      dialogInstance.addButton('publish', 'Publish', this.publish.bind(this));
    }
  }
};


cwc.ui.GCloud.prototype.publish = function() {
  console.log('Publish name: ' + this.fileName + ' content:' +
    this.fileContent + ' type: ' + this.fileType);

  var accountInstance = this.helper.getInstance('account');
  if (!accountInstance) return;

  var bucketsSelect = goog.dom.getElement(this.prefix + 'buckets');
  this.bucketName = goog.dom.forms.getValue(bucketsSelect);
  accountInstance.request({
    path: '/upload/storage/v1/b/' + this.bucketName + '/o',
    method: 'POST',
    params: {
      'uploadType': 'media',
      'name': this.fileName
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
    console.log('public: ' + JSON.stringify(response));
    this.publicUrlPath = response['bucket'] + '/' + response['name'];
    this.setDialogPublicUrl(this.publicUrlPath);
    dialogInstance.setButtonText('publish', 'Republish');
  }).bind(this);
  accountInstance.request({
    path: '/storage/v1/b/' + this.bucketName + '/o/' + this.fileName,
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

cwc.ui.GCloud.prototype.setDialogPublicUrl = function(publicUrlPath) {
  var urlLink = goog.dom.createDom('a', {
    'id': this.prefix + 'public-url-link',
    'target': '_newtab',
    'href': 'https://storage.googleapis.com/' + encodeURIComponent(
      publicUrlPath)
  }, 'https://storage.googleapis.com/' + publicUrlPath);
  var urlContainer = goog.dom.getElement(this.prefix + 'public-url');
  goog.dom.removeChildren(urlContainer);
  goog.dom.append(urlContainer,
    goog.dom.createDom(
      'label', {'for': this.prefix + 'public-url-link'}, 'Public URL: '
  ));
  goog.dom.append(urlContainer, urlLink);
};
