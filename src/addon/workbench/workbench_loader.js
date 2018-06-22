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

goog.require('cwc.utils.Logger');
goog.require('cwc.utils.Resources');


/**
 * @param {!cwc.utils.Helper} helper
 * @param {!cwc.utils.Database} projectsDb
 * @param {!cwc.utils.Database} imagesDb
 * @constructor
 * @struct
 * @final
 */
cwc.addon.WorkbenchLoader = function(helper, projectsDb, imagesDb) {
  /** @type {string} */
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
  this.projectsApiBase_ = 'https://edu.workbencheducation.com/api/v1/activities/';

  /** @private {string} */
  this.projectsApiAll_ = `${this.projectsApiBase_}?content_channels=1`;
};


/**
 * Loads projects from Workbench
 */
cwc.addon.WorkbenchLoader.prototype.loadProjects = function() {
  const userConfigInstance = this.helper.getInstance('userConfig') || {};
  const isFetchEnabled = userConfigInstance.get(cwc.userConfigType.GENERAL,
    cwc.userConfigName.WORKBENCH_FETCH);

  if (!this.helper.checkFeature('online') || !isFetchEnabled) return;

  cwc.utils.Resources.getUriAsJson(this.projectsApiAll_)
    .then((json) => {
      const projects = json['results'];

      if (projects && projects.length) {
        projects.forEach((project) => {
          const dbKey = project.id;

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
};


/**
 * Loads projects from Workbench
 * @param {number} projectID
 * @param {function(?string=, Object=)} callback
 */
cwc.addon.WorkbenchLoader.prototype.loadSingleProject_ = function(projectID,
    callback) {
  const isDataCorrupt = (data = {}) => !(
    data['name'] &&
    data['steps'] &&
    data['steps'].length &&
    data['steps'].every((step) => step['description'])
  );

  cwc.utils.Resources.getUriAsJson(this.projectsApiBase_ + projectID)
    .then((json) => {
      if (isDataCorrupt(json)) {
        callback(`project data for project with ID ${projectID} is corrupt`);
      } else {
        callback(null, json);
        this.downloadProjectMedia_(json);
      }
    })
    .catch(callback);
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
  cwc.utils.Resources.getUriAsBlob(url)
    .then((blob) => {
      this.imagesDb_.set(url, blob);
    });
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
