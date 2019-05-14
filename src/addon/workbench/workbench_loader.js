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

  /** @private {!Object} */
  this.projectsToLoad_ = {};

  /** @private {!cwc.utils.Database} */
  this.imagesDb_ = imagesDb;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {!Array<Function>} */
  this.loadCompleteListeners_ = [];

  /** @private {string} */
  this.apiDomain_ = 'https://edu.workbencheducation.com/';

  /** @private {string} */
  this.projectDetailEndpoint_ = `${this.apiDomain_}api/v1/activities/`;

  /** @private {string} */
  this.allProjectsEndpoint_ =
    `${this.apiDomain_}api/v2/activities/?content_channels=1`;
};


/**
 * Loads projects from Workbench
 */
cwc.addon.WorkbenchLoader.prototype.loadProjects = function() {
  const userConfigInstance = this.helper.getInstance('userConfig') || {};
  const isFetchEnabled = userConfigInstance.get(cwc.userConfigType.GENERAL,
    cwc.userConfigName.WORKBENCH_FETCH);

  if (!this.helper.checkFeature('online') || !isFetchEnabled) return;

  const loadProjectList = (url = this.allProjectsEndpoint_) => {
    cwc.utils.Resources.getUriAsJson(url)
      .then((json) => {
        const projects = json['results'];
        const nextResultsURL = json['next'];

        if (projects && projects.length) {
          projects.forEach((project) => {
            this.projectsToLoad_[project['id']] = project;
          });
        }

        if (nextResultsURL) {
          loadProjectList(nextResultsURL);
        } else {
          this.pruneDeletedProjectsFromDB_();
          this.loadAllNewOrModifiedProjects_();
        }
      });
  };

  loadProjectList();
};


/**
 * Removes projects from the DB that were deleted on Workbench
 * @private
 */
cwc.addon.WorkbenchLoader.prototype.pruneDeletedProjectsFromDB_ = function() {
  this.projectsDb_.getAll().then((storedProjects) => {
    if (storedProjects && storedProjects.length) {
      storedProjects.forEach((storedProject) => {
        storedProject = JSON.parse(storedProject);
        if (!this.projectsToLoad_[storedProject.id]) {
          this.projectsDb_.delete(storedProject.id);
        }
      });
    }
  });
};


/**
 * Goes through full list of projects and downloads the full project content
 * if the project is new or has been modified since the last download
 * @private
 */
cwc.addon.WorkbenchLoader.prototype.loadAllNewOrModifiedProjects_ = function() {
  const projectListIDs = Object.keys(this.projectsToLoad_);
  let remainingProjectsToLoad = projectListIDs.length;

  const projectLoadComplete = (loadedCount) => {
    remainingProjectsToLoad = remainingProjectsToLoad - loadedCount;
    if (remainingProjectsToLoad === 0) {
      this.fireLoadCompleteListeners_();
    }
  };

  projectLoadComplete(0);

  if (projectListIDs && projectListIDs.length) {
    projectListIDs.forEach((projectID) => {
      projectID = Number(projectID);
      const project = this.projectsToLoad_[projectID];

      this.projectsDb_.get(projectID).then((storedProject) => {
        if (storedProject) {
          storedProject = JSON.parse(storedProject);
        }

        if (!storedProject || (
            storedProject &&
            storedProject['modified'] !== project['modified'])) {
          this.loadSingleProject_(project.id, (err, projectData) => {
            if (err) {
              // remove any project that fails to load
              this.projectsDb_.delete(projectID);
              return;
            } else {
              this.projectsDb_.set(projectID, JSON.stringify(projectData));
            }

            projectLoadComplete(1);
          });
        } else {
          projectLoadComplete(1);
        }
      });
    });
  }
};


/**
 * Loads projects from Workbench
 * @param {number} projectID
 * @param {function(?string=, Object=)} callback
 * @private
 */
cwc.addon.WorkbenchLoader.prototype.loadSingleProject_ = function(projectID,
    callback) {
  const isDataCorrupt = (data = {}) => !(
    data['name'] &&
    data['steps'] &&
    data['steps'].length &&
    data['steps'].every((step) => step['description'])
  );

  cwc.utils.Resources.getUriAsJson(this.projectDetailEndpoint_ + projectID)
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
 * @private
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
 * @private
 */
cwc.addon.WorkbenchLoader.prototype.saveMediaLocal_ = function(url) {
  cwc.utils.Resources.getUriAsBlob(url)
    .then((blob) => {
      this.imagesDb_.set(url, blob);
    });
};


/**
 * Fire all load complete listeners that were added
 * @private
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
