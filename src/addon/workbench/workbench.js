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
goog.require('cwc.mode.Type');
goog.require('cwc.soy.SelectScreenTemplate');
goog.require('cwc.ui.SelectScreen.Events');
goog.require('cwc.utils.Database');
goog.require('cwc.utils.I18n');
goog.require('cwc.utils.Logger');


// tagMap keys are tags on Workbench
const tagMap = {
  'CWC Advanced - 3D': {
    appendNode: '#select-screen-tab-graphic .cwc-tutorial-list',
    mode: cwc.mode.Type.BASIC,
  },
  'CWC Advanced - AIY': {
    appendNode: '#select-screen-tab-aiy .cwc-tutorial-list',
    mode: cwc.mode.Type.AIY,
  },
  'CWC Advanced - CoffeeScript': {
    appendNode: '#select-screen-tab-coffeescript .cwc-tutorial-list',
    mode: cwc.mode.Type.COFFEESCRIPT,
  },
  'CWC Advanced - EV3': {
    appendNode: '#select-screen-tab-lego_ev3 .cwc-tutorial-list',
    mode: cwc.mode.Type.EV3,
  },
  'CWC Advanced - Games': {
    appendNode: '#select-screen-tab-games .cwc-tutorial-list',
    mode: cwc.mode.Type.PHASER,
  },
  'CWC Advanced - HTML5': {
    appendNode: '#select-screen-tab-html5 .cwc-tutorial-list',
    mode: cwc.mode.Type.HTML5,
  },
  'CWC Advanced - JavaScript': {
    appendNode: '#select-screen-tab-javascript .cwc-tutorial-list',
    mode: cwc.mode.Type.JAVASCRIPT,
  },
  'CWC Advanced - Pencil Code': {
    appendNode: '#select-screen-tab-pencil_code .cwc-tutorial-list',
    mode: cwc.mode.Type.PENCIL_CODE,
  },
  'CWC Advanced - Python 2.7': {
    appendNode: '#select-screen-tab-python27 .cwc-tutorial-list',
    mode: cwc.mode.Type.PYTHON27,
  },
  'CWC Advanced - Python 3.x': {
    appendNode: '#select-screen-tab-python .cwc-tutorial-list',
    mode: cwc.mode.Type.PYTHON,
  },
  'CWC Advanced - Simple': {
    appendNode: '#select-screen-tab-basic .cwc-tutorial-list',
    mode: cwc.mode.Type.BASIC,
  },
  'CWC Advanced - Sphero 2.0': {
    appendNode: '#select-screen-tab-sphero_classic .cwc-tutorial-list',
    mode: cwc.mode.Type.SPHERO,
  },
  'CWC Advanced - Sphero BB-8': {
    appendNode: '#select-screen-tab-sphero_bb8 .cwc-tutorial-list',
    mode: 'sphero_bb8', // TODO: this is missing
  },
  'CWC Advanced - Sphero SPRK+': {
    appendNode: '#select-screen-tab-sphero_sprk_plus .cwc-tutorial-list',
    mode: cwc.mode.Type.SPHERO_SPRK_PLUS,
  },
  'CWC Beginner - Blocks': {
    appendNode: '#select-screen-tab-blocks .cwc-tutorial-list',
    mode: cwc.mode.Type.BASIC_BLOCKLY,
  },
  'CWC Beginner - EV3': {
    appendNode: '#select-screen-tab-lego_ev3 .cwc-tutorial-list',
    mode: cwc.mode.Type.EV3_BLOCKLY,
  },
  'CWC Beginner - Games': {
    appendNode: '#select-screen-tab-games .cwc-tutorial-list',
    mode: cwc.mode.Type.PHASER_BLOCKLY,
  },
  'CWC Beginner - Sphero 2.0': {
    appendNode: '#select-screen-tab-sphero_classic .cwc-tutorial-list',
    mode: cwc.mode.Type.SPHERO_BLOCKLY,
  },
  'CWC Beginner - Sphero BB-8': {
    appendNode: '#select-screen-tab-sphero_bb8 .cwc-tutorial-list',
    mode: cwc.mode.Type.SPHERO_BB8_BLOCKLY,
  },
  'CWC Beginner - Sphero SPRK+': {
    appendNode: '#select-screen-tab-sphero_sprk_plus .cwc-tutorial-list',
    mode: cwc.mode.Type.SPHERO_SPRK_PLUS_BLOCKLY,
  },
  'CWC Beginner - mBot Blue': {
    appendNode: '#select-screen-tab-makeblock_mbot .cwc-tutorial-list',
    mode: cwc.mode.Type.MBOT_BLOCKLY,
  },
  'CWC Beginner - mBot Ranger': {
    appendNode: '#select-screen-tab-makeblock_mbot_ranger .cwc-tutorial-list',
    mode: cwc.mode.Type.MBOT_RANGER_BLOCKLY,
  },
};


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

  /** @private {!cwc.utils.Helper} */
  this.loader_ = new cwc.addon.WorkbenchLoader(
    helper,
    this.projectsDb_,
    this.imagesDb_);

  /** @private {!Array<Element>} */
  this.cards_ = [];

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {!string} */
  this.projectDetailLinkBase_ = 'https://edu.workbencheducation.com/cwists/preview/';
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
 * @param {Object} projects
 * @param {string=} filterTag
 * @return {Object}
 * @private
 */
cwc.addon.Workbench.prototype.filterProjectsByTag_ = function(
    projects, filterTag) {
  return projects.filter((project) => (
    project['theme_tags'].find((tag) => (
      (tag.title || '').toLowerCase() === (filterTag || '').toLowerCase())
    )
  ));
};

/**
 * @private
 */
cwc.addon.Workbench.prototype.showRelevantProjects_ = async function() {
  const allProjects = await this.getAllProjects_();
  this.clearCards_();

  Object.keys(tagMap).forEach((tag) => {
    const tabNode = document.querySelector(tagMap[tag].appendNode);
    if (!tabNode) return;

    const mode = tagMap[tag].mode;
    const userLanguage = this.helper.getUserLanguage();
    const userLanguageName = cwc.utils.I18n.getEnglishName()[userLanguage];
    let matchingProjects = this.filterProjectsByTag_(allProjects.filter(
      (project) => project.language == userLanguageName), tag);

    matchingProjects.forEach((project) => {
      const card = goog.soy.renderAsElement(
        cwc.soy.SelectScreenTemplate.fileCard, {
          title: project.name,
          text: project.description,
          opt_link_text: 'Start Project',
          opt_color_class: 'bg-light-blue',
          opt_icon: 'school',
        });

      card.addEventListener('click', () => {
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
            return tutorialInstance.setTutorial(tutorialSpec, this.imagesDb_);
          })
          .then(() => {
            tutorialInstance.startTutorial();
          });
      });

      tabNode.appendChild(card);
      this.cards_.push(card);
    });
  });
};

/**
 * @private
 */
cwc.addon.Workbench.prototype.clearCards_ = function() {
  this.cards_.forEach((card) => card.remove());
  this.cards_ = [];
};
