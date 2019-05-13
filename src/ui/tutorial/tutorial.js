/**
 * @fileoverview Tutorial
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
 * @author carheden@google.com (Adam Carheden)
 * @author mdiehl@workbenchplatform.com (Matt Diehl)
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.provide('cwc.ui.Tutorial');

goog.require('cwc.mode.Type');
goog.require('cwc.renderer.Helper');
goog.require('cwc.soy.ui.Tutorial');
goog.require('cwc.ui.TutorialValidator');
goog.require('cwc.utils.Database');
goog.require('cwc.utils.Helper');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');
goog.require('cwc.utils.mime.Type');
goog.require('cwc.utils.Resources');

goog.require('goog.dom');
goog.require('goog.html.SafeHtml');
goog.require('goog.html.sanitizer.HtmlSanitizer');
goog.require('goog.events');
goog.require('goog.soy');
goog.require('goog.string');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('soydata.VERY_UNSAFE');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 * @export
 */
cwc.ui.Tutorial = function(helper) {
  /** @type {string} */
  this.name = 'Tutorial';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.renderer.Helper} */
  this.rendererHelper = new cwc.renderer.Helper();

  /** @type {string} */
  this.prefix = this.helper.getPrefix('tutorial');

  /** @type {!Array<string>} */
  this.videoExtensions = ['mp4', 'webm', 'ogg'];

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {!string} */
  this.activeStepClass_ = this.prefix + 'step-container--active';

  /** @private {!string} */
  this.completedStepClass_ = this.prefix + 'step-container--complete';

  /** @private {Element} */
  this.nodeMediaOverlay_ = null;

  /** @private {Element} */
  this.nodeMediaOverlayClose_ = null;

  /** @private {Element} */
  this.nodeMediaOverlayContent_ = null;

  /** @private {!cwc.utils.Database} */
  this.imagesDb_ = null;

  /** @private {!string} */
  this.description_ = '';

  /** @private {!string} */
  this.url_ = '';

  /** @private {!Array<object>} */
  this.steps_ = [];

  /** @private {!Object} */
  this.state_ = {};

  /** @private {!cwc.utils.Events} */
  this.editorEvents_ = new cwc.utils.Events(this.name+'_editor', '', this);

  /** @private {boolean} */
  this.webviewSupport_ = this.helper.checkChromeFeature('webview');

  /** @private {!boolean} */
  this.contentSet_ = false;

  /** @private {!Array<DOMString>} */
  this.objectURLs_ = [];

  /** @private {cwc.ui.TutorialValidator} */
  this.validator_ = null;

  /** @private {Element} */
  this.rootNode_ = null;

  /** @private {cwc.ui.Tour} */
  this.tour_ = this.helper.getInstance('tour');
};


/**
 * @param {!Object} tutorial
 * @param {cwc.utils.Database} imagesDb
 * @export
 */
cwc.ui.Tutorial.prototype.setTutorial = async function(tutorial, imagesDb) {
  this.log_.info('Setting tutorial', tutorial);
  this.clear();
  if (!tutorial) {
    this.log_.info('No tutorial');
    return;
  }

  await this.setImagesDb_(imagesDb);
  await this.parseSteps_(tutorial['steps']);
  this.url_ = tutorial['url'];
  this.description_ = this.parseDescription_(tutorial['description']);
  this.contentSet_ = true;

  let sidebarInstance = this.helper.getInstance('sidebar');
  if (sidebarInstance) {
    sidebarInstance.enableTutorial(true);
  } else {
    this.log_.error('no sidebar, not enabling tutorial');
  }
  this.startTutorial();
};


/**
 * @param {cwc.utils.Database} imagesDb
 * @private
 */
cwc.ui.Tutorial.prototype.setImagesDb_ = async function(imagesDb) {
  if (imagesDb) {
    this.imagesDb_ = imagesDb;
  } else {
    const objectStoreName = '__tutorial__';
    this.imagesDb_ = new cwc.utils.Database('Tutorial')
    .setObjectStoreName(objectStoreName);
    await this.imagesDb_.open({'objectStoreNames': [objectStoreName]});
  }
};


/**
 * Returns true if a tutorial has been loaded.
 * @return {boolean}
 * @export
 */
cwc.ui.Tutorial.prototype.hasTutorial = function() {
  return this.contentSet_;
};


