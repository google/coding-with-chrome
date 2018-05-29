/**
 * @fileoverview Settings screen for the Coding with Chrome editor.
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
goog.provide('cwc.ui.SettingScreen');

goog.require('cwc.soy.ui.SettingScreen');
goog.require('cwc.utils.Helper');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.soy');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 */
cwc.ui.SettingScreen = function(helper) {
  /** @type {string} */
  this.name = 'SettingsScreen';

  /** @type {Element} */
  this.node = null;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('setting-screen');
};


/**
 * Decorates the given node and adds the settings.
 * @param {Element} node The target node to add the settings.
 */
cwc.ui.SettingScreen.prototype.decorate = function(node) {
  this.node = node;

  // Supported languages
  let languages = ['eng'];
  let i18nInstance = this.helper.getInstance('i18n');
  if (i18nInstance) {
    languages = i18nInstance.getSupportedLanguages();
  }

  goog.soy.renderElement(
      this.node,
      cwc.soy.ui.SettingScreen.template, {
        'prefix': this.prefix,
        'languages': languages,
      }
  );

  let userConfigInstance = this.helper.getInstance('userConfig');
  let advancedMode = goog.dom.getElement(this.prefix + 'advanced-mode');
  let closeButton = goog.dom.getElement(this.prefix + 'close');
  let setLanguage = goog.dom.getElement(this.prefix + 'language');
  let showWelcome = goog.dom.getElement(this.prefix + 'show-welcome');

  showWelcome.checked = !userConfigInstance.get(cwc.userConfigType.GENERAL,
            cwc.userConfigName.SKIP_WELCOME);
  advancedMode.disabled = showWelcome.checked;

  goog.events.listen(closeButton, goog.events.EventType.CLICK,
     this.hide, false, this);

  goog.events.listen(showWelcome, goog.events.EventType.CHANGE,
    function(opt_event) {
      advancedMode.disabled = showWelcome.checked;
      userConfigInstance.set(cwc.userConfigType.GENERAL,
        cwc.userConfigName.SKIP_WELCOME, !showWelcome.checked);
    }, false, this);

  goog.events.listen(setLanguage, goog.events.EventType.CLICK,
    function(event) {
      let value = event.target.firstChild.data;
      userConfigInstance.set(cwc.userConfigType.GENERAL,
        cwc.userConfigName.LANGUAGE, value);
    }, false, this);

  this.setUserConfig();
};


/**
 * Shows settings screen.
 */
cwc.ui.SettingScreen.prototype.show = function() {
  let guiInstance = this.helper.getInstance('gui', true);
  this.decorate(guiInstance.getSettingsNode());
  guiInstance.showSettings(true);
};


/**
 * Hides settings screen.
 */
cwc.ui.SettingScreen.prototype.hide = function() {
  this.helper.getInstance('gui').showSettings(false);
};


cwc.ui.SettingScreen.prototype.setUserConfig = function() {
  // General settings
  this.setConfig_('advanced-mode', cwc.userConfigType.GENERAL,
    cwc.userConfigName.ADVANCED_MODE);
  this.setConfig_('fullscreen', cwc.userConfigType.GENERAL,
    cwc.userConfigName.FULLSCREEN);

  // Robots modules
  this.setConfig_('mode-lego', cwc.userConfigType.MODULE,
    cwc.userConfigName.LEGO);
  this.setConfig_('mode-sphero', cwc.userConfigType.MODULE,
    cwc.userConfigName.SPHERO);
  this.setConfig_('mode-makeblock', cwc.userConfigType.MODULE,
    cwc.userConfigName.MAKEBLOCK);

  // programming language modules
  this.setConfig_('mode-javascript', cwc.userConfigType.MODULE,
    cwc.userConfigName.JAVASCRIPT);
  this.setConfig_('mode-coffeescript', cwc.userConfigType.MODULE,
    cwc.userConfigName.COFFEESCRIPT);
  this.setConfig_('mode-python', cwc.userConfigType.MODULE,
    cwc.userConfigName.PYTHON);
  this.setConfig_('mode-pencil_code', cwc.userConfigType.MODULE,
    cwc.userConfigName.PENCIL_CODE);

  // Markup language
  this.setConfig_('mode-html5', cwc.userConfigType.MODULE,
    cwc.userConfigName.HTML5);

  // Editor settings
  this.setConfig_('auto-complete', cwc.userConfigType.EDITOR,
    cwc.userConfigName.AUTO_COMPLETE);

  // Misc settings
  this.setConfig_('experimental-mode', cwc.userConfigType.GENERAL,
    cwc.userConfigName.EXPERIMENTAL_MODE);
  this.setConfig_('debug-mode', cwc.userConfigType.GENERAL,
    cwc.userConfigName.DEBUG_MODE);
  this.setConfig_('workbench-fetch', cwc.userConfigType.GENERAL,
    cwc.userConfigName.WORKBENCH_FETCH);
};


/**
 * @param {!string} id
 * @param {!cwc.userConfigType|string} type
 * @param {!cwc.userConfigName|string} name
 * @param {string=} optType
 * @param {Function=} optFunc
 */
cwc.ui.SettingScreen.prototype.setConfig_ = function(id, type, name,
    optType, optFunc) {
  let userConfigInstance = this.helper.getInstance('userConfig');
  let settingNode = goog.dom.getElement(this.prefix + id);
  let status = userConfigInstance.get(type, name);
  if (status !== null) {
    settingNode.checked = status;
  }
  if (optFunc) {
    goog.events.listen(settingNode, goog.events.EventType.CHANGE, optFunc,
      false, this);
  } else {
    switch (optType) {
      case 'select':
        goog.events.listen(settingNode, goog.events.EventType.CLICK,
          function(event) {
            userConfigInstance.set(type, name, event.target.firstChild.data);
          }, false, this);
        break;
      default:
        goog.events.listen(settingNode, goog.events.EventType.CHANGE,
          function(opt_event) {
            userConfigInstance.set(type, name, settingNode.checked);
          }, false, this);
    }
  }
};
