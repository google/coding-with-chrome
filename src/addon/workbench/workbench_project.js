/**
 * @fileoverview Workbench addon project display
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
goog.provide('cwc.addon.WorkbenchProject');

goog.require('soydata.VERY_UNSAFE');
goog.require('cwc.soy.addon.WorkbenchProject');
goog.require('goog.html.SafeHtml');
goog.require('goog.html.sanitizer.HtmlSanitizer');


/**
 * @param {!cwc.utils.Helper} helper
 * @param {!object} project
 * @param {!cwc.utils.Database} imagesDb
 * @constructor
 * @struct
 * @final
 */
cwc.addon.WorkbenchProject = function(helper, project, imagesDb) {
  /** @type {string} */
  this.name = 'WorkbenchProject';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @private {!cwc.utils.Database} */
  this.imagesDb_ = imagesDb;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('wb');

  /** @private {!string} */
  this.projectDetailLinkBase_ = 'https://edu.workbencheducation.com/cwists/preview/';

  /** @private {!string} */
  this.activeStepClass_ = this.prefix + 'step-container--active';

  /** @private {!string} */
  this.completedStepClass_ = this.prefix + 'step-container--complete';

  /** @private {!Element} */
  this.nodeMediaOverlay_ = null;

  /** @private {!Element} */
  this.nodeMediaOverlayClose_ = null;

  /** @private {!Element} */
  this.nodeMediaOverlayContent_ = null;

  /** @type {Object} */
  this.project = project;

  /** @private {Array<Object>} */
  this.steps_ = [];

  /** @private {!Object} */
  this.state_ = {};

  /** @private {!boolean} */
  this.webviewSupport_ = this.helper.checkChromeFeature('webview');
};


/**
 * Adds the project to the current canvas sidebar
 */
cwc.addon.WorkbenchProject.prototype.decorate = function() {
  if (!this.project) return;

  const sanitizer = new goog.html.sanitizer.HtmlSanitizer();
  const sidebarInstance = this.helper.getInstance('sidebar');
  const templateData = {
    prefix: this.prefix,
    description: this.project.description,
    online: this.helper.checkFeature('online'),
    url: this.projectDetailLinkBase_ + this.project.id,
    steps: this.project['steps'].map((step, index) => ({
      id: step.id,
      description: soydata.VERY_UNSAFE.ordainSanitizedHtml(
        goog.html.SafeHtml.unwrap(
          sanitizer.sanitize(step.description)
        )
      ),
      images: step.images,
      number: index + 1,
      title: step.title || `Step ${index + 1}`,
      videos: (step['videos'] || []).map((video) => video['youtube_id']),
    })),
  };

  const showProjectInSidebar = () => {
    sidebarInstance.showTemplateContent(
      'workbench_project',
      this.project.name,
      cwc.soy.addon.WorkbenchProject.template,
      templateData
    );
  };

  if (sidebarInstance) {
    sidebarInstance.addCustomButton(
      'workbench_project',
      'format_list_numbered',
      'show project',
      () => {
        showProjectInSidebar();
        this.initUI_();
        this.updateView_();
      }
    );

    showProjectInSidebar();
  }

  this.state_ = {
    completedSteps: [],
    activeStepID: null,
    inProgressStepID: null,
  };

  this.initUI_();
};


/**
 * Actions that happen after the template is rendered:
 * add event listeners, show active step, render images from DB
 */
cwc.addon.WorkbenchProject.prototype.initUI_ = function() {
  const rootNode = goog.dom.getElement(this.prefix + 'container');
  const nodeListImages = rootNode.querySelectorAll('.js-project-step-image');
  this.nodeMediaOverlay_ = goog.dom.getElement(this.prefix + 'media-overlay');
  this.nodeMediaOverlayClose_ = goog.dom.getElement(
    this.prefix + 'media-overlay-close');
  this.nodeMediaOverlayContent_ = goog.dom.getElement(
    this.prefix + 'media-overlay-content');

  this.nodeMediaOverlayClose_.addEventListener('click', () => {
    this.setState_({
      expandedMedia: null,
    });
  });

  this.steps_ = this.project['steps'].map((step) => {
    const stepNode = goog.dom.getElement(this.prefix + 'step-' + step.id);
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

  [].forEach.call(nodeListImages, (image) => {
    let imageSrc = image.getAttribute('data-src');
    this.imagesDb_.get(imageSrc).then((imageData) => {
      if (imageData) {
        image.setAttribute('src', imageData);
      } else {
        image.remove();
      }
    });
  });

  this.steps_.forEach((step) => {
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

  this.setState_({
    activeStepID: this.state_.activeStepID || this.steps_[0].id,
  });
};


/**
 * Marks the current step complete and opens the next
 */
cwc.addon.WorkbenchProject.prototype.completeCurrentStep_ = function() {
  let completedSteps = this.state_.completedSteps.slice();
  let currentStepIndex = this.steps_.findIndex((step) =>
    step.id === this.state_.activeStepID);
  let nextStep = this.steps_[currentStepIndex + 1] || {};
  if (!completedSteps.includes(this.state_.activeStepID)) {
    completedSteps.push(this.state_.activeStepID);
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
cwc.addon.WorkbenchProject.prototype.jumpToStep_ = function(stepID) {
  let canOpen = stepID === this.state_.inProgressStepID ||
    this.state_.completedSteps.includes(stepID);
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
cwc.addon.WorkbenchProject.prototype.onMediaClick_ = function(button) {
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
    let content = document.createElement(
      this.webviewSupport_ ? 'webview' : 'iframe');
    content.src = `https://www.youtube-nocookie.com/embed/${youtubeId}/?rel=0&amp;autoplay=0&showinfo=0`;

    this.setState_({
      expandedMedia: content,
    });
  }
};


/**
 * Event fired on media overlay close button click
 */
cwc.addon.WorkbenchProject.prototype.onMediaClose_ = function() {
  this.setState_({
    expandedMedia: null,
  });
};


/**
 * Closes media overlay
 */
cwc.addon.WorkbenchProject.prototype.hideMedia_ = function() {
  while (this.nodeMediaOverlayContent_.firstChild) {
    this.nodeMediaOverlayContent_.firstChild.remove();
  }
  this.nodeMediaOverlay_.classList.add('is-hidden');
};


/**
 * Shows media overlay with the provided element
 * @param {!Element} media
 */
cwc.addon.WorkbenchProject.prototype.showMedia_ = function(media) {
  this.nodeMediaOverlayContent_.appendChild(media);
  this.nodeMediaOverlay_.classList.remove('is-hidden');
};


/**
 * Updates the current state, then triggers a view update
 * @param {!Object} change
 */
cwc.addon.WorkbenchProject.prototype.setState_ = function(change) {
  Object.keys(change).forEach((key) => {
    this.state_[key] = change[key];
  });
  this.updateView_();
};


/**
 * Updates the view to reflect the current state
 */
cwc.addon.WorkbenchProject.prototype.updateView_ = function() {
  this.steps_.forEach((step) => {
    // active step
    if (step.id === this.state_.activeStepID) {
      step.node.classList.add(this.activeStepClass_);
    } else {
      step.node.classList.remove(this.activeStepClass_);
    }

    // completed steps
    if (this.state_.completedSteps.includes(step.id)) {
      step.node.classList.add(this.completedStepClass_);
    } else {
      step.node.classList.remove(this.completedStepClass_);
    }
  });

  if (this.state_.expandedMedia) {
    this.showMedia_(this.state_.expandedMedia);
  } else {
    this.hideMedia_();
  }
};
