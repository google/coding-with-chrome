/**
 * @fileoverview Workbench addon
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
goog.provide('cwc.addon.Workbench');

goog.require('cwc.addon.WorkbenchLoader');
goog.require('cwc.addon.WorkbenchMap');
goog.require('cwc.mode.Type');
goog.require('cwc.soy.SelectScreenTemplate');
goog.require('cwc.ui.SelectScreen.Events');
goog.require('cwc.utils.Database');
goog.require('cwc.utils.I18n');
goog.require('cwc.utils.Logger');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.addon.Workbench = function(helper) {
  /** @type {string} */
  this.name = 'Workbench';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @private {!cwc.utils.Database} */
  this.projectsDb_ = new cwc.utils.Database('Workbench')
    .setObjectStoreName('__workbench_projects__');

  /** @private {!cwc.utils.Database} */
  this.imagesDb_ = new cwc.utils.Database('Workbench')
    .setObjectStoreName('__workbench_images__');

  /** @private {!Object} */
  this.databaseConfig_ = {
    'objectStoreNames': ['__workbench_projects__', '__workbench_images__'],
  };

  /** @private {!cwc.addon.WorkbenchLoader} */
  this.loader_ = new cwc.addon.WorkbenchLoader(
    helper,
    this.projectsDb_,
    this.imagesDb_);

  /** @private {!Array<Element>} */
  this.cardContainers_ = [];

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {!string} */
  this.projectDetailLinkBase_ =
    'https://edu.workbencheducation.com/cwists/preview/';
};


/**
 * @private
 */
cwc.addon.Workbench.prototype.prepare = async function() {
  if (!this.helper.experimentalEnabled()) {
    return;
  }

  this.log_.info('Preparing Workbench addon...');

  await this.projectsDb_.open(this.databaseConfig_);
  await this.imagesDb_.open(this.databaseConfig_);
  this.loader_.loadProjects();
  this.loader_.onLoadComplete(() => this.showRelevantProjects_());

  let selectScreenInstance = this.helper.getInstance('selectScreen');
  if (selectScreenInstance) {
    goog.events.listen(selectScreenInstance.getEventTarget(),
      cwc.ui.SelectScreen.Events.Type.VIEW_CHANGE,
      this.showRelevantProjects_, false, this);
  }
};


/**
 * @return {Promise}
 * @private
 */
cwc.addon.Workbench.prototype.getAllProjects_ = function() {
  return new Promise((resolve) => {
    this.projectsDb_.getAll().then((results) => {
      const parsed = results.map((result) => JSON.parse(result));
      resolve(parsed);
    });
  });
};


/**
 * @param {Array<Object>} projects
 * @param {number=} filterTagId
 * @return {Object}
 * @private
 */
cwc.addon.Workbench.prototype.filterProjectsByTag_ = function(
    projects, filterTagId) {
  return projects.filter((project) => (
    project['tags'].find((tagId) => tagId === filterTagId)
  ));
};


/**
 * @private
 */
cwc.addon.Workbench.prototype.showRelevantProjects_ = async function() {
  const allProjects = await this.getAllProjects_();
  const tags = Object.keys(cwc.addon.WorkbenchMap);
  this.clearCards_();

  tags.forEach((tagName) => {
    const tagId = cwc.addon.WorkbenchMap[tagName].wbTagId;
    const mode = cwc.addon.WorkbenchMap[tagName].mode;
    const userLanguage = this.helper.getUserLanguage();
    const userLanguageName = cwc.utils.I18n.getEnglishName()[userLanguage];
    const matchingProjects = this
        .filterProjectsByTag_(allProjects, tagId)
        .filter((project) => project.language == userLanguageName);
    const tabNode = document.querySelector(
        cwc.addon.WorkbenchMap[tagName].appendNode);
    const cardListId = `workbench-${mode}-cards`;

    // If no matches or no matching CwC tab for the tag, render nothing
    if (!tabNode || !matchingProjects || matchingProjects.length < 1) return;

    // create an empty div to render the section title and cards into
    const containerNode = document.createElement('div');
    goog.soy.renderElement(
      containerNode,
      cwc.soy.SelectScreenTemplate.fileCardList, {
        content: '',
        id: cardListId,
        title: 'Workbench Lessons',
        icon: 'format_list_numbered',
      }
    );
    tabNode.appendChild(containerNode);
    this.cardContainers_.push(containerNode);
    const cardContainerNode = document.getElementById(cardListId);

    matchingProjects.forEach((project) => {
      const card = goog.soy.renderAsElement(
        cwc.soy.SelectScreenTemplate.fileCard, {
          title: project.name,
          text: project.description,
          opt_link_text: 'Start Project',
          opt_color_class: 'bg-light-blue',
          opt_icon: 'format_list_numbered',
        });

      card.addEventListener('click', () => {
        this.loadProjectAsTutorial_(project, mode);
      });
      cardContainerNode.appendChild(card);
    });
  });
};


/**
 * @private
 * @param {!Object} project
 * @param {!cwc.mode.Type} mode
 */
cwc.addon.Workbench.prototype.loadProjectAsTutorial_ = function(project, mode) {
  let tutorialInstance = this.helper.getInstance('tutorial');
  this.helper.getInstance('mode')
    .loadMode(mode)
    .then(() => {
      // Map Workbench project data structure into CwC Tutorial structure
      let tutorialSpec = {
        'url': this.projectDetailLinkBase_ + project.id,
        'description': {
          'text': project['description'],
          'mime_type': 'text/html',
        },
        'steps': project['steps'].sort((a, b) => {
          return a.order - b.order;
        }).map((step) => {
          return {
            'title': step['title'],
            'description': {
              'text': step['description'],
              'mime_type': 'text/html',
            },
            'images': step['images'],
            'videos': step['videos'],
          };
        }),
      };
      tutorialInstance.setTutorial(tutorialSpec, this.imagesDb_);
    });
};


/**
 * Removes all of the existing Workbench project card sections
 * @private
 */
cwc.addon.Workbench.prototype.clearCards_ = function() {
  this.cardContainers_.forEach((cardContainer) => cardContainer.remove());
  this.cardContainers_ = [];
};
