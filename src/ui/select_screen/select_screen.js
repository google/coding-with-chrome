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

goog.require('cwc.soy.SelectScreen');
goog.require('cwc.soy.SelectScreenAdvanced');
goog.require('cwc.soy.SelectScreenNormal');
goog.require('cwc.ui.SelectScreenWelcome');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.Helper');

goog.require('goog.dom');
goog.require('goog.events.EventTarget');


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

  /** @type {Object} */
  this.modules = {};

  /** @private {!goog.events.EventTarget} */
  this.eventHandler_ = new goog.events.EventTarget();

  /** @type {!cwc.ui.SelectScreenWelcome} */
  this.selectScreenWelcome = new cwc.ui.SelectScreenWelcome(this);

  /** @type {boolean} */
  this.updateMode = false;

  /** @type {boolean} */
  this.lockBasicMode = false;

  /** @type {boolean} */
  this.lockAdvancedMode = false;

  /** @type {boolean} */
  this.prepared_ = false;

  /** @private {!string} */
  this.resourcesPath_ = '../resources/examples/';

  /** @private {!string} */
  this.tourPath_ = '../resources/tour/';

  /** @private {!string} */
  this.tutorialPath_ = '../resources/tutorials/';

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix, this);
};


/**
 * Decorates the given node and adds the start screen.
 * @param {Element} node
 */
cwc.ui.SelectScreen.prototype.decorate = function(node = this.node) {
  if (this.node !== node) {
    this.node = node;
  }
  this.events_.clear();
  goog.soy.renderElement(this.node, cwc.soy.SelectScreen.template, {
    'prefix': this.prefix,
  });
  this.nodeContent = goog.dom.getElement(this.prefix + 'content');

  let userConfigInstance = this.helper.getInstance('userConfig');
  if (userConfigInstance) {
    let moduleConfig = userConfigInstance.getAll(cwc.userConfigType.MODULE);
    this.modules = {};
    moduleConfig.forEach((value, key) => {
      this.modules[key] = value;
    });
  }
};


/**
 * Creates a request to show the select screen.
 * @param {Function=} callback
 * @param {boolean=} forceOverview
 */
cwc.ui.SelectScreen.prototype.requestShowSelectScreen = function(callback,
    forceOverview = false) {
  let showSelectScreen = function() {
    this.showSelectScreen(forceOverview);
    if (callback) {
      callback();
    }
  }.bind(this);
  this.helper.handleUnsavedChanges(showSelectScreen);
};


/**
 * Renders and shows the select screen.
 * @param {boolean=} forceOverview
 */
cwc.ui.SelectScreen.prototype.showSelectScreen = function(forceOverview) {
  let layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    layoutInstance.decorateBlank();
    layoutInstance.refresh();
  }

  let sidebarInstance = this.helper.getInstance('sidebar');
  if (sidebarInstance) {
    sidebarInstance.clear();
  }

  let settingScreenInstance = this.helper.getInstance('settingScreen');
  if (settingScreenInstance) {
    settingScreenInstance.hide();
  }

  let navigationInstance = this.helper.getInstance('navigation');
  if (navigationInstance) {
    navigationInstance.enableOverview(false);
    navigationInstance.enableNewFile(false);
    navigationInstance.enableSaveFile(false);
    navigationInstance.setHeader('Coding with Chrome', 'turned_in');
  }

  let guiInstance = this.helper.getInstance('gui', true);
  guiInstance.setTitle('');
  guiInstance.setStatus('');
  if (this.prepared_ && !forceOverview) {
    guiInstance.showOverlay(true);
    return;
  }
  this.decorate(guiInstance.getOverlayNode());
  guiInstance.showOverlay(true);

  let advancedMode = false;
  let skipWelcomeScreen = false;
  let userConfigInstance = this.helper.getInstance('userConfig');
  if (userConfigInstance) {
    skipWelcomeScreen = userConfigInstance.get(cwc.userConfigType.GENERAL,
            cwc.userConfigName.SKIP_WELCOME);
    advancedMode = userConfigInstance.get(cwc.userConfigType.GENERAL,
            cwc.userConfigName.ADVANCED_MODE);
  }
  if (this.lockBasicMode && !forceOverview) {
    this.showOverview();
  } else if (this.lockAdvancedMode && !forceOverview) {
    this.showOverview(true);
  } else if (!skipWelcomeScreen) {
    this.showWelcome();
  } else {
    this.showOverview(advancedMode);
  }

  this.prepared_ = true;
};


/**
 * Shows the general welcome screen.
 */
