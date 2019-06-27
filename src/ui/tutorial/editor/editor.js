/**
 * @fileoverview Tutorial Editor
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
 */
goog.provide('cwc.ui.tutorial.Editor');

goog.require('cwc.soy.ui.tutorial.Editor');
goog.require('cwc.soy.ui.tutorial.EditorHelp');
goog.require('cwc.ui.tutorial.EditorEvents');
goog.require('cwc.renderer.Helper');
goog.require('cwc.ui.TutorialValidator');
goog.require('cwc.ui.EditorConfig');
goog.require('cwc.ui.EditorType');
goog.require('cwc.ui.EditorHint');
goog.require('cwc.utils.Helper');
goog.require('cwc.utils.Logger');
goog.require('cwc.utils.mime.Type');
goog.require('cwc.utils.Resources');

goog.require('goog.dom');
goog.require('goog.html.SafeHtml');
goog.require('goog.html.sanitizer.HtmlSanitizer');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.soy');
goog.require('goog.string');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('soydata.VERY_UNSAFE');


/**
 * @param {!cwc.utils.Helper} helper
 * @param {!cwc.ui.TutorialUtils} utils
 * @constructor
 * @struct
 * @final
 * @export
 */
cwc.ui.tutorial.Editor = function(helper, utils) {
  /** @type {!string} */
  this.name = 'Tutorial Editor';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('tutorial-editor');

  /** @type {string} */
  this.collapsedClass_ = `${this.prefix}step-collapsed`;

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {Element} */
  this.container_;

  /** @private {!cwc.utils.Events} */
  this.eventTarget_ = new goog.events.EventTarget();

  /** @private {Object} */
  this.description_;

  /** @private {Array<Object>} */
  this.steps_ = [];

  /** @private {cwc.ui.TutorialUtils} */
  this.utils_ = utils;
};


/**
 * @param {!Object} tutorial
 * @param {Element} container
 * @export
 */
cwc.ui.tutorial.Editor.prototype.edit = function(tutorial, container) {
  this.log_.info('Editing tutorial', tutorial);
  if (container) {
    this.container_ = container;
  } else if (!this.container_) {
    this.log_.error('You must supply an element on first render');
  }

  goog.soy.renderElement(this.container_, cwc.soy.ui.tutorial.Editor.template, {
    prefix: this.prefix,
    tutorialPrefix: this.utils_.tutorialPrefix,
    steps: tutorial['steps'].map((step) => {
      let text_match_success_message;
      if ('validate' in step && typeof step['validate'] == 'object') {
        text_match_success_message = step['validate']['message'];
      }
      return {
        title: step.title,
        images: this.utils_.getImageKeys(step['images'] || []),
        videos: this.utils_.getVideoKeys(step['images'] || []),
        youtube_videos: (step['videos'] || []).map((video) =>
          video['youtube_id']),
        text_match_success_message: text_match_success_message,
      };
    }),
  });

  // The temporary steps variable lets us preserve the collapsed state of
  // steps on rerender()
  let steps = [];
  tutorial['steps'].forEach((step, id) => {
    steps[id] = this.initStep_(id, step,
      (id in this.steps_) && this.steps_[id].collapsed);
  });
  this.steps_ = steps;

  this.initButtons_();
  this.initFields_(tutorial);

  // Show editor
  goog.dom.classlist.remove(this.container_, 'is-hidden');
  // MDL toggles don't show up until we refresh for unknown reasons.
  cwc.ui.Helper.mdlRefresh();
};


/**
 * @param {!Object} tutorial
 * @private
 */
cwc.ui.tutorial.Editor.prototype.initFields_ = function(tutorial) {
  if (!this.helper.checkJavaScriptFeature('clEditor')) {
    this.log_.warn('clEditor missing, user will have to edit raw html');
    return;
  }
  let description = document.querySelector(`#${this.prefix}description`);
  if (description) {
    this.description_ = this.initHTMLEditor_(description,
      tutorial.description);
  } else {
    this.log_.error('Failed to find description element');
  }
};


