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

goog.require('cwc.ui.tutorial.Editor');
goog.require('cwc.ui.tutorial.EditorEvents');
goog.require('cwc.mode.Mod');
goog.require('cwc.mode.Type');
goog.require('cwc.soy.ui.Tutorial');
goog.require('cwc.ui.TutorialValidator');
goog.require('cwc.ui.TutorialUtils');
goog.require('cwc.utils.Database');
goog.require('cwc.utils.Helper');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Logger');
goog.require('cwc.utils.mime.Type');
goog.require('cwc.utils.Resources');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.html.SafeHtml');
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

  /** @private {cwc.ui.TutorialValidator} */
  this.validator_ = null;

  /** @private {Element} */
  this.rootNode_ = null;

  /** @private {cwc.ui.Tour} */
  this.tour_ = this.helper.getInstance('tour');

  /** @private {cwc.ui.TutorialUtils} */
  this.utils_ = new cwc.ui.TutorialUtils(this.prefix, this.helper);

  /** @private {string} */
  this.language_ = this.helper.getUserLanguage();

  /** @private {cwc.userConfig} */
  this.userConfig = this.helper.getInstance('userConfig');

  /** @private {cwc.ui.tutorial.Editor} */
  this.tutorialEditor_ = new cwc.ui.tutorial.Editor(helper, this.utils_);
};


/**
 * @param {!Object} tutorial
 * @param {string} language
 * @param {cwc.utils.Database} imagesDb
 * @export
 */
cwc.ui.Tutorial.prototype.setTutorial = async function(tutorial, language,
  imagesDb) {
  this.log_.info('Setting tutorial', tutorial);
  this.clear();
  if (!tutorial) {
    this.log_.info('No tutorial');
    return;
  }

  if (language) {
    this.language_ = language;
  }

  await this.utils_.initImagesDb(imagesDb);
  await this.parseSteps_(tutorial['steps']);
  this.url_ = tutorial['url'];
  this.description_ = this.utils_.sanitizeTextObject(tutorial['description']);
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
 * Returns true if a tutorial has been loaded.
 * @return {boolean}
 * @export
 */
cwc.ui.Tutorial.prototype.hasTutorial = function() {
  return this.contentSet_;
};


/**
 * @param {string} language
 * @export
 */
cwc.ui.Tutorial.prototype.newTutorial = async function(language) {
  if (this.hasTutorial()) {
    this.log_.error('Refusing to replace existing tutorial');
    return;
  }
  if (!language) {
    language = this.helper.getUserLanguage();
  }
  await this.setTutorial({
    'description': {
      'mime_type': 'text/plain',
      'text': '',
    },
    'steps': [
      {
        'title': 'Step title',
        'description': {
          'mime_type': 'text/plain',
          'text': 'First step instructions',
        },
      },
    ],
  }, language);
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
  let description = this.utils_.sanitizeTextObject(stepTemplate['description']);
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

  stepTemplate['images'] = await this.utils_.cacheMediaSet(
    stepTemplate['images'] || []);

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
    images: stepTemplate['images'] || [],
    title: stepTemplate['title'] || '',
    validate: stepTemplate['validate'] || false,
    videos: stepTemplate['videos'] || [],
    tour: tour,
  };
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
        allowEdit: this.allowEdit_(),
        steps: this.steps_.map((step, index) => ({
          id: index,
          description: step.description,
          images: this.utils_.getImageKeys(step.images || []),
          number: index + 1,
          title: step.title || `Step ${index + 1}`,
          videos: this.utils_.getVideoKeys(step.images || []),
          youtube_videos: (step.videos || []).map((video) =>
            video['youtube_id']
          ),
          hasCode: (step.code && !goog.string.isEmptyOrWhitespace(step.code)) ?
            true : false,
          hasTour: step.tour ? true : false,
        })),
      }
    );
    this.rootNode_ = goog.dom.getElement(this.prefix + 'container');
    sidebarInstance.showTutorialButtons();
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
  this.initEdit_();

  let state = {};
  if (this.steps_.length > 0) {
    state.activeStepID = this.state_.activeStepID || this.steps_[0].id;
  }
  this.setState_(state);
};


/**
 * Initialize edit icon if editing is allowed
 * @private
 */
