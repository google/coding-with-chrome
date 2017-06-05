/**
 * @fileoverview Select screen for the different coding modes and formats.
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
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.provide('cwc.ui.SelectScreen');

goog.require('cwc.file.Type');
goog.require('cwc.soy.SelectScreen');
goog.require('cwc.ui.SelectScreenAdvanced');
goog.require('cwc.ui.SelectScreenNormal');
goog.require('cwc.utils.Helper');

goog.require('goog.dom');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 */
cwc.ui.SelectScreen = function(helper) {
  /** @type {string} */
  this.name = 'SelectScreen';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('select-screen');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeContent = null;

  /** @type {!cwc.ui.SelectScreenNormal} */
  this.selectScreenNormal = new cwc.ui.SelectScreenNormal(this.helper);

  /** @type {cwc.ui.SelectScreenAdvanced} */
  this.selectScreenAdvanced = new cwc.ui.SelectScreenAdvanced(this.helper);

  /** @type {boolean} */
  this.updateMode = false;

  /** @type {boolean} */
  this.lockBasicMode = false;

  /** @type {boolean} */
  this.lockAdvancedMode = false;

  /** @private {Shepherd.Tour} */
  this.tour_ = null;
};


/**
 * Decorates the given node and adds the start screen.
 * @param {Element} node
 */
cwc.ui.SelectScreen.prototype.decorate = function(node) {
  this.node = node;

  goog.soy.renderElement(this.node, cwc.soy.SelectScreen.template, {
    'prefix': this.prefix,
  });

  this.nodeContent = goog.dom.getElement(this.prefix + 'content');
  if (this.nodeContent) {
    this.selectScreenNormal.decorate(this.nodeContent);
    this.selectScreenAdvanced.decorate(this.nodeContent);
  }
  this.prepareTour_();
};


/**
 * Creates a request to show the select screen.
 * @param {Function=} optCallback
 * @param {boolean=} forceOverview
 */
cwc.ui.SelectScreen.prototype.requestShowSelectScreen = function(optCallback,
    forceOverview = false) {
  let showSelectScreen = function() {
    this.showSelectScreen(forceOverview);
    if (optCallback) {
      optCallback();
    }
  }.bind(this);
  this.helper.handleUnsavedChanges(showSelectScreen);
};


/**
 * Renders and shows the select screen.
 * @param {boolean=} opt_force_overview
 */
cwc.ui.SelectScreen.prototype.showSelectScreen = function(opt_force_overview) {
  let advancedMode = false;
  let skipWelcomeScreen = false;
  let userConfigInstance = this.helper.getInstance('userConfig');
  if (userConfigInstance) {
    skipWelcomeScreen = userConfigInstance.get(cwc.userConfigType.GENERAL,
            cwc.userConfigName.SKIP_WELCOME);
    advancedMode = userConfigInstance.get(cwc.userConfigType.GENERAL,
            cwc.userConfigName.ADVANCED_MODE);
    if (!this.lockBasicMode && !this.lockAdvancedMode &&
        userConfigInstance.get(cwc.userConfigType.GENERAL,
            cwc.userConfigName.FULLSCREEN)) {
      chrome.app.window.current()['maximize']();
    }
  }

  let layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    layoutInstance.decorateSimpleSingleColumnLayout();
    let nodes = layoutInstance.getNodes();
    this.decorate(nodes['content']);
    if (this.lockBasicMode && !opt_force_overview) {
      this.showNormalOverview();
    } else if (this.lockAdvancedMode && !opt_force_overview) {
      this.showAdvancedOverview();
    } else if (!skipWelcomeScreen) {
      this.setNavHeader_('Coding with Chrome');
      this.showWelcome();
    } else if (advancedMode) {
      this.showAdvancedOverview(opt_force_overview);
    } else {
      this.showNormalOverview(opt_force_overview);
    }
    layoutInstance.refresh();
  }

  let guiInstance = this.helper.getInstance('gui');
  if (guiInstance) {
    guiInstance.setTitle('');
    guiInstance.enableTitle(false);
    guiInstance.setStatus('');
  }

  let navigationInstance = this.helper.getInstance('navigation');
  if (navigationInstance) {
    navigationInstance.enableSaveFile(false);
  }
};


/**
 * Shows the general welcome screen.
 */