/**
 * @param {number} id
 * @return {Element}
 * @private
 */
cwc.ui.tutorial.Editor.prototype.getStepElement_ = function(id) {
  let step = goog.dom.getElement(`${this.prefix}step${id}`);
  if (!step) {
    this.log_.error('Failed to get element for step', id);
    return false;
  }
  return step;
};


/**
 * @param {number} id
 * @param {Object} template
 * @param {boolean} collapsed
 * @return {Object}
 * @private
 */
cwc.ui.tutorial.Editor.prototype.initStep_ = function(id, template, collapsed) {
  let stepElement = this.getStepElement_(id);
  if (!stepElement) {
    return {};
  }

  if (collapsed) {
    goog.dom.classlist.add(stepElement, this.collapsedClass_);
  } else {
    goog.dom.classlist.remove(stepElement, this.collapsedClass_);
  }

  // Show/Hide
  goog.events.listen(stepElement.querySelector(`.${this.prefix}step-title`),
    goog.events.EventType.CLICK, () => {
      this.steps_[id]['collapsed'] = goog.dom.classlist.toggle(stepElement,
        this.collapsedClass_);
  });

  // Sync the title with the input
  let titleElement = stepElement.querySelector(
    `.${this.prefix}step-title-text`);
  let titleInput = stepElement.querySelector(`.${this.prefix}step-input-title`);
  goog.events.listen(titleInput, goog.events.EventType.KEYUP, () => {
    goog.soy.renderElement(titleElement, cwc.soy.ui.tutorial.Editor.step_title,
      {
        'title': titleInput.value,
      });
  });

  this.initStepButtons_(id, stepElement);

  return {
    'title': titleInput,
    'description': this.initHTMLEditor_(
      stepElement.querySelector(`.${this.prefix}step-input-description`),
      template.description, 200),
    'images': template['images'],
    'videos': template['videos'],
    'code': this.initCodeEditor_(
      stepElement.querySelector(`.${this.prefix}step-example-code`),
      template['code']),
    'validate': this.initStepValidate_(stepElement, template['validate']),
  };
};


/**
 * @param {number} id
 * @param {Element} stepElement
 * @private
 */
cwc.ui.tutorial.Editor.prototype.initStepButtons_ = function(id, stepElement) {
  // Display images/videos/youtube
  this.utils_.initMedia_(stepElement);
  this.initStepNewMediaButtons_(id, stepElement);
  this.utils_.initStepMediaButtons_(stepElement);
  this.initStepDeleteMediaButtons_(id, stepElement);
  this.initStepPositionButtons_(id, stepElement);
};


/**
 * @param {Element} stepElement
 * @param {Object} template
 * @return {Object}
 * @private
 */
cwc.ui.tutorial.Editor.prototype.initStepValidate_ = function(stepElement,
  template) {
  let validate = this.initStepValidateToggle_(stepElement, template);
  this.initStepValidateLoadCodeButton_(validate['code'], stepElement);
  return validate;
};


/**
 * @param {Element} stepElement
 * @param {Object} template
 * @return {Object}
 * @private
 */
