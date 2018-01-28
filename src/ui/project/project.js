/**
 * @fileoverview Project display for the Coding with Chrome editor.
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
goog.provide('cwc.ui.Project');

goog.require('cwc.ui.ProjectLoader');
goog.require('soydata.VERY_UNSAFE');
goog.require('cwc.soy.ui.Project');
goog.require('cwc.ui.Helper');

goog.require('goog.object');
// goog.require('goog.dom');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.ui.Project = function(helper) {
  /** @type {string} */
  this.name = 'Project';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('project');

  /** @type {boolean} */
  this.expandState = false;

  /** @type {cwc.ui.ProjectLoader} */
  this.loader = new cwc.ui.ProjectLoader(helper);

  /** @type {string} */
  this.projectDetailLinkBase = 'https://edu.workbencheducation.com/cwists/preview/';

  /** @type {string} */
  this.activeStepClass = this.prefix + 'step-container--active';

  /** @type {string} */
  this.completedStepClass = this.prefix + 'step-container--complete';

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeExpand = null;

  /** @type {Element} */
  this.nodeExpandExit = null;

  /** @type {NodeList} */
  this.nodeListImages = null;

  /** @type {Object} */
  this.project = null;

  /** @type {Object} */
  this.steps = [];

  /** @type {boolean} */
  this.isActive = false;

  /** @type {!Object} */
  this.state = {};
};


/**
 * Decorates the given node and adds the project.
 */
cwc.ui.Project.prototype.decorate = function() {
  if (!this.project) return;
  let layout = this.helper.getInstance('layout');
  this.node = layout.getNode('content-sidebar');
  let templateData = {
    prefix: this.prefix,
    name: this.project.name,
    description: this.project.description,
    online: this.helper.checkFeature('online'),
    url: this.projectDetailLinkBase + this.project.id,
    steps: this.project['steps'].map((step, index) => ({
      id: step.id,
      description: soydata.VERY_UNSAFE.ordainSanitizedHtml(step.description),
      images: step.images,
      number: index + 1,
      title: step.title || `Step ${index + 1}`,
      videos: (step['videos'] || []).map((video) => video['youtube_id']),
    })),
  };
  goog.soy.renderElement(
    this.node,
    cwc.soy.ui.Project.template,
    templateData
  );

  layout.showSidebar();

  this.state = {
    completedSteps: [],
    activeStepID: null,
    inProgressStepID: null,
  };

  this.nodeExpand = goog.dom.getElement(this.prefix + 'toolbar-expand');
  this.nodeExpandExit = goog.dom.getElement(
    this.prefix + 'toolbar-expand-exit'
  );
  this.nodeListImages = this.node.querySelectorAll('.js-project-step-image');
  goog.style.setElementShown(this.nodeExpandExit, false);

  [].forEach.call(this.nodeListImages, (image) => {
    let imageSrc = image.getAttribute('data-src');
    chrome.storage.local.get(imageSrc, (store) => {
      let src = store[imageSrc];
      if (src) {
        image.setAttribute('src', store[imageSrc]);
      } else {
        image.remove();
      }
    });
  });

  this.steps = this.project['steps'].map((step) => {
    let stepNode = goog.dom.getElement(this.prefix + 'step-' + step.id);
    return {
      id: step.id,
      node: stepNode,
      nodeContinue: stepNode.querySelector(
        '.js-project-step-continue'),
      nodeHeader: stepNode.querySelector(
        '.js-project-step-header'),
      nodeListMediaExpand: stepNode.querySelectorAll(
        '.js-project-step-media-expand'),
    };
  });

  this.setState_({
    activeStepID: this.steps[0].id,
  });


  // Events
  goog.events.listen(this.nodeExpand, goog.events.EventType.CLICK,
    this.expand.bind(this));
  goog.events.listen(this.nodeExpandExit, goog.events.EventType.CLICK,
    this.collapse.bind(this));

  this.steps.forEach((step) => {
    if (step.nodeContinue) {
      goog.events.listen(step.nodeContinue, goog.events.EventType.CLICK,
        this.completeCurrentStep_.bind(this));
    }
    goog.events.listen(step.nodeHeader, goog.events.EventType.CLICK,
      this.jumpToStep_.bind(this, step.id));

    [].forEach.call(step.nodeListMediaExpand, (toggle) => {
      goog.events.listen(toggle, goog.events.EventType.CLICK,
        this.onMediaClick_.bind(this, toggle));
    });
  });
};


/**
 * Requests and downloads project data from Workbench
 */
cwc.ui.Project.prototype.downloadContent = function() {
  this.loader.loadProjects();
};


/**
 * Get projects by tag
 * @param {Array<string>} filterTags project tags to filter by
 * @return {Array<{link_id}>}
 * @private
 */
cwc.ui.Project.prototype.getProjectList = function(filterTags) {
  let storage = this.helper.getInstance('storage');
  let projects = JSON.parse(storage.get('projects')) || [];
  projects = projects.map((project) => {
    let clone = goog.object.clone(project);
    clone.description = goog.string.truncate(clone.description, 220, true);
    clone.link_id = `project-${project.id}`;
    return clone;
  });
  if (filterTags && filterTags.length) {
    projects = projects.filter((project) => (
      filterTags.every((filterTag) => (
        project['theme_tags'].find((tag) => (
          (tag.title || '').toLowerCase() === (filterTag || '').toLowerCase())
        )
      ))
    ));
  }

  if (projects.length) {
    return projects;
  }

  return null;
};


