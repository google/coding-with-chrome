/**
 * @fileoverview Workbench addon project loader
 *
 * @license Copyright 2018 The Coding with Chrome Authors.
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
goog.provide('cwc.addon.WorkbenchLoader');

goog.require('goog.net.XhrIo');
goog.require('cwc.utils.Logger');


/**
 * @param {!cwc.utils.Helper} helper
 * @param {!cwc.utils.Database} projectsDb
 * @param {!cwc.utils.Database} imagesDb
 * @constructor
 * @struct
 * @final
 */
cwc.addon.WorkbenchLoader = function(helper, projectsDb, imagesDb) {
  /** @type {!string} */
  this.name = 'WorkbenchLoader';

  /** @private {!cwc.utils.Database} */
  this.projectsDb_ = projectsDb;

  /** @private {!cwc.utils.Database} */
  this.imagesDb_ = imagesDb;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {!Array<Function>} */
  this.loadCompleteListeners_ = [];

  /** @private {string} */
  this.projectsApiBase_ = 'https://staging.cwist.com/api/v1/activities/';

  /** @private {string} */
  this.projectsApiAll_ = `${this.projectsApiBase_}?content_channels=1`;
};


/**
 * Loads projects from Workbench
 */
cwc.addon.WorkbenchLoader.prototype.loadProjects = function() {
  if (!this.helper.checkFeature('online')) return;

  let xhr = new goog.net.XhrIo();
  goog.events.listen(xhr, goog.net.EventType.SUCCESS, (e) => {
    let xhr = /** @type {!goog.net.XhrIo} */ (e.target);
    let data = xhr.getResponseJson() || {};
    let projects = data['results'];

    if (projects && projects.length) {
      projects.forEach(async (project) => {
        const dbKey = `project-${project.id}`;

        this.projectsDb_.get(dbKey).then((storedProject) => {
          if (storedProject) {
            storedProject = JSON.parse(storedProject);
          }

          if (!storedProject || (
              storedProject &&
              storedProject['modified'] !== project['modified'])) {
            this.loadSingleProject_(project.id, (err, projectData) => {
              if (err) {
                // remove any project that fails to load
                this.projectsDb_.delete(dbKey);
                return;
              }

              this.projectsDb_.set(dbKey, JSON.stringify(projectData));
            });
          }
        });
      });
    }
  });
  goog.events.listen(xhr, goog.net.EventType.ERROR, function() {
    this.log_.warn('Unable to load projects');
  });
  xhr.send(this.projectsApiAll_);
};


/**
 * Loads projects from Workbench
 * @param {number} projectID
 * @param {function(?string=, Object=)} callback
 */
cwc.addon.WorkbenchLoader.prototype.loadSingleProject_ = function(projectID,
    callback) {
  let xhr = new goog.net.XhrIo();
  let projectsAPI = this.projectsApiBase_ + projectID;
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
cwc.addon.WorkbenchLoader.prototype.downloadProjectMedia_ = function(
  projectData) {
  let images = (projectData['steps'] || []).reduce((acc, step) => {
    return acc.concat(step.images);
  }, []);
  images.forEach((url) => {
    this.imagesDb_.get(url).then((savedImage) => {
      if (!savedImage) {
        this.saveMediaLocal_(url);
      }
    });
  });
};


/**
 * Download project media files
 * @param {string} url
 */
cwc.addon.WorkbenchLoader.prototype.saveMediaLocal_ = function(url) {
  let fileReader = new FileReader();
  let xhr = new goog.net.XhrIo();
  fileReader.addEventListener('load', () => {
    let dataURL = fileReader.result;
    this.imagesDb_.set(url, dataURL);
  });
  xhr.setResponseType(goog.net.XhrIo.ResponseType.ARRAY_BUFFER);
  goog.events.listen(xhr, goog.net.EventType.SUCCESS, (e) => {
    let xhr = /** @type {!goog.net.XhrIo} */ (e.target);
    let data = xhr.getResponse() || {};
    let blob = new Blob([data], {type: 'image/png'});
    fileReader.readAsDataURL(blob);
  });
  goog.events.listen(xhr, goog.net.EventType.ERROR, function() {
    this.log_.warn(`Failed to download and save image: ${url}`);
  });
  xhr.send(url);
};


/**
 * Fire all load complete listeners that were added
 */
cwc.addon.WorkbenchLoader.prototype.fireLoadCompleteListeners_ = function() {
  this.loadCompleteListeners_.forEach((fn) => fn());
};


/**
 * Add a function to be fired after projects have finished downloading
 * @param {Function} fn
 */
cwc.addon.WorkbenchLoader.prototype.onLoadComplete = function(fn) {
  this.loadCompleteListeners_.push(fn);
};
