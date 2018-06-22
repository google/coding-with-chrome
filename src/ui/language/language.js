/**
 * @fileoverview Language Select Screen.
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
goog.provide('cwc.ui.Language');

goog.require('cwc.soy.ui.Language');
goog.require('cwc.utils.Events');
goog.require('cwc.utils.I18n');
goog.require('cwc.utils.Logger');
goog.require('cwc.utils.Resources');


/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 */
cwc.ui.Language = function(helper) {
  /** @type {string} */
  this.name = 'Language';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('language');

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  /** @private {!cwc.utils.Events} */
  this.events_ = new cwc.utils.Events(this.name, this.prefix, this);
};


/**
 * Opens dialog to let user select an different language.
 */
cwc.ui.Language.prototype.selectLanguage = function() {
  this.events_.clear();
  this.helper.getInstance('dialog').showTemplate(
    'Please select your language',
    cwc.soy.ui.Language.template, {
      prefix: this.prefix,
      language: this.getUserLanguage(),
      languages: this.getSupportedLanguages(),
      languageEnglishMap: cwc.utils.I18n.getEnglishName(),
      languageNativeMap: cwc.utils.I18n.getNativeName(),
    });

  this.events_.listen('list', goog.events.EventType.CLICK, (e) => {
    if (!e || e.target.type !== 'radio') {
      return;
    }
    this.setLanguage(e.target.value);
  });
};


/**
 * @param {string} language
 * @async
 */
cwc.ui.Language.prototype.setLanguage = async function(language) {
  if (!language) {
    return;
  }

  if (language.length !== 3) {
    this.log_.warn('Unsupported language', language);
    return;
  }
  this.log_.info('Setting user language to', language);

  // Blockly language file
  let blocklyLanguageFile = 'external/blockly/msg/' +
    cwc.utils.I18n.getISO639_1(language) + '.js';
  this.log_.info('Loading Blockly language file', blocklyLanguageFile);
  await cwc.utils.Resources.getUriAsJavaScriptTag(
    blocklyLanguageFile, 'blockly-language');

  // CWC language file
  let cwcLanguageFile = 'js/locales/' + language + '.js';
  this.log_.info('Loading Blockly language file', cwcLanguageFile);
  await cwc.utils.Resources.getUriAsJavaScriptTag(
    cwcLanguageFile, 'cwc-i18n-language');

  // Setting language for i18n instance
  let i18nInstance = this.helper.getInstance('i18n');
  if (i18nInstance) {
    i18nInstance.setLanguage(language);
  }

  // Store language in the user config.
  let userConfigInstance = this.helper.getInstance('userConfig');
  if (userConfigInstance) {
    let userLanguage = userConfigInstance.get(cwc.userConfigType.GENERAL,
      cwc.userConfigName.LANGUAGE);
    if (userLanguage !== language) {
      userConfigInstance.set(cwc.userConfigType.GENERAL,
        cwc.userConfigName.LANGUAGE, language);
    }
  }

  // Update menu_bar icon.
  let menuBarInstance = this.helper.getInstance('menuBar');
  if (menuBarInstance) {
    menuBarInstance.setLanguage(language);
  }

  // Redirect to Select screen
  let selectScreenInstance = this.helper.getInstance('selectScreen');
  if (selectScreenInstance) {
    selectScreenInstance.requestShowSelectScreen(null, true);
  }
};


/**
 * @return {string}
 */
cwc.ui.Language.prototype.getUserLanguage = function() {
  let language = '';

  let userConfigInstance = this.helper.getInstance('userConfig');
  if (userConfigInstance) {
    language = userConfigInstance.get(cwc.userConfigType.GENERAL,
      cwc.userConfigName.LANGUAGE);
  }

  let i18nInstance = this.helper.getInstance('i18n');
  if (!language && i18nInstance) {
    language = i18nInstance.getLanguage();
  }

  if (!language || language.length !== 3) {
    this.log_.warn('Unsupported language', language, 'using',
      cwc.config.Default.LANGUAGE, 'instead!');
    if (userConfigInstance) {
      userConfigInstance.set(cwc.userConfigType.GENERAL,
        cwc.userConfigName.LANGUAGE, cwc.config.Default.LANGUAGE);
    }
    language = cwc.config.Default.LANGUAGE;
  }

  return language;
};


/**
 * @return {!Array}
 */
cwc.ui.Language.prototype.getSupportedLanguages = function() {
  let i18nInstance = this.helper.getInstance('i18n');
  if (i18nInstance) {
    return i18nInstance.getSupportedLanguages();
  }
  return ['eng'];
};