/**
 * Loads a project from storage for display
 * @param {number} projectID The project to load
 */
cwc.ui.Project.prototype.setActiveProject = function(projectID) {
  let storage = this.helper.getInstance('storage', true);
  let storedProject = storage.get(`project-${projectID}`);
  if (storedProject) {
    let parsedProject = JSON.parse(storedProject);
    if (goog.isObject(parsedProject)) {
      this.project = JSON.parse(storedProject);
      this.isActive = true;
    }
  }
};


/**
 * Clears the active project
 */
cwc.ui.Project.prototype.deactivateProject = function() {
  this.project = null;
  this.isActive = false;
};

/**
 * Toggles the current expand state.
 * @param {goog.events.EventLike} e
 */
cwc.ui.Project.prototype.expand = function(e) {
  this.setExpand(true, e.target.closest('[class*="goog-splitpane-"]'));
};


/**
 * Toggles the current expand state.
 * @param {goog.events.EventLike} e
 */
cwc.ui.Project.prototype.collapse = function(e) {
  this.setExpand(false, e.target.closest('[class*="goog-splitpane-"]'));
};


/**
 * Toggles the current expand state.
 * @param {goog.events.EventLike} e
 */
cwc.ui.Project.prototype.toggleExpand = function(e) {
  this.setExpand(!this.expandState,
      e.target.closest('[class*="goog-splitpane-"]'));
};


/**
 * Expands or collapses the current window.
 * @param {boolean} expand
 * @param {Element} expandPanel
 */
cwc.ui.Project.prototype.setExpand = function(expand, expandPanel) {
  this.expandState = expand;
  let layoutInstance = this.helper.getInstance('layout', true);
  if (layoutInstance) {
    layoutInstance.setPanelFullscreen(expand, expandPanel);
    goog.style.setElementShown(this.nodeExpand, !expand);
    goog.style.setElementShown(this.nodeExpandExit, expand);
  }
};


/**
 * Marks the current step complete and opens the next
 */
cwc.ui.Project.prototype.completeCurrentStep_ = function() {
  let completedSteps = this.state.completedSteps.slice();
  let currentStepIndex = this.steps.findIndex((step) =>
    step.id === this.state.activeStepID);
  let nextStep = this.steps[currentStepIndex + 1] || {};
  if (!completedSteps.includes(this.state.activeStepID)) {
    completedSteps.push(this.state.activeStepID);
  }
  this.setState_({
    completedSteps: completedSteps,
    activeStepID: nextStep.id,
    inProgressStepID: nextStep.id,
  });
};


/**
 * Opens a step, but only if it is complete or next
 * @param {!number} stepID
 */
cwc.ui.Project.prototype.jumpToStep_ = function(stepID) {
  let canOpen = stepID === this.state.inProgressStepID ||
    this.state.completedSteps.includes(stepID);
  if (canOpen) {
    this.setState_({
      activeStepID: stepID,
    });
  }
};


/**
 * Shows media in a full screen overlay
 * @param {Element} button
 */
cwc.ui.Project.prototype.onMediaClick_ = function(button) {
  let mediaType = button.getAttribute('data-media-type');
  let mediaImg = button.querySelector('img');
  let youtubeId = button.getAttribute('data-youtube-id');

  if (mediaType === 'image' && mediaImg) {
    let clone = mediaImg.cloneNode(true);
    clone.removeAttribute('class');
    this.setState_({
      expandedMedia: clone,
    });
  } else if (mediaType === 'youtube' && youtubeId) {
    let content = document.createElement('div');
    content.innerHTML = `<webview src="https://www.youtube-nocookie.com/embed/${youtubeId}/?rel=0&amp;autoplay=0&showinfo=0"></webview>`;
    this.setState_({
      expandedMedia: content,
    });
  }
};


/**
 * Closes media overlay
 */
cwc.ui.Project.prototype.onMediaClose_ = function() {
  this.setState_({
    expandedMedia: null,
  });
};


/**
 * Iterates over all state and updates the view to reflect it
 * @param {!Object} change
 */
cwc.ui.Project.prototype.setState_ = function(change) {
  Object.keys(change).forEach((key) => {
    this.state[key] = change[key];
  });
  this.updateView_();
};


/**
 * Iterates over all state and updates the view to reflect it
 */
cwc.ui.Project.prototype.updateView_ = function() {
  let gui = this.helper.getInstance('gui');

  this.steps.forEach((step) => {
    // active step
    if (step.id === this.state.activeStepID) {
      step.node.classList.add(this.activeStepClass);
    } else {
      step.node.classList.remove(this.activeStepClass);
    }

    // completed steps
    if (this.state.completedSteps.includes(step.id)) {
      step.node.classList.add(this.completedStepClass);
    } else {
      step.node.classList.remove(this.completedStepClass);
    }
  });

  if (this.state.expandedMedia) {
    gui.showMedia(this.state.expandedMedia, this.onMediaClose_.bind(this));
  } else {
    gui.hideMedia();
  }
};
