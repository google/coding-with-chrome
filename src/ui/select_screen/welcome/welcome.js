/**
 * @fileoverview Welcome select screen.
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
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.provide('cwc.ui.SelectScreenWelcome');

goog.require('cwc.soy.SelectScreenWelcome');


/**
 * @param {!cwc.ui.SelectScreen} selectScreen
 * @constructor
 * @struct
 */
cwc.ui.SelectScreenWelcome = function(selectScreen) {
  /** @type {string} */
  this.name = 'SelectScreenWelcome';

  /** @type {!cwc.utils.Helper} */
  this.helper = selectScreen.helper;

  /** @type {string} */
  this.prefix = selectScreen.prefix;

  /** @private {Shepherd.Tour} */
  this.tour_ = null;

  /** @private {Function} */
  this.showTemplate_ = selectScreen.showTemplate_.bind(selectScreen);

  /** @private {Function} */
  this.showNormalOverview_ = () => {
    selectScreen.showOverview();
  };

  /** @private {Function} */
  this.showAdvancedOverview_ = () => {
    selectScreen.showOverview(true);
  };

  this.prepareTour_();
};


/**
 * Decorates the given node and adds the start screen.
 */
cwc.ui.SelectScreenWelcome.prototype.decorate = function() {
  this.showTemplate_(cwc.soy.SelectScreenWelcome.template);

  let userConfigInstance = this.helper.getInstance('userConfig');
  if (userConfigInstance) {
    let showWelcome = goog.dom.getElement(this.prefix + 'show-welcome');
    if (userConfigInstance.get(
          cwc.userConfigType.GENERAL, cwc.userConfigName.SKIP_WELCOME)) {
      showWelcome.parentNode['MaterialCheckbox']['uncheck']();
    } else {
      showWelcome.parentNode['MaterialCheckbox']['check']();
    }
    goog.events.listen(showWelcome, goog.events.EventType.CHANGE,
      function(opt_event) {
        this.updateMode = !showWelcome.checked;
        userConfigInstance.set(cwc.userConfigType.GENERAL,
          cwc.userConfigName.SKIP_WELCOME, !showWelcome.checked);
      }, false, this);
  }

  if (this.helper.getAndSetFirstRun(this.name)) {
    // this.startTour();
  }

  // Blockly demo
  let workspace = Blockly.inject('blocklyExampleDiv', {
    'media': '/external/blockly/media/',
    'toolbox': document.getElementById('blocklyExampleToolbox'),
  });
  let workspaceNode = goog.dom.getElement('blocklyExampleWorkspace');
  if (workspaceNode) {
    Blockly.Xml.domToWorkspace(workspaceNode, workspace);
  }

  // Codemirror demo
  let editorNode = goog.dom.getElement('codeMirrorExample');
  if (editorNode) {
    CodeMirror.fromTextArea(editorNode, {
      'lineNumbers': true,
      'foldGutter': true,
      'gutters': ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    });
  }

  // Events
  goog.events.listen(document.querySelector(
      '#' + this.prefix + 'link-normal-mode .mdl-card__actions'),
    goog.events.EventType.CLICK, this.showNormalOverview_);
  goog.events.listen(document.querySelector(
      '#' + this.prefix + 'link-advanced-mode .mdl-card__actions'),
    goog.events.EventType.CLICK, this.showAdvancedOverview_);
  this.prepareTour_();
};


/**
 * Starts an basic tour.
 */
cwc.ui.SelectScreen.prototype.startTour = function() {
  if (this.tour_) {
    this.tour_.start();
  }
};


/**
 * @private
 */
cwc.ui.SelectScreenWelcome.prototype.prepareTour_ = function() {
  if (!this.helper.checkJavaScriptFeature('shepherd') || this.tour_) {
    return;
  }

  this.tour_ = new Shepherd.Tour({
    'defaults': {
      'classes': 'shepherd-theme-arrows',
      'showCancelLink': true,
    },
  });
  this.tour_.addStep('welcome', {
    'title': i18t('Welcome to Coding with Chrome!'),
    'text': i18t('This tour will explain some UI parts.'),
    'buttons': [{
      'text': 'Exit',
      'action': this.tour_.cancel,
      'classes': 'shepherd-button-secondary',
    }, {
      'text': 'Next',
      'action': this.tour_.next,
      'classes': 'shepherd-button-example-primary',
    }],
  });
  this.tour_.addStep('menubar', {
    'title': i18t('Menubar'),
    'text': i18t('...'),
    'attachTo': '#cwc-gui-bar bottom',
  });
  this.tour_.addStep('navigation', {
    'title': i18t('Navigation'),
    'text': i18t('...'),
    'when': {
      'before-show': function() {
        document.getElementsByClassName('mdl-layout__drawer-button')[0].click();
      },
    },
  });
  this.tour_.addStep('skip_welcome', {
    'title': i18t('Show screen on startup'),
    'text': i18t('...'),
    'attachTo': '#cwc-select-screen-show-welcome top',
    'when': {
      'before-show': function() {
        document.getElementsByClassName('mdl-layout__drawer-button')[0].click();
      },
    },
  });
  this.tour_.addStep('welcome', {
    'text': i18t('Please select your current coding skill to start.'),
    'attachTo': '.mdl-grid top',
  });
};
