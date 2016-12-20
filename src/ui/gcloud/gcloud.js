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
};

/**
 * Displays a Google Cloud publish dialog.
 */
cwc.ui.GCloud.prototype.publishDialog = function(name, content) {
  var accountInstance = this.helper.getInstance('account');
  var dialogInstance = this.helper.getInstance('dialog');
  if (accountInstance && dialogInstance) {
    console.log('Publish name: ' + name + ' content:' + content);
    accountInstance.request({
      subdomain: 'cloudresourcemanager',
      path: '/v1/projects',
      params: {
        'pageSize': 1000
      }
    }, (function(response) {
      dialogInstance.showTemplate(
        'Publish to Google Cloud', cwc.soy.GCloud.projects, {
          prefix: this.prefix,
          projects: response['projects']
        });
      var projectsNode = goog.dom.getElement(this.prefix + 'projects');
      var projectChangeListener = function(event) {
        var projectId = event.target.value;
        console.log('Project id chosen: ' + projectId);
        accountInstance.request({
          path: '/storage/v1/b',
          params: {
            'project': projectId
          }
        }, (function(response) {
          console.log('items: ' + JSON.stringify(response['items']));
        }).bind(this));
      };
      goog.events.listen(projectsNode, goog.events.EventType.CHANGE,
        projectChangeListener, false, this);
    }).bind(this));
  } else {
    alert('You must log in before publishing.');
  }
};