cwc.ui.Tutorial.prototype.initEdit_ = function() {
  let editButtonId = this.prefix + 'edit';
  if (!this.allowEdit_()) {
    this.log_.info('Editing not allowed, not initializing edit button');
    return;
  }
  let editButton = goog.dom.getElement(editButtonId);
  if (!editButton) {
    this.log_.error('Failed to find edit button with id', editButtonId);
    return;
  }
  goog.events.listen(editButton, 'click', async () => {
    let editorName = this.prefix + 'editor';
    let editor = goog.dom.getElement(editorName);
    if (!editor) {
      this.log_.error('Failed to find editor container', editorName, editor);
      return;
    }
    let tutorial = await this.getJSON_(true);
    this.tutorialEditor_.edit(tutorial[this.language_], editor);
    goog.events.listenOnce(this.tutorialEditor_.getEventTarget(),
      cwc.ui.tutorial.EditorEvents.Type.CLOSE,
      this.handleEditorClose_.bind(this));
  });
};


/**
 * @param {!Event} e
 * @private
 */
cwc.ui.Tutorial.prototype.handleEditorClose_ = function(e) {
  if (e.data) {
    let tutorial = e.source.getTutorial();
    this.log_.info('Setting edited tutorial', tutorial);
    this.setTutorial(tutorial);
  } else {
    this.log_.info('Tutorial not edited');
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
    step.nodeMessage = stepNode.querySelector(classPrefix+'message');
    goog.style.setElementShown(step.nodeMessage, false);
    this.utils_.initMedia_(stepNode);
    this.utils_.initStepMediaButtons_(stepNode);
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
  let activeStep = this.getActiveStep_();
  if (!(activeStep && activeStep.code)) {
    return false;
  }
  if (cwc.mode.Mod.isBlockly(this.helper.getInstance('file').getMode())) {
    return this.isBlocklyEditorDirty_(activeStep.code);
  }
  return this.isCodeEditorDirty_(activeStep.code);
};

/**
 * @param {!string} stepCode
 * @return {!boolean}
 * @private
 */
cwc.ui.Tutorial.prototype.isCodeEditorDirty_ = function(stepCode) {
  let editorInstance = this.helper.getInstance('editor');
  let liveCode = editorInstance.getEditorContent(
    editorInstance.getCurrentView());

  // It's always ok to load code into an empty editor
  if (goog.string.isEmptyOrWhitespace(liveCode)) {
    return false;
  }
  if (stepCode.trim() === liveCode.trim()) {
    return false;
  }
  return true;
};

/**
 * @param {!string} stepCode
 * @return {!boolean}
 * @private
 */
cwc.ui.Tutorial.prototype.isBlocklyEditorDirty_ = function(stepCode) {
  let blocklyInstance = this.helper.getInstance('blockly');
  let stepCodeJS = '';
  let tmpElement = goog.dom.createElement('div');
  // Translate the step's blockly code into JavaScript to compare it with
  // the current blokly editor's code. This lets us consider the editor dirty
  // if the code has changed but clean if the user has zoomed or otherwise
  // moved blocks that doesn't change functionality of the code
  try {
    goog.style.setElementShown(tmpElement, false);
    goog.dom.append(document.body, tmpElement);
    let tmpWorkspace = Blockly.inject(tmpElement,
      blocklyInstance.getWorkspace().options);
    let xmlString = cwc.ui.BlocklyLegacy.parse(stepCode);
    let xmlDom = Blockly.Xml.textToDom(xmlString);
    Blockly.Xml.clearWorkspaceAndLoadFromXml(xmlDom, tmpWorkspace);
    stepCodeJS = Blockly.JavaScript.workspaceToCode(tmpWorkspace);
  } catch (e) {
    this.log_.error('Failed to parse blockly code', stepCode,
      'error was', e);
    goog.dom.removeNode(tmpElement);
    return true;
  }
  goog.dom.removeNode(tmpElement);

  let liveCode = blocklyInstance.getJavaScript();
  // It's always ok to overwrite an empty editor
  if (!liveCode.trim()) {
    return false;
  }
  if (stepCodeJS.trim() == liveCode.trim()) {
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
 * @private
 */
cwc.ui.Tutorial.prototype.loadCode_ = function() {
  let activeStep = this.getActiveStep_();
  if (!(activeStep && activeStep.code)) {
    return;
  }
  let file = this.helper.getInstance('file');
  if (cwc.mode.Mod.isBlockly(file.getMode())) {
    this.loadBlocklyCode_(activeStep.code);
  } else {
    // TODO: Support blockly
    this.loadTextCode_(activeStep.code);
  }
  this.solved(false);
  this.restartValidate_();
};

/**
 * @param {!string} code
 * @private
 */
cwc.ui.Tutorial.prototype.loadBlocklyCode_ = function(code) {
  let blocklyInstance = this.helper.getInstance('blockly');
  blocklyInstance.setContent(code);
};

/**
 * @param {!string} code
 * @private
 */
cwc.ui.Tutorial.prototype.loadTextCode_ = function(code) {
  let editorInstance = this.helper.getInstance('editor');
  // TODO: support multiple editor views
  editorInstance.setEditorContent(code,
    editorInstance.getCurrentView());
  this.log_.info('Loaded example code into editor', code);
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
  this.utils_.clear();
  this.editorEvents_.clear();
  let sidebarInstance = this.helper.getInstance('sidebar');
  if (sidebarInstance) {
    sidebarInstance.clear();
  }
  if (this.validator_) {
    this.validator_.stop();
    this.validator_ = null;
  }
};


/**
 * Exports tutorial to file metadata
 */
cwc.ui.Tutorial.prototype.prepareForSave = async function() {
  if (!this.allowEdit_()) return;
  if (!this.contentSet_) return;
  this.log_.info('Saving tutorial');

  let fileInstance = this.helper.getInstance('file');
  if (!fileInstance) {
    this.log_.warn('No file instance, tutorial won\'t be saved');
    return;
  }
  let file = fileInstance.getFile();
  let json = await this.getJSON_();
  if (file && json) {
    file.setMetadata('', json, '__tutorial__');
  }
};


/**
 * @param {boolean} saveDBKeys
 * @return {!string}
 * @private
 */
cwc.ui.Tutorial.prototype.getJSON_ = async function(saveDBKeys) {
  let json = {};
  json[this.language_] = {
    'description': {
      'text': this.description_.content,
      'mime_type': cwc.utils.mime.Type.HTML.type,
    },
    'steps': Array.from(await Promise.all(this.steps_.map( (step, order) => {
      return this.getStepJSON_(step, saveDBKeys, order);
    }))).sort((a, b) => {
      return a.order - b.order;
    }),
  };
  return json;
};


/**
 * @param {!Object} step
 * @param {boolean} saveDBKeys
 * @param {number} order
 * @return {!Object}
 * @private
 */
cwc.ui.Tutorial.prototype.getStepJSON_ = async function(step, saveDBKeys,
  order) {
  return {
    'title': step.title,
    'description': {
      'text': step.description.content,
      'mime_type': cwc.utils.mime.Type.HTML.type,
    },
    'images': (await Promise.all(step.images.map((image) => {
      return new Promise(async (resolve) => {
        resolve(await this.serializeImage_(image, saveDBKeys));
      });
    }))).filter((image) => image),
    'videos': step.videos,
    'code': step.code,
    'validate': step.validate,
    'order': order,
  };
};


/**
 * @param {!Object} image
 * @param {!bool} saveDBKeys
 * @return {Object|boolean}
 * @private
 */
cwc.ui.Tutorial.prototype.serializeImage_ = async function(image, saveDBKeys) {
  if ('url' in image) {
    return {
      'url': image['url'],
    };
  }
  // Already serialized
  if ('mime_type' in image && 'data' in image) {
    if (!saveDBKeys && cwc.ui.TutorialUtils.databaseReferenceKey) {
      delete image[cwc.ui.TutorialUtils.databaseReferenceKey];
    }
    return image;
  }
  let blob = await this.utils_.imagesDb.get(
    image[cwc.ui.TutorialUtils.databaseReferenceKey]);
  if (!blob) {
    return false;
  }
  let data = await new Promise((resolve) => {
    let reader = new FileReader();
    reader.addEventListener('loadend', (event) => {
      let binStr = '';
      (new Uint8Array(event.target.result)).forEach((i) => {
        binStr += String.fromCharCode(i);
      });
      resolve(btoa(binStr));
    });
    reader.readAsArrayBuffer(blob);
  });
  return {
    'mime_type': blob.type,
    'data': data,
  };
};


/**
 * @return {!bool}
 * @private
 */
cwc.ui.Tutorial.prototype.allowEdit_ = function() {
  if (!this.userConfig) {
    this.log_.error('No userConfig, editing disabled');
    return false;
  }
  return this.userConfig.get(cwc.userConfigType.GENERAL,
    cwc.userConfigName.TEACHER_MODE) === true;
};
