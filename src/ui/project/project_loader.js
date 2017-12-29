/**
 * @fileoverview Project loader for the Coding with Chrome editor.
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
 * @author mdiehl@workbenchplatform.com (Matt Diehl)
 */
goog.provide('cwc.ui.ProjectLoader');

goog.require('goog.array');
goog.require('goog.net.XhrIo');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.ProjectLoader = function(helper) {
  /** @type {string} */
  this.name = 'Project';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.projectsApiBase = 'https://staging.cwist.com/api/v1/activities/';

  /** @type {string} */
  this.projectsApiAll = `${this.projectsApiBase}?content_channels=1`;
};


/**
 * Loads projects from Workbench
 */
cwc.ui.ProjectLoader.prototype.loadProjects = function() {
  let storage = this.helper.getInstance('storage', true);
  let xhr = new goog.net.XhrIo();
  goog.events.listen(xhr, goog.net.EventType.SUCCESS, function(e) {
    let xhr = /** @type {!goog.net.XhrIo} */ (e.target);
    let data = xhr.getResponseJson() || {};
    let projects = data['results'];
    storage.set('projects', JSON.stringify(projects));

    if (projects && projects.length) {
      projects.forEach((project) => {
        let storedProject = storage.get(`project-${project.id}`);
        if (storedProject) {
          storedProject = JSON.parse(storedProject);
        }
        if (!storedProject || (
            storedProject &&
            storedProject['modified'] !== project['modified'])) {
          this.loadSingleProject_(project.id, (err, projectData) => {
            if (err) {
              // remove any project that fails to load
              goog.array.remove(projects, project);
              storage.set('projects', JSON.stringify(projects));
              this.raiseError(err);
              return;
            }
            storage.set(`project-${project.id}`, JSON.stringify(projectData));
          });
        }
      });
    }
  });
  goog.events.listen(xhr, goog.net.EventType.ERROR, function() {
    this.raiseError('Unable to load projects');
  });
  xhr.send(this.projectsApiAll);
};


/**
 * Loads projects from Workbench
 * @param {number} projectID
 * @param {function(?string=, Object=)} callback
 */
cwc.ui.ProjectLoader.prototype.loadSingleProject_ = function(projectID,
    callback) {
  let xhr = new goog.net.XhrIo();
  let projectsAPI = this.projectsApiBase + projectID;
  goog.events.listen(xhr, goog.net.EventType.SUCCESS, (e) => {
    let xhr = /** @type {!goog.net.XhrIo} */ (e.target);
    let data = xhr.getResponseJson() || {};
    callback(null, data);
    this.downloadProjectMedia_(data);
  });
  goog.events.listen(xhr, goog.net.EventType.ERROR, function() {
    callback(`Unable to load project with ID: ${projectID}`);
  });
  xhr.send(projectsAPI);
};


/**
 * Download project media files
 * @param {Object} projectData
 */
cwc.ui.ProjectLoader.prototype.downloadProjectMedia_ = function(projectData) {
  let images = (projectData['steps'] || []).reduce((acc, step) => {
    return acc.concat(step.images);
  }, []);
  images.forEach((url) => {
    chrome.storage.local.get(url, (store) => {
      let src = store[url];
      // Only download images that don't exist in storage already
      if (!src) {
        this.saveMediaLocal_(url);
      }
    });
  });
};

/**
 * Download project media files
 * @param {string} url
 */
cwc.ui.ProjectLoader.prototype.saveMediaLocal_ = function(url) {
  let fileReader = new FileReader();
  let xhr = new goog.net.XhrIo();
  fileReader.addEventListener('load', () => {
    let dataURL = fileReader.result;
    chrome.storage.local.set({
      [url]: dataURL,
    });
  });
  xhr.setResponseType(goog.net.XhrIo.ResponseType.ARRAY_BUFFER);
  goog.events.listen(xhr, goog.net.EventType.SUCCESS, (e) => {
    let xhr = /** @type {!goog.net.XhrIo} */ (e.target);
    let data = xhr.getResponse() || {};
    let blob = new Blob([data], {type: 'image/png'});
    fileReader.readAsDataURL(blob);
  });
  goog.events.listen(xhr, goog.net.EventType.ERROR, function() {
    this.raiseError(`Failed to download and save image: ${url}`);
  });
  xhr.send(url);
};