cwc.ui.tutorial.Editor.prototype.initStepValidateToggle_ = function(stepElement,
  template) {
  let checked = template && template['type'] == 'function';
  let value = template['value'] || '';
  let toggle = stepElement.querySelector(`.${this.prefix}step-toggle`);
  if (!toggle) {
    this.log_.error('Failed to get toggle for step', stepElement);
    return;
  }
  let validate = {
    'type': stepElement.querySelector(
      `.${this.prefix}step-toggle-button input`),
    'text': stepElement.querySelector(`.${this.prefix}step-validate-text`),
    'code': this.initCodeEditor_(stepElement.querySelector(
      `.${this.prefix}step-validate-code`), checked ? value : '', {
        'mode': cwc.ui.EditorType.JAVASCRIPT,
        'hints': cwc.ui.EditorHint.JAVASCRIPT,
      }),
  };
  if (!validate['type']) {
    this.log_.error('Failed to get toggle input for step', stepElement);
    return;
  }
  if (!validate['text']) {
    this.log_.error('Failed to get validate text input for step', stepElement);
    return;
  }
  if (!checked) {
    validate['text'].value = value;
  }
  if (!validate['code']) {
    this.log_.error('Failed to get validate code input for step', stepElement);
    return;
  }
  let handleTypeChange = (enabled) => {
    goog.dom.classlist.enable(toggle, 'is-active', enabled);
  };
  goog.events.listen(validate['type'], goog.events.EventType.CHANGE, (e) => {
    handleTypeChange(e['target']['checked']);
  });
  validate['type']['checked'] = checked;
  handleTypeChange(checked);
  return validate;
};


/**
 * @param {Object} codeEditor
 * @param {Element} stepElement
 * @private
 */
cwc.ui.tutorial.Editor.prototype.initStepValidateLoadCodeButton_ =
  function(codeEditor, stepElement) {
  let selector = `.${this.prefix}step-load-validation-template`;
  let button = stepElement.querySelector(selector);
  if (!button) {
    this.log_.error('Failed to find', selector, 'in', stepElement);
    return;
  }
  let validationExample = `function validate(code) {
    if (!code) {
      return {
        'solved': false,
        'message': 'Your code is empty.',
      };
    }
    if (document.querySelector('div')) {
      return {
        'solved': true,
        'message': 'Your program creates a <div> element. Good job.',
      };
    }
    return {
      'solved': false,
      'message': 'Please write code that adds a <div> element to the document.',
    };
  }`;
  goog.events.listen(button, goog.events.EventType.CLICK, () => {
    if (codeEditor.getValue() == validationExample) {
      return;
    }
    if (codeEditor.getValue().trim() == '') {
      codeEditor.setValue(validationExample);
      return;
    }
    let dialogInstance = this.helper.getInstance('dialog');
    dialogInstance.showActionCancel('Replace code',
      'This will overwrite the code in the validation code editor.',
      'Are You Sure?').then((answer) => {
        if (answer) {
          codeEditor.setValue(validationExample);
        }
      });
  });
};


/**
 * @param {number} id
 * @param {Element} stepElement
 * @private
 */
cwc.ui.tutorial.Editor.prototype.initStepPositionButtons_ =
  function(id, stepElement) {
  // Activate up/down/delete buttons
  // Existance of the buttons is determined in the soy template using
  // isFirst() and isLast(). We rely on that rather than this.steps_.length
  // because this.initStep_() is called to populate this.steps_.
  let upButton = stepElement.querySelector(`.${this.prefix}step-up`);
  if (upButton) {
    goog.events.listen(upButton, goog.events.EventType.CLICK, () => {
      this.log_.info(`Moving step ${id} up`);
      this.swapSteps_(id, id-1);
    });
  }
  let downButton = stepElement.querySelector(`.${this.prefix}step-down`);
  if (downButton) {
    goog.events.listen(downButton, goog.events.EventType.CLICK, () => {
      this.log_.info(`Moving step ${id} down`);
      this.swapSteps_(id, id+1);
    });
  }
  goog.events.listen(stepElement.querySelector(`.${this.prefix}step-remove`),
    goog.events.EventType.CLICK, () => {
      let dialogInstance = this.helper.getInstance('dialog');
      if (dialogInstance) {
        dialogInstance.showActionCancel('Remove Step', `Remove step ${id + 1}?`,
          'Yes').then((answer) => {
          if (answer) {
            this.deleteStep_(id);
          }
        });
      }
  });
};


/**
 * @param {number} stepId
 * @param {Element} stepElement
 */