/**
 * @param {!Object} steps
 * @private
 */
cwc.ui.Tutorial.prototype.parseSteps_ = async function(steps) {
  this.log_.info('Loading steps', steps);

  if (!steps) {
    this.log_.warn('Tutorial has no steps.');
    return;
  }
  if (!Array.isArray(steps)) {
    this.log_.warn('Ignoring invalid steps', steps, '(Expecting an array)');
    return;
  }

  if (this.steps_.length != 0) {
    this.log_.warn('Replacing existing steps', this.steps_);
  }
  this.steps_ = [];

  await Promise.all(steps.map((step, id) => {
    return this.addStep_(step, id);
  }));
};


/**
 * @param {!Object} stepTemplate
 * @param {!int} id
 * @private
 */
cwc.ui.Tutorial.prototype.addStep_ = async function(stepTemplate, id) {
  let description = this.parseDescription_(stepTemplate['description']);
  if (!description) {
    this.log_.error('Skipping step', id, 'because parsing it\'s ' +
      'description failed', stepTemplate['description']);
    return;
  }

  let code = false;
  if ('code' in stepTemplate) {
    if (typeof stepTemplate['code'] === 'string') {
      code = stepTemplate['code'];
    } else {
      this.log_.warn('Expecting string for code of step ', id,
        ', got ', stepTemplate['code']);
    }
  }

  let images = [];
  if (Array.isArray(stepTemplate['images'])) {
    await this.appendBinaries_(stepTemplate['images'], images, 'image');
  }

  let tour = false;
  if (stepTemplate['tour']) {
    if (Array.isArray(stepTemplate['tour'])) {
      tour = stepTemplate['tour'];
      tour.forEach((step, stepNumber) => {
        if (!('buttons' in step)) {
          step['buttons'] = this.tour_.getStepButtons(stepNumber, tour.length,
            () => {
            this.cancelTour_();
          });
        }
      });
    } else {
      this.log_.warn('Skipping tour for step', id, 'because it is not an array',
        stepTemplate['tour']);
    }
  }

  this.steps_[id] = {
    code: code,
    description: description,
    id: id,
    images: images,
    title: stepTemplate['title'] || '',
    validate: stepTemplate['validate'] || false,
    videos: stepTemplate['videos'] || [],
    tour: tour,
  };
};


/**
 * @param {!string} key
 * @param {!Object} data
 * @param {boolean} warnOnOverwrite
 * @return {string|boolean}
 */
cwc.ui.Tutorial.prototype.ensureBlobInDB_ =
  async function(key, data, warnOnOverwrite = false) {
  if (warnOnOverwrite) {
    let existingData = await this.imagesDb_.get(key);
    if (existingData) {
      this.log_.warn('Overwriting', key);
    }
  }
  if (await this.imagesDb_.set(key, data)) {
    return key;
  }
  return false;
};


/**
 * @param {!string} url
 * @param {!string} offlineMessage
 * @return {!boolean}
 * @private
 */
cwc.ui.Tutorial.prototype.ensureUrlInDB_ =
  async function(url, offlineMessage) {
  let existingData = await this.imagesDb_.get(url);
  if (existingData) {
    this.log_.info('Not downloading', url,
      'because it is already in the database');
    return true;
  }

  if (!this.helper.checkFeature('online')) {
    this.log_.warn(offlineMessage);
    return false;
  }

  let blob = await cwc.utils.Resources.getUriAsBlob(url);
  return await this.ensureBlobInDB_(url, blob);
};


/**
 * @param {!Array} source
 * @param {!Object} destination
 * @param {!string} name
 * @return {!Promise}
 * @private
 */
cwc.ui.Tutorial.prototype.appendBinaries_ =
  function(source, destination, name) {
  return Promise.all(source.map(async function(spec, index) {
    switch (typeof spec) {
      case 'string': {
        if (await this.ensureUrlInDB_(spec, 'Ignoring '+name+' index '+index+
          ' with url '+spec+' because we are offline')) {
          destination[index] = spec;
        }
        break;
      }
      case 'object': {
        let key = await this.ensureObjectInDb_(spec);
        if (key) {
          destination[index] = key;
        } else {
          this.log_.warn('Failed to insert blob', spec);
        }
        break;
      }
      default: {
        this.log_.warn('Ignoring', name, index,
          'because it is neither a string nor an object', spec);
      }
    }
  }.bind(this)));
};