cwc.ui.SelectScreen.prototype.showWelcome = function() {
  this.helper.endTour();
  this.lockBasicMode = false;
  this.lockAdvancedMode = false;
  this.selectScreenWelcome.decorate();
};


/**
 * Shows the basic or advanced overview.
 * @param {boolean=} advanced
 */
cwc.ui.SelectScreen.prototype.showOverview = function(advanced = false) {
  this.helper.endTour();
  this.lockBasicMode = !advanced;
  this.lockAdvancedMode = advanced;
  if (this.updateMode) {
    let userConfigInstance = this.helper.getInstance('userConfig');
    if (userConfigInstance) {
      userConfigInstance.set(cwc.userConfigType.GENERAL,
          cwc.userConfigName.ADVANCED_MODE, advanced);
    }
    this.updateMode = false;
  }
  if (advanced) {
    this.showTemplate_(cwc.soy.SelectScreenAdvanced.template);
  } else {
    this.showTemplate_(cwc.soy.SelectScreenNormal.template);
  }

  this.events_.listen('tab-home', goog.events.EventType.CLICK, () => {
    this.showSelectScreen(true);
  });
};


/**
 * Shows the intro.
 */
cwc.ui.SelectScreen.prototype.showIntro = function() {
  this.helper.getInstance('help').showIntro();
};


/**
 * @return {!goog.events.EventTarget}
 */
cwc.ui.SelectScreen.prototype.getEventHandler = function() {
  return this.eventHandler_;
};


/**
 * Adding file link handler.
 * @private
 */
cwc.ui.SelectScreen.prototype.addFileHandler_ = function() {
  let elements = document.querySelectorAll('[data-select-screen-action]');
  Array.from(elements).forEach((element) => {
    this.events_.listen(element, goog.events.EventType.CLICK,
      this.handleFileClick_);
  });
};


/**
 * @param {!Function} template
 */
cwc.ui.SelectScreen.prototype.showTemplate_ = function(template) {
  if (this.nodeContent && template) {
    goog.soy.renderElement(this.nodeContent, template, {
      debug: this.helper.debugEnabled(),
      experimental: this.helper.experimentalEnabled(),
      modules: this.modules,
      online: this.helper.checkFeature('online'),
      prefix: this.prefix,
      version: this.helper.getAppVersion(),
    });
    this.addFileHandler_();
    cwc.ui.Helper.mdlRefresh();

    // Event Handling
    this.eventHandler_.dispatchEvent(
      cwc.ui.SelectScreen.Events.changeView(this.nodeContent));
  } else {
    console.error('Unable to render template', template);
  }
};


/**
 * @param {!string} title
 * @param {!Object} template
 * @param {string=} text
 */
cwc.ui.SelectScreen.prototype.showDialog_ = function(title, template, text) {
  this.helper.getInstance('dialog').showTemplate(title, template, {
    'text': text || 'Please wait ...',
  });
};


/**
 * @private
 * @param {Object} e
 */
cwc.ui.SelectScreen.prototype.handleFileClick_ = function(e) {
  let filename = e.currentTarget.dataset['selectScreenValue'];
  let fileAction = e.currentTarget.dataset['selectScreenAction'];
  if (!fileAction || !filename) {
    return;
  }
  if (filename && fileAction) {
    switch (fileAction) {
      case 'loadFile': {
        this.showDialog_('Loading example file ' + filename,
          cwc.soy.SelectScreen.loading_);
        this.helper.getInstance('fileLoader')
          .loadLocalFile(this.resourcesPath_ + filename);
        break;
      }
      case 'loadTour': {
        this.showDialog_('Loading tour file ' + filename,
          cwc.soy.SelectScreen.loading_);
        this.helper.getInstance('fileLoader')
          .loadLocalFile(this.tourPath_ + filename);
        break;
      }
      case 'loadTutorial': {
        this.showDialog_('Loading tutorial file ' + filename,
          cwc.soy.SelectScreen.loading_);
        this.helper.getInstance('fileLoader')
          .loadLocalFile(this.tutorialPath_ + filename);
        break;
      }
      case 'loadMode': {
        this.showDialog_('Loading mode ' + filename,
          cwc.soy.SelectScreen.loading_);
        this.helper.getInstance('mode').loadMode(filename);
        break;
      }
      case 'switchTab': {
        document.getElementById(filename)['click']();
        break;
      }
    }
    let editorWindow = this.helper.checkChromeFeature('app') &&
      chrome.app.window.get('editor');
    if (editorWindow) {
      editorWindow['clearAttention']();
    }
  }
};