cwc.ui.tutorial.Editor.prototype.initStepDeleteMediaButtons_ = function(stepId,
  stepElement) {
  let deleteButtons = stepElement.querySelectorAll(
      `.${this.prefix}step-media-button-delete`);
  deleteButtons.forEach((button) => {
    goog.events.listen(button, goog.events.EventType.CLICK, () => {
      this.deleteMedia_(stepId, button);
    });
  });
};


/**
 * @param {number} stepId
 * @param {Element} deleteButton
 */
cwc.ui.tutorial.Editor.prototype.deleteMedia_ = function(stepId, deleteButton) {
  if (!(stepId in this.steps_)) {
    this.log_.error('Invalid step id', stepId);
  }
  let step = this.steps_[stepId];
  let type = deleteButton.getAttribute('data-media-type');
  if (!type) {
    this.log_.error('Delete button', deleteButton, 'missing data-media-type');
    return;
  }
  if (!(type in step)) {
    this.log_.error('Step', step, 'has no', type, 'to delete');
  }
  if (!['images', 'videos'].includes(type)) {
    this.log_.error('Invalid media type', type);
  }
  let key = deleteButton.getAttribute('data-media-key');
  if (!key) {
    this.log_.error('Delete button', deleteButton, 'missing data-media-key');
    return;
  }
  if (!(key in step[type])) {
    this.log_.error('Invalid index', key, 'for type', type, 'in step', step);
  }
  this.steps_[key][type].splice(key, 1);
  this.rerender_();
};


/**
 * @param {string} stepId
 * @param {Element} stepElement
 * @private
 */
cwc.ui.tutorial.Editor.prototype.initStepNewMediaButtons_ = function(stepId,
  stepElement) {
  // 'New' media item buttons
  for (const [name, handler] of Object.entries({
    'attachment': this.handleStepAttachmentClick_,
    'youtube': this.handleStepYoutubeClick_,
  })) {
    goog.events.listen(stepElement.querySelector(
      `.${this.prefix}step-button-${name}`),
      goog.events.EventType.CLICK,
      () => {
        handler.call(this, stepId);
     });
  }
};


/**
 * @param {string} stepId
 * @private
 */
cwc.ui.tutorial.Editor.prototype.handleStepAttachmentClick_ = function(stepId) {
  let options = {
    'type': 'openFile',
    'accepts': [
      cwc.utils.mime.getAcceptedTypesEntry('image'),
      cwc.utils.mime.getAcceptedTypesEntry('video'),
    ],
    'acceptsMultiple': false,
  };
  chrome.fileSystem.chooseEntry(options, async (file_entry) => {
    let spec = await this.readAttachment_(file_entry);
    if (!spec) {
      this.log_.info('User canceled adding image/video');
      return;
    }
    this.log_.info('Adding image', spec, 'to step', stepId);
    await this.utils_.cacheMedia(spec);
    if (!Array.isArray(this.steps_[stepId]['images'])) {
      this.steps_[stepId]['images'] = [];
    }
    this.steps_[stepId]['images'].push(spec);
    this.rerender_();
  });
};


/**
 * @param {Object} file_entry
 * @return {Object}
 * @private
 */
cwc.ui.tutorial.Editor.prototype.readAttachment_ = async function(file_entry) {
  if (chrome.runtime.lastError) {
    let message = chrome.runtime.lastError.message;
    if (message && message == 'User cancelled') {
      this.log_.info('User cancelled file open');
    } else {
      this.helper.showWarning(message);
    }
    return;
  }
  if (!file_entry) {
    this.log_.error('No error, but file_entry is empty or false');
  }
  if (!file_entry.isFile) {
    this.log_.error('Not a file', file_entry);
    return;
  }
  return await new Promise((resolve) => {
    file_entry.file((file) => {
      let reader = new FileReader;
      reader.onload = (e) => {
        if (!file) {
          this.helper.showError('Failed to open file', file);
          return;
        }
        resolve({
          'mime_type': cwc.utils.mime.getTypeByNameAndContent(
            file_entry['name'] || '', e.target.result),
          'data': btoa(e.target.result),
        });
      };
      reader.readAsBinaryString(file);
    });
  });
};