cwc.ui.SelectScreen.prototype.showWelcome = function() {
  this.showTemplate_(cwc.soy.SelectScreen.welcome);

  let userConfigInstance = this.helper.getInstance('userConfig');
  if (userConfigInstance) {
    let showWelcome = goog.dom.getElement(this.prefix + 'show-welcome');
    showWelcome.checked = !userConfigInstance.get(cwc.userConfigType.GENERAL,
            cwc.userConfigName.SKIP_WELCOME);
    goog.events.listen(showWelcome, goog.events.EventType.CHANGE,
      function(opt_event) {
        this.updateMode = !showWelcome.checked;
        userConfigInstance.set(cwc.userConfigType.GENERAL,
          cwc.userConfigName.SKIP_WELCOME, !showWelcome.checked);
      }, false, this);
  }
  this.setClickEvent_('link-normal-mode', this.showNormalOverview);
  this.setClickEvent_('link-advanced-mode', this.showAdvancedOverview);

  if (this.helper.getAndSetFirstRun(this.name)) {
    // this.startTour();
  }

  // Blockly demo
  Blockly.inject('blocklyExampleDiv', {
    'media': '/external/blockly/media/',
    'toolbox': document.getElementById('blocklyExampleToolbox'),
  });

  // Codemirror demo
  CodeMirror.fromTextArea(document.getElementById('codeMirrorExample'), {
    'lineNumbers': true,
  });
};


/**
 * Starts an basic tour.
 */
cwc.ui.SelectScreen.prototype.startTour = function() {
  if (this.tour_) {
    this.tour_['start']();
  }
};


/**
 * Shows the basic overview for normal users.
 * @param {boolean=} opt_force_overview
 */
cwc.ui.SelectScreen.prototype.showNormalOverview = function(
    opt_force_overview) {
  this.helper.endTour();
  this.lockBasicMode = true;
  this.lockAdvancedMode = false;
  if (this.updateMode) {
    let userConfigInstance = this.helper.getInstance('userConfig');
    if (userConfigInstance) {
      userConfigInstance.set(cwc.userConfigType.GENERAL,
          cwc.userConfigName.ADVANCED_MODE, false);
    }
    this.updateMode = false;
    this.selectScreenNormal.showView();
  } else if (opt_force_overview) {
    this.selectScreenNormal.showView(cwc.ui.SelectScreenNormalView.OVERVIEW);
  } else {
    this.selectScreenNormal.showLastView();
  }
};


/**
 * Shows the advanced overview for more advanced user.
 * @param {boolean=} opt_force_overview
 */
cwc.ui.SelectScreen.prototype.showAdvancedOverview = function(
    opt_force_overview) {
  this.helper.endTour();
  this.lockAdvancedMode = true;
  this.lockBasicMode = false;
  if (this.updateMode) {
    let userConfigInstance = this.helper.getInstance('userConfig');
    if (userConfigInstance) {
      userConfigInstance.set(cwc.userConfigType.GENERAL,
          cwc.userConfigName.ADVANCED_MODE, true);
    }
    this.updateMode = false;
    this.selectScreenAdvanced.showView();
  } else if (opt_force_overview) {
    this.selectScreenAdvanced.showView(
      cwc.ui.SelectScreenAdvancedView.OVERVIEW);
  } else {
    this.selectScreenAdvanced.showLastView();
  }
};


/**
 * Shows the intro.
 */
cwc.ui.SelectScreen.prototype.showIntro = function() {
  this.helper.getInstance('help').showIntro();
};


/**
 * @private
 */
cwc.ui.SelectScreen.prototype.prepareTour_ = function() {
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


/**
 * @param {!string} title
 * @param {string=} opt_icon
 * @param {string=} opt_color_class
 * @private
 */
cwc.ui.SelectScreen.prototype.setNavHeader_ = function(title,
    opt_icon, opt_color_class) {
  let navigationInstance = this.helper.getInstance('navigation');
  if (navigationInstance) {
    navigationInstance.setHeader(title, opt_icon, opt_color_class);
  }
};


/**
 * @param {!Function} template
 * @private
 */
cwc.ui.SelectScreen.prototype.showTemplate_ = function(template) {
  if (this.nodeContent && template) {
    goog.soy.renderElement(this.nodeContent, template, {
      debug: this.helper.debugEnabled(),
      experimental: this.helper.experimentalEnabled(),
      online: this.helper.checkFeature('online'),
      prefix: this.prefix,
      version: this.helper.getAppVersion(),
    });
  } else {
    console.error('Unable to render template', template);
  }
};


/**
 * Adds the click event for the given name and the given function.
 * @param {!string} name
 * @param {!function()} event
 * @param {string=} prefix
 * @return {goog.events.ListenableKey|null|number}
 */
cwc.ui.SelectScreen.prototype.setClickEvent_ = function(name, event,
    prefix = this.prefix) {
  let elementName = prefix + name;
  let element = goog.dom.getElement(elementName);
  if (!element) {
    console.error('Was not able to find element ' + elementName + '!');
    return null;
  }

  return goog.events.listen(element, goog.events.EventType.CLICK,
      event, false, this);
};