/**
 * @param {!Object} spec
 * @return {!string|boolean}
 * @private
 */
cwc.ui.Tutorial.prototype.ensureObjectInDb_ = async function(spec) {
   if (!('mime_type' in spec)) {
    return false;
  }
  if (!('data' in spec)) {
    return false;
  }
  const binaryData = atob(spec['data']);
  const encodedData = new Uint8Array(binaryData.length);
  for (let i=0; i<binaryData.length; i++) {
    encodedData[i] = binaryData.charCodeAt(i);
  }
  const blob = new Blob([encodedData], {'type': spec['mime_type']});
  let key = goog.string.createUniqueString();
  await this.ensureBlobInDB_(key, blob, true);
  return key;
};


/**
 * @param {!Object} description
 * @private
 * @return {boolean}
 */
cwc.ui.Tutorial.prototype.validateDescription_ = function(description) {
  if (typeof description !== 'object') {
    this.log_.error('Skipping step because it has invalid or ' +
      'missing description:', description);
    return false;
  }
  if (typeof description['text'] !== 'string') {
    this.log_.error('Skipping step because it\'s description ' +
      'has invalid or missing text:', description);
    return false;
  }
  if (typeof description['mime_type'] !== 'string') {
    this.log_.error('Skipping step because it\'s description '+
      'has invalid or missing mime_type:', description);
    return false;
  }
  return true;
};


/**
 * @param {!Object} description
 * @private
 * @return {string}
 */
cwc.ui.Tutorial.prototype.parseDescription_ = function(description) {
  if (!this.validateDescription_(description)) {
    return '';
  }

  const sanitizer = new goog.html.sanitizer.HtmlSanitizer();
  switch (description['mime_type']) {
    case cwc.utils.mime.Type.HTML.type: {
      return soydata.VERY_UNSAFE.ordainSanitizedHtml(
        goog.html.SafeHtml.unwrap(sanitizer.sanitize(description['text'])));
    }
    case cwc.utils.mime.Type.MARKDOWN.type: {
      if (this.helper.checkJavaScriptFeature('marked')) {
        return soydata.VERY_UNSAFE.ordainSanitizedHtml(
          goog.html.SafeHtml.unwrap(sanitizer.sanitize(marked(
            description['text']))));
      } else {
        this.log_.warn('Markdown not supported, displaying description text',
          description);
        return description['text'];
      }
    }
    case cwc.utils.mime.Type.TEXT.type: {
      return description['text'];
    }
    default: {
      this.log_.error('Unknown or unsupported mime type',
        description['mime_type']);
      return '';
    }
  }
};

/**
 * Renders the tutorial in the sidebar.
 * @export
 */
cwc.ui.Tutorial.prototype.startTutorial = function() {
  this.log_.info('Starting tutorial ...');
  if (!this.hasTutorial()) {
    this.log_.error('Attempt to start tutorial before setting tutorial.');
    return;
  }

  let sidebarInstance = this.helper.getInstance('sidebar');
  if (sidebarInstance) {
    sidebarInstance.showTemplateContent('tutorial', 'Tutorial',
      cwc.soy.ui.Tutorial.template, {
        prefix: this.prefix,
        description: this.description_,
        online: this.helper.checkFeature('online'),
        url: this.url_ ? this.url_ : '',
        steps: this.steps_.map((step, index) => ({
          id: index,
          description: step.description,
          images: step.images.filter((url = '') =>
            !this.videoExtensions.some((ext) => url.endsWith(ext))
          ),
          number: index + 1,
          title: step.title || `Step ${index + 1}`,
          videos: step.images.filter((url = '') =>
            this.videoExtensions.some((ext) => url.endsWith(ext))
          ),
          youtube_videos: (step.videos || []).map((video) =>
            video['youtube_id']
          ),
          hasCode: step.code && step.code.trim().length > 0,
          hasTour: !!step.tour,
        })),
      }
    );
    this.rootNode_ = goog.dom.getElement(this.prefix + 'container');
  }

  this.state_ = {
    completedSteps: [],
    activeStepID: null,
    inProgressStepID: null,
  };

  this.initUI_();
  this.startValidate();
};


/**
 * Actions that happen after the template is rendered:
 * add event listeners, show active step, render images from DB.
 * @private
 */
