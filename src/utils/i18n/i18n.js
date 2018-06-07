/**
 * @fileoverview Internationalization and localization (i18n).
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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
goog.provide('cwc.utils.I18n');

goog.require('cwc.utils.I18nMapping');
goog.require('cwc.utils.Logger');


/**
 * Helper for i18n.
 * @constructor
 * @final
 * @export
 */
cwc.utils.I18n = function() {
  /** @type {!string} */
  this.name = 'i18n';

  /** @type {!string} */
  this.language = '';

  /** @type {!string} */
  this.fallbackLanguage = 'eng';

  /** @type {!Array} */
  this.supportedLanguages = [this.fallbackLanguage];

  /** @type {!Object} */
  this.untranslated = {};

  /** @type {!Object} */
  this.usage = {};

  /** @private {!cwc.utils.Logger} */
  this.log_ = new cwc.utils.Logger(this.name);

  this.prepare_();
};


/**
 * @private
 */
cwc.utils.I18n.prototype.prepare_ = function() {
  // Register global Locales variable if needed.
  window['Locales'] = window['Locales'] || {};
  window['Locales']['blacklist'] = window['Locales']['blacklist'] || [];
  window['Locales']['supportedLanguages'] =
    window['Locales']['supportedLanguages'] || [];

  // Register global handler
  window['i18t'] = this.translate.bind(this);
  window['i18soy'] = this.translate.bind(this);

  this.setSupportedLanguages();
  this.setLanguage();
};


/**
 * Translate the given text to the current language.
 * @param {!string} key
 * @param {string=} text
 * @return {!string}
 * @deprecated
 */
cwc.utils.I18n.prototype.translateOld = function(key, text = '') {
  if (!Locales || !Locales[this.language] ||
      typeof Locales['blacklist'][key] !== 'undefined') {
    return text || key;
  }

  if (typeof Locales[this.language][key] === 'undefined') {
    return text || key;
  }

  return Locales[this.language][key];
};


/**
 * Translate the given translation Key to the current language.
 * @param {!string} translationKey
 * @param {Object=} values
 * @return {!string}
 */
cwc.utils.I18n.prototype.translate = function(translationKey, values) {
  // Handle soy template specific format
  if (values && /^\{\$\w+\}$/.test(translationKey)) {
    let soyKey = translationKey.substr(2, translationKey.length - 3);
    if (typeof values[soyKey]['content'] !== 'undefined') {
      translationKey = values[soyKey]['content'];
      values = null;
    }
  }

  // Handle old translation during migration.
  if (!translationKey.startsWith('@@')) {
    return this.translateOld(translationKey, values);
  }

  let [group, key] = translationKey.substr(2).split('__', 2);
  if (!Locales || !Locales[this.language]) {
    this.log_.error('Language', this.language, 'is unsupported!');
    return translationKey;
  }

  if (!Locales[this.language][group]) {
    this.log_.error('Group', group, 'is unknown!');
    return translationKey;
  }

  if (!Locales[this.language][group][key]) {
    this.log_.warn('Untranslated Key', translationKey);
    return translationKey;
  }

  // Handle variable macro values
  if (values) {
    return Locales[this.language][group][key].replace(/\{\$([^}]+)}/g,
      function(match, key) {
        return (values != null && key in values) ? values[key] : match;
      }
    );
  }

  return Locales[this.language][group][key];
};


/**
 * @return {!string} language in ISO639_3
 */
cwc.utils.I18n.prototype.getLanguage = function() {
  if (this.language) {
    return this.language;
  }
  if (typeof navigator !== 'undefined' && navigator['language']) {
    this.log_.info('Detected user browser language', navigator['language']);
    return cwc.utils.I18n.bcp47ToISO639_3(navigator['language']);
  }
  if (typeof chrome !== 'undefined' && chrome.i18n) {
    this.log_.info('Detected chrome language', chrome.i18n.getUILanguage());
    return cwc.utils.I18n.bcp47ToISO639_3(chrome.i18n.getUILanguage());
  }
  if (this.fallbackLanguage) {
    this.log_.info('Using fallback language', this.fallbackLanguage);
    return this.fallbackLanguage;
  }
};


/**
 * @param {string=} language
 * @return {!string}
 */
cwc.utils.I18n.prototype.setLanguage = function(language = '') {
  if (this.language === language) {
    return;
  }
  this.language = language || this.getLanguage();
  this.log_.info('Set language to', this.language);
  if (!Locales) {
    this.log_.error('Global variable "Locales" is undefined.');
  } else if (Locales && Object.keys(Locales).length == 0) {
    this.log_.error('Unable to find any language file.');
  } else if (!Locales[this.language] &&
             !Locales['supportedLanguages'].includes(this.language)) {
    this.log_.error('Language', this.language, 'is untranslated.');
  }
  return this.language;
};


/**
 * @return {Array}
 */
cwc.utils.I18n.prototype.getSupportedLanguages = function() {
  return this.supportedLanguages;
};


/**
 * @param {Array=} languages
 */
cwc.utils.I18n.prototype.setSupportedLanguages = function(languages) {
  this.supportedLanguages = languages || Locales['supportedLanguages'];
};


/**
 * @param {!string} language
 * @return {string}
 */
cwc.utils.I18n.getISO639_1 = function(language) {
  if (language.length === 2) {
    return language;
  }

  if (cwc.utils.I18nMapping.ISO639_3[language]) {
    return cwc.utils.I18nMapping.ISO639_3[language];
  }

  return '';
};


/**
 * @param {!string} language
 * @return {!string}
 */
cwc.utils.I18n.bcp47ToISO639_3 = function(language) {
  return cwc.utils.I18nMapping.BCP47[language] || '';
};


/**
 * @return {!Object}
 */
cwc.utils.I18n.getEnglishName = function() {
  return cwc.utils.I18nMapping.englishName;
};


/**
 * @return {!Object}
 */
cwc.utils.I18n.getNativeName = function() {
  return cwc.utils.I18nMapping.nativeName;
};