/**
 * @param {number} stepId
 * @private
 */
cwc.ui.tutorial.Editor.prototype.handleStepYoutubeClick_ =
  async function(stepId) {
  let dialogInstance = this.helper.getInstance('dialog');
  let url = await dialogInstance.showPrompt('YouTube URL',
    'Example: https://youtu.be/Cbpug5Atmmo');
  if (!url || (url.trim() == '')) {
    this.log_.info('No URL from YouTube dialog, not inserting video');
    return;
  }
  if (!(stepId in this.steps_)) {
    this.log_.error('Ignoring request to add YouTube video to invalid step',
      stepId);
    return;
  }
  let step = this.steps_[stepId];
  if (!Array.isArray(step['videos'])) {
    step['videos'] = [];
  }
  this.log_.info('Adding YouTube video', url, 'to step', stepId);
  let spec = {'youtube_id': this.utils_.getYouTubeVideoId(url)};
  await this.utils_.cacheMedia(spec);
  step['videos'].push(spec);
  this.rerender_();
};


/**
 * @param {number} id
 * @private
 */
cwc.ui.tutorial.Editor.prototype.deleteStep_ = function(id) {
  this.log_.info(`Deleting step ${id}`);
  goog.dom.removeNode(this.getStepElement_(id));
  this.steps_.splice(id, 1);
};


/**
 * @param {number} id1
 * @param {number} id2
 * @private
 */
cwc.ui.tutorial.Editor.prototype.swapSteps_ = function(id1, id2) {
  let valid = true;
  [id1, id2].forEach((id) => {
    if (!(id in this.steps_)) {
      this.log_.warn(`Invalid step: ${id}`);
      valid = false;
    }
  });
  if (!valid) {
    return;
  }

  this.log_.info(`Swapping steps ${id1} and ${id2}`);
  let step1 = this.steps_[id1];
  let step2 = this.steps_[id2];
  this.steps_[id2] = step1;
  this.steps_[id1] = step2;

  this.rerender_();
};


/**
 * @param {Object} tutorial
 * @private
 */
cwc.ui.tutorial.Editor.prototype.rerender_ = function(tutorial) {
  if (!tutorial) {
    tutorial = this.getTutorial();
  }
  this.edit(tutorial);
};


/**
 * @private
 */
cwc.ui.tutorial.Editor.prototype.newStep_ = function() {
  let tutorial = this.getTutorial();

  tutorial['steps'][tutorial['steps'].length] = {
    'title': '',
    'description': {
      'text': '',
      'mime_type': 'text/html',
    },
  };

  this.rerender_(tutorial);
  this.scrollToStep_(tutorial['steps'].length - 1);
};


/**
 * @param {number} id
 * @private
 */
cwc.ui.tutorial.Editor.prototype.scrollToStep_ = function(id) {
  let step = this.getStepElement_(id);
  if (!step) {
    return;
  }
  this.container_.scrollTop = step.offsetTop - this.container_.offsetTop;
};


/**
 * @param {Element} target
 * @param {Object} content
 * @param {number} height
 * @return {Object|Element}
 * @private
 */
cwc.ui.tutorial.Editor.prototype.initHTMLEditor_ = function(target, content) {
  if (!target) {
    this.log_.error('No target', target);
    return;
  }
  let sanitizedContent = this.utils_.sanitizeTextObject(content);
  let editor;
  if (this.helper.checkJavaScriptFeature('clEditor')) {
    editor = new clEditor({ // eslint-disable-line new-cap
      'target': target,
      'data': {
        'actions': ['viewHtml', 'undo', 'redo', 'b', 'i', 'u', 'strike', 'sup',
          'sub', 'h1', 'h2', 'p', 'blockquote', 'ol', 'ul', 'hr', 'left',
          'right', 'center', 'justify', 'a', 'forecolor', 'backcolor',
          'removeFormat'],
        'html': sanitizedContent,
        'height': '', // This allows us to style height with CSS
      },
    });
  } else {
    editor = document.createElement('textarea');
    editor.value = sanitizedContent;
    goog.dom.appendChild(target, editor);
  }
  return editor;
};


