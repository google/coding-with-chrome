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

  goog.soy.renderElement(
      this.node,
      cwc.soy.ui.SettingScreen.template,
      {'prefix': this.prefix}
  );

  var userConfigInstance = this.helper.getInstance('userConfig');
  var advancedMode = goog.dom.getElement(this.prefix + 'advanced-mode');
  var closeButton = goog.dom.getElement(this.prefix + 'close');
  var setLanguage = goog.dom.getElement(this.prefix + 'language');
  var showWelcome = goog.dom.getElement(this.prefix + 'show-welcome');

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
      var value = event.target.firstChild.data;
      userConfigInstance.set(cwc.userConfigType.GENERAL,
        cwc.userConfigName.LANGUAGE, value);
    }, false, this);

  // General settings
  this.setConfig_('advanced-mode', cwc.userConfigType.GENERAL,
    cwc.userConfigName.ADVANCED_MODE);
  this.setConfig_('fullscreen', cwc.userConfigType.GENERAL,
    cwc.userConfigName.FULLSCREEN);

  // Misc Settings
  this.setConfig_('experimental-mode', cwc.userConfigType.GENERAL,
    cwc.userConfigName.EXPERIMENTAL_MODE);
  this.setConfig_('debug-mode', cwc.userConfigType.GENERAL,
    cwc.userConfigName.DEBUG_MODE);

  // Robots modules
  this.setConfig_('mode-ev3', cwc.userConfigType.MODULE,
    cwc.userConfigName.EV3);
  this.setConfig_('mode-sphero', cwc.userConfigType.MODULE,
    cwc.userConfigName.SPHERO);
  this.setConfig_('mode-mbot-blue', cwc.userConfigType.MODULE,
    cwc.userConfigName.MBOT_BLUE);
  this.setConfig_('mode-mbot-ranger', cwc.userConfigType.MODULE,
    cwc.userConfigName.MBOT_RANGER);

  // Programming language modules
  this.setConfig_('mode-javascript', cwc.userConfigType.MODULE,
    cwc.userConfigName.JAVASCRIPT);
  this.setConfig_('mode-coffeescript', cwc.userConfigType.MODULE,
    cwc.userConfigName.COFFEESCRIPT);
  this.setConfig_('mode-python', cwc.userConfigType.MODULE,
    cwc.userConfigName.PYTHON);
  this.setConfig_('mode-pencil_code', cwc.userConfigType.MODULE,
    cwc.userConfigName.PENCIL_CODE);

  // Markup Language
  this.setConfig_('mode-html5', cwc.userConfigType.MODULE,
    cwc.userConfigName.HTML5);
};


/**
 * Shows settings screen.
 */
cwc.ui.SettingScreen.prototype.show = function() {
  var layoutInstance = this.helper.getInstance('layout', true);
  var overlayNode = layoutInstance.getOverlay();
  this.decorate(overlayNode);
  layoutInstance.showOverlay(true);
};


/**
 * Hides settings screen.
 */
cwc.ui.SettingScreen.prototype.hide = function() {
  var layoutInstance = this.helper.getInstance('layout', true);
  layoutInstance.showOverlay(false);
};


/**
 * @param {!string} id
 * @param {!cwc.userConfigType|string} type
 * @param {!cwc.userConfigName|string} name
 * @param {string=} opt_type
 * @param {Function=} opt_func
 */
cwc.ui.SettingScreen.prototype.setConfig_ = function(id, type, name,
    opt_type, opt_func) {
  var userConfigInstance = this.helper.getInstance('userConfig');
  var settingNode = goog.dom.getElement(this.prefix + id);
  var status = userConfigInstance.get(type, name);
  if (status !== null) {
    settingNode.checked = status;
  }
  if (opt_func) {
    goog.events.listen(settingNode, goog.events.EventType.CHANGE, opt_func,
      false, this);
  } else {
    switch (opt_type) {
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
