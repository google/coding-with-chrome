/**
 * @fileoverview Select screen for the different coding modes and formats.
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
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
  this.prefix = 'select-screen-';

  /** @type {string} */
  this.generalPrefix = this.helper.getPrefix();

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeContent = null;

  /** @type {!cwc.ui.SelectScreenNormal} */
  this.selectScreenNormal = new cwc.ui.SelectScreenNormal(this.helper,
    this.prefix);

  /** @type {cwc.ui.SelectScreenAdvanced} */
  this.selectScreenAdvanced = new cwc.ui.SelectScreenAdvanced(this.helper,
    this.prefix);

  /** @type {Element|StyleSheet} */
  this.styleSheet = null;

  /** @type {boolean} */
  this.updateMode = false;

  /** @type {boolean} */
  this.lockBasicMode = false;

  /** @type {boolean} */
  this.lockAdvancedMode = false;
};


/**
 * Decorates the given node and adds the start screen.
 * @param {Element} node
 * @param {string=} opt_prefix
 */
cwc.ui.SelectScreen.prototype.decorate = function(node, opt_prefix) {
  this.node = node;
  this.prefix = (opt_prefix || '') + this.prefix;

  goog.soy.renderElement(this.node, cwc.soy.SelectScreen.template,
      {'prefix': this.prefix});

  if (!this.styleSheet) {
    this.styleSheet = goog.style.installStyles(cwc.soy.SelectScreen.style({
      'prefix': this.prefix, 'version': this.helper.getAppVersion()}));
  }

  this.nodeContent = goog.dom.getElement(this.prefix + 'content');
  this.selectScreenNormal.decorate(this.nodeContent);
  this.selectScreenAdvanced.decorate(this.nodeContent);
};


/**
 * Creates a request to show the select screen.
 * @param {Function=} opt_callback
 * @param {boolean=} opt_force_overview
 */
cwc.ui.SelectScreen.prototype.requestShowSelectScreen = function(opt_callback,
    opt_force_overview) {
  var showSelectScreen = function() {
    this.showSelectScreen(opt_force_overview);
    if (opt_callback) {
      opt_callback();
    }
  }.bind(this);
  this.helper.handleUnsavedChanges(showSelectScreen);
};


/**
 * Renders and shows the select screen.
 * @param {boolean=} opt_force_overview
 */
cwc.ui.SelectScreen.prototype.showSelectScreen = function(opt_force_overview) {
  var advancedMode = false;
  var skipWelcomeScreen = false;
  var userConfigInstance = this.helper.getInstance('userConfig');
  if (userConfigInstance) {
    skipWelcomeScreen = userConfigInstance.get(cwc.userConfigType.GENERAL,
            cwc.userConfigName.SKIP_WELCOME);
    advancedMode = userConfigInstance.get(cwc.userConfigType.GENERAL,
            cwc.userConfigName.ADVANCED_MODE);
    if (!this.lockBasicMode && !this.lockAdvancedMode &&
        userConfigInstance.get(cwc.userConfigType.GENERAL,
            cwc.userConfigName.FULLSCREEN)) {
      chrome.app.window.current().maximize();
    }
  }

  var layoutInstance = this.helper.getInstance('layout');
  if (layoutInstance) {
    layoutInstance.decorateSimpleSingleColumnLayout();
    var nodes = layoutInstance.getNodes();
    this.decorate(nodes['content']);
    if (this.lockBasicMode && !opt_force_overview) {
      this.showNormalOverview();
    } else if (this.lockAdvancedMode && !opt_force_overview) {
      this.showAdvancedOverview();
    } else if (!skipWelcomeScreen) {
      this.showWelcome();
    } else if (advancedMode) {
      this.showAdvancedOverview(opt_force_overview);
    } else {
      this.showNormalOverview(opt_force_overview);
    }
    layoutInstance.refresh();
  }

  var guiInstance = this.helper.getInstance('gui');
  if (guiInstance) {
    guiInstance.setTitle('');
    guiInstance.enableTitle(false);
    guiInstance.setStatus('');
  }
};


/**
 * Shows the general welcome screen.
 */
cwc.ui.SelectScreen.prototype.showWelcome = function() {
  this.showTemplate_('welcome');

  var userConfigInstance = this.helper.getInstance('userConfig');
  if (userConfigInstance) {
    var showWelcome = goog.dom.getElement(this.prefix + 'show-welcome');
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
};


/**
 * Shows the basic overview for normal users.
 * @param {boolean=} opt_force_overview
 */
cwc.ui.SelectScreen.prototype.showNormalOverview = function(
    opt_force_overview) {
  this.lockBasicMode = true;
  if (this.updateMode) {
    var userConfigInstance = this.helper.getInstance('userConfig');
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
  this.lockAdvancedMode = true;
  if (this.updateMode) {
    var userConfigInstance = this.helper.getInstance('userConfig');
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
 * @param {!string} template_name
 * @param {Object} opt_template
 * @private
 */
cwc.ui.SelectScreen.prototype.showTemplate_ = function(template_name,
    opt_template) {
  if (this.nodeContent && template_name) {
    var templateConfig = {'prefix': this.prefix};
    var template = opt_template || cwc.soy.SelectScreen;
    goog.soy.renderElement(this.nodeContent, template[template_name],
        templateConfig);
  } else {
    console.error('Unable to render template', template_name);
  }
};


/**
 * Adds the click event for the given name and the given function.
 * @param {!string} name
 * @param {!function()} event
 * @param {string=} opt_prefix
 * @return {function()}
 */
cwc.ui.SelectScreen.prototype.setClickEvent_ = function(name, event,
    opt_prefix) {
  var prefix = opt_prefix || this.prefix;
  var elementName = prefix + name;
  var element = goog.dom.getElement(elementName);
  if (!element) {
    console.error('Was not able to find element ' + elementName + '!');
    return;
  }

  return goog.events.listen(element, goog.events.EventType.CLICK,
      event, false, this);
};