/**
 * @param {!Element} target
 * @param {!string} content
 * @param {Object} editorParams
 * @return {Object|Element}
 * @private
 */
cwc.ui.tutorial.Editor.prototype.initCodeEditor_ = function(target, content,
  editorParams) {
  if (!target) {
    this.log_.error('No target', target);
    return;
  }
  if (!editorParams) {
    editorParams = this.getCurrentEditorParams_();
  }
  if (!('mode' in editorParams)) {
    editorParams['mode'] = cwc.ui.EditorType.JAVASCRIPT;
    this.log_.warn('No mode in editorParams, defaulting to',
      editorParams['mode']);
  }
  if (!('hints' in editorParams)) {
    editorParams['hints'] = cwc.ui.EditorHint.JAVASCRIPT,
    this.log_.warn('No hints in editorParams, defaulting to',
      editorParams['hints']);
  }
  let options = Object.assign(JSON.parse(JSON.stringify(cwc.ui.EditorConfig)), {
    'value': content || '',
    'mode': editorParams['mode'],
    'autoRefresh': true,
    'autofocus': true,
    'hintOptions': CodeMirror['hint'][editorParams['hints']],
    'lint': {
      'options': {
        'esversion': 6,
       },
     },
    'extraKeys': {
      'Ctrl-Q': function(cm) {
        cm.foldCode(cm.getCursor());
      },
      'Ctrl-J': 'toMatchingTag',
      'Cmd-Space': 'autocomplete',
      'Ctrl-Space': 'autocomplete',
    },
    // The serialize clone above fails to capture a regexp object in this opt
    'highlightSelectionMatches':
      cwc.ui.EditorConfig['highlightSelectionMatches'],
  });
  let editor = new CodeMirror(target, options);
  // The autoRefresh plugin appears to be ineffective, but the setTimeout
  // technique seems to work.
  setTimeout(() => {
    editor.refresh();
  }, 250);
  return editor;
};


/**
 * @return {Object}
 * @private
 */
cwc.ui.tutorial.Editor.prototype.getCurrentEditorParams_ = function() {
  let editorInstance = this.helper.getInstance('editor');
  if (!editorInstance) {
    this.log_.error('No editor, can\'t init code editor');
    return {};
  }
  let params = {
    'mode': editorInstance.getEditorMode(),
  };
  let editorView = editorInstance.getCurrentView();
  if (!editorView) {
    this.log_.error('No current editor view');
    return params;
  }
  params['hints'] = editorView.getHints();
  return params;
};


/**
 * @private
 */
cwc.ui.tutorial.Editor.prototype.initButtons_ = function() {
  // Add step
  document.querySelectorAll(`.${this.prefix}add-step`).forEach((button) => {
    goog.events.listen(button, goog.events.EventType.CLICK,
      this.newStep_.bind(this));
  });
  // Save
  document.querySelectorAll(`.${this.prefix}save`).forEach((button) => {
    goog.events.listen(button, goog.events.EventType.CLICK, () => {
      this.close_(true);
    });
  });
  // Cancel
  document.querySelectorAll(`.${this.prefix}cancel`).forEach((button) => {
    goog.events.listen(button, goog.events.EventType.CLICK, () => {
      this.close_(false);
    });
  });

  this.initHelpButtons_('example-code', i18t('@@TUTORIAL_EDITOR__EXAMPLE_CODE'),
    cwc.soy.ui.tutorial.EditorHelp.example_code);
  this.initHelpButtons_('validation', i18t('@@TUTORIAL_EDITOR__VALIDATION'),
    cwc.soy.ui.tutorial.EditorHelp.validation);
  this.initHelpButtons_('match-text', i18t('@@TUTORIAL_EDITOR__MATCH_TEXT'),
    cwc.soy.ui.tutorial.EditorHelp.match_text);
  this.initHelpButtons_('run-code', i18t('@@TUTORIAL_EDITOR__RUN_CODE'),
    cwc.soy.ui.tutorial.EditorHelp.run_code);
};