cwc.ui.Tutorial.prototype.initUI_ = function() {
  this.initSteps_();
  this.initMedia_();

  let state = {};
  if (this.steps_.length > 0) {
    state.activeStepID = this.state_.activeStepID || this.steps_[0].id;
  }
  this.setState_(state);
};

/**
 * Captures references to elements needed by the media overlay.
 * @private
 */
cwc.ui.Tutorial.prototype.initMediaOverlay_ = function() {
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
};


/**
 * Renders cached images and videos from database to DOM.
 * @private
 */
cwc.ui.Tutorial.prototype.initMedia_ = function() {
  this.initMediaOverlay_();
  let nodeListImages = this.rootNode_.querySelectorAll('.' + this.prefix +
    'step-image');
  if (this.imagesDb_) {
    [].forEach.call(nodeListImages, (image) => {
      let imageSrc = image.getAttribute('data-src');
      this.imagesDb_.get(imageSrc).then((blob) => {
        if (blob) {
          let objectURL = URL.createObjectURL(blob);
          image.src = objectURL;
          this.objectURLs_.push(objectURL);
        } else {
          image.remove();
        }
      });
    });
  }
};


/**
 * Sets initial state for each step.
 * @private
 */
cwc.ui.Tutorial.prototype.initSteps_ = function() {
  let prefix = this.prefix + 'step-';
  let classPrefix = '.'+prefix;
  this.steps_.forEach((step) => {
    let stepNode = goog.dom.getElement(prefix + step.id);
    step.node = stepNode;
    step.nodeContinue = stepNode.querySelector(classPrefix + 'continue');
    step.nodeLoadCode = stepNode.querySelector(classPrefix + 'load-code');
    step.nodeLoadTour = stepNode.querySelector(classPrefix + 'load-tour');
    step.nodeHeader = stepNode.querySelector(classPrefix + 'header');
    step.nodeListMediaExpand = stepNode.querySelectorAll(classPrefix +
      'media-expand');
    step.nodeMessage = stepNode.querySelector(classPrefix+'message');
    goog.style.setElementShown(step.nodeMessage, false);
  });
  this.initStepButtons_();
};


/**
 * Sets initial state for each step button.
 * @private
 */