/**
 * @param {string} selectorSuffix
 * @param {string} title
 * @param {Function} template
 */
cwc.ui.tutorial.Editor.prototype.initHelpButtons_ = function(selectorSuffix,
  title, template) {
  let selector = `.${this.prefix}step-help-button-${selectorSuffix}`;
  let buttons = document.querySelectorAll(selector);
  if (buttons.length < 1) {
    this.log_.warn('Selector', selector, 'found no buttons');
    return;
  }
  let dialogInstance = this.helper.getInstance('dialog');
  buttons.forEach((button) => {
    goog.events.listen(button, goog.events.EventType.CLICK, () => {
      dialogInstance.showTemplate(title, template, {'prefix': this.prefix});
    });
  });
};


/**
 * @return {!Object} tutorial
 * @export
 */
cwc.ui.tutorial.Editor.prototype.getTutorial = function() {
  let tutorial = {};
  if (this.description_) {
    tutorial['description'] = this.saveEditor_(this.description_);
  }
  tutorial['steps'] = this.steps_.map((step, id) => {
    return this.getStepForSave_(id);
  });
  this.log_.info('Generated tutorial', tutorial);
  return tutorial;
};


/**
 * @param {string} id
 * @return {Object}
 * @private
 */
cwc.ui.tutorial.Editor.prototype.getStepForSave_ = function(id) {
  if (!(id in this.steps_)) {
    this.log_.error('Invalid step', id);
    return {};
  }
  let step = this.steps_[id];
  let validate = {};
  if (step['validate']['type']['checked']) {
    validate['type'] = 'function';
    validate['value'] = step['validate']['code'].getValue();
  } else {
    validate['type'] = 'match_text_output';
    validate['value'] = step['validate']['text'].value;
    let validateTextMessageElement = this.getStepElement_(id)
      .querySelector(`.${this.prefix}step-text-match-success-message`);
    validate['message'] = validateTextMessageElement.value;
  }
  return {
    'title': step['title'].value,
    'description': this.saveEditor_(step['description']),
    'images': this.stripDBRefs_(step['images'] || []),
    'videos': this.stripDBRefs_(step['videos'] || []),
    'code': step['code'].getValue() || '',
    'validate': validate,
  };
};


/**
 * Strips database references. Used when preparing for save.
 * @param {Array<Object>} specs
 * @return {Array<Object>}
 * @private
 */
cwc.ui.tutorial.Editor.prototype.stripDBRefs_ = function(specs) {
  return specs.map((spec) => {
    delete spec[cwc.ui.TutorialUtils.databaseReferenceKey];
    return spec;
  });
};


/**
 * @param {Object} editor
 * @return {string} html
 * @private
 */
cwc.ui.tutorial.Editor.prototype.saveEditor_ = function(editor) {
  let html;
  if (this.helper.checkJavaScriptFeature('clEditor')) {
    html = editor['getHtml']();
  } else {
    html = editor.value;
  }
  return {
    'text': html,
    'mime_type': 'text/html',
  };
};


/**
 * @return {!goog.events.EventTarget}
 */
cwc.ui.tutorial.Editor.prototype.getEventTarget = function() {
  return this.eventTarget_;
};


/**
 * @param {!boolean} save
 * @private
 */
cwc.ui.tutorial.Editor.prototype.close_ = function(save) {
  goog.dom.classlist.add(this.container_, 'is-hidden');
  this.eventTarget_.dispatchEvent(cwc.ui.tutorial.EditorEvents.close(save,
    this));
};