cwc.ui.Tutorial.prototype.initStepButtons_ = function() {
  this.steps_.forEach((step) => {
    if (step.nodeContinue) {
      goog.events.listen(step.nodeContinue, goog.events.EventType.CLICK,
        this.completeCurrentStep_.bind(this));
    }
    if (step.nodeLoadCode) {
      goog.events.listen(step.nodeLoadCode, goog.events.EventType.CLICK,
        this.loadCodeWithPrompt_.bind(this));
    }
    if (step.nodeLoadTour) {
      goog.events.listen(step.nodeLoadTour, goog.events.EventType.CLICK,
        this.loadTour.bind(this));
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
 * Marks the current step complete and opens the next.
 * @private
 */
cwc.ui.Tutorial.prototype.completeCurrentStep_ = function() {
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
  this.scrollToStep_();
};


/**
 * Opens a step, but only if it is complete or next.
 * @param {!number} stepID
 * @private
 */
cwc.ui.Tutorial.prototype.jumpToStep_ = function(stepID) {
  let canOpen = stepID === this.state_.inProgressStepID ||
    this.state_.completedSteps.includes(stepID);
  if (canOpen) {
    this.setState_({
      activeStepID: stepID,
    });
  }
  this.cancelTour_();
};

/**
 * @private
 */
cwc.ui.Tutorial.prototype.cancelTour_ = function() {
  let tour = this.tour_.getTour();
  if (tour) {
    tour.cancel();
  }
};

/**
 * Scrolls the tutorial to the top of the given step.
 * @param {number} stepID
 * @private
 */
cwc.ui.Tutorial.prototype.scrollToStep_ = function(stepID) {
  if (stepID === undefined) {
    stepID = this.getActiveStep_().id;
  }
  let step = goog.dom.getElement(this.prefix + 'step-'+stepID);
  if (!(step && this.rootNode_)) {
    this.log_.warn('Failed to find root and/or step elements');
    return;
  }
  if (!this.rootNode_.contains(step)) {
    this.log_.error('step', stepID, 'isn\'t a child of ',
      this.prefix+'container. Can\'t scroll to it.');
    return;
  }
  this.rootNode_.scrollTop = step.offsetTop - this.rootNode_.offsetTop;
};


/**
 * @private
 * @return {!Object}
 */
cwc.ui.Tutorial.prototype.getActiveStep_ = function() {
  return this.steps_[this.state_.activeStepID];
};


/**
 * @private
 * @return {!Object|boolean}
 */
cwc.ui.Tutorial.prototype.getActiveMessageNode_ = function() {
  let step = this.getActiveStep_();
  if (!step) {
    this.log_.warn('No active step, activeStepID = ', this.state_.activeStepID);
    return false;
  }
  return step.nodeMessage;
};


/**
 * @export
 * @return {object|null}
 */
cwc.ui.Tutorial.prototype.getValidate = function() {
  let step = this.getActiveStep_();
  if (!step || !step.validate) {
    return null;
  }
  return step.validate;
};

/**
 * Shows media in a full screen overlay.
 * @param {Element} button
 * @private
 */
cwc.ui.Tutorial.prototype.onMediaClick_ = function(button) {
  let mediaType = button.getAttribute('data-media-type');
  let mediaImg = button.querySelector('img');
  let youtubeId = button.getAttribute('data-youtube-id');
  let videoUrl = button.getAttribute('data-video-url');

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
  } else if (mediaType === 'video') {
    let video = document.createElement('video');
    this.imagesDb_.get(videoUrl).then((blob) => {
      if (blob) {
        let objectURL = URL.createObjectURL(blob);
        video.src = objectURL;
        this.objectURLs_.push(objectURL);
        video.controls = true;
        this.setState_({
          expandedMedia: video,
        });
      } else {
        video.remove();
      }
    });
  }
};


/**
 * Event fired on media overlay close button click.
 * @private
 */
cwc.ui.Tutorial.prototype.onMediaClose_ = function() {
  this.setState_({
    expandedMedia: null,
  });
};


/**
 * Closes media overlay.
 * @private
 */
cwc.ui.Tutorial.prototype.hideMedia_ = function() {
  while (this.nodeMediaOverlayContent_.firstChild) {
    this.nodeMediaOverlayContent_.firstChild.remove();
  }
  this.nodeMediaOverlay_.classList.add('is-hidden');
};


/**
 * Shows media overlay with the provided element.
 * @param {!Element} media
 * @private
 */
cwc.ui.Tutorial.prototype.showMedia_ = function(media) {
  this.nodeMediaOverlayContent_.appendChild(media);
  this.nodeMediaOverlay_.classList.remove('is-hidden');
};


/**
 * Updates the current state, then triggers a view update.
 * @param {!Object} change
 * @private
 */
cwc.ui.Tutorial.prototype.setState_ = function(change) {
  let previousActiveStepID = this.state_.activeStepID;
  let isEditorDirty = this.isEditorDirty_();
  Object.keys(change).forEach((key) => {
    this.state_[key] = change[key];
  });
  if (previousActiveStepID != this.state_.activeStepID) {
    this.cancelTour_();
  }
  this.updateView_();
  if (!isEditorDirty) {
    this.loadCode_();
  }
};

/**
 * Tests if the editor has been modified from the example code
 * @return {!boolean}
 * @private
 */
cwc.ui.Tutorial.prototype.isEditorDirty_ = function() {
  let editorInstance = this.helper.getInstance('editor');
  let activeStep = this.getActiveStep_();
  let code = editorInstance.getEditorContent(editorInstance.getCurrentView());
  code = code ? code.trim() : '';

  // It's always ok to load code into an empty editor
  if (code.length === 0) {
    return false;
  }
  if (activeStep && activeStep.code && activeStep.code.trim() === code) {
    return false;
  }
  return true;
};

/**
 * Prompts to overwrite dirty editor and loads code if user confirms
 * @private
 */
cwc.ui.Tutorial.prototype.loadCodeWithPrompt_ = function() {
  if (!this.getActiveStep_().code) {
    return;
  }
  if (!this.isEditorDirty_()) {
    this.loadCode_();
    return;
  }

  let dialogInstance = this.helper.getInstance('dialog');
  let title = {
    icon: 'warning',
    title: 'Overwrite editor content?',
  };
  let content = 'Loading the example code will overwrite your changes in the ' +
    'editor. Are you sure you want to load the example code?';
  let action = i18t('Load example code into editor');
  dialogInstance.showActionCancel(title, content, action).then((answer) => {
    if (!answer) {
      return;
    }
    this.loadCode_();
  });
};


/**
 * Loads example code into editor
 * @private
 */
cwc.ui.Tutorial.prototype.loadCode_ = function() {
  let activeStep = this.getActiveStep_();
  if (!(activeStep && activeStep.code)) {
    return;
  }
  let editorInstance = this.helper.getInstance('editor');
  // TODO: support multiple editor views
  editorInstance.setEditorContent(activeStep.code,
    editorInstance.getCurrentView());
  this.log_.info('Loaded example code into editor', activeStep.code);
  this.solved(false);
  this.restartValidate_();
};

/**
 * Starts a per-step tour
 * @private
 */
cwc.ui.Tutorial.prototype.loadTour = function() {
  let step = this.getActiveStep_();
  if (!step.tour) {
    this.log_.warn('loadTour called for step with no tour');
    return;
  }
  if (!this.tour_) {
    this.log_.error('No tour instnace, can\'t load tour');
    return;
  }
  this.tour_.setTour({
    'description': 'Tutorial Tour', // TODO(carheden): Merge tutorial/tour
    'data': step.tour,
  });
  this.cancelTour_();
  this.tour_.getTour().start();
};

/**
 * Updates the view to reflect the current state
 * @private
 */
cwc.ui.Tutorial.prototype.updateView_ = function() {
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


/**
 * Logs console messages from the tutorial webview
 * @param {Event} event
 * @private
 */
cwc.ui.Tutorial.prototype.handleConsoleMessage_ = function(event) {
  let browserEvent = event.getBrowserEvent();
  // TODO: Log this to a tutorial developer console once we build one
  this.log_.info('['+browserEvent.level+']: '+browserEvent.message);
};


/**
 * Starts listening for editor changes
 * @private
 */
cwc.ui.Tutorial.prototype.startValidate = function() {
  let editorInstance = this.helper.getInstance('editor');
  if (!editorInstance) {
    this.log_.warn('startValidate: No editor instance');
    return;
  }
  this.editorEvents_.listen(editorInstance.getEventTarget(),
    goog.ui.Component.EventType.CHANGE, this.restartValidate_,
    false, this);
};


/**
 * Restarts the validator
 * @private
 */
cwc.ui.Tutorial.prototype.restartValidate_ = function() {
  if (!this.validator_) {
    this.validator_ = new cwc.ui.TutorialValidator(this.helper);
  } else {
    this.validator_.stop();
  }
  this.validator_.start();
};


/**
 * @param {string} message
 * @export
 */
cwc.ui.Tutorial.prototype.setMessage = function(message) {
  let node = this.getActiveMessageNode_();
  if (!node || !node.nodeType) {
    this.log_.warn('No active message node, can\'t set message ', message);
    return;
  }
  goog.soy.renderElement(node, cwc.soy.ui.Tutorial.message,
    {message: (typeof message === 'string') ? message : ''});
  goog.style.setElementShown(node, message ? true : false);
};


/**
 * @param {!boolean} solved
 * @export
 */
cwc.ui.Tutorial.prototype.solved = function(solved) {
  let step = this.getActiveStep_();
  if (!step || !step.node) {
    this.log_.warn('Failed to get active step');
    return;
  }
  if (solved) {
    goog.dom.classlist.add(step.node, 'solved');
  } else {
    goog.dom.classlist.remove(step.node, 'solved');
  }
};


/**
 * Removes the tutorial from the sidebar and calls
 * dependent object cleanup functions.
 * @export
 */
cwc.ui.Tutorial.prototype.clear = function() {
  this.state_ = {};
  this.steps_ = [];
  this.description_ = '';
  this.url_ = '';
  this.contentSet_ = false;
  this.imagesDb_ = false;
  this.nodeMediaOverlay_ = null;
  this.nodeMediaOverlayClose_ = null;
  this.nodeMediaOverlayContent_ = null;
  this.editorEvents_.clear();
  while (this.objectURLs_.length > 0) {
    URL.revokeObjectURL(this.objectURLs_.pop());
  }
  let sidebarInstance = this.helper.getInstance('sidebar');
  if (sidebarInstance) {
    sidebarInstance.clear();
  }
  if (this.validator_) {
    this.validator_.stop();
    this.validator_ = null;
  }
};
